"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Gift, ShieldCheck, XCircle, Sparkles } from "lucide-react";

const TRUST_ITEMS = [
  { icon: Gift,        label: "Free plan forever",      sub: "No card required to start" },
  { icon: ShieldCheck, label: "Your data never leaves",  sub: "100% local, zero cloud tracking" },
  { icon: XCircle,     label: "Cancel any time",         sub: "No lock-in, no questions asked" },
  { icon: Sparkles,    label: "Powered by AI",           sub: "Smart assistance, built in" },
];

export default function TrustBar() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <section ref={ref} className="px-4 pb-4 pt-2">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-4xl rounded-2xl px-6 py-5"
        style={{
          background: "linear-gradient(145deg, rgba(10,10,13,0.9), rgba(6,6,8,0.85))",
          border: "1px solid rgba(255,255,255,0.07)",
          borderTop: "1px solid rgba(255,255,255,0.12)",
        }}
      >
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {TRUST_ITEMS.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 10 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                className="flex flex-col items-center gap-1.5 text-center"
              >
                <Icon className="h-5 w-5 text-white/80" strokeWidth={1.6} />
                <p className="text-xs font-semibold text-white">{item.label}</p>
                <p className="text-[10px] leading-snug" style={{ color: "rgba(255,255,255,0.35)" }}>{item.sub}</p>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}
