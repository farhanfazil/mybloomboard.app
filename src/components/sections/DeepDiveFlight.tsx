"use client";

import { ReactNode, useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";

interface DeepDiveFlightProps {
  children: ReactNode;
}

export function HolographicButterfly() {
  return (
    <div className="butterfly-shell" aria-hidden="true">
      <span className="butterfly-orb" />
      <span className="butterfly-trail butterfly-trail-one" />
      <span className="butterfly-trail butterfly-trail-two" />
      <span className="butterfly-trail butterfly-trail-three" />
      <svg
        className="butterfly-svg"
        viewBox="-24 -22 208 184"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="butterflyWing" x1="18" y1="10" x2="132" y2="128" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#f5f3ff" stopOpacity="0.95" />
            <stop offset="0.24" stopColor="#c4b5fd" stopOpacity="0.88" />
            <stop offset="0.52" stopColor="#8b5cf6" stopOpacity="0.78" />
            <stop offset="0.78" stopColor="#ec4899" stopOpacity="0.68" />
            <stop offset="1" stopColor="#60a5fa" stopOpacity="0.72" />
          </linearGradient>
          <radialGradient id="butterflyCore" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(80 72) rotate(90) scale(56 48)">
            <stop stopColor="#fff" />
            <stop offset="0.26" stopColor="#c4b5fd" />
            <stop offset="0.68" stopColor="#7c3aed" stopOpacity="0.58" />
            <stop offset="1" stopColor="#0b0216" stopOpacity="0" />
          </radialGradient>
        </defs>

        <ellipse cx="80" cy="72" rx="54" ry="62" fill="url(#butterflyCore)" opacity="0.18" />

        <g className="butterfly-left-wing">
          <path
            d="M76 68C54 23 20 6 10 20C1 34 15 72 70 78C47 82 15 99 24 120C33 141 67 124 78 78"
            fill="url(#butterflyWing)"
            fillOpacity="0.28"
            stroke="#c4b5fd"
            strokeOpacity="0.82"
            strokeWidth="1.6"
          />
          <path d="M70 69C47 47 30 29 16 22M70 75C42 70 24 59 11 39M70 82C47 95 36 111 28 124M64 80C47 83 33 89 23 101" stroke="#f5f3ff" strokeOpacity="0.35" strokeWidth="1.1" />
          <circle cx="38" cy="34" r="2.2" fill="#fff" opacity="0.75" />
          <circle cx="25" cy="49" r="1.6" fill="#c4b5fd" opacity="0.7" />
          <circle cx="40" cy="109" r="1.8" fill="#f0abfc" opacity="0.68" />
        </g>

        <g className="butterfly-right-wing">
          <path
            d="M84 68C106 23 140 6 150 20C159 34 145 72 90 78C113 82 145 99 136 120C127 141 93 124 82 78"
            fill="url(#butterflyWing)"
            fillOpacity="0.28"
            stroke="#c4b5fd"
            strokeOpacity="0.82"
            strokeWidth="1.6"
          />
          <path d="M90 69C113 47 130 29 144 22M90 75C118 70 136 59 149 39M90 82C113 95 124 111 132 124M96 80C113 83 127 89 137 101" stroke="#f5f3ff" strokeOpacity="0.35" strokeWidth="1.1" />
          <circle cx="122" cy="34" r="2.2" fill="#fff" opacity="0.75" />
          <circle cx="135" cy="49" r="1.6" fill="#c4b5fd" opacity="0.7" />
          <circle cx="120" cy="109" r="1.8" fill="#f0abfc" opacity="0.68" />
        </g>

        <path d="M80 42C76 52 75 66 76 82C77 100 79 118 80 128C81 118 83 100 84 82C85 66 84 52 80 42Z" fill="#faf5ff" opacity="0.86" />
        <path d="M80 44C75 35 68 29 61 26M80 44C85 35 92 29 99 26" stroke="#f5f3ff" strokeOpacity="0.7" strokeWidth="1.2" strokeLinecap="round" />
        <circle cx="80" cy="39" r="5" fill="#f5f3ff" opacity="0.82" />
      </svg>
    </div>
  );
}

export default function DeepDiveFlight({ children }: DeepDiveFlightProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 70%", "end 65%"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 48,
    damping: 26,
    mass: 0.55,
  });

  const x = useTransform(
    smoothProgress,
    [0, 0.12, 0.26, 0.42, 0.58, 0.74, 0.9, 1],
    shouldReduceMotion
      ? ["0vw", "0vw", "0vw", "0vw", "0vw", "0vw", "0vw", "0vw"]
      : ["30vw", "12vw", "-28vw", "-34vw", "24vw", "34vw", "-16vw", "8vw"],
  );
  const y = useTransform(
    smoothProgress,
    [0, 0.12, 0.26, 0.42, 0.58, 0.74, 0.9, 1],
    shouldReduceMotion
      ? ["-8vh", "-8vh", "-8vh", "-8vh", "-8vh", "-8vh", "-8vh", "-8vh"]
      : ["-18vh", "-30vh", "-18vh", "7vh", "18vh", "-7vh", "-24vh", "-12vh"],
  );
  const rotate = useTransform(
    smoothProgress,
    [0, 0.12, 0.26, 0.42, 0.58, 0.74, 0.9, 1],
    shouldReduceMotion ? [0, 0, 0, 0, 0, 0, 0, 0] : [-12, 10, -18, 16, -8, 18, -14, 8],
  );
  const scale = useTransform(
    smoothProgress,
    [0, 0.18, 0.38, 0.58, 0.78, 1],
    shouldReduceMotion ? [0.72, 0.72, 0.72, 0.72, 0.72, 0.72] : [0.7, 0.9, 0.74, 0.94, 0.78, 0.68],
  );
  const opacity = useTransform(smoothProgress, [0, 0.05, 0.82, 1], [0, 1, 1, 0]);

  return (
    <div ref={ref} className="relative">
      <div className="pointer-events-none absolute inset-0 z-30 hidden overflow-visible lg:block">
        <div className="sticky top-0 h-screen overflow-visible">
          <motion.div
            className="absolute left-1/2 top-1/2 will-change-transform"
            style={{ x, y, rotate, scale, opacity }}
          >
            <HolographicButterfly />
          </motion.div>
        </div>
      </div>
      {children}
    </div>
  );
}
