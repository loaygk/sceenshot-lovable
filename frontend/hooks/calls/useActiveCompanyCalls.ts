import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api-client";
import type { CallRecord } from "./useCompanyCalls.types";

export function useActiveCompanyCalls(
  companyId?: string | null,
  enabled = true,
) {
  return useQuery({
    queryKey: ["calls", "company", companyId, "active"],
    queryFn: async () =>
      apiGet<CallRecord[]>(`/calls/company/${companyId}/active`),
    enabled: Boolean(companyId) && enabled,
  });
}




