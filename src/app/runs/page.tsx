import { Activity, Play, RotateCcw } from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { StatusBadge } from "@/components/status-badge";

const events = [
  ["queued", "Run created", "The user task has been accepted by the runtime."],
  ["running", "Planning", "The Agent is preparing a structured execution plan."],
  ["pending", "Knowledge retrieval", "Retrieval will attach source chunks to the run trace."],
  ["pending", "Skill call", "Skills will expose input, output, latency, and error states."],
  ["pending", "Final report", "The final answer will persist with the full trace."],
] as const;

export default function RunsPage() {
  return (
    <AppShell>
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
            defaultValue="Analyze the uploaded market notes and generate a competitor analysis report with risks, opportunities, and cited evidence."
          />
          <div className="mt-4 flex gap-3">
            <button className="inline-flex h-10 items-center gap-2 rounded-md bg-slate-950 px-4 text-sm font-medium text-white hover:bg-slate-800">
              <Play size={16} />
              Start run
            </button>
            <button className="inline-flex h-10 items-center gap-2 rounded-md border border-slate-200 px-4 text-sm font-medium text-slate-700 hover:bg-slate-50">
              <RotateCcw size={16} />
              Reset
            </button>
          </div>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Runtime trace</p>
              <h2 className="text-lg font-semibold text-slate-950">Streaming events placeholder</h2>
            </div>
            <StatusBadge tone="info">SSE next</StatusBadge>
          </div>
          <div className="space-y-3">
            {events.map(([status, title, description]) => (
              <div className="rounded-md border border-slate-200 bg-slate-50 p-4" key={title}>
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
                  <StatusBadge tone={status === "running" ? "info" : "neutral"}>{status}</StatusBadge>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
