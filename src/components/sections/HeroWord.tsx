"use client";

import { useEffect, useRef, useState } from "react";

/* What comes after the blue "Re" in the headline, one per stop of the hero (AppPreviewScroll):
   the letters roll one after another, up and out as the next word rises in, and back down the
   same way when you scroll back. The box eases to each word's own width, so "Re" stays snug. */
export const HERO_WORDS = ["thought.", "designed.", "built."];

export default function HeroWord({ step }: { step: number }) {
  const layers = useRef<(HTMLSpanElement | null)[]>([]);
  const [widths, setWidths] = useState<number[]>([]);
  const prev = useRef(step);
  const from = prev.current;

  useEffect(() => { prev.current = step; }, [step]);
  useEffect(() => {
    const measure = () => setWidths(layers.current.map((el) => el?.getBoundingClientRect().width ?? 0));
    measure();
    document.fonts?.ready.then(measure);
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  return (
    <span className="bb-roll" style={{ width: widths[step] ? `${widths[step]}px` : undefined }}>
      {/* holds the baseline and, until the widths are measured, the size */}
      <span className="invisible">{HERO_WORDS[0]}</span>
      {HERO_WORDS.map((word, k) => (
        <span key={word} ref={(el) => { layers.current[k] = el; }} className="bb-roll-word">
          {Array.from(word).map((ch, n) => (
            <span
              key={n}
              className="bb-roll-ch"
              style={{
                transform: `translateY(${k === step ? 0 : k < step ? -125 : 125}%)`,
                /* only the two words changing places move; one skipped over never crosses the line */
                transition: k === step || k === from ? `transform .55s cubic-bezier(.65,0,.35,1) ${n * 24}ms` : "none",
              }}
            >
              {ch}
            </span>
          ))}
        </span>
      ))}
    </span>
  );
}
