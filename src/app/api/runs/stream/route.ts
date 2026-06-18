import { runMockAgent } from "@/lib/agent-runtime/mock-runner";
import {
  completeAgentRun,
  createAgentRun,
  failAgentRun,
  persistRunEvent,
} from "@/lib/agent-runtime/persistence";

export const dynamic = "force-dynamic";

const encoder = new TextEncoder();

function encodeSse(event: string, data: unknown) {
  return encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const task = url.searchParams.get("task") ?? "";

  const stream = new ReadableStream({
    async start(controller) {
      let runId: string | null = null;

      try {
        const run = await createAgentRun(task);
        runId = run.id;
        let finalResult = "";

        for await (const event of runMockAgent(task)) {
          const persistedEvent = {
            ...event,
            runId,
          };

          await persistRunEvent(runId, persistedEvent);
          controller.enqueue(encodeSse("run-event", persistedEvent));

          if (event.type === "report.completed") {
            const report = event.payload.report;
            finalResult = Array.isArray(report) ? report.join("\n") : event.description;
          }
        }

        await completeAgentRun(runId, finalResult);
        controller.enqueue(
          encodeSse("run-complete", {
            runId,
            completedAt: new Date().toISOString(),
          }),
        );
      } catch (error) {
        if (runId) {
          await failAgentRun(
            runId,
            error instanceof Error ? error.message : "Unknown runtime error",
          );
        }

        controller.enqueue(
          encodeSse("run-error", {
            runId,
            message: error instanceof Error ? error.message : "Unknown runtime error",
          }),
        );
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "Content-Type": "text/event-stream; charset=utf-8",
      "X-Accel-Buffering": "no",
    },
  });
}
