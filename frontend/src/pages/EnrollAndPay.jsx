import React, { useMemo, useState } from "react";
import {
  Box, Container, Heading, Text, VStack, HStack,
  FormControl, FormLabel, Input, Select, Button, Card, CardBody, Divider, useToast
} from "@chakra-ui/react";

const packages = [
  { id: "Baby-Care", name: "Baby-Care(Full Day)", price: 850.00 },
  { id: "Pre-School(Toddlers)", name: "Pre-School - (Full Day)", price: 1200.00 },
  { id: "Aftercare", name: "After Care (15:00-18:00)", price: 650.00 },
  {id: "Grade -R", name: "Grade -R (Full Day)", price: 850.00 },
  {id: " Full Uniform ", name: "Full Set Uniform (3Yrs- 6Yrs)", price: 750.00 }
];

export default function EnrollAndPay() {
  const toast = useToast();
  const [form, setForm] = useState({
    parentName: "",
    parentEmail: "",
    parentPhone: "",
    childName: "",
    packageId: "full_day",
  });

  const selected = useMemo(
    () => packages.find(p => p.id === form.packageId) || packages[0],
    [form.packageId]
  );

  const onChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const payWithPayfast = async () => {
    if (!form.parentName || !form.parentEmail || !form.childName) {
      toast({ title: "Missing info", description: "Fill in parent + child details.", status: "warning", duration: 3000 });
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/payfast/create-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          parentName: form.parentName,
          parentEmail: form.parentEmail,
          parentPhone: form.parentPhone,
          childName: form.childName,
          packageName: selected.name,
          amount: selected.price,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Payment init failed");

      // IMPORTANT: PayFast checkout should be a FORM POST (avoids CORS). :contentReference[oaicite:7]{index=7}
      const formEl = document.createElement("form");
      formEl.method = "POST";
      formEl.action = data.payfastUrl;

      Object.entries(data.fields).forEach(([k, v]) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = k;
        input.value = String(v);
        formEl.appendChild(input);
      });

      document.body.appendChild(formEl);
      formEl.submit();
    } catch (err) {
      toast({ title: "Error", description: err.message, status: "error", duration: 4000 });
    }
  };

  return (
    <Box bg="brand.lightBg" minH="100vh" py={10}>
      <Container maxW="container.md">
        <VStack spacing={8} align="stretch">
          <VStack spacing={2} textAlign="center">
            <Heading color="brand.primary">Enroll & Pay Online</Heading>
            <Text color="gray.600">
              Complete enrollment and secure payment in one step.
            </Text>
          </VStack>

          <Card borderRadius="2xl" boxShadow="xl">
            <CardBody>
              <VStack spacing={5} align="stretch">
                <Heading size="md">Parent Details</Heading>
                <HStack spacing={4} flexDir={{ base: "column", md: "row" }}>
                  <FormControl isRequired>
                    <FormLabel>Parent Name</FormLabel>
                    <Input name="parentName" value={form.parentName} onChange={onChange} />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Email</FormLabel>
                    <Input name="parentEmail" type="email" value={form.parentEmail} onChange={onChange} />
                  </FormControl>
                </HStack>

                <FormControl>
                  <FormLabel>Phone</FormLabel>
                  <Input name="parentPhone" value={form.parentPhone} onChange={onChange} />
                </FormControl>

                <Divider />

                <Heading size="md">Child & Package</Heading>
                <FormControl isRequired>
                  <FormLabel>Child Name</FormLabel>
                  <Input name="childName" value={form.childName} onChange={onChange} />
                </FormControl>

                <FormControl>
                  <FormLabel>Select Package</FormLabel>
                  <Select name="packageId" value={form.packageId} onChange={onChange}>
                    {packages.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.name} — R{p.price.toFixed(2)}
                      </option>
                    ))}
                  </Select>
                </FormControl>

                <Box p={4} borderRadius="xl" bg="white" border="1px solid" borderColor="gray.200">
                  <HStack justify="space-between">
                    <Text fontWeight="bold">Total</Text>
                    <Text fontWeight="bold" color="brand.primary">R{selected.price.toFixed(2)}</Text>
                  </HStack>
                </Box>

                <Button size="lg" onClick={payWithPayfast}>
                  Pay with PayFast
                </Button>

                <Text fontSize="sm" color="gray.500">
                  You’ll be redirected to PayFast to complete payment securely.
                </Text>
              </VStack>
            </CardBody>
          </Card>
        </VStack>
      </Container>
    </Box>
  );
}
