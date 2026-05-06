'use client'
import { useState } from 'react'
import { useAuth } from '@/lib/auth'

const SECURITY_ITEMS = [
  {
    label: 'Taproot Signature',
    sub: 'P2TR key-path spending enabled',
    active: true,
    tooltip: 'Taproot (BIP-341) uses Schnorr signatures for more efficient, private ownership proofs. It reduces transaction fees and improves privacy by making complex scripts look identical to simple payments on-chain.',
  },
  {
    label: 'NIST PQC',
    sub: 'CRYSTALS-Dilithium hybrid',
    active: true,
    tooltip: 'Post-Quantum Cryptography using the CRYSTALS-Dilithium algorithm (FIPS 204), standardised by NIST in August 2024. This protects your name from future quantum computers that could break traditional elliptic curve keys.',
  },
  {
    label: 'Transfer Lock',
    sub: 'Prevent accidental transfer',
    active: false,
    tooltip: 'When enabled, all transfer and sale transactions are blocked until you explicitly unlock them. This prevents accidental transfers or phishing attacks from moving your name without a deliberate two-step confirmation.',
  },
]

export default function IdentityPage() {
  const { user, updateUser } = useAuth()
  const [toast, setToast] = useState('')
  const [hoveredSecurity, setHoveredSecurity] = useState<number | null>(null)

  if (!user) return null

  const primaryName = user.primaryName ?? (user.ownedDomains[0] ? `${user.ownedDomains[0]}.btc` : null)

  const save = () => { setToast('Identity saved'); setTimeout(() => setToast(''), 3000) }

  return (
    <div className="p-7 max-w-[700px]">
      <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-[22px] font-medium tracking-[-0.03em] text-bn-ink">Identity</h1>
          <p className="text-[14px] text-bn-ink-muted mt-1">Your primary .btc name and security settings.</p>
        </div>
        <button onClick={save} className="button button-primary text-[13px] px-5 py-2.5 rounded-full">Save changes</button>
      </div>

      {/* Profile card */}
      <div className="bg-white border border-bn-line rounded-xl overflow-hidden shadow-[0_1px_3px_rgba(10,10,10,0.05)] mb-5">
        <div className="h-[72px] border-b border-bn-line relative" style={{ background: 'linear-gradient(135deg,rgba(247,147,26,0.1),rgba(247,147,26,0.02))' }}>
          <div className="absolute bottom-[-22px] left-5 w-11 h-11 rounded-[12px] bg-bn-accent border-[2px] border-white flex items-center justify-center text-[18px] font-bold text-white shadow-[0_2px_8px_rgba(247,147,26,0.4)]">
            {user.name[0].toUpperCase()}
          </div>
        </div>
        <div className="px-5 pt-9 pb-5">
          {primaryName ? (
            <>
              <p className="text-[20px] font-medium tracking-[-0.04em] text-bn-ink mb-1">
                {primaryName.split('.')[0]}<span className="text-bn-accent">.btc</span>
              </p>
              <div className="flex items-center gap-2 font-mono-bn text-[11px] text-bn-ink-muted mb-5">
                <span>{user.address}</span>
                <button onClick={() => { navigator.clipboard?.writeText(user.address); setToast('Address copied') }} className="hover:text-bn-ink-2">⎘</button>
              </div>
            </>
          ) : (
            <div className="mb-5">
              <p className="text-[15px] font-medium text-bn-ink-muted mb-2">No primary name set</p>
              <a href="/app/search" className="text-[13px] text-bn-accent hover:text-bn-accent-hover">Buy your first .btc name →</a>
            </div>
          )}

          <div className="flex gap-6 py-3.5 border-y border-bn-line mb-4">
            {[
              ['Names', user.ownedDomains.length.toString()],
              ['Primary', primaryName ? '✓' : '—'],
              ['Wallets', user.wallets.length.toString()],
            ].map(([l, v]) => (
              <div key={l} className="text-center">
                <p className="text-[18px] font-semibold tracking-[-0.04em] text-bn-accent">{v}</p>
                <p className="font-mono-bn text-[10px] text-bn-ink-muted uppercase tracking-[0.06em] mt-0.5">{l}</p>
              </div>
            ))}
          </div>

          {user.ownedDomains.length > 1 && (
            <div>
              <label className="block text-[12px] font-semibold text-bn-ink-muted uppercase tracking-[0.06em] mb-2">Primary name</label>
              <select
                value={user.primaryName ?? ''}
                onChange={e => updateUser({ primaryName: e.target.value })}
                className="w-full px-3 py-2.5 border border-bn-line-2 rounded-xl font-mono-bn text-[13px] text-bn-ink bg-bn-page-2 outline-none focus:border-bn-accent/40">
                {user.ownedDomains.map(n => (
                  <option key={n} value={`${n}.btc`}>{n}.btc</option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Fix 11: Security with hover tooltips — Fix 10: NO Records section */}
      <div className="bg-white border border-bn-line rounded-xl shadow-[0_1px_3px_rgba(10,10,10,0.05)]">
        <div className="px-5 py-3.5 border-b border-bn-line">
          <span className="text-[13px] font-semibold text-bn-ink">Security</span>
        </div>
        <div className="px-5 py-4 flex flex-col gap-5">
          {SECURITY_ITEMS.map((s, i) => (
            <div key={s.label} className="flex items-start justify-between gap-4 relative">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-[13px] font-medium text-bn-ink">{s.label}</p>
                  {/* Fix 11: Tooltip trigger */}
                  <button
                    onMouseEnter={() => setHoveredSecurity(i)}
                    onMouseLeave={() => setHoveredSecurity(null)}
                    className="w-4 h-4 rounded-full border border-bn-line-2 bg-bn-page-2 text-bn-ink-muted text-[10px] flex items-center justify-center hover:border-bn-ink/30 transition-colors shrink-0"
                    aria-label="More info">
                    ?
                  </button>
                </div>
                <p className="text-[12px] text-bn-ink-muted mt-0.5">{s.sub}</p>

                {/* Tooltip */}
                {hoveredSecurity === i && (
                  <div className="absolute left-0 top-full mt-2 z-20 w-[300px] bg-bn-ink text-white text-[12px] leading-relaxed px-4 py-3 rounded-xl shadow-[0_4px_16px_rgba(10,10,10,0.2)]">
                    {s.tooltip}
                    <div className="absolute -top-1.5 left-6 w-3 h-3 bg-bn-ink rotate-45" />
                  </div>
                )}
              </div>
              <span className={`font-mono-bn text-[11px] shrink-0 mt-0.5 ${s.active ? 'text-green-600' : 'text-bn-ink-muted'}`}>
                {s.active ? '✓ Active' : '○ Off'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {toast && <div className="fixed bottom-6 right-6 flex items-center gap-2 px-5 py-3 bg-white border border-bn-line rounded-xl shadow-[0_4px_12px_rgba(10,10,10,0.08)] text-[13px] z-50"><span className="text-green-600">✓</span> {toast}</div>}
    </div>
  )
}
