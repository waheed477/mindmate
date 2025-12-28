import { type Doctor } from "@shared/schema";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Clock, DollarSign, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { AppointmentDialog } from "./appointment-dialog";

interface DoctorCardProps {
  doctor: Doctor;
}

export function DoctorCard({ doctor }: DoctorCardProps) {
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  return (
    <>
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border-primary/10 group">
        <CardHeader className="p-0">
          <div className="h-24 bg-gradient-to-r from-primary/10 to-primary/5" />
          <div className="px-6 -mt-12 flex justify-between items-end">
            <Avatar className="h-24 w-24 border-4 border-background shadow-md">
              <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${doctor.id}`} />
              <AvatarFallback className="text-xl bg-primary/10 text-primary font-bold">
                {doctor.fullName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-end gap-2 mb-2">
              {doctor.verificationStatus === "verified" && (
                <Badge className="bg-green-500/10 text-green-600 border-green-200 gap-1 px-2 py-0.5 text-[10px] uppercase tracking-wider">
                  <ShieldCheck className="h-3 w-3" /> Verified
                </Badge>
              )}
              <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-full border border-yellow-100">
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                <span className="text-sm font-bold text-yellow-700">{doctor.rating || "New"}</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-6 pt-4">
          <h3 className="text-xl font-bold font-display">{doctor.fullName}</h3>
          <p className="text-primary font-medium mb-4">{doctor.specialization}</p>
          
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{doctor.experience} years experience</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              <span>${doctor.consultationFee} / session</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="px-6 pb-6 pt-2">
          <Button 
            className="w-full bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20" 
            onClick={() => setIsBookingOpen(true)}
          >
            Book Appointment
          </Button>
        </CardFooter>
      </Card>

      <AppointmentDialog 
        doctor={doctor} 
        open={isBookingOpen} 
        onOpenChange={setIsBookingOpen} 
      />
    </>
  );
}
