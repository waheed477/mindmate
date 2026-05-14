import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Star,
  Clock,
  MessageSquare,
  Award,
  ChevronRight,
  IndianRupee,
  Send,
} from "lucide-react";

interface Doctor {
  _id: string;
  fullName: string;
  specialization: string;
  bio?: string;
  rating?: number;
  consultationFee?: number;
  experience?: number;
  location?: string;
  avatar?: string;
  profilePicture?: string;
  verificationStatus?: string;
  userId?: string | { _id: string };
}

interface DoctorCardProps {
  doctor: Doctor;
  onBookAppointment: () => void;
  onViewDetails: () => void;
  onMessage?: () => void;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function DoctorCard({ doctor, onBookAppointment, onViewDetails, onMessage }: DoctorCardProps) {
  const avatarSrc = doctor.profilePicture || doctor.avatar || "";

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300 flex flex-col" data-testid={`card-doctor-${doctor._id}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12 shrink-0">
              <AvatarImage src={avatarSrc} />
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {getInitials(doctor.fullName)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <CardTitle className="text-base leading-tight">{doctor.fullName}</CardTitle>
              <p className="text-sm text-muted-foreground truncate">{doctor.specialization}</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1 shrink-0">
            <Badge variant="outline" className="gap-1 text-xs">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              {doctor.rating || "4.5"}
            </Badge>
            {doctor.verificationStatus === "verified" && (
              <Badge className="bg-green-500/10 text-green-700 border-green-300 text-xs">
                Verified
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pb-3 flex-1">
        {doctor.bio && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{doctor.bio}</p>
        )}

        <div className="space-y-2">
          {typeof doctor.experience === "number" && (
            <div className="flex items-center gap-2 text-sm">
              <Award className="h-4 w-4 text-muted-foreground shrink-0" />
              <span>{doctor.experience}+ years experience</span>
            </div>
          )}

          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
            <span>Available for booking</span>
          </div>

          {typeof doctor.consultationFee === "number" && (
            <div className="flex items-center gap-2 text-sm font-medium">
              <IndianRupee className="h-4 w-4 text-muted-foreground shrink-0" />
              <span>Rs. {doctor.consultationFee} / session</span>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-3 border-t flex flex-col gap-2">
        <div className="flex w-full gap-2">
          <Button
            variant="outline"
            className="flex-1 gap-1 text-sm"
            onClick={onViewDetails}
            data-testid={`button-view-doctor-${doctor._id}`}
          >
            View Profile
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            className="flex-1 gap-1 text-sm"
            onClick={onBookAppointment}
            data-testid={`button-book-${doctor._id}`}
          >
            <MessageSquare className="h-4 w-4" />
            Book Now
          </Button>
        </div>
        {onMessage && (
          <Button
            variant="outline"
            className="w-full gap-2 text-sm border-primary/30 text-primary hover:bg-primary/5"
            onClick={onMessage}
            data-testid={`button-message-doctor-${doctor._id}`}
          >
            <Send className="h-4 w-4" />
            Send Message
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
