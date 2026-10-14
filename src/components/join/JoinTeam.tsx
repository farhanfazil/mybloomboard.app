"use client";

/*
 * Landing page for the "Join {team}" button in a team invite email, and for "Join a team"
 * on /start (no code in the link: the person types it). Two ways in: join right here in the browser (app.mybloomboard.app, code and email
 * filled in), or use the desktop app (open it with the code, or download it first).
 */
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { MAC_DOWNLOAD_URL, WINDOWS_DOWNLOAD_URL } from "@/lib/downloads";

export default function JoinTeam() {
  const params = useSearchParams();
  const linkCode = useMemo(() => (params.get("code") || "").replace(/[^A-Za-z0-9]/g, "").slice(0, 16).toUpperCase(), [params]);
  const [typed, setTyped] = useState("");
  const code = linkCode || typed;
  const email = useMemo(() => (params.get("email") || "").slice(0, 200), [params]);
  const appLink = `bloombooard://join?code=${encodeURIComponent(code)}${email ? `&email=${encodeURIComponent(email)}` : ""}`;
  const webLink = `https://app.mybloomboard.app/login.html?join=${encodeURIComponent(code)}${email ? `&email=${encodeURIComponent(email)}` : ""}`;
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try { await navigator.clipboard.writeText(code); setCopied(true); window.setTimeout(() => setCopied(false), 1500); } catch { /* select instead */ }
  };

  return (
    <div className="min-h-screen bg-black text-[#f5f5f7]">
      <header className="mx-auto flex max-w-[1120px] items-center px-5 py-5 md:px-12">
        <Link href="/" className="flex items-center gap-2.5 font-bold">
          <Image src="/brand/mark-on-dark-tight.svg" alt="" width={25} height={30} unoptimized />
          BloomBoard
        </Link>
      </header>
      <main className="mx-auto flex max-w-[560px] flex-col gap-8 px-5 pb-24 pt-10 md:pt-16">
        <div>
          <h1 className="text-[34px] font-bold leading-tight tracking-[-0.03em] md:text-[40px]">{linkCode ? "You\u2019re invited to a team." : "Join your team."}</h1>
          <p className="mt-3 text-[17px] leading-relaxed text-[#a1a1aa]">
            Join on the web app right now, or use the BloomBoard app on your computer. Both stay in sync.
          </p>
        </div>

        <div className="flex flex-col gap-3 rounded-2xl border border-white/[0.12] bg-[#0d0d0f] p-5">
          {!linkCode && (
            <>
              <label htmlFor="join-code" className="text-xs font-bold uppercase tracking-[0.08em] text-[#a1a1aa]">Your invite code</label>
              <input
                id="join-code"
                value={typed}
                onChange={(e) => setTyped(e.target.value.replace(/[^A-Za-z0-9]/g, "").slice(0, 16).toUpperCase())}
                placeholder="From your invite email"
                autoComplete="off"
                spellCheck={false}
                className="h-14 rounded-xl border border-white/20 bg-black px-4 font-mono text-[22px] font-bold tracking-[0.2em] text-[#f5f5f7] outline-none placeholder:font-sans placeholder:text-[15px] placeholder:font-normal placeholder:tracking-normal placeholder:text-[#71717a] focus:border-[#4d9fff]"
              />
              <p className="text-sm text-[#a1a1aa]">Ask your team owner or admin if you can&apos;t find it.</p>
            </>
          )}
          {linkCode && (
            <>
              <div className="text-xs font-bold uppercase tracking-[0.08em] text-[#a1a1aa]">Your invite code</div>
              <div className="flex items-center justify-between gap-4">
                <span className="select-all font-mono text-[28px] font-bold tracking-[0.2em]">{code}</span>
                <button type="button" onClick={copy} className="h-10 rounded-xl border border-white/20 px-4 text-sm font-semibold">{copied ? "Copied" : "Copy"}</button>
              </div>
              {email && <div className="text-sm text-[#a1a1aa]">Sent to {email}. Join with this email.</div>}
            </>
          )}
          <a href={code ? webLink : "https://app.mybloomboard.app/login.html?join="} className="mt-1 flex h-12 items-center justify-center rounded-xl bg-[#f5f5f7] text-[15px] font-bold text-black">Join on the web app</a>
          <p className="text-sm text-[#a1a1aa]">No download. Create your account (or log in) with {email ? <b className="text-[#f5f5f7]">{email}</b> : "the invited email"} and you&apos;re in the team.</p>
        </div>

        <div className="flex flex-col gap-4">
          <div className="text-xs font-bold uppercase tracking-[0.08em] text-[#a1a1aa]">Or use the app on your computer</div>
          <ol className="flex flex-col gap-3 text-[15px] leading-relaxed">
            <li className="flex gap-3"><span className="font-bold text-[#a1a1aa]">1.</span><span>Download BloomBoard for Mac or Windows.</span></li>
            <li className="flex gap-3"><span className="font-bold text-[#a1a1aa]">2.</span><span>Sign up or log in{email ? <> with <b>{email}</b></> : " with the email the invite was sent to"}. You join the team automatically.</span></li>
          </ol>
          <div className="grid gap-3 sm:grid-cols-2">
            <a href={MAC_DOWNLOAD_URL} className="flex h-12 items-center justify-center rounded-xl border border-white/20 text-[15px] font-semibold">Download for Mac</a>
            <a href={WINDOWS_DOWNLOAD_URL} className="flex h-12 items-center justify-center rounded-xl border border-white/20 text-[15px] font-semibold">Download for Windows</a>
          </div>
          {code && <a href={appLink} className="text-sm font-semibold text-[#a1a1aa] underline underline-offset-4">Already have the app? Open it with this invite</a>}
        </div>

        <p className="text-sm text-[#a1a1aa]">Questions? Write to <a href="mailto:support@mybloomboard.app" className="underline">support@mybloomboard.app</a>.</p>
      </main>
    </div>
  );
}
