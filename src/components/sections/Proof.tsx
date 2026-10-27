"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { PROOF_TITLE, type ProofQuote } from "@/lib/proof";

/**
 * Real quotes from teams using BloomBoard (/api/quotes: hand-picked ones plus the ones
 * approved on /quotes-review). Hidden until there are some.
 */
export default function Proof() {
  const [quotes, setQuotes] = useState<ProofQuote[]>([]);
  useEffect(() => {
    fetch("/api/quotes")
      .then((r) => (r.ok ? r.json() : { quotes: [] }))
      .then((d) => setQuotes(Array.isArray(d.quotes) ? d.quotes : []))
      .catch(() => {});
  }, []);

  if (!quotes.length) return null;
  return (
    <section aria-labelledby="proof-title" className="bg-black px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <h2 id="proof-title" className="text-center text-3xl font-bold tracking-tight text-white sm:text-4xl">
          {PROOF_TITLE}
        </h2>
        <div className={`mt-12 grid gap-4 sm:mt-14 ${quotes.length >= 3 ? "md:grid-cols-3" : quotes.length === 2 ? "md:grid-cols-2" : "mx-auto max-w-xl"}`}>
          {quotes.map((q, i) => (
            <figure key={i} className="flex flex-col rounded-2xl border border-white/10 bg-[#0b0b0d] p-6">
              <blockquote className="flex-1 text-[17px] leading-relaxed text-white/90">“{q.quote}”</blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                {q.photo ? (
                  <Image src={q.photo} alt="" width={40} height={40} className="h-10 w-10 rounded-full object-cover" />
                ) : (
                  <span aria-hidden className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-[#3B6FF5] text-sm font-semibold text-white">
                    {(q.name || "?").trim()[0]?.toUpperCase()}
                  </span>
                )}
                <div>
                  <p className="text-sm font-semibold text-white">{q.name}</p>
                  {q.role || q.team ? (
                    <p className="text-sm text-white/65">{[q.role, q.team].filter(Boolean).join(", ")}</p>
                  ) : null}
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
