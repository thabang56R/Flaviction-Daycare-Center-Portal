import React from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  Image,
  Stack,
  Badge,
  useBreakpointValue,
} from "@chakra-ui/react";
import { motion } from "framer-motion";

const MotionBox = motion(Box);
const MotionImage = motion(Image);

export default function PartnersSection() {
  const headingSize = useBreakpointValue({ base: "xl", md: "2xl" });

  return (
    <Box py={{ base: 14, md: 20 }} bg="brand.lightBg">
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
              OUR PARTNERS
            </Badge>

            <Heading size={headingSize} color="gray.800">
              Trusted Supporters of{" "}
              <Box as="span" color="brand.primary">
                Flaviction DayCare
              </Box>
            </Heading>

            <Text maxW="2xl" color="gray.600" fontSize={{ base: "md", md: "lg" }}>
              We collaborate with leading local businesses that help strengthen
              our vision of quality early childhood care and development.
            </Text>
          </VStack>

          {/* Partner Card */}
          <MotionBox
            w="full"
            maxW="860px"
            mx="auto"
            borderRadius="3xl"
            bg="white"
            overflow="hidden"
            boxShadow="2xl"
            border="1px solid"
            borderColor="gray.200"
            position="relative"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7 }}
          >
            {/* Glow background */}
            <Box
              position="absolute"
              inset={0}
              bgGradient="radial(circle at top, rgba(255,215,0,0.35), transparent 60%)"
              pointerEvents="none"
            />

            <Stack
              direction={{ base: "column", md: "row" }}
              spacing={0}
              position="relative"
            >
              {/* Logo area */}
              <Box
                flex="1"
                display="flex"
                alignItems="center"
                justifyContent="center"
                py={{ base: 10, md: 12 }}
                px={{ base: 8, md: 12 }}
                bgGradient="linear(to-br, #003366, #001a33)"
              >
                <MotionImage
                  src="/Logo Design (1)-images-0.jpg"
                  alt="Inevitable Accounting & Advisory"
                  boxSize={{ base: "120px", md: "150px" }}
                  objectFit="contain"
                  borderRadius="2xl"
                  p={3}
                  bg="white"
                  boxShadow="xl"
                  whileHover={{ scale: 1.05, rotate: -1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  fallbackSrc="https://via.placeholder.com/150?text=Partner+Logo"
                />
              </Box>

              {/* Content area */}
              <Box flex="2" px={{ base: 8, md: 12 }} py={{ base: 10, md: 12 }}>
                <VStack align="start" spacing={4}>
                  <Heading size="lg" color="gray.900">
                    Inevitable Accounting & Advisory
                  </Heading>

                  <Text color="gray.600" fontSize={{ base: "md", md: "lg" }}>
                    A trusted accounting and advisory firm supporting SMEs with
                    reliable financial solutions, compliance services, and
                    strategic business growth guidance — empowering communities
                    through strong financial foundations.
                  </Text>

                  <Box
                    mt={2}
                    px={4}
                    py={2}
                    borderRadius="full"
                    bg="brand.lightBg"
                    border="1px solid"
                    borderColor="brand.primary"
                    fontWeight="bold"
                    color="gray.800"
                  >
                    Proud partner of Flaviction DayCare Center 💛
                  </Box>
                </VStack>
              </Box>
            </Stack>
          </MotionBox>
        </VStack>
      </Container>
    </Box>
  );
}
