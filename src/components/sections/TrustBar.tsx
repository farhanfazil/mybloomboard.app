"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Gift, ShieldCheck, XCircle, Bot } from "lucide-react";

const TRUST_ITEMS = [
  { icon: Gift,        label: "Free plan forever",      sub: "No card required to start" },
  { icon: ShieldCheck, label: "Your data never leaves",  sub: "100% local, zero cloud tracking" },
  { icon: XCircle,     label: "Cancel any time",         sub: "No lock-in, no questions asked" },
  { icon: Bot,         label: "AI assistant included",   sub: "Plans your day with you" },
];

export default function TrustBar() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <section ref={ref} className="px-4 pb-16 pt-4 sm:px-6 sm:pb-20">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-5xl"
      >
        <div className="grid grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-4">
          {TRUST_ITEMS.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 10 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                className="border-t border-white/15 pt-4"
              >
                <p className="flex items-center gap-2 text-sm font-medium text-white">
                  <Icon className="h-4 w-4 shrink-0 text-white/60" strokeWidth={1.8} />
                  {item.label}
                </p>
                <p className="mt-1 text-sm leading-snug text-white/50">{item.sub}</p>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}
