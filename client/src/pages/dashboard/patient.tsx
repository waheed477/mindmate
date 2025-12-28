import { useAuth } from "@/hooks/use-auth";
import { useAppointments } from "@/hooks/use-appointments";
import { Navbar } from "@/components/layout-navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, CheckCircle2, Clock, XCircle, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function PatientDashboard() {
  const { user } = useAuth();
  const { data: appointments, isLoading } = useAppointments();

  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  const upcomingAppointments = appointments?.filter(
    (app) => app.status === "accepted" || app.status === "pending"
  ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()) || [];

  const pastAppointments = appointments?.filter(
    (app) => app.status === "completed" || app.status === "cancelled" || app.status === "rejected"
  ) || [];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-8 space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold font-display tracking-tight">Welcome back, {user?.patient?.fullName}</h1>
            <p className="text-muted-foreground">Manage your health journey and upcoming consultations.</p>
          </div>
          <Link href="/doctors">
            <Button className="shadow-lg shadow-primary/20">Book New Appointment</Button>
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-bold font-display">Upcoming Appointments</h2>
            {upcomingAppointments.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center h-48 text-muted-foreground">
                  <Calendar className="h-8 w-8 mb-2 opacity-50" />
                  <p>No upcoming appointments.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {upcomingAppointments.map((app) => (
                  <AppointmentCard key={app.id} appointment={app} />
                ))}
              </div>
            )}

            <h2 className="text-xl font-bold font-display pt-4">Past History</h2>
            {pastAppointments.length === 0 ? (
              <p className="text-muted-foreground text-sm">No past appointments found.</p>
            ) : (
              <div className="space-y-4">
                {pastAppointments.map((app) => (
                  <AppointmentCard key={app.id} appointment={app} isHistory />
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="bg-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle className="text-lg">Health Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                  <li>Take 5 minutes to meditate today.</li>
                  <li>Ensure you get 7-8 hours of sleep.</li>
                  <li>Stay hydrated throughout the day.</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function AppointmentCard({ appointment, isHistory }: { appointment: any, isHistory?: boolean }) {
  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    accepted: "bg-green-100 text-green-800 border-green-200",
    rejected: "bg-red-100 text-red-800 border-red-200",
    cancelled: "bg-gray-100 text-gray-800 border-gray-200",
    completed: "bg-blue-100 text-blue-800 border-blue-200",
  };

  const StatusIcon = {
    pending: Clock,
    accepted: CheckCircle2,
    rejected: XCircle,
    cancelled: XCircle,
    completed: CheckCircle2,
  }[appointment.status as keyof typeof statusColors] || AlertCircle;

  return (
    <Card className={`transition-all ${!isHistory ? 'shadow-md border-l-4 border-l-primary' : 'bg-muted/30'}`}>
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-semibold text-lg">{appointment.doctor?.fullName}</h3>
            <p className="text-sm text-muted-foreground">{appointment.doctor?.specialization}</p>
          </div>
          <Badge variant="outline" className={`${statusColors[appointment.status as keyof typeof statusColors]} capitalize gap-1 pr-3`}>
            <StatusIcon className="h-3 w-3" />
            {appointment.status}
          </Badge>
        </div>
        
        <div className="flex gap-6 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{format(new Date(appointment.date), "PPP")}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{format(new Date(appointment.date), "p")}</span>
          </div>
        </div>

        {appointment.notes && (
          <div className="mt-4 p-3 bg-muted rounded-md text-sm">
            <span className="font-semibold block mb-1">Doctor's Note:</span>
            {appointment.notes}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
