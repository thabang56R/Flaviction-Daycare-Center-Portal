// src/components/home/VideoAsImageSection.jsx
import React, { useRef, useState } from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  AspectRatio,
  Icon,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { FaPlay } from "react-icons/fa";

const MotionBox = motion(Box);

export default function VideoAsImageSection() {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  const startVideo = async () => {
    setPlaying(true);
    // wait a tick so the <video> renders before play
    requestAnimationFrame(async () => {
      try {
        await videoRef.current?.play();
      } catch {
        // if play fails, revert back
        setPlaying(false);
      }
    });
  };

  return (
    <Box bg="black" py={{ base: 12, md: 20 }}>
      <Container maxW="container.xl">
        <VStack spacing={6} textAlign="center" mb={{ base: 8, md: 10 }}>
          
        </VStack>

        <MotionBox
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.5 }}
          mx="auto"
          maxW="900px"
          borderRadius="2xl"
          overflow="hidden"
          boxShadow="2xl"
          borderWidth="1px"
          borderColor="gray.200"
          bg="white"
        >
          <AspectRatio ratio={16 / 9}>
            {/* ✅ Image look first */}
            {!playing ? (
              <Box
                role="button"
                tabIndex={0}
                onClick={startVideo}
                onKeyDown={(e) => e.key === "Enter" && startVideo()}
                position="relative"
                cursor="pointer"
                bg="black"
                backgroundImage="url('/image (2).jpg')"
                backgroundSize="cover"
                backgroundPosition="center"
              >
                {/* Dark overlay */}
                <Box position="absolute" inset="0" bg="rgba(0,0,0,0.35)" />

                {/* Play button */}
                <Box
                  position="absolute"
                  inset="0"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Box
                    w={{ base: "64px", md: "80px" }}
                    h={{ base: "64px", md: "80px" }}
                    borderRadius="full"
                    bg="rgba(255,255,255,0.92)"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    boxShadow="xl"
                    transform="translateZ(0)"
                  >
                    <Icon as={FaPlay} boxSize={{ base: 6, md: 7 }} color="brand.primary" />
                  </Box>
                </Box>

                {/* Small label */}
                <Box
                  position="absolute"
                  bottom="12px"
                  left="12px"
                  px={3}
                  py={2}
                  borderRadius="lg"
                  bg="rgba(0,0,0,0.55)"
                  color="white"
                  fontSize="sm"
                  fontWeight="bold"
                >
                  Tap to play
                </Box>
              </Box>
            ) : (
              /* ✅ Becomes real video only after click */
              <video
                ref={videoRef}
                src="/video1.mp4"
                controls
                playsInline
                preload="metadata"
                style={{ width: "100%", height: "100%", background: "#000" }}
                onEnded={() => setPlaying(false)}
              />
            )}
          </AspectRatio>
        </MotionBox>
      </Container>
    </Box>
  );
}
