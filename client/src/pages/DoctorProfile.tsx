import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, BadgeCheck, CalendarDays, Clock3, IndianRupee, Loader2, MessageSquare, Stethoscope, User } from "lucide-react";
import { Navbar } from "@/components/layout-navbar";
import { AppointmentRequestDialog } from "@/components/appointment-request-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCreateAppointment } from "@/hooks/use-appointments";
import { Doctor, useDoctor } from "@/hooks/use-doctors";
import { CreateAppointmentData } from "@/types/appointment";

const formatFee = (fee?: number) => {
  if (typeof fee !== "number") return "Not listed";
  return `Rs. ${fee}`;
};

const getQualification = (doctor: Doctor) => {
  if (doctor.qualification && doctor.qualification.trim()) {
    return doctor.qualification;
  }

  if (doctor.education?.length) {
    const formatted = doctor.education
      .map((entry) => [entry.degree, entry.university].filter(Boolean).join(" - "))
      .filter((value) => value.trim().length > 0);

    if (formatted.length) {
      return formatted.join(", ");
    }
  }

  return "Not provided";
};

const getAvailabilityRows = (doctor: Doctor) => {
  if (!doctor.availability?.length) {
    return [];
  }

  return doctor.availability.map((item, index) => {
    const hasSlotList = item.slots && item.slots.length > 0;
    const hasRange = item.startTime && item.endTime;

    let slotText = "Not specified";
    if (hasSlotList) {
      slotText = item.slots!.join(", ");
    } else if (hasRange) {
      slotText = `${item.startTime} - ${item.endTime}`;
    }

    return {
      key: `${item.day}-${index}`,
      day: item.day || "Day not set",
      slotText,
      isAvailable: item.isAvailable !== false,
    };
  });
};

export default function DoctorProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const doctorId = id ?? "";
  const { data: doctor, isLoading, isError } = useDoctor(doctorId);
  const { mutate: createAppointment, isPending: isCreating } = useCreateAppointment();

  const [bookingOpen, setBookingOpen] = useState(false);

  const getDoctorUserId = () => {
    if (!doctor?.userId) return null;
    if (typeof doctor.userId === "string") return doctor.userId;
    return (doctor.userId as any)._id ?? null;
  };

  const qualification = useMemo(() => {
    if (!doctor) return "Not provided";
    return getQualification(doctor);
  }, [doctor]);

  const availabilityRows = useMemo(() => {
    if (!doctor) return [];
    return getAvailabilityRows(doctor);
  }, [doctor]);

  const handleBookAppointment = (payload: CreateAppointmentData) => {
    createAppointment(payload, {
      onSuccess: () => {
        alert("Appointment request sent successfully!");
        setBookingOpen(false);
      },
      onError: (error) => {
        const message = error instanceof Error ? error.message : "Failed to book appointment";
        alert(`Failed to book appointment: ${message}`);
      },
    });
  };

  if (!doctorId) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-10">
          <Card>
            <CardContent className="py-10 text-center space-y-4">
              <p className="text-muted-foreground">Doctor ID is missing.</p>
              <Button asChild>
                <Link to="/doctors">Back to Doctors</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-12 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (isError || !doctor) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-10">
          <Card>
            <CardContent className="py-10 text-center space-y-4">
              <p className="text-muted-foreground">Unable to load doctor profile.</p>
              <Button asChild>
                <Link to="/doctors">Back to Doctors</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-8 space-y-6">
        <Button asChild variant="ghost" className="gap-2 px-0">
          <Link to="/doctors">
            <ArrowLeft className="h-4 w-4" />
            Back to Doctors
          </Link>
        </Button>

        <Card>
          <CardHeader className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-3xl">{doctor.fullName}</CardTitle>
                  {doctor.verificationStatus === "verified" && (
                    <Badge className="bg-green-500/10 text-green-700 border-green-300 gap-1">
                      <BadgeCheck className="h-3 w-3" />
                      Verified
                    </Badge>
                  )}
                </div>
                <CardDescription className="text-base">{doctor.specialization}</CardDescription>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                {getDoctorUserId() && (
                  <Button
                    variant="outline"
                    className="gap-2"
                    onClick={() => navigate(`/chat/${getDoctorUserId()}`)}
                  >
                    <MessageSquare className="h-4 w-4" />
                    Message
                  </Button>
                )}
                <Button className="gap-2" onClick={() => setBookingOpen(true)}>
                  <CalendarDays className="h-4 w-4" />
                  Book Appointment
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <Card>
                <CardContent className="p-4 space-y-1">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Specialization</p>
                  <p className="font-semibold flex items-center gap-2">
                    <Stethoscope className="h-4 w-4 text-primary" />
                    {doctor.specialization || "Not provided"}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 space-y-1">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Qualification</p>
                  <p className="font-semibold flex items-center gap-2">
                    <User className="h-4 w-4 text-primary" />
                    {qualification}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 space-y-1">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Experience</p>
                  <p className="font-semibold flex items-center gap-2">
                    <Clock3 className="h-4 w-4 text-primary" />
                    {doctor.experience ?? 0} years
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 space-y-1">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Consultation Fee</p>
                  <p className="font-semibold flex items-center gap-2">
                    <IndianRupee className="h-4 w-4 text-primary" />
                    {formatFee(doctor.consultationFee)}
                  </p>
                </CardContent>
              </Card>
            </div>

            <Separator />

            <div className="space-y-3">
              <h2 className="text-xl font-semibold">Availability</h2>
              {availabilityRows.length === 0 ? (
                <p className="text-muted-foreground">Availability has not been added yet.</p>
              ) : (
                <div className="grid gap-3 md:grid-cols-2">
                  {availabilityRows.map((item) => (
                    <Card key={item.key}>
                      <CardContent className="p-4 flex items-start justify-between gap-3">
                        <div>
                          <p className="font-medium">{item.day}</p>
                          <p className="text-sm text-muted-foreground">{item.slotText}</p>
                        </div>
                        <Badge variant={item.isAvailable ? "default" : "secondary"}>
                          {item.isAvailable ? "Available" : "Unavailable"}
                        </Badge>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <AppointmentRequestDialog
        doctor={doctor}
        open={bookingOpen}
        onOpenChange={setBookingOpen}
        onSubmit={handleBookAppointment}
        isSubmitting={isCreating}
      />
    </div>
  );
}
