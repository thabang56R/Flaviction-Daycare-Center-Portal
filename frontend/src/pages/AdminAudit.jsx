import React, { useEffect, useMemo, useState } from "react";
import {
  Box, Container, Heading, HStack, VStack, Input, Select, Button,
  Table, Thead, Tbody, Tr, Th, Td, Badge, Spinner, Drawer, DrawerOverlay,
  DrawerContent, DrawerHeader, DrawerBody, Text, Code
} from "@chakra-ui/react";
import { DownloadIcon } from "@chakra-ui/icons";

const API = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");

export default function AdminAudit() {
  const token = useMemo(() => localStorage.getItem("token"), []);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    q: "",
    action: "",
    role: "",
    entityType: "",
    status: "",
    from: "",
    to: "",
  });

  const [selected, setSelected] = useState(null);

  const fetchLogs = async () => {
    setLoading(true);
    const qs = new URLSearchParams(Object.entries(filters).filter(([_, v]) => v)).toString();
    const res = await fetch(`${API}/api/audit?${qs}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setItems(data.items || []);
    setLoading(false);
  };

  useEffect(() => { fetchLogs(); }, []); // initial

  const exportCsv = () => {
    const qs = new URLSearchParams(Object.entries(filters).filter(([_, v]) => v)).toString();
    window.open(`${API}/api/audit/export.csv?${qs}`, "_blank");
  };

  return (
    <Box bg="brand.lightBg" minH="100vh">
      <Container maxW="container.xl" py={10}>
        <HStack justify="space-between" mb={6} flexWrap="wrap" gap={3}>
          <Heading size="lg">System Audit Trail</Heading>
          <Button leftIcon={<DownloadIcon />} colorScheme="blue" onClick={exportCsv}>
            Export CSV
          </Button>
        </HStack>

        <Box bg="white" borderRadius="2xl" p={5} boxShadow="md" mb={6}>
          <VStack align="stretch" spacing={4}>
            <HStack flexWrap="wrap" gap={3}>
              <Input placeholder="Search (action, email, requestId...)" value={filters.q}
                onChange={(e) => setFilters(f => ({ ...f, q: e.target.value }))} />

              <Select placeholder="Action" value={filters.action}
                onChange={(e) => setFilters(f => ({ ...f, action: e.target.value }))}>
                <option value="USER_ROLE_CHANGED">USER_ROLE_CHANGED</option>
                <option value="ANNOUNCEMENT_CREATED">ANNOUNCEMENT_CREATED</option>
                <option value="MENU_UPDATED">MENU_UPDATED</option>
                <option value="REPORTCARD_PUBLISHED">REPORTCARD_PUBLISHED</option>
                <option value="ADMIN_IMPERSONATION_STARTED">ADMIN_IMPERSONATION_STARTED</option>
              </Select>

              <Select placeholder="Role" value={filters.role}
                onChange={(e) => setFilters(f => ({ ...f, role: e.target.value }))}>
                <option value="admin">admin</option>
                <option value="staff">staff</option>
                <option value="parent">parent</option>
              </Select>

              <Select placeholder="Entity" value={filters.entityType}
                onChange={(e) => setFilters(f => ({ ...f, entityType: e.target.value }))}>
                <option value="User">User</option>
                <option value="Child">Child</option>
                <option value="Announcement">Announcement</option>
                <option value="Menu">Menu</option>
                <option value="ReportCard">ReportCard</option>
                <option value="System">System</option>
              </Select>

              <Select placeholder="Status" value={filters.status}
                onChange={(e) => setFilters(f => ({ ...f, status: e.target.value }))}>
                <option value="SUCCESS">SUCCESS</option>
                <option value="FAILED">FAILED</option>
              </Select>
            </HStack>

            <HStack flexWrap="wrap" gap={3}>
              <Input type="datetime-local" value={filters.from}
                onChange={(e) => setFilters(f => ({ ...f, from: e.target.value }))} />
              <Input type="datetime-local" value={filters.to}
                onChange={(e) => setFilters(f => ({ ...f, to: e.target.value }))} />

              <Button colorScheme="blue" onClick={fetchLogs} isLoading={loading}>
                Apply Filters
              </Button>
            </HStack>
          </VStack>
        </Box>

        <Box bg="white" borderRadius="2xl" overflow="hidden" boxShadow="md">
          {loading ? (
            <HStack p={8}><Spinner /><Text>Loading logs...</Text></HStack>
          ) : (
            <Table size="sm">
              <Thead>
                <Tr>
                  <Th>Time</Th>
                  <Th>Action</Th>
                  <Th>Actor</Th>
                  <Th>Role</Th>
                  <Th>Entity</Th>
                  <Th>Status</Th>
                </Tr>
              </Thead>
              <Tbody>
                {items.map((l) => (
                  <Tr key={l._id} cursor="pointer" _hover={{ bg: "gray.50" }} onClick={() => setSelected(l)}>
                    <Td>{new Date(l.createdAt).toLocaleString()}</Td>
                    <Td><Badge>{l.action}</Badge></Td>
                    <Td>{l.actorEmail || l.actorId}</Td>
                    <Td>
                      <Badge colorScheme={l.actorRole === "admin" ? "purple" : l.actorRole === "staff" ? "blue" : "green"}>
                        {l.actorRole}
                      </Badge>
                      {l.actorOriginalRole && (
                        <Badge ml={2} colorScheme="orange">orig: {l.actorOriginalRole}</Badge>
                      )}
                    </Td>
                    <Td>{l.entityType}</Td>
                    <Td>
                      <Badge colorScheme={l.status === "SUCCESS" ? "green" : "red"}>{l.status}</Badge>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          )}
        </Box>

        <Drawer isOpen={!!selected} placement="right" onClose={() => setSelected(null)} size="md">
          <DrawerOverlay />
          <DrawerContent>
            <DrawerHeader>Audit Details</DrawerHeader>
            <DrawerBody>
              {selected && (
                <VStack align="stretch" spacing={4}>
                  <Text><b>Action:</b> {selected.action}</Text>
                  <Text><b>Entity:</b> {selected.entityType} {selected.entityId || ""}</Text>
                  <Text><b>Actor:</b> {selected.actorEmail || selected.actorId}</Text>
                  <Text><b>Role:</b> {selected.actorRole} {selected.actorOriginalRole ? `(orig: ${selected.actorOriginalRole})` : ""}</Text>
                  <Text><b>RequestId:</b> <Code>{selected.requestId}</Code></Text>
                  <Text><b>IP:</b> {selected.ip}</Text>
                  <Text><b>User-Agent:</b> {selected.userAgent}</Text>

                  <Box>
                    <Text fontWeight="bold" mb={2}>Before</Text>
                    <Code whiteSpace="pre-wrap" display="block" p={3} borderRadius="lg">
                      {JSON.stringify(selected.before, null, 2)}
                    </Code>
                  </Box>

                  <Box>
                    <Text fontWeight="bold" mb={2}>After</Text>
                    <Code whiteSpace="pre-wrap" display="block" p={3} borderRadius="lg">
                      {JSON.stringify(selected.after, null, 2)}
                    </Code>
                  </Box>
                </VStack>
              )}
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </Container>
    </Box>
  );
}
