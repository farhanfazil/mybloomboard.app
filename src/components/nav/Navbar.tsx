"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";

export default function Navbar() {
  const { scrollY } = useScroll();
  const bgOpacity = useTransform(scrollY, [0, 80], [0, 1]);

  return (
    <motion.header
      className="fixed left-0 right-0 top-0 z-50 px-4 py-3 sm:px-6 sm:py-4"
      style={{ backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)" }}
    >
      {/* Background layer */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: bgOpacity,
          background: "rgba(5, 10, 18, 0.85)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      />

      <div className="max-w-6xl mx-auto flex items-center justify-between relative">
        {/* Logo */}
        <a href="#hero" className="flex items-center gap-2.5 group">
          <Image
            src="/logo.png"
            alt="BloomBoard logo"
            width={38}
            height={38}
            className="rounded-xl transition-all group-hover:scale-110"
          />
          <span className="text-sm font-semibold text-text-primary">BloomBoard</span>
        </a>

        {/* Nav links (desktop) */}
        <nav className="hidden md:flex items-center gap-8">
          {[
            { label: "Features", href: "#features" },
            { label: "Walkthrough", href: "#walkthrough" },
            { label: "Pricing", href: "#pricing" },
            { label: "Download", href: "#download" },
          ].map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm text-text-muted hover:text-text-primary transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <a
          href="https://github.com/farhanfazil/bloombooard-releases/releases/latest/download/BloomBoard-Installer.dmg"
          className="hidden md:inline-flex items-center gap-2 px-5 py-2 rounded-full font-semibold text-sm transition-all duration-300 hover:scale-105 hover:brightness-105"
          style={{
            background: "rgba(255,255,255,0.92)",
            color: "#0a0f1c",
            boxShadow: "0 2px 14px rgba(0,0,0,0.30)",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
          </svg>
          Download Free
        </a>
      </div>
    </motion.header>
  );
}
