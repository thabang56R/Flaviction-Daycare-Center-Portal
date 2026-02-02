import React from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  SimpleGrid,
  HStack,
  Avatar,
  Badge,
  Icon,
  Divider,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { FaStar } from "react-icons/fa";

const MotionBox = motion(Box);

const testimonials = [
  {
    name: "Mrs. Mokoena",
    role: "Parent (Toddler Class)",
    message:
      "Flaviction DayCare is truly a blessing. My child became more confident, social, and excited to learn. The teachers are caring and professional.",
    rating: 5,
  },
  {
    name: "Mr. Dlamini",
    role: "Parent (Baby Care)",
    message:
      "The staff are warm and attentive. I always feel at peace knowing my baby is safe, clean, and well looked after. Communication is excellent.",
    rating: 5,
  },
  {
    name: "Ms. Khumalo",
    role: "Parent (Grade R)",
    message:
      "Amazing routines and learning activities. My child improved a lot in language and creativity. The environment is clean, structured, and fun.",
    rating: 5,
  },
  {
    name: "Mrs. Ndlovu",
    role: "Parent (Aftercare)",
    message:
      "Homework support and aftercare are top-notch. My child is happier and more disciplined. Flaviction feels like a second home.",
    rating: 5,
  },
];

function Stars({ rating = 5 }) {
  return (
    <HStack spacing={1}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Icon
          key={i}
          as={FaStar}
          boxSize={4}
          color={i < rating ? "brand.primary" : "gray.300"}
        />
      ))}
    </HStack>
  );
}

export default function TestimonialsSection() {
  return (
    <Box py={{ base: 14, md: 20 }} bg="white">
      <Container maxW="container.xl">
        <VStack spacing={10} textAlign="center">
          {/* Title */}
          <VStack spacing={3}>
            <Badge
              px={4}
              py={2}
              borderRadius="full"
              bg="brand.primary"
              color="black"
              fontWeight="bold"
              letterSpacing="wide"
              fontSize="sm"
            >
              TESTIMONIALS
            </Badge>

            <Heading size={{ base: "xl", md: "2xl" }} color="gray.900">
              What Parents Say About{" "}
              <Box as="span" color="brand.primary">
                Flaviction
              </Box>
            </Heading>

            <Text maxW="2xl" color="gray.600" fontSize={{ base: "md", md: "lg" }}>
              Real feedback from parents who trust us every day — because your
              child’s safety, happiness, and growth matter most.
            </Text>
          </VStack>

          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8} w="full">
            {testimonials.map((t, idx) => (
              <MotionBox
                key={idx}
                p={{ base: 6, md: 7 }}
                borderRadius="3xl"
                bg="brand.lightBg"
                border="1px solid"
                borderColor="gray.200"
                boxShadow="lg"
                textAlign="left"
                position="relative"
                overflow="hidden"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.55, delay: idx * 0.08 }}
                whileHover={{ y: -6 }}
              >
                {/* subtle glow */}
                <Box
                  position="absolute"
                  inset={0}
                  bgGradient="radial(circle at top, rgba(255,215,0,0.28), transparent 60%)"
                  pointerEvents="none"
                />

                <VStack align="start" spacing={4} position="relative">
                  <HStack justify="space-between" w="full">
                    <Stars rating={t.rating} />
                    <Badge
                      borderRadius="full"
                      px={3}
                      py={1}
                      bg="white"
                      border="1px solid"
                      borderColor="brand.primary"
                      color="gray.800"
                      fontWeight="bold"
                    >
                      Verified Parent
                    </Badge>
                  </HStack>

                  <Text color="gray.700" fontSize={{ base: "md", md: "lg" }}>
                    “{t.message}”
                  </Text>

                  <Divider borderColor="gray.300" />

                  <HStack spacing={3}>
                    <Avatar name={t.name} size="sm" />
                    <Box>
                      <Text fontWeight="bold" color="gray.900">
                        {t.name}
                      </Text>
                      <Text fontSize="sm" color="gray.600">
                        {t.role}
                      </Text>
                    </Box>
                  </HStack>
                </VStack>
              </MotionBox>
            ))}
          </SimpleGrid>
        </VStack>
      </Container>
    </Box>
  );
}
