'use client'
import { useState } from 'react'
import { MOCK_MARKETPLACE } from '@/lib/mock-data'

type Filter = 'all' | 'premium' | 'new'
const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'All names' },
  { id: 'premium', label: 'Premium' },
  { id: 'new', label: 'New listings' },
]

export default function MarketplacePage() {
  const [filter, setFilter] = useState<Filter>('all')
  const [buying, setBuying] = useState<{ name: string; price: number } | null>(null)
  const [bought, setBought] = useState<string[]>([])
  const [toast, setToast] = useState('')
  const [sellModal, setSellModal] = useState(false)
  const [sellName, setSellName] = useState('')
  const [sellPrice, setSellPrice] = useState('')
  const [sellType, setSellType] = useState<'fixed' | 'auction'>('fixed')
  const [auctionEnd, setAuctionEnd] = useState('')
  const [minBid, setMinBid] = useState('')

  const filtered = MOCK_MARKETPLACE.filter(m => {
    if (filter === 'premium') return m.category === 'premium' || m.chars <= 4
    if (filter === 'new') return m.category === 'new'
    return true
  })
  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000) }
  const confirmBuy = () => {
    if (!buying) return
    setBought(b => [...b, buying.name])
    showToast(`${buying.name}.btc purchased!`)
    setBuying(null)
  }
  const submitSell = () => {
    showToast(`${sellName}.btc listed for sale!`)
    setSellModal(false)
    setSellName(''); setSellPrice(''); setMinBid(''); setAuctionEnd('')
  }

  return (
    <div className="p-7">
      <div className="flex items-start justify-between mb-5 flex-wrap gap-3">
        <div>
          <h1 className="text-[22px] font-medium tracking-[-0.03em] text-bn-ink">Marketplace</h1>
          <p className="text-[14px] text-bn-ink-muted mt-1">Browse, buy, and bid on premium .btc names.</p>
        </div>
        <button onClick={() => setSellModal(true)} className="button button-cta text-[13px] px-5 py-2.5 rounded-full">
          Sell my domain
        </button>
      </div>

      {/* Fix 9: Only All names, Premium, New listings */}
      <div className="flex gap-2 mb-5">
        {FILTERS.map(f => (
          <button key={f.id} onClick={() => setFilter(f.id)}
            className={`px-4 py-1.5 rounded-full font-mono-bn text-[12px] border transition-colors ${filter === f.id ? 'bg-bn-accent/8 border-bn-accent/20 text-bn-accent' : 'bg-white border-bn-line text-bn-ink-muted hover:border-bn-line-2 hover:text-bn-ink'}`}>
            {f.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-3">
        {filtered.map(m => (
          <div key={m.name} className={`bg-white border rounded-xl p-5 shadow-[0_1px_3px_rgba(10,10,10,0.05)] transition-all hover:shadow-[0_4px_12px_rgba(10,10,10,0.08)] hover:-translate-y-0.5 ${bought.includes(m.name) ? 'border-green-200' : 'border-bn-line'}`}>
            <p className="font-mono-bn text-[16px] font-medium text-bn-ink mb-0.5">{m.name}<span className="text-bn-accent">.btc</span>
              {bought.includes(m.name) && <span className="ml-2 font-mono-bn text-[10px] bg-green-50 text-green-700 px-1.5 py-0.5 rounded">OWNED</span>}
            </p>
            <p className="font-mono-bn text-[10px] text-bn-ink-muted uppercase tracking-[0.06em] mb-4">{m.chars} chars · Orobit SCL</p>
            <div className="flex items-center justify-between pt-3.5 border-t border-bn-line">
              <div>
                <p className="text-[16px] font-semibold tracking-[-0.03em] text-bn-ink">{m.price} BTC</p>
                <p className="font-mono-bn text-[11px] text-green-600">{m.change} (7d)</p>
              </div>
              {bought.includes(m.name)
                ? <span className="font-mono-bn text-[12px] text-green-600">✓ Yours</span>
                : <button onClick={() => setBuying({ name: m.name, price: m.price })} className="button button-cta text-[13px] px-4 py-2 rounded-full">Buy</button>}
            </div>
          </div>
        ))}
      </div>

      {/* Buy modal */}
      {buying && (
        <div className="fixed inset-0 dialog-overlay flex items-center justify-center z-50">
          <div className="dialog-content w-[440px] p-7">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-[18px] font-semibold">Buy <span className="text-bn-accent">{buying.name}</span>.btc</h2>
              <button onClick={() => setBuying(null)} className="text-bn-ink-muted hover:text-bn-ink text-lg">✕</button>
            </div>
            {[['Listing price', `${buying.price} BTC`], ['Platform fee (2.5%)', `${(buying.price * 0.025).toFixed(5)} BTC`], ['Network fee (est.)', '~0.00012 BTC']].map(([l, v]) => (
              <div key={l} className="flex justify-between py-2.5 border-b border-bn-line text-[14px]">
                <span className="text-bn-ink-muted">{l}</span>
                <span className="font-mono-bn text-[13px] text-bn-ink">{v}</span>
              </div>
            ))}
            <div className="flex justify-between py-3 text-[14px]">
              <span className="font-semibold">Total</span>
              <span className="font-mono-bn text-[15px] font-semibold text-bn-accent">{(buying.price * 1.025 + 0.00012).toFixed(5)} BTC</span>
            </div>
            <div className="flex gap-2.5 mt-2">
              <button onClick={() => setBuying(null)} className="button button-secondary flex-1 py-3 rounded-xl text-[13px]">Cancel</button>
              <button onClick={confirmBuy} className="button button-cta flex-1 py-3 rounded-xl text-[14px]">Confirm Purchase</button>
            </div>
          </div>
        </div>
      )}

      {/* Sell modal — Fix 9 with auction options */}
      {sellModal && (
        <div className="fixed inset-0 dialog-overlay flex items-center justify-center z-50">
          <div className="dialog-content w-[480px] p-7">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-[18px] font-semibold">List domain for sale</h2>
              <button onClick={() => setSellModal(false)} className="text-bn-ink-muted hover:text-bn-ink text-lg">✕</button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[13px] font-semibold text-bn-ink mb-2">Domain name</label>
                <div className="flex items-center border border-bn-line-2 rounded-xl overflow-hidden bg-bn-page-2">
                  <input value={sellName} onChange={e => setSellName(e.target.value)} placeholder="yourname"
                    className="flex-1 px-4 py-3 bg-transparent border-none outline-none font-mono-bn text-[14px] text-bn-ink" />
                  <span className="px-3 font-mono-bn text-[13px] text-bn-accent border-l border-bn-line">.btc</span>
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-bn-ink mb-2">Listing type</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['fixed', 'auction'] as const).map(t => (
                    <button key={t} onClick={() => setSellType(t)}
                      className={`py-2.5 rounded-xl border text-[13px] font-medium transition-colors ${sellType === t ? 'border-bn-accent/30 bg-bn-accent/8 text-bn-accent' : 'border-bn-line text-bn-ink-muted hover:border-bn-line-2'}`}>
                      {t === 'fixed' ? '🏷️ Fixed price' : '🔨 Auction'}
                    </button>
                  ))}
                </div>
              </div>

              {sellType === 'fixed' && (
                <div>
                  <label className="block text-[13px] font-semibold text-bn-ink mb-2">Price (BTC)</label>
                  <input value={sellPrice} onChange={e => setSellPrice(e.target.value)} placeholder="0.05"
                    className="w-full px-4 py-3 border border-bn-line-2 rounded-xl font-mono-bn text-[14px] text-bn-ink bg-bn-page-2 outline-none focus:border-bn-accent/40" />
                </div>
              )}

              {sellType === 'auction' && (
                <>
                  <div>
                    <label className="block text-[13px] font-semibold text-bn-ink mb-1">Minimum bid (BTC)</label>
                    <p className="text-[11px] text-bn-ink-muted mb-2">The lowest offer you'll accept. Set to 0 to accept any bid.</p>
                    <input value={minBid} onChange={e => setMinBid(e.target.value)} placeholder="0.01"
                      className="w-full px-4 py-3 border border-bn-line-2 rounded-xl font-mono-bn text-[14px] text-bn-ink bg-bn-page-2 outline-none focus:border-bn-accent/40" />
                  </div>
                  <div>
                    <label className="block text-[13px] font-semibold text-bn-ink mb-1">Auction end date</label>
                    <p className="text-[11px] text-bn-ink-muted mb-2">After this date, the highest bidder wins automatically.</p>
                    <input type="date" value={auctionEnd} onChange={e => setAuctionEnd(e.target.value)}
                      className="w-full px-4 py-3 border border-bn-line-2 rounded-xl text-[14px] text-bn-ink bg-bn-page-2 outline-none focus:border-bn-accent/40" />
                  </div>
                  <div className="rounded-xl border border-bn-line bg-bn-page-2 p-3 text-[12px] text-bn-ink-muted">
                    💡 You can accept any offer early — you're not required to wait until the end date. All incoming bids appear in <strong>My Names → Offers</strong>.
                  </div>
                </>
              )}
            </div>

            <div className="flex gap-2.5 mt-6">
              <button onClick={() => setSellModal(false)} className="button button-secondary flex-1 py-3 rounded-xl text-[13px]">Cancel</button>
              <button onClick={submitSell} className="button button-cta flex-1 py-3 rounded-xl text-[14px]">List for sale</button>
            </div>
          </div>
        </div>
      )}

      {toast && <div className="fixed bottom-6 right-6 flex items-center gap-2 px-5 py-3 bg-white border border-bn-line rounded-xl shadow-[0_4px_12px_rgba(10,10,10,0.08)] text-[13px] z-50"><span className="text-green-600">✓</span> {toast}</div>}
    </div>
  )
}
