'use server'
import { TAKEN_NAMES } from '@/lib/mock-data'

export async function isDomainAvailable(name: string): Promise<boolean> {
  // TODO: replace with real on-chain check
  await new Promise(r => setTimeout(r, 400)) // simulate latency
  return !TAKEN_NAMES.includes(name.toLowerCase())
}

export async function isDomainAvailableOnMarketplace(name: string): Promise<string | undefined> {
  // TODO: replace with real marketplace lookup
  return undefined
}
