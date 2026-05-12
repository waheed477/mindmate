import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { useDoctorAppointments, useUpdateAppointment } from "@/hooks/use-appointments";
import { Navbar } from "@/components/layout-navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
  ExternalLink,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

export default function DoctorDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Use the doctor profile ID from auth; fall back to user id
  const doctorProfileId: string =
    (user as any)?.doctorProfileId ||
    (user as any)?.doctor?._id ||
    (user as any)?.id ||
    "";

  const { data: appointments = [], isLoading } = useDoctorAppointments(doctorProfileId);
  const { mutate: updateAppointment, isPending: isUpdating } = useUpdateAppointment();

  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [action, setAction] = useState<"accept" | "reject" | "complete" | null>(null);
  const [doctorNotes, setDoctorNotes] = useState("");

  const pendingAppointments = appointments.filter((a: any) => a.status === "pending");
  const upcomingAppointments = appointments.filter((a: any) => a.status === "accepted");
  const completedAppointments = appointments.filter((a: any) => a.status === "completed");

  const openActionDialog = (app: any, actionType: "accept" | "reject" | "complete") => {
    setSelectedAppointment(app);
    setAction(actionType);
    setDoctorNotes("");
  };

  const closeDialog = () => {
    setSelectedAppointment(null);
    setAction(null);
    setDoctorNotes("");
  };

  const handleConfirmAction = () => {
    if (!selectedAppointment || !action) return;

    const statusMap = {
      accept: "accepted",
      reject: "rejected",
      complete: "completed",
    } as const;

    updateAppointment(
      {
        id: selectedAppointment._id,
        status: statusMap[action],
        ...(doctorNotes.trim() && { doctorNotes: doctorNotes.trim() }),
      },
      {
        onSuccess: () => closeDialog(),
        onError: (err) => alert(`Failed: ${err.message}`),
      }
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-8 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
            <p className="mt-4 text-muted-foreground">Loading appointments...</p>
          </div>
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
            <h1 className="text-3xl font-bold tracking-tight">
              Dr. {(user as any)?.doctor?.fullName || user?.fullName}
            </h1>
            {(user as any)?.doctor?.verificationStatus === "verified" && (
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
            value={new Set(appointments.map((a: any) => String(a.patientId))).size}
            color="purple"
          />
        </div>

        <Tabs defaultValue="requests" className="w-full">
          <TabsList className="grid w-full grid-cols-3 lg:w-[420px]">
            <TabsTrigger value="requests">
              Requests ({pendingAppointments.length})
            </TabsTrigger>
            <TabsTrigger value="upcoming">
              Upcoming ({upcomingAppointments.length})
            </TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          {/* Pending Requests */}
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
                <RequestCard
                  key={appointment._id}
                  appointment={appointment}
                  onAccept={() => openActionDialog(appointment, "accept")}
                  onReject={() => openActionDialog(appointment, "reject")}
                />
              ))
            )}
          </TabsContent>

          {/* Upcoming Appointments */}
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
                <UpcomingCard
                  key={appointment._id}
                  appointment={appointment}
                  onComplete={() => openActionDialog(appointment, "complete")}
                />
              ))
            )}
          </TabsContent>

          {/* Completed */}
          <TabsContent value="completed" className="space-y-4 mt-6">
            {completedAppointments.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <CheckCircle2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground">No completed appointments yet</p>
                </CardContent>
              </Card>
            ) : (
              completedAppointments.map((appointment: any) => (
                <CompletedCard key={appointment._id} appointment={appointment} />
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Action Dialog */}
      <Dialog open={!!selectedAppointment} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {action === "accept" && "Accept Appointment"}
              {action === "reject" && "Reject Appointment"}
              {action === "complete" && "Complete Appointment"}
            </DialogTitle>
            <DialogDescription>
              Patient: {selectedAppointment?.patient?.fullName} —{" "}
              {selectedAppointment?.date
                ? format(parseISO(selectedAppointment.date), "PPP 'at' p")
                : ""}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {selectedAppointment?.symptoms && (
              <div>
                <p className="text-sm font-medium mb-1">Patient's Reason:</p>
                <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                  {selectedAppointment.symptoms}
                </p>
              </div>
            )}

            <div>
              <Label htmlFor="doctor-notes">
                Doctor's Notes {action === "reject" ? "(Required)" : "(Optional)"}
              </Label>
              <Textarea
                id="doctor-notes"
                className="mt-2 min-h-[100px]"
                placeholder={
                  action === "accept"
                    ? "Instructions or notes for the patient..."
                    : action === "reject"
                    ? "Please provide a reason for rejection..."
                    : "Consultation summary and recommendations..."
                }
                value={doctorNotes}
                onChange={(e) => setDoctorNotes(e.target.value)}
              />
            </div>

            {action === "accept" && (
              <div className="p-3 bg-blue-50 rounded-md text-sm text-blue-700 flex gap-2">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                The patient will be notified that their appointment has been accepted.
              </div>
            )}
            {action === "reject" && (
              <div className="p-3 bg-yellow-50 rounded-md text-sm text-yellow-700 flex gap-2">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                Please provide a reason so the patient can follow up appropriately.
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={closeDialog} disabled={isUpdating}>
              Cancel
            </Button>
            <Button
              onClick={handleConfirmAction}
              disabled={isUpdating || (action === "reject" && !doctorNotes.trim())}
              variant={action === "reject" ? "destructive" : "default"}
            >
              {isUpdating
                ? "Saving..."
                : action === "accept"
                ? "Accept Appointment"
                : action === "reject"
                ? "Reject Appointment"
                : "Mark as Complete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
}) {
  const colorClasses: Record<string, string> = {
    blue: "bg-blue-500/10 text-blue-600",
    yellow: "bg-yellow-500/10 text-yellow-600",
    green: "bg-green-500/10 text-green-600",
    purple: "bg-purple-500/10 text-purple-600",
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
            <p className="text-3xl font-bold mt-2">{value}</p>
          </div>
          <div className={`p-3 rounded-full ${colorClasses[color]}`}>{icon}</div>
        </div>
      </CardContent>
    </Card>
  );
}

function RequestCard({
  appointment,
  onAccept,
  onReject,
}: {
  appointment: any;
  onAccept: () => void;
  onReject: () => void;
}) {
  return (
    <Card className="border-l-4 border-l-yellow-400">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-primary/10 rounded-full">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">
                  {appointment.patient?.fullName || "Patient"}
                </h3>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {format(parseISO(appointment.date), "PPP")}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {format(parseISO(appointment.date), "p")}
                  </span>
                </div>
              </div>
            </div>

            {appointment.patient && (
              <div className="flex gap-4 text-sm text-muted-foreground mb-3">
                {appointment.patient.age && (
                  <span>Age: {appointment.patient.age}</span>
                )}
                {appointment.patient.gender && (
                  <span>Gender: {appointment.patient.gender}</span>
                )}
                {appointment.patient.contactNumber && (
                  <span>Contact: {appointment.patient.contactNumber}</span>
                )}
              </div>
            )}

            {appointment.symptoms && (
              <div className="p-3 bg-muted rounded-md">
                <p className="text-sm font-medium">Reason:</p>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-3">
                  {appointment.symptoms}
                </p>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2 shrink-0">
            <Button onClick={onAccept} className="gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Accept
            </Button>
            <Button variant="destructive" onClick={onReject} className="gap-2">
              <XCircle className="h-4 w-4" />
              Reject
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function UpcomingCard({
  appointment,
  onComplete,
}: {
  appointment: any;
  onComplete: () => void;
}) {
  return (
    <Card className="border-l-4 border-l-blue-400">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-500/10 rounded-full">
                <User className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">
                  {appointment.patient?.fullName || "Patient"}
                </h3>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {format(parseISO(appointment.date), "PPP")}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {format(parseISO(appointment.date), "p")}
                  </span>
                </div>
              </div>
            </div>

            {appointment.symptoms && (
              <div className="p-3 bg-muted rounded-md">
                <p className="text-sm font-medium">Reason:</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {appointment.symptoms}
                </p>
              </div>
            )}

            {appointment.doctorNotes && (
              <div className="mt-2 p-3 bg-blue-50 rounded-md">
                <p className="text-sm font-medium text-blue-800">Your Notes:</p>
                <p className="text-sm text-blue-700">{appointment.doctorNotes}</p>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2 shrink-0">
            <Button className="gap-2">
              <MessageSquare className="h-4 w-4" />
              Start Consultation
            </Button>
            <Button variant="outline" onClick={onComplete} className="gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Mark Complete
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function CompletedCard({ appointment }: { appointment: any }) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/10 rounded-full">
              <User className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold">
                {appointment.patient?.fullName || "Patient"}
              </h3>
              <p className="text-sm text-muted-foreground">
                {format(parseISO(appointment.date), "PPP 'at' p")}
              </p>
            </div>
          </div>
          <Badge className="bg-green-500/10 text-green-600 border-green-200">Completed</Badge>
        </div>

        {appointment.symptoms && (
          <div className="mt-3 p-3 bg-muted rounded-md">
            <p className="text-sm font-medium">Reason:</p>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {appointment.symptoms}
            </p>
          </div>
        )}

        {appointment.doctorNotes && (
          <div className="mt-2 p-3 bg-blue-50 rounded-md">
            <p className="text-sm font-medium text-blue-800">Your Notes:</p>
            <p className="text-sm text-blue-700">{appointment.doctorNotes}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
