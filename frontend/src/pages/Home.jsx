// src/pages/Home.jsx

import React from 'react';
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  HStack,
  Image,
  Link as ChakraLink,
  SimpleGrid,
  Text,
  VStack,
  useBreakpointValue,
  Avatar,
} from '@chakra-ui/react';
import { motion, useInView } from 'framer-motion';
import { Link as RouterLink } from "react-router-dom";
import { FaFacebook, FaInstagram, FaWhatsapp, FaYoutube, FaPhone } from 'react-icons/fa';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import PartnersSection from '../components/home/PartnersSection';
import TestimonialsSection from '../components/home/TestimonialsSection';
import EnrollAndPay from '../pages/EnrollAndPay';



// Animated wrappers (MUST be defined)
const MotionBox = motion(Box);
const MotionVStack = motion(VStack);
const MotionHeading = motion(Heading);
const MotionText = motion(Text);
const MotionFlex = motion(Flex);

// Services data (define here so Programs can use it)
const services = [
  {
    title: 'Baby Care',
    description: 'The services our Baby Care Centre offers address all the age-appropriate milestones and developmental needs your little one has.',
    image: 'babycare.jfif',
    bg: 'pink.100',
  },
  {
    title: 'Preschool (Toddlers)',
    description: 'By following our daily structured preschool learning program, we enable toddlers to develop on personal, social, and emotional levels.',
    image: 'preschool.jfif',
    bg: 'teal.100',
  },
  {
    title: 'Grade R',
    description: 'Our Grade R curriculum provides abundant opportunities for exploration and learning. Continuous assessments guarantee progress.',
    image: 'grade r.jfif',
    bg: 'purple.100',
  },
  {
    title: 'Aftercare',
    description: 'Aftercare is designed to assist primary school children with homework, study time and learning methods in a safe environment.',
    image: 'aftercare.jfif',
    bg: 'green.100',
  },
];



// Hero Component
const Hero = () => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <MotionBox
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1 }}
      bgImage={`url('images.jfif')`}
      bgSize="cover"
      bgPos="center"
      color="white"
      py={{ base: 24, md: 40 }}
      textAlign="center"
      position="relative"
    >
      <Container maxW="container.lg" position="relative" zIndex={2}>
        <MotionVStack
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.1 }}
          spacing={{ base: 6, md: 8 }}
        >
          <Heading
            as="h1"
            fontSize={{ base: '4xl', md: '6xl', lg: '7xl' }}
            lineHeight="shorter"
            fontWeight="extrabold"
            textShadow="2px 4px 12px rgba(0,0,0,0.5)"
          >
            <Image
            src="/image.jpg (3).jpg" 
            alt="Flaviction Daycare Logo"
            boxSize={{ base: '160px', md: '180px' }}
            objectFit="contain"
            fallbackSrc="https://via.placeholder.com/80?text=Logo"
            borderRadius="full"
            margin='0 auto'
          />
            Welcome to <div style={{color:'gold'}}>Flaviction</div> <div style={{color:'black'}}>DayCare Center</div>
          </Heading>

          <MotionText
            fontSize={{ base: 'xl', md: '2xl' }}
            fontWeight="medium"
            whileHover={{ scale: 1.05, color: 'yellow.300' }}
            transition={{ duration: 0.3 }}
          >
            <div style={{color:'white'}}>Raising Happy Hearts 💛 </div>&<div style={{color:'black'}}>⭐Bright Minds!</div>
          </MotionText>

          <MotionText
            fontSize={{ base: 'lg', md: 'xl' }}
            maxW="3xl"
            mx="auto"
            opacity={0.95}
            whileHover={{ scale: 1.05, color: 'yellow.300' }}
            transition={{ duration: 0.3 }}
          >
            <div style={{color:'green'}}>Baby Care • Preschool • Grade R • Aftercare </div>— <div style={{color:'black'}}>Your Child's Home Away from Home</div>
          </MotionText>

          <Flex gap={5} wrap="wrap" justify="center">
            <Button
  as={RouterLink}
  to="/enroll"
  size="xl"
  px={12}
  py={8}
  fontSize="2xl"
  bg="white"
  color="brand.accent"
  _hover={{ bg: "orange.200" }}
  rounded="full"
  shadow="xl"
>
  Enroll Today →
</Button>
            <Button
  as={RouterLink}
  to="/location"
  size="xl"
  px={12}
  py={8}
  fontSize="2xl"
  bg="white"
  color="black"
  _hover={{ bg: "orange.200" }}
  rounded="full"
  shadow="xl"
>
  Take a Tour →
</Button>
          </Flex>
        </MotionVStack>
      </Container>
    </MotionBox>
  );
};

// Programs Component
const Programs = () => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <Box ref={ref} py={{ base: 16, md: 24 }} bg="white">
      <Container maxW="container.xl">
        <MotionHeading
          textAlign="center"
          mb={12}
          color="black"
          fontSize={{ base: '4xl', md: '5xl' }}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          Our Programs {" "}
              <Box as="span" color="brand.primary">
                At Flaviction
              </Box>
        </MotionHeading>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8}>
          {services.map((service, i) => (
            <MotionBox
              key={service.title}
              initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: i * 0.2, duration: 0.7 }}
              bg={service.bg}
              borderRadius="2xl"
              overflow="hidden"
              boxShadow="xl"
            >
              <Image src={service.image} alt={service.title} h="220px" objectFit="cover" w="100%" />
              <Box p={6}>
                <Heading size="md" color="brand.accent" mb={3}>
                  {service.title}
                </Heading>
                <MotionText
                  color="gray.600"
                  mb={4}
                  noOfLines={3}
                  whileHover={{ scale: 1.05, color: 'brand.primary' }}
                  transition={{ duration: 0.3 }}
                >
                  {service.description}
                </MotionText>
                <ChakraLink color="brand.primary" fontWeight="semibold">
                  read more...
                </ChakraLink>
              </Box>
            </MotionBox>
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  );
};

// WhyChooseUs Component
const WhyChooseUs = () => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <Box ref={ref} py={{ base: 16, md: 24 }} bgGradient="linear(to-b, white, brand.lightBg)">
      <Container maxW="container.lg">
        <MotionVStack
          spacing={8}
          textAlign="center"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <Heading size={{ base: "xl", md: "2xl" }} color="gray.900">
              What set OurSelves Apart{" "}
              <Box as="span" color="brand.primary">
                At Flaviction
              </Box>
          </Heading>
          <Text fontSize="xl" fontWeight="medium" color="brand.accent">
            Raising the daycare benchmark with love, learning, and laughter!
          </Text>

          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} mt={6} maxW="900px" mx="auto">
            {[
              'Play-based, high-quality early childhood education',
              'Caring, qualified teachers who treat every child like family',
              'Safe, stimulating Winnie the Pooh-themed environment',
              'Regular quality checks and open parent communication',
              'Focus on emotional, social, and academic growth',
              'Warm, heart-centered approach to every little one',
            ].map((point, i) => (
              <MotionFlex
                key={i}
                align="flex-start"
                gap={4}
                initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <Text fontSize="2xl">⭐</Text>
                <MotionText
                  fontSize="lg"
                  whileHover={{ scale: 1.05, color: 'brand.primary' }}
                  transition={{ duration: 0.3 }}
                >
                  {point}
                </MotionText>
              </MotionFlex>
            ))}
          </SimpleGrid>
        </MotionVStack>
      </Container>
    </Box>
  );
};

// CTA Banner Component
const CTABanner = () => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <MotionBox
      ref={ref}
      bgGradient="linear(to-r, brand.gold, brand.accent)"
      color="white"
      py={{ base: 20, md: 28 }}
      textAlign="center"
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8 }}
    >
      <Container maxW="container.md">
        <VStack spacing={8}>
          <Heading fontSize={{ base: '4xl', md: '6xl' }}>Enrolments for {new Date().getFullYear()}  Are Open At{" "}
              <Box as="span" color="black">
                 Flaviction Daycare Center!
              </Box></Heading>
          <Text fontSize={{ base: 'xl', md: '2xl' }}>
            Give your child the gift of joyful learning and warm care
          </Text>
          <Button
  as={RouterLink}
  to="/enroll"
  size="xl"
  px={12}
  py={8}
  fontSize="2xl"
  bg="white"
  color="brand.accent"
  _hover={{ bg: "gray.100" }}
  rounded="full"
  shadow="xl"
>
  Enroll Today →
</Button>
        </VStack>
      </Container>
    </MotionBox>
  );
};

// PartnersSection Component
<PartnersSection />

// Home Page Assembly
const Home = () => {
  return (
    <Box bg="brand.primary" minH="100vh" 
      
      
      
      
      
      
      >
      <Header />
      <Hero />
      <Programs />
      <WhyChooseUs />
      {/*<VideoSection />*/}
      <PartnersSection />
      <TestimonialsSection />
      <CTABanner />
      <Footer />
    </Box>
  );
};

export default Home;