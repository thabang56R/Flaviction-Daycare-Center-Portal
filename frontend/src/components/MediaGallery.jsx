// src/components/common/MediaGallery.jsx
import React, { useState } from 'react';
import {
  Box,
  Heading,
  SimpleGrid,
  Image,
  Button,
  Input,
  VStack,
  HStack,
  Text,
  IconButton,
  useToast,
  Progress,
  Flex,
} from '@chakra-ui/react';
import { AddIcon, DeleteIcon } from '@chakra-ui/icons';

const initialImages = [
  { id: 1, url: 'https://images.unsplash.com/photo-1588075592446-265fd1e6e76f?w=400', caption: 'Painting time' },
  { id: 2, url: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400', caption: 'Outdoor play' },
  { id: 3, url: 'https://images.unsplash.com/photo-1503454537195-1dcabb9d2a69?w=400', caption: 'Story circle' },
];

const MediaGallery = ({ role = 'teacher' }) => {
  const [images, setImages] = useState(initialImages);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const toast = useToast();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid file',
        description: 'Please select an image file',
        status: 'error',
        duration: 3000,
      });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = () => {
    if (!preview) return;

    setUploading(true);

    // Simulate upload delay
    setTimeout(() => {
      const newImage = {
        id: images.length + 1,
        url: preview,
        caption: 'New upload – ' + new Date().toLocaleDateString(),
      };

      setImages([newImage, ...images]);
      setPreview(null);
      setUploading(false);

      toast({
        title: 'Upload successful',
        description: 'New photo added to gallery',
        status: 'success',
        duration: 4000,
      });
    }, 1800);
  };

  const handleDelete = (id) => {
    setImages(images.filter((img) => img.id !== id));
    toast({
      title: 'Photo removed',
      status: 'info',
      duration: 3000,
    });
  };

  return (
    <Box>
      <Heading size="md" mb={6}>
        Media Gallery {role === 'admin' ? '(Admin View)' : '(Teacher View)'}
      </Heading>

      {/* Upload Section */}
      <VStack spacing={4} mb={10} align="stretch" p={6} bg="gray.50" borderRadius="lg">
        <Text fontWeight="medium">Upload new photo</Text>
        <Input type="file" accept="image/*" onChange={handleFileChange} />

        {preview && (
          <Box borderWidth="2px" borderStyle="dashed" borderRadius="lg" p={4} textAlign="center">
            <Image src={preview} alt="Preview" maxH="200px" mx="auto" borderRadius="md" />
            <Text mt={2} fontSize="sm" color="gray.600">
              Preview
            </Text>
          </Box>
        )}

        <HStack justify="flex-end">
          <Button
            leftIcon={<AddIcon />}
            colorScheme="blue"
            onClick={handleUpload}
            isLoading={uploading}
            loadingText="Uploading..."
            isDisabled={!preview || uploading}
          >
            Upload Photo
          </Button>
        </HStack>

        {uploading && <Progress size="xs" isIndeterminate mt={2} />}
      </VStack>

      {/* Gallery Grid */}
      <SimpleGrid columns={{ base: 2, md: 3, lg: 4 }} spacing={6}>
        {images.map((img) => (
          <Box
            key={img.id}
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            bg="white"
            boxShadow="sm"
            position="relative"
          >
            <Image src={img.url} alt={img.caption} w="100%" h="180px" objectFit="cover" />
            <Box p={3}>
              <Text fontSize="sm" noOfLines={2}>
                {img.caption}
              </Text>
            </Box>

            {/* Delete button – visible for admin/teacher */}
            <IconButton
              icon={<DeleteIcon />}
              position="absolute"
              top={2}
              right={2}
              size="sm"
              colorScheme="red"
              variant="solid"
              borderRadius="full"
              onClick={() => handleDelete(img.id)}
              aria-label="Delete photo"
            />
          </Box>
        ))}
      </SimpleGrid>

      {images.length === 0 && (
        <Text textAlign="center" color="gray.500" mt={10}>
          No photos yet. Upload your first one!
        </Text>
      )}
    </Box>
  );
};

export default MediaGallery;