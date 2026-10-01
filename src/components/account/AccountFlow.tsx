"use client";

/*
 * Manage subscription (mybloomboard.app/account).
 *
 * Everyone with a BloomBoard account can sign in here with an email code, whatever
 * their plan: free trial (no card yet), paying, team member or Free. Polar's own
 * portal only knows people who have paid, so trial users got no code there.
 *
 * After sign-in the page asks the `billing` function (Supabase) for the account's
 * plan (it also pulls any Polar subscriptions onto the account), then offers the
 * right next step: add a card, open billing (Polar, already signed in), or start
 * a trial.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { createClient, type SupabaseClient, type Session } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://ytzhcvzhifdzfporuwri.supabase.co";
const SUPABASE_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

type Trial = { plan?: string; ends_at?: string; seats?: number; billing?: string } | null;
type Personal = { plan?: string; status?: string; interval?: string; period_end?: string; cancel_at_period_end?: boolean } | null;
type Team = {
  name?: string; role?: string; status?: string; active?: boolean; seats?: number; used?: number;
  trial_ends_at?: string; paid_until?: string; is_owner?: boolean;
} | null;
type Entitlement = { signed_in?: boolean; personal?: Personal; team?: Team; trial?: Trial; owner?: boolean };

const PLAN_NAME: Record<string, string> = { flow: "Bloom", bloom: "Bloom", team: "Team" };

function fmtDate(iso?: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  return isNaN(d.getTime()) ? "" : d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}
function daysLeft(iso?: string | null) {
  if (!iso) return 0;
  return Math.max(0, Math.ceil((Date.parse(iso) - Date.now()) / 86400000));
}

export default function AccountFlow() {
  const supaRef = useRef<SupabaseClient | null>(null);
  const client = () => (supaRef.current ||= createClient(SUPABASE_URL, SUPABASE_ANON, {
    auth: { persistSession: true, storageKey: "bb-account-auth" },
  }));

  const [step, setStep] = useState<"email" | "code" | "loading" | "status">("loading");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [resendIn, setResendIn] = useState(0);
  const [session, setSession] = useState<Session | null>(null);
  const [ent, setEnt] = useState<Entitlement | null>(null);
  const [opening, setOpening] = useState(false);

  /* Signed in already (this tab, or back from the link in the email)? Skip the code. */
  useEffect(() => {
    const supa = client();
    supa.auth.getSession().then(({ data }) => {
      if (data.session) setSession(data.session);
      else setStep("email");
    });
    const { data: sub } = supa.auth.onAuthStateChange((_e, s) => { if (s) setSession(s); });
    return () => sub.subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (resendIn <= 0) return;
    const t = window.setTimeout(() => setResendIn((n) => n - 1), 1000);
    return () => window.clearTimeout(t);
  }, [resendIn]);

  const loadStatus = useCallback(async (s: Session) => {
    setStep("loading");
    setError("");
    try {
      const r = await fetch(`${SUPABASE_URL}/functions/v1/billing`, {
        method: "POST",
        headers: { Authorization: `Bearer ${s.access_token}`, apikey: SUPABASE_ANON, "Content-Type": "application/json" },
        body: JSON.stringify({ action: "sync" }),
      });
      const j = await r.json().catch(() => ({}));
      if (j?.entitlement) { setEnt(j.entitlement); setStep("status"); return; }
    } catch {}
    /* The function is unreachable: read the plan straight from the account instead. */
    const { data, error: e } = await client().rpc("my_entitlement");
    if (e || !data) { setError("We couldn't load your plan. Please try again in a moment."); setStep("status"); return; }
    setEnt(data as Entitlement);
    setStep("status");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => { if (session) void loadStatus(session); }, [session, loadStatus]);

  async function sendCode(e?: React.FormEvent) {
    e?.preventDefault();
    const addr = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(addr)) { setError("Enter the email you use for BloomBoard."); return; }
    setBusy(true); setError("");
    /* Our own code email (Supabase function account-code): a 6-digit code, no link. */
    let res: { ok?: boolean; error?: string; wait?: number } = {};
    try {
      const r = await fetch(`${SUPABASE_URL}/functions/v1/account-code`, {
        method: "POST",
        headers: { Authorization: `Bearer ${SUPABASE_ANON}`, apikey: SUPABASE_ANON, "Content-Type": "application/json" },
        body: JSON.stringify({ email: addr }),
      });
      res = await r.json().catch(() => ({}));
    } catch {}
    setBusy(false);
    if (res.error === "no_account") {
      setError("There's no BloomBoard account with this email. Check the spelling, or start a free trial.");
      return;
    }
    if (res.error === "rate") {
      setError(res.wait && res.wait > 90 ? "Too many codes for this email. Please try again in an hour." : "Please wait a minute before asking for another code.");
      return;
    }
    if (!res.ok) { setError("We couldn't send the code. Please try again."); return; }
    setCode(""); setResendIn(60); setStep("code");
  }

  async function verify(e?: React.FormEvent) {
    e?.preventDefault();
    const token = code.replace(/\D/g, "");
    if (token.length < 6) { setError("Enter the 6-digit code from the email."); return; }
    setBusy(true); setError("");
    const { data, error: err } = await client().auth.verifyOtp({ email: email.trim().toLowerCase(), token, type: "email" });
    setBusy(false);
    if (err || !data.session) { setError("That code didn't work. Check it, or ask for a new one."); return; }
    setSession(data.session);
  }

  async function openBilling() {
    if (!session) return;
    setOpening(true);
    try {
      const r = await fetch(`${SUPABASE_URL}/functions/v1/billing`, {
        method: "POST",
        headers: { Authorization: `Bearer ${session.access_token}`, apikey: SUPABASE_ANON, "Content-Type": "application/json" },
        body: JSON.stringify({ action: "portal" }),
      });
      const j = await r.json().catch(() => ({}));
      window.location.href = j?.url || "https://polar.sh/bloombooard/portal";
    } catch {
      window.location.href = "https://polar.sh/bloombooard/portal";
    }
  }

  async function signOut() {
    await client().auth.signOut();
    setSession(null); setEnt(null); setEmail(""); setCode(""); setStep("email");
  }

  const userEmail = session?.user?.email || email;
  const checkout = (plan: "bloom" | "team", seats?: number, yearly?: boolean) =>
    `/api/checkout?plan=${plan}${plan === "team" ? `&quantity=${Math.max(3, seats || 3)}` : ""}${yearly ? "&yearly=1" : ""}` +
    `&customer_email=${encodeURIComponent(userEmail)}&reference_id=${encodeURIComponent(session?.user?.id || "")}`;

  return (
    <div className="min-h-screen bg-black text-[#f5f5f7]">
      <header className="flex h-[72px] items-center justify-between border-b border-white/[0.08] px-5 md:px-12">
        <Link href="/" className="flex items-center gap-2.5">
          <Image src="/logo.png" alt="BloomBoard logo" width={34} height={34} className="rounded-[10px]" />
          <span className="text-[17px] font-bold">BloomBoard</span>
        </Link>
        {session && (
          <button type="button" onClick={signOut} className="text-sm text-[#a1a1aa] hover:text-white">Sign out</button>
        )}
      </header>

      <main className="mx-auto flex max-w-[520px] flex-col gap-8 px-5 py-14 md:py-20">
        {step === "email" && (
          <form onSubmit={sendCode} className="flex flex-col gap-6">
            <div>
              <h1 className="text-[34px] font-bold leading-[1.1] tracking-[-0.03em] md:text-[40px]">Manage your subscription.</h1>
              <p className="mt-3 text-[17px] leading-relaxed text-[#a1a1aa]">
                Enter the email you use for BloomBoard. We&apos;ll send you a 6-digit code. Works for free trials too.
              </p>
            </div>
            <input
              type="email" inputMode="email" autoComplete="email" autoFocus value={email}
              onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" aria-label="Email"
              className="h-[52px] rounded-xl border border-white/[0.14] bg-[#0d0d0f] px-4 text-[16px] outline-none focus:border-2 focus:border-[#4d9fff]"
            />
            {error && <p className="text-sm text-[#ff8a80]">{error}</p>}
            <button type="submit" disabled={busy} className="h-[50px] rounded-xl bg-[#f5f5f7] text-[15px] font-bold text-black disabled:opacity-60">
              {busy ? "Sending…" : "Send code"}
            </button>
            <p className="text-sm text-[#a1a1aa]">
              No account yet? <Link href="/start" className="font-semibold text-white underline decoration-white/30 underline-offset-2">Start a free trial</Link>
            </p>
          </form>
        )}

        {step === "code" && (
          <form onSubmit={verify} className="flex flex-col gap-6">
            <div>
              <h1 className="text-[34px] font-bold leading-[1.1] tracking-[-0.03em] md:text-[40px]">Check your email.</h1>
              <p className="mt-3 text-[17px] leading-relaxed text-[#a1a1aa]">
                We sent a code to <span className="text-[#f5f5f7]">{email.trim()}</span>. Enter it here. It works for one hour.
              </p>
            </div>
            <input
              value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              inputMode="numeric" autoComplete="one-time-code" autoFocus placeholder="123456" aria-label="6-digit code"
              className="h-[60px] rounded-xl border border-white/[0.14] bg-[#0d0d0f] px-4 text-center font-mono text-[26px] tracking-[0.4em] outline-none focus:border-2 focus:border-[#4d9fff]"
            />
            {error && <p className="text-sm text-[#ff8a80]">{error}</p>}
            <button type="submit" disabled={busy} className="h-[50px] rounded-xl bg-[#f5f5f7] text-[15px] font-bold text-black disabled:opacity-60">
              {busy ? "Checking…" : "Continue"}
            </button>
            <p className="text-sm text-[#a1a1aa]">
              No email? Check spam, or{" "}
              <button type="button" disabled={resendIn > 0 || busy} onClick={() => sendCode()} className="font-semibold text-[#4d9fff] disabled:text-[#a1a1aa]">
                {resendIn > 0 ? `send a new code in ${resendIn}s` : "send a new code"}
              </button>
              {" · "}
              <button type="button" onClick={() => { setStep("email"); setError(""); }} className="font-semibold text-white">use another email</button>
            </p>
          </form>
        )}

        {step === "loading" && <p className="text-[#a1a1aa]">Loading your plan…</p>}

        {step === "status" && (
          <div className="flex flex-col gap-6">
            <div>
              <h1 className="text-[34px] font-bold leading-[1.1] tracking-[-0.03em] md:text-[40px]">Your plan.</h1>
              <p className="mt-3 text-[15px] text-[#a1a1aa]">Signed in as <span className="text-[#f5f5f7]">{userEmail}</span></p>
            </div>
            {error && <p className="text-sm text-[#ff8a80]">{error}</p>}
            {ent && <PlanCards ent={ent} checkout={checkout} openBilling={openBilling} opening={opening} />}
            <p className="text-sm leading-relaxed text-[#a1a1aa]">
              Questions about billing? Write to{" "}
              <a href="mailto:support@mybloomboard.app" className="text-white underline decoration-white/30 underline-offset-2">support@mybloomboard.app</a>.
              {" "}<Link href="/refund" className="text-white underline decoration-white/30 underline-offset-2">Refund policy</Link>
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

function Card({ title, sub, children }: { title: string; sub?: React.ReactNode; children?: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-white/[0.1] bg-[#0d0d0f] px-5 py-5">
      <div>
        <div className="text-[17px] font-bold">{title}</div>
        {sub && <div className="mt-1.5 text-sm leading-relaxed text-[#a1a1aa]">{sub}</div>}
      </div>
      {children}
    </div>
  );
}

const btnPrimary = "flex h-11 items-center justify-center rounded-xl bg-[#f5f5f7] px-5 text-[14px] font-bold text-black disabled:opacity-60";
const btnSecondary = "flex h-11 items-center justify-center rounded-xl border border-white/20 px-5 text-[14px] font-semibold text-white hover:bg-white/[0.06]";

function PlanCards({
  ent, checkout, openBilling, opening,
}: {
  ent: Entitlement;
  checkout: (plan: "bloom" | "team", seats?: number, yearly?: boolean) => string;
  openBilling: () => void;
  opening: boolean;
}) {
  const cards: React.ReactNode[] = [];
  const billingBtn = (
    <button type="button" onClick={openBilling} disabled={opening} className={btnPrimary}>
      {opening ? "Opening…" : "Billing, card and invoices"}
    </button>
  );

  const p = ent.personal;
  if (p && p.plan) {
    const name = PLAN_NAME[p.plan] || "Bloom";
    const when = fmtDate(p.period_end);
    cards.push(
      <Card key="personal" title={`${name}${p.status === "trialing" ? " (free trial, card added)" : ""}`}
        sub={p.cancel_at_period_end
          ? `Cancelled. You keep ${name} until ${when}, then move to Free.`
          : p.status === "trialing"
            ? `Your first payment is on ${when}. Cancel before then and you pay nothing.`
            : p.status === "past_due"
              ? "Your last payment didn't go through. Update your card to keep your plan."
              : `Billed ${p.interval === "year" ? "yearly" : "monthly"}.${when ? ` Next payment on ${when}.` : ""}`}>
        {billingBtn}
        <p className="text-[12.5px] text-[#9fb0c4]">Change plan, update your card, download invoices or cancel. Opens our payment partner, Polar.</p>
      </Card>,
    );
  }

  const t = ent.team;
  if (t && t.name) {
    const onTrial = t.status === "trial";
    const sub = !t.active
      ? (onTrial ? `The free trial ended on ${fmtDate(t.trial_ends_at)}. Shared boards, chat and calls are paused until the plan is renewed.` : "This team's plan isn't active.")
      : onTrial
        ? `Free trial: ${daysLeft(t.trial_ends_at)} days left, until ${fmtDate(t.trial_ends_at)}.`
        : t.status === "past_due"
          ? "The last payment didn't go through."
          : `${t.paid_until ? `Paid until ${fmtDate(t.paid_until)}. ` : ""}${t.used ?? 0} of ${t.seats ?? 0} seats in use.`;
    cards.push(
      <Card key="team" title={`Team: ${t.name}`} sub={<>{sub}{!t.is_owner && <><br />The team owner manages billing.</>}</>}>
        {t.is_owner && (onTrial || !t.active
          ? <a href={checkout("team", t.seats)} className={btnPrimary}>{t.active ? "Add card to keep the Team plan" : "Renew the Team plan"}</a>
          : billingBtn)}
      </Card>,
    );
  }

  const tr = ent.trial;
  if (!p?.plan && !(t && t.name) && tr && tr.plan) {
    const plan = tr.plan === "team" ? "team" : "bloom";
    const name = PLAN_NAME[tr.plan] || "Bloom";
    const live = Date.parse(tr.ends_at || "") > Date.now();
    cards.push(
      <Card key="trial" title={live ? `${name} free trial` : `Your ${name} trial has ended`}
        sub={live
          ? `${daysLeft(tr.ends_at)} days left, until ${fmtDate(tr.ends_at)}. No card on file, so nothing will be charged. Add your card to keep ${name} after the trial.`
          : `You're on the Free plan now, and your tasks are safe. Choose ${name} to get everything back.`}>
        <a href={checkout(plan, tr.seats, tr.billing === "yearly")} className={btnPrimary}>{live ? "Add card" : `Get ${name}`}</a>
        {live && <p className="text-[12.5px] text-[#9fb0c4]">Your card is charged only when the trial ends. Cancel any time before and you pay nothing.</p>}
      </Card>,
    );
  }

  if (!cards.length) {
    cards.push(
      <Card key="free" title="Free plan" sub="You're on the Free plan. Try Bloom or Team free, no card needed.">
        <div className="flex flex-col gap-2.5 sm:flex-row">
          <a href="/start?plan=bloom" className={btnPrimary}>Try Bloom free</a>
          <a href="/start?plan=team" className={btnSecondary}>Try Team free</a>
        </div>
      </Card>,
    );
  }

  return <>{cards}</>;
}
