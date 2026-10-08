import type { Metadata } from "next";
import Link from "next/link";

import { SeoCta, SeoFooter, SeoHeader, SeoHero } from "@/components/seo/SeoShell";
import { GUIDES } from "@/lib/guides";

export const metadata: Metadata = {
  title: "Guides for teams: planning, remote work and focus · BloomBoard",
  description: "Practical guides for teams: run a remote team with fewer meetings, plan your workday with time blocking, and hand over your work before a vacation.",
  alternates: { canonical: "/guides" },
};

export default function GuidesIndex() {
  return (
    <div className="min-h-screen bg-black text-[#f5f5f7]">
      <SeoHeader />
      <main className="mx-auto max-w-[880px] px-5 pb-6 pt-10 md:pt-16">
        <SeoHero kicker="Guides" title="Practical guides for calmer, better teamwork" intro="Short, practical advice on planning, remote work and focus, from the team behind BloomBoard.">
          <span />
        </SeoHero>
        <div className="mt-12 border-t border-white/10">
          {GUIDES.map((g) => (
            <Link key={g.slug} href={`/guides/${g.slug}`} className="group block border-b border-white/10 px-2 py-6 text-left">
              <h2 className="text-[18px] font-bold group-hover:underline" style={{ textWrap: "balance" }}>{g.h1}</h2>
              <p className="mt-1.5 text-[14.5px] leading-relaxed text-[#c4c4cc]">{g.intro}</p>
              <p className="mt-2 text-[12.5px] text-[#71717a]">{g.readMinutes} min read</p>
            </Link>
          ))}
        </div>
        <SeoCta />
      </main>
      <SeoFooter />
    </div>
  );
}
