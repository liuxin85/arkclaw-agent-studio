import { cn } from "@/lib/utils";

const tones = {
  danger: "border-red-200 bg-red-50 text-red-700",
  info: "border-cyan-200 bg-cyan-50 text-cyan-700",
  neutral: "border-slate-200 bg-white text-slate-600",
  success: "border-emerald-200 bg-emerald-50 text-emerald-700",
};

export function StatusBadge({
  children,
  tone = "neutral",
}: Readonly<{
  children: React.ReactNode;
  tone?: keyof typeof tones;
}>) {
  return (
    <span
      className={cn(
        "inline-flex h-6 items-center rounded-md border px-2 text-xs font-medium",
        tones[tone],
      )}
    >
      {children}
    </span>
  );
}
