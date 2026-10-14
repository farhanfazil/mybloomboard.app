import Image from "next/image";
import { PROOF_TITLE, QUOTES } from "@/lib/proof";

/** Real quotes from teams using BloomBoard (src/lib/proof.ts). Hidden until there are some. */
export default function Proof() {
  if (!QUOTES.length) return null;
  return (
    <section aria-labelledby="proof-title" className="bg-black px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <h2 id="proof-title" className="text-center text-3xl font-bold tracking-tight text-white sm:text-4xl">
          {PROOF_TITLE}
        </h2>
        <div className="mt-12 grid gap-4 sm:mt-14 md:grid-cols-3">
          {QUOTES.slice(0, 6).map((q) => (
            <figure key={q.name + q.team} className="flex flex-col rounded-2xl border border-white/10 bg-[#0b0b0d] p-6">
              <blockquote className="flex-1 text-[17px] leading-relaxed text-white/90">{q.quote}</blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                {q.photo ? (
                  <Image src={q.photo} alt="" width={40} height={40} className="h-10 w-10 rounded-full object-cover" />
                ) : null}
                <div>
                  <p className="text-sm font-semibold text-white">{q.name}</p>
                  <p className="text-sm text-white/55">
                    {q.role}, {q.team}
                  </p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
