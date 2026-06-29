import { z } from "zod";
import {
  insertPatientSchema,
  insertDoctorSchema,
  insertAppointmentSchema,
  insertMessageSchema,
  insertUserSchema,
} from "./schema.js";

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({ message: z.string() }),
  internal: z.object({ message: z.string() }),
  unauthorized: z.object({ message: z.string() }),
};

export const api = {
  auth: {
    register: {
      method: "POST" as const,
      path: "/api/register",
      input: insertUserSchema.extend({
        patientData: insertPatientSchema.omit({ userId: true }).optional(),
        doctorData: insertDoctorSchema.omit({ userId: true }).optional(),
      }),
    },
    login: {
      method: "POST" as const,
      path: "/api/login",
      input: z.object({ username: z.string(), password: z.string() }),
    },
    logout: { method: "POST" as const, path: "/api/logout" },
    me: { method: "GET" as const, path: "/api/user" },
  },
  doctors: {
    list: { method: "GET" as const, path: "/api/doctors" },
    specializations: { method: "GET" as const, path: "/api/doctors/specializations" },
    get: { method: "GET" as const, path: "/api/doctors/:id" },
  },
  patients: {
    get: { method: "GET" as const, path: "/api/patients/:id" },
  },
  appointments: {
    list: { method: "GET" as const, path: "/api/appointments" },
    create: {
      method: "POST" as const,
      path: "/api/appointments",
      input: insertAppointmentSchema.omit({ patientId: true }),
    },
    updateStatus: {
      method: "PATCH" as const,
      path: "/api/appointments/:id/status",
      input: z.object({
        status: z.enum(["pending", "accepted", "rejected", "cancelled", "completed"]),
        notes: z.string().optional(),
      }),
    },
  },
  messages: {
    list: {
      method: "GET" as const,
      path: "/api/messages",
      input: z.object({ otherUserId: z.coerce.number() }),
    },
    send: {
      method: "POST" as const,
      path: "/api/messages",
      input: insertMessageSchema.omit({ senderId: true }),
    },
  },
};

export function buildUrl(
  path: string,
  params?: Record<string, string | number>
): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url = url.replace(`:${key}`, String(value));
    });
  }
  return url;
}
