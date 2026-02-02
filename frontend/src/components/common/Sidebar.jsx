// src/components/common/Sidebar.js
import React from 'react';
import { Box, VStack, Link } from '@chakra-ui/react';

const Sidebar = ({ role, items }) => (
  <Box w="250px" bg="white" p={6} borderRight="1px solid" borderColor="gray.200" h="full">
    <VStack align="stretch" spacing={4}>
      {items.map((item) => (
        <Link key={item.text} href={item.link} fontWeight="medium">
          {item.text}
        </Link>
      ))}
    </VStack>
  </Box>
);

export default Sidebar;