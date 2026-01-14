"use client";

import { useMemo } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useCompanyCalls } from "@/hooks/calls/useCompanyCalls";
import { useActiveCompanyCalls } from "@/hooks/calls/useActiveCompanyCalls";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { CallsSummaryChart } from "@/components/dashboard/calls-summary-chart";
import { SentimentChart } from "@/components/dashboard/sentiment-chart";
import { LatestCallsTable } from "@/components/dashboard/latest-calls-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import type { CallRecord, Sentiment, Status } from "@/hooks/calls/useCompanyCalls.types";

function toDate(value?: string | null) {
  return value ? new Date(value) : null;
}

function buildTimeSeries(
  calls: CallRecord[],
  days: number,
): { date: string; count: number }[] {
  const now = new Date();
  const start = new Date(now);
  start.setDate(now.getDate() - days + 1);

  const counts: Record<string, number> = {};

  calls.forEach((call) => {
    const d = toDate(call.started_at || call.created_at);
    if (!d) return;
    if (d < start) return;
    const key = d.toISOString().slice(0, 10);
    counts[key] = (counts[key] ?? 0) + 1;
  });

  const data: { date: string; count: number }[] = [];
  for (let i = 0; i < days; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    const key = d.toISOString().slice(0, 10);
    data.push({ date: key, count: counts[key] ?? 0 });
  }
  return data;
}

function sentimentCounts(calls: CallRecord[]) {
  const counts: Record<Sentiment, number> = {
    positive: 0,
    neutral: 0,
    negative: 0,
  };

  calls.forEach((c) => {
    const s = (c.sentiment || "neutral") as Sentiment;
    counts[s] = (counts[s] ?? 0) + 1;
  });

  return counts;
}

export default function DashboardPage() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const companyId = user?.company_id;

  const {
    data: calls,
    isLoading: isCallsLoading,
    isRefetching: isCallsRefetching,
  } = useCompanyCalls(companyId, !!companyId);

  const {
    data: activeCalls,
    isLoading: isActiveLoading,
    isRefetching: isActiveRefetching,
  } = useActiveCompanyCalls(companyId, !!companyId);

  const isLoading =
    isAuthLoading || isCallsLoading || isActiveLoading;
  const isUpdating = isCallsRefetching || isActiveRefetching;

  const metrics = useMemo(() => {
    const data = calls ?? [];
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthCalls = data.filter((c) => {
      const d = toDate(c.started_at || c.created_at);
      return d && d >= monthStart;
    });

    const totalThisMonth = monthCalls.length;
    const positiveCount = monthCalls.filter(
      (c) => (c.sentiment || "").toLowerCase() === "positive",
    ).length;
    const positivePct =
      totalThisMonth > 0
        ? Math.round((positiveCount / totalThisMonth) * 100)
        : 0;

    const durations = monthCalls
      .map((c) => c.duration_seconds || 0)
      .filter((d) => d > 0);
    const avgDuration =
      durations.length > 0
        ? Math.round(
            durations.reduce((a, b) => a + b, 0) / durations.length,
          )
        : 0;

    const activeCount = activeCalls?.length ?? 0;

    return {
      totalThisMonth,
      positivePct,
      avgDuration,
      activeCount,
    };
  }, [calls, activeCalls]);

  const timeSeries = useMemo(
    () => buildTimeSeries(calls ?? [], 30),
    [calls],
  );

  const sentiment = useMemo(
    () => sentimentCounts(calls ?? []),
    [calls],
  );

  const latestCalls = useMemo(() => {
    const sorted = [...(calls ?? [])].sort((a, b) => {
      const da = toDate(a.started_at || a.created_at)?.getTime() || 0;
      const db = toDate(b.started_at || b.created_at)?.getTime() || 0;
      return db - da;
    });
    return sorted.slice(0, 5);
  }, [calls]);

  return (
    <div className="space-y-6">
      <StatsCards
        isLoading={isLoading}
        isUpdating={isUpdating}
        metrics={[
          {
            title: "Total calls this month",
            value: metrics.totalThisMonth,
          },
          {
            title: "Positive sentiment",
            value: `${metrics.positivePct}%`,
          },
          {
            title: "Avg call duration",
            value: metrics.avgDuration
              ? `${metrics.avgDuration}s`
              : "—",
          },
          {
            title: "Active live calls",
            value: metrics.activeCount,
          },
        ]}
      />

      <div className="grid gap-4 md:grid-cols-2">
        <CallsSummaryChart
          isLoading={isLoading}
          data={timeSeries}
          title="Calls over time (30d)"
        />
        <SentimentChart
          isLoading={isLoading}
          sentimentCounts={sentiment}
          title="Sentiment distribution"
        />
      </div>

      <Card className="bg-slate-900/70 border-slate-800 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-slate-50">
            Latest calls
          </CardTitle>
        </CardHeader>
        <CardContent>
          <LatestCallsTable
            calls={latestCalls}
            isLoading={isLoading}
            emptyMessage="No calls yet. Once calls start coming in, they’ll show up here."
          />
        </CardContent>
      </Card>
    </div>
  );
}




