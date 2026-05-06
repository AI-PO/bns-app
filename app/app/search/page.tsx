'use client'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { TAKEN_NAMES, getNamePrice, getNameType } from '@/lib/mock-data'
import { useAuth } from '@/lib/auth'

function SearchContent() {
  const params = useSearchParams()
  const { addDomain, advanceOnboarding, user } = useAuth()
  const [raw, setRaw] = useState(params.get('q') || '')
  const [status, setStatus] = useState<'idle'|'checking'|'available'|'taken'>('idle')
  const [step, setStep] = useState<1|2|3>(1)
  const [inFlow, setInFlow] = useState(false)
  const name = raw.toLowerCase().replace(/\.btc$/, '').trim()

  useEffect(() => { if (params.get('q')) setTimeout(check, 100) }, [])

  function check() {
    if (!name) return
    setStatus('checking'); setInFlow(false); setStep(1)
    setTimeout(() => setStatus(TAKEN_NAMES.includes(name) ? 'taken' : 'available'), 600)
  }

  const price = getNamePrice(name)
  const type  = getNameType(name)

  const completePurchase = () => {
    addDomain(name)
    // Advance onboarding if on step 1 (buy first domain) or 3 (buy second domain)
    if (user?.onboardingStep === 1 || user?.onboardingStep === 3) advanceOnboarding()
    setStep(3)
  }

  return (
    /* Fix 8: Centered with max-width */
    <div className="min-h-full flex flex-col items-center justify-start pt-12 px-5 pb-12">
      <div className="w-full max-w-[560px]">
        <h1 className="text-[28px] font-medium tracking-[-0.04em] text-bn-ink text-center mb-8">
          Buy domain on <span className="text-bn-accent">Bitcoin</span>.
        </h1>

        {/* Search bar */}
        <div className="flex items-stretch rounded-2xl border border-bn-line-2 bg-white overflow-hidden shadow-[0_1px_2px_rgba(10,10,10,0.04),0_12px_36px_-16px_rgba(10,10,10,0.18)] focus-within:border-bn-ink/30 focus-within:ring-4 focus-within:ring-bn-ink/5 transition-all mb-4">
          <input value={raw} onChange={e => { setRaw(e.target.value); setStatus('idle'); setInFlow(false) }}
            onKeyDown={e => e.key === 'Enter' && check()}
            placeholder="yourname" autoFocus
            className="flex-1 px-5 py-4 bg-transparent border-none outline-none font-mono-bn text-[18px] text-bn-ink placeholder-bn-ink-dim" />
          <span className="font-mono-bn text-[14px] text-bn-ink-muted flex items-center pr-3">.btc</span>
          <button onClick={check} className="button button-primary text-[14px] px-6 m-1.5 rounded-xl">Search →</button>
        </div>

        {status === 'checking' && <p className="font-mono-bn text-[13px] text-bn-ink-muted mb-4 text-center">Checking on Bitcoin...</p>}

        {status === 'available' && !inFlow && (
          <div className="bg-white border border-green-200 rounded-2xl p-5 mb-5 shadow-[0_1px_3px_rgba(10,10,10,0.05)]">
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono-bn text-[20px] font-medium text-bn-ink">{name}<span className="text-bn-accent">.btc</span></span>
              <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full font-mono-bn text-[11px] font-medium">✓ Available</span>
            </div>
            <div className="grid grid-cols-3 gap-2.5 mb-4">
              {[['Price', price], ['Length', `${name.length} chars`], ['Type', type]].map(([l, v]) => (
                <div key={l} className="bg-bn-page-2 rounded-xl px-3.5 py-3 border border-bn-line">
                  <p className="font-mono-bn text-[10px] text-bn-ink-muted uppercase tracking-[0.08em] mb-1">{l}</p>
                  <p className="text-[15px] font-semibold text-bn-ink">{v}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-2.5">
              <button onClick={() => setInFlow(true)} className="button button-primary flex-1 py-3.5 rounded-xl text-[15px]">Buy {name}.btc →</button>
              <button className="button button-secondary text-[13px] px-4 py-3.5 rounded-xl">+ Watchlist</button>
            </div>
          </div>
        )}

        {status === 'taken' && (
          <div className="bg-white border border-bn-line-2 rounded-2xl p-4 flex items-center justify-between mb-4 shadow-[0_1px_3px_rgba(10,10,10,0.05)]">
            <span className="font-mono-bn text-[15px]">{name}<span className="text-bn-accent">.btc</span> <span className="text-bn-ink-muted text-[13px]">is taken</span></span>
            <Link href="/app/marketplace" className="button button-secondary text-[13px] px-4 py-2 rounded-xl">View on Marketplace →</Link>
          </div>
        )}

        {/* Buy flow */}
        {inFlow && status === 'available' && (
          <div>
            <div className="flex items-center mb-7">
              {([1, 2, 3] as const).map((s, i) => (
                <div key={s} className="flex items-center flex-1">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center font-mono-bn text-[12px] font-semibold shrink-0 ${step > s ? 'bg-green-500 text-white' : step === s ? 'bg-bn-accent text-white' : 'bg-bn-page-2 border border-bn-line text-bn-ink-muted'}`}>
                    {step > s ? '✓' : s}
                  </div>
                  <span className={`ml-2 text-[12px] whitespace-nowrap ${step === s ? 'text-bn-ink' : 'text-bn-ink-muted'}`}>
                    {['Confirm', 'Set Records', 'Complete'][s - 1]}
                  </span>
                  {i < 2 && <div className={`flex-1 h-px mx-2 ${step > s ? 'bg-green-400' : 'bg-bn-line-2'}`} />}
                </div>
              ))}
            </div>

            {step === 1 && (
              <div>
                <div className="bg-white border border-bn-line rounded-2xl p-5 mb-3 shadow-[0_1px_3px_rgba(10,10,10,0.05)]">
                  <h2 className="text-[16px] font-semibold mb-1">Confirm registration</h2>
                  <p className="font-mono-bn text-[14px] text-bn-ink-muted">{name}.btc</p>
                </div>
                <div className="bg-white border border-bn-line rounded-2xl p-5 mb-4 shadow-[0_1px_3px_rgba(10,10,10,0.05)]">
                  {[['Name', `${name}.btc`, 'text-bn-accent'], ['Registration fee', price, 'text-bn-ink'], ['Network fee', '~0.00012 BTC', 'text-bn-ink'], ['Protocol', 'Orobit SCL · Bitcoin L1', 'text-bn-ink'], ['Total', price, 'text-bn-accent font-semibold']].map(([l, v, cls]) => (
                    <div key={l} className="flex justify-between py-2.5 border-b border-bn-line last:border-0 text-[14px]">
                      <span className="text-bn-ink-muted">{l}</span>
                      <span className={`font-mono-bn text-[13px] ${cls}`}>{v}</span>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2.5">
                  <button onClick={() => setInFlow(false)} className="button button-secondary px-5 py-3 rounded-xl text-[13px]">Cancel</button>
                  <button onClick={() => setStep(2)} className="button button-primary flex-1 py-3.5 rounded-xl text-[15px]">Confirm & Continue →</button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <div className="bg-white border border-bn-line rounded-2xl p-5 mb-3 shadow-[0_1px_3px_rgba(10,10,10,0.05)]">
                  <h2 className="text-[16px] font-semibold mb-1">Set your records</h2>
                  <p className="text-[14px] text-bn-ink-muted">Map your name to your wallet and other identities. You can update these any time.</p>
                </div>
                <div className="bg-white border border-bn-line rounded-2xl overflow-hidden mb-4 shadow-[0_1px_3px_rgba(10,10,10,0.05)]">
                  {[
                    { icon: '₿', label: 'Wallet', ph: 'bc1q...', val: user?.address ?? '' },
                    { icon: '⚡', label: 'Lightning', ph: `${name}@lightning.node`, val: '' },
                    { icon: '🌐', label: 'Site', ph: 'ipfs://...', val: '' },
                  ].map(f => (
                    <div key={f.label} className="flex items-center border-b border-bn-line last:border-0">
                      <div className="w-11 h-11 flex items-center justify-center text-base border-r border-bn-line shrink-0">{f.icon}</div>
                      <div className="w-20 px-3 font-mono-bn text-[10px] text-bn-ink-muted uppercase tracking-[0.06em] border-r border-bn-line shrink-0">{f.label}</div>
                      <input defaultValue={f.val} placeholder={f.ph}
                        className="flex-1 px-3 py-2.5 bg-transparent border-none outline-none font-mono-bn text-[12px] text-bn-ink placeholder-bn-ink-dim" />
                    </div>
                  ))}
                </div>
                <div className="flex gap-2.5">
                  <button onClick={completePurchase} className="button button-secondary px-5 py-3 rounded-xl text-[13px]">Skip for now</button>
                  <button onClick={completePurchase} className="button button-primary flex-1 py-3.5 rounded-xl text-[15px]">Save & Register →</button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="text-center py-6">
                <div className="w-16 h-16 rounded-full bg-green-50 border-2 border-green-400 flex items-center justify-center text-3xl mx-auto mb-5">✓</div>
                <h2 className="text-[26px] font-medium tracking-[-0.04em] mb-2">Registered on <span className="text-green-600">Bitcoin</span>.</h2>
                <p className="text-[15px] text-bn-ink-muted max-w-[340px] mx-auto mb-6 leading-relaxed">Your name is minted on Bitcoin L1 via the Orobit protocol. Settled, quantum-secure, forever yours.</p>
                <div className="inline-block bg-white border border-green-200 rounded-2xl px-7 py-5 mb-6 shadow-[0_1px_3px_rgba(10,10,10,0.05)]">
                  <p className="font-mono-bn text-[22px] font-medium text-bn-ink mb-1">{name}<span className="text-bn-accent">.btc</span></p>
                  <p className="font-mono-bn text-[11px] text-bn-ink-muted">Block #874,291 · Taproot + NIST PQC · Owned by you</p>
                </div>
                <div className="flex gap-3 justify-center">
                  <Link href="/app/my-names" className="button button-secondary px-6 py-3 rounded-xl text-[13px]">View My Names</Link>
                  <Link href="/app/identity" className="button button-primary px-6 py-3 rounded-xl text-[13px]">Set Up Identity →</Link>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default function SearchPage() {
  return <Suspense><SearchContent /></Suspense>
}
