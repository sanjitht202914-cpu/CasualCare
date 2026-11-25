import { createClient } from 'npm:@supabase/supabase-js@2';

const cors = {
  'Access-Control-Allow-Origin': '*', // Local demo only; restrict to your deployed origin for production.
  'Access-Control-Allow-Headers': 'authorization, apikey, content-type, x-client-info',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
};
const reply = (status: number, body: Record<string, unknown>) =>
  new Response(JSON.stringify(body), { status, headers: cors });

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
  if (req.method !== 'POST') return reply(405, { error: 'Method not allowed' });
  const auth = req.headers.get('Authorization');
  if (!auth?.startsWith('Bearer ')) return reply(401, { error: 'Sign in is required' });
  const url = Deno.env.get('SUPABASE_URL');
  const anon = Deno.env.get('SUPABASE_ANON_KEY');
  if (!url || !anon) return reply(500, { error: 'Supabase environment is not configured' });
  const db = createClient(url, anon, { global: { headers: { Authorization: auth } }, auth: { persistSession: false } });
  const { data: userData, error: userError } = await db.auth.getUser();
  if (userError || !userData.user) return reply(401, { error: 'Session expired. Please sign in again.' });
  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return reply(400, { error: 'Invalid JSON body' }); }
  const { patient_id, doctor_id, appointment_date, appointment_time } = body;
  if (typeof patient_id !== 'string' || typeof doctor_id !== 'string' ||
      typeof appointment_date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(appointment_date) ||
      typeof appointment_time !== 'string' || !/^([01]\d|2[0-3]):[0-5]\d$/.test(appointment_time)) {
    return reply(400, { error: 'Valid patient, doctor, date and time are required' });
  }
  // Query as the authenticated user; RLS must also enforce ownership on these tables.
  const { data: patients, error: patientError } = await db.from('patients').select('patient_id').eq('patient_id', patient_id).eq('user_id', userData.user.id).limit(1);
  if (patientError) return reply(403, { error: 'Unable to verify patient ownership. Check RLS policies.' });
  if (!patients?.length) return reply(403, { error: 'This patient does not belong to your login' });
  const { data: doctors, error: doctorError } = await db.from('doctors').select('doctor_id').eq('doctor_id', doctor_id).limit(1);
  if (doctorError || !doctors?.length) return reply(400, { error: 'Doctor not found or inaccessible' });
  const { data: existing, error: existingError } = await db.from('appointments').select('appointment_id').eq('patient_id', patient_id).eq('doctor_id', doctor_id).eq('appointment_date', appointment_date).eq('appointment_time', appointment_time).neq('status', 'cancelled').limit(1);
  if (existingError) return reply(403, { error: 'Unable to check existing bookings. Check appointments RLS.' });
  if (existing?.length) return reply(409, { error: 'This appointment is already booked. Choose a different date or time.' });
  const { data, error } = await db.from('appointments').insert({ patient_id, doctor_id, appointment_date, appointment_time, status: 'scheduled' }).select().single();
  if (error) return reply(400, { error: error.message });
  return reply(201, { success: true, message: 'Appointment booked successfully', appointment: data });
});
