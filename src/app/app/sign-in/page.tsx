"use client";

import { useState } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const supabase = createBrowserSupabaseClient();

  async function handleEmailSignIn() {
    if (!supabase) {
      setMessage("Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to enable sign in.");
      return;
    }

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/app`,
      },
    });

    setMessage(error ? error.message : "Check your email for the sign-in link.");
  }

  async function handleGoogleSignIn() {
    if (!supabase) {
      setMessage("Add Supabase environment variables to enable Google sign in.");
      return;
    }

    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/app`,
      },
    });
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-10rem)] max-w-xl items-center">
      <div className="w-full rounded-[32px] border border-white/10 bg-white/[0.035] p-6 sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-blue-200">Sign in</p>
        <h2 className="mt-4 text-4xl font-bold tracking-tight">Access your synced workspace.</h2>
        <p className="mt-4 text-base leading-7 text-white/50">
          Sign in once to keep Bloomboard synced across web and the desktop app.
        </p>

        <div className="mt-8 space-y-3">
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            type="email"
            placeholder="Email address"
            className="h-14 w-full rounded-2xl border border-white/10 bg-black/30 px-4 text-white outline-none transition placeholder:text-white/30 focus:border-blue-300/50"
          />
          <button
            type="button"
            onClick={handleEmailSignIn}
            className="h-14 w-full rounded-full bg-white font-bold text-black transition hover:scale-[1.02] hover:bg-white/90"
          >
            Send magic link
          </button>
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="h-14 w-full rounded-full border border-white/12 bg-white/[0.04] font-bold text-white transition hover:scale-[1.02] hover:bg-white/[0.08]"
          >
            Continue with Google
          </button>
        </div>

        {message && <p className="mt-5 rounded-2xl bg-blue-400/10 p-4 text-sm text-blue-100">{message}</p>}
      </div>
    </div>
  );
}
