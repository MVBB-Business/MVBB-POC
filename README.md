# MVBB — Lahasun Wala

Wholesale garlic/ginger/onion marketplace connecting MVBB (Guntur), its
delivery drivers, and its B2B/B2C buyers.

> This repo started as a prototype to understand business requirements
> end-to-end; it is now the production monorepo re-platforming that
> prototype's validated logic onto a real backend.

This is the production monorepo, re-platforming the validated prototype
(`mvbb-app.jsx`, not committed here) onto a real backend. See
`MVBB-Roadmap.docx` (kept outside this repo) for the full phased plan; the
short version:

- **Phase 1 parity** (current focus): reproduce everything already
  demonstrated in the prototype, on Supabase instead of a shared JSON blob.
- **Phase 2** (post pilot sign-off): batch/lot tracking, distance-based
  payout, multi-stop routing, returns, standing orders.
- **Phase 3** (production hardening): real OTP provider, real auth, payment
  gateway, GST invoicing, offline/PWA mode.

## Structure

```
apps/
  admin/      Next.js — dashboard, desktop-first
  customer/   Next.js — B2B/B2C ordering
  driver/     Next.js PWA to start; migrate to React Native if background
              GPS / push notifications prove necessary
packages/
  domain/
    pricing/    tiered bulk pricing, B2B pricing boost
    inventory/  stock level derivation, stock movements
    orders/     vehicle assignment, order status machine, payout rates
    khata/      credit ledger (sales/payments, credit limit checks)
    dispatch/   driver status transitions
  ui/           shared design tokens (colors, fonts) ported from the prototype
  config/       shared eslint/tsconfig
backend/
  supabase/     schema migrations, RLS (policies pending), future edge functions
```

New domains (e.g. a future supplier portal) should be added as a new
`packages/domain/*` package plus, if needed, a new `apps/*` app — existing
apps and packages should not need to change shape to accommodate growth.

## Getting started

Requires Node.js and pnpm (neither could be verified as installed in the
environment this scaffold was generated in — install both before running
anything below).

```bash
pnpm install
pnpm dev       # runs all apps in parallel via turbo
pnpm test      # runs domain package tests (vitest)
pnpm typecheck
```

## Status

Scaffold stage: workspace wiring, design tokens, and the `pricing`,
`inventory`, `orders`, `khata`, and `dispatch` domain packages are ported
from the prototype with tests. App screens are placeholders — porting the
prototype's actual screens (Home, Cart, Checkout, Admin dashboard tabs,
Driver flow, etc.) is the next slice of work, per the roadmap's Phase 1
parity goal.
