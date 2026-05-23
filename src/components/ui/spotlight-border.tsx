"use client";

/**
 * useSpotlightBorder — Apple Intelligence Edition
 * ─────────────────────────────────────────────────
 * Mouse-following multi-colour spotlight that only appears on hover.
 * Colors are locked to Apple's iridescent AI palette:
 *   Electric blue (#0066FF-ish)  →  Deep purple  →  Magenta-pink
 *   hue 215 ──────────────────────────────────── hue 320
 *
 * The hue for h2 / h3 is CLAMPED so the gradient never drifts into
 * orange or yellow — it stays in the blue-purple-pink Apple range.
 *
 * Performance:
 *  - getBoundingClientRect()  cached; refreshed on enter / scroll / resize only
 *  - requestAnimationFrame    DOM writes batched to paint cycle (max 60 fps)
 *  - cancelAnimationFrame     stale frames cancelled before each new schedule
 *  - pointerenter/leave       hover gate + opacity fade
 */

import { useRef, useEffect, CSSProperties, RefObject } from "react";

interface SpotlightBorderOptions {
  /** Spotlight radius in px (default 280). */
  radius?: number;
  /** Border width in px — must match the card's own border (default 1). */
  borderWidth?: number;
  /** CSS border-radius value — must match the card (default "16px"). */
  borderRadius?: string;
  /** Brightness multiplier (default 2.2 — vivid Apple AI look). */
  brightness?: number;
  /**
   * Starting hue for the left edge (default 215 = Apple blue).
   * Apple Intelligence palette: 215 (blue) → 268 (purple) → 320 (pink).
   */
  hueStart?: number;
  /**
   * Hue range swept left → right (default 105).
   * 215 + 105 = 320 (magenta-pink) — stays inside Apple Intelligence range.
   */
  hueRange?: number;
}

export function useSpotlightBorder<T extends HTMLElement = HTMLDivElement>({
  radius      = 280,
  borderWidth = 1,
  borderRadius = "16px",
  brightness  = 2.2,
  hueStart    = 215,   // Apple electric blue
  hueRange    = 105,   // → 320 (Apple magenta-pink)
}: SpotlightBorderOptions = {}): {
  cardRef:   RefObject<T>;
  spotRef:   RefObject<HTMLDivElement>;
  spotStyle: CSSProperties;
} {
  const cardRef = useRef<T>(null);
  const spotRef = useRef<HTMLDivElement>(null);
  const rectRef = useRef<DOMRect | null>(null);
  const rafRef  = useRef<number>(0);

  useEffect(() => {
    const card = cardRef.current;
    const spot = spotRef.current;
    if (!card || !spot) return;

    // ── rect cache ────────────────────────────────────────────────────────────
    const refreshRect = () => { rectRef.current = card.getBoundingClientRect(); };
    refreshRect();

    const ro = new ResizeObserver(refreshRect);
    ro.observe(card);
    window.addEventListener("scroll", refreshRect, { passive: true });

    // ── pointer handlers ──────────────────────────────────────────────────────
    const onEnter = () => {
      refreshRect();
      spot.style.opacity = "1";
    };

    const onLeave = () => {
      if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = 0; }
      spot.style.opacity = "0";
    };

    const onMove = (e: PointerEvent) => {
      const rect = rectRef.current;
      if (!rect) return;

      const x  = e.clientX - rect.left;
      const y  = e.clientY - rect.top;
      const xp = Math.max(0, Math.min(1, x / rect.width));

      // ── Apple Intelligence hue computation ────────────────────────────────
      // h1: cursor maps blue (215) → pink (320) as it travels left → right
      const h1 = Math.round(hueStart + xp * hueRange);

      // h2: +53° forward, clamped so it never exits the Apple palette (max 330)
      const h2 = Math.min(hueStart + hueRange + 25, h1 + 53);

      // h3: −20° back toward blue, floored so it stays above cyan (min 200)
      const h3 = Math.max(hueStart - 15, h1 - 20);

      const r1 = radius;
      const r2 = Math.round(radius * 1.5);
      const xs = x.toFixed(1);
      const ys = y.toFixed(1);

      // Vivid Apple AI gradient — high saturation, balanced lightness
      const gradient =
        `radial-gradient(${r1}px ${r1}px at ${xs}px ${ys}px,` +
        ` hsl(${h1} 100% 65% / 1.00),` +
        ` hsl(${h2} 100% 62% / 0.70) 38%,` +
        ` transparent 70%),` +
        `radial-gradient(${r2}px ${r2}px at ${xs}px ${ys}px,` +
        ` hsl(${h2}  95% 60% / 0.50) 0%,` +
        ` hsl(${h3}  95% 58% / 0.28) 45%,` +
        ` transparent 70%)`;

      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = 0;
        if (spot) spot.style.backgroundImage = gradient;
      });
    };

    card.addEventListener("pointerenter", onEnter);
    card.addEventListener("pointerleave", onLeave);
    card.addEventListener("pointermove",  onMove as EventListener);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      card.removeEventListener("pointerenter", onEnter);
      card.removeEventListener("pointerleave", onLeave);
      card.removeEventListener("pointermove",  onMove as EventListener);
      ro.disconnect();
      window.removeEventListener("scroll", refreshRect);
    };
  }, [radius, hueStart, hueRange]);

  const spotStyle: CSSProperties = {
    position:      "absolute",
    inset:         0,
    borderRadius,
    border:        `${borderWidth}px solid transparent`,
    mask:               "linear-gradient(white,white) padding-box, linear-gradient(white,white) border-box",
    maskComposite:      "destination-out" as CSSProperties["maskComposite"],
    WebkitMask:         "linear-gradient(white,white) padding-box, linear-gradient(white,white) border-box",
    WebkitMaskComposite: "destination-out",
    opacity:       0,
    transition:    "opacity 0.25s ease",
    pointerEvents: "none",
    zIndex:        20,
    filter:        `brightness(${brightness})`,
    willChange:    "background-image",
  };

  return { cardRef, spotRef, spotStyle };
}
