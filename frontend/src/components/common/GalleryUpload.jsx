// src/components/common/GalleryUpload.jsx
import React, { useState } from 'react';
import {
  Box,
  Heading,
  Input,
  Button,
  VStack,
  useToast,
  Image,
} from '@chakra-ui/react';

const GalleryUpload = ({ childId }) => {
  const toast = useToast();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const uploadPicture = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('photo', file);
    formData.append('childId', childId);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/child/upload-photo', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) throw new Error('Upload failed');
      toast({ title: 'Picture uploaded', status: 'success' });
      setFile(null);
      setPreview('');
    } catch (err) {
      toast({ title: 'Error', description: err.message, status: 'error' });
    }
  };

  return (
    <VStack spacing={6} align="stretch">
      <Heading size="md">Upload Picture to Gallery</Heading>
      <Input type="file" accept="image/*" onChange={handleFileChange} />
      {preview && <Image src={preview} alt="Preview" maxH="300px" objectFit="contain" />}
      <Button colorScheme="green" onClick={uploadPicture} isDisabled={!file}>
        Upload Picture
      </Button>
    </VStack>
  );
};

export default GalleryUpload;