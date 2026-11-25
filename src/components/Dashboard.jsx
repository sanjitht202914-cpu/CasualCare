import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  User, 
  Building2, 
  Phone, 
  MapPin, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight, 
  Bell, 
  Heart, 
  Activity, 
  FileText, 
  ShieldCheck, 
  ArrowUpRight, 
  Clock3, 
  CalendarCheck, 
  Stethoscope, 
  Sparkles,
  MessageSquare
} from 'lucide-react';
import { translations } from '../data/mockData';
import { patientService } from '../services/patientService';

export default function Dashboard({ 
  patient, 
  appointments = [], 
  notificationHistory = [], 
  reminderSettings,
  lang, 
  setActiveTab, 
  onTriggerSOS 
}) {
  const t = translations[lang] || translations.en;
  const isTamil = lang === 'ta';

  // Find the primary upcoming appointment (first one in chronological order)
  const upcomingAppointments = appointments.filter(a => a.status === 'Upcoming');
  const completedAppointments = appointments.filter(a => a.status === 'Completed');
  const nextAppointment = upcomingAppointments[0];

  // Daily Check-in Local State
  const [checkedIn, setCheckedIn] = useState(false);
  const [checkInMsg, setCheckInMsg] = useState('');

  // Countdown timer calculation
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isPassed: false
  });

  useEffect(() => {
    if (!nextAppointment) return;

    const calculateTimeLeft = () => {
      // Calculate target time based on appointment date and time
      // nextAppointment.appointmentDate is "2026-11-14", appointmentTime is "10:30 AM"
      const targetDate = new Date(`${nextAppointment.appointmentDate} 10:30:00`);
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference <= 0) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0, isPassed: true });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setCountdown({ days, hours, minutes, seconds, isPassed: false });
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, [nextAppointment]);

  const handleDailyCheckin = async () => {
    setCheckedIn(true);
    setCheckInMsg(isTamil ? 'நலப் பதிவு பெறப்பட்டது!' : 'Daily Check-in Recorded!');
    await patientService.submitDailyCheckIn(patient.id, 'OK');
    setTimeout(() => {
      setCheckedIn(false);
      setCheckInMsg('');
    }, 4000);
  };

  return (
    <div className="space-y-6">
      {/* 1. WELCOME SECTION & PATIENT PROFILE HEADER */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-sky-600 to-cyan-600 p-6 sm:p-8 text-white shadow-xl shadow-blue-500/10">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 -mb-16 w-60 h-60 rounded-full bg-cyan-400/20 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Patient Details & Avatar */}
          <div className="flex items-start sm:items-center gap-4 sm:gap-6">
            <div className="relative">
              <img 
                src={patient.avatar} 
                alt={patient.name} 
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-3 border-white/80 shadow-lg"
              />
              <span className="absolute -bottom-1 -right-1 p-1 bg-emerald-500 rounded-full border-2 border-white shadow-xs" title="Profile Active">
                <ShieldCheck className="w-4 h-4 text-white" />
              </span>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-sm text-white border border-white/30">
                  {patient.id}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-400/20 text-cyan-100 border border-cyan-300/30 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-300 animate-pulse" />
                  {isTamil ? 'நேரலை பராமரிப்பு' : 'Active Care Monitoring'}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-2 text-white">
                {isTamil ? `வணக்கம், ${patient.name}` : `Welcome back, ${patient.name}`}
              </h1>

              <div className="mt-2 flex flex-wrap items-center gap-y-1 gap-x-4 text-xs sm:text-sm text-sky-100">
                <span className="flex items-center gap-1">
                  <User className="w-4 h-4 text-cyan-200" />
                  {patient.age} yrs • {patient.gender} • <strong className="text-white font-semibold">Blood: {patient.bloodGroup}</strong>
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="w-4 h-4 text-cyan-200" />
                  <span>Mobile: <strong className="text-white font-medium">{patient.phone}</strong></span>
                </span>
              </div>

              <div className="mt-2 text-xs text-sky-200/90 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-cyan-200" />
                <span>{patient.address || patient.currentGPS?.locationName}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-3 self-start md:self-center">
            <button
              onClick={handleDailyCheckin}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-md flex items-center gap-2 ${
                checkedIn 
                  ? 'bg-emerald-500 text-white' 
                  : 'bg-white text-blue-700 hover:bg-sky-50 shadow-white/20 hover:scale-102 active:scale-98'
              }`}
            >
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
              {checkedIn ? checkInMsg : (isTamil ? 'இன்றைய நலம் பதிவு (I am OK)' : "Daily 'I Am OK' Check-in")}
            </button>

            <button
              onClick={() => setActiveTab('reminders')}
              className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-sky-500/30 hover:bg-sky-500/40 text-white border border-white/30 backdrop-blur-sm transition-all flex items-center gap-2"
            >
              <Bell className="w-4 h-4 text-cyan-200" />
              {isTamil ? 'நினைவூட்டல் அமைப்புகள்' : 'Follow-up Reminders'}
            </button>
          </div>
        </div>

        {/* Live Vitals Glance Strip */}
        <div className="mt-6 pt-5 border-t border-white/15 grid grid-cols-2 sm:grid-cols-4 gap-3 text-white">
          <div className="bg-white/10 backdrop-blur-xs p-3 rounded-2xl border border-white/15">
            <div className="text-[11px] text-sky-100 flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-rose-300" />
              {isTamil ? 'இதயத் துடிப்பு' : 'Heart Rate'}
            </div>
            <div className="text-lg font-bold mt-0.5">{patient.vitals?.heartRate} <span className="text-xs font-normal text-sky-200">bpm</span></div>
          </div>
          <div className="bg-white/10 backdrop-blur-xs p-3 rounded-2xl border border-white/15">
            <div className="text-[11px] text-sky-100 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-cyan-200" />
              {isTamil ? 'இரத்த அழுத்தம்' : 'Blood Pressure'}
            </div>
            <div className="text-lg font-bold mt-0.5">{patient.vitals?.bp} <span className="text-xs font-normal text-sky-200">mmHg</span></div>
          </div>
          <div className="bg-white/10 backdrop-blur-xs p-3 rounded-2xl border border-white/15">
            <div className="text-[11px] text-sky-100 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-200" />
              {isTamil ? 'இரத்த சர்க்கரை' : 'Blood Sugar'}
            </div>
            <div className="text-lg font-bold mt-0.5">{patient.vitals?.bloodSugar}</div>
          </div>
          <div className="bg-white/10 backdrop-blur-xs p-3 rounded-2xl border border-white/15">
            <div className="text-[11px] text-sky-100 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
              {isTamil ? 'குணமடைதல் குறியீடு' : 'Recovery Score'}
            </div>
            <div className="text-lg font-bold mt-0.5 text-cyan-100">{patient.recoveryScore}% <span className="text-xs font-normal text-sky-200">Normal</span></div>
          </div>
        </div>
      </section>

      {/* 2. CORE DASHBOARD SUMMARY CARDS */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Upcoming Appointments */}
        <div 
          onClick={() => setActiveTab('reminders')}
          className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer group hover:border-blue-300"
        >
          <div className="flex items-center justify-between">
            <span className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:scale-105 transition-transform">
              <Calendar className="w-6 h-6" />
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
              {upcomingAppointments.length} Active
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-slate-900">{upcomingAppointments.length}</h3>
            <p className="text-sm font-medium text-slate-600 mt-0.5">
              {isTamil ? 'அடுத்த சந்திப்புகள்' : 'Upcoming Appointments'}
            </p>
            <p className="text-xs text-slate-400 mt-2 flex items-center gap-1 group-hover:text-blue-600 transition-colors">
              <span>{isTamil ? 'விவரங்களைக் காண்க' : 'View appointment details'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </p>
          </div>
        </div>

        {/* Card 2: Completed Appointments */}
        <div 
          onClick={() => setActiveTab('reminders')}
          className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer group hover:border-emerald-300"
        >
          <div className="flex items-center justify-between">
            <span className="p-3 bg-emerald-50 text-emerald-600 rounded-xl group-hover:scale-105 transition-transform">
              <CalendarCheck className="w-6 h-6" />
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
              Verified
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-slate-900">{completedAppointments.length}</h3>
            <p className="text-sm font-medium text-slate-600 mt-0.5">
              {isTamil ? 'முடிந்த சந்திப்புகள்' : 'Completed Appointments'}
            </p>
            <p className="text-xs text-slate-400 mt-2 flex items-center gap-1 group-hover:text-emerald-600 transition-colors">
              <span>{isTamil ? 'மருத்துவ குறிப்புகளைக் காண்க' : 'Past consult history'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </p>
          </div>
        </div>

        {/* Card 3: Pending Check-ups */}
        <div 
          onClick={() => setActiveTab('reminders')}
          className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer group hover:border-amber-300"
        >
          <div className="flex items-center justify-between">
            <span className="p-3 bg-amber-50 text-amber-600 rounded-xl group-hover:scale-105 transition-transform">
              <Clock3 className="w-6 h-6" />
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
              Action Req.
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-slate-900">
              {upcomingAppointments.filter(a => a.confirmationStatus === 'Pending Confirmation').length || 1}
            </h3>
            <p className="text-sm font-medium text-slate-600 mt-0.5">
              {isTamil ? 'நிலுவையில் உள்ள பரிசோதனை' : 'Pending Check-ups'}
            </p>
            <p className="text-xs text-slate-400 mt-2 flex items-center gap-1 group-hover:text-amber-600 transition-colors">
              <span>{isTamil ? 'உறுதிப்படுத்தவும்' : 'Pending patient response'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </p>
          </div>
        </div>

        {/* Card 4: Notifications */}
        <div 
          onClick={() => setActiveTab('reminders')}
          className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer group hover:border-cyan-300"
        >
          <div className="flex items-center justify-between">
            <span className="p-3 bg-cyan-50 text-cyan-600 rounded-xl group-hover:scale-105 transition-transform">
              <Bell className="w-6 h-6" />
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-800">
              SMS & WA
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-slate-900">{notificationHistory.length}</h3>
            <p className="text-sm font-medium text-slate-600 mt-0.5">
              {isTamil ? 'அறிவிப்புகள் பதிவு' : 'Notifications Logged'}
            </p>
            <p className="text-xs text-slate-400 mt-2 flex items-center gap-1 group-hover:text-cyan-600 transition-colors">
              <span>{isTamil ? 'அனுப்பிய விவரங்கள்' : 'Track reminder queue'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </p>
          </div>
        </div>
      </section>

      {/* 3. UPCOMING FOLLOW-UP APPOINTMENT CARD WITH COUNTDOWN */}
      {nextAppointment && (
        <section className="bg-white rounded-3xl border border-blue-100 shadow-sm p-6 sm:p-7 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-2 h-full bg-gradient-to-b from-blue-500 to-cyan-400" />
          
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-4 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200">
                  {isTamil ? 'அடுத்த தொடர் பரிசோதனை' : 'Primary Follow-up Appointment'}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {nextAppointment.confirmationStatus}
                </span>
                <span className="text-xs text-slate-400">ID: {nextAppointment.id}</span>
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                  {nextAppointment.reason}
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  {nextAppointment.instructions}
                </p>
              </div>

              {/* Doctor & Hospital Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="p-2 bg-blue-100 text-blue-700 rounded-xl">
                    <Stethoscope className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 font-medium">{isTamil ? 'மருத்துவர்' : 'Attending Specialist'}</span>
                    <h4 className="text-sm font-bold text-slate-800">{nextAppointment.doctorName}</h4>
                    <p className="text-xs text-slate-500">{nextAppointment.doctorSpecialty}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="p-2 bg-cyan-100 text-cyan-700 rounded-xl">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 font-medium">{isTamil ? 'மருத்துவமனை' : 'Hospital / Clinic'}</span>
                    <h4 className="text-sm font-bold text-slate-800">{nextAppointment.hospitalName}</h4>
                    <p className="text-xs text-slate-500 line-clamp-1">{nextAppointment.hospitalAddress}</p>
                  </div>
                </div>
              </div>

              {/* Date & Time badges */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-50/70 border border-blue-200 text-blue-800 text-xs sm:text-sm font-medium">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <span>{isTamil ? 'தேதி:' : 'Date:'} <strong className="font-bold">{nextAppointment.appointmentDate}</strong></span>
                </div>
                <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-cyan-50/70 border border-cyan-200 text-cyan-800 text-xs sm:text-sm font-medium">
                  <Clock className="w-4 h-4 text-cyan-600" />
                  <span>{isTamil ? 'நேரம்:' : 'Time:'} <strong className="font-bold">{nextAppointment.appointmentTime}</strong></span>
                </div>
              </div>
            </div>

            {/* COUNTDOWN CLOCK BOX */}
            <div className="bg-gradient-to-br from-slate-900 to-blue-950 p-6 rounded-3xl text-white shadow-lg flex flex-col items-center justify-center min-w-[280px]">
              <div className="flex items-center gap-2 text-cyan-300 text-xs font-semibold uppercase tracking-wider mb-3">
                <Clock3 className="w-4 h-4 animate-spin" style={{ animationDuration: '6s' }} />
                <span>{isTamil ? 'சந்திப்புக்கு மீதமுள்ள நேரம்' : 'Appointment Countdown'}</span>
              </div>

              <div className="grid grid-cols-4 gap-2 sm:gap-3 text-center my-2">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-2.5 sm:p-3 min-w-[54px] border border-white/10">
                  <span className="text-xl sm:text-2xl font-black text-cyan-300 block">{countdown.days}</span>
                  <span className="text-[10px] uppercase tracking-wider text-slate-300">{isTamil ? 'நாட்கள்' : 'Days'}</span>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-2.5 sm:p-3 min-w-[54px] border border-white/10">
                  <span className="text-xl sm:text-2xl font-black text-cyan-300 block">{countdown.hours}</span>
                  <span className="text-[10px] uppercase tracking-wider text-slate-300">{isTamil ? 'மணி' : 'Hours'}</span>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-2.5 sm:p-3 min-w-[54px] border border-white/10">
                  <span className="text-xl sm:text-2xl font-black text-cyan-300 block">{countdown.minutes}</span>
                  <span className="text-[10px] uppercase tracking-wider text-slate-300">{isTamil ? 'நிமி' : 'Mins'}</span>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-2.5 sm:p-3 min-w-[54px] border border-white/10">
                  <span className="text-xl sm:text-2xl font-black text-amber-300 block">{countdown.seconds}</span>
                  <span className="text-[10px] uppercase tracking-wider text-slate-300">{isTamil ? 'நொடி' : 'Secs'}</span>
                </div>
              </div>

              {/* Reminder channel badge */}
              <div className="mt-4 text-center">
                <span className="text-[11px] text-cyan-200/80 bg-cyan-900/50 border border-cyan-700/50 px-3 py-1 rounded-full">
                  {reminderSettings?.whatsappNotifications && reminderSettings?.smsNotifications 
                    ? (isTamil ? 'SMS & WhatsApp எச்சரிக்கைகள் இயங்குகிறது' : 'SMS & WhatsApp Reminders Scheduled')
                    : (isTamil ? 'நினைவூட்டல் அமைக்கப்பட்டிருக்கிறது' : 'Reminder Alerts Active')}
                </span>
              </div>

              <button
                onClick={() => setActiveTab('reminders')}
                className="mt-4 w-full py-2 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-1.5"
              >
                <span>{isTamil ? 'நினைவூட்டலை நிர்வகி' : 'Manage Reminders & Preview'}</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* 4. APPOINTMENT HISTORY & NOTIFICATION SUMMARY */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Appointment History Column */}
        <section className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                {isTamil ? 'சந்திப்பு வரலாறு (Appointment History)' : 'Appointment History'}
              </h3>
              <p className="text-xs text-slate-500">
                {isTamil ? 'கடந்த மற்றும் வரவிருக்கும் மருத்துவ பரிசோதனைகள்' : 'Log of upcoming and completed medical consultations'}
              </p>
            </div>
            <button 
              onClick={() => setActiveTab('reminders')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <span>{isTamil ? 'அனைத்தும்' : 'View Schedule'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {appointments.map((apt) => (
              <div key={apt.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/80 p-2 rounded-xl transition-colors">
                <div className="flex items-start gap-3">
                  <div className={`p-2.5 rounded-xl mt-0.5 ${
                    apt.status === 'Completed' 
                      ? 'bg-emerald-50 text-emerald-600' 
                      : 'bg-blue-50 text-blue-600'
                  }`}>
                    {apt.status === 'Completed' ? <CheckCircle2 className="w-5 h-5" /> : <Calendar className="w-5 h-5" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-800">{apt.reason}</h4>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        apt.status === 'Completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {apt.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {apt.doctorName} • <span className="text-slate-700 font-medium">{apt.hospitalName}</span>
                    </p>
                  </div>
                </div>

                <div className="text-left sm:text-right text-xs">
                  <div className="font-semibold text-slate-700 flex items-center sm:justify-end gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{apt.appointmentDate}</span>
                  </div>
                  <div className="text-slate-400 flex items-center sm:justify-end gap-1 mt-0.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{apt.appointmentTime}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Reminder Status & Notification Feed Column */}
        <section className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                  <Bell className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {isTamil ? 'நினைவூட்டல் நிலை' : 'Reminder Status'}
                  </h3>
                  <p className="text-[11px] text-slate-500">Automated multi-channel alerts</p>
                </div>
              </div>
            </div>

            {/* Current Active Channel Status Card */}
            <div className="bg-gradient-to-r from-sky-50 to-blue-50 border border-blue-100 rounded-2xl p-4 mb-4">
              <span className="text-[11px] font-semibold text-blue-800 uppercase tracking-wider block">
                {isTamil ? 'செயலில் உள்ள எச்சரிக்கை சேனல்கள்' : 'Active Delivery Channels'}
              </span>
              <div className="mt-2 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-slate-700">
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                    WhatsApp Reminders
                  </span>
                  <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                    reminderSettings?.whatsappNotifications ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {reminderSettings?.whatsappNotifications ? 'ON (Active)' : 'OFF'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-slate-700">
                    <Phone className="w-3.5 h-3.5 text-blue-600" />
                    SMS Gateway
                  </span>
                  <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                    reminderSettings?.smsNotifications ? 'bg-blue-100 text-blue-800' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {reminderSettings?.smsNotifications ? 'ON (Active)' : 'OFF'}
                  </span>
                </div>
                <div className="pt-2 border-t border-blue-200/60 flex items-center justify-between text-slate-500">
                  <span>Registered Mobile:</span>
                  <span className="font-semibold text-slate-800">{patient.phone}</span>
                </div>
              </div>
            </div>

            {/* Notification History Snippet */}
            <div>
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                {isTamil ? 'சமீபத்திய அறிவிப்புகள்' : 'Recent Reminders'}
              </h4>
              <div className="space-y-2">
                {notificationHistory.slice(0, 3).map(notif => (
                  <div key={notif.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-800 flex items-center gap-1">
                        <span className={`w-2 h-2 rounded-full ${
                          notif.type === 'WhatsApp' ? 'bg-emerald-500' : 'bg-blue-500'
                        }`} />
                        {notif.type} Reminder
                      </span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        notif.deliveryStatus === 'Demo' 
                          ? 'bg-purple-100 text-purple-700' 
                          : notif.deliveryStatus === 'Scheduled'
                          ? 'bg-cyan-100 text-cyan-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {notif.deliveryStatus}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">{notif.details}</p>
                    <div className="text-[10px] text-slate-400 mt-1 flex items-center justify-between">
                      <span>Sched: {notif.scheduledDate} {notif.scheduledTime}</span>
                      <span>Apt: {notif.appointmentDate}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100">
            <button
              onClick={() => setActiveTab('reminders')}
              className="w-full py-2 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold text-xs transition-colors flex items-center justify-center gap-1"
            >
              <span>{isTamil ? 'அனைத்து நினைவூட்டல் வரலாற்றைக் காண்க' : 'View Full Notification History'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
