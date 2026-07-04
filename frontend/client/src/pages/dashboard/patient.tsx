import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { useDoctors, Doctor } from "@/hooks/use-doctors";
import { useQueryClient } from "@tanstack/react-query";
// FIXED: Added getToken helper function
const getToken = (): string | null => {
  return localStorage.getItem('token');
};
import { useSocket } from "@/hooks/use-socket";
import {
  useAppointments,
  useCreateAppointment,
  useUpdateAppointment,
} from "@/hooks/use-appointments";
import { useMyPrescriptions } from "@/hooks/use-prescriptions";
import { Navbar } from "@/components/layout-navbar";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Calendar,
  Clock,
  Search,
  Filter,
  User,
  Stethoscope,
  ChevronRight,
  Plus,
  AlertCircle,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Send,
  ClipboardList,
  Pill,
} from "lucide-react";
import { format, parseISO, isAfter, isBefore } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { DoctorCard } from "@/components/doctor-card";
import { AppointmentRequestDialog } from "@/components/appointment-request-dialog";
import { ActivityFeed } from "@/components/activity-feed";
import { CreateAppointmentData } from "@/types/appointment";

export default function PatientDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { on, off } = useSocket(getToken());
  const { data: doctors = [], isLoading: doctorsLoading } = useDoctors();

  useEffect(() => {
    const handler = () => {
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
    };
    const cleanup = on("doctor:registered", handler);
    return () => {
      if (typeof cleanup === "function") cleanup();
      else off("doctor:registered", handler);
    };
  }, [on, off, queryClient]);

  // Refresh appointments in real-time when doctor accepts/rejects/completes
  useEffect(() => {
    const handler = () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    };
    const cleanup = on("appointment_notification", handler);
    return () => {
      if (typeof cleanup === "function") cleanup();
      else off("appointment_notification", handler);
    };
  }, [on, off, queryClient]);

  const { data: appointments = [], isLoading: appointmentsLoading } = useAppointments();
  const { mutate: createAppointment, isPending: isCreating } = useCreateAppointment();
  const { mutate: updateAppointment } = useUpdateAppointment();
  const { data: prescriptions = [], isLoading: prescriptionsLoading } = useMyPrescriptions();

  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState<string>("all");
  const [activeTab, setActiveTab] = useState("find-doctors");

  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch =
      doctor.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doctor.bio && doctor.bio.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesSpecialization =
      selectedSpecialization === "all" || doctor.specialization === selectedSpecialization;
    return matchesSearch && matchesSpecialization;
  });

  const specializations = Array.from(new Set(doctors.map((d) => d.specialization)));

  const upcomingAppointments = appointments
    .filter((app) => app.status === "accepted" && isAfter(parseISO(app.date), new Date()))
    .sort((a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime());

  const pendingAppointments = appointments.filter((app) => app.status === "pending");

  const pastAppointments = appointments.filter(
    (app) =>
      ["completed", "rejected", "cancelled"].includes(app.status) ||
      (app.status === "accepted" && isBefore(parseISO(app.date), new Date()))
  );

  const handleBookAppointment = (appointmentData: CreateAppointmentData) => {
    createAppointment(appointmentData, {
      onSuccess: () => {
        alert("Appointment request sent successfully!");
        setShowBookingDialog(false);
        setSelectedDoctor(null);
      },
      onError: (error) => {
        alert(`Failed to book appointment: ${error.message}`);
      },
    });
  };

  const handleCancelAppointment = (appointmentId: string) => {
    if (confirm("Are you sure you want to cancel this appointment?")) {
      updateAppointment({ id: appointmentId, status: "cancelled" });
    }
  };

  if (doctorsLoading || appointmentsLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
            <p className="mt-4 text-muted-foreground">Loading your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Welcome back, {(user as any)?.patient?.fullName || user?.fullName}!
            </h1>
            <p className="text-muted-foreground">
              Manage your health journey and connect with mental health professionals
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <Button variant="outline" onClick={() => navigate("/edit-profile")}>
              <User className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
            <Button variant="outline" onClick={() => setActiveTab("my-appointments")}>
              <Calendar className="h-4 w-4 mr-2" />
              My Appointments ({upcomingAppointments.length + pendingAppointments.length})
            </Button>
            <Button onClick={() => setActiveTab("find-doctors")} className="shadow-lg shadow-primary/20">
              <Plus className="h-4 w-4 mr-2" />
              Book New Appointment
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard icon={<Calendar className="h-5 w-5" />} label="Upcoming Appointments" value={upcomingAppointments.length} color="blue" />
          <StatCard icon={<Clock className="h-5 w-5" />} label="Pending Requests" value={pendingAppointments.length} color="yellow" />
          <StatCard icon={<Stethoscope className="h-5 w-5" />} label="Doctors Available" value={filteredDoctors.length} color="green" />
          <StatCard icon={<ClipboardList className="h-5 w-5" />} label="Prescriptions" value={prescriptions.length} color="purple" />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 lg:w-[640px]">
            <TabsTrigger value="find-doctors">Find Doctors</TabsTrigger>
            <TabsTrigger value="my-appointments">
              Appointments ({upcomingAppointments.length + pendingAppointments.length})
            </TabsTrigger>
            <TabsTrigger value="prescriptions">
              Prescriptions ({prescriptions.length})
            </TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          {/* Find Doctors Tab */}
          <TabsContent value="find-doctors" className="space-y-6 mt-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search doctors by name or specialization..."
                      className="pl-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Select value={selectedSpecialization} onValueChange={setSelectedSpecialization}>
                      <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Specialization" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Specializations</SelectItem>
                        {specializations.map((spec) => (
                          <SelectItem key={spec} value={spec}>{spec}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button variant="outline" onClick={() => { setSearchQuery(""); setSelectedSpecialization("all"); }}>
                      <Filter className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {filteredDoctors.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Stethoscope className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground">No doctors found</p>
                  <Button variant="outline" className="mt-4" onClick={() => { setSearchQuery(""); setSelectedSpecialization("all"); }}>
                    Clear Filters
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <>
                <p className="text-sm text-muted-foreground">
                  Showing {filteredDoctors.length} of {doctors.length} doctors
                </p>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredDoctors.map((doctor) => {
                    const doctorUserId = typeof doctor.userId === "object"
                      ? (doctor.userId as any)?._id
                      : doctor.userId;
                    return (
                      <DoctorCard
                        key={doctor._id}
                        doctor={doctor}
                        onBookAppointment={() => { setSelectedDoctor(doctor); setShowBookingDialog(true); }}
                        onViewDetails={() => navigate(`/doctors/${doctor._id}`)}
                        onMessage={doctorUserId ? () => navigate(`/chat/${doctorUserId}`) : undefined}
                      />
                    );
                  })}
                </div>
              </>
            )}
          </TabsContent>

          {/* My Appointments Tab */}
          <TabsContent value="my-appointments" className="space-y-6 mt-6">
            {upcomingAppointments.length > 0 && (
              <section>
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Upcoming Appointments
                </h3>
                <div className="space-y-4">
                  {upcomingAppointments.map((appointment) => (
                    <AppointmentCard
                      key={appointment._id}
                      appointment={appointment}
                      onViewDetails={() => {
                        const docId = appointment.doctorId || appointment.doctor?._id;
                        if (docId) navigate(`/doctors/${docId}`);
                      }}
                      onMessage={() => {
                        const uid = appointment.doctor?.userId;
                        const receiverId = typeof uid === "object" ? uid?._id : uid;
                        if (receiverId) navigate(`/chat/${receiverId}`);
                      }}
                      onCancel={() => handleCancelAppointment(appointment._id)}
                      isUpcoming
                    />
                  ))}
                </div>
                <Separator className="my-6" />
              </section>
            )}

            {pendingAppointments.length > 0 && (
              <section>
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Clock className="h-5 w-5 text-yellow-500" />
                  Pending Requests
                </h3>
                <div className="space-y-4">
                  {pendingAppointments.map((appointment) => (
                    <AppointmentCard
                      key={appointment._id}
                      appointment={appointment}
                      onViewDetails={() => {
                        const docId = appointment.doctorId || appointment.doctor?._id;
                        if (docId) navigate(`/doctors/${docId}`);
                      }}
                      onMessage={() => {
                        const uid = appointment.doctor?.userId;
                        const receiverId = typeof uid === "object" ? uid?._id : uid;
                        if (receiverId) navigate(`/chat/${receiverId}`);
                      }}
                      onCancel={() => handleCancelAppointment(appointment._id)}
                    />
                  ))}
                </div>
                <Separator className="my-6" />
              </section>
            )}

            {pastAppointments.length > 0 && (
              <section>
                <h3 className="text-xl font-bold mb-4">Past Appointments</h3>
                <div className="space-y-4">
                  {pastAppointments.slice(0, 5).map((appointment) => (
                    <AppointmentCard
                      key={appointment._id}
                      appointment={appointment}
                      onViewDetails={() => {
                        const docId = appointment.doctorId || appointment.doctor?._id;
                        if (docId) navigate(`/doctors/${docId}`);
                      }}
                      isPast
                    />
                  ))}
                </div>
                {pastAppointments.length > 5 && (
                  <p className="text-sm text-muted-foreground mt-4 text-center">
                    + {pastAppointments.length - 5} more past appointments
                  </p>
                )}
              </section>
            )}

            {appointments.length === 0 && (
              <Card>
                <CardContent className="py-12 text-center">
                  <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground">No appointments yet</p>
                  <Button className="mt-4" onClick={() => setActiveTab("find-doctors")}>
                    <Plus className="h-4 w-4 mr-2" />
                    Book Your First Appointment
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Prescriptions Tab */}
          <TabsContent value="prescriptions" className="space-y-4 mt-6">
            {prescriptionsLoading ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
                  <p className="mt-4 text-muted-foreground">Loading prescriptions...</p>
                </CardContent>
              </Card>
            ) : prescriptions.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <ClipboardList className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="font-medium text-muted-foreground">No prescriptions yet</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Your doctor will add prescriptions after your consultations
                  </p>
                </CardContent>
              </Card>
            ) : (
              <>
                <p className="text-sm text-muted-foreground">
                  {prescriptions.length} prescription{prescriptions.length !== 1 ? "s" : ""} from your doctors
                </p>
                {prescriptions.map((rx: any) => (
                  <PatientPrescriptionCard key={rx._id} prescription={rx} />
                ))}
              </>
            )}
          </TabsContent>

          {/* Activity Feed Tab */}
          <TabsContent value="activity" className="mt-6">
            <ActivityFeed appointments={appointments} userId={user?.id || ""} userRole="patient" />
          </TabsContent>
        </Tabs>
      </div>

      {selectedDoctor && (
        <AppointmentRequestDialog
          doctor={selectedDoctor}
          open={showBookingDialog}
          onOpenChange={(open) => {
            setShowBookingDialog(open);
            if (!open) setSelectedDoctor(null);
          }}
          onSubmit={handleBookAppointment}
          isSubmitting={isCreating}
        />
      )}
    </div>
  );
}

function StatCard({ icon, label, value, color }: {
  icon: React.ReactNode; label: string; value: number; color: string;
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

function AppointmentCard({
  appointment, onViewDetails, onCancel, onMessage, isUpcoming = false, isPast = false,
}: {
  appointment: any; onViewDetails: () => void; onCancel?: () => void;
  onMessage?: () => void; isUpcoming?: boolean; isPast?: boolean;
}) {
  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    accepted: "bg-green-100 text-green-800 border-green-200",
    rejected: "bg-red-100 text-red-800 border-red-200",
    cancelled: "bg-gray-100 text-gray-800 border-gray-200",
    completed: "bg-blue-100 text-blue-800 border-blue-200",
  };
  const StatusIcon = {
    pending: Clock, accepted: CheckCircle2, rejected: XCircle,
    cancelled: XCircle, completed: CheckCircle2,
  }[appointment.status as string] || AlertCircle;

  const canCancel = !isPast && onCancel && ["pending", "accepted"].includes(appointment.status);

  return (
    <Card className={isUpcoming ? "border-l-4 border-l-primary" : ""}>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-primary/10 rounded-full shrink-0">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg">
                  Dr. {appointment.doctor?.fullName || "Unknown Doctor"}
                </h3>
                <p className="text-sm text-muted-foreground">{appointment.doctor?.specialization || ""}</p>
                <div className="flex flex-wrap items-center gap-3 mt-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1"><Calendar className="h-4 w-4" />{format(parseISO(appointment.date), "PPP")}</span>
                  <span className="flex items-center gap-1"><Clock className="h-4 w-4" />{format(parseISO(appointment.date), "p")}</span>
                  <Badge className={statusColors[appointment.status] + " gap-1"}>
                    <StatusIcon className="h-3 w-3" />
                    {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                  </Badge>
                </div>
                {appointment.symptoms && (
                  <div className="mt-3 p-3 bg-muted rounded-md">
                    <p className="text-sm font-medium">Reason:</p>
                    <p className="text-sm text-muted-foreground line-clamp-2">{appointment.symptoms}</p>
                  </div>
                )}
                {appointment.doctorNotes && (
                  <div className="mt-2 p-3 bg-blue-50 rounded-md">
                    <p className="text-sm font-medium text-blue-800">Doctor's Notes:</p>
                    <p className="text-sm text-blue-700">{appointment.doctorNotes}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2 shrink-0">
            <Button onClick={onViewDetails} variant="outline" className="gap-2 whitespace-nowrap">
              <ExternalLink className="h-4 w-4" />View Doctor
            </Button>
            {onMessage && (
              <Button onClick={onMessage} variant="outline" className="gap-2 whitespace-nowrap">
                <Send className="h-4 w-4" />Message
              </Button>
            )}
            {canCancel && (
              <Button variant="outline" className="text-destructive border-destructive/30 hover:bg-destructive/5" onClick={onCancel}>
                Cancel
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function PatientPrescriptionCard({ prescription }: { prescription: any }) {
  const doctorName =
    prescription.doctorName ||
    (prescription.doctorId as any)?.fullName ||
    "Your Doctor";

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start gap-3 mb-4">
          <div className="p-2 bg-primary/10 rounded-full shrink-0">
            <ClipboardList className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Dr. {doctorName}</h3>
            <p className="text-sm text-muted-foreground">
              {format(new Date(prescription.createdAt), "PPP")}
            </p>
          </div>
          <Badge className="ml-auto bg-primary/10 text-primary border-primary/20">
            {prescription.medicines.length} medicine{prescription.medicines.length !== 1 ? "s" : ""}
          </Badge>
        </div>

        <div className="space-y-2">
          {prescription.medicines.map((med: any, i: number) => (
            <div key={i} className="p-3 border rounded-lg bg-muted/30">
              <div className="flex items-center gap-2 flex-wrap">
                <Pill className="h-4 w-4 text-primary shrink-0" />
                <span className="font-semibold text-sm">{med.name}</span>
                <Badge variant="secondary" className="text-xs">{med.dosage}</Badge>
                <Badge className="text-xs bg-blue-50 text-blue-700 border-blue-200">{med.duration}</Badge>
              </div>
              {med.instructions && (
                <p className="text-xs text-muted-foreground mt-1.5 ml-6">{med.instructions}</p>
              )}
            </div>
          ))}
        </div>

        {prescription.notes && (
          <div className="mt-3 p-3 bg-amber-50 rounded-md border border-amber-100">
            <p className="text-sm font-medium text-amber-800">Doctor's Notes:</p>
            <p className="text-sm text-amber-700 mt-0.5">{prescription.notes}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}