'use client';

import { createContext, useContext, useState } from 'react';

const UserContext = createContext<{
  user: { id: string; username: string; role: string } | null;
  setUser: React.Dispatch<
    React.SetStateAction<{ id: string; username: string; role: string }[]>
  >;
  isAuthenticated: boolean;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
} | null>(null);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<{
    id: string;
    username: string;
    role: Array<any>;
  } | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <UserContext.Provider
      value={{ user, setUser, isAuthenticated, setIsAuthenticated }}
    >
      {children}
    </UserContext.Provider>
  );
};

// Custom hook
export const useUserContext = () => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error('useUserContext must be used within UserProvider');
  }

  return context;
};
