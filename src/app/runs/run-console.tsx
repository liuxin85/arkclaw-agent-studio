"use client";

import { Activity, CheckCircle2, Loader2, Play, RotateCcw, XCircle } from "lucide-react";
import { useRef, useState } from "react";

import { StatusBadge } from "@/components/status-badge";
import type { AgentRunEvent } from "@/lib/agent-runtime/types";

const defaultTask =
  "Analyze the uploaded market notes and generate a competitor analysis report with risks, opportunities, and cited evidence.";

type RunStatus = "idle" | "running" | "completed" | "failed";

function getStatusTone(status: AgentRunEvent["status"]) {
  if (status === "completed") {
    return "success";
  }

  if (status === "failed") {
    return "danger";
  }

  if (status === "running") {
    return "info";
  }

  return "neutral";
}

function RuntimeIcon({ status }: Readonly<{ status: RunStatus }>) {
  if (status === "running") {
    return <Loader2 className="animate-spin text-cyan-600" size={18} />;
  }

  if (status === "completed") {
    return <CheckCircle2 className="text-emerald-600" size={18} />;
  }

  if (status === "failed") {
    return <XCircle className="text-red-600" size={18} />;
  }

  return <Activity className="text-slate-400" size={18} />;
}

export function RunConsole() {
  const [task, setTask] = useState(defaultTask);
  const [events, setEvents] = useState<AgentRunEvent[]>([]);
  const [status, setStatus] = useState<RunStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const sourceRef = useRef<EventSource | null>(null);

  function resetRun() {
    sourceRef.current?.close();
    sourceRef.current = null;
    setEvents([]);
    setStatus("idle");
    setError(null);
  }

  function startRun() {
    sourceRef.current?.close();
    setEvents([]);
    setError(null);
    setStatus("running");

    const source = new EventSource(`/api/runs/stream?task=${encodeURIComponent(task)}`);
    sourceRef.current = source;

    source.addEventListener("run-event", (message) => {
      const event = JSON.parse(message.data) as AgentRunEvent;
      setEvents((currentEvents) => [...currentEvents, event]);
    });

    source.addEventListener("run-complete", () => {
      setStatus("completed");
      source.close();
      sourceRef.current = null;
    });

    source.addEventListener("run-error", (message) => {
      const payload = JSON.parse(message.data) as { message?: string };
      setError(payload.message ?? "Runtime failed.");
      setStatus("failed");
      source.close();
      sourceRef.current = null;
    });

    source.onerror = () => {
      setError("The runtime event stream was interrupted.");
      setStatus("failed");
      source.close();
      sourceRef.current = null;
    };
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[420px_1fr]">
      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-md bg-emerald-50 text-emerald-700">
            <Activity size={18} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Run Console</p>
            <h1 className="text-xl font-semibold text-slate-950">Submit task</h1>
          </div>
        </div>
        <textarea
          className="mt-6 min-h-40 w-full resize-none rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none ring-cyan-500 focus:ring-2"
          onChange={(event) => setTask(event.target.value)}
          value={task}
        />
        <div className="mt-4 flex gap-3">
          <button
            className="inline-flex h-10 items-center gap-2 rounded-md bg-slate-950 px-4 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
            disabled={status === "running"}
            onClick={startRun}
          >
            <Play size={16} />
            Start run
          </button>
          <button
            className="inline-flex h-10 items-center gap-2 rounded-md border border-slate-200 px-4 text-sm font-medium text-slate-700 hover:bg-slate-50"
            onClick={resetRun}
          >
            <RotateCcw size={16} />
            Reset
          </button>
        </div>
        {error ? (
          <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        ) : null}
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Runtime trace</p>
            <h2 className="text-lg font-semibold text-slate-950">Streaming Agent events</h2>
          </div>
          <div className="flex items-center gap-2">
            <RuntimeIcon status={status} />
            <StatusBadge tone={status === "completed" ? "success" : status === "failed" ? "danger" : "info"}>
              {status}
            </StatusBadge>
          </div>
        </div>

        {events.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
            <p className="text-sm font-medium text-slate-700">No runtime events yet</p>
            <p className="mt-2 text-sm text-slate-500">
              Start a run to stream planning, retrieval, Skill, and report events.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {events.map((event) => (
              <article className="rounded-md border border-slate-200 bg-slate-50 p-4" key={event.id}>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-slate-900">{event.title}</h3>
                    <StatusBadge tone={getStatusTone(event.status)}>{event.status}</StatusBadge>
                  </div>
                  <span className="text-xs font-medium text-slate-500">
                    {event.durationMs ? `${event.durationMs}ms` : "instant"}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-600">{event.description}</p>
                <pre className="mt-3 max-h-44 overflow-auto rounded-md border border-slate-200 bg-white p-3 text-xs leading-5 text-slate-600">
                  {JSON.stringify(event.payload, null, 2)}
                </pre>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
