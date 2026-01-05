import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { CalendarIcon, Clock, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface AppointmentRequestDialogProps {
  doctor: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => void;
  isSubmitting?: boolean;
}

export function AppointmentRequestDialog({
  doctor,
  open,
  onOpenChange,
  onSubmit,
  isSubmitting = false,
}: AppointmentRequestDialogProps) {
  const [healthCondition, setHealthCondition] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [notes, setNotes] = useState("");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState("10:00");
  const [urgency, setUrgency] = useState("normal");

  const times = [
    "09:00", "10:00", "11:00", "12:00", 
    "14:00", "15:00", "16:00", "17:00"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const appointmentData = {
      doctorId: doctor._id,
      healthCondition,
      symptoms,
      notes,
      appointmentDate: date ? format(date, "yyyy-MM-dd") : "",
      appointmentTime: time,
      urgency,
      status: "pending",
    };

    onSubmit(appointmentData);
  };

  const resetForm = () => {
    setHealthCondition("");
    setSymptoms("");
    setNotes("");
    setDate(new Date());
    setTime("10:00");
    setUrgency("normal");
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
            <Label htmlFor="healthCondition">
              Health Condition <span className="text-red-500">*</span>
            </Label>
            <Input
              id="healthCondition"
              placeholder="e.g., Anxiety, Depression, Stress Management"
              value={healthCondition}
              onChange={(e) => setHealthCondition(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="symptoms">
              Symptoms Description <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="symptoms"
              placeholder="Describe your symptoms in detail..."
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              className="min-h-[100px]"
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
              <Label>Appointment Time</Label>
              <Select value={time} onValueChange={setTime}>
                <SelectTrigger>
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  {times.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Urgency Level</Label>
            <Select value={urgency} onValueChange={setUrgency}>
              <SelectTrigger>
                <SelectValue placeholder="Select urgency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    Low
                  </div>
                </SelectItem>
                <SelectItem value="normal">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                    Normal
                  </div>
                </SelectItem>
                <SelectItem value="high">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-orange-500"></div>
                    High
                  </div>
                </SelectItem>
                <SelectItem value="emergency">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-red-500"></div>
                    Emergency
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Any additional information you'd like to share with the doctor..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[80px]"
            />
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
            <Button type="submit" disabled={isSubmitting || !healthCondition || !symptoms}>
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
