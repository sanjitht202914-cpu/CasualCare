# CasualCare appointment booking — deployment and verification

The patient frontend now calls **only** `POST /functions/v1/book-appointment` using the current Supabase Auth access token. It no longer inserts directly into `appointments`. The function code is at `supabase/functions/book-appointment/index.ts`.

## Required before testing

1. **Deploy/update** the `book-appointment` Edge Function in your Supabase project with the supplied `index.ts` code. Editing this ZIP does not update your already-deployed Supabase function. In the Supabase dashboard, use Edge Functions > book-appointment > Code > replace code > Deploy, or deploy using Supabase CLI.
2. Keep **Verify JWT with legacy secret OFF** if your project uses the newer signing keys; the function validates the access token with `auth.getUser()`.
3. Ensure the signed-in Auth user has a `patients` row with matching `user_id`, and the `doctors` table contains the chosen doctor. Configure Supabase **RLS** so a user can read their own patient and appointment rows and insert appointments only for their own patient ID. A missing policy will cause an error; do not disable RLS to bypass it.
4. Copy `.env.example` to `.env` locally and set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` (public publishable/anon key only). **Never upload `.env` or secret/service-role keys.**
5. Run `npm install` and `npm run dev`, sign in as a patient, and book a **new** date/time. Confirm exactly one row was created in `appointments` and the UI lists it. Do not reuse the previously tested 2026-11-20 10:30 slot.

## Limitations

- The function checks existing appointments before insertion, but **simultaneous** requests can still race. For reliable deduplication, add an appropriate **database unique constraint/index** after cleaning existing duplicate records and deciding how cancelled appointments should be handled.
- This ZIP contains no SNS Workbench workflow export. **SNS is not wired to this booking path**. Avoid adding an SNS HTTP POST to `appointments` as a second write; that would create duplicate bookings. If SNS orchestration is required, route it through one authenticated server-side path, not an unauthenticated browser webhook.
- The `Doctor` tab in this frontend is a **doctor directory/appointment booking screen**, not a separate authenticated doctor account dashboard. True doctor-role access requires a verified doctor-to-Auth-user mapping and role-specific RLS, which are not present in this ZIP. Do not rely on a UI-only role switch to protect patient data.
- This is a college demonstration app, not a production healthcare service. The existing app includes mock medical data and unverified compliance claims.
