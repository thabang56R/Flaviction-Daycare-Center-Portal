// src/components/common/MoodTracker.js
import React from 'react';
import { Box, Text } from '@chakra-ui/react';

const MoodTracker = ({ mood }) => (
  <Box>
    <Text>Today's Mood: {mood === 'happy' ? '😊' : '😢'}</Text>
  </Box>
);

export default MoodTracker;