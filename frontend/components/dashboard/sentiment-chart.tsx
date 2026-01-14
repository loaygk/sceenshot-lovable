"use client";

import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type SentimentCounts = Record<string, number>;

type SentimentChartProps = {
  sentimentCounts: SentimentCounts;
  isLoading?: boolean;
  title?: string;
};

const COLORS = {
  positive: "#22c55e",
  neutral: "#eab308",
  negative: "#ef4444",
};

export function SentimentChart({
  sentimentCounts,
  isLoading = false,
  title = "Sentiment",
}: SentimentChartProps) {
  const entries = Object.entries(sentimentCounts ?? {});
  const isEmpty =
    !isLoading &&
    (entries.length === 0 ||
      entries.every(([, count]) => (count ?? 0) === 0));

  const data = entries.map(([name, value]) => ({
    name,
    value,
  }));

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
            No sentiment data yet.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                innerRadius={60}
                outerRadius={90}
                paddingAngle={4}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${entry.name}-${index}`}
                    fill={
                      COLORS[entry.name as keyof typeof COLORS] ||
                      "#6366f1"
                    }
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0f172a",
                  borderColor: "#1e293b",
                  color: "#e2e8f0",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}




