"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const BLOOM_TESTIMONIALS = [
  {
    quote: "I've tried every productivity app on the market. Bloombooard is the first one that actually stuck — everything I need is in one window.",
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

  return (
    <section
      ref={ref}
      className="px-4 py-16 sm:py-24 border-t"
      style={{ borderColor: "rgba(255,255,255,0.05)" }}
    >
      <div className="mx-auto max-w-6xl">
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

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {BLOOM_TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col gap-4 rounded-2xl p-6"
              style={{
                background: "linear-gradient(145deg, rgba(12,12,16,0.95), rgba(6,6,10,0.88))",
                border: "1px solid rgba(255,255,255,0.08)",
                borderTop: "1px solid rgba(255,255,255,0.14)",
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

              <div
                className="mt-auto flex items-center gap-3 pt-2 border-t"
                style={{ borderColor: "rgba(255,255,255,0.06)" }}
              >
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
