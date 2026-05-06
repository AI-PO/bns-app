'use client'
// Fix 2: Login — exact Orobit Hub flow, BNS branding (light page, dark card)
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { useAuth } from '@/lib/auth'

type Flow = 'pick' | 'create' | 'create-pw' | 'create-phrase' | 'signin'

const WORDLIST = ["abandon","ability","able","about","above","absent","absorb","abstract","absurd","abuse","access","accident","account","accuse","achieve","acid","acoustic","acquire","across","act","action","actor","actress","actual","adapt","add","addict","address","adjust","admit","adult","advance","advice","aerobic","afford","afraid","again","age","agent","agree","ahead","aim","air","airport","aisle","alarm","album","alcohol","alert","alien","all","alley","allow","almost","alone","alpha","already","also","alter","always","amateur","amazing","among","amount","amused","analyst","anchor","ancient","anger","angle"]

function genMnemonic() {
  return [...WORDLIST].sort(() => Math.random() - 0.5).slice(0, 12)
}

function pwChecks(pw: string) {
  return { length: pw.length >= 8, upper: /[A-Z]/.test(pw), lower: /[a-z]/.test(pw), number: /[0-9]/.test(pw), special: /[^A-Za-z0-9]/.test(pw) }
}

const PW_CRITERIA = [
  { key: 'length' as const, label: 'At least 8 characters' },
  { key: 'upper'  as const, label: 'One uppercase letter' },
  { key: 'lower'  as const, label: 'One lowercase letter' },
  { key: 'number' as const, label: 'One number' },
  { key: 'special'as const, label: 'One special character' },
]

const BACK: Partial<Record<Flow, Flow>> = {
  create: 'pick', 'create-pw': 'create', 'create-phrase': 'create', signin: 'pick',
}

export default function LoginPage() {
  const router = useRouter()
  const { login, signup, loginDemo } = useAuth()
  const [flow,     setFlow]     = useState<Flow>('pick')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPw,   setShowPw]   = useState(false)
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)
  const [mnemonic] = useState(() => genMnemonic())
  const [phraseConfirmed, setPhraseConfirmed] = useState(false)

  const go = (f: Flow) => { setFlow(f); setError(''); setPassword('') }

  const redirect = () => {
    const dest = typeof sessionStorage !== 'undefined'
      ? (sessionStorage.getItem('post_login_redirect') || '/app') : '/app'
    if (typeof sessionStorage !== 'undefined') sessionStorage.removeItem('post_login_redirect')
    router.push(dest)
  }

  const checks = pwChecks(password)
  const pwOk   = Object.values(checks).every(Boolean)

  const handleDemo = async () => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 500))
    loginDemo(); redirect()
    setLoading(false)
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!pwOk) { setError('Please meet all password requirements.'); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 600))
    const res = signup(username, password)
    if (!res.ok) { setError(res.error!); setLoading(false); return }
    redirect()
  }

  const handleSignin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 600))
    const res = login(username, password)
    if (!res.ok) { setError(res.error!); setLoading(false); return }
    redirect()
  }

  const backFlow = BACK[flow]

  return (
    <div className="relative min-h-screen bg-bn-page">
      {/* Subtle glow top */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[40vh] opacity-30"
        style={{ background: 'radial-gradient(ellipse 70% 60% at 50% -10%, rgba(247,147,26,0.15) 0%, transparent 70%)' }} />

      {/* Header */}
      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Link href="/">
          <Image src="/navbar_logo.svg" alt="Bitcoin Names" width={122} height={31} className="h-[34px] w-auto" />
        </Link>
        {backFlow ? (
          <button onClick={() => go(backFlow)} className="text-[14px] text-bn-ink-muted hover:text-bn-ink transition-colors flex items-center gap-1">
            ← Back
          </button>
        ) : (
          <Link href="/" className="text-[14px] text-bn-ink-muted hover:text-bn-ink transition-colors flex items-center gap-1">← Back</Link>
        )}
      </header>

      <main className="relative z-10 mx-auto flex max-w-[440px] flex-col px-5 pb-20 pt-4">

        {/* ── PICK ── */}
        {flow === 'pick' && (
          <>
            <div className="text-center mb-10">
              <h1 className="text-[32px] font-semibold tracking-[-0.03em] text-bn-ink mb-2">Get started</h1>
              <p className="text-[15px] text-bn-ink-muted">Set up your Bitcoin Names account in seconds.</p>
            </div>
            <div className="space-y-3">
              <TopCard icon="💼" title="Create new account" desc="New? Create an account secured by a password or seed phrase." onClick={() => go('create')} />
              <TopCard icon="🔑" title="Sign in" desc="Already have an account? Sign in with your credentials." onClick={() => go('signin')} />
            </div>
            <div className="mt-5 relative flex items-center gap-3">
              <div className="flex-1 h-px bg-bn-line" /><span className="text-[13px] text-bn-ink-muted">or</span><div className="flex-1 h-px bg-bn-line" />
            </div>
            <button onClick={handleDemo} disabled={loading}
              className="mt-5 w-full flex items-center gap-4 rounded-2xl border border-bn-accent/20 bg-bn-accent/6 hover:bg-bn-accent/10 p-5 text-left transition-colors">
              <div className="w-14 h-14 rounded-2xl bg-bn-accent flex items-center justify-center text-2xl shrink-0 shadow-[0_4px_12px_rgba(247,147,26,0.3)]">⚡</div>
              <div className="flex-1">
                <div className="text-[16px] font-semibold text-bn-accent mb-0.5">{loading ? 'Loading…' : 'Try demo'}</div>
                <div className="text-[13px] text-bn-ink-muted">Explore the full app instantly — no signup needed.</div>
              </div>
              <span className="text-bn-accent text-lg">→</span>
            </button>
          </>
        )}

        {/* ── CREATE: sub-picker ── */}
        {flow === 'create' && (
          <>
            <FlowHeader icon="💼" title="Create new account" sub="Choose how you'd like to secure your wallet." />
            <div className="space-y-3">
              <SubCard icon="🔑" title="Username + password" desc="Simple and fast — pick a username and a strong password." onClick={() => go('create-pw')} />
              <SubCard icon="🛡️" title="Create with secret phrase" desc="Generate a 12-word mnemonic for full self-custody — your keys, your Bitcoin." onClick={() => go('create-phrase')} />
            </div>
          </>
        )}

        {/* ── CREATE WITH PASSWORD ── */}
        {flow === 'create-pw' && (
          <>
            <FlowHeader icon="🔑" title="Create with password" sub="Enter a username and a strong password to secure your wallet." />
            {error && <ErrorBox msg={error} />}
            <div className="rounded-3xl border border-bn-line bg-white p-7 shadow-[0_1px_3px_rgba(10,10,10,0.06),0_8px_32px_-8px_rgba(10,10,10,0.08)]">
              <form onSubmit={handleSignup} className="space-y-4">
                <div>
                  <label className="block text-[13px] font-semibold text-bn-ink mb-2">Username</label>
                  <input autoFocus value={username} onChange={e => setUsername(e.target.value)}
                    placeholder="satoshi" required
                    className="w-full h-12 px-4 border border-bn-line-2 rounded-xl text-[15px] text-bn-ink placeholder-bn-ink-dim focus:outline-none focus:border-bn-accent/40 focus:ring-2 focus:ring-bn-accent/10 transition-all bg-bn-page-2" />
                </div>
                <div>
                  <label className="block text-[13px] font-semibold text-bn-ink mb-2">Password</label>
                  <div className="relative">
                    <input type={showPw ? 'text' : 'password'} value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="At least 8 characters" required
                      className="w-full h-12 px-4 pr-12 border border-bn-line-2 rounded-xl text-[15px] text-bn-ink placeholder-bn-ink-dim focus:outline-none focus:border-bn-accent/40 focus:ring-2 focus:ring-bn-accent/10 transition-all bg-bn-page-2" />
                    <button type="button" onClick={() => setShowPw(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-bn-ink-muted hover:text-bn-ink">
                      {showPw ? '🙈' : '👁'}
                    </button>
                  </div>
                  {/* Strength checklist */}
                  <div className="mt-2 rounded-xl border border-bn-line bg-bn-page-2 p-3 space-y-1.5">
                    {PW_CRITERIA.map(({ key, label }) => {
                      const met = checks[key]
                      const fail = password.length > 0 && !met
                      return (
                        <div key={key} className={`flex items-center gap-2 text-[12px] transition-colors ${met ? 'text-green-600' : fail ? 'text-red-500' : 'text-bn-ink-muted'}`}>
                          <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center text-[9px] shrink-0 ${met ? 'border-green-500 text-green-500' : fail ? 'border-red-400' : 'border-bn-line-2'}`}>{met ? '✓' : ''}</span>
                          {label}
                        </div>
                      )
                    })}
                  </div>
                </div>
                <button type="submit" disabled={loading || !pwOk}
                  className="w-full h-12 rounded-xl bg-bn-ink text-white font-semibold text-[15px] hover:bg-black disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2">
                  {loading ? '⏳ Creating…' : <>Create wallet →</>}
                </button>
              </form>
            </div>
          </>
        )}

        {/* ── SECRET PHRASE (show) ── */}
        {flow === 'create-phrase' && !phraseConfirmed && (
          <>
            <FlowHeader icon="🛡️" title="Your secret phrase" sub="Write these 12 words down and store them safely. Never share them." />
            <div className="rounded-3xl border border-bn-line bg-white p-6 shadow-[0_1px_3px_rgba(10,10,10,0.06),0_8px_32px_-8px_rgba(10,10,10,0.08)] mb-4">
              <div className="grid grid-cols-3 gap-2">
                {mnemonic.map((word, i) => (
                  <div key={i} className="flex items-center gap-2 rounded-xl border border-bn-line bg-bn-page-2 px-3 py-2.5">
                    <span className="w-4 shrink-0 text-[10px] font-bold text-bn-ink-muted font-mono">{i + 1}</span>
                    <span className="font-mono text-[13px] font-semibold text-bn-ink">{word}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-[12px] text-bn-ink-muted">
                🛡️ These 12 words are the only way to recover your wallet. Write them down before continuing.
              </div>
            </div>
            <button onClick={() => { setPhraseConfirmed(true); handleDemo() }}
              className="w-full h-12 rounded-xl bg-bn-ink text-white font-semibold text-[15px] hover:bg-black transition-colors flex items-center justify-center gap-2">
              I've saved my phrase →
            </button>
          </>
        )}

        {/* ── SIGN IN ── */}
        {flow === 'signin' && (
          <>
            <div className="text-center mb-8">
              <div className="w-14 h-14 rounded-2xl border border-bn-line bg-bn-page-2 flex items-center justify-center text-2xl mx-auto mb-4">🔐</div>
              <h1 className="text-[28px] font-semibold tracking-[-0.03em] text-bn-ink mb-2">Welcome back</h1>
              <p className="text-[14px] text-bn-ink-muted">Sign in with your name and password.</p>
            </div>
            {error && <ErrorBox msg={error} />}
            <div className="rounded-3xl border border-bn-line bg-white p-7 shadow-[0_1px_3px_rgba(10,10,10,0.06),0_8px_32px_-8px_rgba(10,10,10,0.08)]">
              <form onSubmit={handleSignin} className="space-y-4">
                <div>
                  <label className="block text-[13px] font-semibold text-bn-ink mb-2">Username</label>
                  <input autoFocus value={username} onChange={e => setUsername(e.target.value)}
                    placeholder="satoshi" required
                    className="w-full h-12 px-4 border border-bn-line-2 rounded-xl text-[15px] text-bn-ink placeholder-bn-ink-dim focus:outline-none focus:border-bn-accent/40 focus:ring-2 focus:ring-bn-accent/10 transition-all bg-bn-page-2" />
                </div>
                <div>
                  <label className="block text-[13px] font-semibold text-bn-ink mb-2">Password</label>
                  <div className="relative">
                    <input type={showPw ? 'text' : 'password'} value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••" required
                      className="w-full h-12 px-4 pr-12 border border-bn-line-2 rounded-xl text-[15px] text-bn-ink placeholder-bn-ink-dim focus:outline-none focus:border-bn-accent/40 focus:ring-2 focus:ring-bn-accent/10 transition-all bg-bn-page-2" />
                    <button type="button" onClick={() => setShowPw(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-bn-ink-muted hover:text-bn-ink">
                      {showPw ? '🙈' : '👁'}
                    </button>
                  </div>
                  <p className="mt-2 text-[12px] text-bn-ink-dim text-center">Demo: satoshi / Demo1234!</p>
                </div>
                <button type="submit" disabled={loading}
                  className="w-full h-12 rounded-xl bg-bn-ink text-white font-semibold text-[15px] hover:bg-black disabled:opacity-40 transition-colors flex items-center justify-center gap-2">
                  {loading ? '⏳ Signing in…' : 'Unlock wallet →'}
                </button>
              </form>
            </div>
            <p className="mt-5 text-center text-[13px] text-bn-ink-muted">
              New to Bitcoin Names?{' '}
              <button onClick={() => go('create')} className="font-semibold text-bn-accent hover:text-bn-accent-hover">Create a wallet</button>
            </p>
          </>
        )}

      </main>
    </div>
  )
}

function TopCard({ icon, title, desc, onClick }: { icon: string; title: string; desc: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="group w-full flex items-center gap-5 rounded-3xl border border-bn-line bg-white p-6 text-left hover:border-bn-accent/30 hover:shadow-[0_4px_16px_rgba(10,10,10,0.08)] transition-all active:scale-[0.99]">
      <div className="w-14 h-14 rounded-2xl bg-bn-ink flex items-center justify-center text-2xl shrink-0">{icon}</div>
      <div className="flex-1 min-w-0">
        <div className="text-[17px] font-semibold text-bn-ink mb-1">{title}</div>
        <div className="text-[13px] text-bn-ink-muted leading-snug">{desc}</div>
      </div>
      <span className="text-bn-ink-muted group-hover:text-bn-accent transition-colors text-lg">→</span>
    </button>
  )
}

function SubCard({ icon, title, desc, onClick }: { icon: string; title: string; desc: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="group w-full flex items-center gap-4 rounded-2xl border border-bn-line bg-white p-5 text-left hover:border-bn-accent/30 hover:shadow-[0_2px_8px_rgba(10,10,10,0.06)] transition-all active:scale-[0.99]">
      <div className="w-11 h-11 rounded-xl bg-bn-page-2 border border-bn-line flex items-center justify-center text-xl shrink-0">{icon}</div>
      <div className="flex-1 min-w-0">
        <div className="text-[15px] font-semibold text-bn-ink mb-0.5">{title}</div>
        <div className="text-[13px] text-bn-ink-muted leading-snug">{desc}</div>
      </div>
      <span className="text-bn-ink-muted group-hover:text-bn-accent transition-colors">→</span>
    </button>
  )
}

function FlowHeader({ icon, title, sub }: { icon: string; title: string; sub: string }) {
  return (
    <div className="text-center mb-8">
      <div className="w-14 h-14 rounded-2xl bg-bn-ink flex items-center justify-center text-2xl mx-auto mb-4">{icon}</div>
      <h1 className="text-[28px] font-semibold tracking-[-0.03em] text-bn-ink mb-2">{title}</h1>
      <p className="text-[13px] text-bn-ink-muted max-w-[300px] mx-auto leading-relaxed">{sub}</p>
    </div>
  )
}

function ErrorBox({ msg }: { msg: string }) {
  return <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-[13px] text-red-600">{msg}</div>
}
