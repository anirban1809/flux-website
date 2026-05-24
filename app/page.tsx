import Link from "next/link";
import InstallCommand from "./InstallCommand";
import FluxTerminal from "./FluxTerminal";

const features = [
  {
    title: "Terminal-first",
    body: "A fast, keyboard-driven TUI built on tuix. No browser tab, no Electron — just your shell.",
    icon: "▌",
  },
  {
    title: "Multi-provider",
    body: "OpenRouter, OpenAI, and Anthropic out of the box. Switch models with a keystroke; bring your own keys.",
    icon: "⇄",
  },
  {
    title: "Tool calling",
    body: "Read, write, search, run shell — the assistant uses real tools against your workspace, in parallel when it can.",
    icon: "⚙",
  },
  {
    title: "Sub-agents",
    body: "Spawn focused workers like code_explorer and bug_investigator to keep the main context window clean.",
    icon: "❖",
  },
  {
    title: "Skills",
    body: "Reusable prompt templates with a resolver — invoke them from chat or wire them into your flow.",
    icon: "✺",
  },
  {
    title: "Headless mode",
    body: "Run flux non-interactively with --yolo for CI, scripts, and one-shot tasks. Same engine, no UI.",
    icon: "↳",
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
            href="https://github.com"
            className="font-mono text-xs px-3 py-1.5 rounded-md border border-white/10 hover:border-white/30 hover:bg-white/5 transition"
          >
            GitHub →
          </a>
        </div>
      </header>

      {/* HERO */}
      <section className="bg-grid">
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
      <section id="features" className="border-t border-white/5">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">
          <div className="max-w-2xl">
            <p className="font-mono text-xs text-[var(--accent-2)] uppercase tracking-wider">
              // features
            </p>
            <h2 className="mt-2 text-3xl md:text-4xl font-semibold tracking-tight">
              Built for people who live in a shell.
            </h2>
            <p className="mt-4 text-zinc-400">
              No tab-switching, no mouse, no Electron bloat. flux pairs a real
              TUI with a real tool-calling agent.
            </p>
          </div>

          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5 rounded-xl overflow-hidden border border-white/5">
            {features.map((f) => (
              <div
                key={f.title}
                className="bg-[#0a0a0b] p-6 hover:bg-white/[0.02] transition"
              >
                <div className="font-mono text-2xl text-[var(--accent-2)]">
                  {f.icon}
                </div>
                <h3 className="mt-4 font-semibold tracking-tight">{f.title}</h3>
                <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
                  {f.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INSTALL */}
      <section id="install" className="border-t border-white/5">
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
      <section id="models" className="border-t border-white/5">
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
      <section className="border-t border-white/5">
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
      <footer className="border-t border-white/5">
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
