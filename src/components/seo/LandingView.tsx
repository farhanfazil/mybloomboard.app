import type { Metadata } from "next";
import Link from "next/link";

import { FAQSection } from "@/components/ui/faqsection";
import { DividerGrid, SectionTitle, SeoCta, SeoFooter, SeoHeader, SeoHero, faqLd } from "@/components/seo/SeoShell";
import { landingPage } from "@/lib/landing-pages";

export function landingMetadata(slug: string): Metadata {
  const p = landingPage(slug);
  return {
    title: p.title,
    description: p.description,
    alternates: { canonical: `/${p.slug}` },
    openGraph: { title: p.title, description: p.description, type: "website", siteName: "BloomBoard" },
    twitter: { card: "summary_large_image", title: p.title, description: p.description },
  };
}

export function LandingView({ slug }: { slug: string }) {
  const p = landingPage(slug);
  const half = Math.ceil(p.faqs.length / 2);
  return (
    <div className="min-h-screen bg-black text-[#f5f5f7]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd(p.faqs)) }} />
      <SeoHeader />
      <main className="mx-auto max-w-[880px] px-5 pb-6 pt-10 md:pt-16">
        <SeoHero kicker={p.kicker} title={p.h1} intro={p.intro} />
        <section className="mt-16">
          <SectionTitle>{p.featuresTitle}</SectionTitle>
          <DividerGrid items={p.features} />
        </section>
        <section className="mt-16">
          <SectionTitle>{p.stepsTitle}</SectionTitle>
          <ol className="mt-6 grid gap-6 text-center md:grid-cols-3">
            {p.steps.map((s, i) => (
              <li key={s.title}>
                <span className="mx-auto grid h-8 w-8 place-items-center rounded-full border border-white/20 text-[13px] font-bold">{i + 1}</span>
                <h3 className="mt-3 text-[15.5px] font-bold">{s.title}</h3>
                <p className="mx-auto mt-1.5 max-w-[260px] text-[14.5px] leading-relaxed text-[#c4c4cc]">{s.body}</p>
              </li>
            ))}
          </ol>
        </section>
        <SeoCta />
      </main>
      <FAQSection
        className="pb-8 pt-4 md:pt-8"
        subtitle="Questions"
        title={p.kicker}
        description="Straight answers to what teams ask us most."
        buttonLabel="Start free →"
        buttonHref="/start"
        faqsLeft={p.faqs.slice(0, half)}
        faqsRight={p.faqs.slice(half)}
      />
      <nav className="mx-auto max-w-[880px] px-5 pb-4 text-center text-[14px] text-[#a1a1aa]" aria-label="Related">
        Related:{" "}
        {p.related.map((r, i) => (
          <span key={r.href}>
            <Link href={r.href} className="underline underline-offset-2 hover:text-white">{r.title}</Link>
            {i < p.related.length - 1 ? " · " : ""}
          </span>
        ))}
      </nav>
      <SeoFooter />
    </div>
  );
}
