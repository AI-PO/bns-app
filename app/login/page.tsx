'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
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

const CHECK_LABELS = [
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

  const go = (s: Screen) => {
    setScreen(s); setError(''); setUsername(''); setPassword('')
  }

  const checks = pwChecks(password)
  const pwOk   = Object.values(checks).every(Boolean)

  const handleDemo = () => {
    loginDemo()
    router.push('/app')
  }

  const handleSignup = () => {
    const res = signup(username, password)
    if (!res.ok) { setError(res.error!); return }
    router.push('/app')
  }

  const handleSignin = () => {
    const res = login(username, password)
    if (!res.ok) { setError(res.error!); return }
    router.push('/app')
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a08',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      fontFamily: 'Inter, -apple-system, sans-serif',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Glow */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(247,147,26,0.08) 0%, transparent 70%)',
      }} />

      {/* Back */}
      <div style={{ position: 'fixed', top: 20, left: 24, zIndex: 10 }}>
        <Link href="/" style={{ color: '#5a5850', fontSize: 13, textDecoration: 'none' }}>
          ← Bitcoin Names
        </Link>
      </div>

      <div style={{ width: '100%', maxWidth: 420, position: 'relative', zIndex: 1 }}>

        {/* ── START ── */}
        {screen === 'start' && (
          <>
            <div style={{ textAlign: 'center', marginBottom: 36 }}>
              <div style={iconStyle}>₿</div>
              <h1 style={h1Style}>Get started</h1>
              <p style={subStyle}>Sign in to buy and manage your .btc names.</p>
            </div>

            {/* Demo — most prominent */}
            <button onClick={handleDemo} style={{ ...optStyle, background: 'rgba(247,147,26,0.06)', border: '1px solid rgba(247,147,26,0.20)', marginBottom: 8 }}>
              <span style={{ ...optIcon, background: 'rgba(247,147,26,0.20)' }}>⚡</span>
              <span style={{ flex: 1, textAlign: 'left' }}>
                <span style={{ display: 'block', fontSize: 15, fontWeight: 700, color: '#f7931a' }}>Try demo</span>
                <span style={{ fontSize: 12, color: '#5a5850' }}>Explore the full app — no signup needed.</span>
              </span>
              <span style={{ color: '#f7931a' }}>→</span>
            </button>

            <Divider />

            <button onClick={() => go('create')} style={{ ...optStyle, marginBottom: 8 }}>
              <span style={{ ...optIcon, background: '#1c1c1a' }}>💼</span>
              <span style={{ flex: 1, textAlign: 'left' }}>
                <span style={{ display: 'block', fontSize: 15, fontWeight: 600, color: '#f0ede6' }}>Create new account</span>
                <span style={{ fontSize: 12, color: '#5a5850' }}>New to Bitcoin? Set up in seconds.</span>
              </span>
              <span style={{ color: '#5a5850' }}>→</span>
            </button>

            <button onClick={() => go('signin')} style={optStyle}>
              <span style={{ ...optIcon, background: '#1c1c1a' }}>🔐</span>
              <span style={{ flex: 1, textAlign: 'left' }}>
                <span style={{ display: 'block', fontSize: 15, fontWeight: 600, color: '#f0ede6' }}>Sign in</span>
                <span style={{ fontSize: 12, color: '#5a5850' }}>Already have an account.</span>
              </span>
              <span style={{ color: '#5a5850' }}>→</span>
            </button>
          </>
        )}

        {/* ── CREATE ── */}
        {screen === 'create' && (
          <>
            <IconHeader icon="💼" title="Create new account" sub="Choose how you'd like to secure your wallet." />

            <button onClick={() => go('create-pass')} style={{ ...optStyle, border: '1px solid #f7931a', marginBottom: 8 }}>
              <span style={{ ...optIcon, background: '#1c1c1a' }}>🔑</span>
              <span style={{ flex: 1, textAlign: 'left' }}>
                <span style={{ display: 'block', fontSize: 15, fontWeight: 600, color: '#f0ede6' }}>Username + password</span>
                <span style={{ fontSize: 12, color: '#5a5850' }}>Simple and fast — pick a username and a strong password.</span>
              </span>
              <span style={{ color: '#5a5850' }}>→</span>
            </button>

            <button onClick={handleDemo} style={optStyle}>
              <span style={{ ...optIcon, background: '#1c1c1a' }}>🛡️</span>
              <span style={{ flex: 1, textAlign: 'left' }}>
                <span style={{ display: 'block', fontSize: 15, fontWeight: 600, color: '#f0ede6' }}>Create with secret phrase</span>
                <span style={{ fontSize: 12, color: '#5a5850' }}>Generate a 12-word mnemonic for full self-custody — your keys, your Bitcoin.</span>
              </span>
              <span style={{ color: '#5a5850' }}>→</span>
            </button>

            <BackBtn onClick={() => go('start')} />
          </>
        )}

        {/* ── CREATE WITH PASSWORD ── */}
        {screen === 'create-pass' && (
          <>
            <IconHeader icon="🔑" title="Create with password" sub="Enter a username and a strong password to secure your wallet." />
            {error && <ErrorBox msg={error} />}

            <div style={cardStyle}>
              <Field label="Username">
                <input
                  autoFocus
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="satoshi"
                  onKeyDown={e => e.key === 'Enter' && handleSignup()}
                  style={inputStyle}
                />
              </Field>

              <Field label="Password" style={{ marginTop: 16 }}>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPw ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    onKeyDown={e => e.key === 'Enter' && handleSignup()}
                    style={{ ...inputStyle, paddingRight: 44 }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(v => !v)}
                    style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#5a5850', fontSize: 16 }}
                  >{showPw ? '🙈' : '👁'}</button>
                </div>

                {/* Strength checklist */}
                {password.length > 0 && (
                  <div style={{ marginTop: 8, padding: '10px 12px', background: '#111110', borderRadius: 10, display: 'flex', flexDirection: 'column', gap: 5 }}>
                    {CHECK_LABELS.map(([key, label]) => (
                      <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                        <span style={{
                          width: 17, height: 17, borderRadius: '50%',
                          border: `2px solid ${checks[key] ? '#4caf7d' : '#2e2e2a'}`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 9, color: checks[key] ? '#4caf7d' : 'transparent', flexShrink: 0,
                        }}>✓</span>
                        <span style={{ color: checks[key] ? '#4caf7d' : '#5a5850' }}>{label}</span>
                      </div>
                    ))}
                  </div>
                )}
              </Field>
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

            <div style={cardStyle}>
              <Field label="Username">
                <input
                  autoFocus
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="satoshi"
                  onKeyDown={e => e.key === 'Enter' && handleSignin()}
                  style={inputStyle}
                />
              </Field>
              <Field label="Password" style={{ marginTop: 16 }}>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPw ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    onKeyDown={e => e.key === 'Enter' && handleSignin()}
                    style={{ ...inputStyle, paddingRight: 44 }}
                  />
                  <button type="button" onClick={() => setShowPw(v => !v)}
                    style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#5a5850', fontSize: 16 }}>
                    {showPw ? '🙈' : '👁'}
                  </button>
                </div>
              </Field>
            </div>

            <PrimaryBtn onClick={handleSignin} disabled={!username || !password}>Sign in →</PrimaryBtn>

            <p style={{ textAlign: 'center', marginTop: 14, fontSize: 13, color: '#5a5850' }}>
              No account?{' '}
              <button onClick={() => go('create')} style={{ background: 'none', border: 'none', color: '#f7931a', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
                Create one
              </button>
            </p>

            <p style={{ textAlign: 'center', marginTop: 8, fontSize: 12, color: '#3a3a38' }}>
              Demo: satoshi / Demo1234!
            </p>

            <BackBtn onClick={() => go('start')} />
          </>
        )}

      </div>
    </div>
  )
}

// ── Sub-components ──

function IconHeader({ icon, title, sub }: { icon: string; title: string; sub: string }) {
  return (
    <div style={{ textAlign: 'center', marginBottom: 28 }}>
      <div style={iconStyle}>{icon}</div>
      <h1 style={h1Style}>{title}</h1>
      <p style={subStyle}>{sub}</p>
    </div>
  )
}

function Field({ label, children, style }: { label: string; children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={style}>
      <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#8a8778', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>
        {label}
      </label>
      {children}
    </div>
  )
}

function ErrorBox({ msg }: { msg: string }) {
  return (
    <div style={{ marginBottom: 14, padding: '10px 14px', background: 'rgba(224,90,58,0.08)', border: '1px solid rgba(224,90,58,0.2)', borderRadius: 10, color: '#e05a3a', fontSize: 13 }}>
      {msg}
    </div>
  )
}

function PrimaryBtn({ onClick, disabled, children }: { onClick: () => void; disabled: boolean; children: React.ReactNode }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      width: '100%', padding: 15,
      background: disabled ? '#1c1c1a' : '#f7931a',
      color: disabled ? '#5a5850' : '#0a0a08',
      border: 'none', borderRadius: 14,
      fontSize: 16, fontWeight: 700,
      cursor: disabled ? 'not-allowed' : 'pointer',
      fontFamily: 'inherit',
    }}>
      {children}
    </button>
  )
}

function BackBtn({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} style={{ display: 'block', margin: '16px auto 0', background: 'none', border: 'none', color: '#5a5850', fontSize: 13, cursor: 'pointer' }}>
      ← Back
    </button>
  )
}

function Divider() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '6px 0 12px' }}>
      <div style={{ flex: 1, height: 1, background: '#232320' }} />
      <span style={{ fontSize: 12, color: '#5a5850' }}>or</span>
      <div style={{ flex: 1, height: 1, background: '#232320' }} />
    </div>
  )
}

// ── Styles ──
const iconStyle: React.CSSProperties = {
  width: 60, height: 60, borderRadius: 18, background: '#f7931a',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  fontSize: 26, margin: '0 auto 16px',
  boxShadow: '0 8px 24px rgba(247,147,26,0.3)',
}
const h1Style: React.CSSProperties = {
  fontSize: 28, fontWeight: 700, color: '#f0ede6',
  letterSpacing: '-0.03em', margin: '0 0 8px',
}
const subStyle: React.CSSProperties = {
  fontSize: 14, color: '#5a5850', fontWeight: 300,
  maxWidth: 300, margin: '0 auto', lineHeight: 1.5,
}
const optStyle: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: 14,
  padding: '14px 16px', background: '#161614',
  border: '1px solid #232320', borderRadius: 14,
  cursor: 'pointer', width: '100%', textAlign: 'left',
}
const optIcon: React.CSSProperties = {
  width: 40, height: 40, borderRadius: 12,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  fontSize: 18, flexShrink: 0,
}
const cardStyle: React.CSSProperties = {
  background: '#161614', border: '1px solid #232320',
  borderRadius: 16, padding: '20px 18px', marginBottom: 12,
}
const inputStyle: React.CSSProperties = {
  width: '100%', padding: '12px 14px',
  background: '#0a0a08', border: '1px solid #2e2e2a',
  borderRadius: 10, color: '#f0ede6', fontSize: 15,
  fontFamily: 'inherit', outline: 'none',
}
