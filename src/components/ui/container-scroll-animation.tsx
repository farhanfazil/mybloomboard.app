"use client";
import React, { useRef } from "react";
import { useScroll, useSpring, useTransform, motion, MotionValue, type MotionStyle } from "framer-motion";
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
      className="relative flex h-[38rem] items-start justify-center p-0 pt-12 sm:h-[64rem] sm:pt-20 md:h-[72rem] md:p-0 md:pt-28"
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
  return (
    <motion.div
      className="relative z-10 mx-auto mt-1 aspect-[2196/1658] w-full max-w-[96vw]
                 sm:mt-3
                 rounded-[18px] sm:-mt-7 sm:max-w-3xl md:-mt-10
                 md:max-w-5xl md:rounded-[24px]"
      style={{
        rotateX: rotate,
        scale,
      } as MotionStyle}
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
  );
};
