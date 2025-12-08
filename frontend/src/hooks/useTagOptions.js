// src/hooks/useTagOptions.js
import { useQuery } from "@tanstack/react-query";
import api from "../services/api";

export default function useTagOptions() {
  return useQuery({
    queryKey: ["sales-tags"],
    queryFn: async () => {
      const res = await api.get("/sales/tags");
      return res.data?.tags || [];
    },
    staleTime: 5 * 60 * 1000, // cache 5 minutes
  });
}
