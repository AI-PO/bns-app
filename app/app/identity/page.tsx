'use client'
import { useState } from 'react'
import { useAuth } from '@/lib/auth'
import { MOCK_OWNED_NAMES } from '@/lib/mock-data'

const mono = { fontFamily: 'var(--font-source-code-pro)' } as const

export default function IdentityPage() {
  const { user } = useAuth()
  const [records, setRecords] = useState(MOCK_OWNED_NAMES[0].records)
  const [toast, setToast] = useState('')
  const save = () => { setToast('Records saved on-chain'); setTimeout(() => setToast(''), 3000) }

  const FIELDS = [
    { icon:'₿', label:'Wallet',    key:'wallet',    ph:'bc1q...' },
    { icon:'⚡', label:'Lightning', key:'lightning', ph:'yourname@lightning.node' },
    { icon:'🌐', label:'Site',      key:'site',      ph:'ipfs://... or https://...' },
    { icon:'𝕏', label:'Twitter',   key:'twitter',   ph:'@handle' },
    { icon:'📡', label:'Nostr',     key:'nostr',     ph:'npub...' },
  ]

  return (
    <div className="p-7">
      <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-[22px] font-semibold tracking-[-0.03em] text-bn-text">Identity & Records</h1>
          <p className="text-[14px] text-bn-text-muted mt-1">Manage your primary .btc name and what it resolves to.</p>
        </div>
        <button onClick={save} className="button button-primary text-[13px] px-5 py-2.5 rounded-full">Save changes</button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          {/* Profile card */}
          <div className="bg-bn-surface border border-bn-border rounded-xl overflow-hidden mb-4">
            <div className="h-[72px] border-b border-bn-border relative" style={{ background: 'linear-gradient(135deg, rgba(247,147,26,0.15), rgba(247,147,26,0.03))' }}>
              <div className="absolute bottom-[-24px] left-5 w-12 h-12 rounded-[13px] bg-bn-accent border-[3px] border-bn-surface flex items-center justify-center text-[18px] font-bold text-bn-bg">
                {user?.username[0].toUpperCase()}
              </div>
            </div>
            <div className="px-5 pt-9 pb-5">
              <p className="text-[20px] font-semibold tracking-[-0.04em] text-bn-text mb-1" style={mono}>{user?.username}<span className="text-bn-accent">.btc</span></p>
              <div className="flex items-center gap-2 text-[11px] text-bn-text-dim mb-5" style={mono}>
                <span>{user?.address}</span>
                <button onClick={() => setToast('Copied')} className="hover:text-bn-text-muted">⎘</button>
              </div>
              <div className="flex gap-6 py-3.5 border-y border-bn-border mb-4">
                {[['2','Names'],['5','Records'],['874k','Block']].map(([v,l]) => (
                  <div key={l} className="text-center">
                    <p className="text-[18px] font-semibold tracking-[-0.04em] text-bn-accent">{v}</p>
                    <p className="text-[10px] text-bn-text-dim uppercase tracking-[0.06em] mt-0.5" style={mono}>{l}</p>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <button onClick={() => setToast('Copied')} className="button button-secondary flex-1 text-[12px] py-2 rounded-full">Share</button>
                <button className="button button-secondary flex-1 text-[12px] py-2 rounded-full">Change Primary</button>
              </div>
            </div>
          </div>

          {/* Security */}
          <div className="bg-bn-surface border border-bn-border rounded-xl overflow-hidden">
            <div className="px-5 py-3.5 border-b border-bn-border"><span className="text-[13px] font-semibold text-bn-text">Security</span></div>
            <div className="px-5 py-4 flex flex-col gap-4">
              {[
                { label:'Taproot Signature', sub:'P2TR key-path spending enabled', active:true },
                { label:'NIST PQC', sub:'CRYSTALS-Dilithium hybrid', active:true },
                { label:'Transfer Lock', sub:'Prevent accidental transfer', active:false },
              ].map(s => (
                <div key={s.label} className="flex items-center justify-between">
                  <div>
                    <p className="text-[13px] font-medium text-bn-text">{s.label}</p>
                    <p className="text-[12px] text-bn-text-dim mt-0.5">{s.sub}</p>
                  </div>
                  <span className={`text-[11px] ${s.active ? 'text-positive-green' : 'text-bn-text-dim'}`} style={mono}>{s.active ? '✓ Active' : '○ Off'}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Records editor */}
        <div className="bg-bn-surface border border-bn-border rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-bn-border">
            <span className="text-[13px] font-semibold text-bn-text">Records</span>
            <button className="text-[12px] text-bn-accent hover:text-bn-accent-hover">Edit all</button>
          </div>
          <div className="p-4 flex flex-col gap-2">
            {FIELDS.map(f => (
              <div key={f.key} className="flex items-center bg-bn-bg border border-bn-border rounded-xl overflow-hidden">
                <div className="w-11 h-11 flex items-center justify-center text-base border-r border-bn-border shrink-0">{f.icon}</div>
                <div className="w-20 px-3 text-[10px] text-bn-text-dim uppercase tracking-[0.06em] border-r border-bn-border shrink-0" style={mono}>{f.label}</div>
                <input value={(records as any)[f.key] || ''} onChange={e => setRecords(r => ({...r,[f.key]:e.target.value}))}
                  placeholder={f.ph}
                  className="flex-1 px-3 py-2.5 bg-transparent border-none outline-none text-[12px] text-bn-text placeholder-bn-text-dim"
                  style={mono} />
                <div className={`px-3 text-[13px] ${(records as any)[f.key] ? 'text-positive-green' : 'text-bn-border-light'}`}>
                  {(records as any)[f.key] ? '✓' : '○'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {toast && <div className="fixed bottom-6 right-6 flex items-center gap-2 px-5 py-3 bg-bn-surface border border-positive-green/30 rounded-xl text-[13px] text-bn-text z-50"><span className="text-positive-green">✓</span> {toast}</div>}
    </div>
  )
}
