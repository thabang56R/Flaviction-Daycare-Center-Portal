// src/pages/ParentDashboard.jsx

import React, { useEffect, useMemo, useState, useContext } from "react";
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
  VStack,
  Spinner,
  Center,
  useToast,
  SimpleGrid,
  Avatar,
  Flex,
  Button,
  Card,
  CardBody,
  CardHeader,
  Alert,
  AlertIcon,
  HStack,
  Badge,
  Divider,
  Select,
  Progress,
  List,
  ListItem,
  ListIcon,
  Icon,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import { EmailIcon, DownloadIcon } from "@chakra-ui/icons";
import { FaBullhorn, FaCheckCircle, FaUtensils, FaUser, FaFileAlt, FaWhatsapp } from "react-icons/fa";

const MotionBox = motion(Box);
const MotionCard = motion(Card);

const API_BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");


export default function ParentDashboard() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const toast = useToast();

  // ----------------------------
  // Parent → Children
  // ----------------------------
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);
  const [loadingChildren, setLoadingChildren] = useState(true);
  const [childrenError, setChildrenError] = useState(null);

  // ----------------------------
  // Connected content (MongoDB)
  // ----------------------------
  const [announcements, setAnnouncements] = useState([]);
  const [annLoading, setAnnLoading] = useState(false);
  const [annError, setAnnError] = useState(null);

  const [menu, setMenu] = useState(null);
  const [menuLoading, setMenuLoading] = useState(false);
  const [menuError, setMenuError] = useState(null);

  const [reportCards, setReportCards] = useState([]);
  const [reportLoading, setReportLoading] = useState(false);
  const [reportError, setReportError] = useState(null);

  // Teacher contact (replace with DB later)
  const teacherPhone = "27649173328"; // 27 + number
  const teacherEmail = "teacher@flaviction.co.za";

  

  // ----------------------------
  // Fetch children linked to parent
  // ----------------------------
  useEffect(() => {
    const fetchChildren = async () => {
      setLoadingChildren(true);
      setChildrenError(null);

      try {
        const t = localStorage.getItem("token");
        if (!t) throw new Error("Not authenticated (token missing)");

        const res = await fetch(`${API_BASE_URL}/api/child/my-children`, {
          headers: {
            Authorization: `Bearer ${t}`,
            "Content-Type": "application/json",
          },
        });

        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
          throw new Error(data.msg || data.message || "Failed to load children");
        }

        const list = Array.isArray(data) ? data : [];
        setChildren(list);

        // Auto-select first child (parent lands here first)
        if (list.length >= 1) setSelectedChild(list[0]);
      } catch (err) {
        setChildrenError(err.message);
        toast({
          title: "Error",
          description: err.message,
          status: "error",
          duration: 6000,
          isClosable: true,
        });
      } finally {
        setLoadingChildren(false);
      }
    };

    fetchChildren();
  }, [toast]);

  // ----------------------------
  // Fetch announcements + menu once (on page load)
  // ----------------------------
  useEffect(() => {
    const fetchAnnouncements = async () => {
      setAnnLoading(true);
      setAnnError(null);
      try {
        const t = localStorage.getItem("token");
        if (!t) throw new Error("Not authenticated");

        const res = await fetch(`${API_BASE_URL}/api/announcements`, {
          headers: { Authorization: `Bearer ${t}` },
        });

        const data = await res.json().catch(() => []);
        if (!res.ok) throw new Error(data.message || "Failed to load announcements");

        setAnnouncements(Array.isArray(data) ? data : []);
      } catch (err) {
        setAnnError(err.message);
      } finally {
        setAnnLoading(false);
      }
    };

    const fetchMenu = async () => {
      setMenuLoading(true);
      setMenuError(null);
      try {
        const t = localStorage.getItem("token");
        if (!t) throw new Error("Not authenticated");

        const res = await fetch(`${API_BASE_URL}/api/menu/current`, {
          headers: { Authorization: `Bearer ${t}` },
        });

        const data = await res.json().catch(() => null);
        if (!res.ok) throw new Error(data?.message || "Failed to load menu");

        setMenu(data || null);
      } catch (err) {
        setMenuError(err.message);
      } finally {
        setMenuLoading(false);
      }
    };

    fetchAnnouncements();
    fetchMenu();
  }, []);

  // ----------------------------
  // Fetch report cards when selectedChild changes
  // ----------------------------
  useEffect(() => {
    const fetchReportCards = async () => {
      if (!selectedChild?._id) return;

      setReportLoading(true);
      setReportError(null);

      try {
        const t = localStorage.getItem("token");
        if (!t) throw new Error("Not authenticated");

        const res = await fetch(`${API_BASE_URL}/api/reportcards/child/${selectedChild._id}`, {
          headers: { Authorization: `Bearer ${t}` },
        });

        const data = await res.json().catch(() => []);
        if (!res.ok) throw new Error(data?.message || "Failed to load report cards");

        setReportCards(Array.isArray(data) ? data : []);
      } catch (err) {
        setReportError(err.message);
      } finally {
        setReportLoading(false);
      }
    };

    fetchReportCards();
  }, [selectedChild?._id]);

  // ----------------------------
  // Helpers
  // ----------------------------
  const handleChildSelect = (child) => setSelectedChild(child);

  const downloadReportPdf = async (reportId) => {
    try {
      const t = localStorage.getItem("token");
      if (!t) throw new Error("Not authenticated");

      const res = await fetch(`${API_BASE_URL}/api/reportcards/${reportId}/pdf`, {
        headers: { Authorization: `Bearer ${t}` },
      });

      if (!res.ok) throw new Error("Failed to download PDF");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `reportcard-${reportId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      toast({
        title: "Download failed",
        description: err.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const whatsappMessage = useMemo(() => {
    const msg = `Hello Teacher, I’m ${user?.name || "a parent"}. I’d like to discuss ${
      selectedChild?.name || "my child"
    }'s progress.`;
    return encodeURIComponent(msg);
  }, [user?.name, selectedChild?.name]);

  // ----------------------------
  // Page states
  // ----------------------------
  if (loadingChildren) {
    return (
      <Box minH="100vh" bg="brand.lightBg">
        <Header />
        <Center h="80vh">
          <VStack spacing={4}>
            <Spinner size="xl" thickness="4px" color="brand.primary" />
            <Text>Loading your children’s profiles...</Text>
          </VStack>
        </Center>
        <Footer />
      </Box>
    );
  }

  if (childrenError) {
    return (
      <Box minH="100vh" bg="brand.lightBg">
        <Header />
        <Container maxW="container.md" py={20} textAlign="center">
          <Alert status="error" borderRadius="lg">
            <AlertIcon />
            {childrenError}
          </Alert>
          <Button mt={6} colorScheme="blue" onClick={() => navigate("/login")}>
            Back to Login
          </Button>
        </Container>
        <Footer />
      </Box>
    );
  }

  if (children.length === 0) {
    return (
      <Box minH="100vh" bg="brand.lightBg">
        <Header />
        <Container maxW="container.md" py={20} textAlign="center">
          <VStack spacing={6}>
            <Heading size="xl" color="brand.primary">
              No Child Linked Yet
            </Heading>
            <Text fontSize="lg" color="gray.700">
              Your account doesn’t have any child linked yet.
            </Text>
            <Text color="gray.600">Please contact admin/teacher to link your child profile.</Text>
            <Button colorScheme="blue" size="lg" onClick={() => navigate("/contact")}>
              Contact Us
            </Button>
          </VStack>
        </Container>
        <Footer />
      </Box>
    );
  }

  // If parent has multiple kids and chose "card view switch"
  if (children.length > 1 && !selectedChild) {
    return (
      <Box minH="100vh" bg="brand.lightBg">
        <Header />
        <Container maxW="container.xl" py={16}>
          <VStack spacing={8}>
            <Heading size="2xl" color="brand.primary" textAlign="center">
              Welcome back, {user?.name || "Parent"}!
            </Heading>

            <Text fontSize="xl" textAlign="center" color="gray.700">
              Select a child to view their dashboard
            </Text>

            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8} w="full">
              {children.map((child) => (
                <MotionBox
                  key={child._id}
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  bg="white"
                  borderRadius="2xl"
                  overflow="hidden"
                  boxShadow="lg"
                  textAlign="center"
                  whileHover={{ y: -8 }}
                  cursor="pointer"
                  onClick={() => handleChildSelect(child)}
                >
                  <Flex justify="center" mt={-10}>
                    <Avatar
                      src={child.photo || "https://via.placeholder.com/150?text=Child"}
                      size="2xl"
                      border="8px solid white"
                      boxShadow="xl"
                    />
                  </Flex>
                  <Box p={8} pt={14}>
                    <Heading size="lg" mb={2} color="brand.primary">
                      {child.name}
                    </Heading>
                    <Text fontSize="md" color="gray.600" mb={5}>
                      {child.classGroup || "Unknown Group"}
                    </Text>
                    <Button colorScheme="blue" size="md">
                      Open Dashboard
                    </Button>
                  </Box>
                </MotionBox>
              ))}
            </SimpleGrid>
          </VStack>
        </Container>
        <Footer />
      </Box>
    );
  }

  // Main dashboard
  return (
    <Box minH="100vh" bg="brand.lightBg">
      <Header />

      <Container maxW="container.xl" py={{ base: 8, md: 10 }}>
        <MotionBox initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <VStack spacing={8} align="stretch">
            {/* Top header card */}
            <Card borderRadius="2xl" boxShadow="md">
              <CardBody>
                <Flex
                  direction={{ base: "column", md: "row" }}
                  align={{ base: "center", md: "center" }}
                  justify="space-between"
                  gap={6}
                >
                  <HStack spacing={5}>
                    <Avatar
                      src={selectedChild?.photo}
                      size="2xl"
                      border="6px solid"
                      borderColor="brand.primary"
                      boxShadow="xl"
                    />
                    <Box>
                      <Heading size="xl" color="brand.primary">
                        {selectedChild?.name}
                      </Heading>
                      <Text color="gray.600" fontSize="md">
                        {selectedChild?.classGroup || "N/A"} • Age {selectedChild?.age || "?"}
                      </Text>
                      <Text color="gray.500" fontSize="sm">
                        Parent: {user?.name || "You"}
                      </Text>
                    </Box>
                  </HStack>

                  {/* Child switcher */}
                  <VStack align={{ base: "stretch", md: "end" }} spacing={3} w={{ base: "full", md: "auto" }}>
                    {children.length > 1 && (
                      <>
                        <Text fontSize="sm" color="gray.600" fontWeight="bold">
                          Switch Child
                        </Text>
                        <Select
                          value={selectedChild?._id || ""}
                          onChange={(e) => {
                            const next = children.find((c) => c._id === e.target.value);
                            if (next) setSelectedChild(next);
                          }}
                          bg="white"
                        >
                          {children.map((c) => (
                            <option key={c._id} value={c._id}>
                              {c.name} {c.classGroup ? `• ${c.classGroup}` : ""}
                            </option>
                          ))}
                        </Select>
                      </>
                    )}

                    {/* Optional: send to select child page if you still use it */}
                    <Button
                      variant="outline"
                      colorScheme="blue"
                      onClick={() => navigate("/dashboard/select-child")}
                      w={{ base: "full", md: "auto" }}
                    >
                      Go to Select Child →
                    </Button>
                  </VStack>
                </Flex>
              </CardBody>
            </Card>

            {/* Quick overview cards */}
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
              <MotionCard whileHover={{ y: -4 }} transition={{ duration: 0.2 }} borderRadius="2xl" boxShadow="md">
                <CardHeader>
                  <HStack>
                    <Icon as={FaBullhorn} />
                    <Heading size="md">Announcements</Heading>
                  </HStack>
                </CardHeader>
                <CardBody>
                  <Text color="gray.600">{annLoading ? "Loading..." : `${announcements.length} update(s) available.`}</Text>
                </CardBody>
              </MotionCard>

              <MotionCard whileHover={{ y: -4 }} transition={{ duration: 0.2 }} borderRadius="2xl" boxShadow="md">
                <CardHeader>
                  <HStack>
                    <Icon as={FaUtensils} />
                    <Heading size="md">Weekly Menu</Heading>
                  </HStack>
                </CardHeader>
                <CardBody>
                  <Text color="gray.600">{menuLoading ? "Loading..." : menu ? "Menu is available." : "No menu posted yet."}</Text>
                </CardBody>
              </MotionCard>

              <MotionCard whileHover={{ y: -4 }} transition={{ duration: 0.2 }} borderRadius="2xl" boxShadow="md">
                <CardHeader>
                  <HStack>
                    <Icon as={FaFileAlt} />
                    <Heading size="md">Report Cards</Heading>
                  </HStack>
                </CardHeader>
                <CardBody>
                  <Text color="gray.600">{reportLoading ? "Loading..." : `${reportCards.length} report card(s).`}</Text>
                </CardBody>
              </MotionCard>
            </SimpleGrid>

            {/* Tabs */}
            <Tabs variant="enclosed" colorScheme="blue" w="full">
              <TabList overflowX="auto">
                <Tab>
                  <HStack spacing={2}>
                    <Icon as={FaBullhorn} />
                    <Text>Announcements</Text>
                  </HStack>
                </Tab>
                <Tab>
                  <HStack spacing={2}>
                    <Icon as={FaUtensils} />
                    <Text>Daily Menu</Text>
                  </HStack>
                </Tab>
                <Tab>
                  <HStack spacing={2}>
                    <Icon as={FaFileAlt} />
                    <Text>Report Cards</Text>
                  </HStack>
                </Tab>
                <Tab>
                  <HStack spacing={2}>
                    <Icon as={FaUser} />
                    <Text>Kid Profile</Text>
                  </HStack>
                </Tab>
                <Tab>
                  <HStack spacing={2}>
                    <Icon as={FaWhatsapp} />
                    <Text>Message Teacher</Text>
                  </HStack>
                </Tab>
              </TabList>

              <TabPanels bg="white" borderRadius="2xl" mt={4} boxShadow="md">
                {/* Announcements */}
                <TabPanel>
                  <VStack align="stretch" spacing={5}>
                    <Heading size="md">Latest Announcements</Heading>

                    {annLoading && (
                      <HStack>
                        <Spinner />
                        <Text>Loading announcements...</Text>
                      </HStack>
                    )}

                    {!annLoading && annError && (
                      <Alert status="error" borderRadius="lg">
                        <AlertIcon />
                        {annError}
                      </Alert>
                    )}

                    {!annLoading && !annError && announcements.length === 0 && (
                      <Text color="gray.600">No announcements at the moment.</Text>
                    )}

                    {!annLoading && !annError && announcements.length > 0 && (
                      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5}>
                        {announcements.map((a) => (
                          <Card
                            key={a._id}
                            borderRadius="2xl"
                            boxShadow="sm"
                            border="1px solid"
                            borderColor="gray.200"
                          >
                            <CardBody>
                              <HStack justify="space-between" mb={2}>
                                <Badge
                                  colorScheme={
                                    a.type === "important" ? "red" : a.type === "notice" ? "yellow" : "blue"
                                  }
                                  borderRadius="full"
                                  px={3}
                                  py={1}
                                >
                                  {(a.type || "info").toUpperCase()}
                                </Badge>

                                <Text fontSize="sm" color="gray.500">
                                  {a.createdAt ? new Date(a.createdAt).toLocaleDateString() : ""}
                                </Text>
                              </HStack>

                              <Heading size="sm" color="gray.900" mb={1}>
                                {a.title}
                                {a.pinned ? (
                                  <Badge ml={2} colorScheme="purple" borderRadius="full">
                                    PINNED
                                  </Badge>
                                ) : null}
                              </Heading>

                              <Text color="gray.600">{a.body}</Text>
                            </CardBody>
                          </Card>
                        ))}
                      </SimpleGrid>
                    )}
                  </VStack>
                </TabPanel>

                {/* Daily Menu */}
                <TabPanel>
                  <VStack align="stretch" spacing={5}>
                    <Heading size="md">Weekly Menu</Heading>

                    {menuLoading && (
                      <HStack>
                        <Spinner />
                        <Text>Loading menu...</Text>
                      </HStack>
                    )}

                    {!menuLoading && menuError && (
                      <Alert status="error" borderRadius="lg">
                        <AlertIcon />
                        {menuError}
                      </Alert>
                    )}

                    {!menuLoading && !menuError && !menu && (
                      <Text color="gray.600">No menu has been posted yet.</Text>
                    )}

                    {!menuLoading && !menuError && menu && (
                      <>
                        <Text color="gray.600">
                          Week starting:{" "}
                          <Badge borderRadius="full" px={3} py={1} colorScheme="purple">
                            {menu.weekStart ? new Date(menu.weekStart).toLocaleDateString() : "N/A"}
                          </Badge>
                        </Text>

                        <VStack align="stretch" spacing={3}>
                          {(menu.items || []).map((item, idx) => (
                            <Card
                              key={`${item.day}-${idx}`}
                              borderRadius="2xl"
                              boxShadow="sm"
                              border="1px solid"
                              borderColor="gray.200"
                            >
                              <CardBody>
                                <HStack justify="space-between" flexWrap="wrap" gap={3} align="start">
                                  <Badge
                                    borderRadius="full"
                                    px={3}
                                    py={1}
                                    bg="brand.lightBg"
                                    border="1px solid"
                                    borderColor="brand.primary"
                                  >
                                    {item.day}
                                  </Badge>

                                  <Box flex="1">
                                    <Text fontWeight="bold" color="gray.700">
                                      Breakfast:
                                      <Text as="span" fontWeight="medium" color="gray.600">
                                        {" "}
                                        {item.breakfast || "—"}
                                      </Text>
                                    </Text>
                                    <Text fontWeight="bold" color="gray.700">
                                      Snack:
                                      <Text as="span" fontWeight="medium" color="gray.600">
                                        {" "}
                                        {item.snack || "—"}
                                      </Text>
                                    </Text>
                                    <Text fontWeight="bold" color="gray.700">
                                      Lunch:
                                      <Text as="span" fontWeight="medium" color="gray.600">
                                        {" "}
                                        {item.lunch || "—"}
                                      </Text>
                                    </Text>
                                  </Box>
                                </HStack>
                              </CardBody>
                            </Card>
                          ))}
                        </VStack>
                      </>
                    )}
                  </VStack>
                </TabPanel>

                {/* Report Cards */}
                <TabPanel>
                  <VStack align="stretch" spacing={5}>
                    <Heading size="md">Report Cards</Heading>

                    {reportLoading && (
                      <HStack>
                        <Spinner />
                        <Text>Loading report cards...</Text>
                      </HStack>
                    )}

                    {!reportLoading && reportError && (
                      <Alert status="error" borderRadius="lg">
                        <AlertIcon />
                        {reportError}
                      </Alert>
                    )}

                    {!reportLoading && !reportError && reportCards.length === 0 && (
                      <Text color="gray.600">No report cards published for this child yet.</Text>
                    )}

                    {!reportLoading && !reportError && reportCards.length > 0 && (
                      <VStack align="stretch" spacing={5}>
                        {reportCards.map((rc) => (
                          <Card
                            key={rc._id}
                            borderRadius="2xl"
                            boxShadow="sm"
                            border="1px solid"
                            borderColor="gray.200"
                          >
                            <CardHeader>
                              <HStack justify="space-between" flexWrap="wrap" gap={3}>
                                <HStack>
                                  <Badge colorScheme="purple" borderRadius="full" px={3} py={1}>
                                    {rc.term} {rc.year}
                                  </Badge>
                                  <Text color="gray.500" fontSize="sm">
                                    {rc.createdAt ? `Updated ${new Date(rc.createdAt).toLocaleDateString()}` : ""}
                                  </Text>
                                </HStack>

                                <Button
                                  leftIcon={<DownloadIcon />}
                                  colorScheme="blue"
                                  variant="outline"
                                  onClick={() => downloadReportPdf(rc._id)}
                                >
                                  Download PDF
                                </Button>
                              </HStack>
                            </CardHeader>

                            <CardBody>
                              <VStack align="stretch" spacing={4}>
                                {(rc.skills || []).length === 0 ? (
                                  <Text color="gray.600">No skills recorded yet.</Text>
                                ) : (
                                  (rc.skills || []).map((s) => (
                                    <Box key={s.label}>
                                      <HStack justify="space-between" mb={2}>
                                        <Text fontWeight="bold" color="gray.800">
                                          {s.label}
                                        </Text>
                                        <Text fontWeight="bold" color="brand.primary">
                                          {s.value}%
                                        </Text>
                                      </HStack>
                                      <Progress value={s.value} borderRadius="full" />
                                    </Box>
                                  ))
                                )}

                                <Divider />

                                <Box>
                                  <Heading size="sm" mb={2}>
                                    Teacher Note
                                  </Heading>
                                  <Text color="gray.600">{rc.teacherNote || "No note provided."}</Text>
                                </Box>
                              </VStack>
                            </CardBody>
                          </Card>
                        ))}
                      </VStack>
                    )}
                  </VStack>
                </TabPanel>

                {/* Kid Profile */}
                <TabPanel>
                  <VStack align="stretch" spacing={5}>
                    <Heading size="md">Kid Profile</Heading>

                    <Card borderRadius="2xl" boxShadow="sm" border="1px solid" borderColor="gray.200">
                      <CardBody>
                        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                          <Box>
                            <Text fontWeight="bold" color="gray.700">
                              Full Name
                            </Text>
                            <Text color="gray.600">{selectedChild?.name}</Text>
                          </Box>

                          <Box>
                            <Text fontWeight="bold" color="gray.700">
                              Class Group
                            </Text>
                            <Text color="gray.600">{selectedChild?.classGroup || "N/A"}</Text>
                          </Box>

                          <Box>
                            <Text fontWeight="bold" color="gray.700">
                              Age
                            </Text>
                            <Text color="gray.600">{selectedChild?.age || "N/A"}</Text>
                          </Box>

                          <Box>
                            <Text fontWeight="bold" color="gray.700">
                              Allergies / Notes
                            </Text>
                            <Text color="gray.600">{selectedChild?.allergies || "None recorded"}</Text>
                          </Box>
                        </SimpleGrid>

                        <Divider my={5} />

                        <Heading size="sm" mb={3}>
                          Quick Actions
                        </Heading>

                        <List spacing={2} color="gray.700">
                          <ListItem>
                            <ListIcon as={FaCheckCircle} color="green.400" />
                            View attendance & daily updates (coming soon)
                          </ListItem>
                          <ListItem>
                            <ListIcon as={FaCheckCircle} color="green.400" />
                            Download report cards from the Report Cards tab
                          </ListItem>
                          <ListItem>
                            <ListIcon as={FaCheckCircle} color="green.400" />
                            Message teacher via WhatsApp/Email tab
                          </ListItem>
                        </List>

                        {children.length > 1 && (
                          <Button
                            mt={6}
                            colorScheme="blue"
                            variant="outline"
                            onClick={() => setSelectedChild(null)}
                          >
                            Switch Child (Card View)
                          </Button>
                        )}
                      </CardBody>
                    </Card>
                  </VStack>
                </TabPanel>

                {/* Message Teacher */}
                <TabPanel>
                  <VStack align="stretch" spacing={5}>
                    <Heading size="md">Message Teacher</Heading>
                    <Text color="gray.600">
                      Contact your child’s teacher quickly via WhatsApp or Email.
                    </Text>

                    <Card borderRadius="2xl" boxShadow="sm" border="1px solid" borderColor="gray.200">
                      <CardBody>
                        <VStack align="stretch" spacing={4}>
                          <Text fontWeight="bold" color="gray.700">
                            Child:{" "}
                            <Badge ml={2} colorScheme="purple" borderRadius="full" px={3} py={1}>
                              {selectedChild?.name}
                            </Badge>
                          </Text>

                          <HStack spacing={3} flexWrap="wrap">
                            <Button
                              leftIcon={<Icon as={FaWhatsapp} />}
                              as="a"
                              href={`https://wa.me/${teacherPhone}?text=${whatsappMessage}`}
                              target="_blank"
                              rel="noreferrer"
                              colorScheme="green"
                            >
                              WhatsApp Teacher
                            </Button>

                            <Button
                              leftIcon={<EmailIcon />}
                              as="a"
                              href={`mailto:${teacherEmail}?subject=${encodeURIComponent(
                                "Flaviction Parent Message"
                              )}&body=${whatsappMessage}`}
                              colorScheme="blue"
                              variant="outline"
                            >
                              Email Teacher
                            </Button>
                          </HStack>

                          <Divider />

                          <Text fontSize="sm" color="gray.500">
                            Tip: In future we can link the teacher contact automatically using your child’s class group.
                          </Text>
                        </VStack>
                      </CardBody>
                    </Card>
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
}
