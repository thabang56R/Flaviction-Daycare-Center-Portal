// src/components/parent/Invoices.jsx
import React from 'react';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Badge,
  Button,
  Heading,
  Box,
} from '@chakra-ui/react';

const invoiceData = [
  { id: 'INV-001', date: '2026-01-01', amount: 'R 1,850.00', status: 'Paid', due: '-' },
  { id: 'INV-002', date: '2026-02-01', amount: 'R 1,850.00', status: 'Pending', due: '2026-02-15' },
  { id: 'INV-003', date: '2026-03-01', amount: 'R 1,850.00', status: 'Unpaid', due: '2026-03-15' },
];

const Invoices = () => (
  <Box>
    <Heading size="md" mb={4}>Invoices & Payments</Heading>

    <TableContainer bg="white" borderRadius="lg" boxShadow="md" overflowX="auto">
      <Table variant="simple">
        <Thead bg="gray.100">
          <Tr>
            <Th>Invoice #</Th>
            <Th>Date</Th>
            <Th>Amount</Th>
            <Th>Status</Th>
            <Th>Due Date</Th>
            <Th>Action</Th>
          </Tr>
        </Thead>
        <Tbody>
          {invoiceData.map((inv) => (
            <Tr key={inv.id}>
              <Td>{inv.id}</Td>
              <Td>{inv.date}</Td>
              <Td fontWeight="medium">{inv.amount}</Td>
              <Td>
                <Badge
                  colorScheme={inv.status === 'Paid' ? 'green' : inv.status === 'Pending' ? 'orange' : 'red'}
                >
                  {inv.status}
                </Badge>
              </Td>
              <Td>{inv.due}</Td>
              <Td>
                {inv.status !== 'Paid' && (
                  <Button size="sm" colorScheme="blue">
                    Pay Now
                  </Button>
                )}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  </Box>
);

export default Invoices;