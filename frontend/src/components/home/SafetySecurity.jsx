import React from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  HStack,
  VStack,
  Badge,
} from "@chakra-ui/react";
import { motion, useInView } from "framer-motion";

const MotionBox = motion(Box);

const SafetyCard = ({ title, desc, icon, accent = "warm" }) => {
  const grad =
    accent === "cool"
      ? "linear(to-br, cyan.200, blue.300)"
      : "linear(to-br, yellow.200, orange.300)";

  return (
    <Box
      p={6}
      borderRadius="22px"
      bg="rgba(255,255,255,0.10)"
      border="1px solid rgba(255,255,255,0.16)"
      backdropFilter="blur(14px)"
      boxShadow="0 18px 60px rgba(0,0,0,0.18)"
      transition="all 0.25s ease"
      _hover={{ transform: "translateY(-4px)", bg: "rgba(255,255,255,0.14)" }}
    >
      <HStack spacing={4} align="start">
        <Box
          w="46px"
          h="46px"
          borderRadius="16px"
          bgGradient={grad}
          display="grid"
          placeItems="center"
          boxShadow="0 14px 30px rgba(0,0,0,0.20)"
          flexShrink={0}
        >
          <Text fontSize="20px" fontWeight="900" color="gray.900">
            {icon}
          </Text>
        </Box>

        <VStack align="start" spacing={1}>
          <Text fontWeight="900" fontSize="lg" color="white">
            {title}
          </Text>
          <Text color="whiteAlpha.800" lineHeight="1.7" fontSize="sm">
            {desc}
          </Text>
        </VStack>
      </HStack>
    </Box>
  );
};

export default function SafetySecurity() {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.25 });

  const items = [
    { title: "Controlled Access", desc: "Secure entry procedures and child handover protocols.", icon: "🔐", accent: "cool" },
    { title: "Supervised Play", desc: "Active monitoring during indoor and outdoor activities.", icon: "👀", accent: "warm" },
    { title: "Hygiene & Sanitising", desc: "Daily cleaning routines and child-safe hygiene standards.", icon: "🧼", accent: "cool" },
    { title: "First Aid Ready", desc: "Staff trained to respond quickly and responsibly.", icon: "⛑️", accent: "warm" },
    { title: "Safe Facilities", desc: "Child-friendly classrooms and safe outdoor play areas.", icon: "🏫", accent: "cool" },
    { title: "Emergency Procedures", desc: "Prepared plans and parent communication when needed.", icon: "📣", accent: "warm" },
  ];

  return (
    <Box position="relative" py={{ base: 16, md: 22 }} overflow="hidden">
      {/* Dark premium background */}
      <Box
        position="absolute"
        inset={0}
        bgGradient="linear(to-br, #070A12, #0B1020, #070A12)"
      />
      {/* colorful premium glows */}
      <Box
        position="absolute"
        inset={0}
        pointerEvents="none"
        bg="radial-gradient(circle at 20% 30%, rgba(251, 211, 141, 0.20), transparent 60%)"
      />
      <Box
        position="absolute"
        inset={0}
        pointerEvents="none"
        bg="radial-gradient(circle at 85% 35%, rgba(144, 205, 244, 0.18), transparent 60%)"
      />

      <Container maxW="container.lg" position="relative" zIndex={1}>
        <MotionBox
          ref={ref}
          initial={{ opacity: 0, y: 22 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <Badge
            borderRadius="full"
            px={4}
            py={2}
            bg="orange"
            border="1px solid rgba(255,255,255,0.16)"
            color="white"
            fontWeight="900"
            letterSpacing="0.12em"
          >
            SAFETY & SECURITY
          </Badge>

          <Heading mt={4} fontSize={{ base: "3xl", md: "4xl" }} fontWeight="extrabold" color="white">
            Your child’s safety is{" "}
            <Box as="span" bgGradient="linear(to-r, yellow.300, orange.300)" bgClip="text">
              our priority
            </Box>
            .
          </Heading>

          <Text mt={3} color="whiteAlpha.800" maxW="75ch" lineHeight="1.8">
            A premium school experience starts with trust. We maintain clear routines, safe facilities,
            and strong supervision so parents feel confident every day.
          </Text>

          <SimpleGrid mt={10} columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
            {items.map((i) => (
              <SafetyCard key={i.title} {...i} />
            ))}
          </SimpleGrid>
        </MotionBox>
      </Container>
    </Box>
  );
}