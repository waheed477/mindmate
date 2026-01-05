import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface User {
  id: string;
  email: string;
  username: string;
  role: "patient" | "doctor";
  fullName: string;
}

const API_BASE = "http://localhost:3000";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      
      if (!token) {
        setIsLoading(false);
        return;
      }
      
      try {
        const response = await fetch(`${API_BASE}/api/auth/me`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
          console.log("✅ User already logged in:", data.user);
          
          // Auto-redirect based on stored user role
          redirectBasedOnRole(data.user.role);
        } else {
          // Token invalid, clear it
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

  // Function to redirect based on role - MATCHES YOUR App.tsx ROUTES
  const redirectBasedOnRole = (role: string) => {
    console.log("🔀 Redirecting based on role:", role);
    if (role === "doctor") {
      // Match your App.tsx route: /doctor/dashboard
      navigate("/doctor/dashboard");
    } else {
      // Match your App.tsx route: /dashboard
      navigate("/dashboard");
    }
  };

  // Login function
  const login = async (credentials: { email: string; password: string; userType?: string }) => {
    setIsLoggingIn(true);
    try {
      console.log("🔐 Attempting login with:", { 
        email: credentials.email, 
        userType: credentials.userType || "unknown" 
      });

      // Backend expects "username" field, frontend sends "email"
      const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: credentials.email,
          password: credentials.password
        }),
      });

      console.log("📥 Login response status:", response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Login error response:", errorText);
        let errorMessage = "Login failed";
        
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorMessage;
        } catch {
          errorMessage = errorText || errorMessage;
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log("✅ Login successful:", { 
        user: data.user.email, 
        role: data.user.role 
      });
      
      // Store token in localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("userRole", data.user.role);
      
      // Set user state
      setUser(data.user);
      
      // Show success message
      alert(`✅ Welcome back, ${data.user.fullName}!`);
      
      // Redirect based on role
      redirectBasedOnRole(data.user.role);
      
      return data;
    } catch (error) {
      console.error("❌ Login error:", error);
      alert(`Login failed: ${error.message}`);
      throw error;
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Register function
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
  }) => {
    setIsRegistering(true);
    try {
      const registrationData = {
        email: data.email,
        password: data.password,
        name: data.name,
        role: data.role || "patient",
        age: data.age,
        gender: data.gender,
        contactNumber: data.contactNumber,
        specialization: data.specialization,
        licenseNumber: data.licenseNumber,
        experience: data.experience,
        consultationFee: data.consultationFee
      };
      
      console.log("📤 Sending registration data:", registrationData);
      
      const response = await fetch(`${API_BASE}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registrationData),
      });

      console.log("📥 Registration response status:", response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Registration error response:", errorText);
        let errorMessage = "Registration failed";
        
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorMessage;
        } catch {
          errorMessage = errorText || errorMessage;
        }
        
        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log("✅ Registration successful");
      
      // Show success message
      alert(`✅ Registration successful! Please login with your credentials.`);
      
      // Redirect to login page
      navigate("/login");
      
      return result;
    } catch (error) {
      console.error("❌ Registration error:", error);
      alert(`Registration failed: ${error.message}`);
      throw error;
    } finally {
      setIsRegistering(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        await fetch(`${API_BASE}/api/auth/logout`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
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

  // Get current token
  const getToken = () => {
    return localStorage.getItem("token");
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!localStorage.getItem("token");
  };

  // Get user role
  const getUserRole = () => {
    return user?.role || localStorage.getItem("userRole");
  };

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
  };
}