// src/components/common/Header.jsx
import React, { useContext } from 'react';
import {
  Box,
  Flex,
  Heading,
  Button,
  IconButton,
  Image,
  HStack,
  Spacer,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  useDisclosure,
  VStack,
  Text,
  useBreakpointValue,
  Link as ChakraLink,
} from '@chakra-ui/react';
import { BellIcon, HamburgerIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import LanguageSwitcher from '../common/LanguageSwitcher';

const menuItems = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/about' },
  { label: 'Our School', href: '/location' },
  { label: 'Curriculum', href: '/curriculum' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Contact Us', href: '/contact' },
];

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Responsive check
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Box
      bg="white"
      shadow="md"
      position="sticky"
      top={0}
      zIndex={1000}
      px={{ base: 4, md: 6 }}
      py={4}
    >
      <Flex
        maxW="container.xl"
        mx="auto"
        align="center"
        justify="space-between"
        wrap="wrap"
        gap={4}
      >
        {/* Logo + Title */}
        <HStack spacing={{ base: 3, md: 5 }} align="center">
          <Image
            src="/image.jpg (3).jpg" 
            alt="Flaviction Daycare Logo"
            boxSize={{ base: '60px', md: '80px' }}
            objectFit="contain"
            fallbackSrc="https://via.placeholder.com/80?text=Logo"
            borderRadius="full"
          />
          <Box>
            <Heading
              size={{ base: 'md', md: 'lg' }}
              color="brand.primary"
              fontFamily="heading"
              lineHeight="1"
            >
              Flaviction
            </Heading>
            <Text
              fontSize="xs"
              color="black.500"
              fontWeight="medium"
              mt="-1"
            >
              DayCare Center
            </Text>
          </Box>
        </HStack>

        <Spacer display={{ base: 'none', md: 'block' }} />

        {/* Desktop Menu + User Actions */}
        <HStack spacing={8} display={{ base: 'none', md: 'flex' }} align="center">
          {menuItems.map((item) => (
            <ChakraLink
              key={item.label}
              href={item.href}
              fontWeight="medium"
              _hover={{ color: 'brand.accent' }}
            >
              {item.label}
            </ChakraLink>
          ))}

          {user ? (
            <HStack spacing={6} align="center">
              <LanguageSwitcher />

              <IconButton
                icon={<BellIcon />}
                aria-label="Notifications"
                variant="ghost"
                colorScheme="blue"
                size="lg"
              />

              <Button
                colorScheme="blue"
                variant="outline"
                size="md"
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
              >
                Logout
              </Button>

              <Text fontSize="sm" color="gray.600">
                {user.name || 'User'}
              </Text>
            </HStack>
          ) : (
            <Button
              colorScheme="blue"
              size="md"
              onClick={() => navigate('/login')}
            >
              Login
            </Button>
          )}
        </HStack>

        {/* Mobile Hamburger Button */}
        {isMobile && (
          <IconButton
            icon={<HamburgerIcon />}
            variant="ghost"
            fontSize="2xl"
            aria-label="Open menu"
            onClick={onOpen}
          />
        )}
      </Flex>

      {/* Mobile Drawer Menu */}
      <Drawer placement="right" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">Menu</DrawerHeader>
          <DrawerBody>
            <VStack align="stretch" spacing={6} mt={4}>
              {menuItems.map((item) => (
                <ChakraLink
                  key={item.label}
                  href={item.href}
                  fontSize="lg"
                  fontWeight="medium"
                  onClick={onClose}
                  _hover={{ color: 'brand.accent' }}
                >
                  {item.label}
                </ChakraLink>
              ))}

              {/* Mobile user actions */}
              {user ? (
                <VStack align="stretch" spacing={4} mt={6}>
                  <LanguageSwitcher />

                  <Button
                    leftIcon={<BellIcon />}
                    variant="ghost"
                    justifyContent="flex-start"
                  >
                    Notifications
                  </Button>

                  <Button
                    colorScheme="blue"
                    variant="outline"
                    onClick={() => {
                      logout();
                      onClose();
                      navigate('/login');
                    }}
                  >
                    Logout
                  </Button>

                  <Text fontSize="sm" color="gray.600">
                    Logged in as {user.name || 'User'}
                  </Text>
                </VStack>
              ) : (
                <Button
                  colorScheme="blue"
                  onClick={() => {
                    onClose();
                    navigate('/login');
                  }}
                >
                  Login
                </Button>
              )}
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

export default Header;