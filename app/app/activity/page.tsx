'use client'
import { MOCK_ACTIVITY } from '@/lib/mock-data'

export default function ActivityPage() {
  return (
    <div className="p-7">
      <div className="mb-6">
        <h1 className="text-[22px] font-medium tracking-[-0.03em] text-bn-ink">Activity</h1>
        <p className="text-[14px] text-bn-ink-muted mt-1">On-chain history for your wallet.</p>
      </div>
      <div className="bg-white border border-bn-line rounded-xl shadow-[0_1px_3px_rgba(10,10,10,0.05)]">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-bn-line">
          <span className="text-[13px] font-semibold text-bn-ink">All transactions</span>
          <button className="text-[12px] text-bn-accent hover:text-bn-accent-hover">Export CSV</button>
        </div>
        {MOCK_ACTIVITY.map((a, i) => (
          <div key={i} className={`flex items-center gap-3.5 px-5 py-3.5 ${i < MOCK_ACTIVITY.length-1 ? 'border-b border-bn-line' : ''}`}>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[13px] shrink-0 ${a.type==='register' ? 'bg-bn-accent/8' : 'bg-green-50'}`}>
              {a.type==='register' ? '₿' : '✎'}
            </div>
            <div className="flex-1">
              <p className="text-[13px] text-bn-ink">{a.type==='register' ? 'Registered ' : 'Updated records on '}<strong>{a.name}</strong></p>
              <p className="font-mono-bn text-[11px] text-bn-ink-muted mt-0.5">
                {a.time} · Block #{a.block}{a.txid && <> · <span className="text-bn-accent">txid: {a.txid}</span></>}
              </p>
            </div>
            <span className="font-mono-bn text-[12px] text-bn-accent">{a.amount}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
