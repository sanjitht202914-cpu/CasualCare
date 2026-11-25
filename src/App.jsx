import React, { useState, useEffect } from 'react';
import { api, configured, getSession, signIn, logout, medicineFromRow } from './services/supabaseApi';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import DoctorPortal from './components/DoctorPortal';
import AIAssistant from './components/AIAssistant';
import MedicineTracker from './components/MedicineTracker';
import RecoveryTracker from './components/RecoveryTracker';
import FamilyCircle from './components/FamilyCircle';
import MedicalRecords from './components/MedicalRecords';
import CheckupReminders from './components/CheckupReminders';
import EmergencySOS from './components/EmergencySOS';

import { 
  initialPatientData, 
  initialMedicines, 
  initialRecoveryMilestones, 
  initialFamilyCircle, 
  initialMedicalRecords, 
  initialReminders,
  initialAppointments,
  initialNotificationHistory,
  initialReminderSettings,
  translations
} from './data/mockData';

export default function App() {
  const [lang, setLang] = useState('en'); // 'en' | 'ta'
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const [session, setSession] = useState(getSession());
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [syncError, setSyncError] = useState('');
  const [syncBusy, setSyncBusy] = useState(false);
  const [recoveryLogs, setRecoveryLogs] = useState([]);
  const [dataReady, setDataReady] = useState(false);
  const [doctors, setDoctors] = useState([]);
  // Platform State
  const [patient, setPatient] = useState(null);
  const [medicines, setMedicines] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [familyCircle, setFamilyCircle] = useState(initialFamilyCircle);
  const [records, setRecords] = useState(initialMedicalRecords);
  const [reminders, setReminders] = useState(initialReminders);
  const [appointments, setAppointments] = useState([]);
  const [notificationHistory, setNotificationHistory] = useState(initialNotificationHistory);
  const [reminderSettings, setReminderSettings] = useState(initialReminderSettings);
  
  // Emergency & Escalation State
  const [sosActive, setSosActive] = useState(false);
  const [sosBusy, setSosBusy] = useState(false);
  const [escalationLevel, setEscalationLevel] = useState(0); // 0, 1, 2, 3

  useEffect(() => {
    if (!configured || !session) return;
    let cancelled=false;
    setDataReady(false);
    Promise.allSettled([api.getMyPatient(),api.listDoctors(),api.listAppointments(),api.listMedicines(),api.listRecovery()]).then(([profile,docs,appts,meds,logs])=>{
      if(cancelled)return;
      if(profile.status==='fulfilled') {
        const p=profile.value;
        setPatient({id:p.patient_id,name:p.name,age:p.age??'—',gender:p.gender??'—',bloodGroup:p.blood_group??'—',phone:p.phone??'—',address:p.address??'—',condition:p.condition??'—',avatar:p.avatar_url||'',vitals:{heartRate:'—',bp:'—',bloodSugar:'—',spo2:'—',temperature:'—'},recoveryScore:'—'});
      } else {setPatient(null);setSyncError(profile.reason.message);}
      if(docs.status==='fulfilled') setDoctors(docs.value.map(d=>({id:d.doctor_id,name:d.name,department:d.specialization||'General Medicine',experience:'',qualification:'',hospital:'',patientsCount:'—',avatar:''})));
      if(appts.status==='fulfilled') setAppointments(appts.value.map(a=>({id:a.appointment_id,appointmentDate:a.appointment_date,appointmentTime:a.appointment_time,status:a.status==='scheduled'?'Upcoming':a.status,doctor:docs.status==='fulfilled'?docs.value.find(d=>d.doctor_id===a.doctor_id)?.name||'Unassigned':'Unassigned'})));
      if(meds.status==='fulfilled') setMedicines(meds.value.map(medicineFromRow));
      if(logs.status==='fulfilled') setRecoveryLogs(logs.value);
      const errors=[docs,appts,meds,logs].filter(x=>x.status==='rejected').map(x=>x.reason.message);
      if(errors.length)setSyncError(prev=>[prev,...errors].filter(Boolean).join(' | '));
      setDataReady(true);
    });
    return ()=>{cancelled=true;};
  },[session]);
  async function handleSignIn(e){
    e.preventDefault();setSyncBusy(true);setSyncError('');
    try {const s=await signIn(email,password);setSession(s);setPassword('');}
    catch(e){setSyncError(e.message);} finally {setSyncBusy(false);}
  }
  const reportError = e => setSyncError(e.message || String(e));
  async function handleSaveRecovery(entry){
    try { const rows=await api.addRecovery(entry); setRecoveryLogs(prev=>[...rows,...prev]); return true; }
    catch(e){reportError(e);return false;}
  }
  const handleSendEmergencyAlert = async (customMessage, customLocation) => {
    if (sosBusy) return { success: false, error: 'Alert dispatch already in progress' };
    setSosBusy(true);
    setSyncError('');
    try {
      const patientId = patient?.id || patient?.patient_id || 'PT-9042';
      const location = customLocation || patient?.address || 'Plot 42, 4th Avenue, Anna Nagar, Chennai - 600040';
      const message = customMessage || `Critical Emergency SOS: Immediate ACLS Ambulance & Paramedic dispatch requested for patient ${patient?.name || patientId}.`;

      const result = await api.sendEmergencyAlert({
        patientId,
        location,
        message
      });
      setSosActive(true);
      return { success: true, result };
    } catch (e) {
      reportError(e);
      return { success: false, error: e.message || String(e) };
    } finally {
      setSosBusy(false);
    }
  };

  const handleTriggerSOS = async () => {
    setActiveTab('sos');
    if (!sosActive && !sosBusy) {
      await handleSendEmergencyAlert();
    }
  };

  const handleToggleMedicine = async (medId) => {
    const med=medicines.find(m=>m.id===medId); if(!med)return;
    try {await api.toggleMedicine(medId,!med.takenToday);setMedicines(prev=>prev.map(m=>m.id===medId?{...m,takenToday:!m.takenToday}:m));setSyncError('');}
    catch(e){reportError(e);}
  };
  const handleAddMedicine = async (newMed) => {
    try {
      const rows=await api.addMedicine({name:newMed.name,dosage:newMed.dosage,timing:newMed.timing,frequency:newMed.frequency,purpose:newMed.purpose,remaining_days:newMed.remainingDays,taken_today:false});
      setMedicines(prev=>[...rows.map(medicineFromRow),...prev]);setSyncError('');return true;
    }catch(e){reportError(e);return false;}
  };
  const handleToggleMilestone = () => setSyncError('Recovery milestones are not configured in this database.');
  const handleBookAppointment = async (doctorId,date,time) => {
    try {
      const rows=await api.bookAppointment(doctorId,date,time);
      setAppointments(prev=>[...prev,...rows.map(a=>({id:a.appointment_id,appointmentDate:a.appointment_date,appointmentTime:a.appointment_time,status:'Upcoming',doctor:doctors.find(d=>d.id===a.doctor_id)?.name||'Unassigned'}))]);
      setSyncError('');
      return { success: true };
    } catch(e) {
      reportError(e);
      return { success: false, error: e.message || String(e) };
    }
  };
  const handleAddFamilyContact = (contact) => {
    setFamilyCircle((prev) => [...prev, contact]);
  };

  const handleAddRecord = (record) => {
    setRecords((prev) => [record, ...prev]);
  };

  if (!configured) return <div className="min-h-screen bg-slate-50 p-10 text-slate-800"><h1 className="text-2xl font-bold">Casual Care – Supabase setup required</h1><p className="mt-3">Copy .env.example to .env, fill in your Supabase project URL and publishable (anon) key, then restart the development server.</p><p className="mt-3">See SETUP.md for the SQL and authentication instructions. Never add a service-role key here.</p></div>;
  if (!session) return <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6"><form onSubmit={handleSignIn} className="bg-white rounded-2xl shadow p-8 w-full max-w-md space-y-4"><h1 className="text-2xl font-bold text-teal-700">Casual Care</h1><p className="text-sm text-slate-600">Sign in with your Supabase Auth email and password to access your private records.</p><input className="border p-3 rounded-lg w-full" type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required/><input className="border p-3 rounded-lg w-full" type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} required/>{syncError&&<p role="alert" className="text-red-700 text-sm">{syncError}</p>}<button disabled={syncBusy} className="bg-teal-600 text-white p-3 rounded-lg w-full">{syncBusy?'Signing in...':'Sign in'}</button></form></div>;
  if (!patient) return <div className="min-h-screen bg-slate-50 p-8"><p>{syncError || 'Loading patient profile from Supabase...'}</p><button className="underline text-teal-700 mt-4" onClick={()=>{logout();setSession(null)}}>Sign out</button></div>;
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 selection:bg-teal-500 selection:text-white">
      <div className="bg-white border-b px-4 py-2 flex justify-between items-center text-xs"><span>{dataReady?'Supabase connected':'Loading Supabase data...'}</span><button className="text-teal-700 underline" onClick={()=>{logout();setSession(null);setDataReady(false);}}>Sign out</button></div>
      {syncError&&<div role="alert" className="bg-red-50 text-red-800 p-3 text-sm">Database: {syncError}</div>}
      {/* Top Main Navigation Bar */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        lang={lang} 
        setLang={setLang}
        onTriggerSOS={handleTriggerSOS}
        sosActive={sosActive}
      />

      {/* Main App Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'dashboard' && (
          <Dashboard 
            patient={patient}
            appointments={appointments}
            notificationHistory={notificationHistory}
            reminderSettings={reminderSettings}
            medicines={medicines}
            milestones={milestones}
            familyCircle={familyCircle}
            reminders={reminders}
            lang={lang}
            setActiveTab={setActiveTab}
            onTriggerSOS={handleTriggerSOS}
            onToggleMedicine={handleToggleMedicine}
            escalationLevel={escalationLevel}
          />
        )}

        {activeTab === 'doctor' && (
          <DoctorPortal 
            doctors={doctors}
            onBookAppointment={handleBookAppointment}
            lang={lang}
            patient={patient}
            medicines={medicines}
          />
        )}

        {activeTab === 'ai' && (
          <AIAssistant 
            lang={lang}
            patient={patient}
            medicines={medicines}
            onTriggerSOS={handleTriggerSOS}
          />
        )}

        {activeTab === 'medicines' && (
          <MedicineTracker 
            medicines={medicines}
            onToggleMedicine={handleToggleMedicine}
            onAddMedicine={handleAddMedicine}
            lang={lang}
          />
        )}

        {activeTab === 'recovery' && (
          <RecoveryTracker 
            milestones={milestones}
            patient={patient}
            onToggleMilestone={handleToggleMilestone}
            onSaveRecovery={handleSaveRecovery}
            recoveryLogs={recoveryLogs}
            lang={lang}
          />
        )}

        {activeTab === 'family' && (
          <FamilyCircle 
            familyCircle={familyCircle}
            onAddContact={handleAddFamilyContact}
            lang={lang}
            onTriggerSOS={handleTriggerSOS}
          />
        )}

        {activeTab === 'records' && (
          <MedicalRecords 
            records={records}
            onAddRecord={handleAddRecord}
            lang={lang}
          />
        )}

        {activeTab === 'reminders' && (
          <CheckupReminders 
            patient={patient}
            appointments={appointments}
            notificationHistory={notificationHistory}
            setNotificationHistory={setNotificationHistory}
            reminderSettings={reminderSettings}
            setReminderSettings={setReminderSettings}
            reminders={reminders}
            familyCircle={familyCircle}
            escalationLevel={escalationLevel}
            setEscalationLevel={setEscalationLevel}
            lang={lang}
            setLang={setLang}
          />
        )}

        {activeTab === 'sos' && (
          <EmergencySOS 
            patient={patient}
            lang={lang}
            sosActive={sosActive}
            setSosActive={setSosActive}
            escalationLevel={escalationLevel}
            onSendEmergencyAlert={handleSendEmergencyAlert}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">CasualCare™ Healthcare Network</span>
            <span>•</span>
            <span>Continuous Remote Patient Monitoring System</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-emerald-700 font-medium">● College demo • Not for clinical use</span>
            <span>•</span>
            <span>Emergency Paramedic Line: 108 / 112</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
