"use client";

import { forwardRef, useEffect, useState } from "react";

/**
 * Behind the hero words, so the page doesn't open on flat black. Everything lives at
 * the edges; the middle, behind the headline and buttons, stays clear. It fades out as
 * the demo comes up (AppPreviewScroll sets its opacity); motion is CSS/SVG only.
 * While we choose, ?bg=edges|team|words picks one.
 */
type Kind = "edges" | "team" | "words";
const P = (f: string) => `/bloomboard-demo/people/${f}.jpg`;
const VFADE = "linear-gradient(180deg, transparent 0, #000 14%, #000 58%, transparent 92%)";

function Column({ c }: { c: number }) {
  return (
    <div className="relative h-full w-[170px] flex-none">
      <div className="bb-bd-col absolute inset-x-0 top-0" style={{ animationDuration: `${52 + (c % 2) * 11}s`, animationDelay: `${-c * 9}s` }}>
        {[0, 1].map((rep) => (
          <div key={rep} className="flex flex-col gap-5 pb-5">
            {Array.from({ length: 9 }, (_, i) => (
              <div
                key={i}
                className="rounded-xl border bg-white/[0.015]"
                style={{ height: 56 + ((i * 7 + c * 3) % 4) * 14, borderColor: (i + c) % 7 === 0 ? "rgba(91,139,255,0.4)" : "rgba(255,255,255,0.11)" }}
              >
                <i className="ml-3 mt-3 block h-1.5 rounded bg-white/[0.08]" style={{ width: `${40 + ((i * 13 + c * 5) % 45)}%` }} />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/* team: where each face sits (% of the hero) and the faint lines between them */
const FACES: [string, number, number][] = [
  ["women-44", 9, 24], ["men-32", 15, 60], ["women-12", 6, 82],
  ["men-86", 91, 20], ["women-79", 85, 55], ["men-75", 93, 80],
];
const LINKS: [number, number, number][] = [[0, 1, 7], [1, 2, 9], [3, 4, 8], [4, 5, 10], [0, 3, 14], [2, 5, 16]];
const SAY: [number, string][] = [[1, "On it"], [4, "Sent the file"], [3, "Joining now"]];

const WORDS = "TASKS · CHAT · CALLS · OFFICE · PLANS · ";

const HeroBackdrop = forwardRef<HTMLDivElement>(function HeroBackdrop(_, ref) {
  const [kind, setKind] = useState<Kind>("edges");
  useEffect(() => {
    const k = new URLSearchParams(window.location.search).get("bg");
    if (k === "edges" || k === "team" || k === "words") setKind(k);
  }, []);

  return (
    <div ref={ref} aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[112vh] overflow-hidden" style={{ willChange: "opacity" }}>
      {kind === "edges" && (
        <div className="absolute inset-0 flex justify-between px-4" style={{ WebkitMaskImage: VFADE, maskImage: VFADE }}>
          <div className="flex gap-5 opacity-90"><Column c={0} /><Column c={1} /></div>
          <div className="flex gap-5 opacity-90"><Column c={2} /><Column c={3} /></div>
        </div>
      )}

      {kind === "team" && (
        <div className="absolute inset-0" style={{ WebkitMaskImage: VFADE, maskImage: VFADE }}>
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            {LINKS.map(([a, b, dur]) => {
              const [, x1, y1] = FACES[a], [, x2, y2] = FACES[b];
              const across = Math.abs(x2 - x1) > 50;
              const d = across
                ? `M${x1} ${y1} C ${x1 + 20} ${y1 - 18}, ${x2 - 20} ${y2 - 18}, ${x2} ${y2}`
                : `M${x1} ${y1} C ${x1 + 6} ${(y1 + y2) / 2}, ${x2 + 6} ${(y1 + y2) / 2}, ${x2} ${y2}`;
              return (
                <g key={`${a}-${b}`}>
                  <path d={d} fill="none" stroke={across ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.09)"} strokeWidth="1" vectorEffect="non-scaling-stroke" />
                  <circle r="0.32" fill="#5B8BFF">
                    <animateMotion dur={`${dur}s`} repeatCount="indefinite" path={d} />
                  </circle>
                </g>
              );
            })}
          </svg>
          {FACES.map(([f, x, y], i) => (
            <div key={f} className="bb-bd-bob absolute -ml-5 -mt-5 h-10 w-10" style={{ left: `${x}%`, top: `${y}%`, animationDelay: `${-i * 1.7}s` }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={P(f)} alt="" className="h-10 w-10 rounded-full object-cover opacity-70 ring-2 ring-black" />
              <span className="absolute -bottom-px -right-px h-3 w-3 rounded-full border-2 border-black bg-[#34C77B]" />
              {SAY.filter(([n]) => n === i).map(([, t]) => (
                <span
                  key={t}
                  className={`bb-bd-say absolute top-1.5 whitespace-nowrap rounded-lg bg-[#16171B] px-2.5 py-1 text-[11.5px] text-white/70 ring-1 ring-white/10 ${x > 50 ? "right-12" : "left-12"}`}
                  style={{ animationDelay: `${i * 2.3}s` }}
                >
                  {t}
                </span>
              ))}
            </div>
          ))}
        </div>
      )}

      {kind === "words" && (
        <div className="absolute inset-0 flex justify-between" style={{ WebkitMaskImage: VFADE, maskImage: VFADE }}>
          {[0, 1].map((side) => (
            <div key={side} className="relative h-full w-[min(18vw,220px)] overflow-hidden">
              <div className={`bb-bd-words absolute left-1/2 top-0 ${side ? "bb-bd-words-down" : ""}`}>
                {[0, 1].map((rep) => (
                  <div
                    key={rep}
                    className="font-semibold leading-none tracking-[-0.03em]"
                    style={{ writingMode: "vertical-rl", fontSize: "min(15vw, 190px)", color: "transparent", WebkitTextStroke: "1px rgba(255,255,255,0.11)", transform: side ? "rotate(180deg)" : undefined }}
                  >
                    {WORDS.repeat(2)}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

export default HeroBackdrop;
