// src/components/parent/Announcements.jsx
import React from 'react';
import { Box, Heading, VStack, Text, Badge, Divider } from '@chakra-ui/react';

const announcements = [
  {
    title: 'School Closed – Human Rights Day',
    date: '2026-03-21',
    content: 'No classes on Human Rights Day. Enjoy the long weekend!',
    urgent: true,
  },
  {
    title: 'Photo Day Reminder',
    date: '2026-01-28',
    content: 'Please dress children in full uniform. Photos will be taken in the morning.',
    urgent: false,
  },
];

const Announcements = () => (
  <Box>
    <Heading size="md" mb={4}>School Announcements</Heading>

    <VStack spacing={4} align="stretch">
      {announcements.map((ann, index) => (
        <Box
          key={index}
          p={5}
          borderWidth="1px"
          borderRadius="lg"
          bg="white"
          boxShadow="sm"
          borderLeftWidth="4px"
          borderLeftColor={ann.urgent ? 'red.500' : 'blue.500'}
        >
          <Flex justify="space-between" align="center" mb={2}>
            <Heading size="sm">{ann.title}</Heading>
            {ann.urgent && <Badge colorScheme="red">Urgent</Badge>}
          </Flex>
          <Text fontSize="sm" color="gray.600" mb={2}>
            {ann.date}
          </Text>
          <Divider my={2} />
          <Text>{ann.content}</Text>
        </Box>
      ))}
    </VStack>
  </Box>
);

export default Announcements;