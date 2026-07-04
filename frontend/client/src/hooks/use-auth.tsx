import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '@/services/api';

interface User {
  id: string;
  email: string;
  role: 'patient' | 'doctor';
  fullName?: string;
  doctorId?: string;
  patientId?: string;
  doctorProfileId?: string;
  patientProfileId?: string;
  specialization?: string;
  consultationFee?: number;
  condition?: string;
  doctor?: any;
  patient?: any;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isLoggingIn: boolean;
  isRegistering: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; requiresVerification?: boolean; email?: string; message?: string; role?: string }>;
  register: (data: any) => Promise<{ success: boolean; requiresVerification?: boolean; email?: string }>;
  verifyEmail: (email: string, code: string) => Promise<any>;
  resendVerification: (email: string) => Promise<any>;
  sendMagicLink: (email: string) => Promise<{ success: boolean; message?: string; magicToken?: string }>;
  logout: () => void;
  getToken: () => string | null;
  updateProfile: (updates: any) => Promise<void>;
  deleteAccount: (password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  const getToken = (): string | null => localStorage.getItem('token');

  useEffect(() => {
    const loadUser = async () => {
      // 1. Google OAuth Redirect Handler (check for ?token=xxx)
      const params = new URLSearchParams(window.location.search);
      const urlToken = params.get('token');
      if (urlToken) {
        localStorage.setItem('token', urlToken);
        // Clean URL query parameters
        window.history.replaceState({}, document.title, window.location.pathname);
      }

      // 2. Magic Link Sign-In Handler (check for ?magicToken=xxx)
      const magicToken = params.get('magicToken');
      if (magicToken) {
        setIsLoading(true);
        try {
          const response = await api.post('/auth/magic-login', { token: magicToken });
          if (response.data.success) {
            localStorage.setItem('token', response.data.token);
            setUser(response.data.user);
            // Clean URL query parameters
            window.history.replaceState({}, document.title, window.location.pathname);
            setIsLoading(false);
            return;
          }
        } catch (error) {
          console.error('Magic login validation error:', error);
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      }

      const token = getToken();
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        const response = await api.get('/auth/me');
        if (response.data.success) {
          setUser(response.data.user);
          // Auto-refresh token on page load
          if (response.data.token) {
            localStorage.setItem('token', response.data.token);
          }
        } else {
          localStorage.removeItem('token');
        }
      } catch {
        localStorage.removeItem('token');
      } finally {
        setIsLoading(false);
      }
    };
    loadUser();
  }, []);

  // FIXED: Login function - removed AbortController and timeout
  const login = async (email: string, password: string) => {
    setIsLoggingIn(true);
    try {
      // ✅ Simple request without timeout
      const response = await api.post('/auth/login', { email, password });
      
      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        setUser(response.data.user);
        return { success: true, role: response.data.user?.role as string };
      }
      return { success: false, message: response.data.message };
    } catch (error: any) {
      console.error("Login error:", error);
      
      const data = error.response?.data;
      if (data?.requiresVerification) {
        return {
          success: false,
          requiresVerification: true,
          email: data.email,
          message: data.message
        };
      }
      const message = error.response?.data?.message || 'Login failed. Please try again.';
      return { success: false, message };
    } finally {
      setIsLoggingIn(false);
    }
  };

  // FIXED: Register function - removed AbortController and timeout
  const register = async (data: any): Promise<any> => {
    setIsRegistering(true);
    try {
      // ✅ Simple request without timeout
      const endpoint = data.role === 'patient' ? '/auth/register/patient' : '/auth/register/doctor';
      const response = await api.post(endpoint, data);
      
      if (response.data.success) {
        if (response.data.requiresVerification) {
          return { success: true, requiresVerification: true, email: response.data.email };
        }
        localStorage.setItem('token', response.data.token);
        setUser(response.data.user);
        return { success: true };
      }
      return response.data;
    } catch (error: any) {
      console.error('Register error:', error.response?.data || error.message);
      throw error;
    } finally {
      setIsRegistering(false);
    }
  };

  const verifyEmail = async (email: string, code: string) => {
    const response = await api.post('/auth/verify-email', { email, code });
    if (response.data.token && response.data.user) {
      localStorage.setItem('token', response.data.token);
      setUser(response.data.user);
    }
    return response.data;
  };

  const resendVerification = async (email: string) => {
    const response = await api.post('/auth/resend-verification', { email });
    return response.data;
  };

  const sendMagicLink = async (email: string) => {
    try {
      const response = await api.post('/auth/magic-link', { email });
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to send magic link.';
      return { success: false, message };
    }
  };

  const updateProfile = async (updates: any): Promise<void> => {
    if (!user) throw new Error('Not authenticated');
    if (user.role === 'doctor') {
      await api.put('/profile/doctor', updates);
    } else {
      await api.put('/profile/patient', updates);
    }
    if (updates.fullName || updates.profilePicture !== undefined) {
      await api.put('/profile/user', {
        fullName: updates.fullName,
        profilePicture: updates.profilePicture,
      });
    }
    const meRes = await api.get('/auth/me');
    if (meRes.data.success) setUser(meRes.data.user);
  };

  const deleteAccount = async (password: string): Promise<void> => {
    await api.delete('/profile/account', { data: { password } });
    localStorage.removeItem('token');
    setUser(null);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user, isLoading, isLoggingIn, isRegistering,
      login, register, verifyEmail, resendVerification, sendMagicLink, logout, getToken,
      updateProfile, deleteAccount,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}