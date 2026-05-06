'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/lib/auth'

export default function MyNamesPage() {
  const { user, updateUser } = useAuth()
  const [toast, setToast] = useState('')
  const showToast = (m: string) => { setToast(m); setTimeout(() => setToast(''), 3000) }

  if (!user) return null

  return (
    <div className="p-7">
      <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-[22px] font-medium tracking-[-0.03em] text-bn-ink">My Names</h1>
          <p className="text-[14px] text-bn-ink-muted mt-1">Manage your .btc identity portfolio.</p>
        </div>
        <Link href="/app/search" className="button button-primary text-[13px] px-5 py-2.5 rounded-full">+ Buy Name</Link>
      </div>

      {user.ownedDomains.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="text-5xl mb-4">🌐</div>
          <h2 className="text-[18px] font-semibold text-bn-ink mb-2">No names yet</h2>
          <p className="text-[14px] text-bn-ink-muted mb-6 max-w-[300px]">Buy your first .btc name to start building your Bitcoin identity.</p>
          <Link href="/app/search" className="button button-primary text-[14px] px-6 py-3 rounded-full">Buy your first name →</Link>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {user.ownedDomains.map(name => {
            const fullName = `${name}.btc`
            const isPrimary = user.primaryName === fullName
            return (
              <div key={name} className="bg-white border border-bn-line rounded-xl overflow-hidden shadow-[0_1px_3px_rgba(10,10,10,0.05)]">
                <div className="flex items-start justify-between px-5 pt-5 pb-4 border-b border-bn-line">
                  <div>
                    <p className="font-mono-bn text-[18px] font-medium text-bn-ink mb-1.5">{name}<span className="text-bn-accent">.btc</span></p>
                    <div className="flex items-center gap-1.5 font-mono-bn text-[10px] text-green-600 uppercase tracking-[0.06em]">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500" /> On-chain
                    </div>
                  </div>
                  <span className={`font-mono-bn text-[10px] px-2 py-0.5 rounded uppercase ${isPrimary ? 'bg-bn-accent/10 text-bn-accent' : 'bg-green-50 text-green-700'}`}>
                    {isPrimary ? 'Primary' : 'Owned'}
                  </span>
                </div>
                <div className="px-5 py-4 flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-bn-accent text-[12px] w-4 text-center shrink-0">₿</span>
                    <span className="font-mono-bn text-[10px] text-bn-ink-muted uppercase tracking-[0.06em] w-16 shrink-0">Wallet</span>
                    <span className="font-mono-bn text-[11px] text-bn-ink-2 truncate flex-1">{user.address.slice(0, 16)}...</span>
                  </div>
                </div>
                <div className="px-5 py-3 border-t border-bn-line flex gap-2 flex-wrap">
                  {!isPrimary && (
                    <button onClick={() => { updateUser({ primaryName: fullName }); showToast(`${fullName} set as primary`) }}
                      className="button button-secondary text-[12px] px-3 py-1.5 rounded-full">Set primary</button>
                  )}
                  <Link href="/app/identity" className="button button-secondary text-[12px] px-3 py-1.5 rounded-full">Identity</Link>
                  <button onClick={() => showToast('Coming soon')} className="button text-[12px] px-3 py-1.5 rounded-full ml-auto border border-red-200 text-red-500 bg-red-50 hover:bg-red-100">
                    List for sale
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {toast && <div className="fixed bottom-6 right-6 flex items-center gap-2 px-5 py-3 bg-white border border-bn-line rounded-xl shadow-[0_4px_12px_rgba(10,10,10,0.08)] text-[13px] z-50"><span className="text-green-600">✓</span> {toast}</div>}
    </div>
  )
}
