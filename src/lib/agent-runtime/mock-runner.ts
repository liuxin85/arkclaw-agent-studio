import type { AgentRunEvent } from "./types";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function createEvent(
  index: number,
  event: Omit<AgentRunEvent, "id" | "createdAt">,
): AgentRunEvent {
  return {
    ...event,
    id: `event-${index}`,
    createdAt: new Date().toISOString(),
  };
}

export async function* runMockAgent(task: string): AsyncGenerator<AgentRunEvent> {
  const normalizedTask = task.trim() || "Generate a competitor analysis report.";

  const events: Array<Omit<AgentRunEvent, "id" | "createdAt">> = [
    {
      type: "run.created",
      title: "Run created",
      description: "The task was accepted by the Agent runtime.",
      status: "queued",
      durationMs: 0,
      payload: {
        task: normalizedTask,
        agent: "Research Agent",
      },
    },
    {
      type: "plan.created",
      title: "Planning",
      description: "Generated a structured execution plan for the requested report.",
      status: "completed",
      durationMs: 420,
      payload: {
        steps: [
          "Clarify report goal and output structure",
          "Retrieve relevant knowledge chunks",
          "Call web.fetch for external context",
          "Generate a cited final report",
        ],
      },
    },
    {
      type: "retrieval.completed",
      title: "Knowledge retrieval",
      description: "Matched internal notes that explain Agent observability requirements.",
      status: "completed",
      durationMs: 318,
      payload: {
        query: normalizedTask,
        matches: [
          {
            source: "market-notes.md",
            score: 0.91,
            preview: "Users need visibility into planning, retrieval, tool calls, and failures.",
          },
          {
            source: "agent-product.md",
            score: 0.84,
            preview: "Workflow-based Agent products should make runtime traces reusable.",
          },
        ],
      },
    },
    {
      type: "skill.completed",
      title: "Skill call",
      description: "Executed the web.fetch Skill contract with a mocked result.",
      status: "completed",
      durationMs: 760,
      payload: {
        skill: "web.fetch",
        input: {
          url: "https://example.com/agent-platform-notes",
        },
        output: {
          title: "Agent platform notes",
          extractedCharacters: 1840,
        },
      },
    },
    {
      type: "report.completed",
      title: "Final report",
      description: "Generated the final answer from planning, retrieval, and Skill evidence.",
      status: "completed",
      durationMs: 980,
      payload: {
        report: [
          "The strongest product angle is Agent observability.",
          "The MVP should prioritize the Run Console before advanced workflow editing.",
          "Knowledge retrieval and Skill traces should be shown as first-class evidence.",
        ],
      },
    },
  ];

  for (const [index, event] of events.entries()) {
    await delay(index === 0 ? 100 : 850);
    yield createEvent(index + 1, event);
  }
}
