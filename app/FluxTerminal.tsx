"use client";

import { useEffect, useRef, useState } from "react";

/* ──────────────────────────────────────────────────────────────────────────
 * scenario data
 * ────────────────────────────────────────────────────────────────────────── */

type DiffLine = { n: number; sign: "+" | "-" | " "; text: string };

type Item =
  | { kind: "thought"; at: number; text: string }
  | { kind: "tool"; at: number; name: string; arg: string; meta?: string }
  | {
      kind: "diff";
      at: number;
      file: string;
      verb: "create" | "edit";
      lines: DiffLine[];
      lineStartAt: number;
      lineStepMs: number;
      captionAt: number;
      caption: string;
    }
  | {
      kind: "command";
      at: number;
      cmd: string;
      outputAt: number;
      output: string;
      status?: "PASS" | "FAIL";
    };

type Scenario = {
  id: string;
  prompt: string;
  items: Item[];
  typeStart: number;
  typeEnd: number;
  submitAt: number;
  confirmAt: number;
  endAt: number;
  tokIn: number;
  tokOut: number;
};

const TYPE_CPS_MS = 50;

function makeScenario(s: Omit<Scenario, "typeEnd">): Scenario {
  return { ...s, typeEnd: s.typeStart + s.prompt.length * TYPE_CPS_MS };
}

const SCENARIOS: Scenario[] = [
  makeScenario({
    id: "font",
    prompt: "Change the font family of the website to a monospaced font",
    typeStart: 500,
    submitAt: 4000,
    confirmAt: 8700,
    endAt: 12500,
    tokIn: 4721,
    tokOut: 597,
    items: [
      {
        kind: "thought",
        at: 4400,
        text: "Reading the global CSS to see current font configuration",
      },
      {
        kind: "tool",
        at: 4900,
        name: "file_read",
        arg: "app/globals.css",
      },
      {
        kind: "thought",
        at: 5700,
        text: "Changing the font family to monospace in both --font-sans and body styles",
      },
      {
        kind: "diff",
        at: 6300,
        file: "app/globals.css",
        verb: "create",
        lineStartAt: 6500,
        lineStepMs: 130,
        captionAt: 8200,
        caption: "lines 1–10 of 54 (Tab / Shift+Tab to scroll)",
        lines: [
          { n: 1, sign: "+", text: `@import "tailwindcss";` },
          { n: 2, sign: "+", text: "" },
          { n: 3, sign: "+", text: `:root {` },
          { n: 4, sign: "+", text: `  --background: #0a0a0b;` },
          { n: 5, sign: "+", text: `  --foreground: #ededed;` },
          { n: 6, sign: "+", text: `  --accent-2: #22d3ee;` },
          { n: 7, sign: "+", text: `}` },
          { n: 8, sign: "+", text: "" },
          { n: 9, sign: "+", text: `@theme inline {` },
          { n: 10, sign: "+", text: `  --color-background: var(--background);` },
        ],
      },
    ],
  }),

  makeScenario({
    id: "refactor",
    prompt: "Refactor src/agent/runtime.go to extract the tool-calling loop",
    typeStart: 500,
    submitAt: 4000,
    confirmAt: 10800,
    endAt: 14500,
    tokIn: 6184,
    tokOut: 812,
    items: [
      {
        kind: "thought",
        at: 4400,
        text: "Locating the tool-calling loop in runtime.go",
      },
      {
        kind: "tool",
        at: 4850,
        name: "file_read",
        arg: "src/agent/runtime.go",
        meta: "218 lines",
      },
      {
        kind: "tool",
        at: 5400,
        name: "code_search",
        arg: `"for _, call := range toolCalls"`,
        meta: "3 matches",
      },
      {
        kind: "thought",
        at: 6100,
        text: "Extracting the loop into runToolLoop() and updating callsites",
      },
      {
        kind: "diff",
        at: 6700,
        file: "src/agent/runtime.go",
        verb: "edit",
        lineStartAt: 6900,
        lineStepMs: 150,
        captionAt: 8400,
        caption: "+62 −41 · 1 of 3 hunks",
        lines: [
          { n: 84, sign: " ", text: `func (r *Runtime) Run(ctx context.Context) error {` },
          { n: 85, sign: "-", text: `    for _, call := range r.toolCalls {` },
          { n: 86, sign: "-", text: `        out, err := r.exec.Run(ctx, call)` },
          { n: 87, sign: "-", text: `        if err != nil { return err }` },
          { n: 88, sign: "-", text: `        r.events.Push(out)` },
          { n: 89, sign: "-", text: `    }` },
          { n: 90, sign: "+", text: `    if err := r.runToolLoop(ctx); err != nil {` },
          { n: 91, sign: "+", text: `        return fmt.Errorf("tool loop: %w", err)` },
          { n: 92, sign: "+", text: `    }` },
          { n: 93, sign: " ", text: `    return nil` },
        ],
      },
      {
        kind: "command",
        at: 8800,
        cmd: "go test ./src/agent/...",
        outputAt: 9700,
        output:
          "ok  github.com/anirban1809/flux/src/agent  0.412s",
        status: "PASS",
      },
    ],
  }),

  makeScenario({
    id: "bug",
    prompt: "Investigate why /reset isn't clearing conversation history",
    typeStart: 500,
    submitAt: 4000,
    confirmAt: 9400,
    endAt: 13000,
    tokIn: 3902,
    tokOut: 1148,
    items: [
      {
        kind: "thought",
        at: 4400,
        text: "Spawning bug_investigator to trace the /reset command handler",
      },
      {
        kind: "tool",
        at: 4900,
        name: "subagent_bug_investigator",
        arg: `"/reset not clearing history"`,
        meta: "6 files · 1.4s",
      },
      {
        kind: "thought",
        at: 6300,
        text: "Found it — session.go:142 copies the slice header but mutates the local, leaving r.history untouched",
      },
      {
        kind: "diff",
        at: 7100,
        file: "src/workspace/session.go",
        verb: "edit",
        lineStartAt: 7300,
        lineStepMs: 160,
        captionAt: 8400,
        caption: "+3 −3 · 1 of 1 hunks",
        lines: [
          { n: 138, sign: " ", text: `func (r *Repo) Reset() {` },
          { n: 139, sign: " ", text: `    r.mu.Lock()` },
          { n: 140, sign: " ", text: `    defer r.mu.Unlock()` },
          { n: 141, sign: "-", text: `    h := r.history` },
          { n: 142, sign: "-", text: `    h = h[:0]` },
          { n: 143, sign: "-", text: `    r.touched = true` },
          { n: 144, sign: "+", text: `    r.history = r.history[:0]` },
          { n: 145, sign: "+", text: `    r.touched = true` },
          { n: 146, sign: "+", text: `    r.events.Emit(EventReset)` },
        ],
      },
    ],
  }),
];

const LOOP_MS = SCENARIOS.reduce((acc, s) => acc + s.endAt, 0);

/* ──────────────────────────────────────────────────────────────────────────
 * component
 * ────────────────────────────────────────────────────────────────────────── */

export default function FluxTerminal() {
  const [t, setT] = useState(0);
  const startRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setT(SCENARIOS[0].confirmAt + 200);
      return;
    }
    const tick = (now: number) => {
      if (startRef.current === null) startRef.current = now;
      setT((now - startRef.current) % LOOP_MS);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // figure out which scenario we're in
  let cursor = 0;
  let idx = 0;
  for (let i = 0; i < SCENARIOS.length; i++) {
    if (t < cursor + SCENARIOS[i].endAt) {
      idx = i;
      break;
    }
    cursor += SCENARIOS[i].endAt;
    idx = i;
  }
  const scenario = SCENARIOS[idx];
  const local = t - cursor;

  // cumulative token counters (carry over across scenarios within the loop)
  const prevTokIn = SCENARIOS.slice(0, idx).reduce((a, s) => a + s.tokIn, 0);
  const prevTokOut = SCENARIOS.slice(0, idx).reduce((a, s) => a + s.tokOut, 0);
  const progress = clamp01(
    (local - scenario.submitAt) / (scenario.confirmAt - scenario.submitAt)
  );
  const tokIn = prevTokIn + Math.floor(scenario.tokIn * progress);
  const tokOut = prevTokOut + Math.floor(scenario.tokOut * progress);
  const tokTotal = tokIn + tokOut;
  const cost = (tokTotal * 0.00000017).toFixed(4);
  const ctxPct = (tokTotal / 196608) * 100;

  // typed prompt
  const typedCount = Math.max(
    0,
    Math.min(
      scenario.prompt.length,
      Math.floor((local - scenario.typeStart) / TYPE_CPS_MS)
    )
  );
  const typedText = scenario.prompt.slice(0, typedCount);
  const submitted = local >= scenario.submitAt;
  const showConfirm = local >= scenario.confirmAt;
  const status = submitted ? "Running" : "Idle";

  return (
    <div className="rounded-xl border border-white/10 bg-[#0e0e11] shadow-2xl shadow-black/60 overflow-hidden">
      {/* window chrome */}
      <div className="flex items-center gap-2 px-6 py-4 border-b border-white/5 bg-white/[0.02]">
        <span className="size-3.5 rounded-full bg-red-500/70" />
        <span className="size-3.5 rounded-full bg-yellow-500/70" />
        <span className="size-3.5 rounded-full bg-green-500/70" />
        <span className="flex-1 text-center text-[13px] font-mono text-zinc-500">
          flux
        </span>
        <span className="size-3.5" />
      </div>

      {/* TUI body — content keyed by scenario so it cross-fades on transition */}
      <div className="px-10 md:px-14 py-10 md:py-12 text-[16px] md:text-[19px] leading-[1.85] font-mono text-zinc-200 min-h-[1100px] md:min-h-[1280px]">
        <div className="text-zinc-300">Flux 0.0.2</div>
        <div className="text-zinc-400 border-b border-white/5 pb-3">
          Press / for options
        </div>

        <div
          key={scenario.id}
          className="animate-[fadeIn_280ms_ease-out]"
        >
          {/* submitted prompt bubble */}
          {submitted && (
            <div className="mt-6 rounded-md bg-white/[0.04] border border-white/[0.06] px-5 py-3.5 flex items-center gap-3 animate-[fadeIn_240ms_ease-out]">
              <span className="text-zinc-400">●</span>
              <span className="text-zinc-100">{scenario.prompt}</span>
            </div>
          )}

          {/* items */}
          <div className="mt-6 space-y-3 min-h-[140px]">
            {scenario.items.map((item, i) => {
              if (local < item.at) return null;
              return (
                <ItemView
                  key={`${scenario.id}-${i}`}
                  item={item}
                  local={local}
                />
              );
            })}
          </div>

          {/* confirmation */}
          <div className="mt-8 min-h-[150px]">
            {showConfirm && (
              <div className="animate-[fadeIn_220ms_ease-out]">
                <div className="text-zinc-200">
                  Do you want to make this change?
                </div>
                <div className="mt-1">
                  <span className="text-emerald-400">› Yes</span>
                </div>
                <div className="text-zinc-400">&nbsp;&nbsp;No</div>
                <div className="text-zinc-500">
                  &nbsp;&nbsp;Further instructions…
                </div>
              </div>
            )}
          </div>

          {/* input — follows the output, sitting below whatever has streamed in */}
          <div className="mt-8 border-t border-white/5 pt-5 flex items-center gap-3">
            <span className="text-zinc-400">›</span>
            {!submitted ? (
              <>
                <span className="text-zinc-100 whitespace-pre">
                  {typedText}
                </span>
                <span className="caret">&nbsp;</span>
              </>
            ) : (
              <span className="caret">&nbsp;</span>
            )}
          </div>
        </div>
      </div>

      {/* status bar */}
      <div className="px-10 md:px-14 py-5 border-t border-white/5 bg-white/[0.015] text-[14px] md:text-[15px] font-mono">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div>
              <span
                className={
                  submitted ? "text-[var(--accent-2)]" : "text-zinc-400"
                }
              >
                {status}
              </span>
              <span className="text-zinc-500"> | </span>
              <span className="text-zinc-300">
                ~/Documents/Code/flux-website
              </span>{" "}
              <span className="text-zinc-500">(main)</span>
            </div>
            <div className="text-zinc-400">
              Model: minimax/minimax-m2.7{" "}
              <span className="text-zinc-500">(OpenRouter)</span>
            </div>
          </div>
          <div className="text-right tabular-nums">
            <div className="text-zinc-400">
              Tokens:{" "}
              <span className="text-zinc-200">
                {tokIn}↑ / {tokOut}↓
              </span>{" "}
              <span className="text-zinc-500">({tokTotal})</span>{" "}
              <span className="text-zinc-500">|</span>{" "}
              <span className="text-zinc-200">${cost}</span>
            </div>
            <div className="text-zinc-400">
              Context:{" "}
              <span className="text-zinc-200">{ctxPct.toFixed(2)}%</span>{" "}
              <span className="text-zinc-500">(of 196608)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
 * item renderer
 * ────────────────────────────────────────────────────────────────────────── */

function ItemView({ item, local }: { item: Item; local: number }) {
  if (item.kind === "thought") {
    return (
      <div className="flex gap-3 animate-[fadeIn_220ms_ease-out]">
        <span className="text-zinc-500">●</span>
        <span className="text-zinc-300">{item.text}</span>
      </div>
    );
  }

  if (item.kind === "tool") {
    return (
      <div className="pl-6 text-zinc-400 animate-[fadeIn_200ms_ease-out]">
        <span className="text-zinc-500">{item.name}:</span> {item.arg}
        {item.meta && (
          <span className="text-zinc-600"> · {item.meta}</span>
        )}
      </div>
    );
  }

  if (item.kind === "command") {
    const showOutput = local >= item.outputAt;
    return (
      <div className="animate-[fadeIn_200ms_ease-out]">
        <div className="text-zinc-300">
          <span className="text-[var(--accent-2)]">$</span>{" "}
          <span className="text-zinc-200">{item.cmd}</span>
        </div>
        {showOutput && (
          <div className="pl-5 mt-1 animate-[fadeIn_200ms_ease-out]">
            <span className="text-zinc-400">{item.output}</span>
            {item.status && (
              <span
                className={
                  item.status === "PASS"
                    ? "ml-3 text-emerald-400"
                    : "ml-3 text-red-400"
                }
              >
                {item.status}
              </span>
            )}
          </div>
        )}
      </div>
    );
  }

  // diff
  const linesShown = Math.max(
    0,
    Math.min(
      item.lines.length,
      Math.floor((local - item.lineStartAt) / item.lineStepMs)
    )
  );
  const showCaption = local >= item.captionAt;
  return (
    <div className="animate-[fadeIn_200ms_ease-out]">
      <div>
        <span
          className={
            item.verb === "create" ? "text-emerald-400" : "text-[var(--accent-2)]"
          }
        >
          {item.verb}
        </span>{" "}
        <span className="text-zinc-200">{item.file}</span>
      </div>
      <div className="mt-2 rounded-md bg-white/[0.02] border border-white/[0.06] overflow-hidden">
        {item.lines.slice(0, linesShown).map((row, i) => (
          <div
            key={i}
            className={[
              "grid grid-cols-[60px_22px_1fr] items-baseline px-2 py-0.5 animate-[slideIn_180ms_ease-out]",
              row.sign === "+"
                ? "bg-emerald-500/[0.06]"
                : row.sign === "-"
                ? "bg-red-500/[0.06]"
                : "",
            ].join(" ")}
          >
            <span className="text-right pr-4 text-zinc-600 select-none">
              {row.n}
            </span>
            <span
              className={[
                "select-none",
                row.sign === "+"
                  ? "text-emerald-400"
                  : row.sign === "-"
                  ? "text-red-400"
                  : "text-zinc-600",
              ].join(" ")}
            >
              {row.sign}
            </span>
            <span
              className={[
                "whitespace-pre",
                row.sign === "+"
                  ? "text-emerald-200/90"
                  : row.sign === "-"
                  ? "text-red-200/80"
                  : "text-zinc-400",
              ].join(" ")}
            >
              {row.text}
            </span>
          </div>
        ))}
        {linesShown < item.lines.length && (
          <div className="grid grid-cols-[60px_22px_1fr] items-baseline px-2 py-0.5">
            <span className="text-right pr-4 text-zinc-600 select-none">
              &nbsp;
            </span>
            <span className="text-emerald-400/60 select-none">+</span>
            <span className="text-emerald-200/40">
              <span className="caret" />
            </span>
          </div>
        )}
      </div>
      {showCaption && (
        <div className="mt-3 text-zinc-500 text-sm animate-[fadeIn_200ms_ease-out]">
          {item.caption}
        </div>
      )}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
 * helpers
 * ────────────────────────────────────────────────────────────────────────── */

function clamp01(v: number) {
  if (Number.isNaN(v)) return 0;
  if (v < 0) return 0;
  if (v > 1) return 1;
  return v;
}
