"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { createClient } from "@/utils/supabase/client";

type Screen = "start" | "create" | "create-pass" | "signin";

function pwChecks(pw: string) {
  return {
    length:  pw.length >= 8,
    upper:   /[A-Z]/.test(pw),
    lower:   /[a-z]/.test(pw),
    number:  /[0-9]/.test(pw),
    special: /[^A-Za-z0-9]/.test(pw),
  };
}

export function LoginPageClient() {
  const router = useRouter();
  const [screen, setScreen]     = useState<Screen>("start");
  const [email, setEmail]       = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw]     = useState(false);
  const [error, setError]       = useState<string | null>(null);
  const [isPending, startT]     = useTransition();

  const checks  = pwChecks(password);
  const pwOk    = Object.values(checks).every(Boolean);

  const redirect = () => {
    const dest = typeof sessionStorage !== "undefined"
      ? (sessionStorage.getItem("post_login_redirect") || "/marketplace")
      : "/marketplace";
    if (typeof sessionStorage !== "undefined") sessionStorage.removeItem("post_login_redirect");
    router.push(dest);
    router.refresh();
  };

  const goTo = (s: Screen) => { setError(null); setEmail(""); setUsername(""); setPassword(""); setScreen(s); };

  /* ── DEMO: no Supabase needed ── */
  const tryDemo = () => {
    document.cookie = "demo_user=true; path=/; max-age=86400";
    redirect();
  };

  /* ── EMAIL SIGN-UP ── */
  const signup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pwOk) { setError("Please meet all password requirements."); return; }
    setError(null);
    startT(async () => {
      const { error } = await createClient().auth.signUp({
        email,
        password,
        options: { data: { username }, emailRedirectTo: `${window.location.origin}/api/auth/callback` },
      });
      if (error) setError(error.message);
      else redirect();
    });
  };

  /* ── EMAIL SIGN-IN ── */
  const signin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    startT(async () => {
      const { error } = await createClient().auth.signInWithPassword({ email, password });
      if (error) setError(error.message);
      else redirect();
    });
  };

  /* ── STYLES ── */
  const S = {
    page: {
      minHeight: "100vh", background: "#0a0a08",
      display: "flex", flexDirection: "column" as const,
      alignItems: "center", justifyContent: "center",
      padding: 24, fontFamily: "var(--font-hubot-sans), -apple-system, sans-serif",
    },
    glow: {
      position: "fixed" as const, inset: 0, pointerEvents: "none" as const,
      background: "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(245,146,42,0.08) 0%, transparent 70%)",
    },
    back: {
      position: "fixed" as const, top: 20, left: 24,
      color: "#5a5850", fontSize: 13, textDecoration: "none",
    },
    wrap: { width: "100%", maxWidth: 420, position: "relative" as const, zIndex: 1 },
    hdr: { textAlign: "center" as const, marginBottom: 36 },
    icon: {
      width: 64, height: 64, borderRadius: 18, background: "#f5922a",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: 26, margin: "0 auto 16px",
      boxShadow: "0 8px 24px rgba(245,146,42,0.3)",
    },
    h1: { fontSize: 30, fontWeight: 700, color: "#f0ede6", letterSpacing: "-0.03em", marginBottom: 8, margin: "0 0 8px" },
    sub: { fontSize: 14, color: "#5a5850", fontWeight: 300, maxWidth: 300, margin: "0 auto" },
    opt: {
      display: "flex", alignItems: "center", gap: 14,
      padding: "15px 18px", background: "#161614", border: "1px solid #232320",
      borderRadius: 14, cursor: "pointer", width: "100%", textAlign: "left" as const,
      marginBottom: 8,
    },
    optIcon: (bg: string) => ({
      width: 40, height: 40, borderRadius: 12, background: bg, flexShrink: 0,
      display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
    }),
    demo: {
      display: "flex", alignItems: "center", gap: 14,
      padding: "15px 18px",
      background: "rgba(245,146,42,0.06)", border: "1px solid rgba(245,146,42,0.2)",
      borderRadius: 14, cursor: "pointer", width: "100%", textAlign: "left" as const,
      marginBottom: 8,
    },
    divider: { display: "flex", alignItems: "center", gap: 12, margin: "4px 0 12px" },
    card: { background: "#161614", border: "1px solid #232320", borderRadius: 16, padding: "22px 18px", marginBottom: 12 },
    label: { display: "block", fontSize: 12, fontWeight: 600, color: "#8a8778", marginBottom: 7, letterSpacing: "0.03em", textTransform: "uppercase" as const },
    input: (err = false) => ({
      width: "100%", padding: "12px 14px",
      background: "#0a0a08", border: `1px solid ${err ? "#e05a3a" : "#2e2e2a"}`,
      borderRadius: 10, color: "#f0ede6", fontSize: 15, fontFamily: "inherit",
      outline: "none",
    }),
    primaryBtn: (disabled = false) => ({
      width: "100%", padding: 15,
      background: disabled ? "#1c1c1a" : "#f5922a",
      color: disabled ? "#5a5850" : "#0a0a08",
      border: "none", borderRadius: 14, fontSize: 16, fontWeight: 700,
      cursor: disabled ? "not-allowed" : "pointer", fontFamily: "inherit",
    }),
    errBox: {
      marginBottom: 14, padding: "11px 14px",
      background: "rgba(224,90,58,0.08)", border: "1px solid rgba(224,90,58,0.2)",
      borderRadius: 10, color: "#e05a3a", fontSize: 13,
    },
    backLink: {
      display: "block", margin: "18px auto 0", background: "none", border: "none",
      color: "#5a5850", fontSize: 13, cursor: "pointer",
    },
  };

  return (
    <div style={S.page}>
      <div style={S.glow} />
      <Link href="/" style={S.back}>← Bitcoin Names</Link>

      <div style={S.wrap}>

        {/* ── START ── */}
        {screen === "start" && <>
          <div style={S.hdr}>
            <h1 style={S.h1}>Get started</h1>
            <p style={S.sub}>Sign in to buy and manage your .btc names.</p>
          </div>

          {/* Demo — always works */}
          <button onClick={tryDemo} style={S.demo}>
            <span style={S.optIcon("#f5922a")}>⚡</span>
            <span style={{ flex: 1 }}>
              <span style={{ display: "block", fontSize: 15, fontWeight: 700, color: "#f5922a" }}>Try demo</span>
              <span style={{ fontSize: 12, color: "#5a5850" }}>Explore the full app instantly — no signup needed.</span>
            </span>
            <span style={{ color: "#f5922a" }}>→</span>
          </button>

          <div style={S.divider}>
            <div style={{ flex: 1, height: 1, background: "#232320" }} />
            <span style={{ fontSize: 12, color: "#5a5850" }}>or</span>
            <div style={{ flex: 1, height: 1, background: "#232320" }} />
          </div>

          <button onClick={() => goTo("create")} style={S.opt}>
            <span style={S.optIcon("#232320")}>💼</span>
            <span style={{ flex: 1 }}>
              <span style={{ display: "block", fontSize: 15, fontWeight: 600, color: "#f0ede6" }}>Create new account</span>
              <span style={{ fontSize: 12, color: "#5a5850" }}>New to Bitcoin? Set up in seconds.</span>
            </span>
            <span style={{ color: "#5a5850" }}>→</span>
          </button>

          <button onClick={() => goTo("signin")} style={S.opt}>
            <span style={S.optIcon("#232320")}>🔐</span>
            <span style={{ flex: 1 }}>
              <span style={{ display: "block", fontSize: 15, fontWeight: 600, color: "#f0ede6" }}>Sign in</span>
              <span style={{ fontSize: 12, color: "#5a5850" }}>Already have an account.</span>
            </span>
            <span style={{ color: "#5a5850" }}>→</span>
          </button>
        </>}

        {/* ── CREATE ── */}
        {screen === "create" && <>
          <IconHdr icon="💼" title="Create new account" sub="Choose how you'd like to secure your wallet." />
          <button onClick={() => goTo("create-pass")} style={S.opt}>
            <span style={S.optIcon("#232320")}>🔑</span>
            <span style={{ flex: 1 }}>
              <span style={{ display: "block", fontSize: 15, fontWeight: 600, color: "#f0ede6" }}>Username + password</span>
              <span style={{ fontSize: 12, color: "#5a5850" }}>Simple and fast.</span>
            </span>
            <span style={{ color: "#5a5850" }}>→</span>
          </button>
          <button onClick={tryDemo} style={S.opt}>
            <span style={S.optIcon("#232320")}>🛡️</span>
            <span style={{ flex: 1 }}>
              <span style={{ display: "block", fontSize: 15, fontWeight: 600, color: "#f0ede6" }}>Create with secret phrase</span>
              <span style={{ fontSize: 12, color: "#5a5850" }}>12-word mnemonic — full self-custody.</span>
            </span>
            <span style={{ color: "#5a5850" }}>→</span>
          </button>
          <button onClick={() => goTo("start")} style={S.backLink as React.CSSProperties}>← Back</button>
        </>}

        {/* ── CREATE WITH PASSWORD ── */}
        {screen === "create-pass" && <>
          <IconHdr icon="🔑" title="Create with password" sub="Enter a username and a strong password to secure your wallet." />
          {error && <div style={S.errBox}>{error}</div>}
          <form onSubmit={signup}>
            <div style={S.card}>
              <div style={{ marginBottom: 18 }}>
                <label style={S.label}>Username</label>
                <input autoFocus value={username} onChange={e => setUsername(e.target.value)}
                  placeholder="satoshi" required style={S.input()} />
              </div>
              <div style={{ marginBottom: 18 }}>
                <label style={S.label}>Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com" required style={S.input()} />
              </div>
              <div>
                <label style={S.label}>Password</label>
                <div style={{ position: "relative" }}>
                  <input type={showPw ? "text" : "password"} value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="At least 8 characters" required
                    style={{ ...S.input(password.length > 0 && !pwOk), paddingRight: 44 }} />
                  <button type="button" onClick={() => setShowPw(v => !v)} style={{
                    position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                    background: "none", border: "none", cursor: "pointer", color: "#5a5850", fontSize: 15,
                  }}>{showPw ? "🙈" : "👁"}</button>
                </div>
                {password.length > 0 && (
                  <div style={{ marginTop: 8, padding: "10px 12px", background: "#111110", borderRadius: 10, display: "flex", flexDirection: "column", gap: 6 }}>
                    {([["length","At least 8 characters"],["upper","One uppercase letter"],["lower","One lowercase letter"],["number","One number"],["special","One special character"]] as [keyof typeof checks, string][]).map(([k, label]) => (
                      <div key={k} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
                        <span style={{ width: 18, height: 18, borderRadius: "50%", border: `2px solid ${checks[k] ? "#4caf7d" : "#2e2e2a"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: checks[k] ? "#4caf7d" : "transparent", flexShrink: 0 }}>✓</span>
                        <span style={{ color: checks[k] ? "#4caf7d" : "#5a5850" }}>{label}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <button type="submit" disabled={isPending || !pwOk} style={S.primaryBtn(isPending || !pwOk)}>
              {isPending ? "Creating account…" : "Create wallet →"}
            </button>
          </form>
          <button onClick={() => goTo("create")} style={S.backLink as React.CSSProperties}>← Back</button>
        </>}

        {/* ── SIGN IN ── */}
        {screen === "signin" && <>
          <IconHdr icon="🔐" title="Welcome back" sub="Sign in to your Bitcoin Names account." />
          {error && <div style={S.errBox}>{error}</div>}
          <form onSubmit={signin}>
            <div style={S.card}>
              <div style={{ marginBottom: 18 }}>
                <label style={S.label}>Email</label>
                <input autoFocus type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com" required style={S.input()} />
              </div>
              <div>
                <label style={S.label}>Password</label>
                <div style={{ position: "relative" }}>
                  <input type={showPw ? "text" : "password"} value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••" required
                    style={{ ...S.input(), paddingRight: 44 }} />
                  <button type="button" onClick={() => setShowPw(v => !v)} style={{
                    position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                    background: "none", border: "none", cursor: "pointer", color: "#5a5850", fontSize: 15,
                  }}>{showPw ? "🙈" : "👁"}</button>
                </div>
              </div>
            </div>
            <button type="submit" disabled={isPending} style={S.primaryBtn(isPending)}>
              {isPending ? "Signing in…" : "Sign in →"}
            </button>
          </form>
          <p style={{ textAlign: "center", marginTop: 14, fontSize: 13, color: "#5a5850" }}>
            No account?{" "}
            <button onClick={() => goTo("create")} style={{ background: "none", border: "none", color: "#f5922a", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
              Create one
            </button>
          </p>
          <button onClick={() => goTo("start")} style={S.backLink as React.CSSProperties}>← Back</button>
        </>}

      </div>
    </div>
  );
}

function IconHdr({ icon, title, sub }: { icon: string; title: string; sub: string }) {
  return (
    <div style={{ textAlign: "center", marginBottom: 28 }}>
      <div style={{ width: 64, height: 64, borderRadius: 18, background: "#f5922a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, margin: "0 auto 14px", boxShadow: "0 8px 24px rgba(245,146,42,0.3)" }}>{icon}</div>
      <h1 style={{ fontSize: 26, fontWeight: 700, color: "#f0ede6", letterSpacing: "-0.03em", margin: "0 0 8px" }}>{title}</h1>
      <p style={{ fontSize: 13, color: "#5a5850", maxWidth: 300, margin: "0 auto", lineHeight: 1.5 }}>{sub}</p>
    </div>
  );
}
