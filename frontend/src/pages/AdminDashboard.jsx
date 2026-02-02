// src/pages/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  VStack,
  Spinner,
  Center,
  useToast,
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
  Text,
  Button,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import LinkParentToChild from '../components/admin/LinkParentToChild';

const MotionBox = motion(Box);

const AdminDashboard = () => {
  const toast = useToast();
  const [users, setUsers] = useState([]);
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Not authenticated');

        const [usersRes, childrenRes] = await Promise.all([
          fetch(const API = import.meta.env.VITE_API_URL;
fetch(`${API}/api/...`)
/api/admin/users', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch('const API = import.meta.env.VITE_API_URL;
fetch(`${API}/api/...`)
/api/admin/children', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!usersRes.ok || !childrenRes.ok) {
          throw new Error('Failed to load data');
        }

        const usersData = await usersRes.json();
        const childrenData = await childrenRes.json();

        setUsers(usersData);
        setChildren(childrenData);
      } catch (err) {
        setError(err.message);
        toast({
          title: 'Error',
          description: err.message,
          status: 'error',
          duration: 6000,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  if (loading) {
    return (
      <Box minH="100vh" bg="brand.lightBg">
        <Header />
        <Center h="80vh">
          <VStack spacing={4}>
            <Spinner size="xl" thickness="4px" color="brand.primary" />
            <Text>Loading admin dashboard...</Text>
          </VStack>
        </Center>
        <Footer />
      </Box>
    );
  }

  if (error) {
    return (
      <Box minH="100vh" bg="brand.lightBg">
        <Header />
        <Container maxW="container.md" py={20} textAlign="center">
          <Text fontSize="xl" color="red.500">Error: {error}</Text>
          <Button mt={6} colorScheme="blue" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </Container>
        <Footer />
      </Box>
    );
  }

  return (
    <Box minH="100vh" bg="brand.lightBg">
      <Header />
      <Container maxW="container.xl" py={10}>
        <MotionBox
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <VStack spacing={10}>
            <Heading size="2xl" color="brand.primary" textAlign="center">
              Admin Dashboard
            </Heading>

            <Tabs w="full" variant="enclosed" colorScheme="blue">
              <TabList>
                <Tab>Link Parents & Upload Photos</Tab>
                <Tab>Manage Users</Tab>
                <Tab>Children Overview</Tab>
                <Tab>Announcements & Gallery</Tab>
              </TabList>

              <TabPanels>
                <TabPanel>
                  <LinkParentToChild />
                </TabPanel>

                <TabPanel>
                  <Heading size="md" mb={6}>All Users</Heading>
                  <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                    {users.map((u) => (
                      <Card key={u._id} variant="outline">
                        <CardHeader>
                          <Heading size="md">{u.name || u.username}</Heading>
                        </CardHeader>
                        <CardBody>
                          <Text><strong>Role:</strong> {u.role}</Text>
                          <Text><strong>Email:</strong> {u.email}</Text>
                          {/* Add edit/delete buttons later */}
                        </CardBody>
                      </Card>
                    ))}
                  </SimpleGrid>
                </TabPanel>

                <TabPanel>
                  <Heading size="md" mb={6}>All Children</Heading>
                  <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                    {children.map((c) => (
                      <Card key={c._id} variant="outline">
                        <CardHeader>
                          <Heading size="md">{c.name}</Heading>
                        </CardHeader>
                        <CardBody>
                          <Text><strong>Class:</strong> {c.classGroup || 'N/A'}</Text>
                          <Text><strong>Parents:</strong> {c.parents?.map(p => p.name).join(', ') || 'None'}</Text>
                        </CardBody>
                      </Card>
                    ))}
                  </SimpleGrid>
                </TabPanel>

                <TabPanel>
                  <Heading size="md" mb={6}>Post Announcements & Upload Media</Heading>
                  <VStack spacing={6} align="stretch">
                    <Input placeholder="Announcement Title" />
                    <Textarea placeholder="Announcement Content" rows={4} />
                    <Button colorScheme="blue">Post Announcement</Button>
                    <Button colorScheme="green">Upload to Gallery</Button>
                  </VStack>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </VStack>
        </MotionBox>
      </Container>
      <Footer />
    </Box>
  );
};

export default AdminDashboard;