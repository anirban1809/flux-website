"use client";

import { useState } from "react";

const COMMAND = "curl -fsSL fluxagent.dev/install | sh";

type Props = {
  size?: "lg" | "md";
};

export default function InstallCommand({ size = "lg" }: Props) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(COMMAND);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* ignore */
    }
  };

  const isLg = size === "lg";

  return (
    <button
      type="button"
      onClick={copy}
      aria-label="Copy install command"
      className={[
        "group relative w-full text-left overflow-hidden",
        "rounded-xl border border-[var(--accent-2)]/40 bg-[#0e0e10]",
        "shadow-[0_0_0_1px_rgba(34,211,238,0.08),0_20px_60px_-20px_rgba(34,211,238,0.35)]",
        "hover:border-[var(--accent-2)]/70 transition",
        isLg ? "p-5 md:p-6" : "p-4",
      ].join(" ")}
    >
      {/* glow */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60 group-hover:opacity-100 transition"
        style={{
          background:
            "radial-gradient(ellipse 60% 80% at 0% 50%, rgba(34,211,238,0.10), transparent 60%), radial-gradient(ellipse 60% 80% at 100% 50%, rgba(34,211,238,0.06), transparent 60%)",
        }}
      />

      <div className="relative flex items-center gap-4">
        <span
          className={`font-mono text-[var(--accent-2)] ${
            isLg ? "text-base" : "text-sm"
          } shrink-0`}
        >
          $
        </span>
        <code
          className={`font-mono text-zinc-100 tracking-tight whitespace-nowrap overflow-x-auto ${
            isLg ? "text-base md:text-lg" : "text-sm"
          }`}
        >
          curl -fsSL{" "}
          <span className="text-[var(--accent-2)]">fluxagent.dev/install</span> | sh
        </code>

        <span
          className={[
            "ml-auto shrink-0 inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/5",
            "px-2.5 py-1 text-xs font-mono text-zinc-300",
            "group-hover:border-white/25 group-hover:bg-white/10 transition",
          ].join(" ")}
        >
          {copied ? (
            <>
              <svg
                width="12"
                height="12"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden
              >
                <path
                  d="M3 8.5L6.5 12L13 4.5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              copied
            </>
          ) : (
            <>
              <svg
                width="12"
                height="12"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden
              >
                <rect
                  x="5"
                  y="5"
                  width="8"
                  height="8"
                  rx="1.2"
                  stroke="currentColor"
                  strokeWidth="1.4"
                />
                <path
                  d="M3 11V4a1 1 0 0 1 1-1h7"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                />
              </svg>
              copy
            </>
          )}
        </span>
      </div>
    </button>
  );
}
