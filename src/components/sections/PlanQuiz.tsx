"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { ArrowRight, RotateCcw } from "lucide-react";

type PlanKey = "free" | "flow" | "bloom" | "team";
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
      { label: "My team — 3 or more people", result: "team" },
    ],
  },
  {
    question: "What matters most to you?",
    options: [
      { label: "Keeping tasks, notes and bookmarks simple", points: { free: 3 } },
      { label: "Unlimited tasks and boards, with AI help every day", points: { flow: 3 } },
      { label: "Unlimited AI, KPI reports and my full performance history", points: { bloom: 3 } },
    ],
  },
];

const HOME_RESULTS: Partial<Record<PlanKey, PlanResult>> = {
  free: {
    name: "Free",
    desc: "Up to 7 tasks, 5 boards, 25 bookmarks and 10 notes, plus Type to Task and vacations. Free forever, no card needed.",
    href: "https://github.com/farhanfazil/bloombooard-releases/releases/latest/download/BloomBoard-Installer.dmg",
  },
  flow: {
    name: "Flow",
    desc: "Unlimited tasks, notes and bookmarks, 10 boards you can create in one go, and daily AI help. Try it free for 7 days.",
    href: "https://buy.polar.sh/polar_cl_bcGVnrH6RUJvB6pVEhW0kRdOJ1wa82yn9xuPK480cmt",
  },
  bloom: {
    name: "Bloom",
    desc: "Everything unlocked for one person: unlimited AI and boards, KPI reports and your full performance history. Try it free for 7 days.",
    href: "https://buy.polar.sh/polar_cl_QgWTHuRDKTmL1Zbv5H71gx43pQz4xslZjF11r3KRCqH",
  },
  team: {
    name: "Team",
    desc: "Voice and video calls, team chat, handovers and Pulse, with every member's overview. From 3 seats, free for 7 days.",
    href: "#pricing",
  },
};

const LETTERS = ["A", "B", "C", "D"];

export default function PlanQuiz({
  steps = HOME_STEPS,
  results = HOME_RESULTS,
  note = "You can switch plans any time — your data stays on your Mac either way.",
}: {
  steps?: QuizStep[];
  results?: Partial<Record<PlanKey, PlanResult>>;
  note?: string;
} = {}) {
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
          <h2 className="text-3xl font-bold leading-tight text-white sm:text-4xl">
            Which plan is right for you?
          </h2>
          <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-white/65 lg:mx-0">
            Answer a couple of quick questions and we&apos;ll point you to the right plan.
          </p>
          <p className="mx-auto mt-6 hidden max-w-md border-l-2 border-white/15 pl-4 text-sm leading-relaxed text-white/50 lg:block">
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
                <p className="text-sm text-white/50">
                  Question {step + 1} of {steps.length}
                </p>
                <h3 className="mt-1.5 text-xl font-semibold leading-snug text-white">
                  {steps[step].question}
                </h3>

                <div className="mt-6 border-t border-white/10">
                  {steps[step].options.map((opt, i) => (
                    <button
                      key={opt.label}
                      type="button"
                      onClick={() => pick(opt)}
                      className="group flex w-full items-center gap-4 border-b border-white/10 py-4 text-left text-base text-white/80 transition-colors duration-150 hover:text-white"
                    >
                      <span className="w-4 shrink-0 text-sm font-medium text-white/35 transition-colors group-hover:text-white/70">
                        {LETTERS[i]}
                      </span>
                      <span className="flex-1">{opt.label}</span>
                      <ArrowRight className="h-4 w-4 shrink-0 text-white/0 transition-colors group-hover:text-white/70" />
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
                <p className="text-sm text-white/50">We&apos;d suggest</p>
                <p className="mt-1 text-3xl font-bold text-white">{plan.name}</p>
                <p className="mt-3 text-sm leading-relaxed text-white/65">{plan.desc}</p>
                <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <a
                    href={plan.href}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-white/90"
                  >
                    Get started with {plan.name}
                    <ArrowRight className="h-4 w-4" />
                  </a>
                  <button
                    type="button"
                    onClick={reset}
                    className="inline-flex items-center justify-center gap-1.5 px-2 py-2.5 text-sm font-medium text-white/60 transition-colors hover:text-white"
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
