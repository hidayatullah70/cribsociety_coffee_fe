import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session, UserRole } from '../types';
import { apiClient } from '../api';

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, role?: UserRole) => Promise<void>;
  register: (name: string, email: string, role?: UserRole) => Promise<void>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('csc_auth_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [session, setSession] = useState<Session | null>(() => {
    const saved = localStorage.getItem('csc_auth_session');
    return saved ? JSON.parse(saved) : null;
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user && session) {
      localStorage.setItem('csc_auth_user', JSON.stringify(user));
      localStorage.setItem('csc_auth_session', JSON.stringify(session));
    } else {
      localStorage.removeItem('csc_auth_user');
      localStorage.removeItem('csc_auth_session');
    }
  }, [user, session]);

  const login = async (email: string, role?: UserRole) => {
    setIsLoading(true);
    try {
      const resp = await apiClient.login(email, role);
      setUser(resp.user);
      setSession(resp.session);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, role?: UserRole) => {
    setIsLoading(true);
    try {
      const resp = await apiClient.register(name, email, role);
      setUser(resp.user);
      setSession(resp.session);
    } finally {
      setIsLoading(false);
    }
  };


  const logout = () => {
    setUser(null);
    setSession(null);
    localStorage.removeItem('csc_auth_user');
    localStorage.removeItem('csc_auth_session');
  };

  const switchRole = (role: UserRole) => {
    if (!user) return;
    const isOwner = role === 'owner';
    const isGuest = role === 'guest';
    const updatedUser: User = {
      ...user,
      role,
      name: isGuest ? 'Guest Customer' : isOwner ? 'Levi (Owner)' : 'Farhan (Barista)',
      email: isGuest ? 'guest@cribsociety.coffee' : isOwner ? 'owner@cribsociety.coffee' : 'staff@cribsociety.coffee',
    };
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        switchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
