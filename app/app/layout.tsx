'use client'

import { useEffect, ReactNode, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/lib/auth'

const NAV = [
  { id: '',            icon: '⌂', label: 'Home' },
  { id: 'search',      icon: '⌕', label: 'Search Names' },
  { id: 'marketplace', icon: '◈', label: 'Marketplace', badge: '12' },
  { id: 'my-names',    icon: '◉', label: 'My Names', badge: '2' },
  { id: 'identity',    icon: '◎', label: 'Identity & Records' },
  { id: 'activity',    icon: '⊞', label: 'Activity' },
]

export default function AppLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [topSearch, setTopSearch] = useState('')

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

  const isActive = (id: string) => {
    const target = id === '' ? '/app' : `/app/${id}`
    return pathname === target
  }

  return (
    <div className="flex h-screen bg-bn-bg text-bn-text overflow-hidden" style={{ fontFamily: 'var(--font-hubot-sans)' }}>

      {/* ── SIDEBAR ── */}
      <aside className="w-[232px] shrink-0 border-r border-bn-border bg-bn-surface flex flex-col">
        {/* Logo */}
        <div className="h-14 flex items-center px-4 border-b border-bn-border">
          <Link href="/app">
            <Image src="/navbar_logo_dark.svg" alt="Bitcoin Names" width={120} height={30} className="h-7 w-auto" />
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2.5 py-3 overflow-y-auto">
          <p className="text-[10px] font-medium text-bn-text-dim tracking-[0.1em] uppercase px-2 mb-1.5">Main</p>
          {NAV.slice(0, 3).map(n => (
            <NavItem key={n.id} n={n} active={isActive(n.id)} />
          ))}
          <p className="text-[10px] font-medium text-bn-text-dim tracking-[0.1em] uppercase px-2 mb-1.5 mt-4">My Identity</p>
          {NAV.slice(3).map(n => (
            <NavItem key={n.id} n={n} active={isActive(n.id)} />
          ))}
        </nav>

        {/* Profile */}
        <div className="px-2.5 py-3 border-t border-bn-border">
          <Link href="/app/identity" className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl hover:bg-bn-surface-2 transition-colors">
            <div className="w-8 h-8 rounded-lg bg-bn-accent/10 border border-bn-accent/20 flex items-center justify-center text-sm shrink-0 text-bn-accent font-semibold">
              {user.username[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-medium text-bn-text truncate" style={{ fontFamily: 'var(--font-source-code-pro)' }}>{user.primaryName}</p>
              <p className="text-[10px] text-bn-text-dim truncate" style={{ fontFamily: 'var(--font-source-code-pro)' }}>{user.address.slice(0, 18)}...</p>
            </div>
          </Link>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Topbar */}
        <header className="h-14 shrink-0 border-b border-bn-border bg-bn-surface flex items-center gap-4 px-5">
          {/* Search */}
          <div className="flex-1 max-w-[380px] flex items-center gap-2 px-3.5 py-2 bg-bn-bg border border-bn-border rounded-xl focus-within:border-bn-accent/40 transition-colors">
            <span className="text-bn-text-dim text-[13px]">⌕</span>
            <input
              value={topSearch}
              onChange={e => setTopSearch(e.target.value)}
              onKeyDown={handleTopSearch}
              placeholder="search names..."
              className="flex-1 bg-transparent border-none outline-none text-[13px] text-bn-text placeholder-bn-text-dim"
              style={{ fontFamily: 'var(--font-source-code-pro)' }}
            />
            <span className="text-bn-accent text-[12px]" style={{ fontFamily: 'var(--font-source-code-pro)' }}>.btc</span>
          </div>

          <div className="ml-auto flex items-center gap-2.5">
            {/* Connected pill */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-bn-bg border border-bn-border rounded-full text-[12px] text-bn-text-muted" style={{ fontFamily: 'var(--font-source-code-pro)' }}>
              <div className="w-1.5 h-1.5 rounded-full bg-positive-green" />
              {user.address.slice(0, 12)}...
            </div>
            <button
              onClick={() => { logout(); router.push('/login') }}
              className="px-3 py-1.5 text-[12px] text-bn-text-dim border border-bn-border rounded-full hover:border-bn-border-mid hover:text-bn-text-muted transition-colors">
              Log out
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}

function NavItem({ n, active }: { n: typeof NAV[0]; active: boolean }) {
  return (
    <Link
      href={n.id === '' ? '/app' : `/app/${n.id}`}
      className={`flex items-center gap-2.5 px-2.5 py-2 rounded-xl mb-0.5 text-[14px] transition-colors relative ${
        active
          ? 'bg-bn-accent/8 text-bn-text border border-bn-accent/15'
          : 'text-bn-text-muted hover:bg-bn-surface-2 hover:text-bn-text'
      }`}
    >
      {active && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-[55%] bg-bn-accent rounded-r" />}
      <span className="w-5 text-center text-[15px] shrink-0">{n.icon}</span>
      <span className="flex-1">{n.label}</span>
      {n.badge && (
        <span className="px-1.5 py-0.5 bg-bn-accent/10 rounded-full text-[10px] text-bn-accent" style={{ fontFamily: 'var(--font-source-code-pro)' }}>
          {n.badge}
        </span>
      )}
    </Link>
  )
}
