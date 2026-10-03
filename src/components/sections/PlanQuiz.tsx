"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { ArrowRight, RotateCcw } from "lucide-react";

type PlanKey = "free" | "bloom" | "team";
type Points = Partial<Record<PlanKey, number>>;

export type QuizStep = {
  question: string;
  /** `result` ends the quiz on that plan straight away (e.g. "my team" → Team). */
  options: { label: string; points?: Points; result?: PlanKey }[];
};

export type PlanResult = { name: string; desc: string; href: string };

const HOME_STEPS: QuizStep[] = [
  {
    question: "Who will use BloomBoard?",
    options: [
      { label: "Just me", points: {} },
      { label: "My team: 3 or more people", result: "team" },
    ],
  },
  {
    question: "What matters most to you?",
    options: [
      { label: "Keeping tasks, notes and bookmarks simple", points: { free: 3 } },
      { label: "Unlimited boards and notes, with AI help every day", points: { bloom: 3 } },
      { label: "Unlimited AI, KPI reports and my full performance history", points: { bloom: 3 } },
    ],
  },
];

const HOME_RESULTS: Partial<Record<PlanKey, PlanResult>> = {
  free: {
    name: "Free",
    desc: "Unlimited tasks, up to 5 boards, 20 notes and 50 bookmarks, plus Type to Task and a few AI actions each month. Free forever, no card needed.",
    href: "/#download",
  },
  bloom: {
    name: "Bloom",
    desc: "Everything unlimited for one person, including AI: boards, notes, Plan My Day, KPI reports and your full history. $8 a month, or $6 a month billed yearly. Try it free for 7 days.",
    href: "/start?plan=bloom",
  },
  team: {
    name: "Team",
    desc: "Everything in Bloom for every member, plus team chat, calls, Team Space, handovers and Pulse. $10 per person a month billed yearly, less for 10 or more seats. 3 seats minimum. Free for 14 days.",
    href: "/start?plan=team",
  },
};

const LETTERS = ["A", "B", "C", "D"];

export default function PlanQuiz({
  steps = HOME_STEPS,
  results = HOME_RESULTS,
  note = "You can switch plans any time.",
  light = false,
}: {
  steps?: QuizStep[];
  results?: Partial<Record<PlanKey, PlanResult>>;
  note?: string;
  /** Dark text on a light panel (used inside the light reveal panel on the home page). */
  light?: boolean;
} = {}) {
  /* Text colours for the dark (default) and light versions. */
  const c = light
    ? {
        h: "text-[#1d1d1f]", lead: "text-[#6e6e73]", note: "border-black/15 text-[#6e6e73]", meta: "text-[#6e6e73]",
        line: "border-black/10", opt: "text-[#3a3a3c] hover:text-[#1d1d1f]", letter: "text-[#6e6e73] group-hover:text-[#1d1d1f]",
        arrow: "text-transparent group-hover:text-[#6e6e73]", desc: "text-[#3a3a3c]",
        cta: "bg-[#1d1d1f] text-white hover:bg-black", again: "text-[#6e6e73] hover:text-[#1d1d1f]",
      }
    : {
        h: "text-white", lead: "text-white/65", note: "border-white/15 text-white/50", meta: "text-white/50",
        line: "border-white/10", opt: "text-white/80 hover:text-white", letter: "text-white/35 group-hover:text-white/70",
        arrow: "text-white/0 group-hover:text-white/70", desc: "text-white/65",
        cta: "bg-white text-black hover:bg-white/90", again: "text-white/60 hover:text-white",
      };
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const [step, setStep] = useState(0);
  const [scores, setScores] = useState<Points>({});
  const [result, setResult] = useState<PlanKey | null>(null);

  const pick = (option: QuizStep["options"][number]) => {
    if (option.result) {
      setResult(option.result);
      return;
    }
    const next: Points = { ...scores };
    for (const [key, value] of Object.entries(option.points ?? {}) as [PlanKey, number][]) {
      next[key] = (next[key] ?? 0) + value;
    }
    setScores(next);
    if (step + 1 < steps.length) {
      setStep(step + 1);
    } else {
      const candidates = Object.keys(results) as PlanKey[];
      setResult(candidates.reduce((a, b) => ((next[a] ?? 0) >= (next[b] ?? 0) ? a : b)));
    }
  };

  const reset = () => {
    setStep(0);
    setScores({});
    setResult(null);
  };

  const plan = result ? results[result] ?? null : null;

  return (
    <section ref={ref} className="px-4 py-16 sm:px-6 sm:py-24">
      <motion.div
        className="mx-auto grid max-w-5xl items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16"
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        {/* Left: the pitch */}
        <div className="text-center lg:text-left">
          <h2 className={`text-3xl font-bold leading-tight ${c.h} sm:text-4xl`}>
            Which plan is right for you?
          </h2>
          <p className={`mx-auto mt-4 max-w-md text-base leading-relaxed ${c.lead} lg:mx-0`}>
            Answer a couple of quick questions and we&apos;ll point you to the right plan.
          </p>
          <p className={`mx-auto mt-6 hidden max-w-md border-l-2 pl-4 text-sm leading-relaxed ${c.note} lg:block`}>
            {note}
          </p>
        </div>

        {/* Right: the quiz */}
        <div>
          <AnimatePresence mode="wait">
            {!plan ? (
              <motion.div
                key={`step-${step}`}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.2 }}
              >
                <p className={`text-sm ${c.meta}`}>
                  Question {step + 1} of {steps.length}
                </p>
                <h3 className={`mt-1.5 text-xl font-semibold leading-snug ${c.h}`}>
                  {steps[step].question}
                </h3>

                <div className={`mt-6 border-t ${c.line}`}>
                  {steps[step].options.map((opt, i) => (
                    <button
                      key={opt.label}
                      type="button"
                      onClick={() => pick(opt)}
                      className={`group flex w-full items-center gap-4 border-b ${c.line} py-4 text-left text-base ${c.opt} transition-colors duration-150`}
                    >
                      <span className={`w-4 shrink-0 text-sm font-medium ${c.letter} transition-colors`}>
                        {LETTERS[i]}
                      </span>
                      <span className="flex-1">{opt.label}</span>
                      <ArrowRight className={`h-4 w-4 shrink-0 ${c.arrow} transition-colors`} />
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
              >
                <p className={`text-sm ${c.meta}`}>We&apos;d suggest</p>
                <p className={`mt-1 text-3xl font-bold ${c.h}`}>{plan.name}</p>
                <p className={`mt-3 text-sm leading-relaxed ${c.desc}`}>{plan.desc}</p>
                <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <a
                    href={plan.href}
                    className={`inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-colors ${c.cta}`}
                  >
                    Get started with {plan.name}
                    <ArrowRight className="h-4 w-4" />
                  </a>
                  <button
                    type="button"
                    onClick={reset}
                    className={`inline-flex items-center justify-center gap-1.5 px-2 py-2.5 text-sm font-medium transition-colors ${c.again}`}
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    Start over
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </section>
  );
}
