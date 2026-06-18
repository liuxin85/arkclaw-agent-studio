import Link from "next/link";
import { Activity, Boxes, Database, History, LayoutDashboard, Network } from "lucide-react";

const navItems = [
  { href: "/", label: "Overview", icon: LayoutDashboard },
  { href: "/agents", label: "Agent Builder", icon: Network },
  { href: "/runs", label: "Run Console", icon: Activity },
  { href: "/knowledge", label: "Knowledge Base", icon: Database },
  { href: "/skills", label: "Skills Center", icon: Boxes },
  { href: "/history", label: "Run History", icon: History },
];

export function AppShell({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-950">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 border-r border-slate-200 bg-white lg:block">
        <div className="flex h-16 items-center border-b border-slate-200 px-5">
          <div className="flex size-9 items-center justify-center rounded-md bg-slate-950 text-sm font-semibold text-white">
            AC
          </div>
          <div className="ml-3">
            <p className="text-sm font-semibold text-slate-950">ArkClaw</p>
            <p className="text-xs text-slate-500">Agent Studio</p>
          </div>
        </div>
        <nav className="space-y-1 p-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                className="flex h-10 items-center gap-3 rounded-md px-3 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                href={item.href}
                key={item.href}
              >
                <Icon size={17} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur">
          <div className="flex h-16 items-center justify-between px-4 lg:px-8">
            <div>
              <p className="text-sm font-medium text-slate-500">Workspace</p>
              <p className="text-sm font-semibold text-slate-950">Local development</p>
            </div>
            <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600">
              OpenAI-compatible ready
            </div>
          </div>
        </header>
        <main className="px-4 py-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
