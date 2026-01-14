"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type CallsSummaryChartProps = {
  data: { date: string; count: number }[];
  isLoading?: boolean;
  title?: string;
};

export function CallsSummaryChart({
  data,
  isLoading = false,
  title = "Calls over time",
}: CallsSummaryChartProps) {
  const isEmpty = !isLoading && data.length === 0;

  return (
    <Card className="bg-slate-900/70 border-slate-800 shadow-lg">
      <CardHeader>
        <CardTitle className="text-slate-50">{title}</CardTitle>
      </CardHeader>
      <CardContent className="h-72">
        {isLoading ? (
          <Skeleton className="h-full w-full bg-slate-800" />
        ) : isEmpty ? (
          <div className="h-full flex items-center justify-center text-slate-500">
            No call data yet.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="callsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis
                dataKey="date"
                stroke="#94a3b8"
                tick={{ fill: "#94a3b8", fontSize: 12 }}
              />
              <YAxis
                stroke="#94a3b8"
                tick={{ fill: "#94a3b8", fontSize: 12 }}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0f172a",
                  borderColor: "#1e293b",
                  color: "#e2e8f0",
                }}
                labelStyle={{ color: "#e2e8f0" }}
              />
              <Area
                type="monotone"
                dataKey="count"
                stroke="#22c55e"
                fill="url(#callsGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}




