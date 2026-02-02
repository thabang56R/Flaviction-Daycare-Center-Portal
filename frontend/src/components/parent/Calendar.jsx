// src/components/parent/Calendar.jsx
import React from 'react';
import { Box, Heading, SimpleGrid, Text, Badge } from '@chakra-ui/react';
import { Calendar as ReactCalendar } from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // you need to install react-calendar or use @chakra-ui date picker

const events = {
  '2026-01-28': 'School Photos Day',
  '2026-02-05': 'Parent Meeting 18:00',
  '2026-02-14': "Valentine's Craft Day",
};

const CalendarComponent = () => {
  return (
    <Box>
      <Heading size="md" mb={4}>School Calendar</Heading>

      <Box borderWidth="1px" borderRadius="lg" p={4} bg="white" boxShadow="md">
        <ReactCalendar
          tileContent={({ date, view }) =>
            view === 'month' &&
            events[date.toISOString().split('T')[0]] && (
              <Badge colorScheme="purple" fontSize="xs" mt={1}>
                Event
              </Badge>
            )
          }
        />
      </Box>

      <Box mt={6}>
        <Heading size="sm" mb={3}>Upcoming Events</Heading>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
          {Object.entries(events).map(([date, title]) => (
            <Box key={date} p={3} borderWidth="1px" borderRadius="md" bg="gray.50">
              <Text fontWeight="bold">{title}</Text>
              <Text fontSize="sm" color="gray.600">
                {new Date(date).toLocaleDateString('en-ZA', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </Text>
            </Box>
          ))}
        </SimpleGrid>
      </Box>
    </Box>
  );
};

export default CalendarComponent;