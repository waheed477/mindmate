import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Appointment, CreateAppointmentData, UpdateAppointmentData } from "@/types/appointment";

const API_BASE = "/api";

const getToken = () => localStorage.getItem("token") ?? "";

// Get appointments for current user (patient or doctor based on JWT role)
export const useAppointments = () => {
  return useQuery({
    queryKey: ["appointments"],
    queryFn: async () => {
      const response = await fetch(`${API_BASE}/appointments/my-appointments`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!response.ok) throw new Error("Failed to fetch appointments");
      const data = await response.json();
      return (data.appointments ?? []) as Appointment[];
    },
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });
};

// Get doctor's appointments by doctor profile ID
export const useDoctorAppointments = (doctorId: string) => {
  return useQuery({
    queryKey: ["doctor-appointments", doctorId],
    queryFn: async () => {
      const response = await fetch(`${API_BASE}/appointments/doctor/${doctorId}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!response.ok) throw new Error("Failed to fetch doctor appointments");
      const data = await response.json();
      return (data.appointments ?? []) as Appointment[];
    },
    enabled: !!doctorId,
    staleTime: 2 * 60 * 1000,
  });
};

// Get patient's appointments by patient profile ID
export const usePatientAppointments = (patientId: string) => {
  return useQuery({
    queryKey: ["patient-appointments", patientId],
    queryFn: async () => {
      const response = await fetch(`${API_BASE}/appointments/patient/${patientId}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!response.ok) throw new Error("Failed to fetch patient appointments");
      const data = await response.json();
      return (data.appointments ?? []) as Appointment[];
    },
    enabled: !!patientId,
  });
};

// Create new appointment
export const useCreateAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (appointmentData: CreateAppointmentData) => {
      const response = await fetch(`${API_BASE}/appointments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(appointmentData),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: "Failed to create appointment" }));
        throw new Error(error.message || "Failed to create appointment");
      }

      return await response.json();
    },
    onSuccess: () => {
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
      const response = await fetch(`${API_BASE}/appointments/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: "Failed to update appointment" }));
        throw new Error(error.message || "Failed to update appointment");
      }

      return await response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      queryClient.invalidateQueries({ queryKey: ["doctor-appointments"] });
      queryClient.invalidateQueries({ queryKey: ["patient-appointments"] });
      queryClient.invalidateQueries({ queryKey: ["appointment", variables.id] });
    },
  });
};

// Delete appointment
export const useDeleteAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`${API_BASE}/appointments/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: "Failed to delete appointment" }));
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
      const response = await fetch(`${API_BASE}/appointments/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!response.ok) throw new Error("Failed to fetch appointment");
      const data = await response.json();
      return data.appointment as Appointment;
    },
    enabled: !!id,
  });
};
