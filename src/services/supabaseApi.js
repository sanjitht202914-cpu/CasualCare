import { snsService } from './snsService';

const base = import.meta.env.VITE_SUPABASE_URL?.replace(/\/$/, '');
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
export const configured = Boolean(base && key);
const tokenKey = 'casualcare_session';
export function getSession() { try { return JSON.parse(sessionStorage.getItem(tokenKey) || 'null'); } catch { return null; } }
export function logout() { sessionStorage.removeItem(tokenKey); }
export async function signIn(email, password) {
  if (!configured) throw Error('Set Supabase URL and publishable key in .env first.');
  const response = await fetch(`${base}/auth/v1/token?grant_type=password`, { method:'POST', headers:{apikey:key,'Content-Type':'application/json'}, body:JSON.stringify({email,password}) });
  const data = await response.json();
  if (!response.ok) throw Error(data.msg || data.error_description || data.message || 'Sign in failed');
  sessionStorage.setItem(tokenKey, JSON.stringify(data));
  return data;
}
async function request(table, method='GET', data=null, query='') {
  const session=getSession();
  if (!session?.access_token) throw Error('Please sign in to save data.');
  const response=await fetch(`${base}/rest/v1/${table}${query}`, {method,headers:{apikey:key,Authorization:`Bearer ${session.access_token}`,'Content-Type':'application/json',Prefer:'return=representation'},...(data ? {body:JSON.stringify(data)} : {})});
  const raw=await response.text();
  let parsed; try {parsed=raw?JSON.parse(raw):[];} catch {parsed=raw;}
  if (!response.ok) throw Error(parsed?.message || parsed?.error || `Supabase error ${response.status}`);
  return parsed;
}
export const api = {
  getMyPatient: async () => {
    const session = getSession();
    if (!session?.user?.id) throw Error('Please sign in again.');
    const rows = await request('patients','GET',null,`?select=*&user_id=eq.${encodeURIComponent(session.user.id)}&limit=1`);
    if (!rows.length) throw Error('No patient profile is linked to this login.');
    return rows[0];
  },
  listDoctors: () => request('doctors','GET',null,'?select=doctor_id,name,specialization'),
  listAppointments: async () => {
    const p=await api.getMyPatient();
    return request('appointments','GET',null,`?select=*&patient_id=eq.${encodeURIComponent(p.patient_id)}&order=appointment_date.asc`);
  },
  bookingInProgress: false,
  bookAppointment: async (doctorId, date, time) => {
    if (!doctorId || !/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^\d{2}:\d{2}$/.test(time)) {
      throw Error('Choose a doctor, appointment date and time.');
    }
    if (api.bookingInProgress) {
      throw Error('Booking is already in progress. Please wait.');
    }
    const patient = await api.getMyPatient();
    const existing = await api.listAppointments();
    if (existing.some(a => String(a.doctor_id) === String(doctorId) && a.appointment_date === date && String(a.appointment_time).slice(0,5) === time && a.status !== 'cancelled')) {
      throw Error('You already booked this doctor at this date and time.');
    }
    api.bookingInProgress = true;
    try {
      // Dispatch booking request to SNS Workbench workflow (module: "appointment")
      // The frontend does not insert directly into Supabase appointments table.
      await snsService.bookAppointmentViaSns({
        patientId: patient.patient_id,
        doctorId,
        appointmentDate: date,
        appointmentTime: time
      });

      // Verification loop: Confirm the record really exists in Supabase.
      // Never show booking confirmation for a webhook 200 alone.
      let verifiedAppointment = null;
      const maxRetries = 4;
      const retryDelayMs = 600;

      for (let attempt = 0; attempt < maxRetries; attempt++) {
        if (attempt > 0) {
          await new Promise(resolve => setTimeout(resolve, retryDelayMs));
        }
        const appointments = await api.listAppointments();
        const matches = appointments.filter(a =>
          String(a.doctor_id) === String(doctorId) &&
          a.appointment_date === date &&
          String(a.appointment_time).slice(0, 5) === time &&
          a.status !== 'cancelled'
        );
        if (matches.length > 0) {
          verifiedAppointment = matches[matches.length - 1];
          break;
        }
      }

      if (!verifiedAppointment) {
        throw Error(
          'SNS Workbench processed the booking, but the appointment record could not be verified in Supabase. ' +
          'Please verify the workflow execution and appointments table before retrying.'
        );
      }

      return [verifiedAppointment];
    } finally {
      api.bookingInProgress = false;
    }
  },
  emergencyInProgress: false,
  sendEmergencyAlert: async ({ patientId, location, message }) => {
    if (api.emergencyInProgress) {
      throw Error('Emergency alert dispatch is already in progress. Please wait.');
    }
    api.emergencyInProgress = true;
    try {
      return await snsService.sendEmergencyAlertViaSns({
        patientId,
        location,
        message
      });
    } finally {
      api.emergencyInProgress = false;
    }
  },
  getPatientFromSns: (patientId) => snsService.getPatientDetailsViaSns(patientId),
  getDoctorFromSns: (doctorId) => snsService.getDoctorDetailsViaSns(doctorId),
  askAiCareAssistant: (message) => snsService.askAiCareAssistant(message),
  listMedicines: async () => {
    const p=await api.getMyPatient();
    return request('medicines','GET',null,`?select=*&patient_id=eq.${encodeURIComponent(p.patient_id)}`);
  },
  addMedicine: async m => {
    const p=await api.getMyPatient();
    return request('medicines','POST',{patient_id:p.patient_id,medicine_name:m.name,dosage:m.dosage,timing:m.timing,taken:false});
  },
  toggleMedicine: (id,taken) => request('medicines','PATCH',{taken},`?medicine_id=eq.${encodeURIComponent(id)}`),
  listRecovery: async () => {
    const p=await api.getMyPatient();
    return request('recovery_logs','GET',null,`?select=*&patient_id=eq.${encodeURIComponent(p.patient_id)}&order=log_date.desc&limit=10`);
  },
  addRecovery: async entry => {
    const p=await api.getMyPatient();
    return request('recovery_logs','POST',{patient_id:p.patient_id,pain_level:entry.pain_level??null,mood:entry.mood??null,symptoms:entry.symptoms??null,notes:entry.notes??null});
  }
};
export const medicineFromRow = r => ({id:r.medicine_id,name:r.medicine_name,dosage:r.dosage,timing:r.timing,frequency:'—',purpose:'—',remainingDays:null,takenToday:!!r.taken,pillColor:'teal'});
