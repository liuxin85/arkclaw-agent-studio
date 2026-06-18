import { Activity, Boxes, Database, GitBranch, History, Sparkles } from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { MetricCard } from "@/components/metric-card";
import { StatusBadge } from "@/components/status-badge";

const runEvents = [
  {
    title: "Planning",
    description: "Research report Agent generated a 4-step execution plan.",
    status: "done",
    time: "12s",
  },
  {
    title: "Knowledge retrieval",
    description: "Matched 6 chunks from the market-notes knowledge base.",
    status: "done",
    time: "340ms",
  },
  {
    title: "Skill call",
    description: "Web page fetch Skill is ready for runtime integration.",
    status: "queued",
    time: "pending",
  },
];

const templates = [
  "Research report Agent",
  "Knowledge Q&A Agent",
  "Competitor analysis Agent",
];

export default function Home() {
  return (
    <AppShell>
      <div className="space-y-8">
        <section className="grid gap-4 lg:grid-cols-[1.4fr_0.8fr]">
          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-md bg-cyan-50 text-cyan-700">
                <Sparkles size={20} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">ArkClaw Agent Studio</p>
                <h1 className="mt-1 text-2xl font-semibold text-slate-950">
                  Visual Agent workflow platform
                </h1>
              </div>
            </div>
            <p className="mt-5 max-w-3xl text-sm leading-6 text-slate-600">
              Build, run, observe, and debug AI Agents with knowledge retrieval,
              pluggable Skills, execution traces, and streaming runtime events.
              The first milestone is a complete loop from task submission to
              observable Agent execution.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {templates.map((template) => (
                <div
                  className="rounded-md border border-slate-200 bg-slate-50 p-3 text-sm font-medium text-slate-700"
                  key={template}
                >
                  {template}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Current milestone</p>
                <h2 className="mt-1 text-lg font-semibold text-slate-950">
                  Product skeleton
                </h2>
              </div>
              <StatusBadge tone="info">In progress</StatusBadge>
            </div>
            <div className="mt-5 space-y-3 text-sm text-slate-600">
              <p>Navigation, base pages, data model, and environment contracts.</p>
              <p>Next step: stream fake Agent runtime events through SSE.</p>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard icon={GitBranch} label="Workflow nodes" value="6" />
          <MetricCard icon={Database} label="Knowledge bases" value="1" />
          <MetricCard icon={Boxes} label="Skills planned" value="4" />
          <MetricCard icon={Activity} label="Runtime events" value="SSE" />
        </section>

        <section className="grid gap-4 lg:grid-cols-[1fr_0.9fr]">
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Run console preview</p>
                <h2 className="mt-1 text-lg font-semibold text-slate-950">
                  Execution timeline
                </h2>
              </div>
              <History className="text-slate-400" size={20} />
            </div>
            <div className="space-y-3">
              {runEvents.map((event) => (
                <div
                  className="grid gap-3 rounded-md border border-slate-200 bg-slate-50 p-4 sm:grid-cols-[1fr_auto]"
                  key={event.title}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-slate-900">{event.title}</h3>
                      <StatusBadge tone={event.status === "done" ? "success" : "neutral"}>
                        {event.status}
                      </StatusBadge>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{event.description}</p>
                  </div>
                  <span className="text-sm font-medium text-slate-500">{event.time}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Tech stack locked</p>
            <h2 className="mt-1 text-lg font-semibold text-slate-950">
              TypeScript full-stack MVP
            </h2>
            <div className="mt-5 grid gap-2 text-sm text-slate-600">
              <p>Next.js App Router, React, Tailwind CSS, React Flow.</p>
              <p>PostgreSQL, Prisma, pgvector, OpenAI-compatible provider.</p>
              <p>SSE first for runtime streaming, BullMQ later for long jobs.</p>
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
