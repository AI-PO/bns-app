'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { TAKEN_NAMES, getNamePrice, getNameType } from '@/lib/mock-data'
import { useAuth } from '@/lib/auth'

type State = 'idle' | 'checking' | 'available' | 'taken'
type Step  = 1 | 2 | 3

export default function SearchPage() {
  const { user } = useAuth()
  const params = useSearchParams()
  const [raw,    setRaw]    = useState(params.get('q') || '')
  const [state,  setState]  = useState<State>('idle')
  const [step,   setStep]   = useState<Step>(1)
  const [inFlow, setInFlow] = useState(false)
  const [records, setRecords] = useState({ wallet: user?.address || '', lightning: '', site: '', twitter: '' })

  const name = raw.toLowerCase().replace(/\.btc$/, '').trim()

  useEffect(() => {
    if (params.get('q')) { setTimeout(check, 100) }
  }, [])

  function check() {
    if (!name) return
    setState('checking')
    setTimeout(() => setState(TAKEN_NAMES.includes(name) ? 'taken' : 'available'), 600)
    setInFlow(false)
    setStep(1)
  }

  function startBuy() { setInFlow(true); setStep(1) }
  function cancelBuy() { setInFlow(false) }
  function goStep2() { setStep(2) }
  function goStep3() { setStep(3) }

  const price = getNamePrice(name)
  const type  = getNameType(name)

  return (
    <div style={page}>
      {/* Search bar */}
      <div style={{ maxWidth: 600, margin: '0 auto', paddingBottom: 40 }}>
        <h1 style={{ ...title, textAlign: 'center', marginBottom: 24 }}>
          Find your name on <span style={{ color: '#f7931a' }}>Bitcoin</span>.
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', background: '#161614', border: '1px solid #2e2e2a', borderRadius: 14, padding: '8px 8px 8px 18px', gap: 10 }}>
          <input
            value={raw}
            onChange={e => { setRaw(e.target.value); setState('idle'); setInFlow(false) }}
            onKeyDown={e => e.key === 'Enter' && check()}
            placeholder="yourname"
            style={{ flex: 1, background: 'none', border: 'none', outline: 'none', fontFamily: 'monospace', fontSize: 18, color: '#f0ede6' }}
            autoFocus
          />
          <span style={{ fontFamily: 'monospace', fontSize: 16, color: '#f7931a' }}>.btc</span>
          <button onClick={check} style={{ padding: '11px 22px', background: '#f7931a', color: '#0a0a08', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
            Search →
          </button>
        </div>

        {/* Result */}
        {state === 'checking' && <p style={{ marginTop: 12, fontFamily: 'monospace', fontSize: 13, color: '#8a8778' }}>⏳ Checking on Bitcoin...</p>}

        {state === 'available' && !inFlow && (
          <div style={{ marginTop: 14, padding: 20, background: '#161614', border: '1px solid rgba(76,175,125,0.3)', borderRadius: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <span style={{ fontSize: 22, fontWeight: 800, color: '#f0ede6' }}>{name}<span style={{ color: '#f7931a' }}>.btc</span></span>
              <span style={{ background: 'rgba(76,175,125,0.1)', color: '#4caf7d', padding: '5px 12px', borderRadius: 8, fontFamily: 'monospace', fontSize: 12, fontWeight: 600 }}>✓ Available</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 16 }}>
              {[['Price', price], ['Length', `${name.length} chars`], ['Type', type]].map(([l, v]) => (
                <div key={l} style={{ padding: '12px 14px', background: '#0a0a08', borderRadius: 9 }}>
                  <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#5a5850', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 5 }}>{l}</div>
                  <div style={{ fontSize: 15, fontWeight: 700 }}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={startBuy} style={{ flex: 1, padding: 13, background: '#f7931a', color: '#0a0a08', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>
                Buy {name}.btc →
              </button>
              <button style={{ padding: '13px 18px', background: 'transparent', border: '1px solid #232320', borderRadius: 10, color: '#8a8778', cursor: 'pointer', fontSize: 13 }}>
                + Watchlist
              </button>
            </div>
          </div>
        )}

        {state === 'taken' && (
          <div style={{ marginTop: 14, padding: 18, background: '#161614', border: '1px solid rgba(224,90,58,0.2)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontFamily: 'monospace', fontSize: 15 }}>{name}<span style={{ color: '#f7931a' }}>.btc</span> <span style={{ color: '#8a8778', fontSize: 13 }}>is taken</span></span>
            <button style={{ padding: '7px 14px', background: '#161614', border: '1px solid #2e2e2a', borderRadius: 8, color: '#f7931a', cursor: 'pointer', fontSize: 13 }}>
              View on Marketplace →
            </button>
          </div>
        )}
      </div>

      {/* ── Buy flow ── */}
      {inFlow && state === 'available' && (
        <div style={{ maxWidth: 520, margin: '0 auto' }}>
          {/* Stepper */}
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 28 }}>
            {([1,2,3] as Step[]).map((s, i) => (
              <div key={s} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0,
                  background: step > s ? '#4caf7d' : step === s ? '#f7931a' : '#161614',
                  color: step >= s ? '#0a0a08' : '#5a5850',
                  border: step < s ? '1px solid #2e2e2a' : 'none',
                }}>
                  {step > s ? '✓' : s}
                </div>
                <span style={{ marginLeft: 8, fontSize: 12, color: step === s ? '#f0ede6' : '#5a5850', whiteSpace: 'nowrap' }}>
                  {['Confirm', 'Set Records', 'Complete'][s - 1]}
                </span>
                {i < 2 && <div style={{ flex: 1, height: 1, background: step > s ? '#4caf7d' : '#2e2e2a', margin: '0 8px' }} />}
              </div>
            ))}
          </div>

          {/* Step 1 */}
          {step === 1 && (
            <div>
              <div style={flowCard}>
                <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>Confirm registration</h2>
                <p style={{ fontSize: 14, color: '#8a8778' }}>{name}.btc</p>
              </div>
              <div style={{ ...flowCard, display: 'flex', flexDirection: 'column', gap: 0 }}>
                {[
                  ['Name', `${name}.btc`, '#f7931a'],
                  ['Registration fee', price, '#f0ede6'],
                  ['Network fee (est.)', '~0.00012 BTC', '#f0ede6'],
                  ['Protocol', 'Orobit SCL · Bitcoin L1', '#f0ede6'],
                  ['Total', price, '#f7931a'],
                ].map(([l, v, c]) => (
                  <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '11px 0', borderBottom: l === 'Total' ? 'none' : '1px solid #232320' }}>
                    <span style={{ color: '#8a8778', fontSize: 14 }}>{l}</span>
                    <span style={{ fontFamily: 'monospace', fontSize: 13, color: c }}>{v}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={cancelBuy} style={btnGhost}>Cancel</button>
                <button onClick={goStep2} style={{ ...btnAccent, flex: 1 }}>Confirm & Continue →</button>
              </div>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div>
              <div style={flowCard}>
                <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>Set your records</h2>
                <p style={{ fontSize: 14, color: '#8a8778' }}>Map your name to what it resolves to. You can update these any time.</p>
              </div>
              <div style={flowCard}>
                {[
                  { icon: '₿', label: 'Wallet', key: 'wallet', ph: 'bc1q...' },
                  { icon: '⚡', label: 'Lightning', key: 'lightning', ph: 'yourname@lightning.node' },
                  { icon: '🌐', label: 'Site', key: 'site', ph: 'ipfs://... or https://...' },
                  { icon: '𝕏', label: 'Twitter', key: 'twitter', ph: '@handle' },
                ].map(f => (
                  <div key={f.key} style={{ display: 'flex', alignItems: 'center', background: '#0a0a08', border: '1px solid #232320', borderRadius: 9, overflow: 'hidden', marginBottom: 8 }}>
                    <div style={{ width: 42, height: 42, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, borderRight: '1px solid #232320', flexShrink: 0 }}>{f.icon}</div>
                    <div style={{ width: 76, padding: '0 10px', fontFamily: 'monospace', fontSize: 10, color: '#5a5850', textTransform: 'uppercase', letterSpacing: '0.06em', borderRight: '1px solid #232320', flexShrink: 0 }}>{f.label}</div>
                    <input
                      value={records[f.key as keyof typeof records]}
                      onChange={e => setRecords(r => ({ ...r, [f.key]: e.target.value }))}
                      placeholder={f.ph}
                      style={{ flex: 1, padding: '11px 12px', background: 'none', border: 'none', outline: 'none', fontFamily: 'monospace', fontSize: 12, color: '#f0ede6' }}
                    />
                    <div style={{ padding: '0 12px', fontSize: 13, color: records[f.key as keyof typeof records] ? '#4caf7d' : '#3a3a38', flexShrink: 0 }}>
                      {records[f.key as keyof typeof records] ? '✓' : '○'}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={goStep3} style={btnGhost}>Skip for now</button>
                <button onClick={goStep3} style={{ ...btnAccent, flex: 1 }}>Save & Register →</button>
              </div>
            </div>
          )}

          {/* Step 3 — Success */}
          {step === 3 && (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ width: 68, height: 68, borderRadius: '50%', background: 'rgba(76,175,125,0.1)', border: '2px solid #4caf7d', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, margin: '0 auto 20px', animation: 'none' }}>✓</div>
              <h2 style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.04em', marginBottom: 10 }}>Registered on <span style={{ color: '#4caf7d' }}>Bitcoin</span>.</h2>
              <p style={{ fontSize: 15, color: '#8a8778', maxWidth: 360, margin: '0 auto 24px', lineHeight: 1.6 }}>Your name is now minted on Bitcoin L1 via the Orobit protocol. Settled, quantum-secure, forever yours.</p>
              <div style={{ padding: 22, background: '#161614', border: '1px solid #4caf7d', borderRadius: 14, maxWidth: 340, margin: '0 auto 24px', display: 'inline-block' }}>
                <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.04em', marginBottom: 6 }}>{name}<span style={{ color: '#f7931a' }}>.btc</span></div>
                <div style={{ fontFamily: 'monospace', fontSize: 11, color: '#5a5850' }}>Block #874,291 · Taproot + NIST PQC · Owned by you</div>
              </div>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                <a href="/app/my-names" style={btnGhost}>View My Names</a>
                <a href="/app/identity" style={btnAccent}>Set Up Identity →</a>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

const page: React.CSSProperties = { padding: 28, color: '#f0ede6' }
const title: React.CSSProperties = { fontSize: 28, fontWeight: 800, letterSpacing: '-0.04em' }
const flowCard: React.CSSProperties = { background: '#161614', border: '1px solid #2e2e2a', borderRadius: 14, padding: 24, marginBottom: 14 }
const btnAccent: React.CSSProperties = { padding: '13px 22px', background: '#f7931a', color: '#0a0a08', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 14, cursor: 'pointer', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }
const btnGhost: React.CSSProperties = { padding: '13px 18px', background: 'transparent', border: '1px solid #2e2e2a', borderRadius: 10, color: '#8a8778', cursor: 'pointer', fontSize: 13, textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }
