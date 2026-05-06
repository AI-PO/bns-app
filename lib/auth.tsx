'use client'
import { createContext, useContext, useState, useCallback, ReactNode } from 'react'

export type Wallet = {
  id: string
  name: string
  address: string
  isPrimary: boolean
}

export type User = {
  name: string
  address: string
  primaryName?: string
  showOnboarding: boolean
  onboardingStep: number // 0=addFunds,1=buyDomain,2=setPrimary,3=buySecond,4=list,5=done
  wallets: Wallet[]
  activeWalletId: string
  ownedDomains: string[]
}

type AuthCtx = {
  user: User | null
  activeWallet: Wallet | null
  login:    (username: string, password: string) => { ok: boolean; error?: string }
  signup:   (username: string, password: string) => { ok: boolean; error?: string }
  loginDemo: () => void
  logout:   () => void
  updateUser: (updates: Partial<User>) => void
  addWallet: (wallet: Omit<Wallet, 'id'>) => void
  setActiveWallet: (id: string) => void
  advanceOnboarding: () => void
  addDomain: (name: string) => void
}

const Ctx = createContext<AuthCtx | null>(null)

const DEMO_ACCOUNTS: Record<string, string> = {
  satoshi: 'Demo1234!', demo: 'Demo1234!', test: 'Test1234!', filip: 'Filip123!',
}

function makeAddress(username: string): string {
  const base = username.toLowerCase().replace(/[^a-z0-9]/g, '').padEnd(8, 'x').slice(0, 8)
  return `bc1q${base}fjkd5u4lc3fmjvd7c`
}

function makeUser(username: string): User {
  const wallet: Wallet = {
    id: 'wallet-1',
    name: 'Main wallet',
    address: makeAddress(username),
    isPrimary: true,
  }
  return {
    name: username,
    address: wallet.address,
    primaryName: undefined,          // empty — onboarding will set this
    showOnboarding: true,
    onboardingStep: 0,
    wallets: [wallet],
    activeWalletId: 'wallet-1',
    ownedDomains: [],                // empty — no pre-filled domains
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window === 'undefined') return null
    const raw = localStorage.getItem('bns-user')
    return raw ? JSON.parse(raw) as User : null
  })

  const save = (u: User | null) => {
    setUser(u)
    if (typeof window !== 'undefined') {
      if (u) localStorage.setItem('bns-user', JSON.stringify(u))
      else localStorage.removeItem('bns-user')
    }
  }

  const activeWallet = user
    ? (user.wallets.find(w => w.id === user.activeWalletId) ?? user.wallets[0] ?? null)
    : null

  const login = useCallback((username: string, password: string) => {
    const stored = typeof window !== 'undefined'
      ? JSON.parse(localStorage.getItem('bns-accounts') || '{}') : {}
    const all = { ...DEMO_ACCOUNTS, ...stored }
    if (all[username] && all[username] === password) {
      // Load existing user or create fresh
      const existing = typeof window !== 'undefined'
        ? localStorage.getItem(`bns-user-${username}`) : null
      if (existing) { save(JSON.parse(existing)); return { ok: true } }
      save(makeUser(username))
      return { ok: true }
    }
    return { ok: false, error: 'Incorrect username or password.' }
  }, [])

  const signup = useCallback((username: string, password: string) => {
    if (!username || username.length < 2) return { ok: false, error: 'Username must be at least 2 characters.' }
    if (password.length < 8) return { ok: false, error: 'Password must be at least 8 characters.' }
    const stored = typeof window !== 'undefined'
      ? JSON.parse(localStorage.getItem('bns-accounts') || '{}') : {}
    if (DEMO_ACCOUNTS[username] || stored[username]) return { ok: false, error: 'Username already taken.' }
    stored[username] = password
    if (typeof window !== 'undefined') localStorage.setItem('bns-accounts', JSON.stringify(stored))
    save(makeUser(username))
    return { ok: true }
  }, [])

  const loginDemo = useCallback(() => save(makeUser('satoshi')), [])
  const logout = useCallback(() => save(null), [])

  const updateUser = useCallback((updates: Partial<User>) => {
    setUser(u => {
      if (!u) return u
      const next = { ...u, ...updates }
      if (typeof window !== 'undefined') localStorage.setItem('bns-user', JSON.stringify(next))
      return next
    })
  }, [])

  const addWallet = useCallback((wallet: Omit<Wallet, 'id'>) => {
    setUser(u => {
      if (!u) return u
      const id = `wallet-${Date.now()}`
      const next = { ...u, wallets: [...u.wallets, { ...wallet, id }], activeWalletId: id }
      if (typeof window !== 'undefined') localStorage.setItem('bns-user', JSON.stringify(next))
      return next
    })
  }, [])

  const setActiveWallet = useCallback((id: string) => {
    setUser(u => {
      if (!u) return u
      const next = { ...u, activeWalletId: id }
      if (typeof window !== 'undefined') localStorage.setItem('bns-user', JSON.stringify(next))
      return next
    })
  }, [])

  const advanceOnboarding = useCallback(() => {
    setUser(u => {
      if (!u) return u
      const next = { ...u, onboardingStep: u.onboardingStep + 1 }
      if (next.onboardingStep >= 6) next.showOnboarding = false
      if (typeof window !== 'undefined') localStorage.setItem('bns-user', JSON.stringify(next))
      return next
    })
  }, [])

  const addDomain = useCallback((name: string) => {
    setUser(u => {
      if (!u) return u
      const domains = u.ownedDomains.includes(name) ? u.ownedDomains : [...u.ownedDomains, name]
      const next = { ...u, ownedDomains: domains, primaryName: u.primaryName ?? name }
      if (typeof window !== 'undefined') localStorage.setItem('bns-user', JSON.stringify(next))
      return next
    })
  }, [])

  return (
    <Ctx.Provider value={{ user, activeWallet, login, signup, loginDemo, logout, updateUser, addWallet, setActiveWallet, advanceOnboarding, addDomain }}>
      {children}
    </Ctx.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
