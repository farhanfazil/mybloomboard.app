"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useDownload } from "@/lib/downloads";
import LiveDemoFrame from "@/components/sections/LiveDemoFrame";
import DemoIframe from "@/components/sections/DemoIframe";
import DemoUsefulPoll from "@/components/sections/DemoUsefulPoll";
import StickyPopouts from "@/components/sections/StickyPopouts";

export default function DemoPage() {
  const download = useDownload();
  /* The app is a desktop layout; phones get the fitted live preview instead. */
  const [phone, setPhone] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const update = () => setPhone(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return (
    <div className="flex h-[100dvh] flex-col bg-black text-white">
      <header className="flex shrink-0 items-center justify-between gap-3 border-b border-white/10 bg-[#171717] px-3 py-2 sm:px-4">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-white sm:text-[15px]">
            <span className="sm:hidden">Live demo</span>
            <span className="hidden sm:inline">You&apos;re trying BloomBoard</span>
          </p>
          <p className="hidden truncate text-xs text-[#607080] sm:block">
            The full app in your browser: tasks, boards, chat and meetings all work
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <DemoUsefulPoll compact className="mr-2 hidden md:flex" />
          <Link
            href="/"
            className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-white/80 transition hover:bg-white/5"
          >
            Back to site
          </Link>
          <a
            href={download.url}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-black transition hover:bg-white/90 sm:px-4 sm:text-sm"
          >
            Download for {download.label}
          </a>
        </div>
      </header>

      {phone ? (
        <main className="min-h-0 flex-1 overflow-y-auto px-4 py-6">
          <LiveDemoFrame eager />
        </main>
      ) : (
        <>
          <DemoIframe
            title="BloomBoard live demo"
            src="/bloomboard-demo/index.html?ws=personal,team&v=34"
            className="min-h-0 w-full flex-1 bg-[#171717]"
          />
          <StickyPopouts />
        </>
      )}
    </div>
  );
}
