"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const FEATURES = [
  { icon: "👥", label: "Shared project workspaces" },
  { icon: "📊", label: "Team performance reports" },
  { icon: "🛡️", label: "Admin dashboard & controls" },
  { icon: "📄", label: "Shared PDF report exports" },
  { icon: "🔗", label: "Real-time task sync across members" },
  { icon: "🏆", label: "Team streak & KPI leaderboard" },
];

export default function TeamWaitlist() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    setSubmitted(true);
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Minimal nav */}
      <header className="px-6 py-5 flex items-center justify-between max-w-5xl mx-auto w-full">
        <Link href="/" className="flex items-center gap-2.5 group">
          <Image
            src="/logo.png"
            alt="Bloombooard logo"
            width={34}
            height={34}
            className="rounded-xl transition-all group-hover:scale-110"
          />
          <span className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>
            Bloombooard
          </span>
        </Link>
        <Link
          href="/#pricing"
          className="text-sm transition-colors hover:text-white"
          style={{ color: "var(--text-muted)" }}
        >
          ← Back to pricing
        </Link>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="max-w-xl w-full mx-auto text-center">

          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-8"
            style={{
              background: "rgba(167, 139, 250, 0.12)",
              border: "1px solid rgba(167, 139, 250, 0.3)",
              color: "var(--accent-purple)",
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ background: "var(--accent-purple)" }}
            />
            Coming soon
          </div>

          {/* Heading */}
          <h1
            className="text-4xl sm:text-5xl font-bold leading-tight mb-4"
            style={{ color: "var(--text-primary)" }}
          >
            Team plan is{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #a78bfa, #4d9fff)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              on its way
            </span>
          </h1>

          <p
            className="text-base sm:text-lg mb-10 leading-relaxed"
            style={{ color: "var(--text-muted)" }}
          >
            Bloombooard is being built for teams. Join the waitlist and be first
            to know when collaborative workspaces, shared KPIs, and team
            dashboards launch.
          </p>

          {/* Waitlist form */}
          {!submitted ? (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 mb-10">
              <input
                type="email"
                required
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-5 py-3.5 rounded-full text-sm outline-none transition-all"
                style={{
                  background: "rgba(20, 30, 48, 0.72)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "var(--text-primary)",
                }}
                onFocus={(e) =>
                  (e.currentTarget.style.borderColor = "rgba(167,139,250,0.5)")
                }
                onBlur={(e) =>
                  (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")
                }
              />
              <button
                type="submit"
                disabled={loading}
                className="px-7 py-3.5 rounded-full font-semibold text-sm text-white transition-all hover:scale-105 hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap"
                style={{
                  background: "linear-gradient(135deg, #a78bfa, #4d9fff)",
                  boxShadow: "0 0 24px rgba(167,139,250,0.35)",
                }}
              >
                {loading ? "Joining…" : "Join the waitlist"}
              </button>
            </form>
          ) : (
            <div
              className="flex items-center justify-center gap-3 px-6 py-4 rounded-2xl mb-10 text-sm font-medium"
              style={{
                background: "rgba(57, 255, 20, 0.08)",
                border: "1px solid rgba(57, 255, 20, 0.25)",
                color: "#39ff14",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              You&apos;re on the list — we&apos;ll email you when Team launches.
            </div>
          )}

          {/* Coming features */}
          <div
            className="rounded-2xl p-6 text-left"
            style={{
              background: "rgba(20, 30, 48, 0.72)",
              border: "1px solid rgba(255,255,255,0.07)",
              backdropFilter: "blur(16px)",
            }}
          >
            <p
              className="text-xs font-semibold uppercase tracking-widest mb-4"
              style={{ color: "var(--text-muted)" }}
            >
              What&apos;s included in Team
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {FEATURES.map((f) => (
                <li key={f.label} className="flex items-center gap-3 text-sm" style={{ color: "var(--text-primary)" }}>
                  <span className="text-base">{f.icon}</span>
                  {f.label}
                </li>
              ))}
            </ul>
            <div
              className="mt-5 pt-4 flex items-center justify-between text-xs"
              style={{
                borderTop: "1px solid rgba(255,255,255,0.06)",
                color: "var(--text-muted)",
              }}
            >
              <span>Up to 10 team members</span>
              <span
                className="font-semibold"
                style={{ color: "var(--accent-purple)" }}
              >
                $14.99 / month
              </span>
            </div>
          </div>

        </div>
      </main>

      {/* Footer note */}
      <footer className="px-6 py-6 text-center text-xs" style={{ color: "var(--text-muted)" }}>
        <span>© {new Date().getFullYear()} Bloombooard · </span>
        <Link href="/" className="hover:text-white transition-colors">bloombooard.com</Link>
      </footer>
    </div>
  );
}
