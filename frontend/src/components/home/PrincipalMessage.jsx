import React from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Avatar,
  Badge,
  Divider,
  SimpleGrid,
} from "@chakra-ui/react";
import { motion, useInView } from "framer-motion";

const MotionBox = motion(Box);
const MotionVStack = motion(VStack);

const PrincipalMessage = () => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.25 });

  return (
    <Box position="relative" py={{ base: 16, md: 24 }} overflow="hidden">
      {/* Decorative background glow */}
      <Box
        position="absolute"
        inset={0}
        pointerEvents="none"
        bg="radial-gradient(circle at 20% 20%, rgba(251, 211, 141, 0.16), transparent 55%)"
      />
      <Box
        position="absolute"
        inset={0}
        pointerEvents="none"
        bg="radial-gradient(circle at 85% 40%, rgba(144, 205, 244, 0.16), transparent 60%)"
      />

      <Container maxW="container.lg">
        <MotionBox
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9 }}
        >
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={{ base: 10, md: 12 }} alignItems="center">
            {/* LEFT: Photo + small card */}
            <MotionBox
              initial={{ opacity: 0, x: -18 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.9, delay: 0.05 }}
            >
              <Box
                position="relative"
                borderRadius="28px"
                p={{ base: 6, md: 8 }}
                bg="white"
                border="1px solid rgba(255,255,255,0.16)"
                backdropFilter="blur(14px)"
                boxShadow="0 18px 70px rgba(0,0,0,0.18)"
                _hover={{
                  transform: "translateY(-2px)",
                  boxShadow: "0 22px 90px rgba(0,0,0,0.22)",
                }}
                transition="all 0.25s ease"
              >
                {/* Glow ring */}
                <Box
                  position="absolute"
                  top="-18px"
                  left="-18px"
                  w="140px"
                  h="140px"
                  borderRadius="full"
                  bg="radial-gradient(circle at 30% 30%, rgba(251, 211, 141, 0.85), transparent 60%)"
                  filter="blur(12px)"
                  opacity={0.55}
                />

                <HStack spacing={5} align="center">
                  <Box position="relative">
                    {/* Outer ring */}
                    <Box
                      position="absolute"
                      inset="-6px"
                      borderRadius="full"
                      bgGradient="linear(to-br, yellow.300, orange.300, pink.300)"
                      filter="blur(0px)"
                      opacity={0.95}
                    />
                    {/* Avatar */}
                    <Avatar
                      src="/staff/principal.jpg"
                      name="Principal"
                      size="2xl"
                      border="6px solid rgba(10,12,16,0.55)"
                      boxShadow="0 16px 40px rgba(0,0,0,0.25)"
                      position="relative"
                    />
                  </Box>

                  <VStack align="start" spacing={1} flex="1">
                    <Badge
                      px={3}
                      py={1}
                      borderRadius="full"
                      bg="blackAlpha.300"
                      border="1px solid rgba(255,255,255,1)"
                      color="black"
                      fontWeight="800"
                      letterSpacing="0.08em"
                    >
                      MESSAGE FROM THE PRINCIPAL
                    </Badge>

                    <Text fontSize="xl" fontWeight="900">
                      [Principal Name]
                    </Text>
                    <Text fontSize="sm" opacity={0.85}>
                      Principal • Flaviction Daycare Center
                    </Text>
                  </VStack>
                </HStack>

                <Divider my={6} borderColor="whiteAlpha.300" />

                <Text fontSize="sm" opacity={0.9} lineHeight="1.8">
                  “Every child is capable of amazing growth when they feel safe, loved, and encouraged.”
                </Text>

                <HStack mt={5} spacing={3} opacity={0.92}>
                  <Box w="10px" h="10px" borderRadius="full" bg="yellow.300" />
                  <Text fontSize="sm" fontWeight="700">
                    Safe routines • Caring teachers • Joyful learning
                  </Text>
                </HStack>
              </Box>
            </MotionBox>

            {/* RIGHT: Main message */}
            <MotionVStack
              align="start"
              spacing={5}
              initial={{ opacity: 0, x: 18 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.9, delay: 0.1 }}
            >
              <Heading fontSize={{ base: "3xl", md: "4xl" }} fontWeight="extrabold" lineHeight="short">
                A warm welcome to our{" "}
                <Box as="span" bgGradient="linear(to-r, yellow.600, orange.700)" bgClip="text">
                  Flaviction family
                </Box>
                .
              </Heading>

              <Box
                position="relative"
                borderRadius="24px"
                p={{ base: 6, md: 7 }}
                bg="silver"
                border="1px solid rgba(255,255,255,0.14)"
                backdropFilter="blur(12px)"
              >
                {/* Quote mark */}
                <Text
                  position="absolute"
                  top="-22px"
                  left="14px"
                  fontSize="64px"
                  lineHeight="1"
                  opacity={0.22}
                  fontWeight="900"
                >
                  “
                </Text>

                <Text fontSize={{ base: "md", md: "lg" }} lineHeight="1.9" opacity={0.92}>
                  At Flaviction Daycare Center, we believe early childhood is where confidence begins.
                  Our goal is to create a safe, nurturing space where children feel seen, supported, and
                  excited to learn—through play, structured activities, and meaningful routines.
                </Text>

                <Text mt={4} fontSize={{ base: "md", md: "lg" }} lineHeight="1.9" opacity={0.92}>
                  We partner with parents to build strong foundations in communication, creativity, and
                  social skills. Thank you for trusting us with what matters most—your child’s growth
                  and happiness.
                </Text>

                {/* Signature */}
                <Box mt={6}>
                  <Text fontWeight="900" fontSize="lg">
                    [Principal Name]
                  </Text>
                  <Text fontSize="sm" opacity={0.8}>
                    Principal, Flaviction Daycare Center
                  </Text>
                </Box>
              </Box>

              {/* Mini highlights */}
              <HStack spacing={3} flexWrap="wrap">
                {["Safe Environment", "Play-Based Learning", "Caring Staff", "Parent Partnership"].map((t) => (
                  <Box
                    key={t}
                    px={4}
                    py={2}
                    borderRadius="999px"
                    bg="green"
                    border="1px solid rgba(255,255,255,0.14)"
                    fontSize="sm"
                    fontWeight="800"
                    _hover={{ bg: "whiteAlpha.200" }}
                    transition="all 0.2s ease"
                  >
                    {t}
                  </Box>
                ))}
              </HStack>
            </MotionVStack>
          </SimpleGrid>
        </MotionBox>
      </Container>
    </Box>
  );
};

export default PrincipalMessage;