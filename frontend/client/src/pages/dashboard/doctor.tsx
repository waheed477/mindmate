import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
// FIXED: Added getToken helper function
const getToken = (): string | null => {
  return localStorage.getItem('token');
};
import { useDoctorAppointments, useUpdateAppointment } from "@/hooks/use-appointments";
import { useDoctorPrescriptions, useCreatePrescription, Medicine } from "@/hooks/use-prescriptions";
import { Navbar } from "@/components/layout-navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Calendar,
  Clock,
  User,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Bell,
  Users,
  Send,
  ClipboardList,
  Plus,
  Trash2,
  FileText,
  Pill,
  Settings,
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

const EMPTY_MEDICINE: Medicine = { name: "", dosage: "", duration: "", instructions: "" };

export default function DoctorDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const doctorProfileId: string =
    (user as any)?.doctorProfileId ||
    (user as any)?.doctor?._id ||
    (user as any)?.id ||
    "";

  const { data: appointments = [], isLoading } = useDoctorAppointments(doctorProfileId);
  const { mutate: updateAppointment, isPending: isUpdating } = useUpdateAppointment();
  const { data: prescriptions = [], isLoading: prescriptionsLoading } = useDoctorPrescriptions();
  const { mutate: createPrescription, isPending: isCreatingPrescription } = useCreatePrescription();

  // Patient interactions — all patients who have appointments or messages with this doctor
  const { data: patientInteractions = [], isLoading: patientsLoading } = useQuery({
    queryKey: ["doctor-patients"],
    queryFn: async () => {
      const token = getToken() ?? "";
      const res = await fetch("/api/messages/doctor/patients", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch patient interactions");
      const data = await res.json();
      return data.patients as Array<{
        patientUserId: string;
        patientProfileId: string | null;
        fullName: string;
        email: string;
        age: number | null;
        gender: string | null;
        profilePicture: string;
        unreadCount: number;
        lastInteractionAt: string;
        appointmentStatuses: string[];
        hasActiveChat: boolean;
      }>;
    },
    staleTime: 60_000,
  });

  // Appointment action dialog
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [action, setAction] = useState<"accept" | "reject" | "complete" | null>(null);
  const [doctorNotes, setDoctorNotes] = useState("");

  // Prescription dialog
  const [prescriptionAppointment, setPrescriptionAppointment] = useState<any>(null);
  const [medicines, setMedicines] = useState<Medicine[]>([{ ...EMPTY_MEDICINE }]);
  const [prescriptionNotes, setPrescriptionNotes] = useState("");

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

  const openPrescriptionDialog = (app: any) => {
    setPrescriptionAppointment(app);
    setMedicines([{ ...EMPTY_MEDICINE }]);
    setPrescriptionNotes("");
  };

  const closePrescriptionDialog = () => {
    setPrescriptionAppointment(null);
    setMedicines([{ ...EMPTY_MEDICINE }]);
    setPrescriptionNotes("");
  };

  const handleConfirmAction = () => {
    if (!selectedAppointment || !action) return;
    const statusMap = { accept: "accepted", reject: "rejected", complete: "completed" } as const;
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

  const addMedicine = () => setMedicines((prev) => [...prev, { ...EMPTY_MEDICINE }]);

  const removeMedicine = (index: number) =>
    setMedicines((prev) => prev.filter((_, i) => i !== index));

  const updateMedicine = (index: number, field: keyof Medicine, value: string) =>
    setMedicines((prev) =>
      prev.map((med, i) => (i === index ? { ...med, [field]: value } : med))
    );

  const handleCreatePrescription = () => {
    if (!prescriptionAppointment) return;

    const patientUserId =
      prescriptionAppointment.patient?.userId?._id ||
      prescriptionAppointment.patient?.userId ||
      "";

    if (!patientUserId) {
      alert("Cannot determine patient ID. Please try again.");
      return;
    }

    const validMedicines = medicines.filter(
      (m) => m.name.trim() && m.dosage.trim() && m.duration.trim()
    );
    if (validMedicines.length === 0) {
      alert("Please add at least one complete medicine entry (name, dosage, duration).");
      return;
    }

    createPrescription(
      {
        patientId: String(patientUserId),
        patientName: prescriptionAppointment.patient?.fullName || "",
        medicines: validMedicines,
        notes: prescriptionNotes.trim(),
        appointmentId: prescriptionAppointment._id,
      },
      {
        onSuccess: () => {
          alert("Prescription created successfully!");
          closePrescriptionDialog();
        },
        onError: (err) => alert(`Failed to create prescription: ${err.message}`),
      }
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex items-center justify-center">
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
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
          <Button variant="outline" onClick={() => navigate("/edit-profile")} className="gap-2 w-full md:w-auto">
            <Settings className="h-4 w-4" />
            Edit Profile
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard icon={<Bell className="h-5 w-5" />} label="Pending Requests" value={pendingAppointments.length} color="yellow" />
          <StatCard icon={<Calendar className="h-5 w-5" />} label="Upcoming" value={upcomingAppointments.length} color="blue" />
          <StatCard icon={<CheckCircle2 className="h-5 w-5" />} label="Completed" value={completedAppointments.length} color="green" />
          <StatCard icon={<Users className="h-5 w-5" />} label="Total Patients" value={patientInteractions.length} color="purple" />
        </div>

        <Tabs defaultValue="patients" className="w-full">
          <TabsList className="grid w-full grid-cols-5 lg:w-[750px]">
            <TabsTrigger value="patients">
              Patients {patientInteractions.length > 0 && `(${patientInteractions.length})`}
            </TabsTrigger>
            <TabsTrigger value="requests">Requests ({pendingAppointments.length})</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming ({upcomingAppointments.length})</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="prescriptions">Rx</TabsTrigger>
          </TabsList>

          {/* Patient Interactions */}
          <TabsContent value="patients" className="space-y-4 mt-6">
            {patientsLoading ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
                  <p className="mt-4 text-muted-foreground">Loading patient interactions...</p>
                </CardContent>
              </Card>
            ) : patientInteractions.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="font-medium text-muted-foreground">No patient interactions yet</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Patients who book appointments or send you messages will appear here
                  </p>
                </CardContent>
              </Card>
            ) : (
              <>
                <p className="text-sm text-muted-foreground">
                  {patientInteractions.length} patient{patientInteractions.length !== 1 ? "s" : ""} have interacted with you
                </p>
                <div className="space-y-3">
                  {patientInteractions.map((patient) => {
                    const hasPending = patient.appointmentStatuses.includes("pending");
                    const hasAccepted = patient.appointmentStatuses.includes("accepted");
                    const getStatusLabel = () => {
                      if (hasPending) return { label: "Pending appointment", color: "bg-yellow-100 text-yellow-800 border-yellow-200" };
                      if (hasAccepted) return { label: "Active appointment", color: "bg-green-100 text-green-800 border-green-200" };
                      if (patient.hasActiveChat) return { label: "Active chat", color: "bg-blue-100 text-blue-800 border-blue-200" };
                      return { label: "Past interaction", color: "bg-gray-100 text-gray-700 border-gray-200" };
                    };
                    const status = getStatusLabel();
                    const initials = patient.fullName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);
                    return (
                      <Card key={patient.patientUserId} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-5">
                          <div className="flex items-center gap-4">
                            <div className="relative shrink-0">
                              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center font-semibold text-primary">
                                {initials}
                              </div>
                              {patient.unreadCount > 0 && (
                                <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold">
                                  {patient.unreadCount}
                                </span>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="font-semibold text-base truncate">{patient.fullName}</h3>
                                <Badge className={`text-xs ${status.color}`}>{status.label}</Badge>
                                {patient.unreadCount > 0 && (
                                  <Badge className="bg-red-100 text-red-700 border-red-200 text-xs">
                                    {patient.unreadCount} unread
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground flex-wrap">
                                {patient.age && <span>Age: {patient.age}</span>}
                                {patient.gender && <span>{patient.gender}</span>}
                                {patient.email && <span className="truncate">{patient.email}</span>}
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">
                                Last interaction: {new Date(patient.lastInteractionAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                              </p>
                            </div>
                            <div className="flex flex-col gap-2 shrink-0">
                              <Button
                                size="sm"
                                className="gap-2 whitespace-nowrap"
                                onClick={() => navigate(`/chat/${patient.patientUserId}`)}
                                data-testid={`button-chat-patient-${patient.patientUserId}`}
                              >
                                <Send className="h-3.5 w-3.5" />
                                View Chat
                              </Button>
                              {patient.appointmentStatuses.length > 0 && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="gap-2 whitespace-nowrap"
                                  onClick={() => {
                                    const pending = appointments.find((a: any) => {
                                      const uid = a.patient?.userId;
                                      const uid2 = typeof uid === "object" ? uid?._id : uid;
                                      return String(uid2) === patient.patientUserId;
                                    });
                                    if (pending) openActionDialog(pending, pending.status === "pending" ? "accept" : "complete");
                                  }}
                                  data-testid={`button-appts-patient-${patient.patientUserId}`}
                                >
                                  <Calendar className="h-3.5 w-3.5" />
                                  Appointments ({patient.appointmentStatuses.length})
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </>
            )}
          </TabsContent>

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
                  onMessage={() => {
                    const uid = appointment.patient?.userId;
                    const receiverId = typeof uid === "object" ? uid?._id : String(uid ?? "");
                    if (receiverId) navigate(`/chat/${receiverId}`);
                  }}
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
                  onMessage={() => {
                    const uid = appointment.patient?.userId;
                    const receiverId = typeof uid === "object" ? uid?._id : String(uid ?? "");
                    if (receiverId) navigate(`/chat/${receiverId}`);
                  }}
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
                <CompletedCard
                  key={appointment._id}
                  appointment={appointment}
                  onCreatePrescription={() => openPrescriptionDialog(appointment)}
                />
              ))
            )}
          </TabsContent>

          {/* Prescriptions */}
          <TabsContent value="prescriptions" className="space-y-4 mt-6">
            {prescriptionsLoading ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
                </CardContent>
              </Card>
            ) : prescriptions.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <ClipboardList className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground">No prescriptions created yet</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Create prescriptions from completed appointment cards
                  </p>
                </CardContent>
              </Card>
            ) : (
              prescriptions.map((rx: any) => (
                <PrescriptionCard key={rx._id} prescription={rx} role="doctor" />
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Appointment Action Dialog */}
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
              {selectedAppointment?.date ? format(parseISO(selectedAppointment.date), "PPP 'at' p") : ""}
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
            <Button variant="outline" onClick={closeDialog} disabled={isUpdating}>Cancel</Button>
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

      {/* Create Prescription Dialog */}
      <Dialog open={!!prescriptionAppointment} onOpenChange={(open) => !open && closePrescriptionDialog()}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-primary" />
              Create Prescription
            </DialogTitle>
            <DialogDescription>
              Patient: <span className="font-medium text-foreground">{prescriptionAppointment?.patient?.fullName}</span>
              {prescriptionAppointment?.date && (
                <> — Appointment on {format(parseISO(prescriptionAppointment.date), "PPP")}</>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-2">
            {/* Medicines */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-base font-semibold flex items-center gap-2">
                  <Pill className="h-4 w-4 text-primary" />
                  Medicines
                </Label>
                <Button type="button" variant="outline" size="sm" onClick={addMedicine} className="gap-1">
                  <Plus className="h-3.5 w-3.5" />
                  Add Medicine
                </Button>
              </div>

              {medicines.map((med, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-3 bg-muted/30">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">Medicine #{index + 1}</span>
                    {medicines.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeMedicine(index)}
                        className="h-7 w-7 p-0 text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs">Medicine Name *</Label>
                      <Input
                        placeholder="e.g. Sertraline"
                        value={med.name}
                        onChange={(e) => updateMedicine(index, "name", e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Dosage *</Label>
                      <Input
                        placeholder="e.g. 50mg once daily"
                        value={med.dosage}
                        onChange={(e) => updateMedicine(index, "dosage", e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Duration *</Label>
                      <Input
                        placeholder="e.g. 4 weeks"
                        value={med.duration}
                        onChange={(e) => updateMedicine(index, "duration", e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Instructions</Label>
                      <Input
                        placeholder="e.g. Take after meals"
                        value={med.instructions}
                        onChange={(e) => updateMedicine(index, "instructions", e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Separator />

            {/* Notes */}
            <div className="space-y-1">
              <Label className="text-base font-semibold flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                Additional Notes (Optional)
              </Label>
              <Textarea
                className="min-h-[80px] mt-1"
                placeholder="Dietary advice, follow-up instructions, warnings..."
                value={prescriptionNotes}
                onChange={(e) => setPrescriptionNotes(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={closePrescriptionDialog} disabled={isCreatingPrescription}>
              Cancel
            </Button>
            <Button
              onClick={handleCreatePrescription}
              disabled={isCreatingPrescription}
              className="gap-2"
            >
              <ClipboardList className="h-4 w-4" />
              {isCreatingPrescription ? "Creating..." : "Create Prescription"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: number; color: string }) {
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

function RequestCard({ appointment, onAccept, onReject, onMessage }: {
  appointment: any; onAccept: () => void; onReject: () => void; onMessage?: () => void;
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
                <h3 className="font-semibold text-lg">{appointment.patient?.fullName || "Patient"}</h3>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                  <span className="flex items-center gap-1"><Calendar className="h-4 w-4" />{format(parseISO(appointment.date), "PPP")}</span>
                  <span className="flex items-center gap-1"><Clock className="h-4 w-4" />{format(parseISO(appointment.date), "p")}</span>
                </div>
              </div>
            </div>
            {appointment.patient && (
              <div className="flex gap-4 text-sm text-muted-foreground mb-3">
                {appointment.patient.age && <span>Age: {appointment.patient.age}</span>}
                {appointment.patient.gender && <span>Gender: {appointment.patient.gender}</span>}
                {appointment.patient.contactNumber && <span>Contact: {appointment.patient.contactNumber}</span>}
              </div>
            )}
            {appointment.symptoms && (
              <div className="p-3 bg-muted rounded-md">
                <p className="text-sm font-medium">Reason:</p>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-3">{appointment.symptoms}</p>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-2 shrink-0">
            <Button onClick={onAccept} className="gap-2"><CheckCircle2 className="h-4 w-4" />Accept</Button>
            <Button variant="destructive" onClick={onReject} className="gap-2"><XCircle className="h-4 w-4" />Reject</Button>
            {onMessage && (
              <Button variant="outline" onClick={onMessage} className="gap-2"><Send className="h-4 w-4" />Message</Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function UpcomingCard({ appointment, onComplete, onMessage }: {
  appointment: any; onComplete: () => void; onMessage?: () => void;
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
                <h3 className="font-semibold text-lg">{appointment.patient?.fullName || "Patient"}</h3>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                  <span className="flex items-center gap-1"><Calendar className="h-4 w-4" />{format(parseISO(appointment.date), "PPP")}</span>
                  <span className="flex items-center gap-1"><Clock className="h-4 w-4" />{format(parseISO(appointment.date), "p")}</span>
                </div>
              </div>
            </div>
            {appointment.symptoms && (
              <div className="p-3 bg-muted rounded-md">
                <p className="text-sm font-medium">Reason:</p>
                <p className="text-sm text-muted-foreground mt-1">{appointment.symptoms}</p>
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
            {onMessage && (
              <Button onClick={onMessage} className="gap-2"><Send className="h-4 w-4" />Message Patient</Button>
            )}
            <Button variant="outline" onClick={onComplete} className="gap-2">
              <CheckCircle2 className="h-4 w-4" />Mark Complete
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function CompletedCard({ appointment, onCreatePrescription }: {
  appointment: any; onCreatePrescription: () => void;
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-start gap-4">
          <div className="flex items-center gap-3 flex-1">
            <div className="p-2 bg-green-500/10 rounded-full">
              <User className="h-5 w-5 text-green-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">{appointment.patient?.fullName || "Patient"}</h3>
              <p className="text-sm text-muted-foreground">
                {format(parseISO(appointment.date), "PPP 'at' p")}
              </p>
              {appointment.symptoms && (
                <div className="mt-3 p-3 bg-muted rounded-md">
                  <p className="text-sm font-medium">Reason:</p>
                  <p className="text-sm text-muted-foreground line-clamp-2">{appointment.symptoms}</p>
                </div>
              )}
              {appointment.doctorNotes && (
                <div className="mt-2 p-3 bg-blue-50 rounded-md">
                  <p className="text-sm font-medium text-blue-800">Your Notes:</p>
                  <p className="text-sm text-blue-700">{appointment.doctorNotes}</p>
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-2 shrink-0">
            <Badge className="bg-green-500/10 text-green-600 border-green-200">Completed</Badge>
            <Button
              size="sm"
              variant="outline"
              onClick={onCreatePrescription}
              className="gap-2 mt-1 border-primary/40 text-primary hover:bg-primary/5"
            >
              <ClipboardList className="h-3.5 w-3.5" />
              Create Prescription
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function PrescriptionCard({ prescription, role }: { prescription: any; role: "doctor" | "patient" }) {
  const displayName =
    role === "doctor"
      ? prescription.patientName || (prescription.patientId as any)?.fullName || "Patient"
      : prescription.doctorName || (prescription.doctorId as any)?.fullName || "Doctor";

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-primary/10 rounded-full">
                <ClipboardList className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">
                  {role === "doctor" ? `Patient: ${displayName}` : `Dr. ${displayName}`}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(prescription.createdAt), "PPP")}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              {prescription.medicines.map((med: any, i: number) => (
                <div key={i} className="flex flex-wrap gap-2 p-3 bg-muted/50 rounded-lg border">
                  <div className="flex items-center gap-1.5">
                    <Pill className="h-3.5 w-3.5 text-primary" />
                    <span className="font-medium text-sm">{med.name}</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">{med.dosage}</Badge>
                  <Badge variant="secondary" className="text-xs bg-blue-50 text-blue-700 border-blue-200">{med.duration}</Badge>
                  {med.instructions && (
                    <span className="text-xs text-muted-foreground italic">— {med.instructions}</span>
                  )}
                </div>
              ))}
            </div>

            {prescription.notes && (
              <div className="mt-3 p-3 bg-amber-50 rounded-md border border-amber-100">
                <p className="text-sm font-medium text-amber-800">Notes:</p>
                <p className="text-sm text-amber-700 mt-0.5">{prescription.notes}</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}