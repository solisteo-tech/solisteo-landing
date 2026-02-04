'use client';

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import api from '../lib/api';
import { getToken, setToken, clearToken } from '../lib/security';

interface User {
  id: string;
  email: string;
  full_name?: string;
  company_name?: string;
  company_id?: string;
  role: string; // 'admin', 'super_admin', 'owner', 'viewer'
  user_type: string; // 'admin' or 'user'
  subscription_plan?: string;
  is_active: boolean;
  mfa_enabled?: boolean;
  support_wa_number?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: { email: string; password: string; company_name: string; role?: string }) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') {
      setIsLoading(false);
      return;
    }

    const token = getToken();
    if (token && api.defaults.baseURL) {
      // Verify token and get user info
      api.get('/api/v2/auth/me')
        .then(response => {
          setUser(response.data);
        })
        .catch(() => {
          clearToken();
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    let access_token = '';
    try {
      const formData = new URLSearchParams();
      formData.append('username', email.toLowerCase().trim());
      formData.append('password', password);

      const response = await api.post('/api/v2/auth/login', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      // Check for MFA requirement
      if (response.data.mfa_required) {
        const customError: any = new Error('MFA Required');
        customError.isMfaRequired = true;
        customError.token = response.data.mfa_token; // This is the temporary MFA token
        throw customError;
      }

      access_token = response.data.access_token;

      // Get user info using the fresh token (explicit header to avoid race with interceptor)
      const userResponse = await api.get('/api/v2/auth/me', {
        headers: { Authorization: `Bearer ${access_token}` }
      });
      // Persist token securely with role
      setToken(access_token, userResponse.data.role);
      setUser(userResponse.data);
    } catch (error: any) {
      if (error.isMfaRequired) {
        throw error;
      }
      throw error;
    }
  };

  const register = async (userData: { email: string; password: string; company_name: string; role?: string }) => {
    try {
      const registerData = {
        email: userData.email.toLowerCase().trim(),
        password: userData.password,
        company_name: userData.company_name.trim(),
        role: userData.role || 'seller'
      };
      await api.post('/api/v1/auth/register', registerData);
      // After register, login
      await login(userData.email, userData.password);
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    clearToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};