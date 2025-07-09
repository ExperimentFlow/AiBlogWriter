'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useUser } from '../hooks/useUser';

// Create the context
const UserContext = createContext<ReturnType<typeof useUser> | undefined>(undefined);

// Provider component
interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const userHook = useUser();

  return (
    <UserContext.Provider value={userHook}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the user context
export const useUserContext = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
}; 