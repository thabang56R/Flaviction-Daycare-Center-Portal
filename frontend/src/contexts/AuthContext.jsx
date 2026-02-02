import React, { createContext, useEffect, useMemo, useState } from "react";
import { useToast } from "@chakra-ui/react";

export const AuthContext = createContext(null);

const API_BASE_URL = "http://localhost:5000";

export function AuthProvider({ children }) {
  const toast = useToast();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("smileyUser");
      if (storedUser) setUser(JSON.parse(storedUser));
    } catch {
      localStorage.removeItem("smileyUser");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async ({ email, password }) => {
    if (!email || !password) {
      toast({
        title: "Missing fields",
        description: "Please enter email and password",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return false;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || data?.msg || "Login failed");
      }

      const userData = data.user || data;

      setUser(userData);
      localStorage.setItem("smileyUser", JSON.stringify(userData));
      if (data.token) localStorage.setItem("token", data.token);

      toast({
        title: "Login successful",
        status: "success",
        duration: 2000,
        isClosable: true,
      });

      return true;
    } catch (err) {
      toast({
        title: "Login error",
        description: err.message,
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("smileyUser");
    localStorage.removeItem("token");
    toast({
      title: "Logged out",
      status: "info",
      duration: 2000,
      isClosable: true,
    });
  };

  // ✅ stable value helps react refresh too
  const value = useMemo(
    () => ({ user, isLoading, login, logout }),
    [user, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}


