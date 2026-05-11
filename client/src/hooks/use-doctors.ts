import { useQuery } from "@tanstack/react-query";

const API_BASE = "http://localhost:3000/api";

export interface DoctorUserRef {
  _id: string;
  email?: string;
}

export interface Doctor {
  id?: string;
  _id: string;
  userId?: string | DoctorUserRef;
  fullName: string;
  specialization: string;
  qualification?: string;
  licenseNumber?: string;
  experience?: number;
  consultationFee?: number;
  verificationStatus?: "unverified" | "pending" | "verified" | "rejected";
  bio?: string;
  availability?: Array<{
    day: string;
    slots?: string[];
    startTime?: string;
    endTime?: string;
    isAvailable?: boolean;
  }>;
  rating?: number;
  profilePicture?: string;
  hospitalAffiliation?: string;
  contactNumber?: string;
  education?: Array<{
    degree: string;
    university: string;
    year: number;
  }>;
  languages?: string[];
  consultationTypes?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface DoctorFilters {
  specialization?: string;
  search?: string;
  minFee?: number;
  maxFee?: number;
}

const buildQueryParams = (filters?: DoctorFilters) => {
  if (!filters) return "";

  const params = new URLSearchParams();
  if (filters.specialization) params.append("specialization", filters.specialization);
  if (filters.search) params.append("search", filters.search);
  if (typeof filters.minFee === "number") params.append("minFee", String(filters.minFee));
  if (typeof filters.maxFee === "number") params.append("maxFee", String(filters.maxFee));

  return params.toString();
};

export const useDoctors = (filters?: DoctorFilters) => {
  return useQuery({
    queryKey: ["doctors", filters ?? {}],
    queryFn: async () => {
      const query = buildQueryParams(filters);
      const response = await fetch(`${API_BASE}/doctors${query ? `?${query}` : ""}`);

      if (!response.ok) {
        throw new Error("Failed to fetch doctors");
      }

      const data = await response.json();
      return data.data as Doctor[];
    },
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });
};

export const useDoctor = (id: string) => {
  return useQuery({
    queryKey: ["doctor", id],
    queryFn: async () => {
      const response = await fetch(`${API_BASE}/doctors/${id}`);

      if (!response.ok) {
        throw new Error("Failed to fetch doctor");
      }

      const data = await response.json();
      return data.data as Doctor;
    },
    enabled: Boolean(id),
  });
};

export const useDoctorSpecializations = () => {
  return useQuery({
    queryKey: ["doctor-specializations"],
    queryFn: async () => {
      const response = await fetch(`${API_BASE}/doctors/specializations`);

      if (!response.ok) {
        throw new Error("Failed to fetch doctor specializations");
      }

      const data = await response.json();
      return data.data as string[];
    },
    staleTime: 10 * 60 * 1000,
  });
};

export const useAvailableDoctors = (filters?: {
  specialization?: string;
  maxFee?: number;
}) => {
  return useDoctors({
    specialization: filters?.specialization,
    maxFee: filters?.maxFee,
  });
};

export const getDoctorId = (doctor: Pick<Doctor, "id" | "_id">) => doctor.id ?? doctor._id;
