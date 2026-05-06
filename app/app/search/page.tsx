'use client'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { TAKEN_NAMES, getNamePrice, getNameType } from '@/lib/mock-data'

const mono = { fontFamily: 'var(--font-source-code-pro)' } as const

function SearchContent() {
  const params = useSearchParams()
  const [raw, setRaw]     = useState(params.get('q') || '')
  const [status, setStatus] = useState<'idle'|'checking'|'available'|'taken'>('idle')
  const [step, setStep]   = useState<1|2|3>(1)
  const [inFlow, setInFlow] = useState(false)
  const [records, setRecords] = useState({ wallet: 'bc1q9xj7fkn3d8r2p...mock', lightning: '', site: '', twitter: '' })

  const name = raw.toLowerCase().replace(/\.btc$/, '').trim()

  useEffect(() => { if (params.get('q')) setTimeout(check, 100) }, [])

  function check() {
    if (!name) return
    setStatus('checking'); setInFlow(false); setStep(1)
    setTimeout(() => setStatus(TAKEN_NAMES.includes(name) ? 'taken' : 'available'), 600)
  }

  const price = getNamePrice(name)
  const type  = getNameType(name)

  const RECORD_FIELDS = [
    { icon: '₿', label: 'Wallet',    key: 'wallet',    ph: 'bc1q...' },
    { icon: '⚡', label: 'Lightning', key: 'lightning', ph: 'yourname@lightning.node' },
    { icon: '🌐', label: 'Site',      key: 'site',      ph: 'ipfs://... or https://...' },
    { icon: '𝕏', label: 'Twitter',   key: 'twitter',   ph: '@handle' },
  ]

  return (
    <div className="p-7 max-w-[680px]">
      <h1 className="text-[28px] font-semibold tracking-[-0.04em] text-bn-text text-center mb-6">
        Find your name on <span className="text-bn-accent">Bitcoin</span>.
      </h1>

      {/* Search bar */}
      <div className="flex items-center bg-bn-surface border border-bn-border rounded-2xl px-5 py-2 gap-3 focus-within:border-bn-accent/40 transition-colors mb-4">
        <input value={raw} onChange={e => { setRaw(e.target.value); setStatus('idle'); setInFlow(false) }}
          onKeyDown={e => e.key === 'Enter' && check()}
          placeholder="yourname" autoFocus
          className="flex-1 bg-transparent border-none outline-none text-[18px] text-bn-text placeholder-bn-text-dim"
          style={mono} />
        <span className="text-bn-accent text-[16px]" style={mono}>.btc</span>
        <button onClick={check} className="button button-primary text-[14px] px-6 py-2.5 rounded-xl">Search →</button>
      </div>

      {status === 'checking' && <p className="text-[13px] text-bn-text-muted mb-4" style={mono}>⏳ Checking on Bitcoin...</p>}

      {status === 'available' && !inFlow && (
        <div className="bg-bn-surface border border-positive-green/30 rounded-2xl p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[22px] font-semibold text-bn-text tracking-[-0.03em]" style={mono}>{name}<span className="text-bn-accent">.btc</span></span>
            <span className="bg-positive-green/10 text-positive-green px-3 py-1 rounded-lg text-[12px] font-semibold" style={mono}>✓ Available</span>
          </div>
          <div className="grid grid-cols-3 gap-2.5 mb-4">
            {[['Price', price], ['Length', `${name.length} chars`], ['Type', type]].map(([l, v]) => (
              <div key={l} className="bg-bn-bg rounded-xl px-3.5 py-3">
                <p className="text-[10px] text-bn-text-dim uppercase tracking-[0.08em] mb-1" style={mono}>{l}</p>
                <p className="text-[15px] font-semibold text-bn-text">{v}</p>
              </div>
            ))}
          </div>
          <div className="flex gap-2.5">
            <button onClick={() => setInFlow(true)} className="button button-primary flex-1 text-[15px] py-3.5 rounded-xl">Buy {name}.btc →</button>
            <button className="button button-secondary text-[13px] px-4 py-3.5 rounded-xl">+ Watchlist</button>
          </div>
        </div>
      )}

      {status === 'taken' && (
        <div className="bg-bn-surface border border-negative-red/20 rounded-2xl p-4 flex items-center justify-between mb-4">
          <span style={mono} className="text-[15px]">{name}<span className="text-bn-accent">.btc</span> <span className="text-bn-text-muted text-[13px]">is taken</span></span>
          <button className="button button-secondary text-[13px] px-4 py-2 rounded-xl">View on Marketplace →</button>
        </div>
      )}

      {/* Buy flow */}
      {inFlow && status === 'available' && (
        <div>
          {/* Stepper */}
          <div className="flex items-center mb-7">
            {([1,2,3] as const).map((s, i) => (
              <div key={s} className="flex items-center flex-1">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-semibold shrink-0 ${step > s ? 'bg-positive-green text-bn-bg' : step === s ? 'bg-bn-accent text-bn-bg' : 'bg-bn-surface border border-bn-border text-bn-text-dim'}`}>
                  {step > s ? '✓' : s}
                </div>
                <span className={`ml-2 text-[12px] whitespace-nowrap ${step === s ? 'text-bn-text' : 'text-bn-text-dim'}`}>
                  {['Confirm','Set Records','Complete'][s-1]}
                </span>
                {i < 2 && <div className={`flex-1 h-px mx-2 ${step > s ? 'bg-positive-green' : 'bg-bn-border'}`} />}
              </div>
            ))}
          </div>

          {step === 1 && (
            <div>
              <div className="bg-bn-surface border border-bn-border rounded-2xl p-5 mb-3">
                <h2 className="text-[16px] font-semibold mb-1 text-bn-text">Confirm registration</h2>
                <p className="text-[14px] text-bn-text-muted" style={mono}>{name}.btc</p>
              </div>
              <div className="bg-bn-surface border border-bn-border rounded-2xl p-5 mb-4">
                {[['Name',`${name}.btc`,'text-bn-accent'],['Registration fee',price,'text-bn-text'],['Network fee','~0.00012 BTC','text-bn-text'],['Protocol','Orobit SCL · Bitcoin L1','text-bn-text'],['Total',price,'text-bn-accent font-semibold']].map(([l,v,cls]) => (
                  <div key={l} className="flex justify-between py-2.5 border-b border-bn-border last:border-0 text-[14px]">
                    <span className="text-bn-text-muted">{l}</span>
                    <span className={`${cls}`} style={mono}>{v}</span>
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
              <div className="bg-bn-surface border border-bn-border rounded-2xl p-5 mb-3">
                <h2 className="text-[16px] font-semibold mb-1 text-bn-text">Set your records</h2>
                <p className="text-[14px] text-bn-text-muted">Map your name to what it resolves to. Update any time.</p>
              </div>
              <div className="bg-bn-surface border border-bn-border rounded-2xl overflow-hidden mb-4">
                {RECORD_FIELDS.map(f => (
                  <div key={f.key} className="flex items-center border-b border-bn-border last:border-0">
                    <div className="w-11 h-11 flex items-center justify-center text-base border-r border-bn-border shrink-0">{f.icon}</div>
                    <div className="w-20 px-3 text-[10px] text-bn-text-dim uppercase tracking-[0.06em] border-r border-bn-border shrink-0" style={mono}>{f.label}</div>
                    <input value={(records as any)[f.key]} onChange={e => setRecords(r => ({...r,[f.key]:e.target.value}))}
                      placeholder={f.ph}
                      className="flex-1 px-3 py-2.5 bg-transparent border-none outline-none text-[12px] text-bn-text placeholder-bn-text-dim"
                      style={mono} />
                    <div className={`px-3 text-[13px] ${(records as any)[f.key] ? 'text-positive-green' : 'text-bn-border-light'}`}>
                      {(records as any)[f.key] ? '✓' : '○'}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-2.5">
                <button onClick={() => setStep(3)} className="button button-secondary px-5 py-3 rounded-xl text-[13px]">Skip for now</button>
                <button onClick={() => setStep(3)} className="button button-primary flex-1 py-3.5 rounded-xl text-[15px]">Save & Register →</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-full bg-positive-green/10 border-2 border-positive-green flex items-center justify-center text-3xl mx-auto mb-5">✓</div>
              <h2 className="text-[26px] font-semibold tracking-[-0.04em] mb-2 text-bn-text">Registered on <span className="text-positive-green">Bitcoin</span>.</h2>
              <p className="text-[15px] text-bn-text-muted max-w-[340px] mx-auto mb-6 leading-relaxed">Your name is minted on Bitcoin L1 via the Orobit protocol. Settled, quantum-secure, forever yours.</p>
              <div className="inline-block bg-bn-surface border border-positive-green/40 rounded-2xl px-7 py-5 mb-6">
                <p className="text-[24px] font-semibold tracking-[-0.04em] text-bn-text mb-1" style={mono}>{name}<span className="text-bn-accent">.btc</span></p>
                <p className="text-[11px] text-bn-text-dim" style={mono}>Block #874,291 · Taproot + NIST PQC · Owned by you</p>
              </div>
              <div className="flex gap-3 justify-center">
                <a href="/app/my-names" className="button button-secondary px-6 py-3 rounded-xl text-[13px]">View My Names</a>
                <a href="/app/identity" className="button button-primary px-6 py-3 rounded-xl text-[13px]">Set Up Identity →</a>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function SearchPage() {
  return <Suspense><SearchContent /></Suspense>
}
