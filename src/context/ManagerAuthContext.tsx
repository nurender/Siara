"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";

// API Base URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface User {
  id: number;
  email: string;
  name: string;
  role: string;
}

interface ManagerAuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  user: User | null;
  token: string | null;
}

const ManagerAuthContext = createContext<ManagerAuthContextType | undefined>(undefined);

export function ManagerAuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  
  // Track if component is mounted (client-side only)
  useEffect(() => {
    setMounted(true);
  }, []);

  // Check authentication on mount
  useEffect(() => {
    // Only run after component is mounted
    if (!mounted) return;
    
    const checkAuth = async () => {
      // Only run on client side
      if (typeof window === 'undefined') {
        setIsLoading(false);
        return;
      }

      try {
        const authData = localStorage.getItem("managerAuth");
        if (authData) {
          try {
            const parsed = JSON.parse(authData);
            if (parsed.token && parsed.user) {
            // Verify token with API
            const response = await fetch(`${API_URL}/api/auth/profile`, {
                headers: {
                  'Authorization': `Bearer ${parsed.token}`
                }
              });
              
              if (response.ok) {
                setIsAuthenticated(true);
                setUser(parsed.user);
                setToken(parsed.token);
              } else {
                // Token invalid, clear storage
                localStorage.removeItem("managerAuth");
              }
            }
          } catch (e) {
            localStorage.removeItem("managerAuth");
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, [mounted]);

  // Redirect logic
  useEffect(() => {
    // Only run after component is mounted and on client side
    if (!mounted || typeof window === 'undefined') return;
    
    if (!isLoading) {
      const isLoginPage = pathname === "/manager/login" || pathname === "/manager/login/";
      
      if (!isAuthenticated && !isLoginPage && pathname?.startsWith("/manager")) {
        router.replace("/manager/login");
      } else if (isAuthenticated && isLoginPage) {
        router.replace("/manager");
      }
    }
  }, [isAuthenticated, isLoading, pathname, router, mounted]);

  const login = async (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        const userData: User = {
          id: data.data.id,
          email: data.data.email,
          name: data.data.name,
          role: data.data.role
        };
        
        setIsAuthenticated(true);
        setUser(userData);
        setToken(data.data.token);
        
        localStorage.setItem("managerAuth", JSON.stringify({ 
          token: data.data.token, 
          user: userData 
        }));
        
        return { success: true };
      } else {
        return { success: false, message: data.message || 'Login failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Network error. Please check if server is running.' };
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setToken(null);
    localStorage.removeItem("managerAuth");
    router.push("/manager/login");
  };

  return (
    <ManagerAuthContext.Provider value={{ isAuthenticated, isLoading, login, logout, user, token }}>
      {children}
    </ManagerAuthContext.Provider>
  );
}

export function useManagerAuth() {
  const context = useContext(ManagerAuthContext);
  if (context === undefined) {
    throw new Error("useManagerAuth must be used within a ManagerAuthProvider");
  }
  return context;
}

