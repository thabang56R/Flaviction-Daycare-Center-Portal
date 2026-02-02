// src/components/admin/LinkParentToChild.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  Select,
  Input,
  Button,
  VStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  useToast,
  Spinner,
  Image,
  HStack,
  IconButton,
} from '@chakra-ui/react';
import { AddIcon, EditIcon, DeleteIcon } from '@chakra-ui/icons';

const LinkParentToChild = () => {
  const [parents, setParents] = useState([]);
  const [children, setChildren] = useState([]);
  const [selectedParent, setSelectedParent] = useState('');
  const [selectedChild, setSelectedChild] = useState('');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No authentication token');

        const [parentsRes, childrenRes] = await Promise.all([
          fetch('http://localhost:5000/api/admin/users?parent=true', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch('http://localhost:5000/api/admin/children', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!parentsRes.ok || !childrenRes.ok) {
          throw new Error('Failed to fetch data');
        }

        const parentsData = await parentsRes.json();
        const childrenData = await childrenRes.json();

        setParents(parentsData);
        setChildren(childrenData);
      } catch (err) {
        toast({
          title: 'Error loading data',
          description: err.message,
          status: 'error',
          duration: 5000,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const uploadPhoto = async () => {
    if (!file || !selectedChild) {
      toast({ title: 'Select a child and a photo', status: 'warning' });
      return;
    }

    const formData = new FormData();
    formData.append('photo', file);
    formData.append('childId', selectedChild);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/child/upload-photo', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.msg || 'Upload failed');
      }

      toast({ title: 'Photo uploaded successfully', status: 'success' });
      setFile(null);
      setPreview('');
      // Optional: refresh children list
      window.location.reload();
    } catch (err) {
      toast({
        title: 'Upload error',
        description: err.message,
        status: 'error',
        duration: 5000,
      });
    }
  };

  const handleLink = async () => {
    if (!selectedParent || !selectedChild) {
      toast({ title: 'Select both parent and child', status: 'warning' });
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/admin/link-parent-child', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ parentId: selectedParent, childId: selectedChild }),
      });

      if (!res.ok) throw new Error('Failed to link');
      toast({ title: 'Parent linked to child', status: 'success' });

      // Refresh lists
      window.location.reload();
    } catch (err) {
      toast({ title: 'Error linking', description: err.message, status: 'error' });
    }
  };

  if (loading) return <Spinner size="xl" mt={10} />;

  return (
    <Box p={8}>
      <Heading size="lg" mb={8} color="brand.primary">
        Admin: Link Parents to Children & Upload Photos
      </Heading>

      <VStack spacing={8} mb={12} align="stretch">
        {/* Link Parent to Child */}
        <Box p={6} borderWidth="1px" borderRadius="lg" boxShadow="md">
          <Heading size="md" mb={4}>Link Parent to Child</Heading>
          <HStack spacing={6} align="flex-end">
            <FormControl flex={1}>
              <FormLabel>Select Parent</FormLabel>
              <Select
                placeholder="Choose parent"
                value={selectedParent}
                onChange={(e) => setSelectedParent(e.target.value)}
              >
                {parents.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name} ({p.email}) - {p.role}
                  </option>
                ))}
              </Select>
            </FormControl>

            <FormControl flex={1}>
              <FormLabel>Select Child</FormLabel>
              <Select
                placeholder="Choose child"
                value={selectedChild}
                onChange={(e) => setSelectedChild(e.target.value)}
              >
                {children.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name} ({c.classGroup || 'No class'})
                  </option>
                ))}
              </Select>
            </FormControl>

            <Button
              colorScheme="blue"
              onClick={handleLink}
              isDisabled={!selectedParent || !selectedChild}
            >
              Link Now
            </Button>
          </HStack>
        </Box>

        {/* Upload Child Photo */}
        <Box p={6} borderWidth="1px" borderRadius="lg" boxShadow="md">
          <Heading size="md" mb={4}>Upload Child Profile Photo</Heading>
          <VStack spacing={4} align="stretch">
            <FormControl>
              <FormLabel>Select Child</FormLabel>
              <Select
                placeholder="Choose child for photo upload"
                value={selectedChild}
                onChange={(e) => setSelectedChild(e.target.value)}
              >
                {children.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name} ({c.classGroup || 'No class'})
                  </option>
                ))}
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>Choose Photo</FormLabel>
              <Input type="file" accept="image/*" onChange={handleFileChange} />
            </FormControl>

            {preview && (
              <Box borderWidth="2px" borderStyle="dashed" borderRadius="lg" p={4} textAlign="center">
                <Image
                  src={preview}
                  alt="Preview"
                  boxSize="200px"
                  objectFit="cover"
                  borderRadius="full"
                  mx="auto"
                />
                <Text mt={2} fontSize="sm" color="gray.600">
                  Preview
                </Text>
              </Box>
            )}

            <Button
              colorScheme="green"
              onClick={uploadPhoto}
              isDisabled={!file || !selectedChild}
              leftIcon={<AddIcon />}
            >
              Upload Photo
            </Button>
          </VStack>
        </Box>
      </VStack>

      {/* Current Links Table */}
      <Heading size="md" mb={4}>Current Parent-Child Links</Heading>
      <TableContainer bg="white" borderRadius="lg" boxShadow="md">
        <Table variant="simple">
          <Thead bg="gray.100">
            <Tr>
              <Th>Child</Th>
              <Th>Parent(s)</Th>
              <Th>Class/Group</Th>
            </Tr>
          </Thead>
          <Tbody>
            {children
              .filter((c) => c.parents?.length > 0)
              .map((child) => (
                <Tr key={child._id}>
                  <Td>
                    <HStack>
                      <Avatar src={child.photo} size="sm" />
                      <Text>{child.name}</Text>
                    </HStack>
                  </Td>
                  <Td>{child.parents.map(p => p.name).join(', ')}</Td>
                  <Td>{child.classGroup || 'N/A'}</Td>
                </Tr>
              ))}
            {children.filter(c => c.parents?.length === 0).length > 0 && (
              <Tr>
                <Td colSpan={3} textAlign="center" color="gray.500">
                  No links yet for some children
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default LinkParentToChild;