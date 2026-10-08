import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { FAQSection } from "@/components/ui/faqsection";
import { TEAMS_HEADERS, TEAMS_ROWS } from "@/lib/compare-data";
import { VS_PAGES, vsPage } from "@/lib/vs-pages";

export function generateStaticParams() {
  return VS_PAGES.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = vsPage(slug);
  if (!p) return {};
  return {
    title: p.title,
    description: p.description,
    alternates: { canonical: `/vs/${p.slug}` },
    openGraph: { title: p.title, description: p.description, type: "article", siteName: "BloomBoard" },
    twitter: { card: "summary_large_image", title: p.title, description: p.description },
  };
}

/* "✅ Built-in" → { kind: "yes", text: "Built-in" } */
function cell(v: string) {
  const s = String(v || "").trim();
  const kind = s.startsWith("✅") ? "yes" : s.startsWith("⚠️") ? "part" : "no";
  const text = s.replace(/^(✅|⚠️|❌)\s*/, "").split("\n")[0];
  return { kind, text };
}

function Mark({ v }: { v: string }) {
  const c = cell(v);
  return (
    <span className="inline-flex items-center gap-2">
      {c.kind === "yes" ? (
        <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-[#4ade80]" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-label="Yes"><path d="M20 6L9 17l-5-5" /></svg>
      ) : c.kind === "part" ? (
        <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-[#fbbf24]" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" aria-label="Partly"><path d="M5 12h14" /></svg>
      ) : (
        <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-[#71717a]" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" aria-label="No"><path d="M18 6L6 18M6 6l12 12" /></svg>
      )}
      {c.text && <span className="text-[13px] text-[#a1a1aa]">{c.text}</span>}
    </span>
  );
}

export default async function VsPageView({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = vsPage(slug);
  if (!p) notFound();
  const col = TEAMS_HEADERS.indexOf(p.name);
  /* Company-focused pages: no offline / on-your-computer rows (those are about the solo Free plan). */
  const SKIP = ["Works offline", "Works without an account", "Data location"];
  const rows = TEAMS_ROWS.filter((r): r is string[] => Array.isArray(r) && !SKIP.includes(r[0]));
  /* Where BloomBoard is different first; what both do well after. */
  const TOP = ["Live team office", "Voice & video calls", "Built-in team chat", "AI assistant built-in", "Daily Recap",
    "Gmail and Outlook inbox", "Turn an email into a task", "Type to Task", "Handovers before a vacation", "Workload Health",
    "Works offline", "Works without an account", "Team overview", "Team vacation calendar"];
  const rank = (f: string) => { const i = TOP.indexOf(f); return i < 0 ? 99 : i; };
  const allDiff = rows.filter((r) => cell(r[1]).kind === "yes" && cell(r[col]).kind !== "yes")
    .sort((a, b) => rank(a[0]) - rank(b[0]));
  const diff = allDiff.slice(0, 12);
  const moreDiff = allDiff.slice(12).map((r) => r[0]);
  const both = rows.filter((r) => cell(r[1]).kind === "yes" && cell(r[col]).kind === "yes").map((r) => r[0]);
  const half = Math.ceil(p.faqs.length / 2);
  const display = p.name === "Monday" ? "monday.com" : p.name;
  const others = VS_PAGES.filter((x) => x.slug !== p.slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: p.faqs.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })),
  };

  return (
    <div className="min-h-screen bg-black text-[#f5f5f7]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <header className="mx-auto flex max-w-[1120px] items-center justify-between px-5 py-5 md:px-12">
        <Link href="/" className="flex items-center gap-2.5 font-bold">
          <Image src="/email-icon.png" alt="" width={30} height={30} className="rounded-lg" />
          BloomBoard
        </Link>
        <Link href="/start" className="rounded-[10px] bg-white px-4 py-2 text-sm font-semibold text-black">Start free</Link>
      </header>

      <main className="mx-auto max-w-[880px] px-5 pb-10 pt-10 text-center md:pt-16">
        <p className="text-[12px] font-bold uppercase tracking-[0.12em] text-[#9fdcff]">BloomBoard vs {display}</p>
        <h1 className="mx-auto mt-3 max-w-[760px] text-[34px] font-bold leading-[1.08] tracking-[-0.03em] md:text-[46px]" style={{ textWrap: "balance" }}>{p.h1}</h1>
        <p className="mx-auto mt-5 max-w-[640px] text-[16.5px] leading-relaxed text-[#c4c4cc]" style={{ textWrap: "pretty" }}>{p.intro}</p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link href="/start" className="rounded-[11px] bg-white px-5 py-3 text-[15px] font-semibold text-black">Start free</Link>
          <Link href="/#live-demo" className="rounded-[11px] border border-white/15 px-5 py-3 text-[15px] font-semibold">Try the live demo</Link>
        </div>
        <p className="mt-3 text-[13px] text-[#a1a1aa]">Start free. No card needed.</p>

        <section className="mt-16">
          <h2 className="text-[22px] font-bold tracking-[-0.02em]">Why teams switch from {display} to BloomBoard</h2>
          <div className="mt-6 grid divide-y divide-white/10 border-y border-white/10 md:grid-cols-3 md:divide-x md:divide-y-0">
            {p.reasons.map((r) => (
              <div key={r.title} className="px-2 py-6 md:px-6">
                <h3 className="text-[15.5px] font-bold">{r.title}</h3>
                <p className="mt-2 text-[14.5px] leading-relaxed text-[#c4c4cc]">{r.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-16">
          <h2 className="text-[22px] font-bold tracking-[-0.02em]">Where BloomBoard is different</h2>
          <div className="mt-6 overflow-hidden rounded-2xl border border-white/10 text-left">
            <div className="grid grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_minmax(0,1fr)] bg-[#111113] px-4 py-3 text-[12px] font-bold uppercase tracking-[0.06em] text-[#a1a1aa]">
              <span>Feature</span><span>BloomBoard</span><span>{display}</span>
            </div>
            {diff.map((r) => (
              <div key={r[0]} className="grid grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_minmax(0,1fr)] items-center gap-2 border-t border-white/[0.07] px-4 py-3">
                <span className="text-[14.5px] font-medium">{r[0]}</span>
                <Mark v={r[1]} />
                <Mark v={r[col]} />
              </div>
            ))}
          </div>
          {moreDiff.length > 0 && (
            <p className="mx-auto mt-4 max-w-[720px] text-[14px] leading-relaxed text-[#a1a1aa]">
              <span className="font-semibold text-[#d4d4d8]">More differences:</span> {moreDiff.join(", ")}.
            </p>
          )}
          {both.length > 0 && (
            <p className="mx-auto mt-2 max-w-[720px] text-[14px] leading-relaxed text-[#a1a1aa]">
              <span className="font-semibold text-[#d4d4d8]">Both have:</span> {both.join(", ")}.
            </p>
          )}
          <p className="mt-2 text-[12.5px] text-[#71717a]">Compared October 2026. Other apps change often; if something here is out of date, tell us at hello@mybloomboard.app and we will fix it.</p>
        </section>

        <section className="mt-16 rounded-2xl border border-white/10 bg-[#111113] p-6">
          <h2 className="text-[20px] font-bold tracking-[-0.02em]">Switching from {display}</h2>
          <p className="mx-auto mt-2.5 max-w-[620px] text-[15px] leading-relaxed text-[#c4c4cc]">{p.switching}</p>
        </section>
      </main>

      <FAQSection
        className="pb-8 pt-4 md:pt-8"
        subtitle="Questions"
        title={`BloomBoard vs ${display}`}
        description="Straight answers to what people ask before switching."
        buttonLabel="Start free →"
        buttonHref="/start"
        faqsLeft={p.faqs.slice(0, half)}
        faqsRight={p.faqs.slice(half)}
      />

      <nav className="mx-auto max-w-[880px] px-5 pb-24 text-center text-[14px] text-[#a1a1aa]" aria-label="Other comparisons">
        Also compare:{" "}
        {others.map((o, i) => (
          <span key={o.slug}>
            <Link href={`/vs/${o.slug}`} className="underline underline-offset-2 hover:text-white">BloomBoard vs {o.name === "Monday" ? "monday.com" : o.name}</Link>
            {i < others.length - 1 ? " · " : ""}
          </span>
        ))}
        {" · "}<Link href="/roam-alternative" className="underline underline-offset-2 hover:text-white">Roam alternative</Link>
      </nav>
    </div>
  );
}
