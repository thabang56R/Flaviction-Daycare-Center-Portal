// src/pages/TeacherDashboard.jsx
import React, { useState, useEffect, useContext } from 'react';
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
  Button,
  Input,
  Textarea,
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
  useToast,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { AuthContext } from '../contexts/AuthContext';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

const MotionBox = motion(Box);

const TeacherDashboard = () => {
  const { user } = useContext(AuthContext);
  const toast = useToast();

  const [children, setChildren] = useState([]);
  const [announcement, setAnnouncement] = useState({ title: '', content: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch all children for teacher
    const fetchChildren = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(const API = import.meta.env.VITE_API_URL;
fetch(`${API}/api/...`)
/api/admin/children', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setChildren(data);
      } catch (err) {
        toast({ title: 'Error loading children', status: 'error' });
      } finally {
        setLoading(false);
      }
    };

    fetchChildren();
  }, [toast]);

  const handlePostAnnouncement = async () => {
    try {
      const token = localStorage.getItem('token');
      await fetch(const API = import.meta.env.VITE_API_URL;
fetch(`${API}/api/...`)
/api/announcements', 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(announcement),
      });
      toast({ title: 'Announcement posted', status: 'success' });
      setAnnouncement({ title: '', content: '' });
    } catch (err) {
      toast({ title: 'Error posting', status: 'error' });
    }
  };

  // Similar functions for kid info, pictures/videos, materials

  return (
    <Box>
      <Header />
      <Container maxW="container.xl" py={16}>
        <Heading mb={8}>Teacher Dashboard</Heading>

        <Tabs w="full" variant="enclosed" colorScheme="blue">
          <TabList>
            <Tab>Announcements</Tab>
            <Tab>Students</Tab>
            <Tab>Upload Materials</Tab>
            <Tab>Gallery Upload</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <VStack spacing={4} align="stretch">
                <Input placeholder="Title" value={announcement.title} onChange={(e) => setAnnouncement({ ...announcement, title: e.target.value })} />
                <Textarea placeholder="Content" value={announcement.content} onChange={(e) => setAnnouncement({ ...announcement, content: e.target.value })} />
                <Button colorScheme="blue" onClick={handlePostAnnouncement}>
                  Post Announcement
                </Button>
              </VStack>
            </TabPanel>

            <TabPanel>
              <Heading size="md" mb={4}>Student Info</Heading>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                {children.map((child) => (
                  <Card key={child._id}>
                    <CardHeader>
                      <Heading size="md">{child.name}</Heading>
                    </CardHeader>
                    <CardBody>
                      <Text>{child.classGroup}</Text>
                     
                    </CardBody>
                  </Card>
                ))}
              </SimpleGrid>
            </TabPanel>

            <TabPanel>
              <Heading size="md" mb={4}>Upload Teaching Materials</Heading>
             
            </TabPanel>
            
            <TabPanel>
            <GalleryUpload childId={selectedChild?._id} />
            </TabPanel>

            <TabPanel>
              <Heading size="md" mb={4}>Upload to Gallery</Heading>
              {/* Add picture/video upload form – use similar to uploadPhoto */}
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Container>
      <Footer />
    </Box>
  );
};

export default TeacherDashboard;