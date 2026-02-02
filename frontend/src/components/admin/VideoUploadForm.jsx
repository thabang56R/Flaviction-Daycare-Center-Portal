// src/components/admin/VideoUploadForm.jsx
import React, { useState } from 'react';
import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  VStack,
  Image,
  useToast,
  Progress,
  Flex,
  Text,
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';

const VideoUploadForm = ({ onVideoAdded }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const toast = useToast();

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoFile(file);
      // Optional: generate thumbnail preview from video
      const url = URL.createObjectURL(file);
      setThumbnailPreview(url);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !videoFile) {
      toast({
        title: 'Missing fields',
        description: 'Please add a title and select a video file',
        status: 'warning',
        duration: 4000,
      });
      return;
    }

    setUploading(true);

    // Simulate upload (replace with real backend call later)
    setTimeout(() => {
      const newVideo = {
        id: Date.now(),
        title,
        description,
        thumbnail: thumbnailPreview || 'https://via.placeholder.com/600x338?text=New+Video',
        videoUrl: URL.createObjectURL(videoFile), // in real app → backend URL
      };

      // Callback to parent (e.g. to add to sampleVideos state)
      if (onVideoAdded) onVideoAdded(newVideo);

      toast({
        title: 'Video uploaded!',
        description: 'New video added to carousel',
        status: 'success',
        duration: 5000,
      });

      // Reset form
      setTitle('');
      setDescription('');
      setVideoFile(null);
      setThumbnailPreview(null);
      setUploading(false);
    }, 2000);
  };

  return (
    <Box p={8} bg="white" borderRadius="2xl" boxShadow="xl" maxW="600px" mx="auto">
      <Heading size="lg" mb={6} textAlign="center" color="brand.primary">
        Upload New Smiley Moment Video
      </Heading>

      <form onSubmit={handleSubmit}>
        <VStack spacing={6}>
          <FormControl isRequired>
            <FormLabel>Video Title</FormLabel>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Rainy Day Indoor Games"
            />
          </FormControl>

          <FormControl>
            <FormLabel>Description</FormLabel>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell us what happens in this happy moment..."
              rows={4}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Choose Video File</FormLabel>
            <Input
              type="file"
              accept="video/*"
              onChange={handleVideoChange}
              p={1}
            />
          </FormControl>

          {thumbnailPreview && (
            <Box borderWidth="2px" borderStyle="dashed" borderRadius="lg" p={4} w="full">
              <Text mb={2} fontWeight="medium" textAlign="center">
                Video Preview Thumbnail
              </Text>
              <Image
                src={thumbnailPreview}
                alt="Video preview"
                borderRadius="md"
                maxH="200px"
                mx="auto"
                objectFit="cover"
              />
            </Box>
          )}

          <Button
            type="submit"
            colorScheme="blue"
            size="lg"
            leftIcon={<AddIcon />}
            isLoading={uploading}
            loadingText="Uploading..."
            w="full"
          >
            Upload Video to Carousel
          </Button>

          {uploading && <Progress size="xs" isIndeterminate w="full" mt={2} />}
        </VStack>
      </form>
    </Box>
  );
};

export default VideoUploadForm;