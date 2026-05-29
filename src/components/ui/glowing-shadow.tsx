"use client";

import type { ReactNode } from "react";

interface GlowingShadowProps {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
}

export function GlowingShadow({
  children,
  className = "",
  contentClassName = "",
}: GlowingShadowProps) {
  return (
    <>
      <style jsx>{`
        @property --hue {
          syntax: "<number>";
          inherits: true;
          initial-value: 0;
        }
        @property --bg-x {
          syntax: "<number>";
          inherits: true;
          initial-value: 14;
        }
        @property --bg-y {
          syntax: "<number>";
          inherits: true;
          initial-value: 0;
        }

        .glow-container {
          --card-color: hsl(260deg 100% 3%);
          --card-radius: inherit;
          --animation-speed: 5.5s;
          --border-width: 3px;
          --hue: 286;
          --bg-x: 14;
          --bg-y: 0;

          position: relative;
          z-index: 2;
          width: 100%;
          height: 100%;
          border-radius: inherit;
          color: white;
          overflow: visible;
        }

        .glow-content {
          position: absolute;
          inset: 0;
          z-index: 2;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          border-radius: inherit;
          background: var(--card-color);
          padding: 0;
          box-shadow: 0 28px 70px rgba(0, 0, 0, 0.58);
        }

        .glow-content:before {
          content: "";
          position: absolute;
          inset: 0;
          z-index: 3;
          pointer-events: none;
          border: var(--border-width) solid transparent;
          border-radius: inherit;
          background:
            radial-gradient(
                18% 18% at calc(var(--bg-x) * 1%) calc(var(--bg-y) * 1%),
                hsl(calc(var(--hue) * 1deg) 100% 92% / 1) 0%,
                hsl(calc(var(--hue) * 1deg) 100% 70% / 0.86) 34%,
                transparent 72%
              )
              border-box,
            linear-gradient(
                145deg,
                rgb(255 255 255 / 0.22),
                rgb(255 255 255 / 0.04) 38%,
                rgb(255 255 255 / 0.14)
              )
              border-box;
          mask:
            linear-gradient(white, white) padding-box,
            linear-gradient(white, white) border-box;
          mask-composite: exclude;
          -webkit-mask:
            linear-gradient(white, white) padding-box,
            linear-gradient(white, white) border-box;
          -webkit-mask-composite: xor;
          animation:
            hue-animation var(--animation-speed) linear infinite,
            border-run var(--animation-speed) linear infinite;
        }

        .glow {
          position: absolute;
          z-index: 1;
          top: -2%;
          left: 14%;
          width: 17%;
          aspect-ratio: 1;
          transform: translate(-50%, -50%);
          border-radius: 999px;
          pointer-events: none;
          animation:
            hue-animation var(--animation-speed) linear infinite,
            edge-run var(--animation-speed) linear infinite;
        }

        .edge-streak {
          position: absolute;
          z-index: 6;
          top: -1.5px;
          left: 14%;
          width: 20%;
          height: 3px;
          pointer-events: none;
          border-radius: 999px;
          background: linear-gradient(
            90deg,
            transparent,
            hsl(calc(var(--hue) * 1deg) 100% 86% / 0.25),
            hsl(calc(var(--hue) * 1deg) 100% 78% / 1),
            hsl(calc(var(--hue) * 1deg) 100% 92% / 1),
            hsl(calc(var(--hue) * 1deg) 100% 70% / 0.7),
            transparent
          );
          box-shadow:
            0 0 10px hsl(calc(var(--hue) * 1deg) 100% 68% / 0.8),
            0 0 24px hsl(calc(var(--hue) * 1deg) 100% 62% / 0.42);
          filter: saturate(1.2);
          animation:
            hue-animation var(--animation-speed) linear infinite,
            edge-streak-run var(--animation-speed) linear infinite;
        }

        .glow:before,
        .glow:after {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background: hsl(calc(var(--hue) * 1deg) 100% 62%);
        }

        .glow:before {
          filter: blur(38px);
          opacity: 0.34;
          transform: scaleX(1.45) scaleY(0.82);
        }

        .glow:after {
          inset: 34%;
          filter: blur(10px);
          opacity: 0.42;
        }

        @media (max-width: 767px) {
          .glow {
            width: 24%;
          }

          .glow:before {
            filter: blur(30px);
            opacity: 0.44;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .glow,
          .edge-streak,
          .glow-content:before {
            animation: none;
          }
        }

        @keyframes edge-run {
          0% {
            top: -2%;
            left: 14%;
          }
          22% {
            top: -2%;
            left: 86%;
          }
          34% {
            top: 20%;
            left: 101%;
          }
          50% {
            top: 100%;
            left: 86%;
          }
          72% {
            top: 100%;
            left: 14%;
          }
          86% {
            top: 20%;
            left: -1%;
          }
          100% {
            top: -2%;
            left: 14%;
          }
        }

        @keyframes border-run {
          0% {
            --bg-x: 14;
            --bg-y: 0;
          }
          22% {
            --bg-x: 86;
            --bg-y: 0;
          }
          34% {
            --bg-x: 100;
            --bg-y: 20;
          }
          50% {
            --bg-x: 86;
            --bg-y: 100;
          }
          72% {
            --bg-x: 14;
            --bg-y: 100;
          }
          86% {
            --bg-x: 0;
            --bg-y: 20;
          }
          100% {
            --bg-x: 14;
            --bg-y: 0;
          }
        }

        @keyframes edge-streak-run {
          0% {
            top: -1.5px;
            left: 12%;
            width: 20%;
            height: 3px;
            transform: rotate(0deg);
          }
          22% {
            top: -1.5px;
            left: 68%;
            width: 20%;
            height: 3px;
            transform: rotate(0deg);
          }
          34% {
            top: 18%;
            left: calc(100% - 1.5px);
            width: 3px;
            height: 20%;
            transform: rotate(0deg);
          }
          50% {
            top: 78%;
            left: calc(100% - 1.5px);
            width: 3px;
            height: 20%;
            transform: rotate(0deg);
          }
          72% {
            top: calc(100% - 1.5px);
            left: 68%;
            width: 20%;
            height: 3px;
            transform: rotate(180deg);
          }
          86% {
            top: 18%;
            left: -1.5px;
            width: 3px;
            height: 20%;
            transform: rotate(180deg);
          }
          100% {
            top: -1.5px;
            left: 12%;
            width: 20%;
            height: 3px;
            transform: rotate(0deg);
          }
        }

        @keyframes hue-animation {
          0% {
            --hue: 286;
          }
          28% {
            --hue: 320;
          }
          48% {
            --hue: 215;
          }
          72% {
            --hue: 178;
          }
          100% {
            --hue: 286;
          }
        }
      `}</style>

      <div className={`glow-container ${className}`}>
        <span className="glow" aria-hidden="true" />
        <span className="edge-streak" aria-hidden="true" />
        <div className={`glow-content ${contentClassName}`}>{children}</div>
      </div>
    </>
  );
}
