import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "@lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@components/ui/toaster";
import { useAuth } from "@hooks/use-auth";
import { Loader2 } from "lucide-react";

import NotFound from "@pages/not-found";
import Home from "@pages/home";
import Login from "@pages/login";
import Register from "@pages/register";
import DoctorsList from "@pages/doctors-list";
import PatientDashboard from "@pages/dashboard/patient";
import DoctorDashboard from "@pages/dashboard/doctor";
import Terms from "@pages/terms";
import Privacy from "@pages/privacy";
import { Footer } from "@components/layout-footer";

function ProtectedRoute({ component: Component, allowedRole }: { component: any, allowedRole?: 'patient' | 'doctor' }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Redirect to="/login" />;
  }

  if (allowedRole && user.role !== allowedRole) {
    return <Redirect to="/" />;
  }

  return <Component />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/terms" component={Terms} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/doctors">
        <ProtectedRoute component={DoctorsList} allowedRole="patient" />
      </Route>
      <Route path="/dashboard">
        <ProtectedRoute component={PatientDashboard} allowedRole="patient" />
      </Route>
      <Route path="/doctor/dashboard">
        <ProtectedRoute component={DoctorDashboard} allowedRole="doctor" />
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex flex-col min-h-screen">
        <main className="flex-1">
          <Router />
        </main>
        <Footer />
      </div>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
