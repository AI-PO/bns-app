'use client'
import { MOCK_ACTIVITY } from '@/lib/mock-data'

const mono = { fontFamily: 'var(--font-source-code-pro)' } as const

export default function ActivityPage() {
  return (
    <div className="p-7">
      <div className="mb-6">
        <h1 className="text-[22px] font-semibold tracking-[-0.03em] text-bn-text">Activity</h1>
        <p className="text-[14px] text-bn-text-muted mt-1">On-chain history for your wallet.</p>
      </div>
      <div className="bg-bn-surface border border-bn-border rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-bn-border">
          <span className="text-[13px] font-semibold text-bn-text">All transactions</span>
          <button className="text-[12px] text-bn-accent hover:text-bn-accent-hover">Export CSV</button>
        </div>
        {MOCK_ACTIVITY.map((a, i) => (
          <div key={i} className={`flex items-center gap-3.5 px-5 py-3.5 ${i < MOCK_ACTIVITY.length-1 ? 'border-b border-bn-border' : ''}`}>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[13px] shrink-0 ${a.type==='register' ? 'bg-bn-accent/10' : 'bg-positive-green/10'}`}>
              {a.type==='register' ? '₿' : '✎'}
            </div>
            <div className="flex-1">
              <p className="text-[13px] text-bn-text">{a.type==='register' ? 'Registered ' : 'Updated records on '}<strong>{a.name}</strong></p>
              <p className="text-[11px] text-bn-text-dim mt-0.5" style={mono}>
                {a.time} · Block #{a.block}{a.txid && <> · <span className="text-bn-accent">txid: {a.txid}</span></>}
              </p>
            </div>
            <span className="text-[12px] text-bn-accent" style={mono}>{a.amount}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
