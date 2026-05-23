"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import GlowButton from "@/components/ui/GlowButton";

export default function Navbar() {
  const { scrollY } = useScroll();
  const bgOpacity = useTransform(scrollY, [0, 80], [0, 1]);

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
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
            alt="Bloombooard logo"
            width={38}
            height={38}
            className="rounded-xl transition-all group-hover:scale-110"
          />
          <span className="font-semibold text-text-primary text-sm">Bloombooard</span>
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
        <GlowButton label="Download Free" variant="ghost" href="#download" />
      </div>
    </motion.header>
  );
}
