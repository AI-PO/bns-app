'use client'

import { useState } from 'react'
import Link from 'next/link'
import { MOCK_OWNED_NAMES } from '@/lib/mock-data'

export default function MyNamesPage() {
  const [names, setNames] = useState(MOCK_OWNED_NAMES)
  const [toast, setToast] = useState('')

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000) }

  return (
    <div style={page}>
      <div style={hdr}>
        <div>
          <h1 style={titleStyle}>My Names</h1>
          <p style={sub}>Manage your .btc identity portfolio.</p>
        </div>
        <Link href="/app/search" style={btnAccent}>+ Register Name</Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
        {names.map((n, i) => (
          <div key={n.name} style={card}>
            {/* Header */}
            <div style={{ padding: '18px 18px 14px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', borderBottom: '1px solid #232320' }}>
              <div>
                <div style={{ fontFamily: 'monospace', fontSize: 18, fontWeight: 500, marginBottom: 5 }}>
                  {n.name}<span style={{ color: '#f7931a' }}>.btc</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'monospace', fontSize: 10, color: '#4caf7d', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#4caf7d' }} />
                  On-chain
                </div>
              </div>
              <span style={{ padding: '3px 9px', borderRadius: 5, fontFamily: 'monospace', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.04em',
                background: n.isPrimary ? 'rgba(247,147,26,0.12)' : 'rgba(76,175,125,0.1)',
                color: n.isPrimary ? '#f7931a' : '#4caf7d',
              }}>{n.isPrimary ? 'Primary' : 'Owned'}</span>
            </div>

            {/* Records */}
            <div style={{ padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 7 }}>
              {[
                { icon: '₿', label: 'Wallet',    val: n.records.wallet },
                { icon: '⚡', label: 'Lightning', val: n.records.lightning },
                { icon: '🌐', label: 'Site',      val: n.records.site },
              ].map(r => (
                <div key={r.label} style={{ display: 'flex', alignItems: 'center', gap: 9, fontSize: 13 }}>
                  <span style={{ width: 18, textAlign: 'center', color: '#f7931a', fontSize: 12 }}>{r.icon}</span>
                  <span style={{ width: 64, fontFamily: 'monospace', fontSize: 10, color: '#5a5850', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{r.label}</span>
                  <span style={{ fontFamily: 'monospace', fontSize: 11, color: r.val ? '#8a8778' : '#3a3a38', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                    {r.val || 'Not set'}
                  </span>
                  <Link href="/app/identity" style={{ fontSize: 11, color: '#f7931a', textDecoration: 'none', opacity: 0.7 }}>Edit</Link>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div style={{ padding: '11px 18px', display: 'flex', gap: 8, borderTop: '1px solid #232320' }}>
              <Link href="/app/identity" style={btnGhost}>Manage</Link>
              <button onClick={() => showToast('Share link copied')} style={btnGhost}>Share</button>
              {!n.isPrimary && (
                <button onClick={() => showToast('List for sale — coming soon')} style={{ ...btnGhost, marginLeft: 'auto', color: '#e05a3a', borderColor: 'rgba(224,90,58,0.2)' }}>
                  List for sale
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {toast && (
        <div style={{ position: 'fixed', bottom: 24, right: 24, padding: '12px 20px', background: '#161614', border: '1px solid rgba(76,175,125,0.3)', borderRadius: 10, fontSize: 13, color: '#f0ede6', display: 'flex', gap: 8, zIndex: 200 }}>
          <span style={{ color: '#4caf7d' }}>✓</span> {toast}
        </div>
      )}
    </div>
  )
}

const page: React.CSSProperties = { padding: 28, color: '#f0ede6' }
const hdr: React.CSSProperties  = { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }
const titleStyle: React.CSSProperties = { fontSize: 22, fontWeight: 700, letterSpacing: '-0.03em' }
const sub: React.CSSProperties  = { fontSize: 14, color: '#8a8778', marginTop: 4 }
const card: React.CSSProperties = { background: '#111110', border: '1px solid #232320', borderRadius: 14, overflow: 'hidden' }
const btnAccent: React.CSSProperties = { padding: '9px 18px', background: '#f7931a', color: '#0a0a08', border: 'none', borderRadius: 8, fontWeight: 600, fontSize: 13, cursor: 'pointer', textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }
const btnGhost: React.CSSProperties  = { padding: '6px 12px', background: 'transparent', border: '1px solid #232320', borderRadius: 7, color: '#8a8778', cursor: 'pointer', fontSize: 12, textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }
