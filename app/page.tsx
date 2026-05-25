import Link from "next/link";
import type { ReactNode } from "react";
import InstallCommand from "./InstallCommand";
import FluxTerminal from "./FluxTerminal";
import MiniTerminal from "./MiniTerminal";

type Feature = {
  tag: string;
  title: string;
  body: string;
  terminalTitle: string;
  status?: "idle" | "running";
  terminal: ReactNode;
};

const features: Feature[] = [
  {
    tag: "tui",
    title: "Terminal-first",
    body: "A keyboard-driven TUI built on tuix. No browser, no Electron, no mouse — every interaction is a keystroke. Slash commands, model switcher, file diffs, and a live status bar all live in your shell.",
    terminalTitle: "~/projects/api — flux",
    status: "idle",
    terminal: (
      <div>
        <div className="text-zinc-300">Flux 0.0.3</div>
        <div className="text-zinc-400">Press / for options</div>
        <div className="mt-3 border-t border-white/5 pt-3 flex items-center gap-2">
          <span className="text-zinc-400">›</span>
          <span className="text-zinc-100">implement /api/auth/logout</span>
          <span className="caret">&nbsp;</span>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-x-4 text-[11px]">
          <div className="text-zinc-500">
            <span className="text-[var(--accent-2)]">↑↓</span> navigate
          </div>
          <div className="text-zinc-500">
            <span className="text-[var(--accent-2)]">⏎</span> submit
          </div>
          <div className="text-zinc-500">
            <span className="text-[var(--accent-2)]">/</span> commands
          </div>
          <div className="text-zinc-500">
            <span className="text-[var(--accent-2)]">esc</span> cancel
          </div>
        </div>
        <div className="mt-5 text-[12px] text-zinc-500">
          Idle | ~/projects/api{" "}
          <span className="text-zinc-600">(main)</span>
        </div>
        <div className="text-[12px] text-zinc-500">
          Model: anthropic/claude-sonnet-4.6
        </div>
      </div>
    ),
  },
  {
    tag: "providers",
    title: "Multi-provider, your keys",
    body: "OpenRouter, OpenAI, and Anthropic out of the box, plus every model your providers expose. Switch on the fly with the model picker, or wire keys into ~/.flux/credentials.toml and forget about it.",
    terminalTitle: "model picker",
    status: "running",
    terminal: (
      <div>
        <div className="text-zinc-400">Select model:</div>
        <div className="mt-2 space-y-0.5">
          <div className="text-zinc-500">&nbsp;&nbsp;openai/gpt-5.5</div>
          <div className="flex items-center gap-2">
            <span className="text-[var(--accent-2)]">›</span>
            <span className="text-zinc-100">
              anthropic/claude-sonnet-4.6
            </span>
            <span className="ml-auto text-[11px] text-zinc-500">
              200k · $3/M
            </span>
          </div>
          <div className="text-zinc-500">
            &nbsp;&nbsp;anthropic/claude-haiku-4.5
          </div>
          <div className="text-zinc-500">
            &nbsp;&nbsp;minimax/minimax-m2.7
          </div>
          <div className="text-zinc-500">
            &nbsp;&nbsp;deepseek/deepseek-v3.2
          </div>
          <div className="text-zinc-500">
            &nbsp;&nbsp;qwen/qwen3-coder-flash
          </div>
        </div>
        <div className="mt-4 text-[11px] text-zinc-500 border-t border-white/5 pt-3">
          <span className="text-[var(--accent-2)]">↑↓</span> navigate ·{" "}
          <span className="text-[var(--accent-2)]">⏎</span> select ·{" "}
          <span className="text-[var(--accent-2)]">esc</span> cancel
        </div>
      </div>
    ),
  },
  {
    tag: "tools",
    title: "Real tools, in parallel",
    body: "file_read, file_write, code_search, bash, file_search — flux uses real tools against your workspace, and runs independent calls in parallel when it's safe. No make-believe filesystem, no sandboxed snapshots.",
    terminalTitle: "tool execution",
    status: "running",
    terminal: (
      <div>
        <div className="flex gap-2">
          <span className="text-zinc-500">●</span>
          <span className="text-zinc-300">
            Mapping the request lifecycle for /api/auth/logout
          </span>
        </div>
        <div className="mt-3 space-y-1 text-[12.5px]">
          <div className="pl-5 text-zinc-400">
            <span className="text-zinc-500">file_read:</span>{" "}
            src/auth/session.go{" "}
            <span className="text-zinc-600">· 216 lines</span>
          </div>
          <div className="pl-5 text-zinc-400">
            <span className="text-zinc-500">file_read:</span>{" "}
            src/auth/middleware.go{" "}
            <span className="text-zinc-600">· 89 lines</span>
          </div>
          <div className="pl-5 text-zinc-400">
            <span className="text-zinc-500">code_search:</span>{" "}
            <span className="text-zinc-200">{`"validateSession("`}</span>{" "}
            <span className="text-zinc-600">· 6 matches</span>
          </div>
          <div className="pl-5 text-zinc-400">
            <span className="text-zinc-500">bash:</span>{" "}
            <span className="text-zinc-200">go vet ./src/auth/...</span>{" "}
            <span className="text-emerald-400">PASS</span>
          </div>
        </div>
        <div className="mt-4 text-[11px] text-zinc-500 border-t border-white/5 pt-3">
          4 tools · 1.2s · ran in parallel
        </div>
      </div>
    ),
  },
  {
    tag: "subagents",
    title: "Sub-agents for focus",
    body: "Spawn code_explorer to survey a codebase, or bug_investigator to chase a regression — each runs in its own fresh context window and returns a structured report, so the main agent stays clean.",
    terminalTitle: "subagent · code_explorer",
    status: "running",
    terminal: (
      <div>
        <div className="flex gap-2">
          <span className="text-zinc-500">●</span>
          <span className="text-zinc-300">
            Spawning{" "}
            <span className="text-[var(--accent-2)]">
              subagent_code_explorer
            </span>
          </span>
        </div>
        <div className="pl-5 mt-1 text-zinc-400 text-[12.5px]">
          task:{" "}
          <span className="text-zinc-200">
            {`"map the request lifecycle for /api/messages"`}
          </span>
        </div>
        <div className="mt-3 space-y-1 text-[12.5px] text-zinc-400">
          <div>
            <span className="text-[var(--accent-2)]">◐</span> exploring{" "}
            src/handlers/
          </div>
          <div>
            <span className="text-[var(--accent-2)]">◑</span> exploring{" "}
            src/middleware/
          </div>
          <div>
            <span className="text-[var(--accent-2)]">●</span> mapping{" "}
            handlers → middleware → db
          </div>
        </div>
        <div className="mt-3 text-[12.5px] text-zinc-300">
          → returned:{" "}
          <span className="text-zinc-200">
            11 files, 4 layers, report.md
          </span>
        </div>
        <div className="mt-4 text-[11px] text-zinc-500 border-t border-white/5 pt-3">
          subagent · 3.4s · 4,182 tokens
        </div>
      </div>
    ),
  },
  {
    tag: "skills",
    title: "Reusable skills",
    body: "Skills are parameterised prompt templates registered as slash commands. /review, /init, /security-review — drop a markdown file in ~/.flux/skills/ and it's invokable everywhere, by the agent or by you.",
    terminalTitle: "skill · code-review",
    status: "running",
    terminal: (
      <div>
        <div className="flex items-center gap-2">
          <span className="text-zinc-400">›</span>
          <span className="text-zinc-100">/review</span>
        </div>
        <div className="mt-3 flex gap-2">
          <span className="text-zinc-500">●</span>
          <span className="text-zinc-300">
            Invoking skill:{" "}
            <span className="text-[var(--accent-2)]">code-review</span>
          </span>
        </div>
        <div className="pl-5 mt-2 space-y-0.5 text-[12.5px] text-zinc-400">
          <div>→ reading 3 changed files</div>
          <div>→ running golangci-lint</div>
          <div>→ composing structured review</div>
        </div>
        <div className="mt-3 space-y-0.5 text-[12.5px]">
          <div>
            <span className="text-emerald-400">✓</span>{" "}
            <span className="text-zinc-300">no blocking issues</span>
          </div>
          <div>
            <span className="text-emerald-400">✓</span>{" "}
            <span className="text-zinc-300">2 nitpicks (see below)</span>
          </div>
          <div>
            <span className="text-yellow-400">⚠</span>{" "}
            <span className="text-zinc-300">
              coverage on session.go dropped 4%
            </span>
          </div>
        </div>
        <div className="mt-4 text-[11px] text-zinc-500 border-t border-white/5 pt-3">
          skill: code-review · 2.1s
        </div>
      </div>
    ),
  },
  {
    tag: "headless",
    title: "Headless, for CI",
    body: "Same engine, no UI. Run flux --yolo --max-turns N \"do the thing\" in a workflow step and let it operate non-interactively. Perfect for nightly bump-deps, doc-sync, or anything else you'd otherwise hand-script.",
    terminalTitle: "ci · flux --yolo",
    status: "running",
    terminal: (
      <div>
        <div className="text-zinc-300 whitespace-pre-wrap">
          <span className="text-[var(--accent-2)]">$</span> flux --yolo
          --model anthropic/claude-sonnet-4.6 \
          {"\n"}
          {"  "}--max-turns 8{" "}
          <span className="text-zinc-200">
            {`"bump dep versions and run tests"`}
          </span>
        </div>
        <div className="mt-3 flex gap-2">
          <span className="text-zinc-500">●</span>
          <span className="text-zinc-300">
            Reading package.json and lockfile
          </span>
        </div>
        <div className="pl-5 mt-2 space-y-1 text-[12.5px] text-zinc-400">
          <div>
            <span className="text-zinc-500">file_write:</span> package.json{" "}
            <span className="text-emerald-400">+5 −5</span>
          </div>
          <div>
            <span className="text-zinc-500">bash:</span>{" "}
            <span className="text-zinc-200">npm install</span>{" "}
            <span className="text-zinc-600">· 204 packages updated</span>
          </div>
          <div>
            <span className="text-zinc-500">bash:</span>{" "}
            <span className="text-zinc-200">npm test</span>{" "}
            <span className="text-emerald-400">· 172 passed</span>
          </div>
        </div>
        <div className="mt-4 text-[11px] text-zinc-500 border-t border-white/5 pt-3">
          <span className="text-emerald-400">✓</span> Done in 47s ·{" "}
          12,408 tokens · $0.03
        </div>
      </div>
    ),
  },
];

const models = [
  "openai/gpt-5.2",
  "openai/gpt-5.5",
  "anthropic/claude-sonnet-4.6",
  "anthropic/claude-haiku-4.5",
  "minimax/minimax-m2.5",
  "minimax/minimax-m2.7",
  "deepseek/deepseek-v3.2",
  "qwen/qwen3-coder-flash",
  "meta-llama/llama-3.3-70b-instruct",
];

export default function Home() {
  return (
    <main className="flex-1">
      {/* NAV */}
      <header className="sticky top-0 z-20 backdrop-blur bg-[#0a0a0b]/70 border-b border-white/5">
        <div className="mx-auto max-w-6xl px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-mono text-sm">
            <span className="inline-block size-2 rounded-full bg-[var(--accent-2)] shadow-[0_0_12px_var(--accent-2)]" />
            <span className="font-semibold tracking-tight">flux</span>
          </Link>
          <nav className="hidden md:flex items-center gap-7 text-sm text-zinc-400">
            <a href="#features" className="hover:text-white transition">Features</a>
            <a href="#install" className="hover:text-white transition">Install</a>
            <a href="#models" className="hover:text-white transition">Models</a>
            <a href="#architecture" className="hover:text-white transition">Architecture</a>
          </nav>
          <a
            href="https://github.com/anirban1809/flux"
            className="font-mono text-xs px-3 py-1.5 rounded-md border border-white/10 hover:border-white/30 hover:bg-white/5 transition"
          >
            GitHub →
          </a>
        </div>
      </header>

      {/* HERO */}
      <section className="bg-grid snap-start">
        <div className="mx-auto max-w-6xl px-6 pt-24 md:pt-32">
          <div className="fade-up flex flex-col items-center text-center">
            <h1 className="mt-6 text-5xl md:text-6xl font-semibold tracking-tight leading-[1.05] max-w-4xl">
              The best coding agent,{" "}
              <span className="text-[var(--accent-2)]">for you</span>
              <span className="text-[var(--accent-2)]">.</span>
            </h1>
            <p className="mt-6 text-lg text-zinc-400 max-w-2xl">
              Minimal by design, extensible by default. One small binary, zero
              ceremony — bring your own model, drop in your own tools and
              skills, and get to work in seconds.
            </p>

            <div className="mt-10 w-full max-w-xl">
              <InstallCommand size="lg" />
              <div className="mt-3 flex items-center justify-between text-xs font-mono text-zinc-500">
                <span>macOS · Linux · click to copy</span>
                <a href="#install" className="hover:text-zinc-300 transition">
                  other install options →
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Terminal mock — escapes the max-w-6xl content column */}
        <div className="px-4 md:px-8 pt-16 pb-20 md:pb-28">
          <div
            className="fade-up mx-auto w-full text-left"
            style={{
              animationDelay: "120ms",
              maxWidth: "min(96vw, 1800px)",
            }}
          >
            <FluxTerminal />
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="border-t border-white/5 snap-start">
        <div className="py-28 md:py-40 px-10">
          {/* header — modest left padding only on mobile so it isn't edge-flush */}
          <div className="px-6 lg:px-0 lg:ml-[6vw] max-w-3xl">
            <p className="font-mono text-sm text-[var(--accent-2)] uppercase tracking-wider">
              // features
            </p>
            <h2 className="mt-3 text-4xl md:text-6xl font-semibold tracking-tight leading-[1.05]">
              Built for people who live in a shell.
            </h2>
            <p className="mt-6 text-lg md:text-xl text-zinc-400">
              No tab-switching, no mouse, no Electron bloat. flux pairs a real
              TUI with a real tool-calling agent.
            </p>
          </div>

          <div className="mt-24 md:mt-32 space-y-28 md:space-y-40">
            {features.map((f, i) => {
              const reverse = i % 2 === 1;
              return (
                <div
                  key={f.title}
                  className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center px-6 lg:px-0"
                >
                  <div className={reverse ? "lg:order-2" : "lg:order-1"}>
                    <MiniTerminal title={f.terminalTitle} status={f.status}>
                      {f.terminal}
                    </MiniTerminal>
                  </div>
                  <div
                    className={[
                      "max-w-xl",
                      reverse
                        ? "lg:order-1 lg:justify-self-end lg:pr-[6vw]"
                        : "lg:order-2 lg:justify-self-start lg:pl-[2vw]",
                    ].join(" ")}
                  >
                    <p className="font-mono text-sm text-[var(--accent-2)] uppercase tracking-wider">
                      // {f.tag}
                    </p>
                    <h3 className="mt-3 text-3xl md:text-5xl font-semibold tracking-tight leading-[1.1]">
                      {f.title}
                    </h3>
                    <p className="mt-5 text-lg md:text-xl text-zinc-400 leading-relaxed">
                      {f.body}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* INSTALL */}
      <section id="install" className="border-t border-white/5 snap-start">
        <div className="mx-auto max-w-4xl px-6 py-20 md:py-28 text-center">
          <p className="font-mono text-xs text-[var(--accent-2)] uppercase tracking-wider">
            // install
          </p>
          <h2 className="mt-2 text-3xl md:text-5xl font-semibold tracking-tight">
            One line. No build step.
          </h2>
          <p className="mt-4 text-zinc-400 max-w-2xl mx-auto">
            The installer detects your OS and arch, drops a signed{" "}
            <code className="font-mono text-zinc-200 bg-white/5 px-1.5 py-0.5 rounded">
              flux
            </code>{" "}
            binary on your <code className="font-mono">PATH</code>, and you&apos;re ready to go.
          </p>

          <div className="mt-10 max-w-2xl mx-auto">
            <InstallCommand size="lg" />
            <div className="mt-3 flex items-center justify-between text-xs font-mono text-zinc-500">
              <span>macOS · Linux · click to copy</span>
              <a
                href="https://fluxagent.dev/install"
                className="hover:text-zinc-300 transition underline decoration-white/15"
              >
                inspect the script →
              </a>
            </div>
          </div>

          <ol className="mt-14 grid sm:grid-cols-3 gap-4 text-left">
            {[
              {
                n: "01",
                title: "Install",
                body: (
                  <>
                    Pipe the installer to <code className="font-mono">sh</code>.
                    Single static binary, no toolchain needed.
                  </>
                ),
              },
              {
                n: "02",
                title: "Add a key",
                body: (
                  <>
                    Export{" "}
                    <code className="font-mono">OPENROUTER_API_KEY</code>,{" "}
                    <code className="font-mono">OPENAI_API_KEY</code>, or{" "}
                    <code className="font-mono">ANTHROPIC_API_KEY</code>.
                  </>
                ),
              },
              {
                n: "03",
                title: "Run it",
                body: (
                  <>
                    <code className="font-mono">flux</code> from any project, or{" "}
                    <code className="font-mono">flux --yolo</code> for headless
                    runs.
                  </>
                ),
              },
            ].map((step) => (
              <li
                key={step.n}
                className="rounded-lg border border-white/10 bg-white/[0.02] p-5"
              >
                <div className="font-mono text-xs text-[var(--accent-2)]">
                  {step.n}
                </div>
                <div className="mt-2 font-semibold tracking-tight">
                  {step.title}
                </div>
                <p className="mt-1.5 text-sm text-zinc-400 leading-relaxed">
                  {step.body}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* MODELS */}
      <section id="models" className="border-t border-white/5 snap-start">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">
          <div className="flex items-end justify-between flex-wrap gap-4">
            <div className="max-w-2xl">
              <p className="font-mono text-xs text-[var(--accent-2)] uppercase tracking-wider">
                // models
              </p>
              <h2 className="mt-2 text-3xl md:text-4xl font-semibold tracking-tight">
                Pick any model. Swap on the fly.
              </h2>
              <p className="mt-4 text-zinc-400">
                flux ships with a provider registry and a model switcher in the
                UI. Defaults to <code className="font-mono">minimax/minimax-m2.5</code>.
              </p>
            </div>
            <span className="font-mono text-xs text-zinc-500">
              + every model your provider exposes
            </span>
          </div>

          <div className="mt-10 flex flex-wrap gap-2">
            {models.map((m) => (
              <span
                key={m}
                className="font-mono text-xs px-3 py-1.5 rounded-md border border-white/10 bg-white/[0.03] text-zinc-300 hover:border-white/25 transition"
              >
                {m}
              </span>
            ))}
          </div>
        </div>
      </section>

      

      {/* CTA */}
      <section className="border-t border-white/5 snap-start">
        <div className="mx-auto max-w-4xl px-6 py-24 text-center">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
            Stop tab-switching.
            <br />
            <span className="text-[var(--accent-2)]">
              Start shipping from the shell.
            </span>
          </h2>
          <div className="mt-10 max-w-2xl mx-auto">
            <InstallCommand size="lg" />
          </div>
          <div className="mt-4 text-xs font-mono text-zinc-500">
            or{" "}
            <a
              href="https://github.com"
              className="underline decoration-white/20 hover:text-zinc-300"
            >
              star on GitHub
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/5 snap-start">
        <div className="mx-auto max-w-6xl px-6 py-8 flex items-center justify-between flex-wrap gap-4 text-xs text-zinc-500 font-mono">
          <div className="flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-[var(--accent-2)]" />
            flux · built in Go · MIT
          </div>
          <div className="flex items-center gap-5">
            <a href="#" className="hover:text-white transition">docs</a>
            <a href="#" className="hover:text-white transition">changelog</a>
            <a href="#" className="hover:text-white transition">github</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
