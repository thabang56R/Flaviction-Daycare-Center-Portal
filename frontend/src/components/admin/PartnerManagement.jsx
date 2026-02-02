// src/components/admin/PartnerManagement.jsx
import React, { useState } from 'react';
import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Button,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  useDisclosure,
  useToast,
  VStack,
  HStack,
  Image,
} from '@chakra-ui/react';
import { AddIcon, EditIcon, DeleteIcon } from '@chakra-ui/icons';

const initialPartners = [
  {
    id: 1,
    name: 'Toy Kingdom',
    logo: 'https://via.placeholder.com/220x100.png?text=Toy+Kingdom',
    url: 'https://toykingdom.co.za',
    description: 'Educational toys & learning resources',
  },
  // ... more
];

const PartnerManagement = () => {
  const [partners, setPartners] = useState(initialPartners);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [formData, setFormData] = useState({ name: '', logo: '', url: '', description: '' });
  const [editingId, setEditingId] = useState(null);
  const [logoPreview, setLogoPreview] = useState('');
  const toast = useToast();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'logo') {
      setLogoPreview(value);
    }
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.url) {
      toast({ title: 'Missing required fields', status: 'warning' });
      return;
    }

    if (editingId) {
      setPartners(
        partners.map((p) => (p.id === editingId ? { ...p, ...formData } : p))
      );
      toast({ title: 'Partner updated', status: 'success' });
    } else {
      const newPartner = {
        id: Date.now(),
        ...formData,
      };
      setPartners([...partners, newPartner]);
      toast({ title: 'Partner added', status: 'success' });
    }

    resetForm();
  };

  const handleEdit = (partner) => {
    setFormData(partner);
    setLogoPreview(partner.logo);
    setEditingId(partner.id);
    onOpen();
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this partner?')) {
      setPartners(partners.filter((p) => p.id !== id));
      toast({ title: 'Partner removed', status: 'info' });
    }
  };

  const resetForm = () => {
    setFormData({ name: '', logo: '', url: '', description: '' });
    setLogoPreview('');
    setEditingId(null);
    onClose();
  };

  return (
    <Box p={6}>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="lg">Manage Partners</Heading>
        <Button leftIcon={<AddIcon />} colorScheme="blue" onClick={onOpen}>
          Add New Partner
        </Button>
      </Flex>

      <TableContainer bg="white" borderRadius="lg" boxShadow="md">
        <Table variant="simple">
          <Thead bg="gray.100">
            <Tr>
              <Th>Logo</Th>
              <Th>Name</Th>
              <Th>Website</Th>
              <Th>Description</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {partners.map((partner) => (
              <Tr key={partner.id}>
                <Td>
                  <Image
                    src={partner.logo}
                    alt={partner.name}
                    boxSize="60px"
                    objectFit="contain"
                    borderRadius="md"
                  />
                </Td>
                <Td fontWeight="medium">{partner.name}</Td>
                <Td>
                  <ChakraLink href={partner.url} isExternal color="blue.600">
                    Visit site
                  </ChakraLink>
                </Td>
                <Td maxW="300px">
                  <Text noOfLines={2}>{partner.description}</Text>
                </Td>
                <Td>
                  <HStack spacing={2}>
                    <IconButton
                      icon={<EditIcon />}
                      size="sm"
                      variant="ghost"
                      colorScheme="blue"
                      onClick={() => handleEdit(partner)}
                      aria-label="Edit"
                    />
                    <IconButton
                      icon={<DeleteIcon />}
                      size="sm"
                      variant="ghost"
                      colorScheme="red"
                      onClick={() => handleDelete(partner.id)}
                      aria-label="Delete"
                    />
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>

      {/* Add/Edit Modal */}
      <Modal isOpen={isOpen} onClose={resetForm} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{editingId ? 'Edit Partner' : 'Add New Partner'}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={5}>
              <FormControl isRequired>
                <FormLabel>Partner Name</FormLabel>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g. Toy Kingdom"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Website URL</FormLabel>
                <Input
                  name="url"
                  value={formData.url}
                  onChange={handleInputChange}
                  placeholder="https://example.com"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Logo URL</FormLabel>
                <Input
                  name="logo"
                  value={formData.logo}
                  onChange={handleInputChange}
                  placeholder="https://example.com/logo.png"
                />
                {logoPreview && (
                  <Image
                    src={logoPreview}
                    alt="Logo preview"
                    mt={3}
                    maxH="100px"
                    objectFit="contain"
                    border="1px solid"
                    borderColor="gray.200"
                    borderRadius="md"
                  />
                )}
              </FormControl>

              <FormControl>
                <FormLabel>Description</FormLabel>
                <Textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Short description of how they support us..."
                  rows={4}
                />
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={resetForm}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={handleSubmit}>
              {editingId ? 'Save Changes' : 'Add Partner'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default PartnerManagement;