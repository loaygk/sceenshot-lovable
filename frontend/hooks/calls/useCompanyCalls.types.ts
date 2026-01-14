export type Sentiment = "positive" | "neutral" | "negative" | string;
export type Status = "ringing" | "in_progress" | "completed" | string;

export type CallRecord = {
  id: string;
  caller_number?: string | null;
  sentiment?: Sentiment | null;
  status: Status;
  started_at?: string | null;
  created_at?: string | null;
  duration_seconds?: number | null;
  [key: string]: unknown;
};




