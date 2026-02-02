// src/pages/AdminDashboard.jsx
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
  Spinner,
  Center,
  useToast,
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
  Text,
  Button,
  Input,
  Textarea,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import LinkParentToChild from "../components/admin/LinkParentToChild";

const MotionBox = motion(Box);

// ✅ env-based API (works on Vercel + local)
const API = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");

const AdminDashboard = () => {
  const toast = useToast();
  const [users, setUsers] = useState([]);
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // (Optional) announcement UI state
  const [announceTitle, setAnnounceTitle] = useState("");
  const [announceBody, setAnnounceBody] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null);
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Not authenticated");

        const headers = { Authorization: `Bearer ${token}` };

        const [usersRes, childrenRes] = await Promise.all([
          fetch(`${API}/api/admin/users`, { headers, cache: "no-store" }),
          fetch(`${API}/api/admin/children`, { headers, cache: "no-store" }),
        ]);

        if (!usersRes.ok || !childrenRes.ok) {
          const u = await usersRes.text().catch(() => "");
          const c = await childrenRes.text().catch(() => "");
          throw new Error(
            `Failed to load data. Users: ${usersRes.status} ${u} | Children: ${childrenRes.status} ${c}`
          );
        }

        const usersData = await usersRes.json();
        const childrenData = await childrenRes.json();

        setUsers(Array.isArray(usersData) ? usersData : []);
        setChildren(Array.isArray(childrenData) ? childrenData : []);
      } catch (err) {
        setError(err.message);
        toast({
          title: "Error",
          description: err.message,
          status: "error",
          duration: 6000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  const handlePostAnnouncement = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Not authenticated");

      if (!announceTitle.trim() || !announceBody.trim()) {
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
          title: announceTitle,
          body: announceBody,
          type: "info",
          audience: "all",
          pinned: false,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.msg || data.message || "Failed to post announcement");

      toast({
        title: "Posted",
        description: "Announcement posted successfully.",
        status: "success",
        duration: 4000,
        isClosable: true,
      });

      setAnnounceTitle("");
      setAnnounceBody("");
    } catch (err) {
      toast({
        title: "Error",
        description: err.message,
        status: "error",
        duration: 6000,
        isClosable: true,
      });
    }
  };

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
          <Text fontSize="xl" color="red.500">
            Error: {error}
          </Text>
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
                  <Heading size="md" mb={6}>
                    All Users
                  </Heading>
                  <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                    {users.map((u) => (
                      <Card key={u._id} variant="outline">
                        <CardHeader>
                          <Heading size="md">{u.name || u.username}</Heading>
                        </CardHeader>
                        <CardBody>
                          <Text>
                            <strong>Role:</strong> {u.role}
                          </Text>
                          <Text>
                            <strong>Email:</strong> {u.email}
                          </Text>
                        </CardBody>
                      </Card>
                    ))}
                  </SimpleGrid>
                </TabPanel>

                <TabPanel>
                  <Heading size="md" mb={6}>
                    All Children
                  </Heading>
                  <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                    {children.map((c) => (
                      <Card key={c._id} variant="outline">
                        <CardHeader>
                          <Heading size="md">{c.name}</Heading>
                        </CardHeader>
                        <CardBody>
                          <Text>
                            <strong>Class:</strong> {c.classGroup || "N/A"}
                          </Text>
                          <Text>
                            <strong>Parents:</strong>{" "}
                            {Array.isArray(c.parents) && c.parents.length > 0
                              ? c.parents.map((p) => p?.name || p?.email || "Parent").join(", ")
                              : "None"}
                          </Text>
                        </CardBody>
                      </Card>
                    ))}
                  </SimpleGrid>
                </TabPanel>

                <TabPanel>
                  <Heading size="md" mb={6}>
                    Post Announcements & Upload Media
                  </Heading>

                  <VStack spacing={6} align="stretch">
                    <Input
                      placeholder="Announcement Title"
                      value={announceTitle}
                      onChange={(e) => setAnnounceTitle(e.target.value)}
                    />
                    <Textarea
                      placeholder="Announcement Content"
                      rows={4}
                      value={announceBody}
                      onChange={(e) => setAnnounceBody(e.target.value)}
                    />
                    <Button colorScheme="blue" onClick={handlePostAnnouncement}>
                      Post Announcement
                    </Button>

                    {/* Gallery upload is a separate feature - keep button for now */}
                    <Button colorScheme="green" isDisabled>
                      Upload to Gallery (coming soon)
                    </Button>
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
