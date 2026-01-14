"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

import type { Sentiment, Status } from "@/hooks/calls/useCompanyCalls.types";

export type LatestCall = {
  id: string;
  caller_number?: string | null;
  sentiment?: Sentiment | null;
  status: Status;
  started_at?: string | null;
};

type LatestCallsTableProps = {
  calls: LatestCall[];
  isLoading?: boolean;
  emptyMessage?: string;
};

function sentimentBadgeVariant(sentiment?: Sentiment | null) {
  const s = (sentiment || "").toLowerCase();
  if (s === "positive") return "success";
  if (s === "negative") return "destructive";
  if (s === "neutral") return "secondary";
  return "secondary";
}

function statusLabel(status: Status) {
  if (status === "ringing") return "Ringing";
  if (status === "in_progress") return "In progress";
  if (status === "completed") return "Completed";
  return status;
}

export function LatestCallsTable({
  calls,
  isLoading = false,
  emptyMessage = "No calls yet.",
}: LatestCallsTableProps) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, idx) => (
          <Skeleton
            key={idx}
            className="h-12 w-full bg-slate-800 rounded-lg"
          />
        ))}
      </div>
    );
  }

  if (!calls || calls.length === 0) {
    return (
      <div className="text-sm text-slate-500 text-center py-6">
        {emptyMessage}
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="border-slate-800">
          <TableHead className="text-slate-400">Caller</TableHead>
          <TableHead className="text-slate-400">Date</TableHead>
          <TableHead className="text-slate-400">Sentiment</TableHead>
          <TableHead className="text-slate-400">Status</TableHead>
          <TableHead className="text-right text-slate-400">
            Details
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {calls.map((call) => {
          const sentimentVariant = sentimentBadgeVariant(call.sentiment);
          const sentimentLabel =
            (call.sentiment || "Unknown").toString().slice(0, 20);
          const dateLabel = call.started_at
            ? new Date(call.started_at).toLocaleString()
            : "—";

          return (
            <TableRow key={call.id} className="border-slate-800">
              <TableCell className="text-slate-100">
                {call.caller_number || "Unknown"}
              </TableCell>
              <TableCell className="text-slate-200">
                {dateLabel}
              </TableCell>
              <TableCell>
                <Badge variant={sentimentVariant}>{sentimentLabel}</Badge>
              </TableCell>
              <TableCell className="text-slate-200">
                {statusLabel(call.status)}
              </TableCell>
              <TableCell className="text-right">
                <Link
                  href={`/calls/${call.id}`}
                  className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  View
                </Link>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}




