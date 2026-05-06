'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { useAuth } from '@/lib/auth'

type Screen = 'start' | 'create' | 'create-pass' | 'signin'

function pwChecks(pw: string) {
  return {
    length:  pw.length >= 8,
    upper:   /[A-Z]/.test(pw),
    lower:   /[a-z]/.test(pw),
    number:  /[0-9]/.test(pw),
    special: /[^A-Za-z0-9]/.test(pw),
  }
}

const CHECKS = [
  ['length',  'At least 8 characters'],
  ['upper',   'One uppercase letter'],
  ['lower',   'One lowercase letter'],
  ['number',  'One number'],
  ['special', 'One special character'],
] as const

export default function LoginPage() {
  const router = useRouter()
  const { login, signup, loginDemo } = useAuth()

  const [screen,   setScreen]   = useState<Screen>('start')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPw,   setShowPw]   = useState(false)
  const [error,    setError]    = useState('')

  const go = (s: Screen) => { setScreen(s); setError(''); setUsername(''); setPassword('') }

  const checks = pwChecks(password)
  const pwOk   = Object.values(checks).every(Boolean)

  const done = () => router.push('/app')

  const handleDemo   = () => { loginDemo(); done() }
  const handleSignup = () => { const r = signup(username, password); r.ok ? done() : setError(r.error!) }
  const handleSignin = () => { const r = login(username, password);  r.ok ? done() : setError(r.error!) }

  return (
    /* Dark full-screen overlay — same as original wallet-connect modal pattern */
    <div className="min-h-screen bg-bn-bg flex flex-col items-center justify-center px-5 py-10 relative overflow-hidden">

      {/* Glow — matches original */}
      <div className="pointer-events-none fixed inset-0 bn-orange-glow opacity-60" />
      <div className="pointer-events-none fixed inset-0 bn-grid-dark opacity-30" />

      {/* Back link */}
      <div className="fixed top-5 left-6 z-10">
        <Link href="/" className="flex items-center gap-2 opacity-60 hover:opacity-100 transition-opacity">
          <Image src="/navbar_logo_dark.svg" alt="Bitcoin Names" width={110} height={28} className="h-7 w-auto" />
        </Link>
      </div>

      <div className="relative z-10 w-full max-w-[420px]">

        {/* ── START ── */}
        {screen === 'start' && (
          <>
            <div className="text-center mb-9">
              <div className="w-14 h-14 rounded-2xl bg-bn-accent flex items-center justify-center text-2xl mx-auto mb-4" style={{ boxShadow: '0 8px 24px rgba(247,147,26,0.35)' }}>₿</div>
              <h1 className="text-[28px] font-semibold text-bn-text tracking-[-0.03em] mb-2">Get started</h1>
              <p className="text-[14px] text-bn-text-muted font-light">Sign in to buy and manage your .btc names.</p>
            </div>

            {/* Demo — top, most prominent */}
            <button onClick={handleDemo}
              className="w-full flex items-center gap-3.5 p-4 rounded-2xl border border-bn-accent/20 bg-bn-accent/6 hover:bg-bn-accent/10 transition-colors mb-2 text-left cursor-pointer">
              <span className="w-10 h-10 rounded-xl bg-bn-accent/20 flex items-center justify-center text-lg shrink-0">⚡</span>
              <span className="flex-1">
                <span className="block text-[15px] font-semibold text-bn-accent">Try demo</span>
                <span className="text-[12px] text-bn-text-dim">Explore the full app instantly — no signup needed.</span>
              </span>
              <span className="text-bn-accent">→</span>
            </button>

            <div className="flex items-center gap-3 my-3">
              <div className="flex-1 h-px bg-bn-border" />
              <span className="text-[12px] text-bn-text-dim">or</span>
              <div className="flex-1 h-px bg-bn-border" />
            </div>

            <button onClick={() => go('create')}
              className="w-full flex items-center gap-3.5 p-4 rounded-2xl border border-bn-border bg-bn-surface hover:border-bn-border-mid transition-colors mb-2 text-left cursor-pointer">
              <span className="w-10 h-10 rounded-xl bg-bn-surface-2 flex items-center justify-center text-lg shrink-0">💼</span>
              <span className="flex-1">
                <span className="block text-[15px] font-semibold text-bn-text">Create new account</span>
                <span className="text-[12px] text-bn-text-dim">New to Bitcoin? Set up in seconds.</span>
              </span>
              <span className="text-bn-text-dim">→</span>
            </button>

            <button onClick={() => go('signin')}
              className="w-full flex items-center gap-3.5 p-4 rounded-2xl border border-bn-border bg-bn-surface hover:border-bn-border-mid transition-colors text-left cursor-pointer">
              <span className="w-10 h-10 rounded-xl bg-bn-surface-2 flex items-center justify-center text-lg shrink-0">🔐</span>
              <span className="flex-1">
                <span className="block text-[15px] font-semibold text-bn-text">Sign in</span>
                <span className="text-[12px] text-bn-text-dim">Already have an account.</span>
              </span>
              <span className="text-bn-text-dim">→</span>
            </button>
          </>
        )}

        {/* ── CREATE ── */}
        {screen === 'create' && (
          <>
            <IconHeader icon="💼" title="Create new account" sub="Choose how you'd like to secure your wallet." />

            <button onClick={() => go('create-pass')}
              className="w-full flex items-center gap-3.5 p-4 rounded-2xl border border-bn-accent/40 bg-bn-surface hover:border-bn-accent/60 transition-colors mb-2 text-left cursor-pointer">
              <span className="w-10 h-10 rounded-xl bg-bn-surface-2 flex items-center justify-center text-lg shrink-0">🔑</span>
              <span className="flex-1">
                <span className="block text-[15px] font-semibold text-bn-text">Username + password</span>
                <span className="text-[12px] text-bn-text-dim">Simple and fast — pick a username and a strong password.</span>
              </span>
              <span className="text-bn-text-dim">→</span>
            </button>

            <button onClick={handleDemo}
              className="w-full flex items-center gap-3.5 p-4 rounded-2xl border border-bn-border bg-bn-surface hover:border-bn-border-mid transition-colors text-left cursor-pointer">
              <span className="w-10 h-10 rounded-xl bg-bn-surface-2 flex items-center justify-center text-lg shrink-0">🛡️</span>
              <span className="flex-1">
                <span className="block text-[15px] font-semibold text-bn-text">Create with secret phrase</span>
                <span className="text-[12px] text-bn-text-dim">Generate a 12-word mnemonic — your keys, your Bitcoin.</span>
              </span>
              <span className="text-bn-text-dim">→</span>
            </button>

            <BackBtn onClick={() => go('start')} />
          </>
        )}

        {/* ── CREATE WITH PASSWORD ── */}
        {screen === 'create-pass' && (
          <>
            <IconHeader icon="🔑" title="Create with password" sub="Enter a username and a strong password to secure your wallet." />
            {error && <ErrorBox msg={error} />}

            <div className="bg-bn-surface border border-bn-border rounded-2xl p-5 mb-3">
              <label className="block text-[11px] font-semibold text-bn-text-muted tracking-[0.08em] uppercase mb-2">Username</label>
              <input
                autoFocus
                value={username}
                onChange={e => setUsername(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSignup()}
                placeholder="satoshi"
                className="w-full px-3.5 py-3 bg-bn-bg border border-bn-border rounded-xl text-bn-text text-[15px] placeholder-bn-text-dim outline-none focus:border-bn-accent/50 transition-colors font-[family-name:var(--font-hubot-sans)]"
              />

              <label className="block text-[11px] font-semibold text-bn-text-muted tracking-[0.08em] uppercase mb-2 mt-4">Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSignup()}
                  placeholder="At least 8 characters"
                  className="w-full px-3.5 py-3 pr-11 bg-bn-bg border border-bn-border rounded-xl text-bn-text text-[15px] placeholder-bn-text-dim outline-none focus:border-bn-accent/50 transition-colors font-[family-name:var(--font-hubot-sans)]"
                />
                <button type="button" onClick={() => setShowPw(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-bn-text-dim hover:text-bn-text-muted transition-colors text-base">
                  {showPw ? '🙈' : '👁'}
                </button>
              </div>

              {/* Strength checklist */}
              {password.length > 0 && (
                <div className="mt-2.5 p-3 bg-bn-bg rounded-xl flex flex-col gap-1.5">
                  {CHECKS.map(([key, label]) => (
                    <div key={key} className="flex items-center gap-2 text-[13px]">
                      <span className={`w-[17px] h-[17px] rounded-full border-2 flex items-center justify-center text-[9px] shrink-0 transition-colors ${checks[key] ? 'border-positive-green text-positive-green' : 'border-bn-border text-transparent'}`}>✓</span>
                      <span className={checks[key] ? 'text-positive-green' : 'text-bn-text-dim'}>{label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <PrimaryBtn onClick={handleSignup} disabled={!username || !pwOk}>Create wallet →</PrimaryBtn>
            <BackBtn onClick={() => go('create')} />
          </>
        )}

        {/* ── SIGN IN ── */}
        {screen === 'signin' && (
          <>
            <IconHeader icon="🔐" title="Welcome back" sub="Sign in to your Bitcoin Names account." />
            {error && <ErrorBox msg={error} />}

            <div className="bg-bn-surface border border-bn-border rounded-2xl p-5 mb-3">
              <label className="block text-[11px] font-semibold text-bn-text-muted tracking-[0.08em] uppercase mb-2">Username</label>
              <input
                autoFocus
                value={username}
                onChange={e => setUsername(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSignin()}
                placeholder="satoshi"
                className="w-full px-3.5 py-3 bg-bn-bg border border-bn-border rounded-xl text-bn-text text-[15px] placeholder-bn-text-dim outline-none focus:border-bn-accent/50 transition-colors font-[family-name:var(--font-hubot-sans)]"
              />

              <label className="block text-[11px] font-semibold text-bn-text-muted tracking-[0.08em] uppercase mb-2 mt-4">Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSignin()}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-3 pr-11 bg-bn-bg border border-bn-border rounded-xl text-bn-text text-[15px] placeholder-bn-text-dim outline-none focus:border-bn-accent/50 transition-colors font-[family-name:var(--font-hubot-sans)]"
                />
                <button type="button" onClick={() => setShowPw(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-bn-text-dim hover:text-bn-text-muted text-base">
                  {showPw ? '🙈' : '👁'}
                </button>
              </div>

              <p className="mt-3 text-[12px] text-bn-text-dim text-center">
                Demo credentials: <span className="font-[family-name:var(--font-source-code-pro)] text-bn-text-muted">satoshi / Demo1234!</span>
              </p>
            </div>

            <PrimaryBtn onClick={handleSignin} disabled={!username || !password}>Sign in →</PrimaryBtn>

            <p className="text-center mt-3.5 text-[13px] text-bn-text-dim">
              No account?{' '}
              <button onClick={() => go('create')} className="text-bn-accent font-semibold hover:text-bn-accent-hover transition-colors">
                Create one
              </button>
            </p>

            <BackBtn onClick={() => go('start')} />
          </>
        )}

      </div>
    </div>
  )
}

function IconHeader({ icon, title, sub }: { icon: string; title: string; sub: string }) {
  return (
    <div className="text-center mb-7">
      <div className="w-14 h-14 rounded-2xl bg-bn-accent flex items-center justify-center text-2xl mx-auto mb-4" style={{ boxShadow: '0 8px 24px rgba(247,147,26,0.35)' }}>{icon}</div>
      <h1 className="text-[26px] font-semibold text-bn-text tracking-[-0.03em] mb-2">{title}</h1>
      <p className="text-[13px] text-bn-text-muted max-w-[300px] mx-auto leading-relaxed">{sub}</p>
    </div>
  )
}

function ErrorBox({ msg }: { msg: string }) {
  return (
    <div className="mb-3.5 px-4 py-2.5 bg-negative-red/8 border border-negative-red/20 rounded-xl text-negative-red text-[13px]">
      {msg}
    </div>
  )
}

function PrimaryBtn({ onClick, disabled, children }: { onClick: () => void; disabled: boolean; children: React.ReactNode }) {
  return (
    <button onClick={onClick} disabled={disabled}
      className="w-full py-4 rounded-2xl text-[16px] font-semibold transition-all cursor-pointer disabled:cursor-not-allowed"
      style={{ background: disabled ? '#1a1a1e' : '#f7931a', color: disabled ? '#5a5a62' : '#0b0b0c' }}>
      {children}
    </button>
  )
}

function BackBtn({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className="block mx-auto mt-4 text-[13px] text-bn-text-dim hover:text-bn-text-muted transition-colors">
      ← Back
    </button>
  )
}
