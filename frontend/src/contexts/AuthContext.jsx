// src/contexts/AuthContext.jsx
import React, { createContext, useEffect, useMemo, useState, useCallback } from "react";
import { useToast } from "@chakra-ui/react";

export const AuthContext = createContext(null);

const USER_KEY = "smileyUser";
const TOKEN_KEY = "token";

export function AuthProvider({ children }) {
  const toast = useToast();

  // ✅ Use Vercel env when deployed, fallback to localhost for dev
  const API_BASE_URL = useMemo(() => {
    return import.meta.env.VITE_API_URL || "http://localhost:5000";
  }, []);

  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // ✅ Load saved session on refresh
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem(USER_KEY);
      if (storedUser) setUser(JSON.parse(storedUser));
    } catch {
      localStorage.removeItem(USER_KEY);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(
    async ({ email, password }) => {
      if (!email || !password) {
        toast({
          title: "Missing fields",
          description: "Please enter email and password",
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
        return { ok: false };
      }

      try {
        const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
          throw new Error(data?.msg || data?.message || "Login failed");
        }

        // expected: { token, user }
        const nextUser = data.user || data;

        setUser(nextUser);
        localStorage.setItem(USER_KEY, JSON.stringify(nextUser));

        if (data.token) localStorage.setItem(TOKEN_KEY, data.token);

        toast({
          title: "Login successful",
          status: "success",
          duration: 2000,
          isClosable: true,
        });

        return { ok: true, user: nextUser };
      } catch (err) {
        toast({
          title: "Login error",
          description: err.message,
          status: "error",
          duration: 4000,
          isClosable: true,
        });
        return { ok: false };
      }
    },
    [API_BASE_URL, toast]
  );

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_KEY);

    toast({
      title: "Logged out",
      status: "info",
      duration: 2500,
      isClosable: true,
    });
  }, [toast]);

  // Optional helper for authenticated fetch calls
  const authFetch = useCallback(async (path, options = {}) => {
    const token = localStorage.getItem(TOKEN_KEY);

    const headers = {
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    return fetch(`${API_BASE_URL}${path}`, { ...options, headers });
  }, [API_BASE_URL]);

  const value = useMemo(
    () => ({
      user,
      isLoading,
      login,
      logout,
      authFetch,
      API_BASE_URL,
    }),
    [user, isLoading, login, logout, authFetch, API_BASE_URL]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}



