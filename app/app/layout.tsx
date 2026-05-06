'use client'
import { useEffect, ReactNode, useState, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/lib/auth'

const NAV = [
  { id: '',            icon: '⌂', label: 'Home' },
  { id: 'search',      icon: '⌕', label: 'Buy domain' },
  { id: 'marketplace', icon: '◈', label: 'Marketplace', badge: '12' },
  { id: 'my-names',    icon: '◉', label: 'My Names' },
  { id: 'identity',    icon: '◎', label: 'Identity' },
  { id: 'activity',    icon: '⊞', label: 'Activity' },
]

export default function AppLayout({ children }: { children: ReactNode }) {
  const { user, logout, activeWallet, setActiveWallet, addWallet } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [topSearch, setTopSearch] = useState('')
  const [walletOpen, setWalletOpen] = useState(false)
  const [addingWallet, setAddingWallet] = useState(false)
  const [newWalletName, setNewWalletName] = useState('')
  const dropRef = useRef<HTMLDivElement>(null)

  useEffect(() => { if (!user) router.replace('/login') }, [user, router])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) setWalletOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  if (!user) return null

  const handleTopSearch = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && topSearch.trim()) {
      router.push(`/app/search?q=${encodeURIComponent(topSearch.trim())}`)
      setTopSearch('')
    }
  }

  const handleAddWallet = () => {
    if (!newWalletName.trim()) return
    const addr = 'bc1q' + newWalletName.toLowerCase().replace(/[^a-z0-9]/g, '').padEnd(8, 'x').slice(0, 8) + 'new4567'
    addWallet({ name: newWalletName.trim(), address: addr, isPrimary: false })
    setNewWalletName('')
    setAddingWallet(false)
    setWalletOpen(false)
  }

  const isActive = (id: string) => pathname === (id === '' ? '/app' : `/app/${id}`)

  return (
    <div className="flex h-screen bg-bn-page text-bn-ink overflow-hidden" style={{ fontFamily: 'var(--font-hubot-sans, Inter, sans-serif)' }}>
      {/* Sidebar */}
      <aside className="w-[232px] shrink-0 border-r border-bn-line bg-bn-page-2 flex flex-col">
        <div className="h-[68px] flex items-center px-5 border-b border-bn-line">
          <Link href="/"><Image src="/navbar_logo.svg" alt="Bitcoin Names" width={122} height={31} className="h-[34px] w-auto" /></Link>
        </div>
        <nav className="flex-1 px-3 py-3 overflow-y-auto">
          <p className="font-mono-bn text-[10px] uppercase tracking-[0.1em] text-bn-ink-muted px-2 mb-1.5">Main</p>
          {NAV.slice(0, 3).map(n => <NavItem key={n.id} n={n} active={isActive(n.id)} />)}
          <p className="font-mono-bn text-[10px] uppercase tracking-[0.1em] text-bn-ink-muted px-2 mb-1.5 mt-4">My Identity</p>
          {NAV.slice(3).map(n => <NavItem key={n.id} n={n} active={isActive(n.id)} />)}
        </nav>
        <div className="px-3 py-3 border-t border-bn-line">
          <Link href="/app/identity" className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl hover:bg-bn-page-3 transition-colors">
            <div className="w-8 h-8 rounded-lg bg-bn-accent/10 border border-bn-accent/20 flex items-center justify-center text-[13px] font-semibold text-bn-accent shrink-0">
              {user.name[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-mono-bn text-[12px] font-medium text-bn-ink truncate">{user.primaryName ?? `${user.name}.btc`}</p>
              <p className="font-mono-bn text-[10px] text-bn-ink-muted truncate">{user.address.slice(0, 18)}...</p>
            </div>
          </Link>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="h-[68px] shrink-0 border-b border-bn-line bg-bn-page flex items-center gap-4 px-5">
          <div className="flex-1 max-w-[400px] flex items-center gap-2.5 px-3.5 py-2 bg-bn-page-2 border border-bn-line-2 rounded-xl focus-within:border-bn-ink/30 transition-colors">
            <span className="text-bn-ink-muted text-[13px]">⌕</span>
            <input value={topSearch} onChange={e => setTopSearch(e.target.value)} onKeyDown={handleTopSearch}
              placeholder="search names..." className="flex-1 bg-transparent border-none outline-none font-mono-bn text-[13px] text-bn-ink placeholder-bn-ink-dim" />
            <span className="font-mono-bn text-[12px] text-bn-accent">.btc</span>
          </div>

          <div className="ml-auto flex items-center gap-2.5">
            {/* Fix 12: Wallet dropdown */}
            <div className="relative" ref={dropRef}>
              <button onClick={() => setWalletOpen(v => !v)}
                className="flex items-center gap-2 px-3.5 py-1.5 bg-bn-page-2 border border-bn-line-2 rounded-full font-mono-bn text-[12px] text-bn-ink-2 hover:border-bn-line transition-colors">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                {activeWallet?.address.slice(0, 10) ?? user.address.slice(0, 10)}...
                <span className="text-bn-ink-dim text-[10px]">▾</span>
              </button>

              {walletOpen && (
                <div className="absolute right-0 top-full mt-2 w-[260px] bg-white border border-bn-line rounded-2xl shadow-[0_4px_24px_rgba(10,10,10,0.12)] z-50 overflow-hidden">
                  {user.wallets.map(w => (
                    <button key={w.id} onClick={() => { setActiveWallet(w.id); setWalletOpen(false) }}
                      className={`w-full flex items-center justify-between gap-3 px-4 py-3 text-sm text-left hover:bg-bn-page-2 transition-colors border-b border-bn-line last:border-0 ${w.id === activeWallet?.id ? 'bg-bn-accent/5' : ''}`}>
                      <div>
                        <div className="font-medium text-bn-ink text-[13px]">{w.name}</div>
                        <div className="font-mono-bn text-[10px] text-bn-ink-muted">{w.address.slice(0, 8)}…{w.address.slice(-4)}</div>
                      </div>
                      <div className="text-right">
                        {w.isPrimary && <div className="font-mono-bn text-[9px] text-bn-accent uppercase mb-0.5">Primary</div>}
                        {w.id === activeWallet?.id && <div className="w-2 h-2 rounded-full bg-green-500 ml-auto" />}
                      </div>
                    </button>
                  ))}
                  <div className="px-4 py-2.5 border-t border-bn-line">
                    {!addingWallet ? (
                      <button onClick={() => setAddingWallet(true)} className="text-[12px] font-medium text-bn-accent hover:text-bn-accent-hover flex items-center gap-1">
                        + Add wallet
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        <input value={newWalletName} onChange={e => setNewWalletName(e.target.value)}
                          placeholder="Wallet name" autoFocus onKeyDown={e => e.key === 'Enter' && handleAddWallet()}
                          className="flex-1 px-2 py-1 text-[12px] border border-bn-line rounded-lg outline-none focus:border-bn-accent/40" />
                        <button onClick={handleAddWallet} className="text-[12px] font-semibold text-bn-accent">Add</button>
                        <button onClick={() => { setAddingWallet(false); setNewWalletName('') }} className="text-[12px] text-bn-ink-muted">✕</button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <button onClick={() => { logout(); router.push('/') }}
              className="px-3.5 py-1.5 font-mono-bn text-[12px] text-bn-ink-muted border border-bn-line rounded-full hover:border-bn-line-2 hover:text-bn-ink transition-colors">
              Log out
            </button>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto bg-bn-page">{children}</main>
      </div>
    </div>
  )
}

function NavItem({ n, active }: { n: typeof NAV[0]; active: boolean }) {
  return (
    <Link href={n.id === '' ? '/app' : `/app/${n.id}`}
      className={`flex items-center gap-2.5 px-2.5 py-2 rounded-xl mb-0.5 text-[14px] transition-colors relative no-underline ${active ? 'bg-bn-accent/8 text-bn-ink border border-bn-accent/15' : 'text-bn-ink-muted hover:bg-bn-page-3 hover:text-bn-ink'}`}>
      {active && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-[55%] bg-bn-accent rounded-r" />}
      <span className="w-5 text-center text-[15px] shrink-0">{n.icon}</span>
      <span className="flex-1">{n.label}</span>
      {n.badge && <span className="px-1.5 py-0.5 bg-bn-accent/10 rounded-full font-mono-bn text-[10px] text-bn-accent">{n.badge}</span>}
    </Link>
  )
}
