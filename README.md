# Bitcoin Names — App

Full Next.js app. All data mocked. Hand to devs to wire up real backends.

## Run
```bash
npm install && npm run dev
```
→ http://localhost:3000

## Demo credentials
| Username | Password  |
|----------|-----------|
| satoshi  | Demo1234! |
| demo     | Demo1234! |
| filip    | Filip123! |

Or create an account on the signup screen (stored in localStorage).

## Routes
- `/login` — auth (Orobit Hub flow: start → create → create-with-password / sign-in)
- `/app` — dashboard
- `/app/search` — name search + 3-step buy flow
- `/app/marketplace` — browse + buy secondary listings
- `/app/my-names` — manage owned names
- `/app/identity` — edit records (wallet, lightning, site, twitter, nostr)
- `/app/activity` — transaction history

## Dev handoff
- **Auth** → replace `lib/auth.tsx` with real Supabase auth
- **Data** → replace `lib/mock-data.ts` with real API calls
- No env vars needed for mock version — deploys to Vercel as-is
