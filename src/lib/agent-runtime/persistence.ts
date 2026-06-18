import type { AgentRunStatus, Prisma, RunEventType } from "@prisma/client";

import type { AgentRunEvent } from "@/lib/agent-runtime/types";
import { env } from "@/lib/env";
import { prisma } from "@/lib/prisma";

const defaultAgent = {
  name: "Research Agent",
  description: "Plans research tasks, retrieves knowledge, calls Skills, and generates cited reports.",
  systemPrompt:
    "You are a research Agent. Plan the task, retrieve relevant knowledge, call available Skills, and generate a structured report with citations.",
};

function ensureDatabaseUrl() {
  if (!env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required to persist Agent runs.");
  }
}

export async function ensureDefaultAgent() {
  ensureDatabaseUrl();

  const existingAgent = await prisma.agent.findFirst({
    where: {
      name: defaultAgent.name,
    },
  });

  if (existingAgent) {
    return existingAgent;
  }

  return prisma.agent.create({
    data: {
      ...defaultAgent,
      model: env.OPENAI_MODEL,
    },
  });
}

export async function createAgentRun(task: string) {
  const agent = await ensureDefaultAgent();

  return prisma.agentRun.create({
    data: {
      agentId: agent.id,
      task,
      status: "RUNNING",
      startedAt: new Date(),
    },
  });
}

export async function persistRunEvent(runId: string, event: AgentRunEvent) {
  return prisma.runEvent.create({
    data: {
      runId,
      type: event.persistedType as RunEventType,
      title: event.title,
      status: event.status,
      duration: event.durationMs,
      payload: event.payload as Prisma.InputJsonValue,
    },
  });
}

export async function completeAgentRun(runId: string, result: string) {
  return updateAgentRunStatus(runId, "COMPLETED", result);
}

export async function failAgentRun(runId: string, message: string) {
  return updateAgentRunStatus(runId, "FAILED", message);
}

async function updateAgentRunStatus(runId: string, status: AgentRunStatus, result: string) {
  return prisma.agentRun.update({
    where: {
      id: runId,
    },
    data: {
      status,
      result,
      endedAt: new Date(),
    },
  });
}
