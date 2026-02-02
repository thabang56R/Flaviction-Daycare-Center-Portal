// src/components/parent/ChildProfile.js
import React from 'react';
import { Box, Heading, Text, Avatar, Flex } from '@chakra-ui/react';
import AchievementBadge from '../common/Badge';

const ChildProfile = () => {
  const child = { name: 'Little Smiley', photo: 'url', class: 'Toddlers', teacher: 'Ms. Joy', badges: ['Math Whiz'] };

  return (
    <Box mb={8}>
      <Heading size="md">Child Profile</Heading>
      <Flex align="center" gap={4} mt={4}>
        <Avatar src={child.photo} size="xl" />
        <Box>
          <Text fontWeight="bold">{child.name}</Text>
          <Text>Class: {child.class}</Text>
          <Text>Teacher: {child.teacher}</Text>
          <Flex gap={2} mt={2}>
            {child.badges.map((b) => <AchievementBadge key={b} label={b} />)}
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
};

export default ChildProfile;