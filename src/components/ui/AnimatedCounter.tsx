"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

interface AnimatedCounterProps {
  value: string;
  className?: string;
  style?: React.CSSProperties;
}

function isNumeric(val: string) {
  return /^\d+/.test(val);
}

export default function AnimatedCounter({ value, className = "", style }: AnimatedCounterProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const [display, setDisplay] = useState(isNumeric(value) ? "0" : "");
  const started = useRef(false);

  useEffect(() => {
    if (!isInView || started.current) return;
    started.current = true;

    if (isNumeric(value)) {
      const numeric = parseInt(value);
      const suffix = value.replace(/^\d+/, "");
      const duration = 1500;
      const steps = 60;
      const interval = duration / steps;
      let step = 0;
      const timer = setInterval(() => {
        step++;
        const progress = step / steps;
        const eased = 1 - Math.pow(1 - progress, 3);
        setDisplay(Math.round(eased * numeric) + suffix);
        if (step >= steps) clearInterval(timer);
      }, interval);
      return () => clearInterval(timer);
    } else {
      let i = 0;
      const timer = setInterval(() => {
        i++;
        setDisplay(value.slice(0, i));
        if (i >= value.length) clearInterval(timer);
      }, 60);
      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return (
    <span ref={ref} className={className} style={style}>
      {display || (isNumeric(value) ? "0" : " ")}
    </span>
  );
}
