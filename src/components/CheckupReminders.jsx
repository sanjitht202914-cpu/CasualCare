import React, { useState } from 'react';
import { 
  BellRing, 
  MessageSquare, 
  Send, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  RotateCcw, 
  Settings, 
  Smartphone, 
  User, 
  Building2, 
  Check, 
  CalendarClock, 
  AlertCircle, 
  ShieldCheck, 
  Eye, 
  Sliders, 
  Info,
  PhoneCall,
  History,
  Languages
} from 'lucide-react';
import { reminderService, sendTestSms } from '../services/reminderService';

export default function CheckupReminders({ 
  patient, 
  appointments = [], 
  notificationHistory = [], 
  setNotificationHistory, 
  reminderSettings, 
  setReminderSettings, 
  lang,
  setLang
}) {
  const isTamil = lang === 'ta';
  const [smsStatus,setSmsStatus]=useState('');
  const [smsBusy,setSmsBusy]=useState(false);
  async function handleSmsTest(){
    setSmsBusy(true);setSmsStatus('');
    try {const result=await sendTestSms(mobileInput,'Casual Care: This is your requested SMS test.');setSmsStatus(`SMS accepted by provider (${result.status}). ID: ${result.sid}. Delivery not yet confirmed.`);}
    catch(e){setSmsStatus(`SMS not sent: ${e.message}`);} finally {setSmsBusy(false);}
  }

  // Primary upcoming appointment for reminder scheduling
  const primaryAppointment = appointments.find(a => a.status === 'Upcoming') || appointments[0] || {
    id: "apt-01",
    doctorName: "Dr. K. Ravichandran, MS, MCh",
    hospitalName: "Apollo Specialty Heart Centre, Chennai",
    appointmentDate: "2026-11-14",
    appointmentTime: "10:30 AM"
  };

  // Local state for interactive button actions in demo previews
  const [waActionStatus, setWaActionStatus] = useState(null); // 'confirmed' | 'rescheduled' | null
  const [actionFeedback, setActionFeedback] = useState('');
  const [mobileInput, setMobileInput] = useState(reminderSettings?.registeredMobile || patient?.phone || '+91 98401 23456');
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [selectedPreviewTab, setSelectedPreviewTab] = useState('both'); // 'both' | 'whatsapp' | 'sms'

  // WhatsApp Button: Confirm Appointment (Local State Demo)
  const handleConfirmAppointment = async () => {
    setWaActionStatus('confirmed');
    setActionFeedback(isTamil ? 'சந்திப்பு உறுதி செய்யப்பட்டது! (Demo Local State)' : 'Appointment Confirmed! (Demo Local State)');
    
    // Call service layer placeholder (does not make real network request)
    await reminderService.confirmAppointment(primaryAppointment.id, 'WhatsApp');

    // Add entry to notification history with status Demo / Scheduled (never claimed as sent without real backend)
    if (setNotificationHistory) {
      const newEntry = {
        id: `notif-${Date.now()}`,
        type: 'WhatsApp',
        scheduledDate: new Date().toISOString().split('T')[0],
        scheduledTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        appointmentDate: primaryAppointment.appointmentDate,
        appointmentTime: primaryAppointment.appointmentTime,
        doctorName: primaryAppointment.doctorName,
        hospitalName: primaryAppointment.hospitalName,
        deliveryStatus: 'Demo',
        details: 'Patient clicked [Confirm Appointment] via WhatsApp Preview UI.',
        recipientPhone: reminderSettings?.registeredMobile || patient?.phone
      };
      setNotificationHistory(prev => [newEntry, ...prev]);
    }

    setTimeout(() => {
      setActionFeedback('');
    }, 4500);
  };

  // WhatsApp Button: Request Reschedule (Local State Demo)
  const handleRequestReschedule = async () => {
    setWaActionStatus('rescheduled');
    setActionFeedback(isTamil ? 'மறுதிட்டமிடல் கோரப்பட்டது! (Demo Local State)' : 'Reschedule Request Sent! (Demo Local State)');

    await reminderService.requestReschedule(primaryAppointment.id);

    if (setNotificationHistory) {
      const newEntry = {
        id: `notif-${Date.now()}`,
        type: 'WhatsApp',
        scheduledDate: new Date().toISOString().split('T')[0],
        scheduledTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        appointmentDate: primaryAppointment.appointmentDate,
        appointmentTime: primaryAppointment.appointmentTime,
        doctorName: primaryAppointment.doctorName,
        hospitalName: primaryAppointment.hospitalName,
        deliveryStatus: 'Pending',
        details: 'Patient requested slot rescheduling via WhatsApp Preview UI.',
        recipientPhone: reminderSettings?.registeredMobile || patient?.phone
      };
      setNotificationHistory(prev => [newEntry, ...prev]);
    }

    setTimeout(() => {
      setActionFeedback('');
    }, 4500);
  };

  // Save Settings
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    const updated = {
      ...reminderSettings,
      registeredMobile: mobileInput,
      languagePreference: lang
    };
    if (setReminderSettings) {
      setReminderSettings(updated);
    }
    await reminderService.updateReminderSettings(updated);
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 3000);
  };

  const toggleSMS = (enabled) => {
    if (setReminderSettings) {
      setReminderSettings(prev => ({ ...prev, smsNotifications: enabled }));
    }
  };

  const toggleWhatsApp = (enabled) => {
    if (setReminderSettings) {
      setReminderSettings(prev => ({ ...prev, whatsappNotifications: enabled }));
    }
  };

  return (
    <div className="space-y-8 pb-8">
      <div className="bg-white border rounded-2xl p-5 space-y-2"><h2 className="font-bold">Real SMS test</h2><p className="text-xs text-slate-600">Requires deployed send-sms Edge Function and configured Twilio account. Use an authorized test phone in international format (+91...).</p><button onClick={handleSmsTest} disabled={smsBusy} className="bg-teal-600 text-white px-4 py-2 rounded-lg disabled:opacity-50">{smsBusy?'Sending...':'Send test SMS'}</button>{smsStatus&&<p role="status" className="text-sm">{smsStatus}</p>}</div>
      {/* SECTION HEADER */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-7 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2.5 bg-blue-50 text-blue-600 rounded-2xl">
              <BellRing className="w-6 h-6" />
            </span>
            <h1 className="text-2xl font-extrabold text-slate-900">
              {isTamil ? 'பரிசோதனை நினைவூட்டல் அமைப்பு' : 'Check-up & Follow-up Reminder System'}
            </h1>
          </div>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl">
            {isTamil 
              ? 'SMS மற்றும் WhatsApp வழியாக தானியங்கி சந்திப்பு நினைவூட்டல்கள், ஊடாடும் உறுதிப்படுத்தல் மற்றும் அறிவிப்பு கண்காணிப்பு.'
              : 'Automated multi-channel SMS and WhatsApp scheduled follow-up notifications with live interactive previews.'}
          </p>
        </div>

        {/* Status Pills */}
        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            {isTamil ? 'நினைவூட்டல் தயார்' : 'Ready for SNS Backend'}
          </span>
          <span className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            Tamil / English
          </span>
        </div>
      </div>

      {/* FEATURE 2.1: REMINDER SCHEDULING INTERFACE */}
      <section className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-7 shadow-xs">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <CalendarClock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {isTamil ? 'நினைவூட்டல் திட்டமிடல் விவரங்கள்' : 'Follow-up Reminder Schedule'}
              </h2>
              <p className="text-xs text-slate-500">
                {isTamil ? 'நோயாளி மற்றும் மருத்துவ சந்திப்பின் அட்டவணை' : 'Active follow-up appointment timeline and automated trigger schedule'}
              </p>
            </div>
          </div>
        </div>

        {/* Display: Patient name, mobile, doctor, hospital, date, time */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-5 bg-gradient-to-br from-slate-50 via-blue-50/30 to-cyan-50/30 rounded-2xl border border-blue-100">
          <div className="space-y-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              {isTamil ? 'நோயாளி பெயர்' : 'Patient Name'}
            </span>
            <p className="text-base font-bold text-slate-900 flex items-center gap-1.5">
              <User className="w-4 h-4 text-blue-600" />
              {patient?.name}
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              {isTamil ? 'பதிவு செய்யப்பட்ட அலைபேசி எண்' : 'Registered Mobile Number'}
            </span>
            <p className="text-base font-bold text-slate-900 flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-emerald-600" />
              {reminderSettings?.registeredMobile || patient?.phone}
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              {isTamil ? 'மருத்துவர் பெயர்' : 'Attending Doctor'}
            </span>
            <p className="text-base font-bold text-slate-900 flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-blue-600" />
              {primaryAppointment.doctorName}
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              {isTamil ? 'மருத்துவமனை' : 'Hospital Name'}
            </span>
            <p className="text-base font-bold text-slate-900">
              {primaryAppointment.hospitalName}
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              {isTamil ? 'சந்திப்பு தேதி' : 'Appointment Date'}
            </span>
            <p className="text-base font-bold text-blue-700 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-blue-600" />
              {primaryAppointment.appointmentDate}
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              {isTamil ? 'சந்திப்பு நேரம்' : 'Appointment Time'}
            </span>
            <p className="text-base font-bold text-cyan-700 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-cyan-600" />
              {primaryAppointment.appointmentTime}
            </p>
          </div>
        </div>

        {/* Reminder Schedule Steps: 3 days before, 1 day before, on appointment day */}
        <div className="mt-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3">
            {isTamil ? 'திட்டமிடப்பட்ட நினைவூட்டல் நிலைகள்' : 'Automated Reminder Timeline Schedule'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 3 Days Before */}
            <div className="relative p-4 rounded-2xl border-2 border-blue-200 bg-blue-50/40 hover:bg-blue-50 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-600 text-white">
                  Stage 1
                </span>
                <span className="text-xs font-bold text-blue-700">3 Days Before</span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 mt-2">Advance Preparation Alert</h4>
              <p className="text-xs text-slate-600 mt-1">
                Dispatched 3 days prior. Prompts patient to keep records and reports ready.
              </p>
              <div className="mt-3 pt-2.5 border-t border-blue-100 flex items-center justify-between text-[11px]">
                <span className="text-slate-500">Channels:</span>
                <span className="font-semibold text-blue-800">SMS + WhatsApp</span>
              </div>
            </div>

            {/* 1 Day Before */}
            <div className="relative p-4 rounded-2xl border-2 border-cyan-200 bg-cyan-50/40 hover:bg-cyan-50 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-cyan-600 text-white">
                  Stage 2
                </span>
                <span className="text-xs font-bold text-cyan-800">1 Day Before</span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 mt-2">Interactive Confirmation</h4>
              <p className="text-xs text-slate-600 mt-1">
                Dispatched 24 hours prior. Includes 1-tap confirmation or reschedule request options.
              </p>
              <div className="mt-3 pt-2.5 border-t border-cyan-100 flex items-center justify-between text-[11px]">
                <span className="text-slate-500">Channels:</span>
                <span className="font-semibold text-cyan-900">WhatsApp + SMS</span>
              </div>
            </div>

            {/* On Appointment Day */}
            <div className="relative p-4 rounded-2xl border-2 border-emerald-200 bg-emerald-50/40 hover:bg-emerald-50 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-600 text-white">
                  Stage 3
                </span>
                <span className="text-xs font-bold text-emerald-800">Appointment Day</span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 mt-2">Day-of Check-up Prompt</h4>
              <p className="text-xs text-slate-600 mt-1">
                Dispatched morning of appointment. Provides token/arrival details and clinic location.
              </p>
              <div className="mt-3 pt-2.5 border-t border-emerald-100 flex items-center justify-between text-[11px]">
                <span className="text-slate-500">Channels:</span>
                <span className="font-semibold text-emerald-900">SMS Priority + WA</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURE 2.2 & 2.3: SMS & WHATSAPP NOTIFICATION INTERFACES (PREVIEWS) */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {isTamil ? 'நினைவூட்டல் மாதிரிக் காட்சி (Live Previews)' : 'Live Notification Previews'}
            </h2>
            <p className="text-xs text-slate-500">
              Interactive demo previewing exactly how patients receive reminders on their phone
            </p>
          </div>

          {/* Toggle Tab */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold self-start">
            <button
              onClick={() => setSelectedPreviewTab('both')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedPreviewTab === 'both' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Both Previews
            </button>
            <button
              onClick={() => setSelectedPreviewTab('whatsapp')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedPreviewTab === 'whatsapp' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              WhatsApp Only
            </button>
            <button
              onClick={() => setSelectedPreviewTab('sms')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedPreviewTab === 'sms' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              SMS Only
            </button>
          </div>
        </div>

        {/* Previews Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* SMS NOTIFICATION INTERFACE */}
          {(selectedPreviewTab === 'both' || selectedPreviewTab === 'sms') && (
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-blue-100 text-blue-700 rounded-xl">
                      <Smartphone className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900">SMS Notification Interface</h3>
                      <p className="text-xs text-slate-500">Standard GSM SMS Gateway Preview</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                    Preview Mode
                  </span>
                </div>

                {/* SMS Metadata Status Chips */}
                <div className="grid grid-cols-3 gap-2 my-4 text-center">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Status</span>
                    <span className="text-xs font-bold text-blue-700">Scheduled (Demo)</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Scheduled Date</span>
                    <span className="text-xs font-bold text-slate-800">{primaryAppointment.appointmentDate}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Recipient</span>
                    <span className="text-xs font-bold text-slate-800 truncate block" title={reminderSettings?.registeredMobile || patient?.phone}>
                      {reminderSettings?.registeredMobile || patient?.phone}
                    </span>
                  </div>
                </div>

                {/* SMS Device Mock */}
                <div className="mt-2 rounded-2xl bg-slate-100 p-4 border border-slate-200">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
                    <span>Sender: <strong>VK-CASUAL</strong></span>
                    <span>10:30 AM • via SMS Gateway</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-white text-slate-800 text-sm shadow-xs border border-slate-200 leading-relaxed font-sans">
                    {isTamil ? (
                      `வணக்கம்! இது கேஷுவல் கேர் (CasualCare). தங்களின் மருத்துவ பரிசோதனை ${primaryAppointment.appointmentDate} அன்று காலை ${primaryAppointment.appointmentTime} மணிக்கு திட்டமிடப்பட்டுள்ளது. மருத்துவமனை: ${primaryAppointment.hospitalName}. தயவுசெய்து சரியான நேரத்தில் கலந்துகொள்ளவும்.`
                    ) : (
                      `"Hello! This is CasualCare. Your follow-up appointment is scheduled for ${primaryAppointment.appointmentDate} at ${primaryAppointment.appointmentTime}. Hospital: ${primaryAppointment.hospitalName}. Please attend your check-up on time."`
                    )}
                  </div>

                  <div className="mt-3 text-[11px] text-slate-500 flex items-center justify-between">
                    <span>Delivery route: AWS SNS / Telecom DLT</span>
                    <span className="text-emerald-700 font-medium">● Configured for SNS Workbench</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 text-xs text-slate-400">
                <span>Note: SMS alerts are scheduled according to 3-day, 1-day, and same-day intervals.</span>
              </div>
            </div>
          )}

          {/* WHATSAPP NOTIFICATION INTERFACE */}
          {(selectedPreviewTab === 'both' || selectedPreviewTab === 'whatsapp') && (
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900">WhatsApp Notification Interface</h3>
                      <p className="text-xs text-slate-500">Interactive Business Messaging Preview</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Live Demo
                  </span>
                </div>

                {/* WhatsApp Status Chips */}
                <div className="grid grid-cols-3 gap-2 my-4 text-center">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Status</span>
                    <span className="text-xs font-bold text-emerald-700">
                      {waActionStatus === 'confirmed' 
                        ? 'Confirmed (Local)' 
                        : waActionStatus === 'rescheduled'
                        ? 'Rescheduled (Local)'
                        : 'Scheduled (Demo)'}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Scheduled Date</span>
                    <span className="text-xs font-bold text-slate-800">{primaryAppointment.appointmentDate}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Recipient</span>
                    <span className="text-xs font-bold text-slate-800 truncate block" title={reminderSettings?.registeredMobile || patient?.phone}>
                      {reminderSettings?.registeredMobile || patient?.phone}
                    </span>
                  </div>
                </div>

                {/* WhatsApp Chat Bubble Mockup */}
                <div className="mt-2 rounded-2xl bg-[#EFEAE2] p-4 border border-[#e2dcd3]">
                  <div className="flex items-center justify-between text-[11px] text-slate-600 mb-2">
                    <span className="flex items-center gap-1 font-semibold text-emerald-800">
                      <span className="w-2 h-2 rounded-full bg-emerald-600" />
                      CasualCare Verified Health Bot
                    </span>
                    <span>10:30 AM</span>
                  </div>

                  {/* Message bubble */}
                  <div className="p-4 rounded-2xl bg-white text-slate-900 text-sm shadow-xs border border-emerald-100 leading-relaxed space-y-2">
                    <p className="font-semibold text-slate-900">
                      {isTamil 
                        ? "வணக்கம்! உங்கள் கேஷுவல் கேர் (CasualCare) தொடர் மருத்துவ பரிசோதனை நெருங்குகிறது."
                        : "Hello! Your CasualCare follow-up appointment is approaching."}
                    </p>
                    
                    <div className="py-2 px-3 bg-emerald-50/60 rounded-xl space-y-1 text-xs text-slate-700 border border-emerald-100">
                      <p><strong>Date:</strong> {primaryAppointment.appointmentDate}</p>
                      <p><strong>Time:</strong> {primaryAppointment.appointmentTime}</p>
                      <p><strong>Hospital:</strong> {primaryAppointment.hospitalName}</p>
                      <p><strong>Doctor:</strong> {primaryAppointment.doctorName}</p>
                    </div>

                    <p className="text-xs text-slate-600 pt-1">
                      {isTamil ? "தயவுசெய்து உங்கள் வருகையை உறுதிப்படுத்தவும்." : "Please confirm your appointment."}
                    </p>

                    {/* Interactive Buttons (Works in frontend demo using local state) */}
                    <div className="pt-2 border-t border-slate-100 space-y-2">
                      <button
                        onClick={handleConfirmAppointment}
                        className={`w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-xs ${
                          waActionStatus === 'confirmed'
                            ? 'bg-emerald-600 text-white'
                            : 'bg-emerald-500 hover:bg-emerald-600 text-white active:scale-98'
                        }`}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{isTamil ? 'சந்திப்பை உறுதி செய் (Confirm Appointment)' : 'Confirm Appointment'}</span>
                      </button>

                      <button
                        onClick={handleRequestReschedule}
                        className={`w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 border ${
                          waActionStatus === 'rescheduled'
                            ? 'bg-amber-100 text-amber-900 border-amber-300'
                            : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300 active:scale-98'
                        }`}
                      >
                        <RotateCcw className="w-4 h-4 text-amber-600" />
                        <span>{isTamil ? 'மறுதிட்டமிடக் கோரிக்கை (Request Reschedule)' : 'Request Reschedule'}</span>
                      </button>
                    </div>

                    {actionFeedback && (
                      <div className="mt-2 p-2 rounded-lg bg-blue-50 border border-blue-200 text-blue-800 text-xs text-center font-medium animate-fade-in">
                        {actionFeedback}
                      </div>
                    )}
                  </div>

                  <div className="mt-3 text-[11px] text-slate-600 flex items-center justify-between">
                    <span>Meta Cloud API / SNS Webhook</span>
                    <span className="text-emerald-700 font-semibold">Interactive Local Demo</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 text-xs text-slate-400">
                <span>Test buttons above to simulate patient response and update local history.</span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* FEATURE 2.4: REMINDER SETTINGS */}
      <section className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-7 shadow-xs">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {isTamil ? 'நினைவூட்டல் அமைப்புகள் (Reminder Settings)' : 'Reminder Notification Settings'}
              </h2>
              <p className="text-xs text-slate-500">
                Configure delivery channels, phone number, and bilingual language preferences
              </p>
            </div>
          </div>
          {settingsSaved && (
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 flex items-center gap-1 animate-fade-in">
              <Check className="w-3.5 h-3.5" />
              Saved locally
            </span>
          )}
        </div>

        <form onSubmit={handleSaveSettings} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Setting 1: SMS notifications ON/OFF */}
            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                    <Smartphone className="w-4 h-4 text-blue-600" />
                    SMS Alerts
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    reminderSettings?.smsNotifications ? 'bg-blue-100 text-blue-800' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {reminderSettings?.smsNotifications ? 'ON' : 'OFF'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Receive text messages for upcoming appointments and schedule changes.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between">
                <span className="text-xs text-slate-600 font-medium">Enable SMS:</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={reminderSettings?.smsNotifications ?? true} 
                    onChange={(e) => toggleSMS(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-300 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>

            {/* Setting 2: WhatsApp notifications ON/OFF */}
            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4 text-emerald-600" />
                    WhatsApp Alerts
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    reminderSettings?.whatsappNotifications ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {reminderSettings?.whatsappNotifications ? 'ON' : 'OFF'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Receive interactive WhatsApp messages with one-tap confirmation buttons.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between">
                <span className="text-xs text-slate-600 font-medium">Enable WhatsApp:</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={reminderSettings?.whatsappNotifications ?? true} 
                    onChange={(e) => toggleWhatsApp(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-300 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>
            </div>

            {/* Setting 3: Registered Mobile Number */}
            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between">
              <div>
                <span className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                  <PhoneCall className="w-4 h-4 text-cyan-600" />
                  Registered Mobile
                </span>
                <p className="text-xs text-slate-500 mt-1">
                  Primary number for dispatching SMS and WhatsApp alerts.
                </p>
                <div className="mt-3">
                  <input
                    type="tel"
                    value={mobileInput}
                    onChange={(e) => setMobileInput(e.target.value)}
                    placeholder="+91 98401 23456"
                    className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                </div>
              </div>
              <p className="text-[10px] text-slate-400 mt-2">Standard E.164 phone format</p>
            </div>

            {/* Setting 4: Tamil / English Language Preference */}
            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between">
              <div>
                <span className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                  <Languages className="w-4 h-4 text-purple-600" />
                  Language Preference
                </span>
                <p className="text-xs text-slate-500 mt-1">
                  Choose default template language for SMS and WhatsApp.
                </p>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (setLang) setLang('en');
                      if (setReminderSettings) setReminderSettings(prev => ({ ...prev, languagePreference: 'en' }));
                    }}
                    className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all ${
                      lang === 'en' 
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs' 
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    English
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (setLang) setLang('ta');
                      if (setReminderSettings) setReminderSettings(prev => ({ ...prev, languagePreference: 'ta' }));
                    }}
                    className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all ${
                      lang === 'ta' 
                        ? 'bg-purple-600 text-white border-purple-600 shadow-xs' 
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    தமிழ் (Tamil)
                  </button>
                </div>
              </div>
              <p className="text-[10px] text-slate-400 mt-2">Updates previews immediately</p>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-98"
            >
              Save Reminder Settings
            </button>
          </div>
        </form>
      </section>

      {/* FEATURE 2.5: NOTIFICATION HISTORY TABLE */}
      <section className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {isTamil ? 'அறிவிப்பு வரலாறு (Notification History)' : 'Notification History Log'}
              </h2>
              <p className="text-xs text-slate-500">
                Audit trail of all scheduled, demo, and pending reminder dispatches
              </p>
            </div>
          </div>

          {/* Delivery Note Alert (Rule: Never show notification as successfully sent unless actual backend integration confirms it) */}
          <div className="px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-[11px] flex items-center gap-1.5 self-start">
            <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>Delivery status shows <strong>Demo</strong>, <strong>Scheduled</strong>, or <strong>Pending</strong>. Real dispatch will be confirmed when SNS Workbench is integrated.</span>
          </div>
        </div>

        {/* History Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase font-bold tracking-wider border-b border-slate-200">
              <tr>
                <th scope="col" className="px-4 py-3.5">Notification Type</th>
                <th scope="col" className="px-4 py-3.5">Scheduled Date & Time</th>
                <th scope="col" className="px-4 py-3.5">Appointment Date</th>
                <th scope="col" className="px-4 py-3.5">Doctor & Hospital</th>
                <th scope="col" className="px-4 py-3.5">Recipient Mobile</th>
                <th scope="col" className="px-4 py-3.5">Delivery Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {notificationHistory.map((item) => {
                const isWA = item.type === 'WhatsApp';
                return (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className={`p-1.5 rounded-lg ${isWA ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>
                          {isWA ? <MessageSquare className="w-3.5 h-3.5" /> : <Smartphone className="w-3.5 h-3.5" />}
                        </span>
                        <div>
                          <span className="font-bold text-slate-900 block">{item.type}</span>
                          <span className="text-[10px] text-slate-400">ID: {item.id}</span>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <div className="font-semibold text-slate-800 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span>{item.scheduledDate}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{item.scheduledTime || '09:00 AM'}</span>
                      </div>
                    </td>

                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <div className="font-semibold text-slate-800">
                        {item.appointmentDate}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {item.appointmentTime || '10:30 AM'}
                      </div>
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="font-semibold text-slate-800">
                        {item.doctorName}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate max-w-xs" title={item.hospitalName}>
                        {item.hospitalName}
                      </div>
                    </td>

                    <td className="px-4 py-3.5 whitespace-nowrap font-mono text-slate-700">
                      {item.recipientPhone || reminderSettings?.registeredMobile || patient?.phone}
                    </td>

                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        item.deliveryStatus === 'Demo'
                          ? 'bg-purple-100 text-purple-800 border border-purple-200'
                          : item.deliveryStatus === 'Scheduled'
                          ? 'bg-blue-100 text-blue-800 border border-blue-200'
                          : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          item.deliveryStatus === 'Demo'
                            ? 'bg-purple-600'
                            : item.deliveryStatus === 'Scheduled'
                            ? 'bg-blue-600'
                            : 'bg-amber-600'
                        }`} />
                        {item.deliveryStatus}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
