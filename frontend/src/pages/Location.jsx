// src/pages/Location.jsx
import React from "react";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Icon,
  SimpleGrid,
  Card,
  CardBody,
  Divider,
  Button,
} from "@chakra-ui/react";
import { motion, useInView } from "framer-motion";
import { FaMapMarkerAlt, FaClock, FaPhoneAlt, FaDirections } from "react-icons/fa";

const MotionBox = motion(Box);
const MotionVStack = motion(VStack);

export default function Location() {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.25 });

  const addressLine = "47 Maroela, Primrose, Germiston, 1401";
  const mapsQuery = encodeURIComponent(`Flaviction DayCare Center, ${addressLine}`);
  const googleEmbedSrc = `https://www.google.com/maps?q=${mapsQuery}&output=embed`;
  const googleDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(addressLine)}`;

  return (
    <Box bg="brand.lightBg" minH="100vh">
      <Header />

      <Container maxW="container.xl" py={{ base: 10, md: 16 }}>
        <MotionVStack
          ref={ref}
          spacing={{ base: 8, md: 10 }}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.6 }}
          align="stretch"
        >
          {/* Title */}
          <VStack spacing={3} textAlign="center">
            <Heading size={{ base: "xl", md: "2xl" }} color="gray.900">
              Visit <Box as="span" color="brand.primary">Flaviction DayCare</Box>
            </Heading>
            <Text color="gray.600" fontSize={{ base: "md", md: "lg" }} maxW="3xl">
              We’d love to welcome you for a tour. Find us easily using the map below.
            </Text>
          </VStack>

          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8} alignItems="stretch">
            {/* Info card */}
            <Card borderRadius="3xl" boxShadow="xl" overflow="hidden">
              <CardBody>
                <VStack align="start" spacing={5}>
                  <HStack spacing={3}>
                    <Icon as={FaMapMarkerAlt} boxSize={5} color="brand.primary" />
                    <Box>
                      <Text fontWeight="bold" color="gray.900">Address</Text>
                      <Text color="gray.600">{addressLine}</Text>
                    </Box>
                  </HStack>

                  <Divider />

                  <HStack spacing={3}>
                    <Icon as={FaClock} boxSize={5} color="brand.primary" />
                    <Box>
                      <Text fontWeight="bold" color="gray.900">Operating Hours</Text>
                      <Text color="gray.600">Mon – Fri: 06:30 – 17:30</Text>
                      <Text color="gray.600">Half-day & Full-day options available</Text>
                    </Box>
                  </HStack>

                  <Divider />

                  <HStack spacing={3}>
                    <Icon as={FaPhoneAlt} boxSize={5} color="brand.primary" />
                    <Box>
                      <Text fontWeight="bold" color="gray.900">Contact</Text>
                      <Text color="gray.600">
                        Add your phone number here in your Contact page / footer.
                      </Text>
                    </Box>
                  </HStack>

                  <Divider />

                  <Button
                    as="a"
                    href={googleDirectionsUrl}
                    target="_blank"
                    rel="noreferrer"
                    leftIcon={<FaDirections />}
                    size="lg"
                    borderRadius="full"
                  >
                    Get Directions
                  </Button>

                  <Text fontSize="sm" color="gray.500">
                    Tip: If you’re on mobile, “Get Directions” will open your Maps app.
                  </Text>
                </VStack>
              </CardBody>
            </Card>

            {/* Map card */}
            <MotionBox
              borderRadius="3xl"
              boxShadow="2xl"
              overflow="hidden"
              bg="white"
              border="1px solid"
              borderColor="gray.200"
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
            >
              <Box
                w="100%"
                h={{ base: "320px", md: "460px" }}
                bg="gray.100"
              >
                {/* Map embed */}
                <iframe
                  title="Flaviction DayCare Location Map"
                  src={googleEmbedSrc}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </Box>
            </MotionBox>
          </SimpleGrid>
        </MotionVStack>
      </Container>

      <Footer />
    </Box>
  );
}
