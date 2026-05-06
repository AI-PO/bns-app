'use client'
import Link from 'next/link'
import { useAuth } from '@/lib/auth'
import { MOCK_OWNED_NAMES, MOCK_MARKETPLACE, MOCK_ACTIVITY } from '@/lib/mock-data'

export default function AppHome() {
  const { user } = useAuth()
  return (
    <div className="p-7 max-w-[1100px]">
      <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="text-[22px] font-medium tracking-[-0.03em] text-bn-ink">Welcome back ⚡</h1>
          <p className="text-[14px] text-bn-ink-muted mt-1">Here's what's happening with your Bitcoin identity.</p>
        </div>
        <Link href="/app/search" className="button button-primary text-[13px] px-5 py-2.5 rounded-full">+ Register Name</Link>
      </div>

      <div className="grid grid-cols-4 gap-3 mb-5">
        {[
          { label: 'Names Owned', value: '2', sub: '↑ +1 this month', cls: 'text-green-600' },
          { label: 'Portfolio Value', value: '0.31 BTC', sub: '↑ +18.4% (30d)', cls: 'text-green-600' },
          { label: 'Active Records', value: '5', sub: 'Wallet · Lightning · Site', cls: 'text-bn-ink-muted' },
          { label: 'Block Height', value: '874,291', sub: '● Live', cls: 'text-green-600' },
        ].map(s => (
          <div key={s.label} className="bg-white border border-bn-line rounded-xl p-5 shadow-[0_1px_3px_rgba(10,10,10,0.05)]">
            <p className="font-mono-bn text-[10px] text-bn-ink-muted uppercase tracking-[0.08em] mb-2.5">{s.label}</p>
            <p className="text-[22px] font-medium tracking-[-0.04em] text-bn-ink mb-1">{s.value}</p>
            <p className={`font-mono-bn text-[11px] ${s.cls}`}>{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-white border border-bn-line rounded-xl overflow-hidden shadow-[0_1px_3px_rgba(10,10,10,0.05)]">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-bn-line">
            <span className="text-[13px] font-semibold text-bn-ink">My Names</span>
            <Link href="/app/my-names" className="text-[12px] text-bn-accent hover:text-bn-accent-hover">View all →</Link>
          </div>
          {MOCK_OWNED_NAMES.map((n, i) => (
            <Link key={n.name} href="/app/identity" className={`flex items-center gap-3 px-5 py-3 hover:bg-bn-page-2 transition-colors no-underline ${i < MOCK_OWNED_NAMES.length - 1 ? 'border-b border-bn-line' : ''}`}>
              <div className="w-9 h-9 rounded-[10px] bg-bn-accent/8 border border-bn-accent/15 flex items-center justify-center text-base shrink-0">₿</div>
              <div className="flex-1">
                <p className="font-mono-bn text-[14px] font-medium text-bn-ink">{n.name}<span className="text-bn-accent">.btc</span></p>
                <p className="font-mono-bn text-[11px] text-bn-ink-muted mt-0.5">{n.isPrimary ? 'Primary' : 'Owned'} · {Object.values(n.records).filter(Boolean).length} records</p>
              </div>
              <span className={`font-mono-bn text-[10px] px-2 py-0.5 rounded uppercase ${n.isPrimary ? 'bg-bn-accent/10 text-bn-accent' : 'bg-green-50 text-green-700'}`}>{n.isPrimary ? 'PRIMARY' : 'OWNED'}</span>
            </Link>
          ))}
        </div>

        <div className="bg-white border border-bn-line rounded-xl overflow-hidden shadow-[0_1px_3px_rgba(10,10,10,0.05)]">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-bn-line">
            <span className="text-[13px] font-semibold text-bn-ink">Recent Activity</span>
            <Link href="/app/activity" className="text-[12px] text-bn-accent hover:text-bn-accent-hover">View all →</Link>
          </div>
          {MOCK_ACTIVITY.map((a, i) => (
            <div key={i} className={`flex items-center gap-3 px-5 py-3 ${i < MOCK_ACTIVITY.length - 1 ? 'border-b border-bn-line' : ''}`}>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[13px] shrink-0 ${a.type === 'register' ? 'bg-bn-accent/8' : 'bg-green-50'}`}>
                {a.type === 'register' ? '₿' : '✎'}
              </div>
              <div className="flex-1">
                <p className="text-[13px] text-bn-ink">{a.type === 'register' ? 'Registered ' : 'Updated '}<strong>{a.name}</strong></p>
                <p className="font-mono-bn text-[11px] text-bn-ink-muted mt-0.5">{a.time} · Block #{a.block}</p>
              </div>
              <span className="font-mono-bn text-[12px] text-bn-accent">{a.amount}</span>
            </div>
          ))}
        </div>
      </div>

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
              <p className="font-mono-bn text-[11px] text-bn-ink-muted">{m.chars}-char · Orobit SCL</p>
            </div>
            <div className="text-right mr-3">
              <p className="font-mono-bn text-[13px] text-bn-ink">{m.price} BTC</p>
              <p className="font-mono-bn text-[11px] text-green-600">{m.change} (7d)</p>
            </div>
            <Link href="/app/marketplace" className="button button-primary text-[12px] px-4 py-2 rounded-full">Buy</Link>
          </div>
        ))}
      </div>
    </div>
  )
}
