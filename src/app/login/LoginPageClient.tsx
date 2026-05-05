// src/app/login/LoginPageClient.tsx
// Matches Orobit Hub auth flow — dark theme, wallet-style, demo login
"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { createClient } from "@/utils/supabase/client";
import { handleLoginWithGoogle } from "@/utils/googleSso";

type Screen =
  | "start"          // Get started — Create new / Import wallet
  | "create"         // Create new — Username+password / Secret phrase
  | "create-pass"    // Username + password form
  | "signin"         // Sign in with email
  | "demo";          // Demo bypass

// ─── PASSWORD STRENGTH ───
function passwordChecks(pw: string) {
  return {
    length: pw.length >= 8,
    upper: /[A-Z]/.test(pw),
    lower: /[a-z]/.test(pw),
    number: /[0-9]/.test(pw),
    special: /[^A-Za-z0-9]/.test(pw),
  };
}

export function LoginPageClient() {
  const router = useRouter();
  const [screen, setScreen] = useState<Screen>("start");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const checks = passwordChecks(password);
  const pwValid = Object.values(checks).every(Boolean);

  const reset = () => {
    setError(null);
    setEmail("");
    setUsername("");
    setPassword("");
    setShowPw(false);
  };

  const goTo = (s: Screen) => { reset(); setScreen(s); };

  // Demo — bypass auth, land in app
  const demoLogin = () => {
    startTransition(async () => {
      // Set a mock cookie so the app thinks we're logged in
      document.cookie = "demo_user=true; path=/; max-age=86400";
      const dest = typeof sessionStorage !== "undefined" ? sessionStorage.getItem("post_login_redirect") || "/" : "/";
      if (typeof sessionStorage !== "undefined") sessionStorage.removeItem("post_login_redirect");
      router.push(dest);
      router.refresh();
    });
  };

  // Email sign-up
  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!pwValid) { setError("Please meet all password requirements."); return; }
    startTransition(async () => {
      const supabase = createClient();
      const { error } = await supabase.auth.signUp({
        email: email || `${username}@demo.btc`,
        password,
        options: { data: { username }, emailRedirectTo: `${window.location.origin}/api/auth/callback` },
      });
      if (error) setError(error.message);
      else { router.push("/"); router.refresh(); }
    });
  };

  // Email sign-in
  const handleSignin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(error.message);
      else { router.push("/"); router.refresh(); }
    });
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0a0a08",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px",
      fontFamily: "'Hubot Sans', -apple-system, sans-serif",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Background glow */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(245,146,42,0.07) 0%, transparent 70%)",
      }} />

      {/* Back to site */}
      <div style={{ position: "fixed", top: 20, left: 24, zIndex: 10 }}>
        <Link href="/" style={{
          display: "flex", alignItems: "center", gap: 8,
          color: "#5a5850", fontSize: 13, textDecoration: "none",
          transition: "color 0.15s",
        }}>
          <Image src="/navbar_logo_dark.svg" alt="Bitcoin Names" width={100} height={26}
            style={{ height: 26, width: "auto", opacity: 0.5 }}
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
        </Link>
      </div>

      <div style={{ width: "100%", maxWidth: 440, position: "relative", zIndex: 1 }}>

        {/* ── START SCREEN ── */}
        {screen === "start" && (
          <>
            <div style={{ textAlign: "center", marginBottom: 40 }}>
              <h1 style={{ fontSize: 36, fontWeight: 700, color: "#f0ede6", letterSpacing: "-0.03em", marginBottom: 10 }}>
                Get started
              </h1>
              <p style={{ fontSize: 15, color: "#5a5850", fontWeight: 300 }}>
                Sign in to buy and manage your .btc names.
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {/* Google */}
              <button onClick={() => handleLoginWithGoogle()} style={optStyle}>
                <span style={optIconStyle("#1a1a1a")}>
                  <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                </span>
                <span style={{ fontSize: 15, fontWeight: 500, color: "#f0ede6" }}>Continue with Google</span>
              </button>

              {/* Divider */}
              <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "4px 0" }}>
                <div style={{ flex: 1, height: 1, background: "#232320" }} />
                <span style={{ fontSize: 12, color: "#5a5850" }}>or</span>
                <div style={{ flex: 1, height: 1, background: "#232320" }} />
              </div>

              {/* Create new account */}
              <button onClick={() => goTo("create")} style={optStyle}>
                <span style={optIconStyle("#f5922a")}>
                  <svg width="18" height="18" fill="none" stroke="#0a0a08" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="16" rx="2"/><path d="M16 3v4M8 3v4M2 11h20"/></svg>
                </span>
                <span style={{ flex: 1, textAlign: "left" }}>
                  <span style={{ display: "block", fontSize: 15, fontWeight: 600, color: "#f0ede6" }}>Create new account</span>
                  <span style={{ fontSize: 12, color: "#5a5850" }}>New to Bitcoin? Set up in seconds.</span>
                </span>
                <span style={{ color: "#5a5850", fontSize: 16 }}>→</span>
              </button>

              {/* Sign in */}
              <button onClick={() => goTo("signin")} style={optStyle}>
                <span style={optIconStyle("#232320")}>
                  <svg width="18" height="18" fill="none" stroke="#8a8778" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 3h6v18h-6M10 17l5-5-5-5M15 12H3"/></svg>
                </span>
                <span style={{ flex: 1, textAlign: "left" }}>
                  <span style={{ display: "block", fontSize: 15, fontWeight: 600, color: "#f0ede6" }}>Sign in</span>
                  <span style={{ fontSize: 12, color: "#5a5850" }}>Already have an account.</span>
                </span>
                <span style={{ color: "#5a5850", fontSize: 16 }}>→</span>
              </button>

              {/* Demo */}
              <button onClick={demoLogin} style={{
                ...optStyle,
                background: "rgba(245,146,42,0.06)",
                border: "1px solid rgba(245,146,42,0.18)",
              }}>
                <span style={optIconStyle("#f5922a")}>⚡</span>
                <span style={{ flex: 1, textAlign: "left" }}>
                  <span style={{ display: "block", fontSize: 15, fontWeight: 600, color: "#f5922a" }}>Try demo</span>
                  <span style={{ fontSize: 12, color: "#5a5850" }}>Explore the app without signing up.</span>
                </span>
                <span style={{ color: "#f5922a", fontSize: 16 }}>→</span>
              </button>
            </div>
          </>
        )}

        {/* ── CREATE SCREEN ── */}
        {screen === "create" && (
          <>
            <IconHeader icon="💼" title="Create new account" sub="Choose how you'd like to secure your wallet." />
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <button onClick={() => goTo("create-pass")} style={optStyle}>
                <span style={optIconStyle("#232320")}>
                  <svg width="18" height="18" fill="none" stroke="#8a8778" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="11" r="3"/><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/></svg>
                </span>
                <span style={{ flex: 1, textAlign: "left" }}>
                  <span style={{ display: "block", fontSize: 15, fontWeight: 600, color: "#f0ede6" }}>Username + password</span>
                  <span style={{ fontSize: 12, color: "#5a5850" }}>Simple and fast — pick a username and a strong password.</span>
                </span>
                <span style={{ color: "#5a5850" }}>→</span>
              </button>
              <button onClick={demoLogin} style={optStyle}>
                <span style={optIconStyle("#232320")}>
                  <svg width="18" height="18" fill="none" stroke="#8a8778" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                </span>
                <span style={{ flex: 1, textAlign: "left" }}>
                  <span style={{ display: "block", fontSize: 15, fontWeight: 600, color: "#f0ede6" }}>Create with secret phrase</span>
                  <span style={{ fontSize: 12, color: "#5a5850" }}>Generate a 12-word mnemonic for full self-custody — your keys, your Bitcoin.</span>
                </span>
                <span style={{ color: "#5a5850" }}>→</span>
              </button>
            </div>
            <BackBtn onBack={() => goTo("start")} />
          </>
        )}

        {/* ── CREATE WITH PASSWORD ── */}
        {screen === "create-pass" && (
          <>
            <IconHeader icon="🔑" title="Create with password" sub="Enter a username and a strong password to secure your wallet." />
            {error && <ErrorBox msg={error} />}
            <form onSubmit={handleSignup} style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              <div style={cardStyle}>
                {/* Username */}
                <div style={{ marginBottom: 20 }}>
                  <label style={labelStyle}>Username</label>
                  <input
                    autoFocus
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    placeholder="satoshi"
                    required
                    style={inputStyle(false)}
                  />
                </div>
                {/* Email */}
                <div style={{ marginBottom: 20 }}>
                  <label style={labelStyle}>Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    style={inputStyle(false)}
                  />
                </div>
                {/* Password */}
                <div>
                  <label style={labelStyle}>Password</label>
                  <div style={{ position: "relative" }}>
                    <input
                      type={showPw ? "text" : "password"}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="At least 8 characters"
                      required
                      style={{ ...inputStyle(password.length > 0 && !pwValid), paddingRight: 48 }}
                    />
                    <button type="button" onClick={() => setShowPw(v => !v)} style={{
                      position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
                      background: "none", border: "none", cursor: "pointer", color: "#5a5850", fontSize: 16,
                    }}>
                      {showPw ? "🙈" : "👁"}
                    </button>
                  </div>
                  {/* Password checklist */}
                  {password.length > 0 && (
                    <div style={{
                      marginTop: 8, padding: "12px 14px",
                      background: "#111110", borderRadius: 10,
                      display: "flex", flexDirection: "column", gap: 6,
                    }}>
                      {[
                        { key: "length", label: "At least 8 characters" },
                        { key: "upper", label: "One uppercase letter" },
                        { key: "lower", label: "One lowercase letter" },
                        { key: "number", label: "One number" },
                        { key: "special", label: "One special character" },
                      ].map(({ key, label }) => (
                        <div key={key} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
                          <span style={{
                            width: 18, height: 18, borderRadius: "50%",
                            border: `2px solid ${checks[key as keyof typeof checks] ? "#4caf7d" : "#2e2e2a"}`,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: 10, color: checks[key as keyof typeof checks] ? "#4caf7d" : "transparent",
                            flexShrink: 0,
                          }}>✓</span>
                          <span style={{ color: checks[key as keyof typeof checks] ? "#4caf7d" : "#5a5850" }}>{label}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <button type="submit" disabled={isPending || !pwValid} style={primaryBtnStyle(isPending || !pwValid)}>
                {isPending ? "Creating account…" : "Create wallet →"}
              </button>
            </form>
            <BackBtn onBack={() => goTo("create")} />
          </>
        )}

        {/* ── SIGN IN ── */}
        {screen === "signin" && (
          <>
            <IconHeader icon="🔐" title="Welcome back" sub="Sign in to your Bitcoin Names account." />
            {error && <ErrorBox msg={error} />}
            <form onSubmit={handleSignin} style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              <div style={cardStyle}>
                <div style={{ marginBottom: 20 }}>
                  <label style={labelStyle}>Email</label>
                  <input
                    autoFocus type="email" value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com" required
                    style={inputStyle(false)}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Password</label>
                  <div style={{ position: "relative" }}>
                    <input
                      type={showPw ? "text" : "password"}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••" required
                      style={{ ...inputStyle(false), paddingRight: 48 }}
                    />
                    <button type="button" onClick={() => setShowPw(v => !v)} style={{
                      position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
                      background: "none", border: "none", cursor: "pointer", color: "#5a5850", fontSize: 16,
                    }}>
                      {showPw ? "🙈" : "👁"}
                    </button>
                  </div>
                </div>
              </div>

              <button type="submit" disabled={isPending} style={primaryBtnStyle(isPending)}>
                {isPending ? "Signing in…" : "Sign in →"}
              </button>
            </form>
            <p style={{ textAlign: "center", marginTop: 16, fontSize: 13, color: "#5a5850" }}>
              No account?{" "}
              <button onClick={() => goTo("create")} style={{ background: "none", border: "none", color: "#f5922a", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
                Create one
              </button>
            </p>
            <BackBtn onBack={() => goTo("start")} />
          </>
        )}

      </div>
    </div>
  );
}

// ─── SUB-COMPONENTS ───

function IconHeader({ icon, title, sub }: { icon: string; title: string; sub: string }) {
  return (
    <div style={{ textAlign: "center", marginBottom: 32 }}>
      <div style={{
        width: 64, height: 64, borderRadius: 18,
        background: "#f5922a",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 28, margin: "0 auto 16px",
        boxShadow: "0 8px 24px rgba(245,146,42,0.3)",
      }}>{icon}</div>
      <h1 style={{ fontSize: 28, fontWeight: 700, color: "#f0ede6", letterSpacing: "-0.03em", marginBottom: 8 }}>{title}</h1>
      <p style={{ fontSize: 14, color: "#5a5850", maxWidth: 320, margin: "0 auto", lineHeight: 1.5 }}>{sub}</p>
    </div>
  );
}

function BackBtn({ onBack }: { onBack: () => void }) {
  return (
    <button onClick={onBack} style={{
      display: "block", margin: "20px auto 0",
      background: "none", border: "none",
      color: "#5a5850", fontSize: 13, cursor: "pointer",
    }}>
      ← Back
    </button>
  );
}

function ErrorBox({ msg }: { msg: string }) {
  return (
    <div style={{
      marginBottom: 16, padding: "12px 16px",
      background: "rgba(224,90,58,0.08)", border: "1px solid rgba(224,90,58,0.2)",
      borderRadius: 10, color: "#e05a3a", fontSize: 13,
    }}>{msg}</div>
  );
}

// ─── STYLE HELPERS ───

const optStyle: React.CSSProperties = {
  display: "flex", alignItems: "center", gap: 14,
  padding: "16px 18px",
  background: "#161614",
  border: "1px solid #232320",
  borderRadius: 16,
  cursor: "pointer",
  transition: "all 0.15s",
  textAlign: "left",
  width: "100%",
};

function optIconStyle(bg: string): React.CSSProperties {
  return {
    width: 40, height: 40, borderRadius: 12,
    background: bg,
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 18, flexShrink: 0,
  };
}

const cardStyle: React.CSSProperties = {
  background: "#161614",
  border: "1px solid #232320",
  borderRadius: 16,
  padding: "24px 20px",
  marginBottom: 12,
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 13, fontWeight: 600,
  color: "#f0ede6",
  marginBottom: 8,
};

function inputStyle(hasError: boolean): React.CSSProperties {
  return {
    width: "100%",
    padding: "13px 16px",
    background: "#0a0a08",
    border: `1px solid ${hasError ? "#e05a3a" : "#2e2e2a"}`,
    borderRadius: 12,
    color: "#f0ede6",
    fontSize: 15,
    fontFamily: "inherit",
    outline: "none",
    transition: "border-color 0.15s",
  };
}

function primaryBtnStyle(disabled: boolean): React.CSSProperties {
  return {
    width: "100%",
    padding: "16px",
    background: disabled ? "#2e2e2a" : "#f5922a",
    color: disabled ? "#5a5850" : "#0a0a08",
    border: "none",
    borderRadius: 16,
    fontSize: 16, fontWeight: 700,
    cursor: disabled ? "not-allowed" : "pointer",
    transition: "all 0.15s",
    fontFamily: "inherit",
  };
}
