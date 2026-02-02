// src/components/parent/DailyReport.js
import React from 'react';
import { Box, Heading, Text } from '@chakra-ui/react';
import MoodTracker from '../common/MoodTracker';
import { BarChart, Bar, XAxis, YAxis } from 'recharts';

const data = [{ name: 'Meals', value: 3 }, { name: 'Sleep', value: 8 }, { name: 'Activities', value: 5 }];

const DailyReport = () => (
  <Box mb={8}>
    <Heading size="md">Daily Report</Heading>
    <Text>Meals: Ate well!</Text>
    <Text>Sleep: 2 hours nap</Text>
    <MoodTracker mood="happy" />
    <BarChart width={300} height={200} data={data}>
      <XAxis dataKey="name" />
      <YAxis />
      <Bar dataKey="value" fill="#00BFFF" />
    </BarChart>
  </Box>
);

export default DailyReport;