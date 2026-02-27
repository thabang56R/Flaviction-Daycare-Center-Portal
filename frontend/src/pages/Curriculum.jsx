// src/pages/Curriculum.jsx
import React from 'react';
import { Box, Container, Heading, Text, VStack, SimpleGrid } from '@chakra-ui/react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import DailyRoutine from '../components/common/DailyRoutine';

const Curriculum = () => (
  <Box py={16} bg="orange" bgImage="url('/bg 3.jpeg')"
      bgSize="cover"
      bgPosition="centre">
    <Header />
    <Container maxW="container.lg">
      <VStack spacing={10} textAlign="center">
        <Heading size="3xl" color="green">
          Our Curriculum
        </Heading>

        <Text fontSize="lg">
          We follow a play-based, holistic curriculum that nurtures every aspect of child development.
        </Text>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
          <Box p={6} borderWidth="1px" borderRadius="lg" boxShadow="md">
            <Heading size="md" mb={4}>Language & Communication</Heading>
            <Text>Story time, songs, group discussions, and early literacy activities.</Text>
          </Box>

          <Box p={6} borderWidth="1px" borderRadius="lg" boxShadow="md">
            <Heading size="md" mb={4}>Mathematics & Problem Solving</Heading>
            <Text>Counting games, shapes, patterns, and basic numeracy through play.</Text>
          </Box>

          <Box p={6} borderWidth="1px" borderRadius="lg" boxShadow="md">
            <Heading size="md" mb={4}>Life Skills & Social Development</Heading>
            <Text>Sharing, emotions, independence, and group cooperation activities.</Text>
          </Box>

          <Box p={6} borderWidth="1px" borderRadius="lg" boxShadow="md">
            <Heading size="md" mb={4}>Creative Arts & Physical Development</Heading>
            <Text>Painting, music, dance, outdoor play, and gross/fine motor skills.</Text>
          </Box>
        </SimpleGrid>
      </VStack>
    </Container>
    <DailyRoutine />
    <Footer />
  </Box>
);

export default Curriculum;