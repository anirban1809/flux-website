"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

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
    id: "pagination",
    prompt:
      "Add cursor-based pagination to the /api/messages endpoint and write tests for it",
    typeStart: 500,
    submitAt: 5200,
    confirmAt: 17500,
    endAt: 22000,
    tokIn: 9842,
    tokOut: 1463,
    items: [
      {
        kind: "thought",
        at: 5600,
        text: "Reading the handler and the DB layer to understand the existing limit-only contract",
      },
      {
        kind: "tool",
        at: 6100,
        name: "file_read",
        arg: "app/api/messages/route.ts",
        meta: "142 lines",
      },
      {
        kind: "tool",
        at: 6650,
        name: "file_read",
        arg: "lib/db/messages.ts",
        meta: "276 lines",
      },
      {
        kind: "tool",
        at: 7250,
        name: "code_search",
        arg: `"\\.findMany\\("`,
        meta: "11 matches across 4 files",
      },
      {
        kind: "thought",
        at: 8000,
        text: "Plan: add ?cursor=<id>, stable ordering by (createdAt desc, id desc), return nextCursor in the response. Need a findAfterCursor helper that fetches limit+1 to detect hasMore.",
      },
      {
        kind: "diff",
        at: 8800,
        file: "app/api/messages/route.ts",
        verb: "edit",
        lineStartAt: 9000,
        lineStepMs: 140,
        captionAt: 10700,
        caption: "+9 −2 · 1 of 1 hunks",
        lines: [
          { n: 18, sign: " ", text: `export async function GET(req: Request) {` },
          { n: 19, sign: " ", text: `  const url = new URL(req.url);` },
          { n: 20, sign: " ", text: `  const limit = Number(url.searchParams.get("limit") ?? 20);` },
          { n: 21, sign: "+", text: `  const cursor = url.searchParams.get("cursor") ?? undefined;` },
          { n: 22, sign: "-", text: `  const messages = await db.messages.findMany({ take: limit });` },
          { n: 23, sign: "+", text: `  const rows = await findAfterCursor({ limit: limit + 1, cursor });` },
          { n: 24, sign: "+", text: `  const hasMore = rows.length > limit;` },
          { n: 25, sign: "+", text: `  const messages = rows.slice(0, limit);` },
          { n: 26, sign: "+", text: `  const nextCursor = hasMore ? messages.at(-1)?.id ?? null : null;` },
          { n: 27, sign: "-", text: `  return Response.json({ messages });` },
          { n: 28, sign: "+", text: `  return Response.json({ messages, nextCursor });` },
          { n: 29, sign: " ", text: `}` },
        ],
      },
      {
        kind: "diff",
        at: 10800,
        file: "lib/db/messages.ts",
        verb: "edit",
        lineStartAt: 11000,
        lineStepMs: 140,
        captionAt: 12600,
        caption: "+11 −0 · 1 of 1 hunks",
        lines: [
          { n: 41, sign: " ", text: `export async function findMany(opts: { take: number }) {` },
          { n: 42, sign: " ", text: `  return prisma.message.findMany({ take: opts.take, orderBy: { createdAt: "desc" } });` },
          { n: 43, sign: " ", text: `}` },
          { n: 44, sign: "+", text: `` },
          { n: 45, sign: "+", text: `export async function findAfterCursor(opts: {` },
          { n: 46, sign: "+", text: `  limit: number;` },
          { n: 47, sign: "+", text: `  cursor?: string;` },
          { n: 48, sign: "+", text: `}) {` },
          { n: 49, sign: "+", text: `  return prisma.message.findMany({` },
          { n: 50, sign: "+", text: `    take: opts.limit,` },
          { n: 51, sign: "+", text: `    orderBy: [{ createdAt: "desc" }, { id: "desc" }],` },
          { n: 52, sign: "+", text: `    ...(opts.cursor ? { cursor: { id: opts.cursor }, skip: 1 } : {}),` },
          { n: 53, sign: "+", text: `  });` },
          { n: 54, sign: "+", text: `}` },
        ],
      },
      {
        kind: "diff",
        at: 12700,
        file: "app/api/messages/route.test.ts",
        verb: "create",
        lineStartAt: 12900,
        lineStepMs: 120,
        captionAt: 14400,
        caption: "lines 1–14 of 38 (Tab / Shift+Tab to scroll)",
        lines: [
          { n: 1, sign: "+", text: `import { describe, expect, it } from "vitest";` },
          { n: 2, sign: "+", text: `import { GET } from "./route";` },
          { n: 3, sign: "+", text: `import { seedMessages } from "@/test/factories";` },
          { n: 4, sign: "+", text: `` },
          { n: 5, sign: "+", text: `describe("GET /api/messages", () => {` },
          { n: 6, sign: "+", text: `  it("returns a page with nextCursor when more exist", async () => {` },
          { n: 7, sign: "+", text: `    await seedMessages(12);` },
          { n: 8, sign: "+", text: `    const res = await GET(req("?limit=5"));` },
          { n: 9, sign: "+", text: `    const body = await res.json();` },
          { n: 10, sign: "+", text: `    expect(body.messages).toHaveLength(5);` },
          { n: 11, sign: "+", text: `    expect(body.nextCursor).toBeTruthy();` },
          { n: 12, sign: "+", text: `  });` },
          { n: 13, sign: "+", text: `  it("walks the full list with cursors", async () => { /* ... */ });` },
          { n: 14, sign: "+", text: `  it("returns null cursor on last page", async () => { /* ... */ });` },
        ],
      },
      {
        kind: "command",
        at: 14600,
        cmd: "npx vitest run app/api/messages",
        outputAt: 15600,
        output:
          "Test Files  1 passed (1)  ·  Tests  3 passed (3)  ·  Duration 412ms",
        status: "PASS",
      },
    ],
  }),

  makeScenario({
    id: "webhooks",
    prompt:
      "Investigate why webhook deliveries are timing out in staging since yesterday's deploy",
    typeStart: 500,
    submitAt: 5500,
    confirmAt: 19800,
    endAt: 24000,
    tokIn: 12483,
    tokOut: 2071,
    items: [
      {
        kind: "thought",
        at: 5900,
        text: "Pulling the failed deliveries from staging logs to look for a pattern",
      },
      {
        kind: "tool",
        at: 6400,
        name: "bash",
        arg: `grep -c "delivery_failed" logs/staging-$(date -I).log`,
        meta: "exit 0 · stdout: 412",
      },
      {
        kind: "tool",
        at: 7100,
        name: "bash",
        arg: `grep "delivery_failed" logs/staging-$(date -I).log | head -20`,
        meta: "20 lines",
      },
      {
        kind: "tool",
        at: 8000,
        name: "subagent_bug_investigator",
        arg: `"webhook deliveries timing out after yesterday's deploy"`,
        meta: "14 files · 3.2s",
      },
      {
        kind: "thought",
        at: 9700,
        text: "Pattern: every failure is a POST to a customer URL with payload > 3MB, timing out at the hard-coded 10s. Yesterday's deploy enabled batch event delivery, which made payloads much larger.",
      },
      {
        kind: "tool",
        at: 10500,
        name: "file_read",
        arg: "src/webhooks/client.go",
        meta: "147 lines",
      },
      {
        kind: "tool",
        at: 11100,
        name: "code_search",
        arg: `"context.WithTimeout"`,
        meta: "6 matches",
      },
      {
        kind: "tool",
        at: 11700,
        name: "file_read",
        arg: "src/webhooks/config.go",
        meta: "62 lines",
      },
      {
        kind: "thought",
        at: 12400,
        text: "Two-part fix: (1) scale the per-request timeout with payload size, (2) set ContentLength explicitly so the receiving server doesn't fall back to chunked-with-keepalive which some of our customer endpoints handle poorly.",
      },
      {
        kind: "diff",
        at: 13200,
        file: "src/webhooks/client.go",
        verb: "edit",
        lineStartAt: 13400,
        lineStepMs: 130,
        captionAt: 15100,
        caption: "+12 −4 · 1 of 2 hunks",
        lines: [
          { n: 41, sign: " ", text: `func (c *Client) Deliver(ctx context.Context, e Event) error {` },
          { n: 42, sign: " ", text: `    payload, err := json.Marshal(e)` },
          { n: 43, sign: " ", text: `    if err != nil {` },
          { n: 44, sign: " ", text: `        return fmt.Errorf("marshal: %w", err)` },
          { n: 45, sign: " ", text: `    }` },
          { n: 46, sign: "-", text: `    ctx, cancel := context.WithTimeout(ctx, 10*time.Second)` },
          { n: 47, sign: "-", text: `    defer cancel()` },
          { n: 48, sign: "-", text: `    req, _ := http.NewRequestWithContext(ctx, "POST", e.URL, bytes.NewReader(payload))` },
          { n: 49, sign: "-", text: `    req.Header.Set("Content-Type", "application/json")` },
          { n: 50, sign: "+", text: `    timeout := c.cfg.BaseTimeout` },
          { n: 51, sign: "+", text: `    if mb := len(payload) >> 20; mb > 1 {` },
          { n: 52, sign: "+", text: `        timeout += time.Duration(mb) * c.cfg.TimeoutPerMB` },
          { n: 53, sign: "+", text: `    }` },
          { n: 54, sign: "+", text: `    ctx, cancel := context.WithTimeout(ctx, timeout)` },
          { n: 55, sign: "+", text: `    defer cancel()` },
          { n: 56, sign: "+", text: `    req, _ := http.NewRequestWithContext(ctx, "POST", e.URL, bytes.NewReader(payload))` },
          { n: 57, sign: "+", text: `    req.ContentLength = int64(len(payload))` },
          { n: 58, sign: "+", text: `    req.Header.Set("Content-Type", "application/json")` },
        ],
      },
      {
        kind: "diff",
        at: 15300,
        file: "src/webhooks/config.go",
        verb: "edit",
        lineStartAt: 15500,
        lineStepMs: 140,
        captionAt: 16700,
        caption: "+2 −0 · 1 of 1 hunks",
        lines: [
          { n: 18, sign: " ", text: `type Config struct {` },
          { n: 19, sign: " ", text: `    MaxRetries   int` },
          { n: 20, sign: " ", text: `    BaseTimeout  time.Duration` },
          { n: 21, sign: "+", text: `    TimeoutPerMB time.Duration // added per MB above 1MB payload` },
          { n: 22, sign: "+", text: `    MaxTimeout   time.Duration // hard ceiling, regardless of payload` },
          { n: 23, sign: " ", text: `}` },
        ],
      },
      {
        kind: "command",
        at: 16900,
        cmd: "go test -race ./src/webhooks/...",
        outputAt: 17900,
        output:
          "ok  github.com/anirban1809/flux/src/webhooks  1.882s  (8 tests, 1 new)",
        status: "PASS",
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
  const scrollRef = useRef<HTMLDivElement>(null);

  // Keep the scroll container pinned to the bottom as content streams in.
  // useLayoutEffect runs after every render but before paint, so we never
  // show a stale scroll position.
  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  });

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
      <div className="flex items-center gap-2 px-6 py-4 border-b border-white/5 bg-white/2">
        <span className="size-3.5 rounded-full bg-red-500/70" />
        <span className="size-3.5 rounded-full bg-yellow-500/70" />
        <span className="size-3.5 rounded-full bg-green-500/70" />
        <span className="flex-1 text-center text-[13px] font-mono text-zinc-500">
          flux
        </span>
        <span className="size-3.5" />
      </div>

      {/* TUI body — fixed height; the whole content area (header included)
          scrolls, input pins to the bottom, scrollbar hidden */}
      <div className="flex flex-col px-10 md:px-14 pt-8 md:pt-10 pb-6 md:pb-8 text-[16px] md:text-[19px] leading-[1.85] font-mono text-zinc-200 h-[620px] md:h-[760px]">
        <div
          key={scenario.id}
          className="flex flex-col flex-1 min-h-0 animate-[fadeIn_280ms_ease-out]"
        >
          {/* scrollable output region — header scrolls too */}
          <div
            ref={scrollRef}
            className="no-scrollbar flex-1 min-h-0 overflow-y-auto scroll-smooth"
          >
            <div className="text-zinc-300">Flux 0.0.3</div>
            <div className="text-zinc-400 border-b border-white/5 pb-3">
              Press / for options
            </div>

            {/* submitted prompt bubble */}
            {submitted && (
              <div className="mt-4 rounded-md bg-white/4 border border-white/6 px-5 py-3.5 flex items-center gap-3 animate-[fadeIn_240ms_ease-out]">
                <span className="text-zinc-400">●</span>
                <span className="text-zinc-100">{scenario.prompt}</span>
              </div>
            )}

            {/* items */}
            <div className="mt-6 space-y-3">
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
            {showConfirm && (
              <div className="mt-8 animate-[fadeIn_220ms_ease-out]">
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

          {/* input — pinned to the bottom of the body, above the status bar */}
          <div className="mt-4 border-t border-white/5 pt-4 flex items-center gap-3 shrink-0">
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
      <div className="px-10 md:px-14 py-5 border-t border-white/5 bg-white/1.5 text-[14px] md:text-[15px] font-mono">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div>
              <span
                className={
                  submitted ? "text-accent-2" : "text-zinc-400"
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
          <span className="text-accent-2">$</span>{" "}
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
            item.verb === "create" ? "text-emerald-400" : "text-accent-2"
          }
        >
          {item.verb}
        </span>{" "}
        <span className="text-zinc-200">{item.file}</span>
      </div>
      <div className="mt-2 rounded-md bg-white/2 border border-white/6 overflow-hidden">
        {item.lines.slice(0, linesShown).map((row, i) => (
          <div
            key={i}
            className={[
              "grid grid-cols-[60px_22px_1fr] items-baseline px-2 py-0.5 animate-[slideIn_180ms_ease-out]",
              row.sign === "+"
                ? "bg-emerald-500/6"
                : row.sign === "-"
                ? "bg-red-500/6"
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
