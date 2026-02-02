// src/pages/ChildDashboard.jsx
import React, { useState, useEffect, useContext } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Avatar,
  VStack,
  Spinner,
  Center,
  useToast,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { AuthContext } from '../contexts/AuthContext';
import { useParams, useNavigate } from 'react-router-dom';
import VideoCorner from '../components/home/VideoSection'; 

const MotionBox = motion(Box);

const ChildDashboard = () => {
  const { user } = useContext(AuthContext);
  const { childId } = useParams(); // from URL: /dashboard/child/:childId
  const navigate = useNavigate();
  const toast = useToast();

  const [child, setChild] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChild = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Not authenticated');

        const res = await fetch(const API = import.meta.env.VITE_API_URL;
fetch(`${API}/api/...)
/api/child/${childId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.msg || 'Failed to load child data');
        }

        const data = await res.json();
        setChild(data);
      } catch (err) {
        toast({
          title: 'Error',
          description: err.message,
          status: 'error',
          duration: 5000,
        });
        navigate('/dashboard/select-child');
      } finally {
        setLoading(false);
      }
    };

    fetchChild();
  }, [childId, navigate, toast]);

  if (loading) {
    return (
      <Center minH="100vh">
        <Spinner size="xl" thickness="4px" color="brand.primary" />
      </Center>
    );
  }

  if (!child) {
    return (
      <Container maxW="container.md" py={20} textAlign="center">
        <Heading size="xl" color="red.500">
          Child not found
        </Heading>
        <Button mt={6} colorScheme="blue" onClick={() => navigate('/dashboard/select-child')}>
          Back to Selection
        </Button>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={10}>
      <MotionBox
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <VStack spacing={8}>
          {/* Child Header */}
          <Flex direction={{ base: 'column', md: 'row' }} align="center" gap={8} w="full">
            <Avatar
              src={child.photo}
              size="2xl"
              border="6px solid"
              borderColor="brand.primary"
              boxShadow="xl"
            />
            <VStack align={{ base: 'center', md: 'start' }} spacing={2}>
              <Heading size="2xl" color="brand.primary">
                {child.name}'s Dashboard
              </Heading>
              <Text fontSize="lg" color="gray.600">
                {child.classGroup} • Age {child.age || '?'}
              </Text>
              <Text fontSize="md" color="gray.500">
                Parent: {user?.name || 'You'}
              </Text>
            </VStack>
          </Flex>

          {/* Tabs for different sections */}
          <Tabs variant="enclosed" colorScheme="blue" w="full">
            <TabList>
              <Tab>Daily Report</Tab>
              <Tab>Attendance</Tab>
              <Tab>Photos & Videos</Tab>
              <Tab>Messages</Tab>
              <Tab>Invoices</Tab>
            </TabList>

            <TabPanels>
              <TabPanel>
                <VStack spacing={6} align="start">
                  <Heading size="md">Today's Report</Heading>
                  <Text>Meals: Ate well! 😊</Text>
                  <Text>Sleep: 2-hour nap</Text>
                  <Text>Mood: Happy</Text>
                  {/* Add chart or more details later */}
                </VStack>
              </TabPanel>

              <TabPanel>
                <Text>Attendance this week: 5/5 days present</Text>
                {/* Add calendar or list */}
              </TabPanel>

              <TabPanel>
                <VideoCorner videos={videos} /> {/* Reuse your video component */}
              </TabPanel>

              <TabPanel>
                <Text>Messages with teacher coming soon...</Text>
              </TabPanel>

              <TabPanel>
                <Text>Invoices & payments coming soon...</Text>
              </TabPanel>
            </TabPanels>
          </Tabs>

          <Button colorScheme="blue" onClick={() => navigate('/dashboard/select-child')}>
            Switch Child
          </Button>
        </VStack>
      </MotionBox>
    </Container>
  );
};

export default ChildDashboard;