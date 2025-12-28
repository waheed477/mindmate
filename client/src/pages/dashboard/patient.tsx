import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useAppointments } from "@/hooks/use-appointments";
import { Navbar } from "@/components/layout-navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, CheckCircle2, Clock, XCircle, AlertCircle, MessageSquare } from "lucide-react";
import { format } from "date-fns";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function PatientDashboard() {
  const { user } = useAuth();
  const { data: appointments, isLoading } = useAppointments();
  const [viewingNotes, setViewingNotes] = useState<{ doctor: string, notes: string } | null>(null);

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
                  <AppointmentCard key={app.id} appointment={app} onViewNotes={(notes) => setViewingNotes({ doctor: app.doctor?.fullName || 'Doctor', notes })} />
                ))}
              </div>
            )}

            <h2 className="text-xl font-bold font-display pt-4">Past History</h2>
            {pastAppointments.length === 0 ? (
              <p className="text-muted-foreground text-sm">No past appointments found.</p>
            ) : (
              <div className="space-y-4">
                {pastAppointments.map((app) => (
                  <AppointmentCard key={app.id} appointment={app} isHistory onViewNotes={(notes) => setViewingNotes({ doctor: app.doctor?.fullName || 'Doctor', notes })} />
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

      <Dialog open={viewingNotes !== null} onOpenChange={(open) => !open && setViewingNotes(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Message from {viewingNotes?.doctor}</DialogTitle>
            <DialogDescription>
              Medical advice or suggestions regarding your appointment.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="mt-4 max-h-[300px] rounded-md border p-4">
            <div className="whitespace-pre-wrap text-sm leading-relaxed">
              {viewingNotes?.notes}
            </div>
          </ScrollArea>
          <div className="flex justify-end mt-4">
            <Button onClick={() => setViewingNotes(null)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function AppointmentCard({ appointment, isHistory, onViewNotes }: { appointment: any, isHistory?: boolean, onViewNotes: (notes: string) => void }) {
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
          <div className="flex flex-col items-end gap-2">
            <Badge variant="outline" className={`${statusColors[appointment.status as keyof typeof statusColors]} capitalize gap-1 pr-3`}>
              <StatusIcon className="h-3 w-3" />
              {appointment.status}
            </Badge>
            {appointment.notes && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-7 text-xs gap-1.5 text-primary hover:text-primary hover:bg-primary/10"
                onClick={() => onViewNotes(appointment.notes)}
              >
                <MessageSquare className="h-3.5 w-3.5" />
                View Doctor's Note
              </Button>
            )}
          </div>
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
      </CardContent>
    </Card>
  );
}
