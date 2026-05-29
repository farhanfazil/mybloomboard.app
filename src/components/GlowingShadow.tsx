"use client";

import type { ReactNode } from "react";

export function GlowingShadow({ children }: { children: ReactNode }) {
  return (
    <>
      <style jsx>{`
        @property --angle {
          syntax: "<number>";
          inherits: true;
          initial-value: 0;
        }
        @property --hue {
          syntax: "<number>";
          inherits: true;
          initial-value: 0;
        }

        /* Outer wrapper — holds glow ring + content */
        .glow-container {
          position: relative;
          width: 100%;
          height: 100%;
          border-radius: inherit;
        }

        /*
         * The glow ring lives on its own element so its opacity can be
         * animated independently — the card content never fades.
         */
        .glow-ring {
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background: conic-gradient(
            from calc(var(--angle) * 1deg),
            transparent 0%,
            transparent 28%,
            hsl(calc(var(--hue) * 1deg) 100% 55%) 34%,
            hsl(calc(var(--hue) * 1deg) 100% 82%) 38%,
            hsl(calc(var(--hue) * 1deg) 100% 92%) 41%,
            hsl(calc(var(--hue) * 1deg) 100% 82%) 44%,
            hsl(calc(var(--hue) * 1deg) 100% 55%) 47%,
            transparent 53%,
            transparent 78%,
            hsl(calc((var(--hue) + 150) * 1deg) 100% 55%) 84%,
            hsl(calc((var(--hue) + 150) * 1deg) 100% 82%) 88%,
            hsl(calc((var(--hue) + 150) * 1deg) 100% 92%) 91%,
            hsl(calc((var(--hue) + 150) * 1deg) 100% 82%) 94%,
            hsl(calc((var(--hue) + 150) * 1deg) 100% 55%) 97%,
            transparent 100%
          );
          animation:
            orbit      4s   linear     infinite,
            hue-cycle  6s   linear     infinite,
            heartbeat  3.8s ease-in-out infinite;
        }

        /*
         * Soft bloom — same gradient blurred outward to create
         * a gentle halo around the sharp ring arcs.
         */
        .glow-bloom {
          position: absolute;
          inset: -4px;
          border-radius: inherit;
          background: conic-gradient(
            from calc(var(--angle) * 1deg),
            transparent 0%,
            transparent 28%,
            hsl(calc(var(--hue) * 1deg) 100% 55%) 34%,
            hsl(calc(var(--hue) * 1deg) 100% 82%) 38%,
            hsl(calc(var(--hue) * 1deg) 100% 92%) 41%,
            hsl(calc(var(--hue) * 1deg) 100% 82%) 44%,
            hsl(calc(var(--hue) * 1deg) 100% 55%) 47%,
            transparent 53%,
            transparent 78%,
            hsl(calc((var(--hue) + 150) * 1deg) 100% 55%) 84%,
            hsl(calc((var(--hue) + 150) * 1deg) 100% 82%) 88%,
            hsl(calc((var(--hue) + 150) * 1deg) 100% 92%) 91%,
            hsl(calc((var(--hue) + 150) * 1deg) 100% 82%) 94%,
            hsl(calc((var(--hue) + 150) * 1deg) 100% 55%) 97%,
            transparent 100%
          );
          filter: blur(10px);
          opacity: 0.45;
          animation:
            orbit      4s   linear     infinite,
            hue-cycle  6s   linear     infinite,
            heartbeat  3.8s ease-in-out infinite;
        }

        /* Card content sits above the ring */
        .glow-content {
          position: absolute;
          inset: 1.5px;
          border-radius: 15px;
          overflow: hidden;
          background: #0a0014;
          z-index: 1;
        }

        @media (min-width: 768px) {
          .glow-content {
            border-radius: 21px;
          }
        }

        @keyframes orbit {
          from { --angle: 0; }
          to   { --angle: 360; }
        }

        @keyframes hue-cycle {
          from { --hue: 0; }
          to   { --hue: 360; }
        }

        /*
         * Slow organic pulse — smooth sine-like fade with irregular timing
         * so it never feels mechanical. Duration 7s keeps it very relaxed.
         */
        @keyframes heartbeat {
          0%   { opacity: 1;    }
          22%  { opacity: 0.12; }
          45%  { opacity: 0.9;  }
          62%  { opacity: 0.18; }
          80%  { opacity: 1;    }
          100% { opacity: 1;    }
        }
      `}</style>

      <div className="glow-container">
        <div className="glow-bloom" aria-hidden="true" />
        <div className="glow-ring" aria-hidden="true" />
        <div className="glow-content">{children}</div>
      </div>
    </>
  );
}
