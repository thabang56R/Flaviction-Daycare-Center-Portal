import React from "react";
import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  HStack,
  Button,
  IconButton,
  Badge,
  useBreakpointValue,
} from "@chakra-ui/react";
import { motion, useInView } from "framer-motion";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";

const MotionBox = motion(Box);
const MotionVStack = motion(VStack);
const MotionText = motion(Text);

const Hero = () => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  
  const slides = React.useMemo(
    () => [
      { src: "/hero5.jfif", tag: "Play • Learn • Grow" },
      { src: "/hero4.jfif", tag: "Safe Outdoor Fun" },
      { src: "/hero3.jfif", tag: "Creative Learning" },
      { src: "/hero2.jfif", tag: "Caring Teachers" },
    ],
    []
  );

  const [index, setIndex] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  const intervalRef = React.useRef(null);

  const isMobile = useBreakpointValue({ base: true, md: false });

  const goTo = (i) => setIndex((i + slides.length) % slides.length);
  const next = () => goTo(index + 1);
  const prev = () => goTo(index - 1);

  // ✅ Auto-play
  React.useEffect(() => {
    if (paused) return;
    intervalRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 4500);

    return () => clearInterval(intervalRef.current);
  }, [paused, slides.length]);

 
  React.useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    
  }, [index]);

  return (
    <MotionBox
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1 }}
      color="white"
      py={{ base: 24, md: 40 }}
      textAlign="center"
      position="relative"
      overflow="hidden"
      borderRadius={{ base: "0px", md: "24px" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      
      <Box position="absolute" inset={0} zIndex={0}>
        {slides.map((s, i) => (
          <MotionBox
            key={s.src}
            position="absolute"
            inset={0}
            bgImage={`url('${s.src}')`}
            bgSize="cover"
            bgRepeat="no-repeat"
            bgPos="center"
            initial={false}
            animate={
              i === index
                ? { opacity: 1, scale: 1 }
                : { opacity: 0, scale: 1.03 }
            }
            transition={{ duration: 0.9, ease: "easeInOut" }}
          />
        ))}

        {/* ✅ Premium overlay (vignette + gradient) */}
        <Box
          position="absolute"
          inset={0}
          bgGradient="linear(to-r, rgba(255,255,255,0.75), rgba(128, 128, 167, 0.25), rgba(255,165,0,0.78))"
        />
        <Box
          position="absolute"
          inset={0}
          bg="radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.69), transparent 25%)"
        />
        <Box
          position="absolute"
          inset={0}
          bg="radial-gradient(circle at 80% 30%, rgb(214, 151, 26), transparent 20%)"
        />
      </Box>

      {/* ✅ Top-left tag */}
      <Box position="absolute" top={{ base: 4, md: 6 }} left={{ base: 4, md: 6 }} zIndex={2}>
        <Badge
          px={3}
          py={2}
          borderRadius="full"
          bg="orange"
          border="1px solid rgba(255,255,255,0.18)"
          backdropFilter="blur(10px)"
          color="white"
          fontWeight="800"
          letterSpacing="0.08em"
        >
          {slides[index].tag}
        </Badge>
      </Box>

      
      {!isMobile && (
        <>
          <IconButton
            aria-label="Previous slide"
            icon={<ChevronLeftIcon boxSize={8} />}
            position="absolute"
            left={4}
            top="50%"
            transform="translateY(-50%)"
            zIndex={2}
            onClick={prev}
            bg="rgba(0,0,0,0.35)"
            _hover={{ bg: "rgba(0,0,0,0.50)" }}
            border="1px solid rgba(255,255,255,0.18)"
            backdropFilter="blur(10px)"
            borderRadius="full"
          />
          <IconButton
            aria-label="Next slide"
            icon={<ChevronRightIcon boxSize={8} />}
            position="absolute"
            right={4}
            top="50%"
            transform="translateY(-50%)"
            zIndex={2}
            onClick={next}
            bg="silver.50"
            _hover={{ bg: "rgba(0,0,0,0.50)" }}
            border="1px solid rgba(255,255,255,0.18)"
            backdropFilter="blur(10px)"
            borderRadius="full"
          />
        </>
      )}

      {/* ✅ Content */}
      <Container maxW="container.lg" position="relative" zIndex={2}>
        <MotionVStack
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.1 }}
          spacing={{ base: 6, md: 8 }}
        >
          {/* Glass card */}
          <Box
            px={{ base: 5, md: 10 }}
            py={{ base: 6, md: 10 }}
            borderRadius="24px"
            bg="rgba(255, 255, 255, 0.45)"
            border="1px solid rgba(255, 255, 255, 0)"
            backdropFilter="blur(14px)"
            boxShadow="0 18px 70px rgba(0,0,0,0.45)"
          >
            <Text
              fontSize="sm"
              fontWeight="800"
              letterSpacing="0.15em"
              opacity={0.92}
              mb={3}
            >
             <div style={{color:'green'}}>FLAVICTION DAYCARE CENTER</div> 
              
            </Text>
            

            <Heading
              as="h1"
              fontSize={{ base: "4xl", md: "6xl", lg: "7xl" }}
              lineHeight="shorter"
              fontWeight="extrabold"
              textShadow="2px 4px 12px rgba(0,0,0,0.5)"
            >
              Where little {" "}
              <Box as="span" color="gold" >
               minds shine
              </Box>{" "}
              and hearts {" "}
              <Box as="span" color="black" >
               feel safe
              </Box>
              .
            </Heading>

            <MotionText
              mt={4}
              fontSize={{ base: "xl", md: "2xl" }}
              fontWeight="medium"
              whileHover={{ scale: 1.02, color: "#FBD38D" }}
              transition={{ duration: 0.25 }}
            >
              <div style={{color:'gold'}}>Play-based learning • Caring teachers • Safe routines every day</div>
            </MotionText>

            <MotionText
              mt={3}
              fontSize={{ base: "md", md: "lg" }}
              maxW="3xl"
              mx="auto"
              opacity={0.92}
              whileHover={{ scale: 1.02, color: "#FBD38D" }}
              transition={{ duration: 0.25 }}
            >
              <div style={{color:'black'}}>A warm environment where children explore, build confidence, and grow with joy.
              Structured learning + creative play, designed for real development.</div>
            </MotionText>

            {/* ✅ CTAs */}
            <HStack mt={7} spacing={3} justify="center" flexWrap="wrap">
              <Button
                size="lg"
                px={7}
                borderRadius="16px"
                bgGradient="linear(to-br, white, yellow.300, orange.300)"
                color="gray.900"
                fontWeight="900"
                _hover={{ transform: "translateY(-1px)", boxShadow: "0 18px 45px rgba(251, 211, 141, 0.35)" }}
                transition="all 0.2s ease"
                as="a"
                href="/enroll"
              >
                Enroll Now
              </Button>

              <Button
                size="lg"
                px={7}
                borderRadius="16px"
                variant="outline"
                borderColor="whiteAlpha.300"
                bg="blackAlpha.300"
                _hover={{ bg: "blackAlpha.400", transform: "translateY(-1px)" }}
                transition="all 0.2s ease"
                as="a"
                href="/contact"
              >
                Book a Tour
              </Button>
            </HStack>

            {/* ✅ Dots */}
            <HStack mt={7} spacing={2} justify="center">
              {slides.map((_, i) => (
                <Box
                  key={i}
                  as="button"
                  aria-label={`Go to slide ${i + 1}`}
                  onClick={() => goTo(i)}
                  w={i === index ? "22px" : "9px"}
                  h="9px"
                  borderRadius="full"
                  bg={i === index ? "whiteAlpha.900" : "whiteAlpha.400"}
                  transition="all 0.25s ease"
                />
              ))}
            </HStack>

            {/* ✅ Quick trust strip */}
            <HStack
              mt={8}
              spacing={{ base: 4, md: 8 }}
              justify="center"
              flexWrap="wrap"
              opacity={0.95}
              color='black'
            >
              <Box>
                <Text fontWeight="900">Safe</Text>
                <Text fontSize="sm" opacity={0.8}>Supervised play</Text>
              </Box>
              <Box>
                <Text fontWeight="900">Learning</Text>
                <Text fontSize="sm" opacity={0.8}>Daily activities</Text>
              </Box>
              <Box>
                <Text fontWeight="900">Caring</Text>
                <Text fontSize="sm" opacity={0.8}>Friendly staff</Text>
              </Box>
            </HStack>
          </Box>
        </MotionVStack>
      </Container>
    </MotionBox>
  );
};

export default Hero;