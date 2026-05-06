'use client'

import Link from 'next/link'
import { useAuth } from '@/lib/auth'
import { MOCK_OWNED_NAMES, MOCK_MARKETPLACE, MOCK_ACTIVITY } from '@/lib/mock-data'

const mono = { fontFamily: 'var(--font-source-code-pro)' } as const

export default function AppHome() {
  const { user } = useAuth()

  return (
    <div className="p-7 max-w-[1100px]">
      <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="text-[22px] font-semibold tracking-[-0.03em] text-bn-text">Welcome back ⚡</h1>
          <p className="text-[14px] text-bn-text-muted mt-1">Here's what's happening with your Bitcoin identity.</p>
        </div>
        <Link href="/app/search" className="button button-primary text-[13px] px-5 py-2.5 rounded-full">+ Register Name</Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 mb-5">
        {[
          { label: 'Names Owned',     value: '2',        sub: '↑ +1 this month',        subCls: 'text-positive-green' },
          { label: 'Portfolio Value', value: '0.31 BTC', sub: '↑ +18.4% (30d)',          subCls: 'text-positive-green' },
          { label: 'Active Records',  value: '5',        sub: 'Wallet · Lightning · Site',subCls: 'text-bn-text-muted' },
          { label: 'Block Height',    value: '874,291',  sub: '● Live',                  subCls: 'text-positive-green' },
        ].map(s => (
          <div key={s.label} className="bg-bn-surface border border-bn-border rounded-xl p-5">
            <p className="text-[10px] font-medium text-bn-text-dim tracking-[0.08em] uppercase mb-2.5" style={mono}>{s.label}</p>
            <p className="text-[22px] font-semibold tracking-[-0.04em] text-bn-text mb-1">{s.value}</p>
            <p className={`text-[11px] ${s.subCls}`} style={mono}>{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* My Names */}
        <div className="bg-bn-surface border border-bn-border rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-bn-border">
            <span className="text-[13px] font-semibold text-bn-text">My Names</span>
            <Link href="/app/my-names" className="text-[12px] text-bn-accent hover:text-bn-accent-hover">View all →</Link>
          </div>
          {MOCK_OWNED_NAMES.map((n, i) => (
            <Link key={n.name} href="/app/identity" className={`flex items-center gap-3 px-5 py-3 hover:bg-bn-surface-2 transition-colors no-underline ${i < MOCK_OWNED_NAMES.length - 1 ? 'border-b border-bn-border' : ''}`}>
              <div className="w-9 h-9 rounded-[10px] bg-bn-accent/10 border border-bn-accent/15 flex items-center justify-center text-base shrink-0">₿</div>
              <div className="flex-1">
                <p className="text-[14px] font-medium text-bn-text" style={mono}>{n.name}<span className="text-bn-accent">.btc</span></p>
                <p className="text-[11px] text-bn-text-dim mt-0.5" style={mono}>{n.isPrimary ? 'Primary' : 'Owned'} · {Object.values(n.records).filter(Boolean).length} records</p>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded ${n.isPrimary ? 'bg-bn-accent/10 text-bn-accent' : 'bg-positive-green/10 text-positive-green'}`} style={mono}>
                {n.isPrimary ? 'PRIMARY' : 'OWNED'}
              </span>
            </Link>
          ))}
        </div>

        {/* Activity */}
        <div className="bg-bn-surface border border-bn-border rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-bn-border">
            <span className="text-[13px] font-semibold text-bn-text">Recent Activity</span>
            <Link href="/app/activity" className="text-[12px] text-bn-accent hover:text-bn-accent-hover">View all →</Link>
          </div>
          {MOCK_ACTIVITY.map((a, i) => (
            <div key={i} className={`flex items-center gap-3 px-5 py-3 ${i < MOCK_ACTIVITY.length - 1 ? 'border-b border-bn-border' : ''}`}>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[13px] shrink-0 ${a.type === 'register' ? 'bg-bn-accent/10' : 'bg-positive-green/10'}`}>
                {a.type === 'register' ? '₿' : '✎'}
              </div>
              <div className="flex-1">
                <p className="text-[13px] text-bn-text">{a.type === 'register' ? 'Registered ' : 'Updated '}<strong>{a.name}</strong></p>
                <p className="text-[11px] text-bn-text-dim mt-0.5" style={mono}>{a.time} · Block #{a.block}</p>
              </div>
              <span className="text-[12px] text-bn-accent" style={mono}>{a.amount}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Trending */}
      <div className="bg-bn-surface border border-bn-border rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-bn-border">
          <span className="text-[13px] font-semibold text-bn-text">Trending on Marketplace</span>
          <Link href="/app/marketplace" className="text-[12px] text-bn-accent hover:text-bn-accent-hover">Browse all →</Link>
        </div>
        {MOCK_MARKETPLACE.slice(0, 3).map((m, i) => (
          <div key={m.name} className={`flex items-center gap-3 px-5 py-3 ${i < 2 ? 'border-b border-bn-border' : ''}`}>
            <div className="w-9 h-9 rounded-[10px] bg-bn-accent/10 border border-bn-accent/15 flex items-center justify-center text-base shrink-0">◈</div>
            <div className="flex-1">
              <p className="text-[14px] font-medium text-bn-text" style={mono}>{m.name}<span className="text-bn-accent">.btc</span></p>
              <p className="text-[11px] text-bn-text-dim mt-0.5" style={mono}>{m.chars}-char · Orobit SCL</p>
            </div>
            <div className="text-right mr-3">
              <p className="text-[13px] text-bn-text" style={mono}>{m.price} BTC</p>
              <p className="text-[11px] text-positive-green" style={mono}>{m.change} (7d)</p>
            </div>
            <Link href="/app/marketplace" className="button button-primary text-[12px] px-4 py-2 rounded-full">Buy</Link>
          </div>
        ))}
      </div>
    </div>
  )
}
