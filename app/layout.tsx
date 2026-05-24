import type { Metadata } from "next";
import { Fira_Code } from "next/font/google";
import "./globals.css";

const firaCode = Fira_Code({
  variable: "--font-fira-code",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "flux — a terminal-native AI coding assistant",
  description:
    "flux is a fast, terminal-first AI coding assistant built in Go. Multi-provider (OpenRouter, OpenAI, Anthropic), tool-calling, sub-agents, skills, and a headless mode for CI.",
  openGraph: {
    title: "flux — a terminal-native AI coding assistant",
    description:
      "A fast, terminal-first AI coding assistant built in Go. Multi-provider, tool-calling, sub-agents, and headless mode.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${firaCode.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#0a0a0b] text-zinc-100">
        {children}
      </body>
    </html>
  );
}
