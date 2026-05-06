'use client'
import { useState } from 'react'
import { MOCK_MARKETPLACE } from '@/lib/mock-data'

type Filter = 'all'|'4char'|'5char'|'premium'|'new'
const mono = { fontFamily: 'var(--font-source-code-pro)' } as const
const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'All names' }, { id: '4char', label: '4-char' },
  { id: '5char', label: '5-char' }, { id: 'premium', label: 'Premium' }, { id: 'new', label: 'New listings' },
]

export default function MarketplacePage() {
  const [filter, setFilter] = useState<Filter>('all')
  const [buying, setBuying] = useState<{ name: string; price: number } | null>(null)
  const [bought, setBought] = useState<string[]>([])
  const [toast, setToast] = useState('')

  const filtered = MOCK_MARKETPLACE.filter(m => {
    if (filter === '4char') return m.chars === 4
    if (filter === '5char') return m.chars === 5
    if (filter === 'premium') return m.category === 'premium' || m.chars <= 4
    if (filter === 'new') return m.category === 'new'
    return true
  })

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000) }
  const confirmBuy = () => { if (!buying) return; setBought(b => [...b, buying.name]); showToast(`${buying.name}.btc purchased!`); setBuying(null) }

  return (
    <div className="p-7">
      <div className="flex items-start justify-between mb-5 flex-wrap gap-3">
        <div>
          <h1 className="text-[22px] font-semibold tracking-[-0.03em] text-bn-text">Marketplace</h1>
          <p className="text-[14px] text-bn-text-muted mt-1">Browse, buy, and bid on premium .btc names.</p>
        </div>
        <div className="flex gap-2">
          <button className="button button-secondary text-[13px] px-4 py-2 rounded-full">Sort: Price ↓</button>
          <button className="button button-secondary text-[13px] px-4 py-2 rounded-full">Filter</button>
        </div>
      </div>

      <div className="flex gap-2 mb-5 flex-wrap">
        {FILTERS.map(f => (
          <button key={f.id} onClick={() => setFilter(f.id)}
            className={`px-4 py-1.5 rounded-full text-[12px] border transition-colors ${filter === f.id ? 'bg-bn-accent/10 border-bn-accent/30 text-bn-accent' : 'bg-bn-surface border-bn-border text-bn-text-muted hover:border-bn-border-mid'}`}
            style={mono}>
            {f.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-3">
        {filtered.map(m => (
          <div key={m.name} className={`bg-bn-surface border rounded-xl p-5 transition-colors ${bought.includes(m.name) ? 'border-positive-green/30' : 'border-bn-border hover:border-bn-border-mid'}`}>
            <p className="text-[16px] font-medium text-bn-text mb-0.5" style={mono}>{m.name}<span className="text-bn-accent">.btc</span>
              {bought.includes(m.name) && <span className="ml-2 text-[10px] bg-positive-green/10 text-positive-green px-1.5 py-0.5 rounded" style={mono}>OWNED</span>}
            </p>
            <p className="text-[10px] text-bn-text-dim uppercase tracking-[0.06em] mb-4" style={mono}>{m.chars} chars · Orobit SCL</p>
            <div className="flex items-center justify-between pt-3.5 border-t border-bn-border">
              <div>
                <p className="text-[16px] font-semibold tracking-[-0.03em] text-bn-text">{m.price} BTC</p>
                <p className="text-[11px] text-positive-green" style={mono}>{m.change} (7d)</p>
              </div>
              {bought.includes(m.name)
                ? <span className="text-[12px] text-positive-green" style={mono}>✓ Yours</span>
                : <button onClick={() => setBuying({ name: m.name, price: m.price })} className="button button-cta text-[13px] px-4 py-2 rounded-full">Buy</button>
              }
            </div>
          </div>
        ))}
      </div>

      {/* Buy modal */}
      {buying && (
        <div className="fixed inset-0 dialog-overlay flex items-center justify-center z-50">
          <div className="dialog-content w-[440px] p-7 bg-white rounded-2xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-[18px] font-semibold tracking-[-0.02em]">Buy <span className="text-bn-accent">{buying.name}</span>.btc</h2>
              <button onClick={() => setBuying(null)} className="text-bn-ink-muted hover:text-bn-ink text-lg">✕</button>
            </div>
            {[['Listing price',`${buying.price} BTC`],['Platform fee (2.5%)',`${(buying.price*0.025).toFixed(5)} BTC`],['Network fee (est.)','~0.00012 BTC']].map(([l,v]) => (
              <div key={l} className="flex justify-between py-2.5 border-b border-bn-line text-[14px]">
                <span className="text-bn-ink-muted">{l}</span>
                <span style={mono} className="text-bn-ink text-[13px]">{v}</span>
              </div>
            ))}
            <div className="flex justify-between py-3 text-[14px]">
              <span className="font-semibold text-bn-ink">Total</span>
              <span className="text-bn-accent font-semibold text-[15px]" style={mono}>{(buying.price*1.025+0.00012).toFixed(5)} BTC</span>
            </div>
            <div className="flex gap-2.5 mt-2">
              <button onClick={() => setBuying(null)} className="button button-secondary flex-1 py-3 rounded-xl text-[13px]">Cancel</button>
              <button onClick={confirmBuy} className="button button-cta flex-1 py-3 rounded-xl text-[14px]">Confirm Purchase</button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-6 right-6 flex items-center gap-2 px-5 py-3 bg-bn-surface border border-positive-green/30 rounded-xl text-[13px] text-bn-text z-50 shadow-lg">
          <span className="text-positive-green">✓</span> {toast}
        </div>
      )}
    </div>
  )
}
