import { Bot, GitBranch, Save } from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { StatusBadge } from "@/components/status-badge";
import { WorkflowPreview } from "@/components/workflow-preview";

export default function AgentsPage() {
  return (
    <AppShell>
      <div className="grid gap-5 xl:grid-cols-[360px_1fr]">
        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-md bg-cyan-50 text-cyan-700">
              <Bot size={18} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Agent Builder</p>
              <h1 className="text-xl font-semibold text-slate-950">Research Agent</h1>
            </div>
          </div>

          <div className="mt-6 space-y-5">
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Model provider</span>
              <div className="mt-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
                OpenAI-compatible
              </div>
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">System prompt</span>
              <textarea
                className="mt-2 min-h-32 w-full resize-none rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none ring-cyan-500 focus:ring-2"
                defaultValue="You are a research Agent. Plan the task, retrieve relevant knowledge, call available Skills, and generate a structured report with citations."
              />
            </label>
            <div>
              <span className="text-sm font-medium text-slate-700">Enabled modules</span>
              <div className="mt-2 flex flex-wrap gap-2">
                <StatusBadge tone="info">Knowledge retrieval</StatusBadge>
                <StatusBadge tone="info">Web fetch Skill</StatusBadge>
                <StatusBadge tone="neutral">Report generator</StatusBadge>
              </div>
            </div>
            <button className="inline-flex h-10 items-center gap-2 rounded-md bg-slate-950 px-4 text-sm font-medium text-white hover:bg-slate-800">
              <Save size={16} />
              Save agent
            </button>
          </div>
        </section>

        <section className="min-h-[640px] rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <div>
              <p className="text-sm font-medium text-slate-500">Workflow template</p>
              <h2 className="text-lg font-semibold text-slate-950">Plan, retrieve, call, report</h2>
            </div>
            <GitBranch className="text-slate-400" size={20} />
          </div>
          <div className="h-[570px]">
            <WorkflowPreview />
          </div>
        </section>
      </div>
    </AppShell>
  );
}
