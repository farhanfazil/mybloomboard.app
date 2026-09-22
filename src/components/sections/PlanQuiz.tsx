"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { ArrowRight, RotateCcw } from "lucide-react";

type PlanKey = "free" | "flow" | "bloom";
type Points = Record<PlanKey, number>;

export type QuizStep = {
  question: string;
  options: { label: string; points: Points }[];
};

export type PlanResult = { name: string; desc: string; href: string };

const HOME_STEPS: QuizStep[] = [
  {
    question: "How do you use your Mac day-to-day?",
    options: [
      { label: "Solo — personal productivity & habits",   points: { free: 2, flow: 1, bloom: 0 } },
      { label: "Professional — tasks, meetings & KPIs",   points: { free: 0, flow: 2, bloom: 1 } },
      { label: "Power user — AI, reports & full control", points: { free: 0, flow: 0, bloom: 3 } },
    ],
  },
  {
    question: "Which features matter most to you?",
    options: [
      { label: "Tasks, streaks & hydration tracking",  points: { free: 2, flow: 1, bloom: 0 } },
      { label: "KPIs, AI assistant & multiple boards", points: { free: 0, flow: 2, bloom: 1 } },
      { label: "AI reports, advanced analytics & API", points: { free: 0, flow: 0, bloom: 3 } },
    ],
  },
];

const HOME_RESULTS: Record<PlanKey, PlanResult> = {
  free: {
    name: "Free",
    desc: "Perfect to start — tasks, streaks, KPI cards, hydration, mood tracking. Forever free, no card needed.",
    href: "https://github.com/farhanfazil/bloombooard-releases/releases/latest/download/BloomBoard-Installer.dmg",
  },
  flow: {
    name: "Flow",
    desc: "Built for professionals — AI assistant, multiple boards, advanced KPIs, and priority support.",
    href: "https://buy.polar.sh/polar_cl_bcGVnrH6RUJvB6pVEhW0kRdOJ1wa82yn9xuPK480cmt",
  },
  bloom: {
    name: "Bloom",
    desc: "Full power — AI reports, unlimited boards, advanced analytics, and everything Flow includes.",
    href: "https://buy.polar.sh/polar_cl_QgWTHuRDKTmL1Zbv5H71gx43pQz4xslZjF11r3KRCqH",
  },
};

const EMPTY: Points = { free: 0, flow: 0, bloom: 0 };
const LETTERS = ["A", "B", "C", "D"];

export default function PlanQuiz({
  steps = HOME_STEPS,
  results = HOME_RESULTS,
  note = "You can switch plans any time — your data stays on your Mac either way.",
}: {
  steps?: QuizStep[];
  results?: Record<PlanKey, PlanResult>;
  note?: string;
} = {}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const [step, setStep] = useState(0);
  const [scores, setScores] = useState<Points>(EMPTY);
  const [result, setResult] = useState<PlanKey | null>(null);

  const pick = (points: Points) => {
    const next = {
      free: scores.free + points.free,
      flow: scores.flow + points.flow,
      bloom: scores.bloom + points.bloom,
    };
    setScores(next);
    if (step + 1 < steps.length) {
      setStep(step + 1);
    } else {
      const winner = (Object.keys(next) as PlanKey[]).reduce((a, b) => (next[a] >= next[b] ? a : b));
      setResult(winner);
    }
  };

  const reset = () => {
    setStep(0);
    setScores(EMPTY);
    setResult(null);
  };

  const plan = result ? results[result] : null;

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
            Answer two quick questions and we&apos;ll point you to the right one.
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
                      onClick={() => pick(opt.points)}
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
