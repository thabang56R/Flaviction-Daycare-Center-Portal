// src/pages/Login.jsx
import React, { useState, useContext } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  Heading,
  Text,
  Link as ChakraLink,
  FormErrorMessage,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { motion } from "framer-motion";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate, Link as RouterLink } from "react-router-dom";

const MotionVStack = motion(VStack);

const Login = () => {
  const { login, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email || !formData.email.includes("@")) {
      newErrors.email = "Valid email is required";
    }
    if (!formData.password || formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);

    try {
      
      const ok = await login({
        email: formData.email,
        password: formData.password,
      });

      if (!ok) return;

      
      const saved = localStorage.getItem("smileyUser");
      const loggedInUser = saved ? JSON.parse(saved) : user;

      const role = loggedInUser?.role;

      if (role === "parent") navigate("/dashboard/parent");
      else if (role === "teacher") navigate("/dashboard/teacher");
      else if (role === "admin") navigate("/dashboard/admin");
      else navigate("/parentdashboard"); 
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <MotionVStack
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      spacing={8}
      w={{ base: "90%", sm: "480px" }}
      mx="auto"
      mt={{ base: "10vh", md: "15vh" }}
      p={{ base: 8, md: 10 }}
      boxShadow="2xl"
      borderRadius="2xl"
      bg="white"
      border="1px solid"
      borderColor="gray.200"
    >
      <VStack spacing={3} textAlign="center">
        <Heading size="2xl" color="brand.primary">
          Login to Your Account
        </Heading>
        <Text color="gray.600" fontSize="lg">
          Access your Flaviction DayCare Portal
        </Text>
      </VStack>

      <Box as="form" onSubmit={handleSubmit} w="full">
        <VStack spacing={6}>
          <FormControl isRequired isInvalid={!!errors.email}>
            <FormLabel>Email</FormLabel>
            <Input
              name="email"
              type="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={handleChange}
              size="lg"
            />
            <FormErrorMessage>{errors.email}</FormErrorMessage>
          </FormControl>

          <FormControl isRequired isInvalid={!!errors.password}>
            <FormLabel>Password</FormLabel>
            <InputGroup size="lg">
              <Input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
              />
              <InputRightElement h="full">
                <Button
                  variant="ghost"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide" : "Show"}
                >
                  {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                </Button>
              </InputRightElement>
            </InputGroup>
            <FormErrorMessage>{errors.password}</FormErrorMessage>
          </FormControl>

          <Button
            type="submit"
            colorScheme="blue"
            size="lg"
            w="full"
            isLoading={submitting}
            loadingText="Logging in..."
            mt={4}
          >
            Login
          </Button>
        </VStack>
      </Box>

      <Text fontSize="sm" color="gray.600" mt={6}>
        Don't have an account?{" "}
        <ChakraLink
          as={RouterLink}
          to="/signup"
          color="brand.primary"
          fontWeight="medium"
        >
          Sign up here
        </ChakraLink>
      </Text>
    </MotionVStack>
  );
};

export default Login;
