"use client";
import React, { useRef, useEffect } from "react";
import { useScroll, useSpring, useTransform, motion, MotionValue, type MotionStyle } from "framer-motion";

export const ContainerScroll = ({
  titleComponent,
  children,
}: {
  titleComponent: string | React.ReactNode;
  children: React.ReactNode;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const scaleDimensions = () => (isMobile ? [0.97, 1] : [1.035, 1]);
  const rotateRange = isMobile ? [0, 0] : [12, 0];
  const translateRange = isMobile ? [0, -28] : [0, -82];
  const springConfig = { stiffness: 72, damping: 22, mass: 0.8 };
  const rotate = useSpring(useTransform(scrollYProgress, [0, 1], rotateRange), springConfig);
  const scale = useSpring(useTransform(scrollYProgress, [0, 1], scaleDimensions()), springConfig);
  const translate = useSpring(useTransform(scrollYProgress, [0, 1], translateRange), springConfig);

  return (
    <div
      className="relative flex h-[40rem] items-start justify-center p-0 pt-16 sm:h-[56rem] sm:pt-20 md:h-[62rem] md:p-0 md:pt-28"
      ref={containerRef}
    >
      <div className="relative w-full py-8 sm:py-12 md:py-0" style={{ perspective: "1000px" }}>
        <Header translate={translate} titleComponent={titleComponent} />
        <Card rotate={rotate} translate={translate} scale={scale}>
          {children}
        </Card>
      </div>
    </div>
  );
};

export const Header = ({
  translate,
  titleComponent,
}: {
  translate: MotionValue<number>;
  titleComponent: React.ReactNode;
}) => (
  <motion.div style={{ translateY: translate }} className="mx-auto w-full max-w-[76rem] text-center">
    {titleComponent}
  </motion.div>
);

// ─── Injected CSS ────────────────────────────────────────────────────────────

/**
 * Layer 1 — STATIC ambient gradient border.
 * Always visible on every edge, no cursor required.
 * Uses the destination-out mask trick to reveal only the border strip.
 */
const GLOW_CSS = `
  .dd-glow-card {
    /* Permanent ring via box-shadow — covers all 4 edges at all times */
    box-shadow:
      0 0 0 1.5px rgba(77, 159, 255, 0.60),
      0 0 18px  4px rgba(77, 159, 255, 0.42),
      0 0 45px  9px rgba(100,150, 255, 0.20),
      0 0 90px 20px rgba( 77,130, 255, 0.10),
      0 10px 22px rgba(0,0,0,0.50),
      0 40px 40px rgba(0,0,0,0.42);
  }

  @media (max-width: 767px) {
    .dd-glow-card {
      box-shadow:
        0 0 0 1px rgba(77, 159, 255, 0.50),
        0 0 20px 5px rgba(77, 159, 255, 0.28),
        0 18px 40px rgba(0,0,0,0.48);
    }
  }

  /* Static full-perimeter gradient border — diagonal gradient so top/left also glow */
  .dd-glow-card::after {
    pointer-events: none;
    content: "";
    position: absolute;
    inset: 0;
    border: 2px solid transparent;
    border-radius: 25px;
    z-index: 2;
    background:
      linear-gradient(
        135deg,
        rgba(77,  159, 255, 0.65) 0%,
        rgba(130, 170, 255, 0.30) 25%,
        rgba( 77, 130, 255, 0.18) 50%,
        rgba(110, 165, 255, 0.30) 75%,
        rgba( 77, 159, 255, 0.65) 100%
      ) border-box;
    /* Standard — show only the 2px border strip */
    mask:
      linear-gradient(white, white) padding-box,
      linear-gradient(white, white) border-box;
    mask-composite: destination-out;
    /* Safari / older WebKit */
    -webkit-mask:
      linear-gradient(white, white) padding-box,
      linear-gradient(white, white) border-box;
    -webkit-mask-composite: destination-out;
  }

  /**
   * Layer 2 — JS-DRIVEN cursor spotlight border.
   * Sits above the static gradient; background set per-frame by pointermove.
   * Same mask trick — only the border strip is visible.
   */
  .dd-cursor-spot {
    pointer-events: none;
    position: absolute;
    inset: 0;
    border: 2px solid transparent;
    border-radius: 25px;
    z-index: 3;
    mask:
      linear-gradient(white, white) padding-box,
      linear-gradient(white, white) border-box;
    mask-composite: destination-out;
    -webkit-mask:
      linear-gradient(white, white) padding-box,
      linear-gradient(white, white) border-box;
    -webkit-mask-composite: destination-out;
    filter: brightness(2.5);
  }
`;

/** Pre-seeded card-face glow (visible before first mouse move) */
const SEED_FACE = [
  "radial-gradient(",
  "  700px 700px at 50% 50%,",
  "  hsl(213 100% 65% / 0.13) 0%,",
  "  hsl(230 80%  50% / 0.04) 45%,",
  "  transparent 70%",
  ")",
].join("\n");

// ─── Card ─────────────────────────────────────────────────────────────────────

export const Card = ({
  rotate,
  scale,
  children,
}: {
  rotate:    MotionValue<number>;
  scale:     MotionValue<number>;
  translate: MotionValue<number>;
  children:  React.ReactNode;
}) => {
  const cardRef    = useRef<HTMLDivElement>(null);
  const cursorRef  = useRef<HTMLDivElement>(null);   // cursor spotlight on border
  const faceRef    = useRef<HTMLDivElement>(null);   // cursor glow on card face

  // Seed face glow so it shows before the first mouse move
  useEffect(() => {
    if (faceRef.current) faceRef.current.style.background = SEED_FACE;
  }, []);

  useEffect(() => {
    const sync = (e: PointerEvent) => {
      if (!cardRef.current) return;

      // Element-relative coords — correct even inside a 3-D perspective/rotateX parent
      const rect  = cardRef.current.getBoundingClientRect();
      const rx    = (e.clientX - rect.left).toFixed(1);
      const ry    = (e.clientY - rect.top).toFixed(1);
      const xpRaw = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      const hue   = (213 + xpRaw * 50).toFixed(0);

      // ── Cursor spotlight on the border ──────────────────────────────────
      if (cursorRef.current) {
        cursorRef.current.style.backgroundImage = [
          "radial-gradient(",
          `  340px 340px at ${rx}px ${ry}px,`,
          `  hsl(${hue} 100% 72% / 1.0) 0%,`,
          "  transparent 100%",
          ") border-box,",
          "radial-gradient(",
          `  560px 560px at ${rx}px ${ry}px,`,
          `  hsl(${hue} 100% 62% / 0.5) 0%,`,
          "  transparent 100%",
          ") border-box",
        ].join("\n");
      }

      // ── Cursor glow on the card face ─────────────────────────────────────
      if (faceRef.current) {
        faceRef.current.style.background = [
          "radial-gradient(",
          `  600px 600px at ${rx}px ${ry}px,`,
          `  hsl(${hue} 100% 65% / 0.18) 0%,`,
          `  hsl(${hue} 80%  50% / 0.05) 42%,`,
          "  transparent 70%",
          ")",
        ].join("\n");
      }
    };

    document.addEventListener("pointermove", sync);
    return () => document.removeEventListener("pointermove", sync);
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: GLOW_CSS }} />

      <motion.div
        ref={cardRef}
        className="dd-glow-card relative z-10 mx-auto mt-3 aspect-[2188/1710] w-full max-w-[94vw]
                   rounded-[18px] p-[4px] sm:-mt-7 sm:max-w-3xl md:-mt-10 md:h-[46rem]
                   md:max-w-5xl md:rounded-[24px] md:p-[6px]"
        style={{
          rotateX: rotate,
          scale,
          backgroundColor: "rgba(10,15,28,0.98)",
        } as MotionStyle}
      >
        {/* Layer 2 — JS cursor spotlight on border */}
        <div ref={cursorRef} className="dd-cursor-spot" />

        {/* Card-face ambient glow — pre-seeded, cursor-updated */}
        <div
          ref={faceRef}
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "22px",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        {/* App content */}
        <div
          className="h-full w-full overflow-hidden rounded-[22px] relative"
          style={{ background: "#080d1a", zIndex: 1 }}
        >
          {children}
        </div>
      </motion.div>
    </>
  );
};
