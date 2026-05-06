'use client'

import { useState } from 'react'
import { MOCK_MARKETPLACE } from '@/lib/mock-data'

type Filter = 'all' | '4char' | '5char' | 'premium' | 'new'

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all',     label: 'All names' },
  { id: '4char',   label: '4-char' },
  { id: '5char',   label: '5-char' },
  { id: 'premium', label: 'Premium' },
  { id: 'new',     label: 'New listings' },
]

type BuyState = { name: string; price: number } | null

export default function MarketplacePage() {
  const [filter, setFilter] = useState<Filter>('all')
  const [buying, setBuying] = useState<BuyState>(null)
  const [bought, setBought] = useState<string[]>([])
  const [toast,  setToast]  = useState('')

  const filtered = MOCK_MARKETPLACE.filter(m => {
    if (filter === '4char')   return m.chars === 4
    if (filter === '5char')   return m.chars === 5
    if (filter === 'premium') return m.category === 'premium' || m.chars <= 4
    if (filter === 'new')     return m.category === 'new'
    return true
  })

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  const confirmBuy = () => {
    if (!buying) return
    setBought(b => [...b, buying.name])
    setBuying(null)
    showToast(`${buying.name}.btc purchased successfully!`)
  }

  return (
    <div style={page}>
      <div style={hdr}>
        <div>
          <h1 style={titleStyle}>Marketplace</h1>
          <p style={sub}>Browse, buy, and bid on premium .btc names.</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button style={btnGhost}>Sort: Price ↓</button>
          <button style={btnGhost}>Filter</button>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {FILTERS.map(f => (
          <button key={f.id} onClick={() => setFilter(f.id)} style={{
            padding: '7px 16px',
            background: filter === f.id ? 'rgba(247,147,26,0.12)' : '#161614',
            border: `1px solid ${filter === f.id ? '#f7931a' : '#232320'}`,
            borderRadius: 8, fontFamily: 'monospace', fontSize: 12,
            color: filter === f.id ? '#f7931a' : '#8a8778',
            cursor: 'pointer',
          }}>{f.label}</button>
        ))}
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
        {filtered.map(m => (
          <div key={m.name} style={{
            padding: 20, background: '#111110',
            border: `1px solid ${bought.includes(m.name) ? '#4caf7d' : '#232320'}`,
            borderRadius: 12, transition: 'border-color 0.2s',
          }}>
            <div style={{ fontFamily: 'monospace', fontSize: 16, fontWeight: 500, marginBottom: 3 }}>
              {m.name}<span style={{ color: '#f7931a' }}>.btc</span>
              {bought.includes(m.name) && <span style={{ marginLeft: 8, fontSize: 10, color: '#4caf7d', background: 'rgba(76,175,125,0.1)', padding: '2px 6px', borderRadius: 4 }}>OWNED</span>}
            </div>
            <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#5a5850', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 16 }}>
              {m.chars} chars · Orobit SCL
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 14, borderTop: '1px solid #232320' }}>
              <div>
                <div style={{ fontWeight: 800, fontSize: 16, letterSpacing: '-0.03em' }}>{m.price} BTC</div>
                <div style={{ fontFamily: 'monospace', fontSize: 11, color: '#4caf7d' }}>{m.change} (7d)</div>
              </div>
              {bought.includes(m.name)
                ? <span style={{ fontSize: 12, color: '#4caf7d' }}>✓ Yours</span>
                : <button onClick={() => setBuying({ name: m.name, price: m.price })} style={btnAccent}>Buy</button>
              }
            </div>
          </div>
        ))}
      </div>

      {/* Buy modal */}
      {buying && (
        <div style={overlay}>
          <div style={modal}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
              <h2 style={{ fontSize: 18, fontWeight: 800 }}>Buy <span style={{ color: '#f7931a' }}>{buying.name}</span>.btc</h2>
              <button onClick={() => setBuying(null)} style={{ background: 'none', border: 'none', color: '#8a8778', cursor: 'pointer', fontSize: 18 }}>✕</button>
            </div>
            {[
              ['Listing price',    `${buying.price} BTC`],
              ['Platform fee (2.5%)', `${(buying.price * 0.025).toFixed(5)} BTC`],
              ['Network fee (est.)', '~0.00012 BTC'],
            ].map(([l, v]) => (
              <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '11px 0', borderBottom: '1px solid #232320', fontSize: 14 }}>
                <span style={{ color: '#8a8778' }}>{l}</span>
                <span style={{ fontFamily: 'monospace', fontSize: 13 }}>{v}</span>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '13px 0', fontSize: 14 }}>
              <span style={{ fontWeight: 600 }}>Total</span>
              <span style={{ fontFamily: 'monospace', fontSize: 15, fontWeight: 700, color: '#f7931a' }}>
                {(buying.price * 1.025 + 0.00012).toFixed(5)} BTC
              </span>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
              <button onClick={() => setBuying(null)} style={{ ...btnGhost, flex: 1 }}>Cancel</button>
              <button onClick={confirmBuy} style={{ ...btnAccent, flex: 1, justifyContent: 'center' }}>Confirm Purchase</button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', bottom: 24, right: 24, padding: '12px 20px', background: '#161614', border: '1px solid rgba(76,175,125,0.3)', borderRadius: 10, fontSize: 13, color: '#f0ede6', display: 'flex', alignItems: 'center', gap: 8, zIndex: 200 }}>
          <span style={{ color: '#4caf7d' }}>✓</span> {toast}
        </div>
      )}
    </div>
  )
}

const page: React.CSSProperties = { padding: 28, color: '#f0ede6' }
const hdr: React.CSSProperties  = { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }
const titleStyle: React.CSSProperties = { fontSize: 22, fontWeight: 700, letterSpacing: '-0.03em' }
const sub: React.CSSProperties  = { fontSize: 14, color: '#8a8778', marginTop: 4 }
const btnAccent: React.CSSProperties = { padding: '8px 18px', background: '#f7931a', color: '#0a0a08', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }
const btnGhost: React.CSSProperties  = { padding: '8px 14px', background: 'transparent', border: '1px solid #232320', borderRadius: 8, color: '#8a8778', cursor: 'pointer', fontSize: 13 }
const overlay: React.CSSProperties   = { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }
const modal: React.CSSProperties     = { width: 460, background: '#161614', border: '1px solid #2e2e2a', borderRadius: 18, padding: 28, color: '#f0ede6' }
