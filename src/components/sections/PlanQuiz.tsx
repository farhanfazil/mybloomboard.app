"use client";

import { useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef } from "react";

const QUIZ_STEPS = [
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

const PLAN_RESULT: Record<string, { name: string; color: string; desc: string; href: string }> = {
  free: {
    name: "Free",
    color: "#607080",
    desc: "Perfect to start — tasks, streaks, KPI cards, hydration, mood tracking. Forever free, no card needed.",
    href: "https://github.com/farhanfazil/bloombooard-releases/releases/latest/download/BloomBoard-Installer.dmg",
  },
  flow: {
    name: "Flow",
    color: "#4d9fff",
    desc: "Built for professionals — AI assistant, multiple boards, advanced KPIs, and priority support.",
    href: "https://buy.polar.sh/polar_cl_bcGVnrH6RUJvB6pVEhW0kRdOJ1wa82yn9xuPK480cmt",
  },
  bloom: {
    name: "Bloom",
    color: "#a78bfa",
    desc: "Full power — AI reports, unlimited boards, advanced analytics, and everything Flow includes.",
    href: "https://buy.polar.sh/polar_cl_QgWTHuRDKTmL1Zbv5H71gx43pQz4xslZjF11r3KRCqH",
  },
};

export default function PlanQuiz() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const [step, setStep] = useState(0);
  const [scores, setScores] = useState({ free: 0, flow: 0, bloom: 0 });
  const [result, setResult] = useState<string | null>(null);

  const pick = (points: { free: number; flow: number; bloom: number }) => {
    const next = {
      free: scores.free + points.free,
      flow: scores.flow + points.flow,
      bloom: scores.bloom + points.bloom,
    };
    setScores(next);
    if (step + 1 < QUIZ_STEPS.length) {
      setStep(step + 1);
    } else {
      const winner = (Object.keys(next) as Array<"free" | "flow" | "bloom">).reduce(
        (a, b) => next[a] >= next[b] ? a : b
      );
      setResult(winner);
    }
  };

  const reset = () => {
    setStep(0);
    setScores({ free: 0, flow: 0, bloom: 0 });
    setResult(null);
  };

  const plan = result ? PLAN_RESULT[result] : null;

  return (
    <section
      ref={ref}
      className="px-4 py-16 sm:py-24"
    >
      <div className="mx-auto max-w-2xl">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span
            className="inline-block text-xs font-semibold uppercase tracking-widest mb-4 text-white"
          >
            Find your plan
          </span>
          <h2 className="text-3xl font-bold sm:text-4xl">Which plan is right for you?</h2>
          <p className="mt-3 text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
            2 quick questions — get your match instantly.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="rounded-3xl overflow-hidden"
          style={{
            background: "linear-gradient(145deg, rgba(10,10,13,0.97), rgba(6,6,8,0.96))",
            border: "1px solid rgba(255,255,255,0.09)",
            boxShadow: "0 24px 64px rgba(0,0,0,0.65), inset 0 1px 0 rgba(255,255,255,0.06)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
          }}
        >
          <AnimatePresence mode="wait">
            {!result ? (
              <motion.div
                key={`step-${step}`}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.25 }}
                className="p-8"
              >
                {/* Progress bar */}
                <div className="flex items-center gap-2 mb-6">
                  {QUIZ_STEPS.map((_, i) => (
                    <div
                      key={i}
                      className="h-1 flex-1 rounded-full transition-all duration-500"
                      style={{ background: i <= step ? "rgba(77,159,255,0.8)" : "rgba(255,255,255,0.1)" }}
                    />
                  ))}
                </div>

                <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "rgba(77,159,255,0.7)" }}>
                  Question {step + 1} of {QUIZ_STEPS.length}
                </p>
                <h3 className="text-xl font-bold text-white mb-6 leading-snug">
                  {QUIZ_STEPS[step].question}
                </h3>

                <div className="flex flex-col gap-3">
                  {QUIZ_STEPS[step].options.map((opt) => (
                    <button
                      key={opt.label}
                      onClick={() => pick(opt.points)}
                      className="w-full text-left px-5 py-4 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-[1.02]"
                      style={{
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        color: "rgba(255,255,255,0.8)",
                      }}
                      onMouseEnter={e => {
                        (e.currentTarget as HTMLButtonElement).style.border = "1px solid rgba(77,159,255,0.45)";
                        (e.currentTarget as HTMLButtonElement).style.background = "rgba(77,159,255,0.08)";
                      }}
                      onMouseLeave={e => {
                        (e.currentTarget as HTMLButtonElement).style.border = "1px solid rgba(255,255,255,0.1)";
                        (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.04)";
                      }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.35 }}
                className="p-8 text-center"
              >
                <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "rgba(255,255,255,0.4)" }}>
                  Your match
                </p>
                <div
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-full mb-5"
                  style={{ background: `${plan!.color}18`, border: `1.5px solid ${plan!.color}55` }}
                >
                  <span className="text-2xl font-bold" style={{ color: plan!.color }}>{plan!.name}</span>
                </div>
                <p className="text-sm leading-relaxed mb-8 max-w-sm mx-auto" style={{ color: "rgba(255,255,255,0.6)" }}>
                  {plan!.desc}
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <a
                    href={plan!.href}
                    className="px-6 py-3 rounded-full text-sm font-semibold transition-all hover:scale-[1.03]"
                    style={{ background: plan!.color, color: "#fff", boxShadow: `0 8px 24px ${plan!.color}44` }}
                  >
                    Get started with {plan!.name}
                  </a>
                  <button
                    onClick={reset}
                    className="px-6 py-3 rounded-full text-sm font-medium transition-all hover:scale-[1.03]"
                    style={{
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.12)",
                      color: "rgba(255,255,255,0.6)",
                    }}
                  >
                    Retake quiz
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
