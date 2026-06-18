import { Clock, History } from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { StatusBadge } from "@/components/status-badge";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

async function getRecentRuns() {
  try {
    return await prisma.agentRun.findMany({
      include: {
        _count: {
          select: {
            events: true,
          },
        },
        agent: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 10,
    });
  } catch {
    return [];
  }
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function getStatusTone(status: string) {
  if (status === "COMPLETED") {
    return "success";
  }

  if (status === "FAILED" || status === "CANCELED") {
    return "danger";
  }

  if (status === "RUNNING") {
    return "info";
  }

  return "neutral";
}

export default async function HistoryPage() {
  const runs = await getRecentRuns();

  return (
    <AppShell>
      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-md bg-slate-100 text-slate-700">
              <History size={18} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Run History</p>
              <h1 className="text-xl font-semibold text-slate-950">Persisted execution traces</h1>
            </div>
          </div>
          <Clock className="text-slate-400" size={20} />
        </div>
        {runs.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
            <p className="text-sm font-medium text-slate-700">No persisted runs yet</p>
            <p className="mt-2 text-sm text-slate-500">
              Start a run from the Run Console after the local database is running.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-200 rounded-lg border border-slate-200">
            {runs.map((run) => (
              <div
                className="grid gap-3 p-4 xl:grid-cols-[220px_1fr_120px_180px_auto]"
                key={run.id}
              >
                <p className="text-sm font-medium text-slate-700">{run.agent.name}</p>
                <div>
                  <p className="line-clamp-2 text-sm text-slate-700">{run.task}</p>
                  <p className="mt-1 font-mono text-xs text-slate-400">{run.id}</p>
                </div>
                <p className="text-sm text-slate-500">{run._count.events} events</p>
                <p className="text-sm text-slate-500">{formatDate(run.createdAt)}</p>
                <StatusBadge tone={getStatusTone(run.status)}>{run.status.toLowerCase()}</StatusBadge>
              </div>
            ))}
          </div>
        )}
      </section>
    </AppShell>
  );
}
