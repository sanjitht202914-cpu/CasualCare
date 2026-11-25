import React from 'react';
import { 
  Heart, 
  Activity, 
  AlertTriangle, 
  PhoneCall, 
  ShieldAlert, 
  Globe, 
  User, 
  Stethoscope, 
  MessageSquareQuote, 
  Pill, 
  TrendingUp, 
  Users, 
  FileText, 
  BellRing
} from 'lucide-react';
import { translations } from '../data/mockData';

export default function Navbar({ activeTab, setActiveTab, lang, setLang, onTriggerSOS, sosActive }) {
  const t = translations[lang];

  const navItems = [
    { id: 'dashboard', label: t.nav.dashboard, icon: Activity },
    { id: 'doctor', label: t.nav.doctorPortal, icon: Stethoscope },
    { id: 'ai', label: t.nav.aiAssistant, icon: MessageSquareQuote, badge: "AI" },
    { id: 'medicines', label: t.nav.medicines, icon: Pill },
    { id: 'recovery', label: t.nav.recovery, icon: TrendingUp },
    { id: 'family', label: t.nav.familyCircle, icon: Users },
    { id: 'records', label: t.nav.medicalRecords, icon: FileText },
    { id: 'reminders', label: t.nav.reminders, icon: BellRing },
    { id: 'sos', label: t.nav.sos, icon: ShieldAlert, highlight: true }
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Emergency Flash Bar if SOS active */}
      {sosActive && (
        <div className="bg-rose-600 text-white px-4 py-2 flex items-center justify-between text-sm font-semibold animate-pulse">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            <span>CRITICAL ALERT: Emergency Dispatch & Family Notification Active</span>
          </div>
          <button 
            onClick={() => setActiveTab('sos')}
            className="underline text-xs bg-rose-700 hover:bg-rose-800 px-3 py-1 rounded"
          >
            Track Ambulance & Status
          </button>
        </div>
      )}

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setActiveTab('dashboard')}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-teal-500 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
              <Heart className="w-6 h-6 fill-white stroke-none" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-teal-600 transition-colors">
                  Casual<span className="text-teal-600">Care</span>
                </span>
                <span className="text-[10px] font-semibold uppercase px-2 py-0.5 bg-teal-50 text-teal-700 border border-teal-200 rounded-full">
                  24/7 Remote Care
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                {lang === 'ta' ? 'அறிவார்ந்த மருத்துவப் பராமரிப்பு' : 'Intelligent Remote Healthcare'}
              </p>
            </div>
          </div>

          {/* Right Action Tools: Language Toggle & Emergency SOS */}
          <div className="flex items-center gap-3">
            {/* Tamil - English Switcher */}
            <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs font-semibold">
              <button
                onClick={() => setLang('en')}
                className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 ${
                  lang === 'en' ? 'bg-white text-teal-700 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Switch to English"
              >
                <Globe className="w-3.5 h-3.5" />
                English
              </button>
              <button
                onClick={() => setLang('ta')}
                className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 ${
                  lang === 'ta' ? 'bg-teal-600 text-white shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
                title="தமிழில் மாற்றவும்"
              >
                தமிழ் (Tamil)
              </button>
            </div>

            {/* Quick Emergency SOS Button */}
            <button
              onClick={onTriggerSOS}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold text-white transition-all shadow-md ${
                sosActive 
                  ? 'bg-rose-600 animate-bounce ring-4 ring-rose-200' 
                  : 'bg-red-600 hover:bg-red-700 active:scale-95'
              }`}
            >
              <ShieldAlert className="w-4 h-4 animate-pulse" />
              <span>{t.emergencySOS}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="bg-slate-50 border-t border-slate-200 overflow-x-auto scrollbar-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-1 sm:space-x-2 py-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-white text-teal-700 shadow-xs border border-slate-200 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  } ${item.highlight ? 'text-red-700 font-semibold' : ''}`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-teal-600' : item.highlight ? 'text-red-600' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="text-[10px] bg-teal-100 text-teal-800 font-bold px-1.5 py-0.2 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
