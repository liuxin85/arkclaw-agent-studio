import { Database, FileText, Search } from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { StatusBadge } from "@/components/status-badge";

const chunks = [
  "Market demand is shifting toward workflow-based Agent products.",
  "Users need observability for planning, retrieval, tool calls, and failures.",
  "A frontend-led platform can differentiate through debugging experience.",
];

export default function KnowledgePage() {
  return (
    <AppShell>
      <div className="grid gap-5 xl:grid-cols-[380px_1fr]">
        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-md bg-violet-50 text-violet-700">
              <Database size={18} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Knowledge Base</p>
              <h1 className="text-xl font-semibold text-slate-950">Upload sources</h1>
            </div>
          </div>
          <div className="mt-6 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
            <FileText className="mx-auto text-slate-400" size={28} />
            <p className="mt-3 text-sm font-medium text-slate-700">Markdown and TXT first</p>
            <p className="mt-1 text-sm text-slate-500">PDF ingestion is a phase 2 feature.</p>
          </div>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Retrieval test</p>
              <h2 className="text-lg font-semibold text-slate-950">Explainable matched chunks</h2>
            </div>
            <Search className="text-slate-400" size={20} />
          </div>
          <div className="space-y-3">
            {chunks.map((chunk, index) => (
              <div className="rounded-md border border-slate-200 bg-slate-50 p-4" key={chunk}>
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-900">Chunk {index + 1}</h3>
                  <StatusBadge tone="success">score 0.{91 - index * 6}</StatusBadge>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-600">{chunk}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
