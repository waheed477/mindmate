// client/src/types/appointment.ts
export interface Appointment {
    _id: string;
    patientId: string;
    doctorId: string;
    date: string;
    status: "pending" | "accepted" | "rejected" | "cancelled" | "completed";
    symptoms: string;
    healthCondition?: string;
    notes?: string;
    doctorNotes?: string;
    type: "online" | "in-person";
    duration: number;
    followUpDate?: string;
    prescription?: string;
    rating?: number;
    review?: string;
    activityLog: ActivityLog[];
    createdAt: string;
    updatedAt: string;
    
    // Populated fields
    doctor?: {
      _id: string;
      fullName: string;
      specialization: string;
      consultationFee: number;
      verificationStatus: string;
    };
    
    patient?: {
      _id: string;
      fullName: string;
      age: number;
      gender: string;
      contactNumber: string;
    };
  }
  
  export interface ActivityLog {
    action: string;
    performedBy: string;
    timestamp: string;
    details: string;
  }
  
  export interface CreateAppointmentData {
    doctorId: string;
    date: string;
    symptoms: string;
    healthCondition?: string;
    type?: "online" | "in-person";
    duration?: number;
  }
  
  export interface UpdateAppointmentData {
    status?: Appointment["status"];
    notes?: string;
    doctorNotes?: string;
    prescription?: string;
    followUpDate?: string;
    rating?: number;
    review?: string;
  }