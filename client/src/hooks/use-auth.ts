import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export interface User {
  id: string;
  email: string;
  username: string;
  role: "patient" | "doctor";
  fullName: string;
  profilePicture?: string;
  patientProfileId?: string;
  doctorProfileId?: string;
  patient?: {
    _id: string;
    fullName: string;
    age?: number;
    gender?: string;
    contactNumber?: string;
    profilePicture?: string;
    address?: string;
    emergencyContact?: string;
    medicalHistory?: string;
  };
  doctor?: {
    _id: string;
    fullName: string;
    specialization?: string;
    verificationStatus?: string;
    consultationFee?: number;
    profilePicture?: string;
    bio?: string;
    qualification?: string;
    experience?: number;
    licenseNumber?: string;
  };
}

const API_BASE = "";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const navigate = useNavigate();

  const redirectBasedOnRole = (role: string) => {
    if (role === "doctor") {
      navigate("/doctor/dashboard");
    } else {
      navigate("/dashboard");
    }
  };

  const refreshUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const response = await fetch(`${API_BASE}/api/auth/me`, {
        headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
      }
    } catch (error) {
      console.error("Refresh user error:", error);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) { setIsLoading(false); return; }
      try {
        const response = await fetch(`${API_BASE}/api/auth/me`, {
          headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
        });
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        } else {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (credentials: { email: string; password: string; userType?: string }) => {
    setIsLoggingIn(true);
    try {
      const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: credentials.email, password: credentials.password }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Login failed");
      }
      const data = await response.json();
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("userRole", data.user.role);
      setUser(data.user);
      alert(`✅ Welcome back, ${data.user.fullName}!`);
      redirectBasedOnRole(data.user.role);
      return data;
    } catch (error: any) {
      alert(`Login failed: ${error.message}`);
      throw error;
    } finally {
      setIsLoggingIn(false);
    }
  };

  const register = async (data: {
    email: string;
    password: string;
    name: string;
    role?: string;
    age?: number;
    gender?: string;
    contactNumber?: string;
    specialization?: string;
    licenseNumber?: string;
    experience?: number;
    consultationFee?: number;
    bio?: string;
    profilePicture?: string;
    licensePicture?: string;
  }) => {
    setIsRegistering(true);
    try {
      const response = await fetch(`${API_BASE}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, role: data.role || "patient" }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Registration failed");
      }
      const result = await response.json();
      return result;
    } catch (error: any) {
      alert(`Registration failed: ${error.message}`);
      throw error;
    } finally {
      setIsRegistering(false);
    }
  };

  const updateProfile = async (updates: {
    fullName?: string;
    profilePicture?: string;
    age?: number;
    gender?: string;
    contactNumber?: string;
    address?: string;
    emergencyContact?: string;
    medicalHistory?: string;
    specialization?: string;
    qualification?: string;
    experience?: number;
    consultationFee?: number;
    bio?: string;
    licenseNumber?: string;
    licensePicture?: string;
    hospitalAffiliation?: string;
  }) => {
    const token = localStorage.getItem("token");
    if (!token || !user) throw new Error("Not authenticated");

    const endpoint = user.role === "doctor" ? "/api/profile/doctor" : "/api/profile/patient";
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: "PUT",
      headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });

    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error((result as any).message || "Failed to update profile");
    }

    await refreshUser();
    return result;
  };

  const deleteAccount = async (password: string) => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Not authenticated");
    const response = await fetch(`${API_BASE}/api/profile/account`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to delete account");
    }
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userRole");
    setUser(null);
    navigate("/");
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        await fetch(`${API_BASE}/api/auth/logout`, {
          method: "POST",
          headers: { "Authorization": `Bearer ${token}` },
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("userRole");
      setUser(null);
      navigate("/");
    }
  };

  const getToken = () => localStorage.getItem("token");
  const isAuthenticated = () => !!localStorage.getItem("token");
  const getUserRole = () => user?.role || localStorage.getItem("userRole");

  return {
    user,
    isLoading,
    login,
    register,
    logout,
    isLoggingIn,
    isRegistering,
    getToken,
    isAuthenticated,
    getUserRole,
    updateProfile,
    deleteAccount,
    refreshUser,
  };
}
