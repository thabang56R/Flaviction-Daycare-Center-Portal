// src/pages/ChildDashboard.jsx
import React, { useState, useEffect, useContext } from "react";
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
  Button,
  Flex,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { AuthContext } from "../contexts/AuthContext";
import { useParams, useNavigate } from "react-router-dom";

const MotionBox = motion(Box);

// ✅ env-based API
const API = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");

const ChildDashboard = () => {
  const { user } = useContext(AuthContext);
  const { childId } = useParams(); // /dashboard/child/:childId
  const navigate = useNavigate();
  const toast = useToast();

  const [child, setChild] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    const fetchChild = async () => {
      setLoading(true);
      setErrMsg("");

      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Not authenticated");

        const res = await fetch(`${API}/api/child/${childId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        });

        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
          throw new Error(data.msg || data.message || "Failed to load child data");
        }

        setChild(data);
      } catch (err) {
        setErrMsg(err.message);

        toast({
          title: "Error",
          description: err.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });

        // If child not accessible, send back to selector
        navigate("/dashboard/select-child");
      } finally {
        setLoading(false);
      }
    };

    if (childId) fetchChild();
  }, [childId, navigate, toast]);

  if (loading) {
    return (
      <Center minH="100vh" bg="brand.lightBg">
        <VStack spacing={4}>
          <Spinner size="xl" thickness="4px" color="brand.primary" />
          <Text>Loading child dashboard...</Text>
        </VStack>
      </Center>
    );
  }

  if (!child) {
    return (
      <Box minH="100vh" bg="brand.lightBg">
        <Container maxW="container.md" py={20} textAlign="center">
          <Heading size="xl" color="red.500" mb={4}>
            Child not found
          </Heading>

          {errMsg && (
            <Alert status="error" borderRadius="lg" mb={6}>
              <AlertIcon />
              {errMsg}
            </Alert>
          )}

          <Button colorScheme="blue" onClick={() => navigate("/dashboard/select-child")}>
            Back to Selection
          </Button>
        </Container>
      </Box>
    );
  }

  return (
    <Box minH="100vh" bg="brand.lightBg">
      <Container maxW="container.xl" py={10}>
        <MotionBox
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <VStack spacing={8}>
            {/* Child Header */}
            <Flex direction={{ base: "column", md: "row" }} align="center" gap={8} w="full">
              <Avatar
                src={child.photo}
                size="2xl"
                border="6px solid"
                borderColor="brand.primary"
                boxShadow="xl"
              />
              <VStack align={{ base: "center", md: "start" }} spacing={2}>
                <Heading size="2xl" color="brand.primary">
                  {child.name}&apos;s Dashboard
                </Heading>
                <Text fontSize="lg" color="gray.600">
                  {child.classGroup || "N/A"} • Age {child.age || "?"}
                </Text>
                <Text fontSize="md" color="gray.500">
                  Parent: {user?.name || "You"}
                </Text>
              </VStack>
            </Flex>

            {/* Tabs */}
            <Tabs variant="enclosed" colorScheme="blue" w="full">
              <TabList overflowX="auto">
                <Tab>Daily Report</Tab>
                <Tab>Attendance</Tab>
                <Tab>Photos & Videos</Tab>
                <Tab>Messages</Tab>
                <Tab>Invoices</Tab>
              </TabList>

              <TabPanels bg="white" borderRadius="2xl" mt={4} boxShadow="md">
                <TabPanel>
                  <VStack spacing={3} align="start">
                    <Heading size="md">Today&apos;s Report</Heading>
                    <Text>Meals: Ate well 😊</Text>
                    <Text>Sleep: 2-hour nap</Text>
                    <Text>Mood: Happy</Text>
                    <Text color="gray.500" fontSize="sm">
                      (Coming soon: teacher-submitted daily reports from MongoDB)
                    </Text>
                  </VStack>
                </TabPanel>

                <TabPanel>
                  <Text>Attendance details coming soon...</Text>
                </TabPanel>

                <TabPanel>
                  <Heading size="md" mb={2}>
                    Photos & Videos
                  </Heading>
                  <Text color="gray.600">
                    Gallery is coming soon. We’ll connect this to your /api/videos endpoint and show the media here.
                  </Text>
                </TabPanel>

                <TabPanel>
                  <Text>Messages with teacher coming soon...</Text>
                </TabPanel>

                <TabPanel>
                  <Text>Invoices & payments coming soon...</Text>
                </TabPanel>
              </TabPanels>
            </Tabs>

            <Button colorScheme="blue" variant="outline" onClick={() => navigate("/dashboard/select-child")}>
              Switch Child
            </Button>
          </VStack>
        </MotionBox>
      </Container>
    </Box>
  );
};

export default ChildDashboard;
