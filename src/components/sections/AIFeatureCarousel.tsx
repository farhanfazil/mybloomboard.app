"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const aiCards = [
  {
    title: "AI Features",
    src: "/ai-cards/01-ai-hub.png",
    alt: "AI features built to save time and protect team productivity",
  },
  {
    title: "AI Chief of Staff",
    src: "/ai-cards/02-ai-chief.png",
    alt: "AI Chief of Staff card",
  },
  {
    title: "Mood Avatars",
    src: "/ai-cards/03-avatars.png",
    alt: "Avatar selection card",
  },
  {
    title: "Bloom AI",
    src: "/ai-cards/04-bloom.png",
    alt: "Bloom AI assistant card",
  },
  {
    title: "Daily Recap",
    src: "/ai-cards/05-daily-recap.png",
    alt: "Daily recap card",
  },
  {
    title: "Email & Messages",
    src: "/ai-cards/06-email-messages.png",
    alt: "AI email and messages card",
  },
  {
    title: "I Am Stuck",
    src: "/ai-cards/07-i-am-stuck.png",
    alt: "I am stuck AI support card",
  },
];

export default function AIFeatureCarousel() {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const scrollToCard = (index: number) => {
    const scroller = scrollerRef.current;
    const card = scroller?.querySelector<HTMLElement>(`[data-ai-card="${index}"]`);
    if (!scroller || !card) return;

    card.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  };

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    let frame = 0;
    const updateActiveCard = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const center = scroller.scrollLeft + scroller.clientWidth / 2;
        let closestIndex = 0;
        let closestDistance = Number.POSITIVE_INFINITY;

        aiCards.forEach((_, index) => {
          const card = scroller.querySelector<HTMLElement>(`[data-ai-card="${index}"]`);
          if (!card) return;

          const cardCenter = card.offsetLeft + card.offsetWidth / 2;
          const distance = Math.abs(center - cardCenter);
          const distanceRatio = Math.min(distance / (card.offsetWidth * 0.7), 1);
          const exposure = 1 - distanceRatio;
          const scale = 0.955 + exposure * 0.045;
          const opacity = 0.78 + exposure * 0.22;
          const brightness = 0.72 + exposure * 0.28;
          const saturation = 0.78 + exposure * 0.22;
          const dimOpacity = 0.22 - exposure * 0.22;
          const glowOpacity = exposure * 0.92;

          card.style.setProperty("--card-scale", scale.toFixed(4));
          card.style.setProperty("--card-opacity", opacity.toFixed(4));
          card.style.setProperty("--image-brightness", brightness.toFixed(4));
          card.style.setProperty("--image-saturation", saturation.toFixed(4));
          card.style.setProperty("--dim-opacity", dimOpacity.toFixed(4));
          card.style.setProperty("--glow-opacity", glowOpacity.toFixed(4));

          if (distance < closestDistance) {
            closestDistance = distance;
            closestIndex = index;
          }
        });

        setActiveIndex(closestIndex);
      });
    };

    updateActiveCard();
    const settleTimer = window.setTimeout(updateActiveCard, 180);
    scroller.addEventListener("scroll", updateActiveCard, { passive: true });
    window.addEventListener("resize", updateActiveCard);

    return () => {
      window.clearTimeout(settleTimer);
      cancelAnimationFrame(frame);
      scroller.removeEventListener("scroll", updateActiveCard);
      window.removeEventListener("resize", updateActiveCard);
    };
  }, []);

  return (
    <section id="ai-features" className="relative overflow-hidden bg-[#050505] py-16 sm:py-24">
      <style jsx>{`
        .ai-carousel-scroll {
          scrollbar-width: none;
        }

        .ai-carousel-scroll::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      <div className="mx-auto mb-10 max-w-5xl px-4 text-center sm:mb-14 sm:px-6">
        <span className="mb-4 inline-flex rounded-full border border-violet-400/25 bg-violet-400/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.24em] text-violet-200">
          AI Feature
        </span>
        <h2 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
          Intelligence, beautifully built in.
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-text-muted sm:text-lg">
          Swipe through Bloombooard&apos;s AI layer for recaps, signals, planning, writing, and focused support.
        </p>
      </div>

      <div className="relative">
        <div
          ref={scrollerRef}
          className="ai-carousel-scroll flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-[7vw] pb-9 sm:gap-7 sm:px-[9vw]"
        >
          {aiCards.map((card, index) => (
            (() => {
              const isActive = activeIndex === index;

              return (
                <article
                  key={card.src}
                  data-ai-card={index}
                  aria-current={isActive ? "true" : undefined}
                  className="group relative w-[86vw] shrink-0 snap-center overflow-hidden rounded-[30px] border bg-[#090909] shadow-[0_30px_120px_rgba(0,0,0,0.76)] transition-[transform,opacity,border-color,box-shadow] duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform sm:w-[78vw] sm:rounded-[42px] lg:w-[72vw] xl:w-[68vw]"
                  style={{
                    transform: `scale(var(--card-scale, ${isActive ? "1" : "0.955"}))`,
                    opacity: `var(--card-opacity, ${isActive ? "1" : "0.78"})`,
                    borderColor: isActive ? "rgba(255,255,255,0.16)" : "rgba(255,255,255,0.06)",
                    boxShadow: isActive
                      ? "0 38px 150px rgba(0,0,0,0.72), 0 0 90px rgba(124,58,237,0.16)"
                      : "0 24px 90px rgba(0,0,0,0.78)",
                  }}
                >
                  <div
                    className="pointer-events-none absolute inset-0 z-10 rounded-[inherit] bg-[linear-gradient(135deg,rgba(255,255,255,0.12),transparent_18%,transparent_72%,rgba(255,255,255,0.05))] opacity-[calc(0.3_+_(var(--glow-opacity,0)_*_0.6))] transition-opacity duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
                  />
                  <div
                    className="pointer-events-none absolute -inset-x-12 -top-20 z-10 h-44 bg-[radial-gradient(circle,rgba(167,139,250,0.3),transparent_62%)] opacity-[var(--glow-opacity,0)] blur-2xl transition-opacity duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
                  />
                  <Image
                    src={card.src}
                    alt={card.alt}
                    width={1675}
                    height={939}
                    className="block aspect-[16/9] h-auto w-full object-cover transition-[filter] duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
                    style={{
                      filter: `brightness(var(--image-brightness, ${isActive ? "1" : "0.72"})) saturate(var(--image-saturation, ${isActive ? "1" : "0.78"}))`,
                    }}
                    sizes="(max-width: 640px) 86vw, (max-width: 1024px) 78vw, 68vw"
                    unoptimized
                  />
                  <div
                    className="pointer-events-none absolute inset-0 z-20 bg-black transition-opacity duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
                    style={{ opacity: `var(--dim-opacity, ${isActive ? "0" : "0.22"})` }}
                  />
                </article>
              );
            })()
          ))}
        </div>

        <div className="pointer-events-none absolute inset-y-0 left-0 w-[12vw] bg-gradient-to-r from-[#050505] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-[12vw] bg-gradient-to-l from-[#050505] to-transparent" />
      </div>

      <div className="mx-auto flex w-fit items-center gap-4 rounded-full border border-white/10 bg-white/[0.08] px-4 py-3 backdrop-blur-xl">
        <button
          type="button"
          aria-label="Previous AI feature"
          onClick={() => scrollToCard(Math.max(activeIndex - 1, 0))}
          className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white transition duration-300 hover:scale-105 hover:bg-white/18 active:scale-95 disabled:opacity-40"
          disabled={activeIndex === 0}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2">
          {aiCards.map((card, index) => (
            <button
              key={card.src}
              type="button"
              aria-label={`Go to ${card.title}`}
              onClick={() => scrollToCard(index)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                activeIndex === index ? "w-10 bg-white" : "w-2.5 bg-white/42 hover:bg-white/70"
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          aria-label="Next AI feature"
          onClick={() => scrollToCard(Math.min(activeIndex + 1, aiCards.length - 1))}
          className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white transition duration-300 hover:scale-105 hover:bg-white/18 active:scale-95 disabled:opacity-40"
          disabled={activeIndex === aiCards.length - 1}
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </section>
  );
}
