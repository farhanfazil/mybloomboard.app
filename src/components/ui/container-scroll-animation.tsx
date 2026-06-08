"use client";
import React, { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useScroll, useSpring, useTransform, motion, useInView, MotionValue, type MotionStyle } from "framer-motion";
import { GlowingShadow } from "@/components/GlowingShadow";

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
      className="relative flex h-[32rem] items-start justify-center p-0 pt-14 sm:h-[64rem] sm:pt-20 md:h-[72rem] md:p-0 md:pt-28"
      ref={containerRef}
    >
      <div className="relative w-full py-8 sm:py-12 md:py-0" style={{ perspective: "1000px" }}>
        <Header translate={translate} titleComponent={titleComponent} />
        <Card rotate={rotate} translate={translate} scale={scale} isMobile={isMobile}>
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

// ─── Card ─────────────────────────────────────────────────────────────────────

type CardRect = { top: number; left: number; width: number; height: number };

export const Card = ({
  rotate,
  scale,
  isMobile,
  children,
}: {
  rotate:    MotionValue<number>;
  scale:     MotionValue<number>;
  translate: MotionValue<number>;
  isMobile:  boolean;
  children:  React.ReactNode;
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: "-10%" });

  // Portal overlay state
  const [mounted, setMounted] = useState(false);
  const [overlayActive, setOverlayActive] = useState(false);
  const [cardRect, setCardRect] = useState<CardRect | null>(null);

  useEffect(() => { setMounted(true); }, []);

  // When card enters view on mobile, capture rect and fire overlay
  useEffect(() => {
    if (!isMobile || !isInView || overlayActive) return;
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    setCardRect({ top: rect.top, left: rect.left, width: rect.width, height: rect.height });
    setOverlayActive(true);

    // Animation: 0.7s delay + 6.2s duration + 0.5s buffer = 7.4s
    const timer = setTimeout(() => setOverlayActive(false), 7400);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile, isInView]);

  const tiltIn  = 0.6 / 6.2;  // ≈ 0.097
  const tiltOut = 5.6 / 6.2;  // ≈ 0.903

  return (
    <>
      {/* ── Static card (always rendered for layout; dims while portal plays) ── */}
      <motion.div
        ref={cardRef}
        className="relative z-10 mx-auto mt-6 aspect-[2196/1658] w-full max-w-[96vw]
                   sm:mt-3 rounded-[18px] sm:-mt-7 sm:max-w-3xl md:-mt-10
                   md:max-w-5xl md:rounded-[24px]"
        animate={{ opacity: overlayActive ? 0 : 1 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className="h-full w-full rounded-[18px] md:rounded-[24px]"
          style={{ rotateX: rotate, scale } as MotionStyle}
        >
          <GlowingShadow>
            <div
              className="relative h-full w-full overflow-hidden rounded-[16px] md:rounded-[20px]"
              style={{ background: "#0a0014", zIndex: 4 }}
            >
              {children}
            </div>
          </GlowingShadow>
        </motion.div>
      </motion.div>

      {/* ── Portal overlay: rendered in document.body — no parent can clip it ── */}
      {mounted && overlayActive && cardRect && createPortal(
        /* Fixed full-screen wrapper provides the perspective depth so
           rotateY renders as a true 3D tilt, not a flat affine squeeze */
        <div
          className="pointer-events-none"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 99999,
            perspective: "1200px",
            perspectiveOrigin: `${cardRect.left + cardRect.width / 2}px ${cardRect.top + cardRect.height / 2}px`,
          }}
        >
          <motion.div
            style={{
              position: "absolute",
              top:    cardRect.top,
              left:   cardRect.left,
              width:  cardRect.width,
              height: cardRect.height,
              transformOrigin: "center 35%",
              borderRadius: "18px",
            } as React.CSSProperties}
            animate={{ scale: [1, 1.72, 1.72, 1], rotateY: [0, -45, -45, 0] }}
            transition={{
              duration: 6.2,
              delay: 0.7,
              times: [0, tiltIn, tiltOut, 1],
              ease: "easeInOut",
            }}
          >
            <GlowingShadow>
              <div
                className="relative h-full w-full overflow-hidden rounded-[16px]"
                style={{ background: "#0a0014" }}
              >
                {children}
              </div>
            </GlowingShadow>
          </motion.div>
        </div>,
        document.body
      )}
    </>
  );
};
