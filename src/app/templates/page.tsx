import type { Metadata } from "next";
import Link from "next/link";

import { SeoCta, SeoFooter, SeoHeader, SeoHero } from "@/components/seo/SeoShell";
import { TEMPLATES } from "@/lib/templates";

export const metadata: Metadata = {
  title: "Free board templates for teams · BloomBoard",
  description:
    "Free kanban and planning templates for teams: weekly team planner, content calendar, client project board, sprint board and product launch checklist. Download and import into BloomBoard.",
  alternates: { canonical: "/templates" },
};

export default function TemplatesIndex() {
  return (
    <div className="min-h-screen bg-black text-[#f5f5f7]">
      <SeoHeader />
      <main className="mx-auto max-w-[880px] px-5 pb-6 pt-10 md:pt-16">
        <SeoHero kicker="Free templates" title="Free board templates for teams" intro="Ready-made boards for planning the week, running client projects, shipping sprints and launching products. Download one and import it into BloomBoard in a few seconds.">
          <span />
        </SeoHero>
        <div className="mt-12 border-t border-white/10">
          {TEMPLATES.map((t) => (
            <Link key={t.slug} href={`/templates/${t.slug}`} className="group flex flex-col gap-1 border-b border-white/10 px-2 py-6 text-left md:flex-row md:items-center md:gap-6">
              <div className="min-w-0 flex-1">
                <h2 className="text-[17px] font-bold group-hover:underline">{t.name}</h2>
                <p className="mt-1 text-[14.5px] leading-relaxed text-[#c4c4cc]">{t.intro}</p>
              </div>
              <span className="text-[13.5px] text-[#a1a1aa]">{t.columns.length} columns · {t.columns.reduce((n, c) => n + c.cards.length, 0)} cards →</span>
            </Link>
          ))}
        </div>
        <SeoCta title="Build your own board in a minute" body="Start free and create boards for every project. No card needed." />
      </main>
      <SeoFooter />
    </div>
  );
}
