# SAMTOB P&C — E-commerce Website (Supabase edition)

A full-stack Next.js store for SAMTOB P&C: laptops, phones & gadgets, new and UK used, with nationwide delivery — now running on a real backend (Supabase), real payment methods (bank transfer + Klump BNPL), and a genuine Save-to-Buy feature.

## What changed from the demo version

If you had an earlier version of this site: the JSON-file "database" and the placeholder payment options are gone. This is now wired to:
- **Supabase** (Postgres + Auth + Storage) instead of a local JSON file
- **Bank transfer** (your Samtob P&C Ltd / Wema Bank account) instead of a generic "Pay Now" placeholder
- **Klump** for Buy Now, Pay Later
- **Save-to-Buy**, a real feature: customers commit to save weekly or monthly toward a specific product, log contributions, and you confirm them from the admin panel

This fixes the "Unexpected end of JSON input" crash from the old version — that happened because Vercel's filesystem is read-only in production, so the JSON file couldn't be written to. Supabase has no such problem.

## 1. Set up Supabase (5 minutes)

1. Create a project at [supabase.com](https://supabase.com) (free tier is fine to start)
2. Go to **SQL Editor → New query**, paste the entire contents of `supabase/schema.sql`, and run it. This creates every table, security policy, the storage bucket for product images, and seeds your 12 starter products.
3. Go to **Settings → API** and copy three values into your `.env.local` (copy `.env.example` to `.env.local` first):
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (⚠️ keep this secret — it bypasses all security rules, never expose it in client code or commit it)

## 2. Make yourself an admin

1. Run the site (`npm install && npm run dev`) and register a normal account at `/account/register` with your real email
2. In Supabase's **SQL Editor**, run:
   ```sql
   update public.profiles set role = 'admin'
   where id = (select id from auth.users where email = 'your-real-email@example.com');
   ```
3. Log out and back in (or just visit `/admin/login`) — you now have admin access

## 3. Payment methods

### Bank Transfer (live now, no setup needed)
Your account details are hardcoded in `src/lib/payment-config.ts`:
```
Samtob P&C Ltd · Wema Bank · 0127186331
```
When a customer chooses Bank Transfer at checkout, they see these details (with a copy button) and their order is created with `payment_status: awaiting_confirmation`. Once you've verified the transfer landed in your account, go to **Admin → Orders** and click **Mark Payment Received**.

### Klump (Buy Now, Pay Later)
Add your keys to `.env.local`:
```
NEXT_PUBLIC_KLUMP_PUBLIC_KEY=klp_pk_...
KLUMP_SECRET_KEY=klp_sk_...
```
Until these are set, the BNPL option shows a "not configured yet" notice instead of a broken button — it won't crash checkout.

**Update:** the widget integration is now built directly from Klump's official `klump-react` npm package source (published by `engineering@useklump.com`) — I downloaded and read the actual compiled code rather than guessing from docs. This fixed a real bug: the previous version called a `.initialize()` method that doesn't exist; the correct pattern is `new Klump({ publicKey, data, onSuccess, onError, ... })`, which opens the widget immediately on construction. Still worth running one real sandbox transaction end-to-end before going live, since the exact shape of the `onSuccess` payload (specifically which field holds the transaction reference) wasn't shown in the source and is handled defensively with a few fallback field names in `src/components/KlumpCheckoutButton.tsx` — confirm which one Klump actually sends and simplify that fallback once verified.

## 4. Save-to-Buy

Customers can click **"Save Toward This Device"** on any product page, choose weekly or monthly, and pick how many periods — the app calculates the instalment amount. Each time they transfer money, they log it in their dashboard (`/account/save-to-buy/[id]`) with an optional reference number. You confirm or reject each contribution from **Admin → Save-to-Buy**; confirming automatically updates their progress bar and marks the plan "completed" once fully paid (this happens via a Postgres trigger, not app code, so it's atomic).

## 5. Customer dashboard

Logged-in customers get `/account/dashboard`: total paid, orders awaiting payment, and Save-to-Buy progress at a glance, plus separate pages for order history and Save-to-Buy plans. The header's account icon links here automatically once logged in.

## 6. Deploying

Standard Vercel deployment:
1. Push to GitHub, import into Vercel
2. Add the same environment variables from `.env.local` in Vercel's project settings
3. Deploy

Unlike the old version, nothing here depends on writing to the local filesystem, so it will work correctly on Vercel's serverless/read-only environment.

## Known items to double-check before go-live

- **Klump `onSuccess` payload shape** — verified the widget construction against Klump's real official package source (see note above), but test one real sandbox transaction to confirm which field holds the transaction reference
- **Product images**: uploads now go to Supabase Storage (`product-images` bucket, public read) instead of local disk — this persists correctly in production
- A small Next.js deprecation warning appears at build time (`middleware` → `proxy` convention). It doesn't break anything; if you want it gone, rename `src/middleware.ts` to `src/proxy.ts` and update the export name if Next requires it by the time you deploy — check Next's changelog since this is a very recent convention shift

## Project structure

```
supabase/schema.sql       → paste into Supabase SQL Editor — the entire backend schema
src/
  middleware.ts           → keeps Supabase auth sessions refreshed on every request
  lib/
    supabase/
      client.ts           → browser Supabase client
      server.ts           → server Supabase client (cookie-based) + admin/service-role client
    db.ts                 → data access layer — all product/order/save-to-buy queries
    auth.ts                → reads the current Supabase Auth session + profile role
    payment-config.ts      → bank details + Klump public key
    format.ts               → currency formatting, delivery fee calculation
  app/
    api/                   → REST endpoints: auth, products, orders, klump/verify, upload, save-to-buy
    admin/(protected)/     → admin dashboard, products, orders, save-to-buy management
    account/(protected)/   → customer dashboard, orders, save-to-buy plans
    checkout/               → bank transfer + Klump checkout flow
  components/
    BankTransferDetails.tsx    → reusable bank account panel with copy buttons
    KlumpCheckoutButton.tsx    → Klump widget wrapper
    SaveToBuyButton.tsx        → "Save toward this device" modal (product page)
    ContributionForm.tsx       → customer logs a Save-to-Buy transfer
    ContributionReviewControl.tsx → admin confirms/rejects a contribution
    PaymentStatusControl.tsx  → admin marks a bank-transfer order as paid
```

## Local development

```bash
cp .env.example .env.local   # then fill in your Supabase (and optionally Klump) keys
npm install
npm run dev
```
