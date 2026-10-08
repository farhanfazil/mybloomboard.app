import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

/* Shared frame for the search pages (comparisons, solutions, templates, guides):
   same header, centred layout and a footer that links every page to the others,
   so search engines and readers can move between them. */

export const EXPLORE: { label: string; links: { title: string; href: string }[] }[] = [
  {
    label: "Solutions",
    links: [
      { title: "Virtual office", href: "/virtual-office" },
      { title: "Team task manager", href: "/team-task-manager" },
      { title: "Kanban board app", href: "/kanban-board-app" },
      { title: "For agencies", href: "/task-app-for-agencies" },
      { title: "AI daily planner", href: "/daily-planner-app" },
    ],
  },
  {
    label: "Compare",
    links: [
      { title: "vs Trello", href: "/vs/trello" },
      { title: "vs ClickUp", href: "/vs/clickup" },
      { title: "vs Notion", href: "/vs/notion" },
      { title: "vs monday.com", href: "/vs/monday" },
      { title: "vs Asana", href: "/vs/asana" },
      { title: "Roam alternative", href: "/roam-alternative" },
    ],
  },
  {
    label: "Resources",
    links: [
      { title: "Free templates", href: "/templates" },
      { title: "Guides", href: "/guides" },
      { title: "Live demo", href: "/#live-demo" },
      { title: "Security", href: "/security" },
    ],
  },
];

export function SeoHeader() {
  return (
    <header className="mx-auto flex max-w-[1120px] items-center justify-between px-5 py-5 md:px-12">
      <Link href="/" className="flex items-center gap-2.5 font-bold">
        <Image src="/email-icon.png" alt="" width={30} height={30} className="rounded-lg" />
        BloomBoard
      </Link>
      <Link href="/start" className="rounded-[10px] bg-white px-4 py-2 text-sm font-semibold text-black">Start free</Link>
    </header>
  );
}

export function SeoHero({ kicker, title, intro, children }: { kicker: string; title: string; intro: string; children?: ReactNode }) {
  return (
    <div className="text-center">
      <p className="text-[12px] font-bold uppercase tracking-[0.12em] text-[#9fdcff]">{kicker}</p>
      <h1 className="mx-auto mt-3 max-w-[760px] text-[34px] font-bold leading-[1.08] tracking-[-0.03em] md:text-[46px]" style={{ textWrap: "balance" }}>{title}</h1>
      <p className="mx-auto mt-5 max-w-[640px] text-[16.5px] leading-relaxed text-[#c4c4cc]" style={{ textWrap: "pretty" }}>{intro}</p>
      {children ?? (
        <>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link href="/start" className="rounded-[11px] bg-white px-5 py-3 text-[15px] font-semibold text-black">Start free</Link>
            <Link href="/#live-demo" className="rounded-[11px] border border-white/15 px-5 py-3 text-[15px] font-semibold">Try the live demo</Link>
          </div>
          <p className="mt-3 text-[13px] text-[#a1a1aa]">Start free. No card needed.</p>
        </>
      )}
    </div>
  );
}

/* Open columns with thin dividers (no boxes). */
export function DividerGrid({ items, cols = 3 }: { items: { title: string; body: string }[]; cols?: 2 | 3 }) {
  const grid = cols === 2 ? "md:grid-cols-2" : "md:grid-cols-3";
  return (
    <div className={`mt-6 grid border-t border-white/10 ${grid}`}>
      {items.map((it, i) => (
        <div
          key={it.title}
          className={`border-b border-white/10 px-2 py-6 md:px-6 ${i % cols !== 0 ? "md:border-l" : ""}`}
        >
          <h3 className="text-[15.5px] font-bold">{it.title}</h3>
          <p className="mt-2 text-[14.5px] leading-relaxed text-[#c4c4cc]">{it.body}</p>
        </div>
      ))}
    </div>
  );
}

export function SectionTitle({ children }: { children: ReactNode }) {
  return <h2 className="text-center text-[22px] font-bold tracking-[-0.02em]" style={{ textWrap: "balance" }}>{children}</h2>;
}

export function SeoCta({ title = "Bring your team together today", body = "Start free in minutes. No card needed." }: { title?: string; body?: string }) {
  return (
    <section className="mt-16 border-y border-white/10 py-10 text-center">
      <h2 className="text-[24px] font-bold tracking-[-0.02em]" style={{ textWrap: "balance" }}>{title}</h2>
      <p className="mx-auto mt-2 max-w-[520px] text-[15px] text-[#c4c4cc]">{body}</p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link href="/start" className="rounded-[11px] bg-white px-5 py-3 text-[15px] font-semibold text-black">Start free</Link>
        <Link href="/#pricing" className="rounded-[11px] border border-white/15 px-5 py-3 text-[15px] font-semibold">See pricing</Link>
      </div>
    </section>
  );
}

export function SeoFooter() {
  return (
    <footer className="mx-auto max-w-[880px] px-5 pb-20 pt-6">
      <nav className="grid gap-8 border-t border-white/10 pt-10 sm:grid-cols-3" aria-label="Explore BloomBoard">
        {EXPLORE.map((g) => (
          <div key={g.label}>
            <p className="text-[12px] font-bold uppercase tracking-[0.1em] text-[#71717a]">{g.label}</p>
            <ul className="mt-3 space-y-2">
              {g.links.map((l) => (
                <li key={l.href}><Link href={l.href} className="text-[14px] text-[#a1a1aa] hover:text-white">{l.title}</Link></li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
      <p className="mt-10 text-[12.5px] text-[#71717a]">© 2026 BloomBoard · <Link href="/privacy.html" className="hover:text-white">Privacy</Link> · <Link href="/terms.html" className="hover:text-white">Terms</Link></p>
    </footer>
  );
}

export function faqLd(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })),
  };
}
