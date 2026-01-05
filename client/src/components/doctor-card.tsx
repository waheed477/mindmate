import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  User,
  Star,
  Clock,
  MessageSquare,
  MapPin,
  Award,
  ChevronRight,
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
  availability?: string[];
}

interface DoctorCardProps {
  doctor: Doctor;
  onBookAppointment: () => void;
  onViewDetails: () => void;
}

export function DoctorCard({ doctor, onBookAppointment, onViewDetails }: DoctorCardProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={doctor.avatar} />
              <AvatarFallback className="bg-primary/10 text-primary">
                {getInitials(doctor.fullName)}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">{doctor.fullName}</CardTitle>
              <p className="text-sm text-muted-foreground">{doctor.specialization}</p>
            </div>
          </div>
          <Badge variant="outline" className="gap-1">
            <Star className="h-3 w-3" />
            {doctor.rating || "4.5"}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pb-3">
        {doctor.bio && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {doctor.bio}
          </p>
        )}
        
        <div className="space-y-2">
          {doctor.experience && (
            <div className="flex items-center gap-2 text-sm">
              <Award className="h-4 w-4 text-muted-foreground" />
              <span>{doctor.experience}+ years experience</span>
            </div>
          )}
          
          {doctor.location && (
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{doctor.location}</span>
            </div>
          )}
          
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>Available Today</span>
          </div>
          
          {doctor.consultationFee && (
            <div className="flex items-center justify-between pt-2">
              <span className="text-sm text-muted-foreground">Consultation Fee</span>
              <span className="font-semibold">/session</span>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="pt-3 border-t">
        <div className="flex w-full gap-2">
          <Button 
            variant="outline" 
            className="flex-1 gap-2"
            onClick={onViewDetails}
          >
            View Details
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button 
            className="flex-1 gap-2"
            onClick={onBookAppointment}
          >
            <MessageSquare className="h-4 w-4" />
            Book Now
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
