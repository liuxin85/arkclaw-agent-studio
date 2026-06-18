import { Boxes, Braces, Globe, ScrollText } from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { StatusBadge } from "@/components/status-badge";

const skills = [
  {
    name: "web.fetch",
    description: "Fetch a web page and return clean text for the Agent.",
    icon: Globe,
    status: "planned",
  },
  {
    name: "document.summarize",
    description: "Summarize uploaded knowledge documents into structured notes.",
    icon: ScrollText,
    status: "planned",
  },
  {
    name: "report.generate",
    description: "Convert execution evidence into a cited final report.",
    icon: Braces,
    status: "planned",
  },
];

export default function SkillsPage() {
  return (
    <AppShell>
      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-md bg-amber-50 text-amber-700">
            <Boxes size={18} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Skills Center</p>
            <h1 className="text-xl font-semibold text-slate-950">Pluggable tool protocol</h1>
          </div>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {skills.map((skill) => {
            const Icon = skill.icon;
            return (
              <article className="rounded-lg border border-slate-200 bg-slate-50 p-4" key={skill.name}>
                <div className="flex items-center justify-between">
                  <Icon className="text-slate-500" size={20} />
                  <StatusBadge tone="neutral">{skill.status}</StatusBadge>
                </div>
                <h2 className="mt-4 font-mono text-sm font-semibold text-slate-950">{skill.name}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">{skill.description}</p>
              </article>
            );
          })}
        </div>
      </section>
    </AppShell>
  );
}
