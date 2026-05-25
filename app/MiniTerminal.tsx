import type { ReactNode } from "react";

type Props = {
  title?: string;
  children: ReactNode;
  /** Optional accent color for the title bar dot indicator */
  status?: "idle" | "running";
};

export default function MiniTerminal({
  title = "flux",
  children,
  status = "idle",
}: Props) {
  return (
    <div className="rounded-xl border border-white/10 bg-[#0e0e11] shadow-2xl shadow-black/40 overflow-hidden">
      {/* window chrome */}
      <div className="flex items-center gap-2 px-6 py-4 border-b border-white/5 bg-white/[0.02]">
        <span className="size-3.5 rounded-full bg-red-500/70" />
        <span className="size-3.5 rounded-full bg-yellow-500/70" />
        <span className="size-3.5 rounded-full bg-green-500/70" />
        <span className="flex-1 text-center text-[13px] font-mono text-zinc-500 truncate px-3">
          {title}
        </span>
        <span
          className={[
            "size-2.5 rounded-full",
            status === "running"
              ? "bg-[var(--accent-2)] shadow-[0_0_10px_var(--accent-2)]"
              : "bg-zinc-700",
          ].join(" ")}
        />
      </div>

      {/* body */}
      <div className="px-8 py-8 text-[15px] md:text-[16px] leading-[1.8] font-mono text-zinc-200 min-h-[320px]">
        {children}
      </div>
    </div>
  );
}
