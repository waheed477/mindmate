import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Calendar,
  CheckCircle2,
  Clock,
  MessageSquare,
  User,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { format, parseISO } from "date-fns";

interface ActivityFeedProps {
  appointments: any[];
  userId: string;
  userRole: "patient" | "doctor";
}

export function ActivityFeed({ appointments, userId, userRole }: ActivityFeedProps) {
  // Sort appointments by date (newest first)
  const sortedAppointments = [...appointments].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const getActivityIcon = (status: string) => {
    switch (status) {
      case "pending":
        return Clock;
      case "accepted":
        return CheckCircle2;
      case "rejected":
        return XCircle;
      case "cancelled":
        return XCircle;
      case "completed":
        return CheckCircle2;
      default:
        return AlertCircle;
    }
  };

  const getActivityColor = (status: string) => {
    switch (status) {
      case "pending":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "accepted":
        return "text-green-600 bg-green-50 border-green-200";
      case "rejected":
        return "text-red-600 bg-red-50 border-red-200";
      case "cancelled":
        return "text-gray-600 bg-gray-50 border-gray-200";
      case "completed":
        return "text-blue-600 bg-blue-50 border-blue-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getActivityMessage = (appointment: any) => {
    const { status, doctor, patient } = appointment;
    const isPatient = userRole === "patient";
    
    if (status === "pending") {
      return isPatient 
        ? `You requested an appointment with Dr. ${doctor?.fullName}`
        : `${patient?.fullName} requested an appointment`;
    } else if (status === "accepted") {
      return isPatient
        ? `Dr. ${doctor?.fullName} accepted your appointment`
        : `You accepted ${patient?.fullName}'s appointment request`;
    } else if (status === "rejected") {
      return isPatient
        ? `Dr. ${doctor?.fullName} declined your appointment`
        : `You declined ${patient?.fullName}'s appointment request`;
    } else if (status === "cancelled") {
      return isPatient
        ? `You cancelled appointment with Dr. ${doctor?.fullName}`
        : `${patient?.fullName} cancelled the appointment`;
    } else if (status === "completed") {
      return isPatient
        ? `Completed appointment with Dr. ${doctor?.fullName}`
        : `Completed appointment with ${patient?.fullName}`;
    } else {
      return `Appointment status: ${status}`;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), "MMM d, yyyy 'at' h:mm a");
    } catch {
      return "Date unavailable";
    }
  };

  if (sortedAppointments.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
          <p className="text-muted-foreground">No activity yet</p>
          <p className="text-sm text-muted-foreground mt-2">
            Your appointment activities will appear here
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Activity Feed
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {sortedAppointments.map((appointment) => {
              const Icon = getActivityIcon(appointment.status);
              const colorClass = getActivityColor(appointment.status);
              
              return (
                <div
                  key={appointment._id}
                  className="flex gap-3 p-3 rounded-lg border"
                >
                  <div className={`p-2 rounded-full ${colorClass.split(' ')[1]}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  
                  <div className="flex-1">
                    <p className="font-medium">{getActivityMessage(appointment)}</p>
                    
                    {appointment.symptoms && (
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                        Symptoms: {appointment.symptoms}
                      </p>
                    )}
                    
                    {appointment.doctorNotes && (
                      <div className="mt-2 p-2 bg-muted rounded">
                        <p className="text-sm font-medium flex items-center gap-1">
                          <MessageSquare className="h-3 w-3" />
                          Doctor's Note:
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {appointment.doctorNotes}
                        </p>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between mt-2">
                      <Badge variant="outline" className={`${colorClass}`}>
                        {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(appointment.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
