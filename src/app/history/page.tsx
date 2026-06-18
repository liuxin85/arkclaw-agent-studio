import { Clock, History } from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { StatusBadge } from "@/components/status-badge";

const runs = [
  ["Research report Agent", "Competitor analysis report", "completed"],
  ["Knowledge Q&A Agent", "Explain Agent runtime design", "draft"],
  ["Research report Agent", "Summarize market notes", "failed"],
];

export default function HistoryPage() {
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
        <div className="divide-y divide-slate-200 rounded-lg border border-slate-200">
          {runs.map(([agent, title, status]) => (
            <div className="grid gap-2 p-4 sm:grid-cols-[220px_1fr_auto]" key={`${agent}-${title}`}>
              <p className="text-sm font-medium text-slate-700">{agent}</p>
              <p className="text-sm text-slate-600">{title}</p>
              <StatusBadge tone={status === "completed" ? "success" : status === "failed" ? "danger" : "neutral"}>
                {status}
              </StatusBadge>
            </div>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
