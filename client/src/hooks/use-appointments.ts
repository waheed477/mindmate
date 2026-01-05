// client/src/hooks/use-appointments.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Appointment, CreateAppointmentData, UpdateAppointmentData } from "@/types/appointment";

const API_BASE = "http://localhost:3000/api";

// Get appointments for current user
export const useAppointments = () => {
  return useQuery({
    queryKey: ["appointments"],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE}/appointments/my-appointments`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch appointments");
      }

      const data = await response.json();
      return data.appointments as Appointment[];
    },
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get doctor's appointments
export const useDoctorAppointments = (doctorId: string) => {
  return useQuery({
    queryKey: ["doctor-appointments", doctorId],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE}/appointments/doctor/${doctorId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch doctor appointments");
      }

      const data = await response.json();
      return data.appointments as Appointment[];
    },
    enabled: !!doctorId,
  });
};

// Get patient's appointments
export const usePatientAppointments = (patientId: string) => {
  return useQuery({
    queryKey: ["patient-appointments", patientId],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE}/appointments/patient/${patientId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch patient appointments");
      }

      const data = await response.json();
      return data.appointments as Appointment[];
    },
    enabled: !!patientId,
  });
};

// Create new appointment
export const useCreateAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (appointmentData: CreateAppointmentData) => {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE}/appointments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(appointmentData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create appointment");
      }

      return await response.json();
    },
    onSuccess: () => {
      // Invalidate appointments queries
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      queryClient.invalidateQueries({ queryKey: ["doctor-appointments"] });
      queryClient.invalidateQueries({ queryKey: ["patient-appointments"] });
    },
  });
};

// Update appointment (status, notes, etc.)
export const useUpdateAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updateData }: UpdateAppointmentData & { id: string }) => {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE}/appointments/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update appointment");
      }

      return await response.json();
    },
    onSuccess: (_, variables) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      queryClient.invalidateQueries({ queryKey: ["doctor-appointments"] });
      queryClient.invalidateQueries({ queryKey: ["patient-appointments"] });
      
      // Also invalidate specific appointment
      queryClient.invalidateQueries({ queryKey: ["appointment", variables.id] });
    },
  });
};

// Delete appointment
export const useDeleteAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE}/appointments/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to delete appointment");
      }

      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });
};

// Get single appointment
export const useAppointment = (id: string) => {
  return useQuery({
    queryKey: ["appointment", id],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE}/appointments/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch appointment");
      }

      const data = await response.json();
      return data.appointment as Appointment;
    },
    enabled: !!id,
  });
};

// Update appointment status only (for quick actions)
export const useUpdateAppointmentStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status, notes }: { id: string; status: Appointment["status"]; notes?: string }) => {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE}/appointments/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status, ...(notes && { doctorNotes: notes }) }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update appointment status");
      }

      return await response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      queryClient.invalidateQueries({ queryKey: ["appointment", variables.id] });
    },
  });
};