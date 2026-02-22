"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AUTH_TOKEN_KEY, usersAPI } from "@/services/api";

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Завантажуємо дані при монтуванні
  useEffect(() => {
    const initializeAuth = async () => {
      const savedToken = localStorage.getItem(AUTH_TOKEN_KEY);
      const savedUser = localStorage.getItem("user");

      if (!savedToken) {
        setIsLoading(false);
        return;
      }

      setToken(savedToken);

      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch {
          localStorage.removeItem("user");
        }
      }

      try {
        const currentUser = await usersAPI.getMe();
        setUser(currentUser);
        localStorage.setItem("user", JSON.stringify(currentUser));
      } catch {
        setToken(null);
        setUser(null);
        localStorage.removeItem(AUTH_TOKEN_KEY);
        localStorage.removeItem("user");
        document.cookie = "auth_token=;path=/;max-age=0";
      } finally {
        setIsLoading(false);
      }
    };

    void initializeAuth();
  }, []);

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem(AUTH_TOKEN_KEY, newToken);
    localStorage.setItem("user", JSON.stringify(newUser));

    // Встановлюємо cookie для middleware
    document.cookie = `auth_token=${newToken};path=/;max-age=86400`;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem("user");
    document.cookie = "auth_token=;path=/;max-age=0";
    router.push("/");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        logout,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth мусит бути використаний всередині AuthProvider");
  }
  return context;
}
