import { Box, Heading, Text, Image, Link as ChakraLink } from '@chakra-ui/react';

const ServiceCard = ({ title, desc, img }) => (
  <Box
    bg="white"
    borderRadius="2xl"
    overflow="hidden"
    boxShadow="xl"
    transition="all 0.3s"
    _hover={{ transform: 'translateY(-12px)', boxShadow: '2xl' }}
  >
    <Image src={img} alt={title} h="220px" objectFit="cover" w="100%" />
    <Box p={6}>
      <Heading size="md" color="brand.accent" mb={3}>
        {title}
      </Heading>
      <Text color="gray.600" mb={4}>
        {desc}
      </Text>
      <ChakraLink color="brand.primary" fontWeight="semibold">
        read more...
      </ChakraLink>
    </Box>
  </Box>
);

export default ServiceCard;