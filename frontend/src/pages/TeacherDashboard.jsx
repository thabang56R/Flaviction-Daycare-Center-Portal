// src/pages/TeacherDashboard.jsx
import React, { useState, useEffect } from "react";
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
  Spinner,
  Center,
  Text,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";

const MotionBox = motion(Box);

// ✅ env-based API
const API = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");

const TeacherDashboard = () => {
  const toast = useToast();

  const [children, setChildren] = useState([]);
  const [announcement, setAnnouncement] = useState({ title: "", body: "" }); // ✅ match backend (title, body)
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChildren = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Not authenticated");

        // If teachers should see all children, you can use /api/admin/children
        // But ideally create a /api/teacher/children later.
        const res = await fetch(`${API}/api/admin/children`, {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        });

        const data = await res.json().catch(() => []);

        if (!res.ok) {
          throw new Error(data.msg || data.message || "Failed to load children");
        }

        setChildren(Array.isArray(data) ? data : []);
      } catch (err) {
        toast({
          title: "Error loading children",
          description: err.message,
          status: "error",
          duration: 6000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchChildren();
  }, [toast]);

  const handlePostAnnouncement = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Not authenticated");

      if (!announcement.title.trim() || !announcement.body.trim()) {
        toast({
          title: "Missing fields",
          description: "Please enter a title and content.",
          status: "warning",
          duration: 4000,
          isClosable: true,
        });
        return;
      }

      const res = await fetch(`${API}/api/announcements`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: announcement.title,
          body: announcement.body,
          type: "info",
          audience: "all",
          pinned: false,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.msg || data.message || "Failed to post announcement");
      }

      toast({
        title: "Announcement posted",
        status: "success",
        duration: 4000,
        isClosable: true,
      });

      setAnnouncement({ title: "", body: "" });
    } catch (err) {
      toast({
        title: "Error posting announcement",
        description: err.message,
        status: "error",
        duration: 6000,
        isClosable: true,
      });
    }
  };

  return (
    <Box minH="100vh" bg="brand.lightBg">
      <Header />

      <Container maxW="container.xl" py={16}>
        <MotionBox initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Heading mb={8} color="brand.primary">
            Teacher Dashboard
          </Heading>

          {loading ? (
            <Center py={16}>
              <VStack spacing={4}>
                <Spinner size="xl" thickness="4px" color="brand.primary" />
                <Text>Loading learners...</Text>
              </VStack>
            </Center>
          ) : (
            <Tabs w="full" variant="enclosed" colorScheme="blue">
              <TabList>
                <Tab>Announcements</Tab>
                <Tab>Students</Tab>
                <Tab>Upload Materials</Tab>
                <Tab>Gallery Upload</Tab>
              </TabList>

              <TabPanels>
                {/* Announcements */}
                <TabPanel>
                  <VStack spacing={4} align="stretch">
                    <Input
                      placeholder="Title"
                      value={announcement.title}
                      onChange={(e) => setAnnouncement((prev) => ({ ...prev, title: e.target.value }))}
                    />
                    <Textarea
                      placeholder="Content"
                      value={announcement.body}
                      onChange={(e) => setAnnouncement((prev) => ({ ...prev, body: e.target.value }))}
                    />
                    <Button colorScheme="blue" onClick={handlePostAnnouncement}>
                      Post Announcement
                    </Button>
                  </VStack>
                </TabPanel>

                {/* Students */}
                <TabPanel>
                  <Heading size="md" mb={4}>
                    Student Info
                  </Heading>

                  {children.length === 0 ? (
                    <Text color="gray.600">No children found.</Text>
                  ) : (
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                      {children.map((child) => (
                        <Card key={child._id} variant="outline">
                          <CardHeader>
                            <Heading size="md">{child.name}</Heading>
                          </CardHeader>
                          <CardBody>
                            <Text>
                              <strong>Class:</strong> {child.classGroup || "N/A"}
                            </Text>
                            <Text>
                              <strong>Parents:</strong>{" "}
                              {Array.isArray(child.parents) && child.parents.length > 0
                                ? child.parents.map((p) => p?.name || p?.email || "Parent").join(", ")
                                : "None"}
                            </Text>
                          </CardBody>
                        </Card>
                      ))}
                    </SimpleGrid>
                  )}
                </TabPanel>

                {/* Upload Materials */}
                <TabPanel>
                  <Heading size="md" mb={4}>
                    Upload Teaching Materials
                  </Heading>
                  <Text color="gray.600">
                    Coming soon — we can add PDF uploads per class/child and store them in MongoDB or Cloudinary.
                  </Text>
                </TabPanel>

                {/* Gallery Upload */}
                <TabPanel>
                  <Heading size="md" mb={4}>
                    Upload to Gallery
                  </Heading>
                  <Text color="gray.600">
                    Coming soon — we’ll connect this to your /api/videos upload endpoint and allow selecting a child.
                  </Text>
                </TabPanel>
              </TabPanels>
            </Tabs>
          )}
        </MotionBox>
      </Container>

      <Footer />
    </Box>
  );
};

export default TeacherDashboard;
