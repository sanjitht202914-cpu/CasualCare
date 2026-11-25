# CasualCare – SNS Workbench appointment demo

## Already configured in the frontend

Patient clicks Book Appointment -> Vite local proxy `/sns-webhook` -> SNS production webhook `https://api.agents.snsihub.ai/webhook/casual-care-master` -> SNS Switch Route 2 -> HTTP POST Supabase `appointments` -> Webhook Response. Frontend confirms the saved record via Supabase GET. The frontend does **not** call the Edge Function or insert an appointment directly.

## Workbench checks (not possible to configure from this ZIP)

1. Activate/publish the SNS workflow so its **production** webhook URL is live.
2. Switch Route 2 must match incoming `body.action == "book_appointment"` (or `body.mode == "book_appointment"`). Adjust the route expression if it currently expects another value.
3. Route 2 HTTP Request method `POST`, URL `https://gpcyxxeeknsdfubcpeub.supabase.co/rest/v1/appointments`.
4. Headers: `Content-Type: application/json`, `apikey: <Supabase anon/publishable key>`, `Prefer: return=representation`. Use only a demo-safe key and appropriate table policy; **never use a service-role key in the frontend or shared project**.
5. Route 2 HTTP Request JSON body must map webhook body fields: `patient_id`, `doctor_id`, `appointment_date`, `appointment_time`, `status: scheduled`. The exact SNS expression syntax depends on the node's editor; verify the request preview before executing.
6. Route 2 must connect to a Webhook Response. Return JSON from the HTTP Request (or `{ "success": true }` after a successful POST).
7. In Supabase, verify `appointments` has a policy allowing this demo write. If the HTTP node returns 401/403, fix the policy or use a server-side credential with least privilege; do not disable security on real patient data.

## Test

Run `npm install` and `npm run dev`, sign in, choose a **new** date/time, click Book Appointment once. Confirm it appears in Supabase `appointments`. If SNS returned 200 but no row was saved, the frontend reports an error instead of a false success. Do not retry until checking the database for a saved row.

**Limitations:** SNS Workbench configuration is remote and cannot be changed by editing this ZIP. The Vite proxy is for local demo, not a production deployment. Use fictional patient data for this demo.
