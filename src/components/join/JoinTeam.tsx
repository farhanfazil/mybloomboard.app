"use client";

/*
 * Landing page for the "Join {team}" button in a team invite email.
 * Tries to open the installed app with the code (bloombooard://join); if the app
 * isn't installed, the page stays with download buttons and three short steps.
 */
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { MAC_DOWNLOAD_URL, WINDOWS_DOWNLOAD_URL } from "@/lib/downloads";

export default function JoinTeam() {
  const params = useSearchParams();
  const code = useMemo(() => (params.get("code") || "").replace(/[^A-Za-z0-9]/g, "").slice(0, 16).toUpperCase(), [params]);
  const email = useMemo(() => (params.get("email") || "").slice(0, 200), [params]);
  const appLink = `bloombooard://join?code=${encodeURIComponent(code)}${email ? `&email=${encodeURIComponent(email)}` : ""}`;
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!code) return;
    const t = window.setTimeout(() => { window.location.href = appLink; }, 400);
    return () => window.clearTimeout(t);
  }, [code, appLink]);

  const copy = async () => {
    try { await navigator.clipboard.writeText(code); setCopied(true); window.setTimeout(() => setCopied(false), 1500); } catch { /* select instead */ }
  };

  return (
    <div className="min-h-screen bg-black text-[#f5f5f7]">
      <header className="mx-auto flex max-w-[1120px] items-center px-5 py-5 md:px-12">
        <Link href="/" className="flex items-center gap-2.5 font-bold">
          <Image src="/email-icon.png" alt="" width={30} height={30} className="rounded-lg" />
          BloomBoard
        </Link>
      </header>
      <main className="mx-auto flex max-w-[560px] flex-col gap-8 px-5 pb-24 pt-10 md:pt-16">
        <div>
          <h1 className="text-[34px] font-bold leading-tight tracking-[-0.03em] md:text-[40px]">You&apos;re invited to a team.</h1>
          <p className="mt-3 text-[17px] leading-relaxed text-[#a1a1aa]">
            Opening BloomBoard with your invite code. If nothing happens, get the app first and follow the steps below.
          </p>
        </div>

        {code && (
          <div className="flex flex-col gap-3 rounded-2xl border border-white/[0.12] bg-[#0d0d0f] p-5">
            <div className="text-xs font-bold uppercase tracking-[0.08em] text-[#a1a1aa]">Your invite code</div>
            <div className="flex items-center justify-between gap-4">
              <span className="select-all font-mono text-[28px] font-bold tracking-[0.2em]">{code}</span>
              <button type="button" onClick={copy} className="h-10 rounded-xl border border-white/20 px-4 text-sm font-semibold">{copied ? "Copied" : "Copy"}</button>
            </div>
            {email && <div className="text-sm text-[#a1a1aa]">Sent to {email}. Join with this email.</div>}
            <a href={appLink} className="flex h-12 items-center justify-center rounded-xl bg-[#f5f5f7] text-[15px] font-bold text-black">Open BloomBoard</a>
          </div>
        )}

        <ol className="flex flex-col gap-4 text-[15px] leading-relaxed">
          <li className="flex gap-3"><span className="font-bold text-[#a1a1aa]">1.</span><span>Get BloomBoard for your computer.</span></li>
          <li className="flex gap-3"><span className="font-bold text-[#a1a1aa]">2.</span><span>Open it and sign up or log in{email ? <> with <b>{email}</b></> : " with the email the invite was sent to"}.</span></li>
          <li className="flex gap-3"><span className="font-bold text-[#a1a1aa]">3.</span><span>Go to Settings, then Team, and enter the code.</span></li>
        </ol>

        <div className="grid gap-3 sm:grid-cols-2">
          <a href={MAC_DOWNLOAD_URL} className="flex h-12 items-center justify-center rounded-xl border border-white/20 text-[15px] font-semibold">Download for Mac</a>
          <a href={WINDOWS_DOWNLOAD_URL} className="flex h-12 items-center justify-center rounded-xl border border-white/20 text-[15px] font-semibold">Download for Windows</a>
        </div>
        <p className="text-sm text-[#a1a1aa]">Questions? Write to <a href="mailto:support@mybloomboard.app" className="underline">support@mybloomboard.app</a>.</p>
      </main>
    </div>
  );
}
