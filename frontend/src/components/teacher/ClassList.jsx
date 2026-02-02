// src/components/teacher/ClassList.jsx
import React, { useState } from 'react';
import {
  Box,
  Heading,
  SimpleGrid,
  Flex,
  Avatar,
  Text,
  Badge,
  Input,
  InputGroup,
  InputLeftElement,
  IconButton,
  HStack,
  Tooltip,
  useToast,
  Divider,
  VStack,
} from '@chakra-ui/react';
import { SearchIcon, CheckIcon, CloseIcon, ChatIcon, InfoIcon } from '@chakra-ui/icons';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

const mockStudents = [
  {
    id: 1,
    name: 'Thabo Mokoena',
    age: 4,
    photo: 'https://images.unsplash.com/photo-1503454537195-1dcabb9d2a69?w=150',
    parent: 'Thandi Mokoena',
    parentPhone: '+27 82 123 4567',
    attendance: 'present', // 'present', 'absent', 'not-marked'
  },
  {
    id: 2,
    name: 'Amahle Nkosi',
    age: 5,
    photo: 'https://images.unsplash.com/photo-1588075592446-265fd1e6e76f?w=150',
    parent: 'Sipho Nkosi',
    parentPhone: '+27 83 987 6543',
    attendance: 'not-marked',
  },
  {
    id: 3,
    name: 'Lethabo van der Merwe',
    age: 4,
    photo: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=150',
    parent: 'Elize van der Merwe',
    parentPhone: '+27 76 555 4321',
    attendance: 'absent',
  },
  {
    id: 4,
    name: 'Karabo Sithole',
    age: 5,
    photo: 'https://images.unsplash.com/photo-1503454537195-1dcabb9d2a69?w=150',
    parent: 'Ntombi Sithole',
    parentPhone: '+27 79 111 2222',
    attendance: 'present',
  },
  // Add more as needed...
];

const ClassList = () => {
  const [students, setStudents] = useState(mockStudents);
  const [searchTerm, setSearchTerm] = useState('');
  const toast = useToast();

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const markAttendance = (id, status) => {
    setStudents(
      students.map((s) =>
        s.id === id ? { ...s, attendance: status } : s
      )
    );

    toast({
      title: `Marked as ${status}`,
      description: `Student attendance updated`,
      status: status === 'present' ? 'success' : 'warning',
      duration: 3000,
      isClosable: true,
    });
  };

  const getAttendanceBadge = (status) => {
    switch (status) {
      case 'present':
        return <Badge colorScheme="green">Present</Badge>;
      case 'absent':
        return <Badge colorScheme="red">Absent</Badge>;
      default:
        return <Badge colorScheme="gray">Not marked</Badge>;
    }
  };

  return (
    <Box>
      <Flex justify="space-between" align="center" mb={6} flexWrap="wrap" gap={4}>
        <Heading size="md">Class List – Toddlers Group</Heading>

        <InputGroup maxW="320px">
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="gray.400" />
          </InputLeftElement>
          <Input
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            borderRadius="full"
          />
        </InputGroup>
      </Flex>

      {filteredStudents.length === 0 ? (
        <Text textAlign="center" color="gray.500" py={10}>
          No students found matching "{searchTerm}"
        </Text>
      ) : (
        <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={6}>
          {filteredStudents.map((student) => (
            <MotionBox
              key={student.id}
              whileHover={{ y: -6, boxShadow: 'xl' }}
              transition={{ duration: 0.3 }}
              bg="white"
              borderRadius="2xl"
              overflow="hidden"
              boxShadow="md"
              borderWidth="1px"
              borderColor="gray.200"
            >
              <Flex direction="column" align="center" p={5}>
                <Avatar
                  src={student.photo}
                  size="xl"
                  mb={4}
                  border="4px solid"
                  borderColor={
                    student.attendance === 'present'
                      ? 'green.400'
                      : student.attendance === 'absent'
                      ? 'red.400'
                      : 'gray.300'
                  }
                />

                <Heading size="md" mb={1}>
                  {student.name}
                </Heading>

                <Text fontSize="sm" color="gray.600" mb={2}>
                  Age {student.age}
                </Text>

                <Box mb={4}>{getAttendanceBadge(student.attendance)}</Box>

                <Divider mb={4} />

                <VStack spacing={3} w="full">
                  <Tooltip label="Parent contact">
                    <Text fontSize="sm" color="gray.700">
                      Parent: {student.parent}
                    </Text>
                  </Tooltip>

                  <Text fontSize="xs" color="gray.500">
                    {student.parentPhone}
                  </Text>

                  <HStack spacing={3} mt={3}>
                    <Tooltip label="Mark Present">
                      <IconButton
                        icon={<CheckIcon />}
                        colorScheme="green"
                        variant="outline"
                        size="sm"
                        borderRadius="full"
                        onClick={() => markAttendance(student.id, 'present')}
                        aria-label="Mark present"
                        isDisabled={student.attendance === 'present'}
                      />
                    </Tooltip>

                    <Tooltip label="Mark Absent">
                      <IconButton
                        icon={<CloseIcon />}
                        colorScheme="red"
                        variant="outline"
                        size="sm"
                        borderRadius="full"
                        onClick={() => markAttendance(student.id, 'absent')}
                        aria-label="Mark absent"
                        isDisabled={student.attendance === 'absent'}
                      />
                    </Tooltip>

                    <Tooltip label="Send message to parent">
                      <IconButton
                        icon={<ChatIcon />}
                        colorScheme="blue"
                        variant="outline"
                        size="sm"
                        borderRadius="full"
                        aria-label="Message parent"
                      />
                    </Tooltip>

                    <Tooltip label="View full profile">
                      <IconButton
                        icon={<InfoIcon />}
                        colorScheme="purple"
                        variant="outline"
                        size="sm"
                        borderRadius="full"
                        aria-label="View profile"
                      />
                    </Tooltip>
                  </HStack>
                </VStack>
              </Flex>
            </MotionBox>
          ))}
        </SimpleGrid>
      )}

      <Text fontSize="sm" color="gray.500" mt={8} textAlign="center">
        Total students: {filteredStudents.length} / {students.length}
      </Text>
    </Box>
  );
};

export default ClassList;