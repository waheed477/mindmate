import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const API_BASE = "/api";
const getToken = () => localStorage.getItem("token") ?? "";

export interface Medicine {
  name: string;
  dosage: string;
  duration: string;
  instructions: string;
}

export interface Prescription {
  _id: string;
  doctorId: { _id: string; fullName: string; email: string } | string;
  patientId: { _id: string; fullName: string; email: string } | string;
  medicines: Medicine[];
  notes: string;
  doctorName: string;
  patientName: string;
  appointmentId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePrescriptionData {
  patientId: string;
  patientName: string;
  medicines: Medicine[];
  notes?: string;
  appointmentId?: string;
}

// Patient: fetch my prescriptions
export const useMyPrescriptions = () => {
  return useQuery({
    queryKey: ["prescriptions", "my"],
    queryFn: async () => {
      const response = await fetch(`${API_BASE}/prescriptions/my`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!response.ok) throw new Error("Failed to fetch prescriptions");
      const data = await response.json();
      return (data.data ?? []) as Prescription[];
    },
    staleTime: 2 * 60 * 1000,
  });
};

// Doctor: fetch prescriptions I created
export const useDoctorPrescriptions = () => {
  return useQuery({
    queryKey: ["prescriptions", "doctor"],
    queryFn: async () => {
      const response = await fetch(`${API_BASE}/prescriptions/doctor`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!response.ok) throw new Error("Failed to fetch prescriptions");
      const data = await response.json();
      return (data.data ?? []) as Prescription[];
    },
    staleTime: 2 * 60 * 1000,
  });
};

// Doctor: create a prescription
export const useCreatePrescription = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (prescriptionData: CreatePrescriptionData) => {
      const response = await fetch(`${API_BASE}/prescriptions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(prescriptionData),
      });
      if (!response.ok) {
        const err = await response.json().catch(() => ({ message: "Failed to create prescription" }));
        throw new Error(err.message || "Failed to create prescription");
      }
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prescriptions"] });
    },
  });
};
