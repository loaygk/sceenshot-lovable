"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type StatMetric = {
  title: string;
  value: string | number;
  hint?: string;
};

type StatsCardsProps = {
  metrics: StatMetric[];
  isLoading?: boolean;
  isUpdating?: boolean;
};

export function StatsCards({
  metrics,
  isLoading = false,
  isUpdating = false,
}: StatsCardsProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, idx) => (
          <Card
            key={idx}
            className="bg-slate-900/70 border-slate-800 shadow-lg"
          >
            <CardHeader>
              <Skeleton className="h-4 w-24 bg-slate-800" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-20 bg-slate-800" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => (
        <Card
          key={metric.title}
          className={cn(
            "bg-slate-900/70 border-slate-800 shadow-lg transition-colors duration-300",
            isUpdating && "border-slate-700",
          )}
        >
          <CardHeader className="space-y-1">
            <CardTitle className="text-sm font-medium text-slate-400">
              {metric.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-baseline gap-2">
            <span className="text-3xl font-semibold text-slate-50">
              {metric.value}
            </span>
            {metric.hint ? (
              <span className="text-xs text-slate-500">{metric.hint}</span>
            ) : null}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}




