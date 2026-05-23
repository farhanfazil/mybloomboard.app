"use client";

/**
 * ShineBorder
 * ───────────
 * Animated rotating-radial-gradient border effect.
 * Purely CSS-driven — no pointer tracking, no JS frame loop.
 *
 * Design notes:
 *  - The outer <div> is `position: relative` so the ::before pseudo-element
 *    (injected via the inner overlay div) stays clipped to the card.
 *  - The inner overlay div uses a ::before pseudo-element with:
 *      • background: radial-gradient (the coloured sweep)
 *      • mask: content-box + border-box, composite:exclude
 *        → reveals ONLY the N-px border strip, leaves interior untouched.
 *      • background-size: 300% 300%; animation: shine
 *        → the gradient travels around the card continuously.
 *  - `pointer-events-none` on the overlay so it never blocks clicks.
 *  - `style` prop is forwarded to the outer div so callers can pass inline
 *    styles (background, backdropFilter, etc.) alongside Tailwind className.
 */

import { cn } from "@/lib/utils";

type TColorProp = string | string[];

interface ShineBorderProps {
  /** CSS border-radius in px (default 8). */
  borderRadius?: number;
  /** Border width in px (default 1). */
  borderWidth?: number;
  /** Full rotation period in seconds (default 14). */
  duration?: number;
  /** One colour string or an array of colour stops for the sweep gradient. */
  color?: TColorProp;
  /** Merged into the outer wrapper div via cn(). */
  className?: string;
  /** Forwarded as inline style on the outer wrapper div. */
  style?: React.CSSProperties;
  children: React.ReactNode;
}

export function ShineBorder({
  borderRadius = 8,
  borderWidth = 1,
  duration = 14,
  color = "#000000",
  className,
  style,
  children,
}: ShineBorderProps) {
  const colorStops = Array.isArray(color) ? color.join(",") : color;

  return (
    <div
      style={
        {
          "--border-radius": `${borderRadius}px`,
          borderRadius: `${borderRadius}px`,
          ...style,
        } as React.CSSProperties
      }
      className={cn("relative", className)}
    >
      {/* ── Animated border overlay ───────────────────────────────────── */}
      <div
        style={
          {
            "--border-width": `${borderWidth}px`,
            "--border-radius": `${borderRadius}px`,
            "--duration": `${duration}s`,
            "--mask-linear-gradient":
              "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            "--background-radial-gradient": `radial-gradient(transparent,transparent,${colorStops},transparent,transparent)`,
          } as React.CSSProperties
        }
        className={[
          "pointer-events-none",
          "before:absolute before:inset-0",
          "before:size-full",
          "before:rounded-[--border-radius]",
          "before:p-[--border-width]",
          "before:content-['']",
          "before:will-change-[background-position]",
          "before:[background-image:--background-radial-gradient]",
          "before:[background-size:300%_300%]",
          "before:[mask:--mask-linear-gradient]",
          "before:![-webkit-mask-composite:xor]",
          "before:![mask-composite:exclude]",
          "motion-safe:before:animate-shine",
        ].join(" ")}
      />

      {children}
    </div>
  );
}
