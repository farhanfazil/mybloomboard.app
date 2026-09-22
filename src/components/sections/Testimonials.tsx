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
    <section ref={ref} data-hide-header className="bg-black px-2 py-6 sm:px-4">
      {/* Light panel, like the comparison section, so the page alternates dark / light */}
      <div className="rounded-[28px] bg-[#f5f5f7] px-4 py-16 sm:rounded-[36px] sm:px-8 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-semibold tracking-tight text-[#1d1d1f] sm:text-5xl">What people say</h2>
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
                  style={{ background: "#fff", boxShadow: "0 1px 2px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.05)" }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#86868b]">{t.tag === "Team" ? "Team" : "Solo"}</span>
                  </div>
                  <p className="text-xs leading-relaxed flex-1" style={{ color: "#3a3a3c" }}>
                    {t.quote}
                  </p>
                  <div className="mt-auto flex items-center gap-3 pt-2 border-t" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
                    <div
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold"
                      style={{ background: "#e8e8ed", color: "#1d1d1f" }}
                    >
                      {t.avatar}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[#1d1d1f]">{t.name}</p>
                      <p className="text-[10px]" style={{ color: "#6e6e73" }}>{t.role}</p>
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
                background: activePage === i ? "#1d1d1f" : "rgba(0,0,0,0.18)",
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
              style={{ background: "#fff", boxShadow: "0 1px 2px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.05)" }}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#86868b]">{t.tag === "Team" ? "Team" : "Solo"}</span>
              </div>
              <p className="text-sm leading-relaxed flex-1" style={{ color: "#3a3a3c" }}>
                {t.quote}
              </p>
              <div className="mt-auto flex items-center gap-3 pt-2 border-t" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold"
                  style={{ background: "#e8e8ed", color: "#1d1d1f" }}
                >
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#1d1d1f]">{t.name}</p>
                  <p className="text-xs" style={{ color: "#6e6e73" }}>{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      </div>
    </section>
  );
}
