import React from 'react';
import { Box } from '@chakra-ui/react';

export default function VideoPlayer() {
  return (
    <Box as="video" controls width="100%">
      <source src="" type="video/mp4" />
      Your browser does not support the video tag.
    </Box>
  );
}
