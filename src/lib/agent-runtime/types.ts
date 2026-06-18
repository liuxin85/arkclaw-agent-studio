export type RunEventStatus = "queued" | "running" | "completed" | "failed";

export type RunEventType =
  | "run.created"
  | "plan.created"
  | "retrieval.completed"
  | "skill.completed"
  | "report.completed";

export type PersistedAgentRunEventType = "PLAN" | "RETRIEVAL" | "SKILL_CALL" | "MODEL_CALL" | "ERROR" | "FINAL";

export type AgentRunEvent = {
  id: string;
  runId?: string;
  type: RunEventType;
  persistedType: PersistedAgentRunEventType;
  title: string;
  description: string;
  status: RunEventStatus;
  durationMs?: number;
  payload: Record<string, unknown>;
  createdAt: string;
};
