"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const BLOOM_TESTIMONIALS = [
  {
    quote: "I've tried every productivity app on the market. BloomBoard is the first one that actually stuck — everything I need is in one window.",
    name: "Alex T.",
    role: "Product Manager, Berlin",
    avatar: "AT",
    color: "#4d9fff",
    tag: "Individual",
  },
  {
    quote: "The KPI dashboard and streak tracking completely changed how I start my mornings. I actually look forward to opening my Mac.",
    name: "Mia L.",
    role: "Startup Founder, Singapore",
    avatar: "ML",
    color: "#a78bfa",
    tag: "Individual",
  },
  {
    quote: "No cloud, no account, no tracking — and it's still the most capable dashboard I've used. The privacy-first approach is exactly what I needed.",
    name: "Noah B.",
    role: "Security Engineer, Zurich",
    avatar: "NB",
    color: "#34d399",
    tag: "Individual",
  },
  {
    quote: "Our team uses it individually and syncs daily in standups. The hydration and mood tracking sounds small but genuinely improves how we work together.",
    name: "Rachel & Dan",
    role: "Co-founders, Buildtide",
    avatar: "RD",
    color: "#fb923c",
    tag: "Team",
  },
  {
    quote: "Replaced my sticky notes, Notion, and two habit apps. Everything in one glassy window — it just feels premium every single time I open it.",
    name: "Kenji S.",
    role: "Designer, Tokyo",
    avatar: "KS",
    color: "#f472b6",
    tag: "Individual",
  },
  {
    quote: "We onboarded our remote team in minutes. Each person tracks their own KPIs locally — no data leaves their machine. IT loves us for it.",
    name: "Fatima & Co.",
    role: "Operations Lead, Amsterdam",
    avatar: "FC",
    color: "#38bdf8",
    tag: "Team",
  },
];

export default function Testimonials() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const carouselRef = useRef<HTMLDivElement>(null);
  const [activePage, setActivePage] = useState(0);

  const pages = Array.from(
    { length: Math.ceil(BLOOM_TESTIMONIALS.length / 3) },
    (_, pi) => BLOOM_TESTIMONIALS.slice(pi * 3, pi * 3 + 3)
  );

  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;
    const onScroll = () => setActivePage(Math.round(el.scrollLeft / el.clientWidth));
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section
      ref={ref}
      className="relative px-4 py-16 sm:py-24"
      style={{
        background: "linear-gradient(160deg, #080c18 0%, #0a0d1f 40%, #060810 70%, #080c18 100%)",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Ambient glow blobs */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute left-1/4 top-0 h-[400px] w-[600px] -translate-x-1/2 opacity-20"
          style={{ background: "radial-gradient(ellipse, rgba(77,159,255,0.5) 0%, transparent 70%)", filter: "blur(80px)" }}
        />
        <div
          className="absolute right-0 bottom-0 h-[350px] w-[400px] opacity-15"
          style={{ background: "radial-gradient(circle, rgba(167,139,250,0.6) 0%, transparent 70%)", filter: "blur(80px)" }}
        />
        <div
          className="absolute left-0 bottom-1/3 h-[250px] w-[300px] opacity-10"
          style={{ background: "radial-gradient(circle, rgba(52,211,153,0.5) 0%, transparent 70%)", filter: "blur(70px)" }}
        />
      </div>
      <div className="relative mx-auto max-w-6xl">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span
            className="inline-block text-xs font-semibold uppercase tracking-widest mb-4 px-3 py-1 rounded-full"
            style={{ color: "#4d9fff", background: "rgba(77,159,255,0.08)", border: "1px solid rgba(77,159,255,0.2)" }}
          >
            From our users
          </span>
          <h2 className="text-3xl font-bold sm:text-4xl">What they&apos;re saying</h2>
        </motion.div>

        {/* Mobile: paginated carousel — 3 per page, full width */}
        <div
          ref={carouselRef}
          className="sm:hidden flex overflow-x-auto snap-x snap-mandatory [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: "none" }}
        >
          {pages.map((page, pi) => (
            <div key={pi} className="w-full shrink-0 snap-start flex flex-col gap-3">
              {page.map((t) => (
                <div
                  key={t.name}
                  className="flex flex-col gap-3 rounded-2xl p-4"
                  style={{
                    background: "linear-gradient(145deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderTop: "1px solid rgba(255,255,255,0.18)",
                    backdropFilter: "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)",
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full"
                      style={
                        t.tag === "Team"
                          ? { background: "rgba(251,191,36,0.1)", color: "#fbbf24", border: "1px solid rgba(251,191,36,0.2)" }
                          : { background: "rgba(77,159,255,0.08)", color: "#93c5fd", border: "1px solid rgba(77,159,255,0.2)" }
                      }
                    >
                      {t.tag}
                    </span>
                    <span style={{ color: t.color, fontSize: 18, lineHeight: 1 }}>&ldquo;</span>
                  </div>
                  <p className="text-xs leading-relaxed flex-1" style={{ color: "rgba(255,255,255,0.72)" }}>
                    {t.quote}
                  </p>
                  <div className="mt-auto flex items-center gap-3 pt-2 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                    <div
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold"
                      style={{ background: `${t.color}22`, border: `1px solid ${t.color}55`, color: t.color }}
                    >
                      {t.avatar}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white">{t.name}</p>
                      <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.38)" }}>{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Mobile dots */}
        <div className="sm:hidden mt-4 flex items-center justify-center gap-2">
          {pages.map((_, i) => (
            <button
              key={i}
              aria-label={`Go to page ${i + 1}`}
              onClick={() => carouselRef.current?.scrollTo({ left: i * carouselRef.current.clientWidth, behavior: "smooth" })}
              className="rounded-full transition-all duration-300"
              style={{
                width: activePage === i ? "1.5rem" : "0.375rem",
                height: "0.375rem",
                background: activePage === i ? "rgba(77,159,255,0.9)" : "rgba(255,255,255,0.2)",
              }}
            />
          ))}
        </div>

        {/* Desktop: original grid — untouched */}
        <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {BLOOM_TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col gap-3 rounded-2xl p-5"
              style={{
                background: "linear-gradient(145deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderTop: "1px solid rgba(255,255,255,0.18)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)",
              }}
            >
              <div className="flex items-center justify-between">
                <span
                  className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full"
                  style={
                    t.tag === "Team"
                      ? { background: "rgba(251,191,36,0.1)", color: "#fbbf24", border: "1px solid rgba(251,191,36,0.2)" }
                      : { background: "rgba(77,159,255,0.08)", color: "#93c5fd", border: "1px solid rgba(77,159,255,0.2)" }
                  }
                >
                  {t.tag}
                </span>
                <span style={{ color: t.color, fontSize: 18, lineHeight: 1 }}>&ldquo;</span>
              </div>
              <p className="text-sm leading-relaxed flex-1" style={{ color: "rgba(255,255,255,0.72)" }}>
                {t.quote}
              </p>
              <div className="mt-auto flex items-center gap-3 pt-2 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold"
                  style={{ background: `${t.color}22`, border: `1px solid ${t.color}55`, color: t.color }}
                >
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{t.name}</p>
                  <p className="text-xs" style={{ color: "rgba(255,255,255,0.38)" }}>{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

