"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const freelanceSmartCards = [
  {
    title: "Dashboard",
    src: "/freelance-smart-cards/01-dashboard.png",
    alt: "Freelance business dashboard",
  },
  {
    title: "Client Workspace",
    src: "/freelance-smart-cards/02-client-workspace.png",
    alt: "Client workspace for freelance projects",
  },
  {
    title: "Projects",
    src: "/freelance-smart-cards/03-projects.png",
    alt: "Freelance project management workspace",
  },
  {
    title: "Smart Pricing",
    src: "/freelance-smart-cards/04-smart-pricing.png",
    alt: "Smart pricing engine for freelance work",
  },
  {
    title: "Client Portal",
    src: "/freelance-smart-cards/05-client-portal.png",
    alt: "Client portal for approvals and delivery",
  },
  {
    title: "Revisions",
    src: "/freelance-smart-cards/06-revisions.png",
    alt: "Revision tracker for client work",
  },
  {
    title: "Asset Delivery Hub",
    src: "/freelance-smart-cards/07-asset-delivery-hub.png",
    alt: "Asset delivery hub for client files",
  },
  {
    title: "Invoices",
    src: "/freelance-smart-cards/08-invoices.png",
    alt: "Freelance invoice management",
  },
  {
    title: "Contracts",
    src: "/freelance-smart-cards/09-contracts.png",
    alt: "Contract generation for freelance projects",
  },
  {
    title: "Proposals",
    src: "/freelance-smart-cards/10-proposals.png",
    alt: "Proposal builder for freelance clients",
  },
  {
    title: "Personalize",
    src: "/freelance-smart-cards/11-personalize.png",
    alt: "Personalized freelance workspace",
  },
  {
    title: "Payments",
    src: "/freelance-smart-cards/12-payments.png",
    alt: "Freelance payment tracking and management",
  },
];

export default function FreelanceSmartAIFeatures() {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const scrollToCard = (index: number) => {
    const scroller = scrollerRef.current;
    const card = scroller?.querySelector<HTMLElement>(`[data-freelance-smart-card="${index}"]`);
    if (!scroller || !card) return;

    card.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });

    // Signal butterfly to jump to a new spot
    window.dispatchEvent(new CustomEvent("carouselNav"));
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

        freelanceSmartCards.forEach((_, index) => {
          const card = scroller.querySelector<HTMLElement>(`[data-freelance-smart-card="${index}"]`);
          if (!card) return;

          const cardCenter = card.offsetLeft + card.offsetWidth / 2;
          const distance = Math.abs(center - cardCenter);
          const distanceRatio = Math.min(distance / (card.offsetWidth * 0.72), 1);
          const exposure = 1 - distanceRatio;
          const scale = 0.955 + exposure * 0.045;
          const opacity = 0.78 + exposure * 0.22;
          const brightness = 0.7 + exposure * 0.3;
          const saturation = 0.78 + exposure * 0.22;
          const dimOpacity = 0.24 - exposure * 0.24;
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
    <section id="freelance-smart-ai" className="relative overflow-hidden bg-[#050505] py-16 sm:py-24">
      <style jsx>{`
        .freelance-smart-scroll {
          scrollbar-width: none;
        }

        .freelance-smart-scroll::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      <div className="mx-auto mb-10 max-w-5xl px-4 text-center sm:mb-14 sm:px-6">
        <span className="mb-4 inline-flex text-xs font-bold uppercase tracking-[0.24em] text-violet-200">
          Smart AI Features
        </span>
        <h2 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
          Intelligence for client work.
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-text-muted sm:text-lg">
          Swipe through the freelance layer for clients, projects, pricing, portals, invoices, contracts, proposals, payments, and delivery.
        </p>
      </div>

      <div className="relative">
        <div
          ref={scrollerRef}
          className="freelance-smart-scroll flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-[7vw] pb-9 sm:gap-7 sm:px-[9vw]"
        >
          {freelanceSmartCards.map((card, index) => {
            const isActive = activeIndex === index;

            return (
              <article
                key={card.src}
                data-freelance-smart-card={index}
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
                <div className="pointer-events-none absolute inset-0 z-10 rounded-[inherit] bg-[linear-gradient(135deg,rgba(255,255,255,0.12),transparent_18%,transparent_72%,rgba(255,255,255,0.05))] opacity-[calc(0.3_+_(var(--glow-opacity,0)_*_0.6))] transition-opacity duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)]" />
                <div className="pointer-events-none absolute -inset-x-12 -top-20 z-10 h-44 bg-[radial-gradient(circle,rgba(167,139,250,0.3),transparent_62%)] opacity-[var(--glow-opacity,0)] blur-2xl transition-opacity duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)]" />
                <Image
                  src={card.src}
                  alt={card.alt}
                  width={1675}
                  height={939}
                  className="block aspect-[16/9] h-auto w-full object-cover transition-[filter] duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
                  style={{
                    filter: `brightness(var(--image-brightness, ${isActive ? "1" : "0.7"})) saturate(var(--image-saturation, ${isActive ? "1" : "0.78"}))`,
                  }}
                  sizes="(max-width: 640px) 86vw, (max-width: 1024px) 78vw, 68vw"
                  quality={80}
                />
                <div
                  className="pointer-events-none absolute inset-0 z-20 bg-black transition-opacity duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
                  style={{ opacity: `var(--dim-opacity, ${isActive ? "0" : "0.24"})` }}
                />
              </article>
            );
          })}
        </div>

        <div className="pointer-events-none absolute inset-y-0 left-0 w-[12vw] bg-gradient-to-r from-[#050505] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-[12vw] bg-gradient-to-l from-[#050505] to-transparent" />
      </div>

      <div className="mx-auto flex w-fit items-center gap-3 px-4 py-3 sm:gap-4">
        <button
          type="button"
          aria-label="Previous freelance AI feature"
          onClick={() => scrollToCard(Math.max(activeIndex - 1, 0))}
          className="grid h-7 w-7 place-items-center rounded-full transition duration-300 hover:scale-105 active:scale-95 sm:h-10 sm:w-10"
          style={{
            background: "rgba(255,255,255,0.22)",
            border: "none",
            color: "rgba(255,255,255,0.95)",
            opacity: activeIndex === 0 ? 0.35 : 1,
          }}
          disabled={activeIndex === 0}
        >
          <ChevronLeft className="h-3.5 w-3.5 sm:h-5 sm:w-5" />
        </button>

        <div className="flex shrink-0 items-center gap-1 sm:gap-1.5">
          {freelanceSmartCards.map((card, index) => (
            <button
              key={card.src}
              type="button"
              aria-label={`Go to ${card.title}`}
              onClick={() => scrollToCard(index)}
              className="h-1.5 rounded-full transition-all duration-300 sm:h-2.5"
              style={{
                width: activeIndex === index ? (isDesktop ? "2rem" : "1.25rem") : (isDesktop ? "0.5rem" : "0.375rem"),
                background: activeIndex === index ? "rgba(255,255,255,1)" : "rgba(255,255,255,0.2)",
              }}
            />
          ))}
        </div>

        <button
          type="button"
          aria-label="Next freelance AI feature"
          onClick={() => scrollToCard(Math.min(activeIndex + 1, freelanceSmartCards.length - 1))}
          className="grid h-7 w-7 place-items-center rounded-full transition duration-300 hover:scale-105 active:scale-95 sm:h-10 sm:w-10"
          style={{
            background: "rgba(255,255,255,0.22)",
            border: "none",
            color: "rgba(255,255,255,0.95)",
            opacity: activeIndex === freelanceSmartCards.length - 1 ? 0.35 : 1,
          }}
          disabled={activeIndex === freelanceSmartCards.length - 1}
        >
          <ChevronRight className="h-3.5 w-3.5 sm:h-5 sm:w-5" />
        </button>
      </div>
    </section>
  );
}
