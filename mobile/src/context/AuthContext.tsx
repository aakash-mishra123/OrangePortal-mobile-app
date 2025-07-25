import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiRequest } from '../services/api';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  mobile: string;
  createdAt: string;
  updatedAt: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string) => Promise<void>;
  signup: (userData: {
    email: string;
    mobile: string;
    firstName: string;
    lastName: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const sessionId = await AsyncStorage.getItem('sessionId');
      if (sessionId) {
        const userData = await apiRequest('/api/auth/user', 'GET');
        if (userData) {
          setUser(userData);
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string) => {
    try {
      const userData = await apiRequest('/api/auth/login', 'POST', { email });
      setUser(userData);
      await AsyncStorage.setItem('sessionId', 'authenticated');
    } catch (error) {
      throw error;
    }
  };

  const signup = async (userData: {
    email: string;
    mobile: string;
    firstName: string;
    lastName: string;
  }) => {
    try {
      const newUser = await apiRequest('/api/auth/register', 'POST', userData);
      setUser(newUser);
      await AsyncStorage.setItem('sessionId', 'authenticated');
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await apiRequest('/api/auth/logout', 'POST');
      setUser(null);
      await AsyncStorage.removeItem('sessionId');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}