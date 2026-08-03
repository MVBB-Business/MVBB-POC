# Backend — Supabase

Replaces the prototype's single shared JSON blob (`window.storage`, key
`mv4_shared`, polled every 6s — see `mvbb-app.jsx` root `App()` component)
with a real Postgres schema, auth, and realtime subscriptions.

## Setup

1. Create a Supabase project.
2. Install the Supabase CLI and link it to this project.
3. Apply `migrations/0001_init.sql`.
4. Generate types into `packages/api-client` (not yet scaffolded — add when
   the first app screen needs live data).

## Not yet done (see MVBB-Roadmap.docx)

- RLS policies (tables have RLS *enabled* but no policies yet — nothing is
  readable/writable until real auth + policies are wired up; do this before
  any app talks to real data, not after).
- Real OTP auth (Twilio/MSG91) — Phase 3.
- Payment gateway (Razorpay) — Phase 3.
- GST/tax ledger tables — Phase 3.
- Batch/lot tracking + expiry, unit conversion — Phase 2.
