import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { User, Profile } from '../types.ts';

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  token: string | null;
  isLoading: boolean;
  unreadNotificationsCount: number;
  login: (emailOrUsername: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: {
    username: string;
    displayName?: string;
    email: string;
    password: string;
    confirmPassword?: string;
    robloxUsername?: string;
    discordTag?: string;
    avatarUrl?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<Profile>) => Promise<{ success: boolean; error?: string }>;
  refreshAuth: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  decrementUnread: () => void;
  clearUnread: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('tf_auth_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState<number>(0);

  const refreshAuth = useCallback(async () => {
    const currentToken = localStorage.getItem('tf_auth_token');
    if (!currentToken) {
      setUser(null);
      setProfile(null);
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/me', {
        headers: {
          Authorization: `Bearer ${currentToken}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setProfile(data.profile);
        setUnreadNotificationsCount(data.unreadNotifications || 0);
      } else {
        localStorage.removeItem('tf_auth_token');
        setToken(null);
        setUser(null);
        setProfile(null);
      }
    } catch {
      // Offline / server error fallback
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshAuth();
  }, [refreshAuth]);

  const login = async (emailOrUsername: string, password: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailOrUsername, password }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || 'Login failed' };
      }

      localStorage.setItem('tf_auth_token', data.token);
      setToken(data.token);
      setUser(data.user);
      setProfile(data.profile);
      await refreshAuth();
      return { success: true };
    } catch {
      return { success: false, error: 'Network error connecting to TradeForge servers.' };
    }
  };

  const register = async (formData: {
    username: string;
    displayName?: string;
    email: string;
    password: string;
    confirmPassword?: string;
    robloxUsername?: string;
    discordTag?: string;
    avatarUrl?: string;
  }) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          displayName: formData.displayName || formData.username,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || 'Registration failed' };
      }

      localStorage.setItem('tf_auth_token', data.token);
      setToken(data.token);
      setUser(data.user);
      setProfile(data.profile);
      await refreshAuth();
      return { success: true };
    } catch {
      return { success: false, error: 'Network error connecting to TradeForge servers.' };
    }
  };

  const logout = async () => {
    const currentToken = token || localStorage.getItem('tf_auth_token');
    if (currentToken) {
      try {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${currentToken}` },
        });
      } catch {
        // Continue client wipe
      }
    }
    localStorage.removeItem('tf_auth_token');
    setToken(null);
    setUser(null);
    setProfile(null);
    setUnreadNotificationsCount(0);
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    const currentToken = token || localStorage.getItem('tf_auth_token');
    if (!currentToken) return { success: false, error: 'Not authenticated' };

    try {
      const res = await fetch('/api/settings/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${currentToken}`,
        },
        body: JSON.stringify(updates),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || 'Update failed' };
      }

      setProfile(data.profile);
      if (user && updates.displayName) {
        setUser({ ...user, displayName: updates.displayName });
      }
      return { success: true };
    } catch {
      return { success: false, error: 'Failed to update profile.' };
    }
  };

  const decrementUnread = () => {
    setUnreadNotificationsCount((prev) => Math.max(0, prev - 1));
  };

  const clearUnread = () => {
    setUnreadNotificationsCount(0);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        token,
        isLoading,
        unreadNotificationsCount,
        login,
        register,
        logout,
        updateProfile,
        refreshAuth,
        refreshProfile: refreshAuth,
        decrementUnread,
        clearUnread,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
