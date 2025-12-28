import { useQuery } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";

export function useDoctors() {
  return useQuery({
    queryKey: [api.doctors.list.path],
    queryFn: async () => {
      const res = await fetch(api.doctors.list.path);
      if (!res.ok) throw new Error("Failed to fetch doctors");
      return api.doctors.list.responses[200].parse(await res.json());
    },
  });
}

export function useDoctor(id: number) {
  return useQuery({
    queryKey: [api.doctors.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.doctors.get.path, { id });
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch doctor details");
      return api.doctors.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
  });
}
