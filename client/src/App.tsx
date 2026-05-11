import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@components/ui/toaster";
import { useAuth } from "@hooks/use-auth";
import { Loader2 } from "lucide-react";
import { queryClient } from "@lib/queryClient";
import { Footer } from "@components/layout-footer";

// Import pages
import NotFound from "@pages/not-found";
import Home from "@pages/home";
import Login from "@pages/login";
import Register from "@pages/register";
import DoctorsList from "@pages/doctors-list";
import DoctorProfile from "@pages/DoctorProfile";
import PatientDashboard from "@pages/dashboard/patient";
import DoctorDashboard from "@pages/dashboard/doctor";
import Terms from "@pages/terms";
import Privacy from "@pages/privacy";

function ProtectedRoute({ children, allowedRole }: { children: React.ReactNode, allowedRole?: "patient" | "doctor" }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="flex flex-col min-h-screen">
          <main className="flex-1">
            <Routes>
              {/* Public Routes - Check auth inside each route */}
              <Route path="/" element={<HomeOrRedirect />} />
              <Route path="/login" element={<LoginOrRedirect />} />
              <Route path="/register" element={<RegisterOrRedirect />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              
              {/* Protected Routes - Patient */}
              <Route
                path="/doctors"
                element={
                  <ProtectedRoute allowedRole="patient">
                    <DoctorsList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/doctors/:id"
                element={
                  <ProtectedRoute allowedRole="patient">
                    <DoctorProfile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute allowedRole="patient">
                    <PatientDashboard />
                  </ProtectedRoute>
                }
              />
              
              {/* Protected Routes - Doctor */}
              <Route
                path="/doctor/dashboard"
                element={
                  <ProtectedRoute allowedRole="doctor">
                    <DoctorDashboard />
                  </ProtectedRoute>
                }
              />
              
              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
        <Toaster />
      </Router>
    </QueryClientProvider>
  );
}

// Helper components for auth-based redirects
function HomeOrRedirect() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Redirect logged-in users to their dashboard
  if (user) {
    if (user.role === "patient") {
      return <Navigate to="/dashboard" replace />;
    } else if (user.role === "doctor") {
      return <Navigate to="/doctor/dashboard" replace />;
    }
  }

  return <Home />;
}

function LoginOrRedirect() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Redirect logged-in users to their dashboard
  if (user) {
    if (user.role === "patient") {
      return <Navigate to="/dashboard" replace />;
    } else if (user.role === "doctor") {
      return <Navigate to="/doctor/dashboard" replace />;
    }
  }

  return <Login />;
}

function RegisterOrRedirect() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Redirect logged-in users to their dashboard
  if (user) {
    if (user.role === "patient") {
      return <Navigate to="/dashboard" replace />;
    } else if (user.role === "doctor") {
      return <Navigate to="/doctor/dashboard" replace />;
    }
  }

  return <Register />;
}

export default App;