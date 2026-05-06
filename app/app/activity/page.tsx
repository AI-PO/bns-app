'use client'

import { MOCK_ACTIVITY } from '@/lib/mock-data'

export default function ActivityPage() {
  return (
    <div style={{ padding: 28, color: '#f0ede6' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.03em' }}>Activity</h1>
        <p style={{ fontSize: 14, color: '#8a8778', marginTop: 4 }}>On-chain history for your wallet.</p>
      </div>

      <div style={{ background: '#111110', border: '1px solid #232320', borderRadius: 14, overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', borderBottom: '1px solid #232320' }}>
          <span style={{ fontWeight: 700, fontSize: 13 }}>All transactions</span>
          <button style={{ background: 'none', border: 'none', color: '#f7931a', cursor: 'pointer', fontSize: 12 }}>Export CSV</button>
        </div>

        {MOCK_ACTIVITY.map((a, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', borderBottom: i < MOCK_ACTIVITY.length - 1 ? '1px solid #232320' : 'none' }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: a.type === 'register' ? 'rgba(247,147,26,0.12)' : 'rgba(76,175,125,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>
              {a.type === 'register' ? '₿' : '✎'}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13 }}>
                {a.type === 'register' ? 'Registered ' : 'Updated records on '}
                <strong>{a.name}</strong>
              </div>
              <div style={{ fontFamily: 'monospace', fontSize: 11, color: '#5a5850', marginTop: 3 }}>
                {a.time} · Block #{a.block}
                {a.txid && <> · <span style={{ color: '#f7931a' }}>txid: {a.txid}</span></>}
              </div>
            </div>
            <div style={{ fontFamily: 'monospace', fontSize: 12, color: a.amount.startsWith('-') ? '#f7931a' : '#4caf7d' }}>
              {a.amount}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
