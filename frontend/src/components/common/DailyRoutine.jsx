import React from "react";
import { Box, Container, Heading, Text, VStack, HStack, Badge } from "@chakra-ui/react";
import { motion, useInView } from "framer-motion";

const MotionBox = motion(Box);

const Row = ({ time, title, desc, accent = "warm" }) => {
  const dotBg = accent === "cool" ? "cyan.400" : "orange.300";
  return (
    <HStack align="start" spacing={4}>
      <VStack spacing={0} align="center">
        <Box w="12px" h="12px" borderRadius="full" bg={dotBg} boxShadow="0 0 0 6px rgba(0,0,0,0.04)" />
        <Box w="2px" flex="1" minH="56px" bg="blackAlpha.200" />
      </VStack>
      <Box
        flex="1"
        p={5}
        borderRadius="18px"
        bg="rgba(255,255,255,0.72)"
        border="1px solid rgba(0,0,0,0.06)"
        boxShadow="0 16px 50px rgba(10,12,16,0.07)"
      >
        <HStack justify="space-between" align="start" flexWrap="wrap" gap={2}>
          <Text fontWeight="900" color="gray.900">{title}</Text>
          <Badge borderRadius="full" px={3} py={1} bg="blackAlpha.50" border="1px solid rgba(0,0,0,0.06)" fontWeight="900">
            {time}
          </Badge>
        </HStack>
        <Text mt={2} color="gray.700" fontSize="sm" lineHeight="1.7">
          {desc}
        </Text>
      </Box>
    </HStack>
  );
};

export default function DailyRoutine() {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.25 });

  const routine = [
    { time: "07:00 – 08:00", title: "Arrival & Free Play", desc: "Warm welcome, settling in, and gentle play to start the day.", accent: "cool" },
    { time: "08:00 – 08:30", title: "Breakfast Time", desc: "Nutritious meal routine and hygiene habits.", accent: "warm" },
    { time: "09:00 – 10:00", title: "Learning & Activities", desc: "Numbers, language, creativity and fine-motor play.", accent: "cool" },
    { time: "10:00 – 11:00", title: "Outdoor Play", desc: "Supervised movement, games, and social development.", accent: "warm" },
    { time: "12:00 – 13:30", title: "Lunch & Nap", desc: "Quiet time to rest and recharge for healthy growth.", accent: "cool" },
    { time: "14:00 – 16:00", title: "Creative Play & Pick-up", desc: "Art, story time and calm routines before going home.", accent: "warm" },
  ];

  return (
    <Box py={{ base: 16, md: 22 }} position="relative" overflow="hidden">
      <Box
        position="absolute"
        inset={0}
        pointerEvents="none"
        bg="radial-gradient(circle at 70% 25%, rgba(144, 205, 244, 0.18), transparent 58%)"
      />

      <Container maxW="container.lg">
        <MotionBox
          ref={ref}
          initial={{ opacity: 0, y: 22 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <Badge
            borderRadius="full"
            px={4}
            py={2}
            bg="gold"
            border="1px solid rgba(0,0,0,0.06)"
            fontWeight="900"
            letterSpacing="0.12em"
          >
            DAILY ROUTINE
          </Badge>

          <Heading mt={4} fontSize={{ base: "3xl", md: "4xl" }} fontWeight="extrabold" color="gray.900">
            Structured days that feel{" "}
            <Box as="span" bgGradient="linear(to-r, cyan.400, blue.400)" bgClip="text">
              joyful
            </Box>
            .
          </Heading>

          <Text mt={3} color="gray.700" maxW="70ch" lineHeight="1.8">
            Parents love knowing what’s happening each day. Our routine balances learning, play,
            nutrition and rest — for happy children and peace of mind.
          </Text>

          <VStack mt={10} spacing={4} align="stretch">
            {routine.map((r) => (
              <Row key={r.title} {...r} />
            ))}
          </VStack>
        </MotionBox>
      </Container>
    </Box>
  );
}