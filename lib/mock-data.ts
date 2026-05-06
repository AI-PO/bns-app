export const MOCK_OWNED_NAMES = [
  {
    name: 'satoshi',
    isPrimary: true,
    status: 'on-chain' as const,
    records: {
      wallet: 'bc1q9xj7fkn3d8r2p...mock',
      lightning: 'satoshi@btc',
      site: 'ipfs://bafybeig...',
      twitter: '',
      nostr: '',
    },
    registeredAt: 'Block #874,156',
  },
  {
    name: 'lightning',
    isPrimary: false,
    status: 'on-chain' as const,
    records: {
      wallet: 'bc1q9xj7fkn3d8r2p...mock',
      lightning: '',
      site: '',
      twitter: '',
      nostr: '',
    },
    registeredAt: 'Block #873,291',
  },
]

export const MOCK_MARKETPLACE = [
  { name: 'vault',   chars: 5, price: 0.22, change: '+11%', category: 'standard' },
  { name: 'halving', chars: 7, price: 0.31, change: '+9%',  category: 'new'      },
  { name: 'genesis', chars: 7, price: 0.84, change: '+18%', category: 'premium'  },
  { name: 'taproot', chars: 7, price: 0.44, change: '+14%', category: 'premium'  },
  { name: 'miner',   chars: 5, price: 0.15, change: '+6%',  category: 'standard' },
  { name: 'node',    chars: 4, price: 0.62, change: '+22%', category: '4char'    },
  { name: 'defi',    chars: 4, price: 0.55, change: '+19%', category: '4char'    },
  { name: 'moon',    chars: 4, price: 0.38, change: '+8%',  category: '4char'    },
  { name: 'block',   chars: 5, price: 0.19, change: '+7%',  category: 'new'      },
  { name: 'chain',   chars: 5, price: 0.23, change: '+12%', category: 'standard' },
  { name: 'oracle',  chars: 6, price: 0.28, change: '+5%',  category: 'standard' },
  { name: 'proof',   chars: 5, price: 0.17, change: '+3%',  category: 'new'      },
]

export const MOCK_ACTIVITY = [
  { type: 'register', name: 'satoshi.btc', time: '2 days ago', block: '874,156', amount: '-0.005 BTC', txid: '7f3a...' },
  { type: 'update',   name: 'satoshi.btc', time: '1 day ago',  block: '874,244', amount: '-fees',      txid: null },
  { type: 'register', name: 'lightning.btc', time: '8 days ago', block: '873,291', amount: '-0.003 BTC', txid: '2e9b...' },
]

export const TAKEN_NAMES = [
  'satoshi','bitcoin','btc','nakamoto','lightning','blockchain',
  'crypto','web3','orobit','halving','genesis','coinbase','ledger','miner',
]

export function getNamePrice(name: string): string {
  if (name.length <= 3) return '0.10 BTC'
  if (name.length <= 4) return '0.05 BTC'
  if (name.length <= 6) return '0.015 BTC'
  return '0.005 BTC'
}

export function getNameType(name: string): string {
  if (name.length <= 3) return 'Ultra Premium'
  if (name.length <= 4) return 'Premium'
  if (name.length <= 6) return 'Standard+'
  return 'Standard'
}
