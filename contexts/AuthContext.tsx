'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Role } from '@/types/auth';
import { getStoredUser, storeUser, clearStoredUser, mockLogin } from '@/lib/auth';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, role?: Role) => void;
  logout: () => void;
  updateRole: (role: Role) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = getStoredUser();
    setUser(storedUser);
    setIsLoading(false);
  }, []);

  const login = (email: string, role: Role = 'user') => {
    const newUser = mockLogin(email, role);
    setUser(newUser);
    storeUser(newUser);
  };

  const logout = () => {
    setUser(null);
    clearStoredUser();
  };

  const updateRole = (role: Role) => {
    if (user) {
      const updatedUser = { ...user, role };
      setUser(updatedUser);
      storeUser(updatedUser);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, updateRole }}>
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
