"use client";

import Link from "next/link";

const DOWNLOAD_URL =
  "https://github.com/farhanfazil/bloombooard-releases/releases/latest/download/BloomBoard-Installer.dmg";

export default function DemoPage() {
  return (
    <div className="flex h-[100dvh] flex-col bg-black text-white">
      <header className="flex shrink-0 items-center justify-between gap-3 border-b border-white/10 bg-[#0a1520] px-3 py-2 sm:px-4">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-white sm:text-[15px]">
            You&apos;re trying BloomBoard
          </p>
          <p className="hidden truncate text-xs text-[#607080] sm:block">
            Full app UI — tasks, boards, bookmarks &amp; meetings work in your browser
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Link
            href="/"
            className="hidden rounded-lg border border-white/10 px-3 py-1.5 text-xs text-[#9dceff] transition hover:bg-white/5 sm:inline-block"
          >
            Back to site
          </Link>
          <a
            href={DOWNLOAD_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-[#4d9fff] px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-[#3d8fef] sm:px-4 sm:text-sm"
          >
            Download for Mac
          </a>
        </div>
      </header>

      <p className="shrink-0 border-b border-amber-500/20 bg-amber-500/10 px-3 py-1.5 text-center text-[11px] text-amber-100/90 sm:hidden">
        Best on desktop — pinch to zoom if needed
      </p>

      <iframe
        title="BloomBoard live demo"
        src="/bloomboard-demo/index.html?v=29"
        className="min-h-0 w-full flex-1 border-0 bg-[#0a1520]"
        allow="clipboard-write"
      />
    </div>
  );
}
