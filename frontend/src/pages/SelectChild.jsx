// src/pages/SelectChild.jsx
import React, { useState, useEffect, useContext } from 'react';
import {
  Box,
  Container,
  Heading,
  SimpleGrid,
  Text,
  VStack,
  Avatar,
  Button,
  Spinner,
  Center,
  useToast,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const MotionBox = motion(Box);

const SelectChild = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const toast = useToast();

  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChildren = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token');

        const res = await fetch('http://localhost:5000/api/child/my-children', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.msg || 'Failed to fetch children');
        }

        const data = await res.json();
        setChildren(data);

        // Auto-redirect if only one child
        if (data.length === 1) {
          localStorage.setItem('selectedChildId', data[0]._id);
          navigate(`/dashboard/child/${data[0]._id}`);
        }
      } catch (err) {
        toast({
          title: 'Error',
          description: err.message,
          status: 'error',
          duration: 5000,
        });
        navigate('/dashboard'); // or back to login if auth failed
      } finally {
        setLoading(false);
      }
    };

    fetchChildren();
  }, [navigate, toast]);

  if (loading) {
    return (
      <Center minH="100vh">
        <Spinner size="xl" thickness="4px" color="brand.primary" />
      </Center>
    );
  }

  if (children.length === 0) {
    return (
      <Container maxW="container.md" py={20} textAlign="center">
        <VStack spacing={8}>
          <Heading size="2xl" color="brand.primary">
            No Child Profile Linked
          </Heading>
          <Text fontSize="lg" color="gray.700">
            It looks like your child(ren) haven't been linked to your account yet.
          </Text>
          <Text fontSize="md" color="gray.600">
            Please contact your school office or teacher to get connected.
          </Text>
          <Button colorScheme="blue" onClick={() => navigate('/contact')}>
            Contact Us
          </Button>
        </VStack>
      </Container>
    );
  }

  return (
    <Container maxW="container.lg" py={16}>
      <VStack spacing={10}>
        <Heading size="2xl" color="brand.primary" textAlign="center">
          Welcome back, {user?.name || 'Parent'}!
        </Heading>

        <Text fontSize="xl" textAlign="center">
          Please select which child you'd like to view today
        </Text>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8} w="full">
          {children.map((child) => (
            <MotionBox
              key={child._id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              bg="white"
              borderRadius="2xl"
              overflow="hidden"
              boxShadow="lg"
              textAlign="center"
              whileHover={{ y: -10, boxShadow: '2xl' }}
              cursor="pointer"
              onClick={() => {
                localStorage.setItem('selectedChildId', child._id);
                navigate(`/dashboard/child/${child._id}`);
              }}
            >
              <Flex justify="center" mt={-12}>
                <Avatar
                  src={child.photo || 'https://via.placeholder.com/150?text=Child'}
                  size="2xl"
                  border="8px solid white"
                  boxShadow="xl"
                />
              </Flex>

              <Box p={8} pt={16}>
                <Heading size="lg" mb={2} color="brand.primary">
                  {child.name}
                </Heading>
                <Text fontSize="md" color="gray.600" mb={4}>
                  {child.classGroup || 'Unknown Group'} • Age {child.age || '?'}
                </Text>
                <Button colorScheme="blue" size="md">
                  View Dashboard
                </Button>
              </Box>
            </MotionBox>
          ))}
        </SimpleGrid>
      </VStack>
    </Container>
  );
};

export default SelectChild;