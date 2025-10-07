'use client'
import React, { createContext, useContext } from 'react';

interface AuthContextType {
  isLoggedIn: boolean;
}

const AuthContext = createContext<AuthContextType>({ isLoggedIn: true }); // Temporary: Remove hardcoded value when implementing auth

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthContext.Provider value={{ isLoggedIn: true }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);