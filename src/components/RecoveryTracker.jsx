import React, { useState } from 'react';
import { 
  TrendingUp, 
  CheckCircle2, 
  Circle, 
  Calendar, 
  Flame, 
  Smile, 
  Meh, 
  Frown, 
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Activity
} from 'lucide-react';
import { translations } from '../data/mockData';

export default function RecoveryTracker({ 
  milestones, 
  patient, 
  onToggleMilestone,
  onSaveRecovery,
  recoveryLogs = [],
  lang 
}) {
  const t = translations[lang];
  const [dailyMood, setDailyMood] = useState('good');
  const [painLevel, setPainLevel] = useState(2);
  const [symptomFeedback, setSymptomFeedback] = useState('');
  const [loggedToday, setLoggedToday] = useState(false);

  const completedCount = milestones.filter(m => m.completed).length;
  const progressPercent = Math.round((completedCount / milestones.length) * 100);

  const handleLogSymptom = async (e) => {
    e.preventDefault();
    const ok=await onSaveRecovery({mood:dailyMood,pain_level:Number(painLevel),symptoms:symptomFeedback});
    if(ok){setLoggedToday(true);setSymptomFeedback('');setTimeout(()=>setLoggedToday(false),3500);}
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-teal-50 text-teal-700 rounded-lg">
              <TrendingUp className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-900">
              {lang === 'ta' ? 'குணமடைதல் முன்னேற்றக் கண்காணிப்பு' : 'Surgical & Clinical Recovery Tracker'}
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {lang === 'ta' 
              ? 'அறுவை சிகிச்சைக்குப் பிந்தைய மைல்கற்கள் மற்றும் தினசரி வலி/குணநிலை பதிவு' 
              : 'Post-intervention rehabilitation pathway, mobility targets, and daily patient self-reporting.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-teal-50 rounded-xl border border-teal-200">
            <span className="text-[11px] text-teal-800 block">Overall Recovery Score</span>
            <span className="text-xl font-bold text-teal-700">{patient.recoveryScore}% Optimized</span>
          </div>
        </div>
      </div>

      {recoveryLogs.length>0 && <div className="bg-white border rounded-2xl p-4 text-sm"><h2 className="font-bold mb-2">Recent recovery check-ins</h2>{recoveryLogs.slice(0,5).map(log=><div key={log.id} className="border-t py-2">{new Date(log.created_at).toLocaleString()} — Mood: {log.mood}; Pain: {log.pain_level}/10; {log.symptoms}</div>)}</div>}
      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Milestone Pathway */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">
              {lang === 'ta' ? 'மீட்புப் பயண மைல்கற்கள் (Milestones)' : 'Rehabilitation Milestones Pathway'}
            </h2>
            <span className="text-xs font-semibold text-slate-500">
              {completedCount} of {milestones.length} Milestones Achieved ({progressPercent}%)
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-teal-500 to-teal-700 h-3 rounded-full transition-all duration-700" 
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>

          {/* Milestones Vertical Timeline */}
          <div className="relative pl-6 space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
            {milestones.map((item, index) => (
              <div key={item.id} className="relative flex items-start gap-4">
                {/* Node icon */}
                <button
                  onClick={() => onToggleMilestone(item.id)}
                  className={`-ml-6 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all bg-white z-10 ${
                    item.completed 
                      ? 'border-teal-600 bg-teal-600 text-white' 
                      : item.active 
                      ? 'border-amber-500 text-amber-500 ring-4 ring-amber-100' 
                      : 'border-slate-300 text-slate-300'
                  }`}
                  title="Click to toggle status"
                >
                  {item.completed ? (
                    <CheckCircle2 className="w-4 h-4 fill-teal-600 stroke-white" />
                  ) : (
                    <Circle className="w-3 h-3" />
                  )}
                </button>

                {/* Content */}
                <div className={`flex-1 p-4 rounded-xl border transition-all ${
                  item.completed 
                    ? 'border-teal-100 bg-teal-50/20' 
                    : item.active 
                    ? 'border-amber-200 bg-amber-50/30' 
                    : 'border-slate-200 bg-slate-50/50'
                }`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200 w-fit">
                      {item.day}
                    </span>
                    <span className="text-xs text-slate-500">{item.date}</span>
                  </div>
                  <h4 className={`text-sm font-bold mt-2 ${item.completed ? 'text-teal-900' : 'text-slate-800'}`}>
                    {item.title}
                  </h4>
                  <div className="mt-2 flex items-center gap-2">
                    <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                      item.completed 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : item.active 
                        ? 'bg-amber-100 text-amber-800' 
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {item.completed 
                        ? (lang === 'ta' ? 'வெற்றிகரமாக முடிந்தது' : 'Achieved & Verified') 
                        : item.active 
                        ? (lang === 'ta' ? 'தற்போதைய இலக்கு' : 'Current Clinical Focus') 
                        : (lang === 'ta' ? 'வரவிருக்கும் இலக்கு' : 'Upcoming Milestone')}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: Daily Patient Self-Assessment Log */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-teal-600" />
              <h3 className="text-sm font-bold text-slate-900">
                {lang === 'ta' ? 'இன்றைய நலம் & வலி மதிப்பீடு' : 'Daily Self-Assessment'}
              </h3>
            </div>

            <form onSubmit={handleLogSymptom} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-2">
                  How are you feeling overall today?
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setDailyMood('good')}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      dailyMood === 'good' 
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-800 font-bold' 
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <Smile className="w-6 h-6 mx-auto mb-1 text-emerald-600" />
                    <span>Good / Energetic</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDailyMood('fair')}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      dailyMood === 'fair' 
                        ? 'border-amber-500 bg-amber-50 text-amber-800 font-bold' 
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <Meh className="w-6 h-6 mx-auto mb-1 text-amber-600" />
                    <span>Mild Tired</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDailyMood('poor')}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      dailyMood === 'poor' 
                        ? 'border-rose-500 bg-rose-50 text-rose-800 font-bold' 
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <Frown className="w-6 h-6 mx-auto mb-1 text-rose-600" />
                    <span>Uncomfortable</span>
                  </button>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-slate-600 font-semibold">Pain / Discomfort Index (0 - 10)</label>
                  <span className="font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">{painLevel} / 10</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={painLevel}
                  onChange={(e) => setPainLevel(Number(e.target.value))}
                  className="w-full accent-teal-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                  <span>0 (No Pain)</span>
                  <span>5 (Moderate)</span>
                  <span>10 (Severe)</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">
                  Additional Notes or Sensations
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Mild tenderness at incision site, walk felt easy..."
                  value={symptomFeedback}
                  onChange={(e) => setSymptomFeedback(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-teal-500 text-xs"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl transition-colors shadow-xs"
              >
                {loggedToday ? "✓ Saved to Supabase!" : "Submit Daily Check-in"}
              </button>
            </form>
          </div>

          <div className="p-4 rounded-xl bg-teal-50 border border-teal-200 text-xs text-teal-900 space-y-1">
            <span className="font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-teal-700" />
              Automated Doctor Sync
            </span>
            <p className="text-[11px] leading-relaxed text-teal-800">
              Responses are automatically analyzed by CasualCare AI. Pain scores &gt; 6 trigger an immediate follow-up SMS ping to the attending clinician.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
