import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { DividerGrid, SectionTitle, SeoCta, SeoFooter, SeoHeader, SeoHero } from "@/components/seo/SeoShell";
import { TEMPLATES, template } from "@/lib/templates";

export function generateStaticParams() {
  return TEMPLATES.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const t = template(slug);
  if (!t) return {};
  return {
    title: t.title,
    description: t.description,
    alternates: { canonical: `/templates/${t.slug}` },
    openGraph: { title: t.title, description: t.description, type: "article", siteName: "BloomBoard" },
  };
}

export default async function TemplatePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const t = template(slug);
  if (!t) notFound();
  const others = TEMPLATES.filter((x) => x.slug !== t.slug);
  return (
    <div className="min-h-screen bg-black text-[#f5f5f7]">
      <SeoHeader />
      <main className="mx-auto max-w-[1040px] px-5 pb-6 pt-10 md:pt-16">
        <SeoHero kicker="Free template" title={t.h1} intro={t.intro}>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <a href={`/templates/${t.slug}/download`} download className="rounded-[11px] bg-white px-5 py-3 text-[15px] font-semibold text-black">Download template</a>
            <Link href="/start" className="rounded-[11px] border border-white/15 px-5 py-3 text-[15px] font-semibold">Get BloomBoard free</Link>
          </div>
          <p className="mt-3 text-[13px] text-[#a1a1aa]">In BloomBoard: My Boards, then Import, then drop the file in. Best for: {t.forWho}</p>
        </SeoHero>

        <section className="mt-14">
          <SectionTitle>What&apos;s on the board</SectionTitle>
          <div className="mt-6 flex gap-3 overflow-x-auto pb-3">
            {t.columns.map((col) => (
              <div key={col.title} className="w-[220px] shrink-0 rounded-2xl border border-white/10 bg-[#111113] p-3">
                <div className="flex items-center justify-between px-1 text-[12.5px] font-bold uppercase tracking-[0.06em] text-[#a1a1aa]">
                  <span>{col.title}</span><span>{col.cards.length}</span>
                </div>
                <div className="mt-3 space-y-2">
                  {col.cards.map((c) => (
                    <div key={c.title} className="rounded-xl bg-[#1c1c1f] p-3 text-left">
                      <p className="text-[13.5px] font-semibold leading-snug">{c.title}</p>
                      {c.desc && <p className="mt-1 text-[12.5px] leading-snug text-[#a1a1aa]">{c.desc}</p>}
                      {c.checklist && <p className="mt-2 text-[12px] text-[#a1a1aa]">☐ {c.checklist.length} checklist items</p>}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto mt-14 max-w-[880px]">
          <SectionTitle>How to get the most from it</SectionTitle>
          <DividerGrid items={t.tips} />
        </section>

        <div className="mx-auto max-w-[880px]">
          <SeoCta title="Run it with your team" body="BloomBoard puts this board next to your team's chat, calls and AI. Start free, no card needed." />
          <nav className="mt-8 text-center text-[14px] text-[#a1a1aa]" aria-label="More templates">
            More free templates:{" "}
            {others.map((o, i) => (
              <span key={o.slug}>
                <Link href={`/templates/${o.slug}`} className="underline underline-offset-2 hover:text-white">{o.name}</Link>
                {i < others.length - 1 ? " · " : ""}
              </span>
            ))}
          </nav>
        </div>
      </main>
      <SeoFooter />
    </div>
  );
}
