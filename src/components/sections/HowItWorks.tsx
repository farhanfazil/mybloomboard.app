"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const LINK_CLASS =
  "text-white/85 underline decoration-white/30 underline-offset-2 transition-colors hover:text-white hover:decoration-white";

const STEPS = [
  {
    title: "Download the app",
    description: (
      <>
        Get BloomBoard for{" "}
        <a href="#download" className={LINK_CLASS}>
          Mac or Windows
        </a>
        . The Free plan works right away, no account needed.
      </>
    ),
  },
  {
    title: "Start your trial",
    description: (
      <>
        <a href="/start" className={LINK_CLASS}>
          Start your free trial
        </a>{" "}
        with your email: 7 days for Bloom, 14 days for Team. Or pick a plan above and buy straight away.
      </>
    ),
  },
  {
    title: "Sign in with the same email",
    description: "Open BloomBoard and sign in with that email. Your plan is applied automatically.",
  },
  {
    title: "Manage your plan",
    description: (
      <>
        Change plan, update billing or cancel any time from{" "}
        <a href="/account" className={LINK_CLASS}>
          Manage your subscription
        </a>
        .
      </>
    ),
  },
];

export default function HowItWorks() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="bg-[#1c1c1e]">
      <div className="px-4 py-16 sm:px-8 sm:py-24">
      <div className="mx-auto max-w-5xl">
        <motion.div
          className="mb-12 max-w-xl sm:mb-16"
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-5xl">Up and running in minutes.</h2>
          <p className="mt-3 text-base leading-relaxed text-white/60 sm:text-lg">
            Four steps from download to your full plan.
          </p>
        </motion.div>

        <div className="relative">
          {/* The line that joins the steps on wide screens */}
          <div aria-hidden className="absolute left-0 right-0 top-4 hidden h-px bg-white/15 lg:block" />
          <ol className="relative grid gap-10 sm:grid-cols-2 sm:gap-x-10 lg:grid-cols-4 lg:gap-8">

          {STEPS.map((step, i) => (
            <motion.li
              key={step.title}
              className="relative"
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.45, delay: 0.1 + i * 0.08 }}
            >
              <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-white text-sm font-semibold text-[#1c1c1e]">
                {i + 1}
              </span>
              <h3 className="mt-5 text-lg font-semibold text-white">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/60">{step.description}</p>
            </motion.li>
          ))}
          </ol>
        </div>
      </div>
      </div>
    </section>
  );
}
