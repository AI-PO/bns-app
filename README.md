# Bitcoin Names — App

Full application for buying, managing, and trading .btc names. Wallet-gated: users must connect their Orobit wallet to buy or manage names.

## Features
- **Search** — check .btc name availability on Bitcoin
- **Buy (mint)** — register a name for the first time via Orobit SCL contract
- **Marketplace** — browse all listed names, filter by price/length/type
- **Bid** — make offers on listed names
- **Profile** — view owned names, manage records, list for sale
- **Auction** — set fixed price or time-limited auction on your names

## Auth model
No email/password login. Identity = wallet address. Connect wallet → you're in.
All actions requiring a wallet (buy, bid, list) prompt a connect-wallet dialog if not connected.

## Stack
- Next.js 15 (App Router)
- Tailwind CSS v4
- Supabase (auth + database)
- Orobit SDK (wallet connection + on-chain transactions)
- Stripe (fiat on-ramp, optional)
- @tanstack/react-query (data fetching)
- @tanstack/react-table (marketplace + profile tables)

## Setup

```bash
cp .env.example .env.local
# Fill in all env vars
npm install
npm run dev
```

## Key flows

### Buy (mint)
1. User searches a name → available
2. If not connected → ConnectWallet dialog opens
3. If connected → `/register/[domain]` → order summary → Orobit transaction → success

### Marketplace
- `/marketplace` — all listings with filter/sort
- `/marketplace/[contract_id]` — single listing: buy now or make offer

### Profile
- `/profile` → tabs: My Names | Listings | Offers | Orders
- From My Names: manage records, list for sale (fixed price or auction), transfer, renew

## Wallet integration
Wallet library is injected via `OrobitContextProvider`. Replace `src/orobit-sdk/provider.ts` with your real SATS Connect / Leather / Xverse implementation.

## Deploy
Vercel — uses `.github/workflows/deploy-vercel.yml`. Set all env vars in Vercel dashboard.
