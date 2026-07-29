import React, { createContext, useCallback, useContext, useState, useEffect } from 'react';
import type { UserProfile } from '../types';

export interface User {
  id: string;
  email: string;
  name: string;
  picture?: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginWithGoogle: (credentialResponse: any) => Promise<boolean>;
  updateUserProfile: (data: { name?: string; picture?: string }) => Promise<void>;
  logout: () => void;
  userProfiles: UserProfile[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'tagihdong_session_token_v2';
const USER_KEY = 'tagihdong_session_user_v2';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const readSessionUser = (): User | null => {
  try {
    const saved = sessionStorage.getItem(USER_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    sessionStorage.removeItem(USER_KEY);
    return null;
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    return sessionStorage.getItem(TOKEN_KEY) ? readSessionUser() : null;
  });
  const [token, setToken] = useState<string | null>(() => {
    return sessionStorage.getItem(TOKEN_KEY);
  });
  const [userProfiles, setUserProfiles] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (token) {
      sessionStorage.setItem(TOKEN_KEY, token);
    } else {
      sessionStorage.removeItem(TOKEN_KEY);
    }

    if (user) {
      sessionStorage.setItem(USER_KEY, JSON.stringify(user));
    } else {
      sessionStorage.removeItem(USER_KEY);
    }
  }, [token, user]);

  useEffect(() => {
    if (!token) return;
    const controller = new AbortController();
    void fetch(`${API_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
      signal: controller.signal,
    })
      .then(async (response) => {
        const data = await response.json().catch(() => ({}));
        if (!response.ok || !data.user) throw new Error('Sesi tidak valid');
        setUser(data.user);
        if (data.profiles) setUserProfiles(data.profiles);
      })
      .catch((error) => {
        if (error instanceof DOMException && error.name === 'AbortError') return;
        setUser(null);
        setToken(null);
        setUserProfiles([]);
      });
    return () => controller.abort();
  }, [token]);

  const loginWithGoogle = useCallback(async (credentialPayload: any): Promise<boolean> => {
    setIsLoading(true);
    try {
      // API Login call to Backend PostgreSQL Server
      const res = await fetch(`${API_URL}/api/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentialPayload),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data.success && data.token && data.user) {
        setUser(data.user);
        setToken(data.token);
        if (data.profiles) setUserProfiles(data.profiles);
        setIsLoading(false);
        return true;
      }
      console.warn('Login ditolak:', data.error || `HTTP ${res.status}`);
      return false;
    } catch (err) {
      console.warn('Backend login tidak dapat dihubungi:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateUserProfile = async (data: { name?: string; picture?: string }) => {
    if (!user) return;
    if (token) {
      try {
        const response = await fetch(`${API_URL}/api/auth/me`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ name: data.name, picture: data.picture }),
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok || !result.user) throw new Error(result.error || 'Profil gagal diperbarui');
        const updatedUser = { ...user, ...result.user };
        setUser(updatedUser);
      } catch (e) {
        console.warn('Profil tidak dapat diperbarui:', e);
      }
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setUserProfiles([]);
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
    localStorage.removeItem('tagihdong_jwt_token_v1');
    localStorage.removeItem('tagihdong_auth_user_v1');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        isLoading,
        loginWithGoogle,
        updateUserProfile,
        logout,
        userProfiles,
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
