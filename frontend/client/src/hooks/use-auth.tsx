import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '@/services/api';

interface User {
  id: string;
  email: string;
  role: 'patient' | 'doctor';
  fullName?: string;
  doctorId?: string;
  patientId?: string;
  specialization?: string;
  consultationFee?: number;
  condition?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (data: any) => Promise<{ success: boolean; requiresVerification?: boolean }>;
  logout: () => void;
  isRegistering: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRegistering, setIsRegistering] = useState(false);

  // Load user from token on app start
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await api.get('/auth/me');
        if (response.data.success) {
          setUser(response.data.user);
        } else {
          localStorage.removeItem('token');
        }
      } catch (error) {
        console.error('Load user error:', error);
        localStorage.removeItem('token');
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  // FIXED: Login function - sends ONLY email and password (no extra fields)
  const login = async (email: string, password: string) => {
    try {
      console.log("Login attempt for:", email);
      
      // ✅ Send ONLY email and password (no extra fields)
      const response = await api.post('/auth/login', { 
        email: email, 
        password: password 
      });
      
      console.log("Login response:", response.data);
      
      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        setUser(response.data.user);
        return { success: true };
      } else {
        return { success: false, message: response.data.message };
      }
    } catch (error: any) {
      console.error("Login error:", error);
      const message = error.response?.data?.message || 'Login failed. Please try again.';
      return { success: false, message };
    }
  };

  // Register function
  const register = async (data: any): Promise<any> => {
    setIsRegistering(true);
    try {
      const endpoint = data.role === 'patient' ? '/auth/register/patient' : '/auth/register/doctor';
      
      // Format payload for backend
      const payload: any = {
        email: data.email,
        password: data.password,
        fullName: data.fullName,
        role: data.role,
      };

      if (data.role === 'doctor') {
        payload.specialization = data.specialization;
        payload.licenseNumber = data.licenseNumber;
        payload.consultationFee = data.consultationFee;
        payload.experience = data.experience || 0;
      } else {
        payload.age = data.age;
        payload.condition = data.condition;
        payload.contact = data.contact;
      }

      const response = await api.post(endpoint, payload);
      
      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        setUser(response.data.user);
        return { success: true };
      }
      return response.data;
    } catch (error: any) {
      console.error('Register error:', error);
      throw error;
    } finally {
      setIsRegistering(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, isRegistering }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}