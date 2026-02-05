// src/components/common/Footer.jsx
import React from "react";
import {
  Box,
  Container,
  SimpleGrid,
  VStack,
  HStack,
  Heading,
  Text,
  Link as ChakraLink,
  Image,
  IconButton,
  Divider,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaWhatsapp, FaMapMarkerAlt } from "react-icons/fa";

export default function Footer() {
  const quickLinks = [
    { label: "Home", to: "/" },
    { label: "About", to: "/about" },
    { label: "Curriculum", to: "/curriculum" },
    { label: "FAQ", to: "/faq" },
    { label: "Contact", to: "/contact" },
    { label: "Location", to: "/location" },
    { label: "Enroll & Pay", to: "/enroll" },
  ];

  return (
    <Box bg="#001a33" color="white" pt={{ base: 12, md: 16 }} pb={8}>
      <Container maxW="container.xl">
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={{ base: 10, md: 8 }}>
          {/* BRAND */}
          <VStack align="start" spacing={4}>
            <HStack spacing={4}>
              <Box
                borderRadius="2xl"
                bg="orange"
                p={2}
                boxShadow="xl"
                border="1px solid"
                borderColor="rgba(255,255,255,0.15)"
              >
                <Image
                  src="/image.jpg (4).jpg"
                  alt="Flaviction Daycare Center Logo"
                  boxSize={{ base: "52px", md: "60px" }}
                  objectFit="contain"
                  borderRadius="xl"
                  fallbackSrc="https://via.placeholder.com/60?text=Logo"
                />
              </Box>

              <VStack align="start" spacing={0}>
                <Heading size="md" lineHeight="1.1" color="gold">
                  Flaviction
                </Heading>
                <Text fontWeight="semibold" opacity={0.9}>
                  Daycare Center
                </Text>
              </VStack>
            </HStack>

            <Text color="whiteAlpha.800" maxW="320px">
              <div style={{color:'orange'}}>Your Child's Home Away from Home</div>
              A safe, nurturing, and stimulating environment where children learn,
              play, and grow with confidence.
              <br />
              <div style={{color:'grey'}}>Raising Happy Hearts & Bright Minds!</div>
              
            </Text>

            {/* Social icons */}
            <HStack spacing={3} pt={4}>
              <IconButton
                aria-label="Facebook"
                icon={<FaFacebookF />}
                variant="ghost"
                color="brand.primary"
                _hover={{ bg: "whiteAlpha.200", transform: "translateY(-2px)" }}
                transition="all 0.2s ease"
                borderRadius="full"
              />
              <IconButton
                aria-label="Instagram"
                icon={<FaInstagram />}
                variant="ghost"
                color="brand.primary"
                _hover={{ bg: "whiteAlpha.200", transform: "translateY(-2px)" }}
                transition="all 0.2s ease"
                borderRadius="full"
              />
              <IconButton
                aria-label="WhatsApp"
                icon={<FaWhatsapp />}
                variant="ghost"
                color="brand.primary"
                _hover={{ bg: "whiteAlpha.200", transform: "translateY(-2px)" }}
                transition="all 0.2s ease"
                borderRadius="full"
              />
            </HStack>
          </VStack>

          {/* QUICK LINKS */}
          <VStack align="start" spacing={3}>
            <Heading size="sm" letterSpacing="wide" color="whiteAlpha.900">
              Quick Links
            </Heading>

            <VStack align="start" spacing={2} pt={1}>
              {quickLinks.map((l) => (
                <ChakraLink
                  key={l.to}
                  as={RouterLink}
                  to={l.to}
                  color="whiteAlpha.800"
                  _hover={{ color: "brand.primary", textDecoration: "none" }}
                  fontWeight="medium"
                >
                  {l.label}
                </ChakraLink>
              ))}
            </VStack>
          </VStack>

          {/* LOCATION / INFO */}
          <VStack align="start" spacing={3}>
            <Heading size="sm" letterSpacing="wide" color="whiteAlpha.900">
              Visit Us
            </Heading>

            <HStack align="start" spacing={3} color="whiteAlpha.800">
              <Box mt="1">
                <FaMapMarkerAlt />
              </Box>
              <Text>
                47 Maroela, Primrose,
                <br />
                Germiston, 1401
              </Text>
            </HStack>

            <Text color="whiteAlpha.700" fontSize="sm">
              Mon – Fri: 06:30 – 17:30
            </Text>

            <ChakraLink
              as={RouterLink}
              to="/location"
              fontWeight="bold"
              color="brand.primary"
              _hover={{ textDecoration: "none", opacity: 0.9 }}
            >
              View on Map →
            </ChakraLink>
          </VStack>
        </SimpleGrid>

        <Divider my={10} borderColor="whiteAlpha.200" />

        {/* CREDIT LINE */}
        <VStack spacing={2} textAlign="center">
          <Text fontSize="sm" color="whiteAlpha.700">
            Proudly South African 🇿🇦
          </Text>

          <Text fontSize="sm" color="whiteAlpha.700">
            Designed and developed by{" "}
            <Box as="span" fontWeight="bold" color="brand.primary">
              Thabang Rakeng
            </Box>{" "}
            •{" "}
            <Box as="span" fontWeight="bold" color="white">
              064 917 3328
            </Box>{" "}
            •{" "}
            <Box as="span" fontWeight="bold" color="white">
              thabang56@hotmail.com
            </Box>
          </Text>

          <Text fontSize="xs" color="whiteAlpha.600">
            © {new Date().getFullYear()} Flaviction Daycare Center. All rights reserved.
          </Text>
        </VStack>
      </Container>
    </Box>
  );
}
