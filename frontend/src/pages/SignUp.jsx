// src/pages/SignUp.jsx
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
  useToast,
  FormErrorMessage,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { motion } from "framer-motion";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate, Link as RouterLink } from "react-router-dom";

const MotionVStack = motion(VStack);

// ✅ Use env var for production, fallback for local dev
const API = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");

const SignUp = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const toast = useToast();

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "parent", // forced to parent
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.username.trim()) newErrors.username = "Username is required";
    if (!formData.email.includes("@")) newErrors.email = "Valid email is required";
    if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

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
      const payload = {
        ...formData,
        role: "parent", // enforce parent
      };

      const res = await fetch(`${API}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.msg || data.message || "Registration failed");
      }

      // ✅ Store token + user
      if (data.token) localStorage.setItem("token", data.token);

      if (data.user) {
        login(data.user);
      }

      toast({
        title: "Account created!",
        description: "Welcome! You are now signed in as a parent.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      // ✅ Match YOUR App.jsx route
      navigate("/parentdashboard");
    } catch (err) {
      toast({
        title: "Error",
        description: err.message || "Something went wrong",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
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
          Create Your Parent Account
        </Heading>
        <Text color="gray.600" fontSize="lg">
          Join Flaviction DayCare Portal as a parent
        </Text>
      </VStack>

      <Box as="form" onSubmit={handleSubmit} w="full">
        <VStack spacing={6}>
          <FormControl isRequired isInvalid={!!errors.name}>
            <FormLabel>Full Name</FormLabel>
            <Input
              name="name"
              placeholder="Thabang Rakeng"
              value={formData.name}
              onChange={handleChange}
              size="lg"
            />
            <FormErrorMessage>{errors.name}</FormErrorMessage>
          </FormControl>

          <FormControl isRequired isInvalid={!!errors.username}>
            <FormLabel>Username</FormLabel>
            <Input
              name="username"
              placeholder="thabang123"
              value={formData.username}
              onChange={handleChange}
              size="lg"
            />
            <FormErrorMessage>{errors.username}</FormErrorMessage>
          </FormControl>

          <FormControl isRequired isInvalid={!!errors.email}>
            <FormLabel>Email</FormLabel>
            <Input
              name="email"
              type="email"
              placeholder="thabang@example.com"
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
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide" : "Show"}
                >
                  {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                </Button>
              </InputRightElement>
            </InputGroup>
            <FormErrorMessage>{errors.password}</FormErrorMessage>
          </FormControl>

          <FormControl isRequired isInvalid={!!errors.confirmPassword}>
            <FormLabel>Confirm Password</FormLabel>
            <Input
              name="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              size="lg"
            />
            <FormErrorMessage>{errors.confirmPassword}</FormErrorMessage>
          </FormControl>

          <Button
            type="submit"
            colorScheme="blue"
            size="lg"
            w="full"
            isLoading={submitting}
            loadingText="Creating account..."
            mt={4}
          >
            Create Parent Account
          </Button>
        </VStack>
      </Box>

      <Text fontSize="sm" color="gray.600" mt={6}>
        Already have an account?{" "}
        <ChakraLink as={RouterLink} to="/login" color="brand.primary" fontWeight="medium">
          Sign in here
        </ChakraLink>
      </Text>

      <Text fontSize="xs" color="gray.500" mt={4} textAlign="center">
        Note: Only parents can register online. Teachers and admins are created by administrators.
      </Text>
    </MotionVStack>
  );
};

export default SignUp;

