// src/app/login/LoginPageClient.tsx
"use client";

import { ArrowRight, GoogleLogo, Lightning, LockKey, EnvelopeSimple } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import Link from "next/link";
import { useState, useTransition } from "react";
import { handleLoginWithGoogle } from "@/utils/googleSso";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

type View = "options" | "email-login" | "email-signup";

export function LoginPageClient() {
  const [view, setView] = useState<View>("options");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(error.message);
      } else {
        router.push("/");
        router.refresh();
      }
    });
  };

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const supabase = createClient();
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/api/auth/callback` },
      });
      if (error) {
        setError(error.message);
      } else {
        setError(null);
        setView("options");
        // Show success — ideally a toast, for now we redirect
        router.push("/?signup=confirm");
      }
    });
  };

  return (
    <div className="min-h-screen bg-bn-page flex flex-col">
      {/* Subtle grid bg — same as landing */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(10,10,10,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(10,10,10,0.04) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />
      <div className="pointer-events-none fixed -z-10 left-[-16%] top-[-12%] h-[46vh] w-[46vw] rounded-full bn-orange-glow-soft blur-2xl" />

      {/* Nav */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-bn-line/60">
        <Link href="/" className="inline-flex items-center">
          <Image src="/navbar_logo.svg" alt="Bitcoin Names" width={122} height={31} className="h-[34px] w-auto" />
        </Link>
        <Link href="/" className="text-[13px] text-bn-ink-muted hover:text-bn-ink transition-colors">
          ← Back to home
        </Link>
      </header>

      {/* Main */}
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-[400px]">

          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-bn-accent/10 border border-bn-accent/20 mb-4">
              <span className="text-bn-accent text-xl">₿</span>
            </div>
            <h1 className="text-[26px] font-semibold tracking-[-0.03em] text-bn-ink mb-2">
              {view === "email-signup" ? "Create account" : "Welcome back"}
            </h1>
            <p className="text-[14px] text-bn-ink-muted">
              {view === "email-signup"
                ? "Sign up to reserve and buy .btc names"
                : "Sign in to manage your .btc names"}
            </p>
          </div>

          {/* Card */}
          <div className="bg-white rounded-2xl border border-bn-line shadow-[0_1px_3px_rgba(10,10,10,0.06),0_8px_32px_-8px_rgba(10,10,10,0.1)] p-6">

            {/* Error */}
            {error && (
              <div className="mb-4 rounded-xl border border-[rgba(204,68,102,0.3)] bg-[rgba(204,68,102,0.06)] text-[#cc4466] text-[13px] px-4 py-3">
                {error}
              </div>
            )}

            {/* OPTIONS VIEW */}
            {view === "options" && (
              <div className="flex flex-col gap-3">
                {/* Google */}
                <button
                  onClick={() => handleLoginWithGoogle()}
                  className="flex items-center justify-center gap-3 w-full px-4 py-3 rounded-xl border border-bn-line bg-white hover:bg-bn-page-2 text-[14px] font-medium text-bn-ink transition-colors"
                >
                  <GoogleLogo size={18} weight="bold" />
                  Continue with Google
                </button>

                <div className="flex items-center gap-3 my-1">
                  <div className="flex-1 h-px bg-bn-line" />
                  <span className="text-[12px] text-bn-ink-muted">or</span>
                  <div className="flex-1 h-px bg-bn-line" />
                </div>

                {/* Email login */}
                <button
                  onClick={() => setView("email-login")}
                  className="flex items-center justify-center gap-3 w-full px-4 py-3 rounded-xl border border-bn-line bg-white hover:bg-bn-page-2 text-[14px] font-medium text-bn-ink transition-colors"
                >
                  <EnvelopeSimple size={18} weight="bold" />
                  Continue with email
                </button>

                {/* Wallet */}
                <button
                  onClick={() => {
                    // Trigger wallet connect — fires ConnectWallet dialog
                    const btn = document.querySelector<HTMLButtonElement>("[data-connect-wallet]");
                    if (btn) btn.click();
                    else {
                      // Fallback: go home and the nav wallet button is visible
                      window.location.href = "/";
                    }
                  }}
                  className="flex items-center justify-center gap-3 w-full px-4 py-3 rounded-xl border border-bn-line bg-white hover:bg-bn-page-2 text-[14px] font-medium text-bn-ink transition-colors"
                >
                  <Lightning size={18} weight="bold" className="text-bn-accent" />
                  Connect wallet only
                </button>

                <p className="text-center text-[12px] text-bn-ink-muted mt-2">
                  No account yet?{" "}
                  <button onClick={() => setView("email-signup")} className="text-bn-accent hover:text-bn-accent-hover font-medium underline underline-offset-2">
                    Sign up free
                  </button>
                </p>
              </div>
            )}

            {/* EMAIL LOGIN VIEW */}
            {view === "email-login" && (
              <form onSubmit={handleEmailLogin} className="flex flex-col gap-3">
                <div>
                  <label className="block text-[12px] font-medium text-bn-ink-2 mb-1.5">Email</label>
                  <input
                    type="email"
                    required
                    autoFocus
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 rounded-xl border border-bn-line bg-bn-page-2 text-[14px] text-bn-ink placeholder-bn-ink-dim focus:outline-none focus:border-bn-accent/50 focus:ring-2 focus:ring-bn-accent/10 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-medium text-bn-ink-2 mb-1.5">Password</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 rounded-xl border border-bn-line bg-bn-page-2 text-[14px] text-bn-ink placeholder-bn-ink-dim focus:outline-none focus:border-bn-accent/50 focus:ring-2 focus:ring-bn-accent/10 transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isPending}
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 mt-1 rounded-xl bg-bn-ink text-white text-[14px] font-medium hover:bg-black disabled:opacity-50 transition-colors"
                >
                  {isPending ? "Signing in…" : <>Sign in <ArrowRight weight="bold" size={14} /></>}
                </button>

                <div className="flex items-center justify-between mt-1">
                  <button type="button" onClick={() => { setView("options"); setError(null); }} className="text-[12px] text-bn-ink-muted hover:text-bn-ink">
                    ← Back
                  </button>
                  <button type="button" onClick={() => setView("email-signup")} className="text-[12px] text-bn-accent hover:text-bn-accent-hover font-medium">
                    Create account instead
                  </button>
                </div>
              </form>
            )}

            {/* EMAIL SIGNUP VIEW */}
            {view === "email-signup" && (
              <form onSubmit={handleEmailSignup} className="flex flex-col gap-3">
                <div>
                  <label className="block text-[12px] font-medium text-bn-ink-2 mb-1.5">Email</label>
                  <input
                    type="email"
                    required
                    autoFocus
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 rounded-xl border border-bn-line bg-bn-page-2 text-[14px] text-bn-ink placeholder-bn-ink-dim focus:outline-none focus:border-bn-accent/50 focus:ring-2 focus:ring-bn-accent/10 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-medium text-bn-ink-2 mb-1.5">Password</label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="8+ characters"
                    className="w-full px-4 py-3 rounded-xl border border-bn-line bg-bn-page-2 text-[14px] text-bn-ink placeholder-bn-ink-dim focus:outline-none focus:border-bn-accent/50 focus:ring-2 focus:ring-bn-accent/10 transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isPending}
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 mt-1 rounded-xl bg-bn-accent text-white text-[14px] font-medium hover:bg-bn-accent-hover disabled:opacity-50 transition-colors"
                >
                  {isPending ? "Creating account…" : <>Create account <ArrowRight weight="bold" size={14} /></>}
                </button>

                <p className="text-[11px] text-bn-ink-muted text-center mt-1 leading-relaxed">
                  By signing up you agree that Bitcoin Names (Dark Fusion Technologies Ltd) may store your email to manage your account.
                </p>

                <button type="button" onClick={() => { setView("options"); setError(null); }} className="text-[12px] text-bn-ink-muted hover:text-bn-ink text-center mt-1">
                  ← Back
                </button>
              </form>
            )}
          </div>

          {/* Footer note */}
          <p className="text-center text-[12px] text-bn-ink-muted mt-6">
            You can also browse the{" "}
            <Link href="/marketplace" className="text-bn-ink hover:text-bn-accent underline underline-offset-2">
              marketplace
            </Link>{" "}
            without signing in.
          </p>
        </div>
      </main>
    </div>
  );
}
