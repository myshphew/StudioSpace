# StudioSpace

A peer-to-peer marketplace for creative workspaces — photography studios, podcast rooms, rehearsal spaces, darkrooms — built as a fully working **frontend demo** with Next.js 16 (App Router, Cache Components / Partial Prerendering), Tailwind CSS v4 and a shadcn-style Radix UI kit.

Every flow in the spec is wired end-to-end against a browser-persisted demo data layer, so the app works out of the box with **no backend**. All studios, hosts, reviews and bookings are **fictional** and live in your own browser's localStorage.

> Demo for illustration. It is not a production booking system and nothing here is real.

## Quick start

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build (31 routes, static + PPR)
npm run lint       # eslint (react-compiler-era rules enabled)
```

### Demo account

| email | password |
| --- | --- |
| `demo@studiospace.app` | `demo-1234` |

Signing in as the demo account seeds a full host/creator story:

- 2 owned listings — an **active** "Corner Frame Studio" and a **draft** "Second Voice Recording Room"
- 6 of your own bookings across every state (pending, confirmed, past, cancelled, declined)
- 4 incoming booking requests from fictional creators (2 pending, 1 confirmed, 1 declined)
- 2 saved favorites

Any account you create yourself gets the same seeded content. Sessions and data persist in localStorage (`studiospace.demo.v1`, `studiospace.demo.session.v1`); sign out or clear them for a fresh start.

## What's in the demo

- **Explore** — `/studios` with search, category filter, sort and availability labels; studio detail pages with gallery, amenities, host info and fictional reviews.
- **Booking** — pick a date, start time and duration from the studio's real weekly hours; submit a *request* (never an instant reservation); the host must **approve** it before the time is locked. Overlapping requests can be declined, and the decline tells the creator the slot is gone.
- **Host side** — Add Studio wizard (5 steps, draft or publish), My Listings with publish/pause/archive statuses, request queue with Approve/Decline, per-studio booking registers, full listing editor (photos, equipment, amenities, weekly hours, blackout dates, book-ahead window).
- **Account** — profile editing, My Bookings with cancel, Favorites, and the auth flows (login, register; Google sign-in stubs explain that the real backend will wire them up).
- **Guest access** — browsing is open; gated pages bounce guests to `/login?next=…`.

Payment is deliberately not part of the demo: pricing is shown in **৳ (BDT)** with the security deposit listed separately, and every booking flow states that payment is arranged directly with the host.

## Routes

| Access | Routes |
| --- | --- |
| Public | `/`, `/studios`, `/studios/[id]`, `/how-it-works`, `/about`, `/contact`, `/faq`, `/terms`, `/privacy` |
| Guest only | `/login`, `/register` |
| Signed in | `/profile`, `/my-bookings`, `/favorites`, `/add-studio`, `/my-listings`, `/my-listings/[id]/edit`, `/my-listings/[id]/bookings`, `/my-listings/requests` |
| System | not-found (inline 404 inside studio detail), `error.tsx`, `loading.tsx` |

Deliberately out of scope per the sitemap: forgot password, settings, notifications, messaging and dashboards.

## How the demo data layer works

`src/lib/demo/store.ts` is the seam. It exposes an observable store seeded from `SEED_STUDIOS` + localStorage, and its function signatures mirror the future REST contract:

- **Session** — `signIn`, `signUp`, `signOut`, `getSessionSnapshot`, `updateProfile`
- **Listings** — `allStudios`, `getStudioById`, `createListing`, `updateListing`, `setListingStatus`
- **Bookings** — `createBooking`, `acceptBooking`, `declineBooking`, `cancelBooking`, `bookingConflicts`, `displayStatus`
- **Favorites** — `toggleFavorite`, `isFavorite`

Connecting the real backend (an external Express + MongoDB service) means swapping these bodies for `fetch` calls; pages and components don't change.

House rules that keep the store safe with React 19 + Cache Components:

- First client paint matches the prerendered HTML: components read **subscribed snapshots** (`useDemoData`) rather than store getters during render, so nothing time- or storage-dependent renders early.
- Clock-dependent work (availability labels, preselected dates, footer year) happens only after mount via the `useMounted()` external store in `src/lib/hooks.ts` — no clocks during prerender, no `setState` in effects.
- Ownership-gated screens (`RequireAuth`) only render once the session store is hydrated; forms then mount with a `key` and seed from state initializers instead of sync effects.

## Architecture notes

- `src/app/(main)` — public shell (header/mobile nav/footer); `src/app/(auth)` — split-screen auth layout.
- `src/lib/demo/store.ts` — auth engine + observable data store (`useSyncExternalStore`-compatible).
- `src/lib/hooks.ts` — `useDemoData`, `useMounted`, `useAvailabilityFor`.
- `src/lib/schedule.ts` — slot generation, overlap prevention, availability labels; `src/lib/format.ts` — BDT currency, dates, labels.
- `src/components` — `studio/`, `booking/`, `host/`, `account/`, `marketing/`, `layout/`, `ui/`.

## Design system

- Canvas cream `#F7F4EE`, charcoal `#111111`, signal orange `#FF6B35`; soft tint backgrounds for status colors (status is never color alone — badges carry text).
- Type: Satoshi for display headings, Instrument Sans for UI, Instrument Serif for editorial accents.
- Editorial layout language: big display numerals, generous whitespace, "eyebrow" labels.

## Stack

Next.js 16.4.5 · React 19.3 · Tailwind CSS v4 · Radix UI (`radix-ui` package) · lucide-react · sonner · lenis (smooth scrolls) · react-compiler lint rules.
