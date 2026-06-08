"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { WALKTHROUGH_ITEMS } from "@/lib/constants";
import WalkthroughItem, { WalkthroughMobileCard } from "@/components/walkthrough/WalkthroughItem";

export default function Walkthrough() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const carouselRef = useRef<HTMLDivElement>(null);
  const [activePage, setActivePage] = useState(0);

  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;
    const onScroll = () => setActivePage(Math.round(el.scrollLeft / el.clientWidth));
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section id="walkthrough" className="relative border-y border-white/[0.04] bg-black px-4 py-16 sm:px-6 sm:py-20">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <motion.div
          ref={ref}
          className="mb-10 text-center sm:mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span
            className="inline-block text-xs font-semibold uppercase tracking-widest mb-4 px-3 py-1 rounded-full"
            style={{ color: "#39FF14", background: "rgba(57,255,20,0.08)", border: "1px solid rgba(57,255,20,0.2)" }}
          >
            Deep Dive
          </span>
          <h2 className="mb-4 text-3xl font-bold text-text-primary sm:text-5xl">
            Built for the details.
          </h2>
          <p className="mx-auto max-w-xl text-sm leading-relaxed text-text-muted sm:text-lg">
            Thoughtful features designed to<br />make your workday feel effortless.
          </p>
        </motion.div>

        {/* Mobile: simple swipeable cards — no scroll animation, no visuals */}
        <div className="sm:hidden">
          <div
            ref={carouselRef}
            className="flex overflow-x-auto snap-x snap-mandatory touch-pan-x [&::-webkit-scrollbar]:hidden"
            style={{ scrollbarWidth: "none" }}
          >
            {WALKTHROUGH_ITEMS.map((item) => (
              <div key={item.id} className="w-full shrink-0 snap-start">
                <WalkthroughMobileCard
                  id={item.id}
                  label={item.label}
                  headline={item.headline}
                  description={item.description}
                  bullets={item.bullets}
                  screenshot={item.screenshot}
                  accentColor={item.accentColor}
                  mockupType={item.mockupType}
                />
              </div>
            ))}
          </div>

          {/* Dots */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-1.5">
            {WALKTHROUGH_ITEMS.map((_, i) => (
              <button
                key={i}
                aria-label={`Go to card ${i + 1}`}
                onClick={() =>
                  carouselRef.current?.scrollTo({
                    left: i * carouselRef.current.clientWidth,
                    behavior: "smooth",
                  })
                }
                className="rounded-full transition-all duration-300"
                style={{
                  width: activePage === i ? "1.5rem" : "0.375rem",
                  height: "0.375rem",
                  background: activePage === i ? "rgba(57,255,20,0.9)" : "rgba(255,255,255,0.2)",
                }}
              />
            ))}
          </div>
        </div>

        {/* Desktop: original sticky-scroll stacked cards — untouched */}
        <div className="hidden sm:block">
          {WALKTHROUGH_ITEMS.map((item, index) => (
            <WalkthroughItem
              key={item.id}
              {...item}
              index={index}
              total={WALKTHROUGH_ITEMS.length}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
