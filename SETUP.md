# Casual Care: Supabase-connected frontend

## What was changed
- Medicine Tracker: reads, adds and updates medicines in Supabase (per signed-in user).
- Recovery Tracker: reads and updates milestones, saves daily mood/pain/symptom check-ins, shows recent entries.
- SMS: a real **Send test SMS** button calls an optional authenticated Supabase Edge Function that sends through Twilio. It reports provider acceptance, **not confirmed delivery**.
- Login: Supabase email/password login, with row-level security; no private credentials shipped in the frontend.
- Other screens still contain original demonstration data and placeholder behaviors. Do not treat them as live medical services.

## Setup (required before live database use)
1. In Supabase SQL Editor, run `supabase_setup.sql` once. It creates three `cc_` tables with RLS policies. It does **not** alter your existing patients/doctors/appointments tables.
2. In Supabase Authentication > Users, create a **test user** with an email and password (or enable email signup and confirm it). Use test data only.
3. Copy `.env.example` to `.env`. Set your Supabase Project URL and **publishable/anon key** (Project Settings > API). Never use a service-role/secret key in `VITE_` variables.
4. Run `npm install`, then `npm run dev`. Sign in using your test user.
5. Start with empty Medicine and Recovery lists. Add a medicine, mark it taken, submit a recovery check-in, refresh the browser, and confirm data persists. You may add milestone rows manually in Supabase Table Editor, setting `owner_id` to the test user's Auth UID.

## Optional SMS setup
1. Configure a Twilio SMS-capable number and verify the destination where required by your Twilio account. Real SMS may incur fees.
2. Deploy `supabase/functions/send-sms` using Supabase CLI. Keep JWT verification enabled where supported. Set function secrets `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM_NUMBER`, and `ALLOWED_ORIGIN` (your exact website origin). Supabase provides `SUPABASE_URL` and `SUPABASE_ANON_KEY` in most deployments; verify they are present.
3. On Check-up & SMS, enter your own permitted destination number in international format and select **Send test SMS**.
4. SMS provider acceptance is not delivery confirmation. Check Twilio delivery logs/status callbacks for delivery. The Edge Function is a basic demo, not a production SMS system: before public deployment, add rate limiting, approved recipient ownership/verification, abuse controls, and consent management.

## Notes
- Session tokens are held in browser session storage. A production healthcare app needs a fuller authentication/session management design and privacy/security review.
- The supplied website includes mock patient identity and clinical content; it remains demo-only outside the two connected trackers.
- No actual Supabase credentials or SMS provider account were supplied. Therefore **live connectivity and SMS delivery have not been verified**.
