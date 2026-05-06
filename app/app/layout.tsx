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

  const isActive = (id: string) => pathname === (id === '' ? '/app' : `/app/${id}`)

  return (
    <div className="flex h-screen bg-bn-page text-bn-ink overflow-hidden" style={{ fontFamily: 'var(--font-hubot-sans, Inter, sans-serif)' }}>

      {/* ── SIDEBAR — light ── */}
      <aside className="w-[232px] shrink-0 border-r border-bn-line bg-bn-page-2 flex flex-col">
        <div className="h-[68px] flex items-center px-5 border-b border-bn-line">
          <Link href="/">
            <Image src="/navbar_logo.svg" alt="Bitcoin Names" width={122} height={31} className="h-[34px] w-auto" />
          </Link>
        </div>

        <nav className="flex-1 px-3 py-3 overflow-y-auto">
          <p className="font-mono-bn text-[10px] uppercase tracking-[0.1em] text-bn-ink-muted px-2 mb-1.5">Main</p>
          {NAV.slice(0, 3).map(n => <NavItem key={n.id} n={n} active={isActive(n.id)} />)}
          <p className="font-mono-bn text-[10px] uppercase tracking-[0.1em] text-bn-ink-muted px-2 mb-1.5 mt-4">My Identity</p>
          {NAV.slice(3).map(n => <NavItem key={n.id} n={n} active={isActive(n.id)} />)}
        </nav>

        <div className="px-3 py-3 border-t border-bn-line">
          <Link href="/app/identity" className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl hover:bg-bn-page-3 transition-colors">
            <div className="w-8 h-8 rounded-lg bg-bn-accent/10 border border-bn-accent/20 flex items-center justify-center text-sm text-bn-accent font-semibold shrink-0">
              {user.username[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-mono-bn text-[12px] font-medium text-bn-ink truncate">{user.primaryName}</p>
              <p className="font-mono-bn text-[10px] text-bn-ink-muted truncate">{user.address.slice(0, 20)}...</p>
            </div>
          </Link>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Topbar — light */}
        <header className="h-[68px] shrink-0 border-b border-bn-line bg-bn-page flex items-center gap-4 px-5">
          <div className="flex-1 max-w-[400px] flex items-center gap-2.5 px-3.5 py-2 bg-bn-page-2 border border-bn-line-2 rounded-xl focus-within:border-bn-ink/30 focus-within:ring-2 focus-within:ring-bn-ink/5 transition-all">
            <span className="text-bn-ink-muted text-[13px]">⌕</span>
            <input
              value={topSearch}
              onChange={e => setTopSearch(e.target.value)}
              onKeyDown={handleTopSearch}
              placeholder="search names..."
              className="flex-1 bg-transparent border-none outline-none font-mono-bn text-[13px] text-bn-ink placeholder-bn-ink-dim"
            />
            <span className="font-mono-bn text-[12px] text-bn-accent">.btc</span>
          </div>

          <div className="ml-auto flex items-center gap-2.5">
            <div className="flex items-center gap-2 px-3.5 py-1.5 bg-bn-page-2 border border-bn-line-2 rounded-full font-mono-bn text-[12px] text-bn-ink-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
              {user.address.slice(0, 14)}...
            </div>
            <button onClick={() => { logout(); router.push('/') }}
              className="px-3.5 py-1.5 font-mono-bn text-[12px] text-bn-ink-muted border border-bn-line rounded-full hover:border-bn-line-2 hover:text-bn-ink transition-colors">
              Log out
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-bn-page">
          {children}
        </main>
      </div>
    </div>
  )
}

function NavItem({ n, active }: { n: typeof NAV[0]; active: boolean }) {
  return (
    <Link href={n.id === '' ? '/app' : `/app/${n.id}`}
      className={`flex items-center gap-2.5 px-2.5 py-2 rounded-xl mb-0.5 text-[14px] transition-colors relative no-underline ${
        active
          ? 'bg-bn-accent/8 text-bn-ink border border-bn-accent/15'
          : 'text-bn-ink-muted hover:bg-bn-page-3 hover:text-bn-ink'
      }`}>
      {active && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-[55%] bg-bn-accent rounded-r" />}
      <span className="w-5 text-center text-[15px] shrink-0">{n.icon}</span>
      <span className="flex-1">{n.label}</span>
      {n.badge && (
        <span className="px-1.5 py-0.5 bg-bn-accent/10 rounded-full font-mono-bn text-[10px] text-bn-accent">{n.badge}</span>
      )}
    </Link>
  )
}
