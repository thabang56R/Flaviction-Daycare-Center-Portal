// src/pages/FAQ.jsx
import React from 'react';
import {
  Box,
  Container,
  Heading,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Text,
  VStack,
  Link as ChakraLink, 
} from '@chakra-ui/react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';


const faqItems = [
  {
    question: 'What ages do you accept?',
    answer:
      'We cater for children from 3 months (Baby Care) up to Grade R (6 years), and aftercare for primary school children.',
  },
  {
    question: 'What are your operating hours?',
    answer:
      'Monday to Friday: 6:30 AM – 5:30 PM. We offer half-day and full-day options.',
  },
  {
    question: 'Do you provide meals?',
    answer:
      'Yes, we offer nutritious meals and snacks. All dietary requirements are catered for with advance notice.',
  },
  {
    question: 'What is your curriculum based on?',
    answer:
      'Our curriculum follows the South African National Early Learning Development Standards (NELDS) with a play-based, child-centered approach.',
  },
  {
    question: 'How do I enrol my child?',
    answer:
      'Contact us via the form on the Contact page or call the head office. We’ll arrange a tour and complete registration.',
  },
  {
    question: 'What safety measures are in place?',
    answer:
      'CCTV monitoring, secure entry, qualified staff, daily health checks, and strict hygiene protocols.',
  },
];

const FAQ = () => (
  <Box py={16} bg="white" pg="pink"
      bgImage="url('/bg 3.jpeg')"
      bgSize="cover"
      bgPosition="centre">
    <Header />
    <Container maxW="container.lg">
      <VStack spacing={10}>
        <Heading size="3xl" color="brand.lightbg" textAlign="center">
          Frequently Asked Questions
        </Heading>

        <Text fontSize="xl" color="gray.700" textAlign="center" maxW="3xl">
          Find quick answers to common questions about Flaviction DayCare Center.
        </Text>

        <Accordion allowMultiple w="full" defaultIndex={[0]}>
          {faqItems.map((item, index) => (
            <AccordionItem key={index} borderRadius="lg" mb={4} boxShadow="sm">
              <AccordionButton
                bg="gray.50"
                _hover={{ bg: 'brand.lightBg' }}
                borderRadius="lg"
                py={4}
              >
                <Box flex="1" textAlign="left" fontWeight="bold">
                  {item.question}
                </Box>
                <AccordionIcon fontSize="2xl" />
              </AccordionButton>

              <AccordionPanel pb={6} px={6} bg="gray.50" borderRadius="lg">
                <Text color="gray.700">{item.answer}</Text>
              </AccordionPanel>
            </AccordionItem>
          ))}
        </Accordion>

        <Text fontSize="lg" mt={8}>
          Still have questions?{' '}
          <ChakraLink href="/contact" color="brand.lightbg" fontWeight="bold">
            Contact us →
          </ChakraLink>
        </Text>
      </VStack>
    </Container>
    <Footer />
  </Box>
);

export default FAQ;
