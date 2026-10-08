import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { SeoCta, SeoFooter, SeoHeader } from "@/components/seo/SeoShell";
import { GUIDES, guide } from "@/lib/guides";

export function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const g = guide(slug);
  if (!g) return {};
  return {
    title: g.title,
    description: g.description,
    alternates: { canonical: `/guides/${g.slug}` },
    openGraph: { title: g.title, description: g.description, type: "article", siteName: "BloomBoard", publishedTime: g.published },
  };
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const g = guide(slug);
  if (!g) notFound();
  const ld = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: g.h1,
    description: g.description,
    datePublished: g.published,
    dateModified: g.published,
    author: { "@type": "Organization", name: "BloomBoard", url: "https://mybloomboard.app" },
    publisher: { "@type": "Organization", name: "BloomBoard", logo: { "@type": "ImageObject", url: "https://mybloomboard.app/icon.png" } },
    mainEntityOfPage: `https://mybloomboard.app/guides/${g.slug}`,
  };
  const date = new Date(g.published + "T12:00:00Z").toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  return (
    <div className="min-h-screen bg-black text-[#f5f5f7]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <SeoHeader />
      <main className="mx-auto max-w-[720px] px-5 pb-6 pt-10 md:pt-16">
        <div className="text-center">
          <Link href="/guides" className="text-[12px] font-bold uppercase tracking-[0.12em] text-[#9fdcff]">Guides</Link>
          <h1 className="mx-auto mt-3 text-[32px] font-bold leading-[1.1] tracking-[-0.03em] md:text-[42px]" style={{ textWrap: "balance" }}>{g.h1}</h1>
          <p className="mt-3 text-[13px] text-[#71717a]">{date} · {g.readMinutes} min read</p>
        </div>
        <article className="mt-10 text-[16px] leading-[1.75] text-[#d4d4d8]">
          <p className="text-[17px] text-[#e4e4e7]">{g.intro}</p>
          {g.body.map((b, i) => {
            if (b.type === "h2") return <h2 key={i} className="mt-10 text-[21px] font-bold leading-snug tracking-[-0.02em] text-white">{b.text}</h2>;
            if (b.type === "p") return <p key={i} className="mt-4">{b.text}</p>;
            if (b.type === "tip") return <p key={i} className="mt-5 border-l-2 border-[#9fdcff]/60 pl-4 text-[15px] text-[#c4c4cc]">{b.text}</p>;
            const Tag = b.type === "ol" ? "ol" : "ul";
            return (
              <Tag key={i} className={`mt-4 space-y-1.5 pl-5 ${b.type === "ol" ? "list-decimal" : "list-disc"} marker:text-[#71717a]`}>
                {b.items.map((it) => <li key={it}>{it}</li>)}
              </Tag>
            );
          })}
        </article>
        <SeoCta title="Try it with your team" body="BloomBoard brings tasks, boards, chat, calls and a live office together. Start free, no card needed." />
        <nav className="mt-8 text-center text-[14px] text-[#a1a1aa]" aria-label="Related">
          Related:{" "}
          {g.related.map((r, i) => (
            <span key={r.href}>
              <Link href={r.href} className="underline underline-offset-2 hover:text-white">{r.title}</Link>
              {i < g.related.length - 1 ? " · " : ""}
            </span>
          ))}
        </nav>
      </main>
      <SeoFooter />
    </div>
  );
}
