'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Company, AuthContextType } from '@/types/auth';
import { authAPI } from '@/lib/api';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('jwt_token');
      const userId = localStorage.getItem('user_id');
      const userRole = localStorage.getItem('user_role');
      const userData = localStorage.getItem('user_data');

      if (token && userId && userRole && userData) {
        try {
          // Verify token is still valid by fetching current user
          const currentUser = await authAPI.getCurrentUser();
          setUser(currentUser);
          setCompany(JSON.parse(localStorage.getItem('company_data') || 'null'));
          setPermissions(JSON.parse(localStorage.getItem('permissions') || '[]'));
        } catch (error) {
          // Token is invalid, clear auth data
          authAPI.logout();
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authAPI.login(email, password);
      
      // Store auth data in localStorage
      localStorage.setItem('jwt_token', response.access_token);
      localStorage.setItem('user_id', response.user.id);
      localStorage.setItem('user_role', response.user.role);
      localStorage.setItem('user_data', JSON.stringify(response.user));
      localStorage.setItem('permissions', JSON.stringify(response.permissions));
      
      if (response.company) {
        localStorage.setItem('company_data', JSON.stringify(response.company));
        setCompany(response.company);
      }
      
      setUser(response.user);
      setPermissions(response.permissions);
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    authAPI.logout();
    setUser(null);
    setCompany(null);
    setPermissions([]);
  };

  const refreshUser = async () => {
    try {
      const currentUser = await authAPI.getCurrentUser();
      setUser(currentUser);
      localStorage.setItem('user_data', JSON.stringify(currentUser));
    } catch (error) {
      logout();
    }
  };

  const value: AuthContextType = {
    user,
    company,
    permissions,
    isAuthenticated,
    isLoading,
    login,
    logout,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
