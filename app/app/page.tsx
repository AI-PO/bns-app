'use client'

import Link from 'next/link'
import { useAuth } from '@/lib/auth'
import { MOCK_OWNED_NAMES, MOCK_MARKETPLACE, MOCK_ACTIVITY } from '@/lib/mock-data'

export default function AppHome() {
  const { user } = useAuth()

  return (
    <div style={pageStyle}>
      <div style={headerStyle}>
        <div>
          <h1 style={titleStyle}>Welcome back ⚡</h1>
          <p style={subStyle}>Here's what's happening with your Bitcoin identity.</p>
        </div>
        <Link href="/app/search" style={btnPrimary}>+ Register Name</Link>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'Names Owned',    value: '2',       sub: '↑ +1 this month',     subColor: '#4caf7d' },
          { label: 'Portfolio Value', value: '0.31 BTC', sub: '↑ +18.4% (30d)',     subColor: '#4caf7d' },
          { label: 'Active Records',  value: '5',       sub: 'Wallet, Lightning, Site', subColor: '#8a8778' },
          { label: 'Block Height',    value: '874,291',  sub: '● Live',              subColor: '#4caf7d' },
        ].map(s => (
          <div key={s.label} style={cardStyle}>
            <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#5a5850', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>{s.label}</div>
            <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.04em', color: '#f0ede6', marginBottom: 4 }}>{s.value}</div>
            <div style={{ fontFamily: 'monospace', fontSize: 11, color: s.subColor }}>{s.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
        {/* My Names */}
        <div style={cardStyle}>
          <div style={cardHeaderStyle}>
            <span style={cardTitleStyle}>My Names</span>
            <Link href="/app/my-names" style={linkStyle}>View all →</Link>
          </div>
          {MOCK_OWNED_NAMES.map(n => (
            <Link key={n.name} href="/app/identity" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: '1px solid #232320', textDecoration: 'none' }}>
              <div style={avatarStyle}>₿</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'monospace', fontSize: 14, fontWeight: 500, color: '#f0ede6' }}>{n.name}<span style={{ color: '#f7931a' }}>.btc</span></div>
                <div style={{ fontFamily: 'monospace', fontSize: 11, color: '#5a5850', marginTop: 2 }}>{n.isPrimary ? 'Primary' : 'Owned'} · {Object.values(n.records).filter(Boolean).length} records set</div>
              </div>
              <span style={{ ...tagStyle, ...(n.isPrimary ? tagAccent : tagGreen) }}>{n.isPrimary ? 'Primary' : 'Owned'}</span>
            </Link>
          ))}
        </div>

        {/* Recent Activity */}
        <div style={cardStyle}>
          <div style={cardHeaderStyle}>
            <span style={cardTitleStyle}>Recent Activity</span>
            <Link href="/app/activity" style={linkStyle}>View all →</Link>
          </div>
          {MOCK_ACTIVITY.map((a, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 0', borderBottom: i < MOCK_ACTIVITY.length - 1 ? '1px solid #232320' : 'none' }}>
              <div style={{ width: 30, height: 30, borderRadius: 8, background: a.type === 'register' ? 'rgba(247,147,26,0.12)' : 'rgba(76,175,125,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, flexShrink: 0 }}>
                {a.type === 'register' ? '₿' : '✎'}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13 }}><span style={{ color: '#f0ede6' }}>{a.type === 'register' ? 'Registered ' : 'Updated records on '}</span><strong style={{ color: '#f0ede6' }}>{a.name}</strong></div>
                <div style={{ fontFamily: 'monospace', fontSize: 11, color: '#5a5850', marginTop: 2 }}>{a.time} · Block #{a.block}</div>
              </div>
              <div style={{ fontFamily: 'monospace', fontSize: 12, color: '#f7931a' }}>{a.amount}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Trending */}
      <div style={cardStyle}>
        <div style={cardHeaderStyle}>
          <span style={cardTitleStyle}>Trending on Marketplace</span>
          <Link href="/app/marketplace" style={linkStyle}>Browse all →</Link>
        </div>
        {MOCK_MARKETPLACE.slice(0, 3).map(m => (
          <div key={m.name} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: '1px solid #232320' }}>
            <div style={avatarStyle}>◈</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'monospace', fontSize: 14, fontWeight: 500, color: '#f0ede6' }}>{m.name}<span style={{ color: '#f7931a' }}>.btc</span></div>
              <div style={{ fontFamily: 'monospace', fontSize: 11, color: '#5a5850', marginTop: 2 }}>{m.chars}-char · Orobit SCL</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: 'monospace', fontSize: 13, color: '#f0ede6' }}>{m.price} BTC</div>
              <div style={{ fontFamily: 'monospace', fontSize: 11, color: '#4caf7d' }}>{m.change} (7d)</div>
            </div>
            <Link href={`/app/marketplace`} style={{ ...btnPrimary, padding: '6px 14px', fontSize: 12, marginLeft: 8 }}>Buy</Link>
          </div>
        ))}
      </div>
    </div>
  )
}

// shared styles
const pageStyle: React.CSSProperties = { padding: 28, color: '#f0ede6', fontFamily: 'Inter, sans-serif' }
const headerStyle: React.CSSProperties = { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }
const titleStyle: React.CSSProperties = { fontSize: 22, fontWeight: 700, letterSpacing: '-0.03em' }
const subStyle: React.CSSProperties = { fontSize: 14, color: '#8a8778', marginTop: 4 }
const cardStyle: React.CSSProperties = { background: '#111110', border: '1px solid #232320', borderRadius: 12, padding: '16px 18px' }
const cardHeaderStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 14, marginBottom: 2, borderBottom: '1px solid #232320' }
const cardTitleStyle: React.CSSProperties = { fontWeight: 700, fontSize: 13 }
const linkStyle: React.CSSProperties = { fontSize: 12, color: '#f7931a', textDecoration: 'none' }
const avatarStyle: React.CSSProperties = { width: 34, height: 34, borderRadius: 9, background: 'rgba(247,147,26,0.12)', border: '1px solid rgba(247,147,26,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, flexShrink: 0 }
const tagStyle: React.CSSProperties = { padding: '3px 9px', borderRadius: 5, fontFamily: 'monospace', fontSize: 10, letterSpacing: '0.04em', textTransform: 'uppercase' }
const tagAccent: React.CSSProperties = { background: 'rgba(247,147,26,0.12)', color: '#f7931a' }
const tagGreen: React.CSSProperties = { background: 'rgba(76,175,125,0.1)', color: '#4caf7d' }
const btnPrimary: React.CSSProperties = { padding: '9px 18px', background: '#f7931a', color: '#0a0a08', borderRadius: 8, fontWeight: 600, fontSize: 13, textDecoration: 'none', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }
