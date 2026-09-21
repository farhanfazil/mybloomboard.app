"use client";

import React from "react";
import type { ComponentProps, ReactNode } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import {
  BellIcon,
  BotIcon,
  ChartNoAxesColumnIncreasingIcon,
  DownloadIcon,
  FileQuestionIcon,
  FrameIcon,
  LayoutDashboardIcon,
  ShieldCheckIcon,
} from "lucide-react";

interface FooterLink {
  title: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface FooterSection {
  label: string;
  links: FooterLink[];
}

const footerLinks: FooterSection[] = [
  {
    label: "Product",
    links: [
      { title: "Live demo", href: "/#live-demo", icon: LayoutDashboardIcon },
      { title: "Pricing", href: "#pricing", icon: ChartNoAxesColumnIncreasingIcon },
      { title: "Download", href: "#download", icon: DownloadIcon },
    ],
  },
  {
    label: "App",
    links: [
      { title: "Boards", href: "/#live-demo", icon: FrameIcon },
      { title: "AI Assistant", href: "/#live-demo", icon: BotIcon },
      { title: "Reminders", href: "/#live-demo", icon: BellIcon },
      { title: "Reports", href: "#pricing", icon: ChartNoAxesColumnIncreasingIcon },
    ],
  },
  {
    label: "Trust",
    links: [
      { title: "Local-first", href: "/local-first.html", icon: ShieldCheckIcon },
      { title: "No Tracking", href: "/no-tracking.html", icon: ShieldCheckIcon },
      { title: "FAQ", href: "#faq", icon: FileQuestionIcon },
      { title: "Privacy Policy", href: "/privacy.html", icon: ShieldCheckIcon },
      { title: "Terms of Service", href: "/terms.html", icon: FileQuestionIcon },
    ],
  },
  {
    label: "Plans",
    links: [
      { title: "Free", href: "#pricing" },
      { title: "Flow", href: "#pricing" },
      { title: "Bloom", href: "#pricing" },
      { title: "Team", href: "#pricing" },
    ],
  },
  {
    label: "Contact",
    links: [
      { title: "support@mybloomboard.app", href: "mailto:support@mybloomboard.app" },
      { title: "hello@mybloomboard.app", href: "mailto:hello@mybloomboard.app" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative mx-auto flex w-full max-w-6xl flex-col items-center justify-center border-t border-white/10 px-6 py-12 lg:py-16">

      <div className="grid w-full gap-8 xl:grid-cols-3 xl:gap-8">
        <AnimatedContainer className="space-y-4">
          <div className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="BloomBoard logo"
              width={40}
              height={40}
              className="rounded-xl"
            />
            <div>
              <p className="text-sm font-semibold text-text-primary">BloomBoard</p>
              <p className="text-xs text-text-muted">Your Day. One Board.</p>
            </div>
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-text-muted">
            A focused macOS dashboard for tasks, goals, reminders, health, streaks, boards, reports, and AI.
          </p>
          <p className="text-sm text-text-muted">
            © {new Date().getFullYear()} BloomBoard. All rights reserved.
          </p>
        </AnimatedContainer>

        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 xl:col-span-2">
          {footerLinks.map((section, index) => (
            <AnimatedContainer key={section.label} delay={0.1 + index * 0.1}>
              <div>
                <h3 className="text-sm font-semibold text-text-primary">
                  {section.label}
                </h3>
                <ul className="mt-4 space-y-2 text-sm text-text-muted">
                  {section.links.map((link) => (
                    <li key={link.title}>
                      <a
                        href={link.href}
                        className="inline-flex items-center transition-colors hover:text-text-primary"
                      >
                        {link.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </AnimatedContainer>
          ))}
        </div>
      </div>
    </footer>
  );
}

type ViewAnimationProps = {
  delay?: number;
  className?: ComponentProps<typeof motion.div>["className"];
  children: ReactNode;
};

function AnimatedContainer({ className, delay = 0.1, children }: ViewAnimationProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <>{children}</>;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
