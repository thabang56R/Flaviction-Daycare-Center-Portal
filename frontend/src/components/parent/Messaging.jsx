// src/components/parent/Messaging.jsx
import React, { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Input,
  Button,
  Text,
  Avatar,
  Flex,
  Spacer,
  Heading,
} from '@chakra-ui/react';
import { ArrowForwardIcon, ChatIcon } from '@chakra-ui/icons';

const mockMessages = [
  { id: 1, sender: 'teacher', text: 'Good morning! Thabo was very happy today 😊', time: '09:15' },
  { id: 2, sender: 'parent', text: 'Thank you! Did he eat all his lunch?', time: '09:18' },
  { id: 3, sender: 'teacher', text: 'Yes, he loved the carrots today 🍅', time: '09:20' },
];

const Messaging = () => {
  const [messages, setMessages] = useState(mockMessages);
  const [newMessage, setNewMessage] = useState('');

  const handleSend = () => {
    if (!newMessage.trim()) return;
    const msg = {
      id: messages.length + 1,
      sender: 'parent',
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages([...messages, msg]);
    setNewMessage('');
  };

  return (
    <Box borderWidth="1px" borderRadius="lg" overflow="hidden" bg="white" boxShadow="md">
      <Heading size="md" p={4} bg="brand.primary" color="white">
        Messages with Teacher
      </Heading>

      <VStack spacing={3} p={4} align="stretch" maxH="400px" overflowY="auto">
        {messages.map((msg) => (
          <Flex
            key={msg.id}
            alignSelf={msg.sender === 'parent' ? 'flex-end' : 'flex-start'}
            maxW="80%"
          >
            {msg.sender !== 'parent' && <Avatar size="sm" mr={2} />}
            <Box
              bg={msg.sender === 'parent' ? 'brand.accent' : 'gray.100'}
              color={msg.sender === 'parent' ? 'black' : 'black'}
              p={3}
              borderRadius="lg"
              borderTopRightRadius={msg.sender === 'parent' ? 0 : 'lg'}
              borderTopLeftRadius={msg.sender === 'parent' ? 'lg' : 0}
            >
              <Text fontSize="sm">{msg.text}</Text>
              <Text fontSize="xs" opacity={0.7} mt={1} textAlign="right">
                {msg.time}
              </Text>
            </Box>
            {msg.sender === 'parent' && <Avatar size="sm" ml={2} />}
          </Flex>
        ))}
      </VStack>

      <HStack p={4} borderTopWidth="1px">
        <Input
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
        />
        <Button colorScheme="blue" onClick={handleSend}>
          <ChatIcon />
        </Button>
      </HStack>
    </Box>
  );
};

export default Messaging;