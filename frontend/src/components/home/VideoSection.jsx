// src/components/home/VideoSection.jsx
import React from 'react';
import { Box, Container, Heading, Text, VStack } from '@chakra-ui/react';
import { motion, useInView } from 'framer-motion';

// ✅ Import your real video component here (rename it)
import VideoPlayer from './VideoPlayer'; 

const MotionBox = motion(Box);

const VideoSection = () => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <MotionBox
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.8 }}
      py={{ base: 12, md: 20 }}
      bg="brand.lightBg"
    >
      <Container maxW="container.md" textAlign="center">
        <VStack spacing={8}>
          <Heading size={{ base: '2xl', md: '3xl' }} color="brand.primary">
            Flavious Moments Video Corner
          </Heading>

          <Text fontSize={{ base: 'lg', md: 'xl' }} color="gray.700">
            Watch our little ones laugh, learn, and grow every day!
          </Text>

          <Box
            w="full"
            maxW="800px"
            mx="auto"
            borderRadius="2xl"
            overflow="hidden"
            boxShadow="2xl"
            borderWidth="4px"
            borderColor="brand.primary"
          >
            
            <VideoPlayer />
          </Box>
        </VStack>
      </Container>
    </MotionBox>
  );
};

export default VideoSection;
