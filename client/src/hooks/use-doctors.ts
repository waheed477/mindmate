// client/src/hooks/use-doctors.ts - UPDATED
import { useQuery } from "@tanstack/react-query";

const API_BASE = "http://localhost:3000/api";

export interface Doctor {
  _id: string;
  userId: string;
  fullName: string;
  specialization: string;
  licenseNumber: string;
  experience: number;
  consultationFee: number;
  verificationStatus: "unverified" | "pending" | "verified" | "rejected";
  bio?: string;
  availability?: Array<{
    day: string;
    startTime: string;
    endTime: string;
    isAvailable: boolean;
  }>;
  rating: number;
  profilePicture?: string;
  hospitalAffiliation?: string;
  education?: Array<{
    degree: string;
    university: string;
    year: number;
  }>;
  languages?: string[];
  consultationTypes?: string[];
  createdAt: string;
  updatedAt: string;
}

// Get all doctors
export const useDoctors = () => {
  return useQuery({
    queryKey: ["doctors"],
    queryFn: async () => {
      const response = await fetch(`${API_BASE}/doctors`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch doctors");
      }

      const data = await response.json();
      return data.data as Doctor[];
    },
    retry: 1,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Get single doctor by ID
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
    enabled: !!id,
  });
};

// Get available doctors (with filters)
export const useAvailableDoctors = (filters?: {
  specialization?: string;
  minExperience?: number;
  maxFee?: number;
  verificationStatus?: string;
}) => {
  return useQuery({
    queryKey: ["available-doctors", filters],
    queryFn: async () => {
      let url = `${API_BASE}/doctors`;
      
      // Add query params if filters exist
      if (filters) {
        const params = new URLSearchParams();
        if (filters.specialization) params.append("specialization", filters.specialization);
        if (filters.minExperience) params.append("minExperience", filters.minExperience.toString());
        if (filters.maxFee) params.append("maxFee", filters.maxFee.toString());
        if (filters.verificationStatus) params.append("verificationStatus", filters.verificationStatus);
        
        if (params.toString()) {
          url += `?${params.toString()}`;
        }
      }

      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error("Failed to fetch available doctors");
      }

      const data = await response.json();
      return data.data as Doctor[];
    },
  });
};