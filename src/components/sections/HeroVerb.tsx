"use client";

import { useEffect, useRef, useState } from "react";

/* The verb in "One app that ___ with you." rolls through a few things Bloom does with
   you: the word slides up and out as the next one rises in, in bold white. The box
   eases to each word's own width, so there is never a gap beside it. Screen readers
   and reduced-motion visitors just get "thinks". */
const VERBS = ["thinks", "plans", "writes", "meets"];
const HOLD = 2600;

export default function HeroVerb() {
  const [i, setI] = useState(0);
  const [widths, setWidths] = useState<number[]>([]);
  const sizer = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const measure = () => {
      const el = sizer.current;
      if (el) setWidths(Array.from(el.children).map((c) => (c as HTMLElement).getBoundingClientRect().width));
    };
    measure();
    document.fonts?.ready.then(measure);
    window.addEventListener("resize", measure);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return () => window.removeEventListener("resize", measure);
    const id = setInterval(() => setI((x) => (x + 1) % VERBS.length), HOLD);
    return () => { clearInterval(id); window.removeEventListener("resize", measure); };
  }, []);

  const prev = (i - 1 + VERBS.length) % VERBS.length;
  return (
    <>
      <span className="sr-only">thinks</span>
      <span
        aria-hidden
        className="relative inline-block whitespace-nowrap font-semibold text-white"
        /* clip-path rather than overflow:hidden, which would lift the word off the line's baseline */
        style={{ width: widths[i] ? `${widths[i]}px` : undefined, clipPath: "inset(0 -2px)", transition: "width .45s cubic-bezier(.2,.7,.2,1)" }}
      >
        {/* invisible copies, one per word, to measure each width */}
        <span ref={sizer} className="invisible absolute left-0 top-0 whitespace-nowrap">
          {VERBS.map((v) => <span key={v} className="absolute left-0 top-0">{v}</span>)}
        </span>
        {/* sized by the first word until the widths are measured */}
        <span className={widths.length ? "invisible" : ""}>{VERBS[0]}</span>
        {widths.length
          ? VERBS.map((v, k) => {
              const on = k === i, out = k === prev;
              return (
                <span
                  key={v}
                  className="absolute left-0 top-0 whitespace-nowrap"
                  style={{
                    transform: `translateY(${on ? 0 : out ? -100 : 100}%)`,
                    opacity: on ? 1 : 0,
                    transition: on || out ? "transform .55s cubic-bezier(.2,.7,.2,1), opacity .4s ease" : "none",
                  }}
                >
                  {v}
                </span>
              );
            })
          : null}
      </span>
    </>
  );
}
