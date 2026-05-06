'use client'
import Link from 'next/link'
import { useState } from 'react'
import { useAuth } from '@/lib/auth'
import { MOCK_MARKETPLACE, MOCK_ACTIVITY } from '@/lib/mock-data'

// Onboarding steps — BNS specific
const STEPS = [
  {
    key: 0,
    icon: '💳',
    title: 'Add funds to your wallet',
    desc: 'Deposit via Stables or MoonPay to get started. You need BTC to buy your first name.',
    cta: 'Add Funds',
    href: '#add-funds',
  },
  {
    key: 1,
    icon: '🌐',
    title: 'Buy your first .btc domain',
    desc: 'Search for a name and claim your portable Bitcoin identity on-chain.',
    cta: 'Buy domain',
    href: '/app/search',
  },
  {
    key: 2,
    icon: '⭐',
    title: 'Set it as your primary name',
    desc: 'Your primary name is what resolves your wallet address and identity.',
    cta: 'Set primary',
    href: '/app/identity',
  },
  {
    key: 3,
    icon: '➕',
    title: 'Buy a second domain',
    desc: 'Grow your portfolio or register a name for someone else.',
    cta: 'Buy another',
    href: '/app/search',
  },
  {
    key: 4,
    icon: '🏷️',
    title: 'List a domain for sale',
    desc: 'Put your second domain on the marketplace. Set a fixed price or start an auction.',
    cta: 'List for sale',
    href: '/app/my-names',
  },
  {
    key: 5,
    icon: '🎉',
    title: "You're set up!",
    desc: '',
    cta: '',
    href: '',
    isFinal: true,
  },
] as const

export default function AppHome() {
  const { user, advanceOnboarding, updateUser } = useAuth()
  const [addFundsModal, setAddFundsModal] = useState(false)

  if (!user) return null

  const step = user.onboardingStep ?? 0
  const showOnboarding = user.showOnboarding !== false && step < 5
  const progress = Math.round((step / 5) * 100)
  const current = STEPS[step as keyof typeof STEPS]

  const handleStepCta = () => {
    if (step === 0) { setAddFundsModal(true); return }
    advanceOnboarding()
  }

  return (
    <div className="p-7 max-w-[1000px]">
      {/* Greeting */}
      <div className="mb-6">
        <h1 className="text-[22px] font-medium tracking-[-0.03em] text-bn-ink">Hi, {user.name} 👋</h1>
        <p className="text-[14px] text-bn-ink-muted mt-0.5">Welcome to your Bitcoin Names dashboard.</p>
      </div>

      {/* Onboarding */}
      {showOnboarding && current && typeof current === 'object' && !('isFinal' in current) && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-[14px]">✨</span>
              <h2 className="text-[16px] font-semibold text-bn-ink">Getting started</h2>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[13px] font-semibold text-bn-ink-muted">{step} / 5</span>
              <button onClick={() => updateUser({ showOnboarding: false })} className="text-[12px] text-bn-ink-dim hover:text-bn-ink-muted">Dismiss</button>
            </div>
          </div>
          <div className="h-1.5 rounded-full bg-bn-page-3 mb-4 overflow-hidden">
            <div className="h-full bg-bn-accent rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
          <div className="flex items-start gap-4 rounded-2xl border border-bn-accent/25 bg-bn-accent/5 p-5">
            <div className="w-11 h-11 rounded-xl bg-bn-accent/15 flex items-center justify-center text-xl shrink-0">{current.icon}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] font-medium text-bn-ink-muted">Step {step + 1} of 5</span>
              </div>
              <div className="text-[16px] font-semibold text-bn-ink mb-1">{current.title}</div>
              <div className="text-[13px] text-bn-ink-muted mb-4">{current.desc}</div>
              <button onClick={handleStepCta}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-[13px] font-semibold transition-colors ${current.href && current.href !== '#add-funds' ? 'bg-bn-ink text-white hover:bg-black' : 'bg-bn-accent text-white hover:bg-bn-accent-h'}`}
                onClick={() => { if (current.href && current.href !== '#add-funds') { advanceOnboarding() } else { handleStepCta() } }}>
                {current.cta} →
              </button>
            </div>
          </div>

          {/* Completion message */}
          {step >= 5 && (
            <div className="flex items-start gap-4 rounded-2xl border border-green-200 bg-green-50 p-5">
              <div className="w-11 h-11 rounded-xl bg-green-100 flex items-center justify-center text-xl shrink-0">🎉</div>
              <div className="flex-1">
                <div className="text-[16px] font-semibold text-bn-ink mb-1">Congratulations!</div>
                <div className="text-[13px] text-bn-ink-muted">
                  You can now accept funds to your wallet with just your name:{' '}
                  <span className="font-mono-bn font-semibold text-bn-accent">{user.primaryName ?? `${user.name}.btc`}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Stats — Fix 7: removed Block Height */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          { label: 'Names Owned', value: user.ownedDomains.length.toString(), sub: user.ownedDomains.length === 0 ? 'Buy your first name' : `+${user.ownedDomains.length} total`, cls: 'text-bn-ink-muted' },
          { label: 'Primary Name', value: user.primaryName ? user.primaryName.split('.')[0] : '—', sub: user.primaryName ? '.btc' : 'Not set yet', cls: 'text-bn-accent' },
          { label: 'Portfolio Value', value: user.ownedDomains.length === 0 ? '0.00 BTC' : `${(user.ownedDomains.length * 0.005).toFixed(3)} BTC`, sub: 'Estimated', cls: 'text-bn-ink-muted' },
        ].map(s => (
          <div key={s.label} className="bg-white border border-bn-line rounded-xl p-5 shadow-[0_1px_3px_rgba(10,10,10,0.05)]">
            <p className="font-mono-bn text-[10px] text-bn-ink-muted uppercase tracking-[0.08em] mb-2.5">{s.label}</p>
            <p className="text-[20px] font-medium tracking-[-0.04em] text-bn-ink mb-1">{s.value}</p>
            <p className={`font-mono-bn text-[11px] ${s.cls}`}>{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* My Names — empty state if none */}
        <div className="bg-white border border-bn-line rounded-xl overflow-hidden shadow-[0_1px_3px_rgba(10,10,10,0.05)]">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-bn-line">
            <span className="text-[13px] font-semibold text-bn-ink">My Names</span>
            <Link href="/app/my-names" className="text-[12px] text-bn-accent">View all →</Link>
          </div>
          {user.ownedDomains.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 px-5 text-center">
              <div className="text-3xl mb-3">🌐</div>
              <p className="text-[13px] text-bn-ink-muted mb-3">You don't own any .btc names yet.</p>
              <Link href="/app/search" className="button button-primary text-[12px] px-4 py-2 rounded-full">Buy your first name →</Link>
            </div>
          ) : (
            user.ownedDomains.map((name, i) => (
              <div key={name} className={`flex items-center gap-3 px-5 py-3 ${i < user.ownedDomains.length - 1 ? 'border-b border-bn-line' : ''}`}>
                <div className="w-9 h-9 rounded-[10px] bg-bn-accent/8 border border-bn-accent/15 flex items-center justify-center text-base shrink-0">🌐</div>
                <div className="flex-1">
                  <p className="font-mono-bn text-[14px] font-medium text-bn-ink">{name}<span className="text-bn-accent">.btc</span></p>
                  <p className="font-mono-bn text-[11px] text-bn-ink-muted mt-0.5">{user.primaryName === `${name}.btc` ? 'Primary' : 'Owned'}</p>
                </div>
                {user.primaryName === `${name}.btc` && <span className="font-mono-bn text-[10px] bg-bn-accent/10 text-bn-accent px-2 py-0.5 rounded uppercase">Primary</span>}
              </div>
            ))
          )}
        </div>

        {/* Activity */}
        <div className="bg-white border border-bn-line rounded-xl overflow-hidden shadow-[0_1px_3px_rgba(10,10,10,0.05)]">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-bn-line">
            <span className="text-[13px] font-semibold text-bn-ink">Recent Activity</span>
            <Link href="/app/activity" className="text-[12px] text-bn-accent">View all →</Link>
          </div>
          {user.ownedDomains.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 px-5 text-center">
              <div className="text-3xl mb-3">📋</div>
              <p className="text-[13px] text-bn-ink-muted">No activity yet. Buy a name to get started.</p>
            </div>
          ) : MOCK_ACTIVITY.map((a, i) => (
            <div key={i} className={`flex items-center gap-3 px-5 py-3 ${i < 2 ? 'border-b border-bn-line' : ''}`}>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[13px] shrink-0 ${a.type === 'register' ? 'bg-bn-accent/8' : 'bg-green-50'}`}>
                {a.type === 'register' ? '₿' : '✎'}
              </div>
              <div className="flex-1">
                <p className="text-[13px] text-bn-ink">{a.type === 'register' ? 'Registered ' : 'Updated '}<strong>{a.name}</strong></p>
                <p className="font-mono-bn text-[11px] text-bn-ink-muted mt-0.5">{a.time}</p>
              </div>
              <span className="font-mono-bn text-[12px] text-bn-accent">{a.amount}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Trending */}
      <div className="bg-white border border-bn-line rounded-xl overflow-hidden shadow-[0_1px_3px_rgba(10,10,10,0.05)]">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-bn-line">
          <span className="text-[13px] font-semibold text-bn-ink">Trending on Marketplace</span>
          <Link href="/app/marketplace" className="text-[12px] text-bn-accent">Browse all →</Link>
        </div>
        {MOCK_MARKETPLACE.slice(0, 3).map((m, i) => (
          <div key={m.name} className={`flex items-center gap-3 px-5 py-3.5 ${i < 2 ? 'border-b border-bn-line' : ''}`}>
            <div className="w-9 h-9 rounded-[10px] bg-bn-accent/8 border border-bn-accent/15 flex items-center justify-center text-base shrink-0">◈</div>
            <div className="flex-1">
              <p className="font-mono-bn text-[14px] font-medium text-bn-ink">{m.name}<span className="text-bn-accent">.btc</span></p>
              <p className="font-mono-bn text-[11px] text-bn-ink-muted">{m.chars}-char</p>
            </div>
            <div className="text-right mr-3">
              <p className="font-mono-bn text-[13px] text-bn-ink">{m.price} BTC</p>
              <p className="font-mono-bn text-[11px] text-green-600">{m.change} (7d)</p>
            </div>
            <Link href="/app/marketplace" className="button button-primary text-[12px] px-4 py-2 rounded-full">Buy</Link>
          </div>
        ))}
      </div>

      {/* Add Funds Modal */}
      {addFundsModal && (
        <div className="fixed inset-0 dialog-overlay flex items-center justify-center z-50">
          <div className="dialog-content w-[420px] p-7">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-[18px] font-semibold">Add funds to wallet</h2>
              <button onClick={() => setAddFundsModal(false)} className="text-bn-ink-muted hover:text-bn-ink text-lg">✕</button>
            </div>
            {[
              { name: 'Stables', desc: 'Buy BTC with bank transfer or card via Stables', icon: '🏦' },
              { name: 'MoonPay', desc: 'Instant crypto purchase with debit or credit card', icon: '🌙' },
              { name: 'Send BTC', desc: 'Transfer from another wallet or exchange', icon: '₿' },
            ].map(opt => (
              <button key={opt.name} onClick={() => { setAddFundsModal(false); advanceOnboarding() }}
                className="w-full flex items-center gap-4 p-4 mb-2 border border-bn-line rounded-xl hover:border-bn-accent/30 hover:bg-bn-accent/5 transition-colors text-left">
                <span className="text-2xl">{opt.icon}</span>
                <div>
                  <div className="text-[14px] font-semibold text-bn-ink">{opt.name}</div>
                  <div className="text-[12px] text-bn-ink-muted">{opt.desc}</div>
                </div>
                <span className="ml-auto text-bn-ink-muted">→</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
