'use client'

import { useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/auth'
import { useState } from 'react'

const NAV = [
  { id: 'home',        icon: '⌂', label: 'Home' },
  { id: 'search',      icon: '⌕', label: 'Search Names' },
  { id: 'marketplace', icon: '◈', label: 'Marketplace', badge: '12' },
  { id: 'my-names',    icon: '◉', label: 'My Names',    badge: '2' },
  { id: 'identity',    icon: '◎', label: 'Identity & Records' },
  { id: 'activity',    icon: '⊞', label: 'Activity' },
]

export default function AppLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [topSearch, setTopSearch] = useState('')

  // Auth guard
  useEffect(() => {
    if (!user) router.replace('/login')
  }, [user, router])

  if (!user) return null

  const handleTopSearch = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && topSearch.trim()) {
      router.push(`/app/search?q=${encodeURIComponent(topSearch.trim())}`)
      setTopSearch('')
    }
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'var(--sidebar-w) 1fr', gridTemplateRows: '56px 1fr', height: '100vh', background: '#0a0a08', fontFamily: 'Inter, sans-serif' }}>

      {/* ── TOPBAR ── */}
      <div style={{
        gridColumn: '1 / -1', display: 'flex', alignItems: 'center',
        padding: '0 20px', borderBottom: '1px solid #232320',
        background: '#0a0a08', gap: 16, zIndex: 10,
      }}>
        <Link href="/app" style={{ display: 'flex', alignItems: 'center', gap: 9, textDecoration: 'none', marginRight: 4 }}>
          <div style={{ width: 28, height: 28, borderRadius: 7, background: '#f7931a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 12, color: '#fff' }}>BN</div>
          <span style={{ fontWeight: 700, fontSize: 14, color: '#f0ede6' }}>Bitcoin Names</span>
        </Link>

        {/* Search bar */}
        <div style={{ flex: 1, maxWidth: 380, display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px', background: '#161614', border: '1px solid #232320', borderRadius: 8 }}>
          <span style={{ color: '#5a5850', fontSize: 13 }}>⌕</span>
          <input
            value={topSearch}
            onChange={e => setTopSearch(e.target.value)}
            onKeyDown={handleTopSearch}
            placeholder="search names..."
            style={{ flex: 1, background: 'none', border: 'none', outline: 'none', fontFamily: 'monospace', fontSize: 13, color: '#f0ede6' }}
          />
          <span style={{ fontFamily: 'monospace', fontSize: 12, color: '#f7931a' }}>.btc</span>
        </div>

        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ padding: '5px 12px', background: '#161614', border: '1px solid #2e2e2a', borderRadius: 7, fontFamily: 'monospace', fontSize: 12, color: '#8a8778', display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#4caf7d' }} />
            {user.address.slice(0, 14)}...
          </div>
          <button onClick={() => { logout(); router.push('/login') }} style={{ padding: '5px 12px', background: 'transparent', border: '1px solid #232320', borderRadius: 7, color: '#5a5850', fontSize: 12, cursor: 'pointer' }}>
            Log out
          </button>
        </div>
      </div>

      {/* ── SIDEBAR ── */}
      <div style={{ background: '#111110', borderRight: '1px solid #232320', padding: '14px 10px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#5a5850', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0 8px', marginBottom: 6 }}>Main</div>
          {NAV.slice(0, 3).map(n => <NavItem key={n.id} item={n} />)}
        </div>
        <div>
          <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#5a5850', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0 8px', marginBottom: 6 }}>My Identity</div>
          {NAV.slice(3).map(n => <NavItem key={n.id} item={n} />)}
        </div>

        <div style={{ marginTop: 'auto', paddingTop: 14, borderTop: '1px solid #232320' }}>
          <Link href="/app/identity" style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '9px 10px', borderRadius: 8, textDecoration: 'none' }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, background: 'rgba(247,147,26,0.12)', border: '1px solid rgba(247,147,26,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>₿</div>
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <div style={{ fontFamily: 'monospace', fontSize: 12, fontWeight: 500, color: '#f0ede6', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.primaryName}</div>
              <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#5a5850' }}>{user.address.slice(0, 16)}...</div>
            </div>
          </Link>
        </div>
      </div>

      {/* ── MAIN ── */}
      <div style={{ overflow: 'auto', background: '#0a0a08' }}>
        {children}
      </div>

    </div>
  )
}

function NavItem({ item }: { item: typeof NAV[0] }) {
  const router = useRouter()
  return (
    <Link href={`/app/${item.id === 'home' ? '' : item.id}`} style={{
      display: 'flex', alignItems: 'center', gap: 9,
      padding: '8px 10px', borderRadius: 8,
      cursor: 'pointer', fontSize: 14, color: '#8a8778',
      textDecoration: 'none', marginBottom: 2,
    }}>
      <span style={{ width: 20, textAlign: 'center', fontSize: 15, flexShrink: 0 }}>{item.icon}</span>
      <span style={{ flex: 1 }}>{item.label}</span>
      {item.badge && (
        <span style={{ padding: '1px 6px', background: 'rgba(247,147,26,0.12)', borderRadius: 100, fontFamily: 'monospace', fontSize: 10, color: '#f7931a' }}>{item.badge}</span>
      )}
    </Link>
  )
}
