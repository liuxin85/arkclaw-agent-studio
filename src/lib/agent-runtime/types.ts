export type RunEventStatus = "queued" | "running" | "completed" | "failed";

export type RunEventType =
  | "run.created"
  | "plan.created"
  | "retrieval.completed"
  | "skill.completed"
  | "report.completed";

export type AgentRunEvent = {
  id: string;
  type: RunEventType;
  title: string;
  description: string;
  status: RunEventStatus;
  durationMs?: number;
  payload: Record<string, unknown>;
  createdAt: string;
};
