'use client'
import { useState } from 'react'
import { useAuth } from '@/lib/auth'
import { MOCK_OWNED_NAMES } from '@/lib/mock-data'

export default function IdentityPage() {
  const { user } = useAuth()
  const [records, setRecords] = useState({ ...MOCK_OWNED_NAMES[0].records, nostr: '' })
  const [toast, setToast] = useState('')
  const save = () => { setToast('Records saved on-chain'); setTimeout(() => setToast(''), 3000) }

  const FIELDS = [
    {icon:'₿',label:'Wallet',key:'wallet',ph:'bc1q...'},
    {icon:'⚡',label:'Lightning',key:'lightning',ph:'yourname@lightning.node'},
    {icon:'🌐',label:'Site',key:'site',ph:'ipfs://... or https://...'},
    {icon:'𝕏',label:'Twitter',key:'twitter',ph:'@handle'},
    {icon:'📡',label:'Nostr',key:'nostr',ph:'npub...'},
  ]

  return (
    <div className="p-7">
      <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-[22px] font-medium tracking-[-0.03em] text-bn-ink">Identity & Records</h1>
          <p className="text-[14px] text-bn-ink-muted mt-1">Manage your primary .btc name and what it resolves to.</p>
        </div>
        <button onClick={save} className="button button-primary text-[13px] px-5 py-2.5 rounded-full">Save changes</button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="bg-white border border-bn-line rounded-xl overflow-hidden shadow-[0_1px_3px_rgba(10,10,10,0.05)] mb-4">
            <div className="h-[72px] border-b border-bn-line relative" style={{background:'linear-gradient(135deg,rgba(247,147,26,0.1),rgba(247,147,26,0.02))'}}>
              <div className="absolute bottom-[-22px] left-5 w-11 h-11 rounded-[12px] bg-bn-accent border-[2px] border-white flex items-center justify-center text-[18px] font-bold text-white shadow-[0_2px_8px_rgba(247,147,26,0.4)]">
                {user?.username[0].toUpperCase()}
              </div>
            </div>
            <div className="px-5 pt-9 pb-5">
              <p className="text-[20px] font-medium tracking-[-0.04em] text-bn-ink mb-1">{user?.username}<span className="text-bn-accent">.btc</span></p>
              <div className="flex items-center gap-2 font-mono-bn text-[11px] text-bn-ink-muted mb-5">
                <span>{user?.address}</span>
                <button onClick={() => setToast('Copied')} className="hover:text-bn-ink-2">⎘</button>
              </div>
              <div className="flex gap-6 py-3.5 border-y border-bn-line mb-4">
                {[['2','Names'],['5','Records'],['874k','Block']].map(([v,l]) => (
                  <div key={l} className="text-center">
                    <p className="text-[18px] font-semibold tracking-[-0.04em] text-bn-accent">{v}</p>
                    <p className="font-mono-bn text-[10px] text-bn-ink-muted uppercase tracking-[0.06em] mt-0.5">{l}</p>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <button onClick={() => setToast('Copied')} className="button button-secondary flex-1 text-[12px] py-2 rounded-full">Share</button>
                <button className="button button-secondary flex-1 text-[12px] py-2 rounded-full">Change Primary</button>
              </div>
            </div>
          </div>

          <div className="bg-white border border-bn-line rounded-xl shadow-[0_1px_3px_rgba(10,10,10,0.05)]">
            <div className="px-5 py-3.5 border-b border-bn-line"><span className="text-[13px] font-semibold text-bn-ink">Security</span></div>
            <div className="px-5 py-4 flex flex-col gap-4">
              {[
                {label:'Taproot Signature',sub:'P2TR key-path spending enabled',active:true},
                {label:'NIST PQC',sub:'CRYSTALS-Dilithium hybrid',active:true},
                {label:'Transfer Lock',sub:'Prevent accidental transfer',active:false},
              ].map(s => (
                <div key={s.label} className="flex items-center justify-between">
                  <div>
                    <p className="text-[13px] font-medium text-bn-ink">{s.label}</p>
                    <p className="text-[12px] text-bn-ink-muted mt-0.5">{s.sub}</p>
                  </div>
                  <span className={`font-mono-bn text-[11px] ${s.active ? 'text-green-600' : 'text-bn-ink-muted'}`}>{s.active ? '✓ Active' : '○ Off'}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white border border-bn-line rounded-xl shadow-[0_1px_3px_rgba(10,10,10,0.05)]">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-bn-line">
            <span className="text-[13px] font-semibold text-bn-ink">Records</span>
            <button className="text-[12px] text-bn-accent hover:text-bn-accent-hover">Edit all</button>
          </div>
          <div className="p-4 flex flex-col gap-2">
            {FIELDS.map(f => (
              <div key={f.key} className="flex items-center bg-bn-page-2 border border-bn-line rounded-xl overflow-hidden focus-within:border-bn-ink/30 transition-colors">
                <div className="w-11 h-11 flex items-center justify-center text-base border-r border-bn-line shrink-0">{f.icon}</div>
                <div className="w-20 px-3 font-mono-bn text-[10px] text-bn-ink-muted uppercase tracking-[0.06em] border-r border-bn-line shrink-0">{f.label}</div>
                <input value={(records as any)[f.key] || ''} onChange={e => setRecords(r => ({...r,[f.key]:e.target.value}))} placeholder={f.ph}
                  className="flex-1 px-3 py-2.5 bg-transparent border-none outline-none font-mono-bn text-[12px] text-bn-ink placeholder-bn-ink-dim" />
                <div className={`px-3 text-[13px] ${(records as any)[f.key] ? 'text-green-500' : 'text-bn-line-2'}`}>{(records as any)[f.key] ? '✓' : '○'}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {toast && <div className="fixed bottom-6 right-6 flex items-center gap-2 px-5 py-3 bg-white border border-bn-line rounded-xl shadow-[0_4px_12px_rgba(10,10,10,0.08)] text-[13px] z-50"><span className="text-green-600">✓</span> {toast}</div>}
    </div>
  )
}
