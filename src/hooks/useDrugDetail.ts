"use client";

import { useQuery } from "@tanstack/react-query";
import { getDrugById } from "@/services/fdaApi";
import { FdaDrugLabel } from "@/types/fda";

export function useDrugDetail(id: string) {
  const trimmedId = id?.trim();

  return useQuery<FdaDrugLabel | null, Error>({
    queryKey: ["drugDetail", trimmedId],
    queryFn: async ({ signal }) => {
      if (!trimmedId) return null;
      return getDrugById(trimmedId, signal);
    },
    enabled: Boolean(trimmedId),
    staleTime: 1000 * 60 * 10,
  });
}
