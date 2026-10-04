"use client";

/*
 * Sign-up and onboarding for paid plans (Bloom, Team).
 * Free needs no account: the app works straight after download.
 *
 * Steps: account → about you → first tasks → look → team (Team plan) → done.
 * Bloom (the site's HolographicButterfly) flies to a landing spot on each step.
 * The account is created at the end, with every answer saved on the account
 * (user metadata `bb_onboarding`) so the app can pick them up at first sign-in.
 */
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, animate, motion, useMotionValue, useReducedMotion } from "framer-motion";
import { createClient } from "@supabase/supabase-js";
import { HolographicButterfly } from "@/components/sections/DeepDiveFlight";
import { MAC_DOWNLOAD_URL, WINDOWS_DOWNLOAD_URL } from "@/lib/downloads";
import { TEAM_SEAT_TIERS } from "@/lib/constants";

type Plan = "free" | "bloom" | "team";
type Step = "account" | "you" | "tasks" | "look" | "team" | "verify" | "done";
type Priority = "high" | "medium" | "low";
type Task = { title: string; priority: Priority };

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://ytzhcvzhifdzfporuwri.supabase.co";
const SUPABASE_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

const PLANS: Record<Plan, { name: string; monthly: string; yearly: string; blurb: string; perks: string[] }> = {
  free: { name: "Free", monthly: "$0", yearly: "$0", blurb: "no account needed", perks: [] },
  bloom: {
    name: "Bloom", monthly: "$8 a month", yearly: "$72 a year", blurb: "$8 a month",
    perks: [
      "Unlimited tasks, boards and notes",
      "Unlimited Bloom AI: Plan My Day, email replies, meeting notes to tasks",
      "Gmail and Outlook inbox, Google and Outlook calendar sync",
      "Goals, KPI reports and PDF exports",
      "Import from Trello, Asana, Jira, ClickUp, Notion and Monday.com",
      "Full history and priority support",
    ],
  },
  team: {
    name: "Team", monthly: "$12 per person a month", yearly: "$120 per person a year", blurb: "from $10 per person · 3 or more",
    perks: [
      "Everything in Bloom, for every member",
      "Shared boards, team chat and Team Space",
      "Voice and video calls with screen sharing and captions",
      "Handovers before a vacation, and a team leave calendar",
      "Pulse alerts on team risks, and every member's overview",
      "Admin controls: roles, invites and seats",
    ],
  },
};

/* Free trial length per plan, in days. */
const TRIAL_DAYS: Record<Plan, number> = { free: 0, bloom: 7, team: 14 };

/* Price after the trial. Team follows the seat tier (fewer per person from 10 and 20 seats). */
function priceLine(plan: Plan, yearly: boolean, seats: number) {
  if (plan !== "team") return yearly ? PLANS[plan].yearly : PLANS[plan].monthly;
  const tier = TEAM_SEAT_TIERS.find((t) => seats >= t.min && seats <= t.max) ?? TEAM_SEAT_TIERS[0];
  return yearly ? `$${tier.yearly * 12} per person a year` : `$${tier.monthly} per person a month`;
}

/* Checkout goes through /api/checkout so Team keeps its seat count. The Polar products
   carry the same free trial, so a card added during the trial is first charged when the
   trial ends. */
function checkoutUrl(plan: Plan, yearly: boolean, email: string, userId: string, seats: number) {
  if (plan === "free") return "/#pricing";
  const q = `customer_email=${encodeURIComponent(email)}${userId ? `&reference_id=${encodeURIComponent(userId)}` : ""}`;
  return `/api/checkout?plan=${plan}${plan === "team" ? `&quantity=${seats}` : ""}${yearly ? "&yearly=1" : ""}&${q}`;
}

const ROLES = ["Design", "Marketing", "Engineering", "Operations", "Sales", "Student", "Something else"];

/* Same rules as the app's sign-up, so a password that works here works there. */
function passwordChecks(p: string, email: string) {
  const local = email.split("@")[0]?.toLowerCase() || "";
  const lower = p.toLowerCase();
  const guessable =
    /(.)\1\1\1/.test(p) || /(0123|1234|2345|3456|4567|5678|6789|abcd|qwer|asdf)/i.test(p) ||
    ["password", "bloomboard", "letmein", "welcome", "qwerty", "admin"].some((w) => lower.includes(w)) ||
    (local.length >= 4 && lower.includes(local));
  return [
    { ok: p.length >= 10, label: "10 or more characters" },
    { ok: /[A-Z]/.test(p) && /[a-z]/.test(p), label: "Upper and lower case letters" },
    { ok: /[0-9]/.test(p), label: "A number" },
    { ok: /[^A-Za-z0-9]/.test(p), label: "A symbol like ! @ #" },
    { ok: !!p && !guessable, label: "Not easy to guess" },
  ];
}

function trialEnds(days = 7) {
  const d = new Date(Date.now() + days * 86400000);
  return d.toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long" });
}

const LOOK_LINES = { blue: "Blue is my favourite too.", light: "Nice and bright.", black: "Sleek. Easy on the eyes." };
const BLOOM_LINES: Record<Step, string> = {
  account: "Hi, I'm Bloom. I'll fly you through setup.",
  you: "What should I call you?",
  tasks: "These will be waiting for you in the app.",
  look: "Blue is my favourite too.",
  team: "The more the merrier.",
  verify: "Check your inbox. I'll wait right here.",
  done: "We made it! See you inside.",
};

export default function StartFlow() {
  const params = useSearchParams();
  /* Flow was merged into Bloom: old ?plan=flow links land on Bloom. Default is Bloom. */
  const planParam = params.get("plan") === "flow" ? "bloom" : params.get("plan") || "";
  const initialPlan: Plan = planParam === "free" || planParam === "team" ? planParam : "bloom";

  const [plan, setPlan] = useState<Plan>(initialPlan);
  const [yearly, setYearly] = useState(params.get("billing") === "yearly");
  /* Both choices get the full free trial. With a card added now, the plan carries on by
     itself when the trial ends (charged then); without one, they add it later if they keep it. */
  const [cardNow, setCardNow] = useState(params.get("card") === "now");
  // dev-only preview of a later step (?step=look); ignored in production builds
  const devStep = process.env.NODE_ENV === "development" ? (params.get("step") as Step | null) : null;
  const [step, setStep] = useState<Step>(devStep && devStep in BLOOM_LINES ? devStep : "account");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showChecks, setShowChecks] = useState(false);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [who, setWho] = useState<"me" | "team">(initialPlan === "team" ? "team" : "me");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [draft, setDraft] = useState("");
  const [theme, setTheme] = useState<"blue" | "light" | "black">("blue");
  const [teamName, setTeamName] = useState("");
  const [invites, setInvites] = useState<string[]>([]);
  /* Team size picked on the pricing page (3 to 50). The trial covers up to 10 of them. */
  const [seats, setSeats] = useState(() => Math.min(50, Math.max(3, Math.floor(Number(params.get("seats")) || 3))));
  const [userId, setUserId] = useState("");
  const [inviteDraft, setInviteDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [needsConfirm, setNeedsConfirm] = useState(false);
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [resendIn, setResendIn] = useState(0);
  const supaRef = useRef<ReturnType<typeof createClient> | null>(null);
  const codeRefs = useRef<Array<HTMLInputElement | null>>([]);
  useEffect(() => {
    if (resendIn <= 0) return;
    const t = window.setTimeout(() => setResendIn(resendIn - 1), 1000);
    return () => window.clearTimeout(t);
  }, [resendIn]);
  /* Kept in this tab's storage so a refresh mid-setup doesn't lose the confirmed account. */
  const client = () => (supaRef.current ||= createClient(SUPABASE_URL, SUPABASE_ANON, {
    auth: { persistSession: true, storageKey: "bb-start-auth", storage: typeof window !== "undefined" ? window.sessionStorage : undefined },
  }));

  /* Starts the trial on the server (the only place allowed to mark an account
     as trialling) and sends the "your trial has started" email. Never blocks
     sign-up: if it fails, the app can still start the trial at first sign-in. */
  async function startTrial(accessToken: string) {
    try {
      await fetch(`${SUPABASE_URL}/functions/v1/start-trial`, {
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}`, apikey: SUPABASE_ANON, "Content-Type": "application/json" },
        body: "{}",
      });
    } catch { /* not fatal */ }
  }

  async function verifyCode(digits: string[]) {
    const token = digits.join("");
    if (token.length !== 6 || busy) return;
    setBusy(true); setError("");
    try {
      const { data, error: e } = await client().auth.verifyOtp({ email: email.trim(), token, type: "signup" });
      if (e) throw e;
      if (!data.session) throw new Error("no session");
      setNeedsConfirm(false);
      setCode(["", "", "", "", "", ""]);
      go("you");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "";
      setError(/expired/i.test(msg) ? "That code has expired. Send a new one below." : "That code doesn't match. Check the email and try again.");
      setCode(["", "", "", "", "", ""]);
      codeRefs.current[0]?.focus();
    } finally {
      setBusy(false);
    }
  }
  function setDigit(i: number, v: string) {
    const clean = v.replace(/\D/g, "");
    if (clean.length > 1) {                                   // pasted the whole code
      const all = clean.slice(0, 6).split("");
      const next = ["", "", "", "", "", ""].map((_, k) => all[k] || "");
      setCode(next);
      codeRefs.current[Math.min(all.length, 5)]?.focus();
      if (all.length === 6) verifyCode(next);
      return;
    }
    const next = code.map((d, k) => (k === i ? clean : d));
    setCode(next);
    if (clean && i < 5) codeRefs.current[i + 1]?.focus();
    if (next.every((d) => d)) verifyCode(next);
  }
  async function resend() {
    if (resendIn > 0) return;
    setError("");
    const { error: e } = await client().auth.resend({ type: "signup", email: email.trim() });
    if (e) setError(e.message); else setResendIn(60);
  }

  const steps: Step[] = useMemo(
    () => (plan === "team" ? ["account", "you", "tasks", "look", "team", "done"] : ["account", "you", "tasks", "look", "done"]),
    [plan]
  );
  const index = step === "verify" ? 0 : steps.indexOf(step);
  const checks = passwordChecks(password, email);
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
  const passOk = checks.every((c) => c.ok);

  const go = (s: Step) => { setError(""); setStep(s); if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" }); };
  const next = () => go(steps[Math.min(index + 1, steps.length - 1)]);
  /* The account exists once the code is confirmed, so "Back" stops at "About you". */
  const back = () => go(steps[Math.max(index - 1, 1)]);

  function addTask() {
    const t = draft.trim();
    if (!t || tasks.length >= 10) return;
    setTasks([...tasks, { title: t.slice(0, 200), priority: tasks.length === 0 ? "high" : "medium" }]);
    setDraft("");
  }
  function addInvite() {
    const e = inviteDraft.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e) || invites.includes(e) || e === email.trim().toLowerCase()) return;
    setInvites([...invites, e].slice(0, 20));
    setInviteDraft("");
  }

  /* Step 1: create the account and send the 6-digit code. Nothing else happens
     until the code is confirmed. */
  async function createAccount() {
    if (busy) return;
    setShowChecks(true);
    if (!emailOk || !passOk) return;
    setBusy(true); setError("");
    try {
      if (!SUPABASE_ANON) throw new Error("Sign-up is not configured on this site yet.");
      const { data, error: e } = await client().auth.signUp({
        email: email.trim(), password,
        options: { data: { bb_onboarding: { v: 1, source: "web", plan, billing: yearly ? "yearly" : "monthly", stage: "account" } } },
      });
      if (e) throw e;
      /* Supabase answers "already registered" with an empty identities list. */
      if (data.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
        throw new Error("There is already an account with this email. Sign in to the BloomBoard app, or use another email.");
      }
      /* Every account must confirm its email with the 6-digit code before going on.
         A session here means Supabase has "Confirm email" switched off, so no code
         was sent: never let that through unverified. */
      if (data.session) {
        await client().auth.signOut();
        throw new Error("Sign-up is paused for a moment. Please try again later, or write to support@mybloomboard.app.");
      }
      setNeedsConfirm(true); setResendIn(60); go("verify");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "";
      setError(/rate|security purposes/i.test(msg) ? "Too many tries. Wait a minute and try again." : msg || "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  /* Last step: save the answers on the confirmed account, then start the trial. */
  async function finish() {
    if (busy) return;
    setBusy(true); setError("");
    try {
      const supa = client();
      const { data: sess } = await supa.auth.getSession();
      if (!sess.session) { setError("Please confirm your email first."); setResendIn(0); go("verify"); return; }
      const onboarding = {
        v: 1, source: "web", plan, billing: yearly ? "yearly" : "monthly",
        role, who, theme, tasks,
        team: plan === "team" ? { name: teamName.trim(), invites, seats } : null,
        seats: plan === "team" ? seats : undefined,
        trial_days: TRIAL_DAYS[plan],
        at: new Date().toISOString(),
      };
      const { error: e } = await supa.auth.updateUser({ data: { full_name: name.trim(), bb_onboarding: onboarding } });
      if (e) throw e;
      setUserId(sess.session.user.id);
      await startTrial(sess.session.access_token);
      go("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  const lastBeforeDone = steps[steps.length - 2];

  return (
    <div className="relative min-h-screen bg-black text-[#f5f5f7]">
      <header className="sticky top-0 z-30 flex h-[72px] items-center justify-between border-b border-white/[0.08] bg-black/90 px-5 backdrop-blur md:px-12">
        <Link href="/" className="flex items-center gap-2.5">
          <Image src="/logo.png" alt="BloomBoard logo" width={34} height={34} className="rounded-[10px]" />
          <span className="text-[17px] font-bold">BloomBoard</span>
        </Link>
        {step !== "done" && plan !== "free" && (
          <div className="hidden items-center gap-3.5 sm:flex" aria-label={`Step ${index + 1} of ${steps.length - 1}`}>
            <div className="flex gap-1.5">
              {steps.slice(0, -1).map((s, i) => (
                <span key={s} className={`h-1 w-9 rounded-full transition-colors duration-500 md:w-11 ${i <= index ? "bg-[#4d9fff]" : "bg-[#2a2a2e]"}`} />
              ))}
            </div>
            <span className="text-[13px] text-[#a1a1aa]">Step {index + 1} of {steps.length - 1}</span>
          </div>
        )}
        {step === "account" ? (
          <span className="text-sm text-[#a1a1aa]">
            Already have an account? <span className="font-semibold text-[#f5f5f7]">Sign in inside the app</span>
          </span>
        ) : (
          <span className="hidden text-sm text-[#a1a1aa] sm:inline">{email}</span>
        )}
      </header>

      <main className="relative mx-auto w-full max-w-[1120px] px-5 pb-40 pt-10 md:px-12 md:pt-14">
        <AnimatePresence mode="wait">
          <motion.section
            key={step}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.28, ease: [0.2, 0.8, 0.2, 1] }}
          >
            {step === "account" && (
              <div className="grid gap-12 md:grid-cols-2 md:gap-16">
                <div className="flex flex-col gap-5">
                  <div>
                    <h1 className="text-[34px] font-bold leading-[1.1] tracking-[-0.03em] md:text-[40px]">
                      {plan === "free" ? "BloomBoard Free." : plan === "team" ? "Start your free two weeks." : "Start your free week."}
                    </h1>
                    <p className="mt-3 text-[17px] leading-relaxed text-[#a1a1aa]">
                      {plan === "free"
                        ? "Free needs no account. Download the app and start straight away."
                        : `Try every ${PLANS[plan].name} feature for ${TRIAL_DAYS[plan]} days. No card needed, cancel anytime.`}
                    </p>
                  </div>
                  <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3" role="radiogroup" aria-label="Plan">
                    {(Object.keys(PLANS) as Plan[]).map((p) => (
                      <button
                        key={p} type="button" role="radio" aria-checked={plan === p}
                        onClick={() => { setPlan(p); if (p === "team") setWho("team"); }}
                        className={`flex flex-col items-start rounded-[14px] px-4 py-3.5 text-left transition-colors ${plan === p ? "border-2 border-[#4d9fff] bg-[#0b1726]" : "border border-white/10 bg-[#0d0d0f] hover:border-white/25"}`}
                      >
                        <div className="text-[15px] font-bold">{PLANS[p].name}</div>
                        <div className="mb-2.5 mt-1 text-[13px] text-[#a1a1aa]">{PLANS[p].blurb}</div>
                        <span className={`mt-auto whitespace-nowrap text-[12px] font-medium ${p === "free" ? "text-white/55" : plan === p ? "text-[#4d9fff]" : "text-white/70"}`}>
                          {p === "free" ? "Free, no time limit" : `${TRIAL_DAYS[p]}-day free trial`}
                        </span>
                      </button>
                    ))}
                  </div>
                  {plan !== "free" && (
                    <div className="flex flex-col gap-2.5 rounded-2xl border border-white/[0.08] bg-[#0d0d0f] px-5 py-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold">{PLANS[plan].name} includes</span>
                        <div className="flex rounded-lg bg-white/[0.06] p-0.5 text-xs font-semibold">
                          <button type="button" onClick={() => setYearly(false)} className={`rounded-md px-2.5 py-1 ${!yearly ? "bg-white text-black" : "text-[#a1a1aa]"}`}>Monthly</button>
                          <button type="button" onClick={() => setYearly(true)} className={`rounded-md px-2.5 py-1 ${yearly ? "bg-white text-black" : "text-[#a1a1aa]"}`}>Yearly</button>
                        </div>
                      </div>
                      {PLANS[plan].perks.map((perk) => (
                        <div key={perk} className="flex items-start gap-2.5 text-sm leading-snug text-[#d4d4d8]">
                          <svg className="mt-px shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4d9fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12l5 5L20 7" /></svg>
                          {perk}
                        </div>
                      ))}
                      <div className="mt-1 text-[13px] text-[#a1a1aa]">
                        {cardNow
                          ? <>Free for {TRIAL_DAYS[plan]} days, then {priceLine(plan, yearly, seats)}, charged to your card when the trial ends. Cancel before then and you pay nothing.</>
                          : <>No card now. After {TRIAL_DAYS[plan]} days, keep {PLANS[plan].name} for {priceLine(plan, yearly, seats)}, or carry on with Free. You are only charged if you add a card.</>}
                      </div>
                    </div>
                  )}
                  {plan !== "free" && (
                    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2" role="radiogroup" aria-label="Card">
                      {[
                        { now: false, title: "No card now", sub: `Try it free for ${TRIAL_DAYS[plan]} days. Add a card later, if you keep it.` },
                        { now: true, title: "Add card now", sub: `Still ${TRIAL_DAYS[plan]} days free. Charged only when the trial ends.` },
                      ].map((o) => (
                        <button
                          key={o.title} type="button" role="radio" aria-checked={cardNow === o.now}
                          onClick={() => setCardNow(o.now)}
                          className={`flex items-start gap-3 rounded-[14px] px-4 py-3.5 text-left transition-colors ${cardNow === o.now ? "border-2 border-[#4d9fff] bg-[#0b1726]" : "border border-white/10 bg-[#0d0d0f] hover:border-white/25"}`}
                        >
                          <span aria-hidden className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${cardNow === o.now ? "border-[#4d9fff]" : "border-white/30"}`}>
                            {cardNow === o.now && <span className="h-1.5 w-1.5 rounded-full bg-[#4d9fff]" />}
                          </span>
                          <span>
                            <span className="block text-[15px] font-bold">{o.title}</span>
                            <span className="mt-0.5 block text-[13px] leading-snug text-[#a1a1aa]">{o.sub}</span>
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {plan === "free" ? (
                  <div className="relative flex flex-col gap-4 self-start rounded-[22px] border border-white/[0.08] bg-[#0d0d0f] p-8">
                    <span data-bloom-anchor="account" className="pointer-events-none absolute right-0 top-0 h-0 w-0" />
                    <div className="text-[22px] font-bold tracking-[-0.02em]">Download BloomBoard</div>
                    <p className="text-[15px] leading-relaxed text-[#a1a1aa]">Everything stays on your computer. You can create an account later from Settings if you want to sync or join a team.</p>
                    <a href={MAC_DOWNLOAD_URL} className="flex h-[50px] items-center justify-center rounded-xl bg-[#f5f5f7] text-[15px] font-bold text-black">Download for Mac</a>
                    <a href={WINDOWS_DOWNLOAD_URL} className="flex h-[50px] items-center justify-center rounded-xl border border-white/20 text-[15px] font-semibold">Download for Windows</a>
                  </div>
                ) : (
                  <form
                    className="relative flex flex-col gap-[18px] self-start rounded-[22px] border border-white/[0.08] bg-[#0d0d0f] p-7 md:p-8"
                    onSubmit={(e) => { e.preventDefault(); createAccount(); }}
                    noValidate
                  >
                    <div className="text-[22px] font-bold tracking-[-0.02em]">Create your account</div>
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="su-email" className="text-[13px] font-semibold text-[#d4d4d8]">Work email</label>
                      <input id="su-email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)}
                        className="h-[46px] rounded-xl border border-white/[0.14] bg-black px-3.5 text-[15px] outline-none focus:border-2 focus:border-[#4d9fff]" />
                      {showChecks && !emailOk && <span className="text-xs text-[#ff8a80]">Enter a valid email address.</span>}
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="su-pass" className="text-[13px] font-semibold text-[#d4d4d8]">Password</label>
                      <input id="su-pass" type="password" autoComplete="new-password" value={password}
                        onChange={(e) => { setPassword(e.target.value); setShowChecks(true); }}
                        className="h-[46px] rounded-xl border border-white/[0.14] bg-black px-3.5 text-[15px] outline-none focus:border-2 focus:border-[#4d9fff]" />
                      {showChecks && (
                        <ul className="mt-1 grid grid-cols-1 gap-1 text-xs sm:grid-cols-2">
                          {checks.map((c) => (
                            <li key={c.label} className={c.ok ? "text-[#a6e9b8]" : "text-[#a1a1aa]"}>{c.ok ? "✓" : "○"} {c.label}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                    <button type="submit" className="h-12 rounded-xl bg-[#f5f5f7] text-[15px] font-bold text-black transition-opacity hover:opacity-90">{busy ? "Creating your account…" : "Create account"}</button>
                    {error && <p className="text-[13px] text-[#ff8a80]">{error}</p>}
                    <p className="text-xs leading-relaxed text-[#a1a1aa]">
                      By continuing you agree to the <a className="text-[#4d9fff]" href="/terms.html">Terms</a> and <a className="text-[#4d9fff]" href="/privacy.html">Privacy Policy</a>. This is the same account you use in the BloomBoard app.
                    </p>
                    <span data-bloom-anchor="account" className="pointer-events-none absolute right-0 top-0 h-0 w-0" />
                  </form>
                )}
              </div>
            )}

            {step === "you" && (
              <div className="mx-auto flex max-w-[640px] flex-col gap-9">
                <div className="text-center">
                  <h1 className="text-[34px] font-bold tracking-[-0.03em] md:text-[40px]">Nice to meet you.</h1>
                  <p className="mt-2.5 text-[17px] text-[#a1a1aa]">Three quick questions so BloomBoard fits the way you work.</p>
                </div>
                <div className="relative flex flex-col gap-2">
                  <label htmlFor="ob-name" className="text-sm font-semibold">What should we call you?</label>
                  <input id="ob-name" autoFocus value={name} onChange={(e) => setName(e.target.value.slice(0, 60))} placeholder="Your first name"
                    className="h-[50px] rounded-xl border border-white/[0.14] bg-[#0d0d0f] px-4 text-[17px] outline-none focus:border-2 focus:border-[#4d9fff]" />
                  <span data-bloom-anchor="you" className="pointer-events-none absolute -right-16 top-10 h-0 w-0" />
                </div>
                <div className="flex flex-col gap-2.5">
                  <span className="text-sm font-semibold">What do you do?</span>
                  <div className="flex flex-wrap gap-2">
                    {ROLES.map((r) => (
                      <button key={r} type="button" aria-pressed={role === r} onClick={() => setRole(r)}
                        className={`h-[38px] rounded-full px-4 text-sm transition-colors ${role === r ? "border border-[#4d9fff] bg-[#0b1726] font-semibold" : "border border-white/[0.14] text-[#d4d4d8] hover:border-white/30"}`}>{r}</button>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-2.5">
                  <span className="text-sm font-semibold">Who is it for?</span>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {([["me", "Just me", "Plan my own days and projects"], ["team", "Me and my team", "Shared boards, chat and calls"]] as const).map(([k, t, d]) => (
                      <button key={k} type="button" aria-pressed={who === k} onClick={() => setWho(k)}
                        className={`flex items-center gap-3.5 rounded-2xl p-[18px] text-left transition-colors ${who === k ? "border-2 border-[#4d9fff] bg-[#0b1726]" : "border border-white/[0.14] bg-[#0d0d0f] hover:border-white/30"}`}>
                        <span><span className="block text-[15px] font-bold">{t}</span><span className="mt-0.5 block text-[13px] text-[#a1a1aa]">{d}</span></span>
                      </button>
                    ))}
                  </div>
                  {who === "team" && plan !== "team" && (
                    <p className="text-[13px] text-[#a1a1aa]">
                      Working with others? The Team plan adds shared boards, Team Space and calls. <button type="button" className="font-semibold text-[#4d9fff]" onClick={() => setPlan("team")}>Switch to Team</button>
                    </p>
                  )}
                </div>
              </div>
            )}

            {step === "tasks" && (
              <div className="grid gap-12 md:grid-cols-2 md:gap-14">
                <div className="flex flex-col gap-5">
                  <div>
                    <h1 className="text-[34px] font-bold leading-[1.1] tracking-[-0.03em] md:text-[40px]">What&apos;s on your plate this week?</h1>
                    <p className="mt-3 text-[17px] leading-relaxed text-[#a1a1aa]">Add a few real tasks. They will be waiting for you in the app.</p>
                  </div>
                  <form className="flex gap-2.5" onSubmit={(e) => { e.preventDefault(); addTask(); }}>
                    <label htmlFor="ob-task" className="sr-only">New task</label>
                    <input id="ob-task" autoFocus value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="For example: Send the invoice to Acme"
                      className="h-[50px] flex-1 rounded-xl border border-white/[0.14] bg-[#0d0d0f] px-4 text-base outline-none focus:border-2 focus:border-[#4d9fff]" />
                    <button type="submit" className="h-[50px] rounded-xl bg-[#f5f5f7] px-5 text-[15px] font-bold text-black disabled:opacity-40" disabled={!draft.trim() || tasks.length >= 10}>Add</button>
                  </form>
                  <div className="flex flex-col gap-2">
                    {tasks.map((t, i) => (
                      <div key={i} className="flex items-center gap-3 rounded-xl border border-white/[0.08] bg-[#0d0d0f] px-3.5 py-3">
                        <span className="flex-1 text-[15px]">{t.title}</span>
                        <span className="flex gap-1">
                          {(["high", "medium", "low"] as Priority[]).map((p) => (
                            <button key={p} type="button" aria-pressed={t.priority === p}
                              onClick={() => setTasks(tasks.map((x, j) => (j === i ? { ...x, priority: p } : x)))}
                              className={`inline-flex h-7 items-center gap-1.5 rounded-lg px-2.5 text-xs ${t.priority === p ? PRIORITY_ON[p] : "border border-white/[0.12] text-[#a1a1aa]"}`}>
                              <span aria-hidden className="h-1.5 w-1.5 rounded-full" style={{ background: PRIORITY_DOT[p] }} />
                              {p === "medium" ? "Med" : p[0].toUpperCase() + p.slice(1)}
                            </button>
                          ))}
                        </span>
                        <button type="button" aria-label={`Remove ${t.title}`} onClick={() => setTasks(tasks.filter((_, j) => j !== i))} className="text-[#a1a1aa] hover:text-white">✕</button>
                      </div>
                    ))}
                    {!tasks.length && <p className="text-sm text-[#a1a1aa]">Type a task and press Enter. Add up to 10, or skip this for now.</p>}
                  </div>
                </div>
                <div className="relative flex flex-col gap-3">
                  <span className="text-[13px] font-semibold text-[#a1a1aa]">How it will look in BloomBoard</span>
                  <div className="flex flex-col gap-2.5 rounded-[18px] border border-white/10 bg-[#123e5a] p-[18px]">
                    <div className="flex items-center gap-2 text-[13px] font-bold text-[#e6f2fb]">
                      <span className="h-2 w-2 rounded-full bg-[#8cc3ff]" />To Do<span className="ml-auto text-xs text-[#b8d2e3]">{tasks.length}</span>
                    </div>
                    {[...tasks].sort((a, b) => PR[a.priority] - PR[b.priority]).map((t, i) => (
                      <div key={i} className="flex flex-col gap-1.5 rounded-xl bg-[#1c587e] px-3.5 py-3">
                        <span className="text-sm font-semibold">{t.title}</span>
                        <span className="flex items-center gap-1.5 text-xs" style={{ color: PRIORITY_TEXT[t.priority] }}>
                          <span className="h-[7px] w-[7px] rounded-full" style={{ background: PRIORITY_DOT[t.priority] }} />
                          {t.priority === "medium" ? "Medium" : t.priority[0].toUpperCase() + t.priority.slice(1)}
                        </span>
                      </div>
                    ))}
                    {!tasks.length && <div className="rounded-xl border border-dashed border-white/20 px-3.5 py-6 text-center text-sm text-[#b8d2e3]">Your tasks will appear here</div>}
                  </div>
                  <span data-bloom-anchor="tasks" className="pointer-events-none absolute right-2 top-2 h-0 w-0" />
                </div>
              </div>
            )}

            {step === "look" && (
              <div className="flex flex-col items-center gap-10">
                <div className="text-center">
                  <h1 className="text-[34px] font-bold tracking-[-0.03em] md:text-[40px]">Pick your look.</h1>
                  <p className="mt-2.5 text-[17px] text-[#a1a1aa]">You can change it any time in Settings.</p>
                </div>
                <div className="grid w-full gap-6 md:grid-cols-3">
                  {THEMES.map((t) => (
                    <button key={t.key} type="button" aria-pressed={theme === t.key} onClick={() => setTheme(t.key)}
                      className={`relative flex flex-col gap-3.5 rounded-[20px] p-3 text-left transition-colors ${theme === t.key ? "border-2 border-[#4d9fff] bg-[#0b1726]" : "border border-white/[0.14] bg-[#0d0d0f] hover:border-white/30"}`}>
                      <div className="flex h-[180px] overflow-hidden rounded-xl" style={{ background: t.bg, border: t.key === "black" ? "1px solid rgba(255,255,255,.08)" : undefined }}>
                        <div className="flex w-16 flex-col gap-2.5 px-2.5 py-3.5" style={{ background: t.side }}>
                          <span className="h-2 rounded" style={{ background: t.ink, opacity: 0.35 }} />
                          <span className="h-2 rounded" style={{ background: t.ink, opacity: 0.16 }} />
                          <span className="h-2 rounded" style={{ background: t.ink, opacity: 0.16 }} />
                        </div>
                        <div className="flex flex-1 flex-col gap-2 p-3.5">
                          <span className="h-2.5 w-1/2 rounded" style={{ background: t.ink, opacity: 0.7 }} />
                          {[0, 1, 2].map((k) => <span key={k} className="h-8 rounded-lg" style={{ background: t.card }} />)}
                        </div>
                      </div>
                      <div className="flex items-center justify-between px-1">
                        <span className="text-base font-bold">{t.name}</span>
                        {theme === t.key && <span className="flex h-[22px] w-[22px] items-center justify-center rounded-full bg-[#4d9fff] text-xs font-black text-black">✓</span>}
                      </div>
                      {theme === t.key && <span data-bloom-anchor="look" className="pointer-events-none absolute left-2 top-2 h-0 w-0" />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === "team" && (
              <div className="mx-auto flex max-w-[600px] flex-col gap-8">
                <div className="text-center">
                  <h1 className="text-[34px] font-bold tracking-[-0.03em] md:text-[40px]">Bring your team along.</h1>
                  <p className="mt-2.5 text-[17px] text-[#a1a1aa]">Name your team and add the people you work with. The invites go out when you create the team in the app.</p>
                </div>
                <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/[0.14] bg-[#0d0d0f] px-4 py-3.5">
                  <div>
                    <div className="text-sm font-semibold">Team size</div>
                    <div className="mt-0.5 text-[13px] text-[#a1a1aa]">{seats <= 10 ? "Your trial includes all of them." : "Your trial includes 10. The rest start when you buy."}</div>
                  </div>
                  <div className="flex items-center gap-2" role="group" aria-label="Team size">
                    <button type="button" aria-label="Fewer people" onClick={() => setSeats(Math.max(3, seats - 1))} disabled={seats <= 3}
                      className="h-10 w-10 rounded-xl border border-white/20 text-lg font-semibold disabled:opacity-40">−</button>
                    <span className="w-10 text-center text-lg font-bold tabular-nums" aria-live="polite">{seats}</span>
                    <button type="button" aria-label="More people" onClick={() => setSeats(Math.min(50, seats + 1))} disabled={seats >= 50}
                      className="h-10 w-10 rounded-xl border border-white/20 text-lg font-semibold disabled:opacity-40">+</button>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="ob-team" className="text-sm font-semibold">Team name</label>
                  <input id="ob-team" autoFocus value={teamName} onChange={(e) => setTeamName(e.target.value.slice(0, 60))} placeholder="Your team or company"
                    className="h-[50px] rounded-xl border border-white/[0.14] bg-[#0d0d0f] px-4 text-base outline-none focus:border-2 focus:border-[#4d9fff]" />
                </div>
                <div className="relative flex flex-col gap-2">
                  <span className="text-sm font-semibold">Invite by email</span>
                  {invites.map((e) => (
                    <div key={e} className="flex h-[50px] items-center gap-2.5 rounded-xl border border-white/[0.14] bg-[#0d0d0f] px-4 text-[15px]">
                      <span className="flex-1">{e}</span><span className="text-xs text-[#a6e9b8]">Invited when you create the team</span>
                      <button type="button" aria-label={`Remove ${e}`} onClick={() => setInvites(invites.filter((x) => x !== e))} className="text-[#a1a1aa] hover:text-white">✕</button>
                    </div>
                  ))}
                  <form className="flex gap-2.5" onSubmit={(e) => { e.preventDefault(); addInvite(); }}>
                    <label htmlFor="ob-invite" className="sr-only">Teammate email</label>
                    <input id="ob-invite" type="email" value={inviteDraft} onChange={(e) => setInviteDraft(e.target.value)} placeholder="name@company.com"
                      className="h-[50px] flex-1 rounded-xl border border-white/[0.14] bg-[#0d0d0f] px-4 text-[15px] outline-none focus:border-2 focus:border-[#4d9fff]" />
                    <button type="submit" className="h-[50px] rounded-xl border border-white/20 px-5 text-[15px] font-semibold">Add</button>
                  </form>
                  <span data-bloom-anchor="team" className="pointer-events-none absolute -right-16 bottom-4 h-0 w-0" />
                </div>
                <p className="rounded-2xl border border-white/[0.08] bg-[#0d0d0f] px-4 py-3.5 text-[13px] leading-relaxed text-[#a1a1aa]">
                  Each person gets an email with a link. They join with their own account and see shared boards, Team Space and chat straight away.
                </p>
              </div>
            )}

            {step === "verify" && (
              <div className="mx-auto flex max-w-[560px] flex-col items-center gap-8 text-center">
                <div>
                  <h1 className="text-[34px] font-bold tracking-[-0.03em] md:text-[40px]">Check your email.</h1>
                  <p className="mt-3 text-[17px] leading-relaxed text-[#a1a1aa]">
                    We sent a 6-digit code to <span className="text-[#f5f5f7]">{email.trim()}</span>. Enter it here to continue.
                  </p>
                </div>
                <div className="relative flex gap-2.5" role="group" aria-label="Verification code">
                  {code.map((d, i) => (
                    <input
                      key={i}
                      ref={(el) => { codeRefs.current[i] = el; }}
                      value={d}
                      inputMode="numeric"
                      autoComplete={i === 0 ? "one-time-code" : "off"}
                      autoFocus={i === 0}
                      aria-label={`Digit ${i + 1}`}
                      maxLength={6}
                      onChange={(e) => setDigit(i, e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Backspace" && !d && i > 0) codeRefs.current[i - 1]?.focus(); }}
                      className="h-16 w-12 rounded-xl border border-white/[0.14] bg-[#0d0d0f] text-center font-mono text-[28px] font-semibold outline-none focus:border-2 focus:border-[#4d9fff] md:h-[72px] md:w-14"
                    />
                  ))}
                  <span data-bloom-anchor="verify" className="pointer-events-none absolute -right-14 -top-4 h-0 w-0" />
                </div>
                {busy && <p className="text-sm text-[#a1a1aa]">Checking…</p>}
                {error && <p className="text-sm text-[#ff8a80]">{error}</p>}
                <p className="text-sm text-[#a1a1aa]">
                  No email? Check spam, or{" "}
                  <button type="button" onClick={resend} disabled={resendIn > 0} className="font-semibold text-[#4d9fff] disabled:text-[#a1a1aa]">
                    {resendIn > 0 ? `send a new code in ${resendIn}s` : "send a new code"}
                  </button>.
                </p>
              </div>
            )}

            {step === "done" && (
              <div className="grid gap-12 md:grid-cols-2 md:gap-16">
                <div className="flex flex-col gap-6">
                  <div className="relative h-[120px]"><span data-bloom-anchor="done" className="pointer-events-none absolute left-[70px] top-[60px] h-0 w-0" /></div>
                  <h1 className="text-[40px] font-bold leading-[1.08] tracking-[-0.03em] md:text-[44px]">You&apos;re all set{name.trim() ? `, ${name.trim()}` : ""}.</h1>
                  <div className="flex flex-col gap-3">
                    <Done>Account created for {email.trim()}</Done>
                    {tasks.length > 0 && <Done>{tasks.length} task{tasks.length === 1 ? "" : "s"} saved to your account</Done>}
                    <Done>{THEMES.find((t) => t.key === theme)?.name} look chosen</Done>
                    {plan === "team" && teamName.trim() && <Done>Team “{teamName.trim()}” saved{invites.length ? ` with ${invites.length} invite${invites.length === 1 ? "" : "s"}` : ""}. Create it in the app with one click.</Done>}
                  </div>
                  {plan !== "free" && (
                    <div className="flex flex-col gap-3 rounded-2xl border border-[#4d9fff]/45 bg-[#0b1726] px-5 py-4">
                      <div>
                        <div className="text-[15px] font-bold">{cardNow ? "One step left: add your card" : `${PLANS[plan].name} is free until ${trialEnds(TRIAL_DAYS[plan])}`}</div>
                        <div className="mt-1 text-sm leading-relaxed text-[#b9c9dc]">
                          {cardNow
                            ? `Your free trial has started. Add your card now and ${PLANS[plan].name} carries on by itself when the trial ends on ${trialEnds(TRIAL_DAYS[plan])}. Nothing is charged before then, and you can cancel any time.`
                            : `No card on file. To keep ${PLANS[plan].name} after the trial, add your payment details any time before then. Otherwise you carry on with the free plan.`}
                        </div>
                      </div>
                      <a href={checkoutUrl(plan, yearly, email.trim(), userId, seats)} target="_blank" rel="noopener noreferrer"
                        className="flex h-11 items-center justify-center rounded-xl bg-[#f5f5f7] px-5 text-[14px] font-bold text-black">
                        {cardNow ? "Add card" : "Add payment details"}
                      </a>
                      <div className="text-[12.5px] text-[#9fb0c4]">{plan === "team" ? `${seats} seats, ` : ""}{priceLine(plan, yearly, seats)}. Use {email.trim()} at checkout so it lands on this account.</div>
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-4 md:pt-[110px]">
                  <div className="flex flex-col gap-4 rounded-[22px] border border-white/[0.08] bg-[#0d0d0f] p-7 md:p-8">
                    <div className="text-xl font-bold">Get the app</div>
                    {needsConfirm ? (
                      <p className="text-[15px] leading-relaxed text-[#a1a1aa]">
                        First, confirm your email: we sent a link to <span className="text-[#f5f5f7]">{email.trim()}</span>. Then sign in to the app with it. Your tasks and plan will be there, no license key needed.
                      </p>
                    ) : (
                      <p className="text-[15px] leading-relaxed text-[#a1a1aa]">Sign in with {email.trim()}. Your tasks and your plan are already there, no license key needed.</p>
                    )}
                    <a href={MAC_DOWNLOAD_URL} className="flex h-[50px] items-center justify-center rounded-xl bg-[#f5f5f7] text-[15px] font-bold text-black">Download for Mac</a>
                    <a href={WINDOWS_DOWNLOAD_URL} className="flex h-[50px] items-center justify-center rounded-xl border border-white/20 text-[15px] font-semibold">Download for Windows</a>
                    <div className="text-center text-[13px] text-[#a1a1aa]">iPhone app coming soon</div>
                  </div>
                </div>
              </div>
            )}
          </motion.section>
        </AnimatePresence>

        {step !== "account" && step !== "done" && step !== "verify" && (
          <div className="fixed inset-x-0 bottom-0 z-20 border-t border-white/[0.06] bg-black/90 backdrop-blur">
            <div className="mx-auto flex max-w-[1120px] items-center justify-end gap-3 px-5 py-4 md:px-12">
              {error && <p className="mr-auto max-w-md text-[13px] text-[#ff8a80]">{error}</p>}
              {(step === "tasks" || step === "team") && (
                <button type="button" className="mr-2 text-sm text-[#a1a1aa] hover:text-white" onClick={() => (step === lastBeforeDone ? finish() : next())}>
                  {step === "team" ? "Skip for now" : "Skip"}
                </button>
              )}
              <button type="button" onClick={back} hidden={step === "you"} className="h-12 rounded-xl border border-white/[0.14] px-5 text-[15px] font-semibold hover:bg-white/5">Back</button>
              <button
                type="button"
                disabled={busy || (step === "you" && !name.trim())}
                onClick={() => (step === lastBeforeDone ? finish() : next())}
                className="h-12 rounded-xl bg-[#f5f5f7] px-7 text-[15px] font-bold text-black transition-opacity hover:opacity-90 disabled:opacity-40"
              >
                {busy ? "Saving…" : step === lastBeforeDone ? "Finish" : "Continue"}
              </button>
            </div>
          </div>
        )}
      </main>

      <BloomGuide
        step={step}
        spot={step === "look" ? step + theme : step}
        line={
          step === "done" && name.trim() ? `We made it! See you inside, ${name.trim()}.`
          : step === "look" ? LOOK_LINES[theme]
          : step === "you" && name.trim() ? `Hi ${name.trim()}! Tell me a little more.`
          : BLOOM_LINES[step]
        }
      />
    </div>
  );
}

const PR: Record<Priority, number> = { high: 0, medium: 1, low: 2 };
const PRIORITY_ON: Record<Priority, string> = {
  high: "border border-white bg-white font-semibold text-black",
  medium: "border border-white bg-white font-semibold text-black",
  low: "border border-white bg-white font-semibold text-black",
};
const PRIORITY_DOT: Record<Priority, string> = { high: "#ff453a", medium: "#ff9f0a", low: "#34c759" };
const PRIORITY_TEXT: Record<Priority, string> = { high: "#ffb4ae", medium: "#ffd28a", low: "#a6e9b8" };
const THEMES = [
  { key: "blue" as const, name: "Blue", bg: "#123e5a", side: "#0f3650", card: "#1c587e", ink: "#ffffff" },
  { key: "light" as const, name: "Light", bg: "#ffffff", side: "#f2f1ed", card: "#f2f1ed", ink: "#0f172a" },
  { key: "black" as const, name: "Black", bg: "#171717", side: "#0f0f0f", card: "#262626", ink: "#ffffff" },
];

function Done({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 text-base">
      <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="11" fill="#34c759" /><path d="M7 12.5l3.2 3.2L17 9" fill="none" stroke="#000" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
      <span>{children}</span>
    </div>
  );
}

/*
 * Bloom flies to the current step's anchor ([data-bloom-anchor]) along one smooth
 * curve (a single eased bezier, no sharp peak). Short hops inside a step, like
 * Blue -> Light -> Black, are quick low glides and the speech bubble stays open,
 * only its words change. A new step is a longer, gentle arc. Clicking again
 * mid-flight redirects from where Bloom is, so it never snaps.
 * Reduced motion: it simply moves there.
 */
function BloomGuide({ step, spot, line }: { step: Step; spot: string; line: string }) {
  const reduce = useReducedMotion();
  const x = useMotionValue(-120);
  const y = useMotionValue(140);
  const tilt = useMotionValue(0);
  const [ready, setReady] = useState(false);
  const [target, setTarget] = useState<{ x: number; y: number } | null>(null);
  const [landed, setLanded] = useState(false);
  const placed = useRef(false);
  const lastStep = useRef<Step | null>(null);
  const flight = useRef<{ stop: () => void } | null>(null);

  // words change a beat after typing stops, so the bubble doesn't flicker per key
  const [shown, setShown] = useState(line);
  useEffect(() => {
    const t = window.setTimeout(() => setShown(line), lastStep.current === step ? 350 : 0);
    return () => window.clearTimeout(t);
  }, [line, step]);

  const measure = useCallback(() => {
    const el = document.querySelector<HTMLElement>(`[data-bloom-anchor="${step}"]`);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    const size = 0.7 * Math.min(Math.max(window.innerWidth * 0.074, 88), 124);
    // keep the butterfly on screen, a little inset from the edges
    const px = Math.min(Math.max(r.left + window.scrollX, size / 2 + 8), document.documentElement.clientWidth - size / 2 - 8);
    const py = Math.max(r.top + window.scrollY, 72 + size / 2);
    return { x: px, y: py };
  }, [step]);

  useLayoutEffect(() => {
    const sameStep = placed.current && lastStep.current === step;
    lastStep.current = step;
    if (!sameStep) setLanded(false);
    let land = 0;
    // a new step waits for the page transition so its anchor is in place
    const t = window.setTimeout(() => {
      const to = measure();
      if (!to) return;
      setTarget(to);
      flight.current?.stop();
      if (reduce) {
        x.set(to.x); y.set(to.y); placed.current = true; setReady(true);
        land = window.setTimeout(() => setLanded(true), 150);
        return;
      }
      const from = { x: x.get(), y: y.get() };
      const dx = to.x - from.x, dy = to.y - from.y;
      const dist = Math.hypot(dx, dy);
      if (dist < 2) { setLanded(true); return; }
      // one control point above the midpoint: short hops barely rise, long flights arc softly
      const lift = sameStep ? Math.min(28, dist * 0.12) : Math.min(120, dist * 0.22 + 24);
      const c = { x: (from.x + to.x) / 2, y: Math.min(from.y, to.y) - lift };
      const duration = sameStep ? Math.min(0.75, 0.4 + dist / 1400) : Math.min(1.3, 0.75 + dist / 1600);
      const lean = Math.max(-10, Math.min(10, dx * 0.02));
      placed.current = true;
      setReady(true);
      flight.current = animate(0, 1, {
        duration,
        ease: [0.42, 0, 0.2, 1],
        onUpdate: (p) => {
          const q = 1 - p;
          x.set(q * q * from.x + 2 * q * p * c.x + p * p * to.x);
          y.set(q * q * from.y + 2 * q * p * c.y + p * p * to.y);
          tilt.set(lean * Math.sin(Math.PI * p));
        },
        onComplete: () => { tilt.set(0); setLanded(true); },
      });
    }, sameStep ? 0 : 320);
    return () => { window.clearTimeout(t); window.clearTimeout(land); };
  }, [step, spot, measure, reduce, x, y, tilt]);

  useEffect(() => {
    const onResize = () => { const to = measure(); if (to) { flight.current?.stop(); x.set(to.x); y.set(to.y); setTarget(to); } };
    window.addEventListener("resize", onResize);
    return () => { window.removeEventListener("resize", onResize); flight.current?.stop(); };
  }, [measure, x, y]);

  if (!ready || !target) return null;
  const bubbleLeft = target.x > (typeof window !== "undefined" ? window.innerWidth : 1280) - 320;

  return (
    <motion.div className="pointer-events-none absolute left-0 top-0 z-40" style={{ x, y }}>
      <div className="relative">
        <motion.div style={{ rotate: tilt, transformOrigin: "40px 40px" }}>
          <div style={{ transform: "scale(0.7)", transformOrigin: "0 0" }}><HolographicButterfly /></div>
        </motion.div>
        <AnimatePresence>
          {landed && (
            <motion.div
              layout
              initial={{ opacity: 0, y: 6, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.12 } }}
              transition={{ duration: 0.22, layout: { duration: 0.2 } }}
              className="absolute top-[-50px] w-max max-w-[230px] rounded-2xl border border-[#c4b5fd]/25 bg-[#1c1c1f] px-3.5 py-2.5 text-sm leading-snug text-[#f5f5f7]"
              style={bubbleLeft ? { right: 30, borderBottomRightRadius: 4 } : { left: 30, borderBottomLeftRadius: 4 }}
              role="status"
            >
              <motion.span key={shown} className="block" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
                {shown}
              </motion.span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
