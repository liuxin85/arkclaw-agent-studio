import { runMockAgent } from "@/lib/agent-runtime/mock-runner";

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
      try {
        for await (const event of runMockAgent(task)) {
          controller.enqueue(encodeSse("run-event", event));
        }

        controller.enqueue(
          encodeSse("run-complete", {
            completedAt: new Date().toISOString(),
          }),
        );
      } catch (error) {
        controller.enqueue(
          encodeSse("run-error", {
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
