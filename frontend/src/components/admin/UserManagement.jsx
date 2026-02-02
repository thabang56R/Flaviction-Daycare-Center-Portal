// src/components/admin/UserManagement.jsx
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
  Select,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon, AddIcon } from '@chakra-ui/icons';

const initialUsers = [
  { id: 1, name: 'Thandi Mokoena', email: 'thandi.parent@example.com', role: 'parent', status: 'Active' },
  { id: 2, name: 'Mr. Sipho Ndlovu', email: 'sipho.teacher@smiley.co.za', role: 'teacher', status: 'Active' },
  { id: 3, name: 'Admin User', email: 'admin@smiley.co.za', role: 'admin', status: 'Active' },
];

const UserManagement = () => {
  const [users, setUsers] = useState(initialUsers);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [formData, setFormData] = useState({ name: '', email: '', role: 'parent' });
  const [editingId, setEditingId] = useState(null);
  const toast = useToast();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (editingId) {
      // Edit
      setUsers(
        users.map((u) =>
          u.id === editingId ? { ...u, ...formData } : u
        )
      );
      toast({ title: 'User updated', status: 'success' });
    } else {
      // Add
      const newUser = {
        id: users.length + 1,
        ...formData,
        status: 'Active',
      };
      setUsers([...users, newUser]);
      toast({ title: 'User added', status: 'success' });
    }
    resetForm();
  };

  const handleEdit = (user) => {
    setFormData({ name: user.name, email: user.email, role: user.role });
    setEditingId(user.id);
    onOpen();
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this user?')) {
      setUsers(users.filter((u) => u.id !== id));
      toast({ title: 'User deleted', status: 'info' });
    }
  };

  const resetForm = () => {
    setFormData({ name: '', email: '', role: 'parent' });
    setEditingId(null);
    onClose();
  };

  return (
    <Box>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="md">User Management</Heading>
        <Button leftIcon={<AddIcon />} colorScheme="blue" onClick={onOpen}>
          Add New User
        </Button>
      </Flex>

      <TableContainer bg="white" borderRadius="lg" boxShadow="md">
        <Table variant="simple">
          <Thead bg="gray.100">
            <Tr>
              <Th>Name</Th>
              <Th>Email</Th>
              <Th>Role</Th>
              <Th>Status</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {users.map((user) => (
              <Tr key={user.id}>
                <Td>{user.name}</Td>
                <Td>{user.email}</Td>
                <Td>
                  <Box
                    as="span"
                    px={2}
                    py={1}
                    borderRadius="full"
                    bg={
                      user.role === 'admin'
                        ? 'purple.100'
                        : user.role === 'teacher'
                        ? 'blue.100'
                        : 'green.100'
                    }
                  >
                    {user.role}
                  </Box>
                </Td>
                <Td>
                  <Box as="span" color={user.status === 'Active' ? 'green.600' : 'red.600'}>
                    {user.status}
                  </Box>
                </Td>
                <Td>
                  <HStack spacing={2}>
                    <IconButton
                      icon={<EditIcon />}
                      size="sm"
                      variant="ghost"
                      colorScheme="blue"
                      onClick={() => handleEdit(user)}
                      aria-label="Edit user"
                    />
                    <IconButton
                      icon={<DeleteIcon />}
                      size="sm"
                      variant="ghost"
                      colorScheme="red"
                      onClick={() => handleDelete(user.id)}
                      aria-label="Delete user"
                    />
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>

      {/* Modal for Add/Edit */}
      <Modal isOpen={isOpen} onClose={resetForm}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{editingId ? 'Edit User' : 'Add New User'}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel>Full Name</FormLabel>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Thandi Mokoena"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Email</FormLabel>
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="thandi@example.com"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Role</FormLabel>
                <Select name="role" value={formData.role} onChange={handleInputChange}>
                  <option value="parent">Parent</option>
                  <option value="teacher">Teacher</option>
                  <option value="admin">Administrator</option>
                </Select>
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={resetForm}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={handleSubmit}>
              {editingId ? 'Save Changes' : 'Add User'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default UserManagement;