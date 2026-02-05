// src/pages/Contact.jsx
import React from 'react';
import { Box, Container, Heading, Text, VStack, FormControl, FormLabel, Input, Textarea, Button } from '@chakra-ui/react';
import { motion, useInView } from 'framer-motion';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

const MotionBox = motion(Box);

const Contact = () => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <Box bg="brand.lightBg" minH="100vh" bgImage="url('/bg 3.jpeg')"
      bgSize="cover"
      bgPosition="centre">
      <Header />

      <Container maxW="container.md" py={16} pg="pink"
      >
        <VStack spacing={10}>
          <MotionBox
            ref={ref}
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            textAlign="center"
          >
            <Heading size="3xl" color="black" mb={6}>
              Contact Us
            </Heading>
            <Text fontSize="xl" color="gray.700">
              We'd love to hear from you! Get in touch for enrolments, tours, or any questions.
            </Text>
          </MotionBox>

          <MotionBox
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            w="full"
            p={8}
            bg="white"
            borderRadius="2xl"
            boxShadow="lg"
          >
            <VStack spacing={6} as="form">
              <FormControl>
                <FormLabel>Name</FormLabel>
                <Input placeholder="Your name" size="lg" />
              </FormControl>

              <FormControl>
                <FormLabel>Email</FormLabel>
                <Input type="email" placeholder="your@email.com" size="lg" />
              </FormControl>

              <FormControl>
                <FormLabel>Message</FormLabel>
                <Textarea placeholder="How can we help?" rows={6} size="lg" />
              </FormControl>
              <a href={'mailto:daycarecentreflaviction.co.za'} target="+27 79 986 3317">

              <Button colorScheme="blue" size="lg" w="full">
                Send Message
              </Button>
              </a>
            </VStack>
          </MotionBox>

          <VStack spacing={4} textAlign="center" color='white'>
            <Text fontSize="lg">
              Email: daycarecentreflaviction.co.za
            </Text>
            <Text fontSize="lg">
              Phone: +27 79 986 3317
            </Text>
          </VStack>
        </VStack>
      </Container>

      <Footer />
    </Box>
  );
};

export default Contact;