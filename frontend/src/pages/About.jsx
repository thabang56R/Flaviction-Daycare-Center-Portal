// src/pages/About.jsx
import React from "react";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  SimpleGrid,
  Card,
  CardBody,
  HStack,
  Icon,
  Image,
  Badge,
} from "@chakra-ui/react";
import { motion, useInView } from "framer-motion";
import { FaHeart, FaShieldAlt, FaChild, FaChalkboardTeacher } from "react-icons/fa";

const MotionVStack = motion(VStack);
const MotionCard = motion(Card);

export default function About() {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.25 });

  const highlights = [
    {
      icon: FaShieldAlt,
      title: "Safe & Secure",
      desc: "A protected environment with clear routines, hygiene protocols, and supervision.",
    },
    {
      icon: FaHeart,
      title: "Warm & Nurturing",
      desc: "We treat every child with patience, love, and respect—like family.",
    },
    {
      icon: FaChild,
      title: "Play-Based Learning",
      desc: "Learning through fun, creativity, and social development to build confidence.",
    },
    {
      icon: FaChalkboardTeacher,
      title: "Qualified Support",
      desc: "Guided by caring staff focused on early childhood growth and wellbeing.",
    },
  ];

  return (
    <Box bg="brand.lightBg" minH="100vh">
      <Header />

      <Container maxW="container.xl" py={{ base: 10, md: 16 }}>
        <MotionVStack
          ref={ref}
          spacing={{ base: 10, md: 12 }}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.6 }}
        >
          {/* Hero */}
          <VStack spacing={4} textAlign="center">
            <Badge
              px={4}
              py={2}
              borderRadius="full"
              bg="brand.primary"
              color="black"
              fontWeight="bold"
              letterSpacing="wide"
            >
              ABOUT FLAVICTION
            </Badge>

            <Heading size={{ base: "xl", md: "2xl" }} color="gray.900">
              A place where little hearts{" "}
              <Box as="span" color="brand.primary">grow big</Box>
            </Heading>

            <Text maxW="3xl" color="gray.600" fontSize={{ base: "md", md: "lg" }}>
              Flaviction DayCare Center is dedicated to providing a safe, nurturing,
              and stimulating environment. We focus on emotional wellbeing, routine,
              and play-based learning that supports each child’s development.
            </Text>
          </VStack>

          {/* Image */}
          <Box
            w="full"
            maxW="980px"
            borderRadius="3xl"
            overflow="hidden"
            boxShadow="2xl"
            border="1px solid"
            borderColor="gray.200"
            bg="white"
          >
            <Image
              src="https://images.unsplash.com/photo-1588075592446-265fd1e6e76f?w=1400"
              alt="About Flaviction DayCare"
              w="100%"
              h={{ base: "240px", md: "420px" }}
              objectFit="cover"
              loading="lazy"
            />
          </Box>

          {/* Cards */}
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} w="full">
            {highlights.map((h, idx) => (
              <MotionCard
                key={h.title}
                borderRadius="3xl"
                boxShadow="lg"
                bg="white"
                border="1px solid"
                borderColor="gray.200"
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: idx * 0.07 }}
                whileHover={{ y: -5 }}
              >
                <CardBody>
                  <HStack spacing={4} align="start">
                    <Box
                      w="44px"
                      h="44px"
                      borderRadius="2xl"
                      bg="brand.lightBg"
                      border="1px solid"
                      borderColor="brand.primary"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Icon as={h.icon} boxSize={5} color="brand.primary" />
                    </Box>

                    <Box>
                      <Heading size="md" color="gray.900">
                        {h.title}
                      </Heading>
                      <Text color="gray.600" mt={1}>
                        {h.desc}
                      </Text>
                    </Box>
                  </HStack>
                </CardBody>
              </MotionCard>
            ))}
          </SimpleGrid>

          {/* Closing line */}
          <Text color="gray.700" fontSize={{ base: "md", md: "lg" }} textAlign="center" maxW="3xl">
            We believe every child deserves a joyful start—filled with care, structure,
            and opportunities to learn through play.
          </Text>
        </MotionVStack>
      </Container>

      <Footer />
    </Box>
  );
}

