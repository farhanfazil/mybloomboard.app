"use client";

import { useEffect, useState } from "react";

/* The verb in "The productivity app that ___ with you." retypes itself through a few
   things Bloom does with you, always coming back to "thinks". One solid accent colour,
   no gradient or glow. Screen readers and reduced-motion visitors just get "thinks". */
const VERBS = ["thinks", "plans", "writes", "meets", "thinks"];
/* Each word has its own solid colour; "thinks" keeps the butterfly cyan. */
const COLORS: Record<string, string> = { thinks: "#67e8f9", plans: "#c4b5fd", writes: "#fcd34d", meets: "#6ee7b7" };
const HOLD_FIRST = 4200;
const HOLD = 2200;
const TYPE = 85;
const DELETE = 45;

export default function HeroVerb() {
  const [text, setText] = useState(VERBS[0]);
  const [word, setWord] = useState(VERBS[0]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let alive = true;
    const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
    (async () => {
      let i = 0;
      while (alive) {
        const word = VERBS[i % VERBS.length];
        await wait(i % VERBS.length === 0 ? HOLD_FIRST : HOLD);
        if (!alive) return;
        for (let k = word.length; k >= 0 && alive; k--) { setText(word.slice(0, k)); await wait(DELETE); }
        const next = VERBS[(i + 1) % VERBS.length];
        setWord(next);
        await wait(160);
        for (let k = 1; k <= next.length && alive; k++) { setText(next.slice(0, k)); await wait(TYPE); }
        i = (i + 1) % (VERBS.length - 1); // the last "thinks" is the same as the first
      }
    })();
    return () => { alive = false; };
  }, []);

  return (
    <span aria-hidden="true" className="relative inline-block whitespace-nowrap" style={{ color: COLORS[word], transition: "color .25s ease" }}>
      {text}
      <span className="bb-hero-caret ml-[0.04em] inline-block w-[0.06em] bg-current align-[-0.06em]" style={{ height: "0.82em" }} />
    </span>
  );
}
