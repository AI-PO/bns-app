'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'

export type User = {
  username: string
  address: string
  primaryName: string
}

type AuthCtx = {
  user: User | null
  login: (username: string, password: string) => { ok: boolean; error?: string }
  signup: (username: string, password: string) => { ok: boolean; error?: string }
  loginDemo: () => void
  logout: () => void
}

const Ctx = createContext<AuthCtx | null>(null)

// ── Mock accounts (devs: replace with real auth) ──
const MOCK_ACCOUNTS: Record<string, string> = {
  satoshi:  'Demo1234!',
  demo:     'Demo1234!',
  test:     'Test1234!',
  filip:    'Filip123!',
}

function makeUser(username: string): User {
  return {
    username,
    address: 'bc1q9xj7fkn3d8r2p...mock',
    primaryName: `${username}.btc`,
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  const login = useCallback((username: string, password: string) => {
    const stored = typeof window !== 'undefined'
      ? JSON.parse(localStorage.getItem('bns_accounts') || '{}')
      : {}
    const all = { ...MOCK_ACCOUNTS, ...stored }
    if (all[username] && all[username] === password) {
      setUser(makeUser(username))
      return { ok: true }
    }
    return { ok: false, error: 'Incorrect username or password.' }
  }, [])

  const signup = useCallback((username: string, password: string) => {
    if (!username || username.length < 2) return { ok: false, error: 'Username must be at least 2 characters.' }
    if (password.length < 8) return { ok: false, error: 'Password must be at least 8 characters.' }
    const stored = JSON.parse(localStorage.getItem('bns_accounts') || '{}')
    if (MOCK_ACCOUNTS[username] || stored[username]) return { ok: false, error: 'Username already taken.' }
    stored[username] = password
    localStorage.setItem('bns_accounts', JSON.stringify(stored))
    setUser(makeUser(username))
    return { ok: true }
  }, [])

  const loginDemo = useCallback(() => setUser(makeUser('satoshi')), [])
  const logout    = useCallback(() => setUser(null), [])

  return <Ctx.Provider value={{ user, login, signup, loginDemo, logout }}>{children}</Ctx.Provider>
}

export function useAuth() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
