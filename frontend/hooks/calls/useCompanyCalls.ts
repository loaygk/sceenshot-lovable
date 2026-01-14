import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api-client";
import type { CallRecord } from "./useCompanyCalls.types";

export function useCompanyCalls(companyId?: string | null, enabled = true) {
  return useQuery({
    queryKey: ["calls", "company", companyId],
    queryFn: async () =>
      apiGet<CallRecord[]>(`/calls/company/${companyId}`),
    enabled: Boolean(companyId) && enabled,
  });
}




