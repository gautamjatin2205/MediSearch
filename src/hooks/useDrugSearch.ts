"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { searchDrugsByBrand } from "@/services/fdaApi";
import { FdaDrugLabel } from "@/types/fda";
import { useEffect } from "react";

export function useDrugSearch(searchTerm: string) {
  const queryClient = useQueryClient();
  const trimmed = searchTerm.trim();

  const query = useQuery<{ drugs: FdaDrugLabel[]; total: number }, Error>({
    queryKey: ["drugSearch", trimmed],
    queryFn: async ({ signal }) => {
      return searchDrugsByBrand(trimmed, signal);
    },
    enabled: trimmed.length > 0,
    placeholderData: (previousData) => previousData,
  });

  useEffect(() => {
    if (query.data?.drugs && query.data.drugs.length > 0) {
      for (const drug of query.data.drugs) {
        if (drug.id) {
          queryClient.setQueryData(["drugDetail", drug.id], drug);
        }
      }
    }
  }, [query.data, queryClient]);

  return query;
}
