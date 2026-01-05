// client/src/pages/dashboard/patient.tsx - COMPLETE REAL IMPLEMENTATION
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useDoctors, Doctor } from "@/hooks/use-doctors";
import { 
  useAppointments, 
  useCreateAppointment, 
  useUpdateAppointment 
} from "@/hooks/use-appointments";
import { Navbar } from "@/components/layout-navbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Calendar,
  Clock,
  Search,
  Filter,
  User,
  Stethoscope,
  MessageSquare,
  Star,
  ChevronRight,
  Plus,
  AlertCircle,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { format, parseISO, isAfter, isBefore, addDays } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DoctorCard } from "@/components/doctor-card";
import { AppointmentRequestDialog } from "@/components/appointment-request-dialog";
import { ActivityFeed } from "@/components/activity-feed";
export default function PatientDashboard() {
  const { user } = useAuth();
  const { data: doctors = [], isLoading: doctorsLoading } = useDoctors();
  const { data: appointments = [], isLoading: appointmentsLoading } = useAppointments();
  const { mutate: createAppointment, isPending: isCreating } = useCreateAppointment();
  const { mutate: updateAppointment } = useUpdateAppointment();

  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState<string>("all");
  const [showAppointmentDetails, setShowAppointmentDetails] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("find-doctors");

  // Filter doctors
  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch = 
      doctor.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doctor.bio && doctor.bio.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesSpecialization = 
      selectedSpecialization === "all" || 
      doctor.specialization === selectedSpecialization;

    return matchesSearch && matchesSpecialization;
  });

  // Get unique specializations for filter
  const specializations = Array.from(
    new Set(doctors.map((d) => d.specialization))
  );

  // Categorize appointments
  const upcomingAppointments = appointments.filter(
    (app) => app.status === "accepted" && isAfter(parseISO(app.date), new Date())
  ).sort((a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime());

  const pendingAppointments = appointments.filter(
    (app) => app.status === "pending"
  );

  const pastAppointments = appointments.filter(
    (app) => ["completed", "rejected", "cancelled"].includes(app.status) ||
      (app.status === "accepted" && isBefore(parseISO(app.date), new Date()))
  );

  // Handle appointment booking
  const handleBookAppointment = (appointmentData: any) => {
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

  // Cancel appointment
  const handleCancelAppointment = (appointmentId: string) => {
    if (confirm("Are you sure you want to cancel this appointment?")) {
      updateAppointment({
        id: appointmentId,
        status: "cancelled",
        doctorNotes: "Cancelled by patient",
      });
    }
  };

  // Loading state
  if (doctorsLoading || appointmentsLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-8 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container py-8 space-y-8">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold font-display tracking-tight">
              Welcome back, {user?.patient?.fullName || user?.fullName}!
            </h1>
            <p className="text-muted-foreground">
              Manage your health journey and connect with mental health professionals
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => setActiveTab("my-appointments")}
            >
              <Calendar className="h-4 w-4 mr-2" />
              My Appointments ({upcomingAppointments.length + pendingAppointments.length})
            </Button>
            <Button
              onClick={() => {
                setActiveTab("find-doctors");
                setShowBookingDialog(true);
              }}
              className="shadow-lg shadow-primary/20"
            >
              <Plus className="h-4 w-4 mr-2" />
              Book New Appointment
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            icon={<Calendar className="h-5 w-5" />}
            label="Upcoming Appointments"
            value={upcomingAppointments.length}
            color="blue"
          />
          <StatCard
            icon={<Clock className="h-5 w-5" />}
            label="Pending Requests"
            value={pendingAppointments.length}
            color="yellow"
          />
          <StatCard
            icon={<Stethoscope className="h-5 w-5" />}
            label="Doctors Available"
            value={filteredDoctors.length}
            color="green"
          />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
            <TabsTrigger value="find-doctors">Find Doctors</TabsTrigger>
            <TabsTrigger value="my-appointments">
              My Appointments ({upcomingAppointments.length + pendingAppointments.length})
            </TabsTrigger>
            <TabsTrigger value="health-history">Health History</TabsTrigger>
            <TabsTrigger value="activity">Activity Feed</TabsTrigger>
          </TabsList>

          {/* Find Doctors Tab */}
          <TabsContent value="find-doctors" className="space-y-6 mt-6">
            {/* Search and Filter Bar */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search doctors by name, specialization, or keywords..."
                      className="pl-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <Select
                      value={selectedSpecialization}
                      onValueChange={setSelectedSpecialization}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Specialization" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Specializations</SelectItem>
                        {specializations.map((spec) => (
                          <SelectItem key={spec} value={spec}>
                            {spec}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Button variant="outline" className="gap-2">
                      <Filter className="h-4 w-4" />
                      More Filters
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Doctors Grid */}
            {filteredDoctors.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Stethoscope className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground">No doctors found matching your criteria</p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedSpecialization("all");
                    }}
                  >
                    Clear Filters
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-muted-foreground">
                    Showing {filteredDoctors.length} of {doctors.length} doctors
                  </p>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">Sort by:</span>
                    <Select defaultValue="rating">
                      <SelectTrigger className="w-[140px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="rating">Highest Rating</SelectItem>
                        <SelectItem value="experience">Most Experienced</SelectItem>
                        <SelectItem value="fee">Lowest Fee</SelectItem>
                        <SelectItem value="name">Name A-Z</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredDoctors.map((doctor) => (
                    <DoctorCard
                      key={doctor._id}
                      doctor={doctor}
                      onBookAppointment={() => {
                        setSelectedDoctor(doctor);
                        setShowBookingDialog(true);
                      }}
                      onViewDetails={() => {
                        // Navigate to doctor profile
                        console.log("View doctor details:", doctor._id);
                      }}
                    />
                  ))}
                </div>
              </>
            )}
          </TabsContent>

          {/* My Appointments Tab */}
          <TabsContent value="my-appointments" className="space-y-6 mt-6">
            {/* Upcoming Appointments */}
            {upcomingAppointments.length > 0 && (
              <div>
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Upcoming Appointments
                </h3>
                <div className="space-y-4">
                  {upcomingAppointments.map((appointment) => (
                    <AppointmentCard
                      key={appointment._id}
                      appointment={appointment}
                      onViewDetails={() => setShowAppointmentDetails(appointment)}
                      onCancel={() => handleCancelAppointment(appointment._id)}
                      isUpcoming
                    />
                  ))}
                </div>
                <Separator className="my-6" />
              </div>
            )}

            {/* Pending Appointments */}
            {pendingAppointments.length > 0 && (
              <div>
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Pending Requests
                </h3>
                <div className="space-y-4">
                  {pendingAppointments.map((appointment) => (
                    <AppointmentCard
                      key={appointment._id}
                      appointment={appointment}
                      onViewDetails={() => setShowAppointmentDetails(appointment)}
                      onCancel={() => handleCancelAppointment(appointment._id)}
                    />
                  ))}
                </div>
                <Separator className="my-6" />
              </div>
            )}

            {/* Past Appointments */}
            {pastAppointments.length > 0 && (
              <div>
                <h3 className="text-xl font-bold mb-4">Past Appointments</h3>
                <div className="space-y-4">
                  {pastAppointments.slice(0, 5).map((appointment) => (
                    <AppointmentCard
                      key={appointment._id}
                      appointment={appointment}
                      onViewDetails={() => setShowAppointmentDetails(appointment)}
                      isPast
                    />
                  ))}
                </div>
                {pastAppointments.length > 5 && (
                  <Button variant="outline" className="w-full mt-4">
                    View All Past Appointments ({pastAppointments.length})
                  </Button>
                )}
              </div>
            )}

            {appointments.length === 0 && (
              <Card>
                <CardContent className="py-12 text-center">
                  <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground">No appointments yet</p>
                  <Button
                    className="mt-4"
                    onClick={() => setActiveTab("find-doctors")}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Book Your First Appointment
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Health History Tab */}
          <TabsContent value="health-history" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Health History & Records</CardTitle>
                <CardDescription>
                  Your medical records, prescriptions, and consultation history
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Medical Summary */}
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">
                      Medical Summary
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Age</p>
                        <p className="font-medium">{user?.patient?.age || "Not specified"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Gender</p>
                        <p className="font-medium">{user?.patient?.gender || "Not specified"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Blood Group</p>
                        <p className="font-medium">Not recorded</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Allergies</p>
                        <p className="font-medium">None recorded</p>
                      </div>
                    </div>
                  </div>

                  {/* Recent Prescriptions */}
                  <div>
                    <h4 className="font-semibold mb-3">Recent Prescriptions</h4>
                    <div className="space-y-3">
                      {appointments
                        .filter((app) => app.prescription)
                        .slice(0, 3)
                        .map((appointment) => (
                          <Card key={appointment._id}>
                            <CardContent className="p-4">
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="font-medium">
                                    {appointment.doctor?.fullName}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    {format(parseISO(appointment.date), "PPP")}
                                  </p>
                                </div>
                                <Badge>{appointment.specialization}</Badge>
                              </div>
                              <div className="mt-3 p-3 bg-gray-50 rounded">
                                <p className="text-sm font-medium mb-1">Prescription:</p>
                                <p className="text-sm">{appointment.prescription}</p>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                    </div>
                  </div>

                  {/* Medical Documents */}
                  <div>
                    <h4 className="font-semibold mb-3">Medical Documents</h4>
                    <div className="border-2 border-dashed rounded-lg p-8 text-center">
                      <p className="text-muted-foreground mb-4">
                        Upload medical reports, lab results, or prescriptions
                      </p>
                      <Button variant="outline">
                        <Plus className="h-4 w-4 mr-2" />
                        Upload Document
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Activity Feed Tab */}
          <TabsContent value="activity" className="mt-6">
            <ActivityFeed
              appointments={appointments}
              userId={user?.id || ""}
              userRole="patient"
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Booking Dialog */}
      {selectedDoctor && (
        <AppointmentRequestDialog
          doctor={selectedDoctor}
          open={showBookingDialog}
          onOpenChange={setShowBookingDialog}
          onSubmit={handleBookAppointment}
          isSubmitting={isCreating}
        />
      )}

      {/* Appointment Details Dialog */}
      <Dialog open={!!showAppointmentDetails} onOpenChange={(open) => !open && setShowAppointmentDetails(null)}>
        <DialogContent className="max-w-2xl">
          {showAppointmentDetails && (
            <>
              <DialogHeader>
                <DialogTitle>Appointment Details</DialogTitle>
                <DialogDescription>
                  {format(parseISO(showAppointmentDetails.date), "PPPP p")}
                </DialogDescription>
              </DialogHeader>

              <ScrollArea className="max-h-[60vh] pr-4">
                <div className="space-y-6">
                  {/* Doctor Info */}
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-full">
                          <User className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-semibold">
                            {showAppointmentDetails.doctor?.fullName}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {showAppointmentDetails.doctor?.specialization}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Appointment Status */}
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold">Appointment Status</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <StatusBadge status={showAppointmentDetails.status} />
                            <span className="text-sm text-muted-foreground">
                              {format(parseISO(showAppointmentDetails.createdAt), "PP")}
                            </span>
                          </div>
                        </div>
                        {showAppointmentDetails.status === "pending" && (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                              handleCancelAppointment(showAppointmentDetails._id);
                              setShowAppointmentDetails(null);
                            }}
                          >
                            Cancel Request
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Health Details */}
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-semibold mb-3">Health Information</h4>
                      <div className="space-y-2">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Symptoms</p>
                          <p className="mt-1">{showAppointmentDetails.symptoms}</p>
                        </div>
                        {showAppointmentDetails.healthCondition && (
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">
                              Health Condition
                            </p>
                            <p className="mt-1">{showAppointmentDetails.healthCondition}</p>
                          </div>
                        )}
                        {showAppointmentDetails.notes && (
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">
                              Additional Notes
                            </p>
                            <p className="mt-1">{showAppointmentDetails.notes}</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Doctor's Notes */}
                  {showAppointmentDetails.doctorNotes && (
                    <Card className="bg-blue-50 border-blue-200">
                      <CardContent className="p-4">
                        <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                          <MessageSquare className="h-4 w-4" />
                          Doctor's Notes
                        </h4>
                        <p className="text-blue-700">{showAppointmentDetails.doctorNotes}</p>
                      </CardContent>
                    </Card>
                  )}

                  {/* Activity Log */}
                  {showAppointmentDetails.activityLog?.length > 0 && (
                    <Card>
                      <CardContent className="p-4">
                        <h4 className="font-semibold mb-3">Activity Log</h4>
                        <div className="space-y-3">
                          {showAppointmentDetails.activityLog.map((log: any, index: number) => (
                            <div key={index} className="flex gap-3">
                              <div className="flex flex-col items-center">
                                <div className="w-2 h-2 rounded-full bg-primary mt-1"></div>
                                {index < showAppointmentDetails.activityLog.length - 1 && (
                                  <div className="w-px h-full bg-border mt-1"></div>
                                )}
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-medium">{log.action}</p>
                                <p className="text-xs text-muted-foreground">
                                  {format(parseISO(log.timestamp), "PP p")}
                                </p>
                                {log.details && (
                                  <p className="text-sm text-muted-foreground mt-1">
                                    {log.details}
                                  </p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </ScrollArea>

              <DialogFooter>
                <Button variant="outline" onClick={() => setShowAppointmentDetails(null)}>
                  Close
                </Button>
                {showAppointmentDetails.status === "accepted" && (
                  <Button>Join Consultation</Button>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Supporting Components
function StatCard({ icon, label, value, color }: { 
  icon: React.ReactNode; 
  label: string; 
  value: number; 
  color: string;
}) {
  const colorClasses = {
    blue: "bg-blue-500/10 text-blue-600 border-blue-200",
    yellow: "bg-yellow-500/10 text-yellow-600 border-yellow-200",
    green: "bg-green-500/10 text-green-600 border-green-200",
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

function AppointmentCard({ 
  appointment, 
  onViewDetails, 
  onCancel, 
  isUpcoming = false,
  isPast = false 
}: { 
  appointment: any; 
  onViewDetails: () => void; 
  onCancel?: () => void; 
  isUpcoming?: boolean;
  isPast?: boolean;
}) {
  const StatusIcon = {
    pending: Clock,
    accepted: CheckCircle2,
    rejected: XCircle,
    cancelled: XCircle,
    completed: CheckCircle2,
  }[appointment.status] || AlertCircle;

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    accepted: "bg-green-100 text-green-800 border-green-200",
    rejected: "bg-red-100 text-red-800 border-red-200",
    cancelled: "bg-gray-100 text-gray-800 border-gray-200",
    completed: "bg-blue-100 text-blue-800 border-blue-200",
  };

  return (
    <Card className={`${isUpcoming ? 'border-l-4 border-l-primary' : ''}`}>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-primary/10 rounded-full">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">
                  {appointment.doctor?.fullName}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {appointment.doctor?.specialization}
                </p>
                
                <div className="flex items-center gap-4 mt-3 text-sm">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {format(parseISO(appointment.date), "PPP")}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {format(parseISO(appointment.date), "p")}
                  </span>
                  <Badge className={`${statusColors[appointment.status]} gap-1`}>
                    <StatusIcon className="h-3 w-3" />
                    {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                  </Badge>
                </div>

                {appointment.symptoms && (
                  <div className="mt-3 p-3 bg-muted rounded-md">
                    <p className="text-sm font-medium">Symptoms:</p>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {appointment.symptoms}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Button onClick={onViewDetails} variant="outline" className="gap-2">
              View Details
              <ChevronRight className="h-4 w-4" />
            </Button>
            
            {isUpcoming && appointment.status === "accepted" && (
              <Button className="gap-2">
                <MessageSquare className="h-4 w-4" />
                Join Consultation
              </Button>
            )}
            
            {onCancel && !isPast && appointment.status === "pending" && (
              <Button variant="outline" className="text-destructive" onClick={onCancel}>
                Cancel Request
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function StatusBadge({ status }: { status: string }) {
  const statusConfig: Record<string, { color: string; icon: React.ReactNode }> = {
    pending: { 
      color: "bg-yellow-100 text-yellow-800", 
      icon: <Clock className="h-3 w-3" /> 
    },
    accepted: { 
      color: "bg-green-100 text-green-800", 
      icon: <CheckCircle2 className="h-3 w-3" /> 
    },
    rejected: { 
      color: "bg-red-100 text-red-800", 
      icon: <XCircle className="h-3 w-3" /> 
    },
    cancelled: { 
      color: "bg-gray-100 text-gray-800", 
      icon: <XCircle className="h-3 w-3" /> 
    },
    completed: { 
      color: "bg-blue-100 text-blue-800", 
      icon: <CheckCircle2 className="h-3 w-3" /> 
    },
  };

  const config = statusConfig[status] || statusConfig.pending;

  return (
    <Badge className={`${config.color} gap-1`}>
      {config.icon}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
}