import React from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  HStack,
  VStack,
  Avatar,
  Badge,
  Divider,
} from "@chakra-ui/react";
import { motion, useInView } from "framer-motion";

const MotionBox = motion(Box);

const TeacherCard = ({ name, title, exp, bio, photo, accent = "warm" }) => {
  const ring = accent === "cool" ? "cyan.300" : "orange.300";
  const grad =
    accent === "cool"
      ? "linear(to-br, cyan.200, blue.300)"
      : "linear(to-br, yellow.200, orange.300, pink.200)";

  return (
    <Box
      p={6}
      borderRadius="22px"
      bg="rgba(255,255,255,0.72)"
      border="1px solid rgba(0,0,0,0.06)"
      boxShadow="0 18px 55px rgba(10,12,16,0.08)"
      backdropFilter="blur(10px)"
      transition="all 0.25s ease"
      _hover={{ transform: "translateY(-4px)", boxShadow: "0 24px 70px rgba(10,12,16,0.12)" }}
      position="relative"
      overflow="hidden"
    >
      {/* Decorative blob */}
      <Box
        position="absolute"
        top="-60px"
        right="-60px"
        w="180px"
        h="180px"
        borderRadius="full"
        bg="radial-gradient(circle at 30% 30%, rgba(144, 205, 244, 0.22), transparent 60%)"
        pointerEvents="none"
      />

      <HStack spacing={4} align="center">
        <Box position="relative">
          <Box
            position="absolute"
            inset="-5px"
            borderRadius="full"
            bgGradient={grad}
            opacity={0.95}
          />
          <Avatar
            src={photo}
            name={name}
            size="xl"
            border="5px solid rgba(255,255,255,0.85)"
            position="relative"
            boxShadow="0 16px 40px rgba(0,0,0,0.14)"
          />
        </Box>

        <VStack align="start" spacing={1} flex="1">
          <Text fontWeight="900" fontSize="lg" color="gray.900">
            {name}
          </Text>
          <Text fontSize="sm" color="gray.700" fontWeight="700">
            {title}
          </Text>
          <Badge
            mt={1}
            borderRadius="full"
            px={3}
            py={1}
            bg="blackAlpha.50"
            border="1px solid rgba(0,0,0,0.06)"
            fontWeight="900"
          >
            {exp}
          </Badge>
        </VStack>
      </HStack>

      <Divider my={5} borderColor="blackAlpha.200" />

      <Text color="gray.700" fontSize="sm" lineHeight="1.8" fontWeight="600">
        {bio}
      </Text>

      <HStack mt={5} spacing={2}>
        <Box w="10px" h="10px" borderRadius="full" bg={ring} opacity={0.9} />
        <Text fontSize="sm" color="gray.700" fontWeight="800">
          Caring • Patient • Qualified
        </Text>
      </HStack>
    </Box>
  );
};

export default function MeetTeachers() {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.25 });

  const teachers = [
    {
      name: "Ms. Choene",
      title: "Toddler Class Teacher",
      exp: "5+ Years Experience",
      bio: "Focused on nurturing routines, early communication, and confidence-building play.",
      photo: "/staff/teacher1.jpg",
      accent: "warm",
    },
    {
      name: "Mr./Ms. Malope",
      title: "Pre-School Educator",
      exp: "4+ Years Experience",
      bio: "Play-based learning, creativity, and structured development activities every day.",
      photo: "/staff/teacher2.jpg",
      accent: "cool",
    },
    {
      name: "Ms. Mashabela",
      title: "Grade R Facilitator",
      exp: "6+ Years Experience",
      bio: "Helping children get school-ready with language, number skills and social development.",
      photo: "/staff/teacher3.jpg",
      accent: "warm",
    },
    {
      name: "Ms. Mazibuko",
      title: "Assistant Teacher",
      exp: "3+ Years Experience",
      bio: "Supporting classroom learning, safety, and hygiene with care and patience.",
      photo: "/staff/teacher4.jpg",
      accent: "cool",
    },
  ];

  return (
    <Box py={{ base: 16, md: 22 }} position="relative" overflow="hidden">
      <Box
        position="absolute"
        inset={0}
        pointerEvents="none"
        bg="radial-gradient(circle at 18% 25%, rgba(251, 211, 141, 0.22), transparent 60%)"
      />
      <Box
        position="absolute"
        inset={0}
        pointerEvents="none"
        bg="radial-gradient(circle at 85% 35%, rgba(144, 205, 244, 0.20), transparent 60%)"
      />

      <Container maxW="container.lg">
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
            border="1px solid rgba(0,0,0,0.06)"
            fontWeight="900"
            letterSpacing="0.12em"
          >
            OUR TEAM
          </Badge>

          <Heading mt={4} fontSize={{ base: "3xl", md: "4xl" }} fontWeight="extrabold" color="gray.900">
            Meet our{" "}
            <Box as="span" bgGradient="linear(to-r, cyan.400, blue.400)" bgClip="text">
              caring teachers
            </Box>
            .
          </Heading>

          <Text mt={3} color="gray.700" maxW="70ch" lineHeight="1.8">
            Our passionate educators create a warm, supportive environment where your child can thrive.
             With years of experience and a focus on nurturing development, our team is dedicated to
             providing the best care and learning for your little one.
           
         </Text>

          <SimpleGrid mt={10} columns={{ base: 1, md: 2 }} spacing={6}>
            {teachers.map((t) => (
              <TeacherCard key={t.name + t.title} {...t} />
            ))}
          </SimpleGrid>
        </MotionBox>
      </Container>
    </Box>
  );
}

