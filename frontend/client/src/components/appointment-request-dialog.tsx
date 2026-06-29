import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { CreateAppointmentData } from "@/types/appointment";

interface AppointmentRequestDialogProps {
  doctor: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateAppointmentData) => void;
  isSubmitting?: boolean;
}

export function AppointmentRequestDialog({
  doctor,
  open,
  onOpenChange,
  onSubmit,
  isSubmitting = false,
}: AppointmentRequestDialogProps) {
  const [reason, setReason] = useState("");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [timeSlot, setTimeSlot] = useState("10:00");

  const availableTimeSlots = [
    "09:00", "10:00", "11:00", "12:00", 
    "14:00", "15:00", "16:00", "17:00"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const doctorId = doctor?.id ?? doctor?._id;
    if (!doctorId || !date) return;

    const appointmentData: CreateAppointmentData = {
      doctorId,
      date: format(date, "yyyy-MM-dd"),
      timeSlot,
      reason: reason.trim(),
    };

    onSubmit(appointmentData);
  };

  const resetForm = () => {
    setReason("");
    setDate(new Date());
    setTimeSlot("10:00");
  };

  useEffect(() => {
    if (!open) {
      resetForm();
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Request Appointment</DialogTitle>
          <DialogDescription>
            Book an appointment with Dr. {doctor.fullName} ({doctor.specialization})
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reason">
              Reason for Appointment <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="reason"
              placeholder="Briefly describe why you want this appointment"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="min-h-[110px]"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Appointment Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    disabled={(date) => 
                      date < new Date() || 
                      date > new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Time Slot</Label>
              <Select value={timeSlot} onValueChange={setTimeSlot}>
                <SelectTrigger>
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  {availableTimeSlots.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !reason.trim() || !date || !timeSlot}>
              {isSubmitting ? "Sending Request..." : "Send Request"}
            </Button>
          </DialogFooter>
        </form>

        <div className="text-sm text-muted-foreground border-t pt-4">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 mt-0.5" />
            <p>
              Your appointment request will be sent to the doctor for approval. 
              You'll receive a notification when they respond.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
