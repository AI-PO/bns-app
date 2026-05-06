'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/auth'
import { MOCK_OWNED_NAMES } from '@/lib/mock-data'

export default function IdentityPage() {
  const { user } = useAuth()
  const [records, setRecords] = useState(MOCK_OWNED_NAMES[0].records)
  const [toast, setToast] = useState('')

  const save = () => { setToast('Records saved on-chain'); setTimeout(() => setToast(''), 3000) }

  const FIELDS = [
    { icon: '₿', label: 'Wallet',    key: 'wallet',    ph: 'bc1q...' },
    { icon: '⚡', label: 'Lightning', key: 'lightning', ph: 'yourname@lightning.node' },
    { icon: '🌐', label: 'Site',      key: 'site',      ph: 'ipfs://... or https://...' },
    { icon: '𝕏', label: 'Twitter',   key: 'twitter',   ph: '@handle' },
    { icon: '📡', label: 'Nostr',     key: 'nostr',     ph: 'npub...' },
  ]

  return (
    <div style={page}>
      <div style={hdr}>
        <div>
          <h1 style={titleStyle}>Identity & Records</h1>
          <p style={sub}>Manage your primary .btc name and what it resolves to.</p>
        </div>
        <button onClick={save} style={btnAccent}>Save changes</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Profile card */}
        <div>
          <div style={{ ...card, marginBottom: 14, overflow: 'hidden' }}>
            <div style={{ height: 72, background: 'linear-gradient(135deg, rgba(247,147,26,0.2), rgba(247,147,26,0.04))', borderBottom: '1px solid #232320', position: 'relative' }}>
              <div style={{ position: 'absolute', bottom: -24, left: 22, width: 52, height: 52, borderRadius: 13, background: '#f7931a', border: '3px solid #111110', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 20, color: '#0a0a08' }}>
                {user?.username[0].toUpperCase()}
              </div>
            </div>
            <div style={{ padding: '34px 22px 22px' }}>
              <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.04em', marginBottom: 4 }}>
                {user?.username}<span style={{ color: '#f7931a' }}>.btc</span>
              </div>
              <div style={{ fontFamily: 'monospace', fontSize: 11, color: '#5a5850', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                {user?.address}
                <button onClick={() => setToast('Address copied')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#5a5850', fontSize: 12 }}>⎘</button>
              </div>
              <div style={{ display: 'flex', gap: 24, padding: '14px 0', borderTop: '1px solid #232320', borderBottom: '1px solid #232320', marginBottom: 18 }}>
                {[['2', 'Names'], ['5', 'Records'], ['874k', 'Block']].map(([v, l]) => (
                  <div key={l} style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-0.04em', color: '#f7931a' }}>{v}</div>
                    <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#5a5850', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 2 }}>{l}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => setToast('Share link copied')} style={{ ...btnGhost, flex: 1, justifyContent: 'center' }}>Share</button>
                <button style={{ ...btnGhost, flex: 1, justifyContent: 'center' }}>Change Primary</button>
              </div>
            </div>
          </div>

          {/* Security */}
          <div style={card}>
            <div style={cardHdr}><span style={cardTitle}>Security</span></div>
            <div style={{ padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { label: 'Taproot Signature', sub: 'P2TR key-path spending enabled', active: true },
                { label: 'NIST PQC', sub: 'CRYSTALS-Dilithium hybrid', active: true },
                { label: 'Transfer Lock', sub: 'Prevent accidental transfer', active: false },
              ].map(s => (
                <div key={s.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{s.label}</div>
                    <div style={{ fontSize: 12, color: '#5a5850', marginTop: 2 }}>{s.sub}</div>
                  </div>
                  <div style={{ fontFamily: 'monospace', fontSize: 11, color: s.active ? '#4caf7d' : '#5a5850' }}>
                    {s.active ? '✓ Active' : '○ Off'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Records editor */}
        <div style={card}>
          <div style={cardHdr}><span style={cardTitle}>Records</span><button style={{ background: 'none', border: 'none', color: '#f7931a', cursor: 'pointer', fontSize: 12 }}>Edit all</button></div>
          <div style={{ padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {FIELDS.map(f => (
              <div key={f.key} style={{ display: 'flex', alignItems: 'center', background: '#0a0a08', border: '1px solid #232320', borderRadius: 9, overflow: 'hidden' }}>
                <div style={{ width: 42, height: 42, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, borderRight: '1px solid #232320', flexShrink: 0 }}>{f.icon}</div>
                <div style={{ width: 76, padding: '0 10px', fontFamily: 'monospace', fontSize: 10, color: '#5a5850', textTransform: 'uppercase', letterSpacing: '0.06em', borderRight: '1px solid #232320', flexShrink: 0 }}>{f.label}</div>
                <input
                  value={(records as any)[f.key] || ''}
                  onChange={e => setRecords(r => ({ ...r, [f.key]: e.target.value }))}
                  placeholder={f.ph}
                  style={{ flex: 1, padding: '11px 12px', background: 'none', border: 'none', outline: 'none', fontFamily: 'monospace', fontSize: 12, color: '#f0ede6' }}
                />
                <div style={{ padding: '0 12px', fontSize: 13, color: (records as any)[f.key] ? '#4caf7d' : '#3a3a38' }}>
                  {(records as any)[f.key] ? '✓' : '○'}
                </div>
              </div>
            ))}
          </div>
        </div>
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
const card: React.CSSProperties = { background: '#111110', border: '1px solid #232320', borderRadius: 14 }
const cardHdr: React.CSSProperties  = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', borderBottom: '1px solid #232320' }
const cardTitle: React.CSSProperties = { fontWeight: 700, fontSize: 13 }
const btnAccent: React.CSSProperties = { padding: '9px 18px', background: '#f7931a', color: '#0a0a08', border: 'none', borderRadius: 8, fontWeight: 600, fontSize: 13, cursor: 'pointer' }
const btnGhost: React.CSSProperties  = { padding: '7px 12px', background: 'transparent', border: '1px solid #232320', borderRadius: 7, color: '#8a8778', cursor: 'pointer', fontSize: 12, display: 'inline-flex', alignItems: 'center' }
