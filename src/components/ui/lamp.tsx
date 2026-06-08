"use client";
import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const LampContainer = ({
  children,
  className,
  isOn = true,
}: {
  children: React.ReactNode;
  className?: string;
  isOn?: boolean;
}) => {
  return (
    <div
      className={cn(
        "relative flex min-h-[92vh] sm:min-h-[85vh] flex-col items-center justify-center overflow-hidden bg-black w-full z-0 pt-28 sm:pt-32 lg:pt-44",
        className
      )}
    >
      {/* ── Beam (all sizes — scaled to fit mobile, full size on sm+) ── */}
      <div className="flex relative w-full flex-1 items-center justify-center isolate z-0 origin-top [transform:scaleX(0.4)_scaleY(0.72)] sm:origin-center sm:[transform:scaleX(1)_scaleY(1.25)]">
        {/* Left conic */}
        <motion.div
          initial={{ opacity: 0.5, width: "15rem" }}
          animate={{ opacity: isOn ? 1 : 0, width: isOn ? "30rem" : "0rem" }}
          transition={{ delay: isOn ? 0.3 : 0, duration: 0.8, ease: "easeInOut" }}
          style={{ backgroundImage: `conic-gradient(var(--conic-position), var(--tw-gradient-stops))` }}
          className="absolute inset-auto right-1/2 h-56 overflow-visible w-[30rem] bg-gradient-conic from-[#f0ece4] via-transparent to-transparent text-white [--conic-position:from_70deg_at_center_top]"
        >
          <div className="absolute w-[100%] left-0 bg-black h-40 bottom-0 z-20 [mask-image:linear-gradient(to_top,white,transparent)]" />
          <div className="absolute w-40 h-[100%] left-0 bg-black bottom-0 z-20 [mask-image:linear-gradient(to_right,white,transparent)]" />
        </motion.div>

        {/* Right conic */}
        <motion.div
          initial={{ opacity: 0.5, width: "15rem" }}
          animate={{ opacity: isOn ? 1 : 0, width: isOn ? "30rem" : "0rem" }}
          transition={{ delay: isOn ? 0.3 : 0, duration: 0.8, ease: "easeInOut" }}
          style={{ backgroundImage: `conic-gradient(var(--conic-position), var(--tw-gradient-stops))` }}
          className="absolute inset-auto left-1/2 h-56 w-[30rem] bg-gradient-conic from-transparent via-transparent to-[#f0ece4] text-white [--conic-position:from_290deg_at_center_top]"
        >
          <div className="absolute w-40 h-[100%] right-0 bg-black bottom-0 z-20 [mask-image:linear-gradient(to_left,white,transparent)]" />
          <div className="absolute w-[100%] right-0 bg-black h-40 bottom-0 z-20 [mask-image:linear-gradient(to_top,white,transparent)]" />
        </motion.div>

        {/* Fade cover */}
        <div className="absolute top-1/2 h-48 w-full translate-y-12 scale-x-150 bg-black blur-2xl" />
        <div className="absolute top-1/2 z-50 h-48 w-full bg-transparent opacity-10 backdrop-blur-md" />

        {/* Big glow blob */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isOn ? 0.2 : 0 }}
          transition={{ delay: isOn ? 0.3 : 0, duration: 0.8 }}
          className="absolute inset-auto z-50 h-36 w-[28rem] -translate-y-1/2 rounded-full bg-[#f0ece4] blur-3xl"
        />

        {/* Small tight glow */}
        <motion.div
          initial={{ width: "8rem", opacity: 0 }}
          animate={{ opacity: isOn ? 0.7 : 0, width: isOn ? "16rem" : "0rem" }}
          transition={{ delay: isOn ? 0.3 : 0, duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-auto z-30 h-36 w-64 -translate-y-[6rem] rounded-full bg-[#e8e2d8] blur-2xl"
        />

        {/* The lamp line */}
        <motion.div
          initial={{ width: "15rem", opacity: 0 }}
          animate={{ opacity: isOn ? 0.9 : 0.1, width: isOn ? "30rem" : "15rem" }}
          transition={{ delay: isOn ? 0.3 : 0, duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-auto z-50 h-0.5 -translate-y-[7rem] bg-[#f0ece4]"
        />

        {/* Bottom mask */}
        <div className="absolute inset-auto z-40 h-44 w-full -translate-y-[12.5rem] bg-black" />
      </div>

      {/* Content */}
      <div className="relative z-50 flex -translate-y-24 sm:-translate-y-12 lg:-translate-y-20 flex-col items-center px-5 w-full">
        {children}
      </div>
    </div>
  );
};
