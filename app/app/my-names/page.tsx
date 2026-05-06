'use client'
import { useState } from 'react'
import Link from 'next/link'
import { MOCK_OWNED_NAMES } from '@/lib/mock-data'

const mono = { fontFamily: 'var(--font-source-code-pro)' } as const

export default function MyNamesPage() {
  const [toast, setToast] = useState('')
  const showToast = (m: string) => { setToast(m); setTimeout(() => setToast(''), 3000) }

  return (
    <div className="p-7">
      <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-[22px] font-semibold tracking-[-0.03em] text-bn-text">My Names</h1>
          <p className="text-[14px] text-bn-text-muted mt-1">Manage your .btc identity portfolio.</p>
        </div>
        <Link href="/app/search" className="button button-primary text-[13px] px-5 py-2.5 rounded-full">+ Register Name</Link>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {MOCK_OWNED_NAMES.map(n => (
          <div key={n.name} className="bg-bn-surface border border-bn-border rounded-xl overflow-hidden">
            <div className="flex items-start justify-between px-5 pt-5 pb-4 border-b border-bn-border">
              <div>
                <p className="text-[18px] font-medium text-bn-text mb-1.5" style={mono}>{n.name}<span className="text-bn-accent">.btc</span></p>
                <div className="flex items-center gap-1.5 text-[10px] text-positive-green uppercase tracking-[0.06em]" style={mono}>
                  <div className="w-1.5 h-1.5 rounded-full bg-positive-green" /> On-chain
                </div>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded uppercase tracking-[0.04em] ${n.isPrimary ? 'bg-bn-accent/10 text-bn-accent' : 'bg-positive-green/10 text-positive-green'}`} style={mono}>
                {n.isPrimary ? 'Primary' : 'Owned'}
              </span>
            </div>

            <div className="px-5 py-4 flex flex-col gap-2">
              {[{icon:'₿',label:'Wallet',val:n.records.wallet},{icon:'⚡',label:'Lightning',val:n.records.lightning},{icon:'🌐',label:'Site',val:n.records.site}].map(r => (
                <div key={r.label} className="flex items-center gap-2.5 text-[13px]">
                  <span className="w-4.5 text-center text-bn-accent text-[12px] shrink-0">{r.icon}</span>
                  <span className="w-16 text-[10px] text-bn-text-dim uppercase tracking-[0.06em] shrink-0" style={mono}>{r.label}</span>
                  <span className="flex-1 text-[11px] text-bn-text-muted truncate" style={mono}>{r.val || 'Not set'}</span>
                  <Link href="/app/identity" className="text-[11px] text-bn-accent hover:text-bn-accent-hover opacity-70">Edit</Link>
                </div>
              ))}
            </div>

            <div className="px-5 py-3 border-t border-bn-border flex gap-2">
              <Link href="/app/identity" className="button button-secondary text-[12px] px-3 py-1.5 rounded-full">Manage</Link>
              <button onClick={() => showToast('Share link copied')} className="button button-secondary text-[12px] px-3 py-1.5 rounded-full">Share</button>
              {!n.isPrimary && <button onClick={() => showToast('Coming soon')} className="button text-[12px] px-3 py-1.5 rounded-full ml-auto border-negative-red/20 text-negative-red bg-negative-red/5 hover:bg-negative-red/10">List for sale</button>}
            </div>
          </div>
        ))}
      </div>

      {toast && <div className="fixed bottom-6 right-6 flex items-center gap-2 px-5 py-3 bg-bn-surface border border-positive-green/30 rounded-xl text-[13px] text-bn-text z-50"><span className="text-positive-green">✓</span> {toast}</div>}
    </div>
  )
}
