import { forwardRef } from "react";

/**
 * Behind the hero words, so the page doesn't open on flat black: faint task-card
 * outlines rising slowly in columns, work moving along. Clear at the sides, softer
 * behind the headline and buttons so they stay the focus. It fades out as the demo
 * comes up (AppPreviewScroll sets its opacity); the motion is CSS only (globals.css).
 */

/* fades out at the top and bottom, and dims (not hides) behind the words in the middle */
const MASK =
  "linear-gradient(180deg, transparent 0, #000 12%, #000 55%, transparent 92%), " +
  "radial-gradient(ellipse 30% 34% at 50% 40%, rgba(0,0,0,0.35) 0, rgba(0,0,0,0.35) 45%, #000 100%)";

const HeroBackdrop = forwardRef<HTMLDivElement>(function HeroBackdrop(_, ref) {
  return (
    <div ref={ref} aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[115vh] overflow-hidden" style={{ willChange: "opacity" }}>
      <div
        className="absolute inset-0 flex justify-center gap-6"
        style={{ WebkitMaskImage: MASK, maskImage: MASK, WebkitMaskComposite: "source-in", maskComposite: "intersect" }}
      >
        {[0, 1, 2, 3, 4, 5, 6].map((c) => (
          <div key={c} className="relative h-full w-[180px] flex-none">
            <div className="bb-bd-col absolute inset-x-0 top-0" style={{ animationDuration: `${46 + (c % 3) * 9}s`, animationDelay: `${-c * 7}s` }}>
              {[0, 1].map((rep) => (
                <div key={rep} className="flex flex-col gap-5 pb-5">
                  {Array.from({ length: 9 }, (_, i) => {
                    const blue = (i + c) % 9 === 0;
                    return (
                      <div
                        key={i}
                        className="rounded-xl border bg-white/[0.018]"
                        style={{ height: 56 + ((i * 7 + c * 3) % 4) * 14, borderColor: blue ? "rgba(91,139,255,0.45)" : "rgba(255,255,255,0.13)" }}
                      >
                        <i className="ml-3 mt-3 block h-1.5 rounded bg-white/[0.1]" style={{ width: `${40 + ((i * 13 + c * 5) % 45)}%` }} />
                        <i className="ml-3 mt-2 block h-1.5 rounded bg-white/[0.06]" style={{ width: `${22 + ((i * 7 + c * 11) % 30)}%` }} />
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

export default HeroBackdrop;
