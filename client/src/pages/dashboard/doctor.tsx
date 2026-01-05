// src/pages/dashboard/doctor.tsx
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useDoctorAppointments, useUpdateAppointment } from "@/hooks/use-appointments";
import { Navbar } from "@/components/layout-navbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Calendar,
  Clock,
  User,
  CheckCircle2,
  XCircle,
  MessageSquare,
  AlertCircle,
  Bell,
  Users,
  Activity,
} from "lucide-react";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function DoctorDashboard() {
  const { user } = useAuth();
  const { data: appointments = [], isLoading } = useDoctorAppointments(user?.doctor?._id || user?.id);
  const { mutate: updateAppointment } = useUpdateAppointment();
  
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [action, setAction] = useState<"accept" | "reject" | "complete" | null>(null);
  const [doctorNotes, setDoctorNotes] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  // Filter appointments
  const filteredAppointments = appointments.filter((app: any) => {
    if (filterStatus === "all") return true;
    return app.status === filterStatus;
  });

  const pendingAppointments = appointments.filter((app: any) => app.status === "pending");
  const upcomingAppointments = appointments.filter((app: any) => app.status === "accepted");
  const completedAppointments = appointments.filter((app: any) => app.status === "completed");

  const handleAction = () => {
    if (!selectedAppointment || !action) return;

    let newStatus = "";
    switch (action) {
      case "accept":
        newStatus = "accepted";
        break;
      case "reject":
        newStatus = "rejected";
        break;
      case "complete":
        newStatus = "completed";
        break;
    }

    updateAppointment({
      id: selectedAppointment._id,
      status: newStatus,
      notes: doctorNotes || undefined,
    });

    // Reset
    setSelectedAppointment(null);
    setAction(null);
    setDoctorNotes("");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-8 flex items-center justify-center">
          <div className="text-center">Loading appointments...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-8 space-y-8">
        {/* Header */}
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold font-display tracking-tight">
              Dr. {user?.doctor?.fullName || user?.fullName}
            </h1>
            {user?.doctor?.verificationStatus === "verified" && (
              <Badge className="bg-green-500/10 text-green-600 border-green-200">
                ✓ Verified
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground">
            Manage your appointments and patient consultations
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard
            icon={<Bell className="h-5 w-5" />}
            label="Pending Requests"
            value={pendingAppointments.length}
            color="yellow"
          />
          <StatCard
            icon={<Calendar className="h-5 w-5" />}
            label="Upcoming"
            value={upcomingAppointments.length}
            color="blue"
          />
          <StatCard
            icon={<CheckCircle2 className="h-5 w-5" />}
            label="Completed"
            value={completedAppointments.length}
            color="green"
          />
          <StatCard
            icon={<Users className="h-5 w-5" />}
            label="Total Patients"
            value={new Set(appointments.map((a: any) => a.patientId)).size}
            color="purple"
          />
        </div>

        <Tabs defaultValue="requests" className="w-full">
          <TabsList className="grid w-full grid-cols-4 lg:w-[500px]">
            <TabsTrigger value="requests">
              Requests ({pendingAppointments.length})
            </TabsTrigger>
            <TabsTrigger value="upcoming">
              Upcoming ({upcomingAppointments.length})
            </TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="all">All Appointments</TabsTrigger>
          </TabsList>

          {/* Pending Requests Tab */}
          <TabsContent value="requests" className="space-y-4 mt-6">
            {pendingAppointments.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Bell className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground">No pending appointment requests</p>
                </CardContent>
              </Card>
            ) : (
              pendingAppointments.map((appointment: any) => (
                <AppointmentRequestCard
                  key={appointment._id}
                  appointment={appointment}
                  onAction={(app, actionType) => {
                    setSelectedAppointment(app);
                    setAction(actionType);
                  }}
                />
              ))
            )}
          </TabsContent>

          {/* Upcoming Appointments Tab */}
          <TabsContent value="upcoming" className="space-y-4 mt-6">
            {upcomingAppointments.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground">No upcoming appointments</p>
                </CardContent>
              </Card>
            ) : (
              upcomingAppointments.map((appointment: any) => (
                <UpcomingAppointmentCard
                  key={appointment._id}
                  appointment={appointment}
                  onComplete={() => {
                    setSelectedAppointment(appointment);
                    setAction("complete");
                  }}
                />
              ))
            )}
          </TabsContent>

          {/* Completed Appointments Tab */}
          <TabsContent value="completed" className="space-y-4 mt-6">
            {completedAppointments.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <CheckCircle2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground">No completed appointments</p>
                </CardContent>
              </Card>
            ) : (
              completedAppointments.map((appointment: any) => (
                <CompletedAppointmentCard key={appointment._id} appointment={appointment} />
              ))
            )}
          </TabsContent>

          {/* All Appointments Tab */}
          <TabsContent value="all" className="space-y-4 mt-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Label htmlFor="filter">Filter by:</Label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="accepted">Accepted</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button variant="outline" size="sm">
                Export
              </Button>
            </div>

            <div className="space-y-4">
              {filteredAppointments.map((appointment: any) => (
                <AppointmentCard key={appointment._id} appointment={appointment} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Action Dialog */}
      <Dialog open={selectedAppointment !== null} onOpenChange={(open) => !open && setSelectedAppointment(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {action === "accept" && "Accept Appointment Request"}
              {action === "reject" && "Reject Appointment Request"}
              {action === "complete" && "Complete Appointment"}
            </DialogTitle>
            <DialogDescription>
              {selectedAppointment?.patient?.fullName} -{" "}
              {format(new Date(selectedAppointment?.date || new Date()), "PPP p")}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {selectedAppointment?.symptoms && (
              <div>
                <h4 className="font-medium mb-2">Patient's Symptoms:</h4>
                <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                  {selectedAppointment.symptoms}
                </p>
              </div>
            )}

            <div>
              <Label htmlFor="doctor-notes">Doctor's Notes {action === "reject" && "(Required)"}</Label>
              <Textarea
                id="doctor-notes"
                placeholder={
                  action === "accept"
                    ? "Add consultation notes or instructions for the patient..."
                    : action === "reject"
                    ? "Please provide reason for rejection..."
                    : "Add consultation summary and recommendations..."
                }
                value={doctorNotes}
                onChange={(e) => setDoctorNotes(e.target.value)}
                className="min-h-[120px] mt-2"
                required={action === "reject"}
              />
            </div>

            {action === "accept" && (
              <div className="p-3 bg-blue-50 rounded-md">
                <p className="text-sm text-blue-700">
                  <AlertCircle className="h-4 w-4 inline mr-1" />
                  The patient will be notified of your acceptance and the appointment will be scheduled.
                </p>
              </div>
            )}

            {action === "reject" && (
              <div className="p-3 bg-yellow-50 rounded-md">
                <p className="text-sm text-yellow-700">
                  <AlertCircle className="h-4 w-4 inline mr-1" />
                  Please provide a constructive reason for rejection. The patient will be notified.
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedAppointment(null)}>
              Cancel
            </Button>
            <Button
              onClick={handleAction}
              disabled={action === "reject" && !doctorNotes.trim()}
              variant={action === "reject" ? "destructive" : "default"}
            >
              {action === "accept" && "Accept Appointment"}
              {action === "reject" && "Reject Appointment"}
              {action === "complete" && "Mark as Complete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// StatCard Component
function StatCard({ icon, label, value, color }: { 
  icon: React.ReactNode; 
  label: string; 
  value: number | string; 
  color: string;
}) {
  const colorClasses = {
    blue: "bg-blue-500/10 text-blue-600 border-blue-200",
    yellow: "bg-yellow-500/10 text-yellow-600 border-yellow-200",
    green: "bg-green-500/10 text-green-600 border-green-200",
    purple: "bg-purple-500/10 text-purple-600 border-purple-200",
    red: "bg-red-500/10 text-red-600 border-red-200",
  }[color];

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
            <p className="text-3xl font-bold mt-2">{value}</p>
          </div>
          <div className={`p-3 rounded-full ${colorClasses}`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// AppointmentRequestCard Component
function AppointmentRequestCard({ appointment, onAction }: { 
  appointment: any; 
  onAction: (app: any, action: "accept" | "reject") => void;
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-primary/10 rounded-full">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">{appointment.patient?.fullName}</h3>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(appointment.date), "PPP 'at' p")}
                </p>
              </div>
            </div>
            
            {appointment.symptoms && (
              <div className="mt-3 p-3 bg-muted rounded-md">
                <p className="text-sm font-medium">Symptoms:</p>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {appointment.symptoms}
                </p>
              </div>
            )}
            
            {appointment.healthCondition && (
              <div className="mt-2">
                <Badge variant="outline" className="mt-2">
                  {appointment.healthCondition}
                </Badge>
              </div>
            )}
          </div>
          
          <div className="flex flex-col gap-2">
            <Button 
              onClick={() => onAction(appointment, "accept")}
              className="gap-2"
            >
              <CheckCircle2 className="h-4 w-4" />
              Accept
            </Button>
            <Button 
              variant="destructive"
              onClick={() => onAction(appointment, "reject")}
              className="gap-2"
            >
              <XCircle className="h-4 w-4" />
              Reject
            </Button>
            <Button variant="outline" size="sm">
              <MessageSquare className="h-4 w-4 mr-2" />
              Message
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// UpcomingAppointmentCard Component
function UpcomingAppointmentCard({ appointment, onComplete }: { 
  appointment: any; 
  onComplete: () => void;
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-full">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">{appointment.patient?.fullName}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {format(new Date(appointment.date), "PPP 'at' p")}
                    </span>
                  </div>
                </div>
              </div>
              <Badge className="bg-blue-500/10 text-blue-600 border-blue-200">
                Upcoming
              </Badge>
            </div>
            
            {appointment.symptoms && (
              <div className="mt-3 p-3 bg-muted rounded-md">
                <p className="text-sm font-medium">Symptoms:</p>
                <p className="text-sm text-muted-foreground">
                  {appointment.symptoms}
                </p>
              </div>
            )}
          </div>
          
          <div className="flex flex-col gap-2">
            <Button className="gap-2">
              <MessageSquare className="h-4 w-4" />
              Start Consultation
            </Button>
            <Button 
              onClick={onComplete}
              variant="outline"
              className="gap-2"
            >
              <CheckCircle2 className="h-4 w-4" />
              Mark Complete
            </Button>
            <Button variant="outline" size="sm">
              Reschedule
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// CompletedAppointmentCard Component
function CompletedAppointmentCard({ appointment }: { appointment: any }) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/10 rounded-full">
              <User className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold">{appointment.patient?.fullName}</h3>
              <p className="text-sm text-muted-foreground">
                {format(new Date(appointment.date), "PPP")}
              </p>
            </div>
          </div>
          <Badge className="bg-green-500/10 text-green-600 border-green-200">
            Completed
          </Badge>
        </div>
        
        {appointment.symptoms && (
          <div className="mt-3">
            <p className="text-sm font-medium">Symptoms:</p>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {appointment.symptoms}
            </p>
          </div>
        )}
        
        {appointment.doctorNotes && (
          <div className="mt-3 p-3 bg-blue-50 rounded-md">
            <p className="text-sm font-medium text-blue-800">Your Notes:</p>
            <p className="text-sm text-blue-700">
              {appointment.doctorNotes}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// AppointmentCard Component (for All Appointments tab)
function AppointmentCard({ appointment }: { appointment: any }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/10 text-yellow-600 border-yellow-200";
      case "accepted":
        return "bg-blue-500/10 text-blue-600 border-blue-200";
      case "completed":
        return "bg-green-500/10 text-green-600 border-green-200";
      case "rejected":
        return "bg-red-500/10 text-red-600 border-red-200";
      case "cancelled":
        return "bg-gray-500/10 text-gray-600 border-gray-200";
      default:
        return "bg-gray-500/10 text-gray-600 border-gray-200";
    }
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-semibold">{appointment.patient?.fullName}</h4>
              <Badge className={`${getStatusColor(appointment.status)}`}>
                {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {format(new Date(appointment.date), "PPP 'at' p")}
            </p>
            {appointment.symptoms && (
              <p className="text-sm text-muted-foreground mt-2 line-clamp-1">
                {appointment.symptoms}
              </p>
            )}
          </div>
          <Button variant="outline" size="sm">
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}