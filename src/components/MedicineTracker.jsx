import React, { useState } from 'react';
import { 
  Pill, 
  CheckCircle2, 
  Clock, 
  Plus, 
  AlertCircle, 
  Calendar, 
  ShieldCheck, 
  RefreshCw,
  Bell,
  Trash2
} from 'lucide-react';
import { translations } from '../data/mockData';

export default function MedicineTracker({ 
  medicines, 
  onToggleMedicine, 
  onAddMedicine, 
  lang 
}) {
  const t = translations[lang];
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMed, setNewMed] = useState({
    name: '',
    dosage: '',
    timing: '08:00 AM (After Breakfast)',
    frequency: 'Once daily',
    purpose: '',
    remainingDays: 15
  });

  const takenCount = medicines.filter(m => m.takenToday).length;
  const adherence = Math.round((takenCount / medicines.length) * 100) || 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMed.name || !newMed.dosage) return;

    const saved = await onAddMedicine({
      id: `med-${Date.now()}`,
      ...newMed,
      takenToday: false,
      pillColor: "teal"
    });

    if (!saved) return;
    setNewMed({
      name: '',
      dosage: '',
      timing: '08:00 AM (After Breakfast)',
      frequency: 'Once daily',
      purpose: '',
      remainingDays: 15
    });
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-teal-50 text-teal-700 rounded-lg">
              <Pill className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-900">
              {lang === 'ta' ? 'மருந்து கண்காணிப்பாளர் (Med Tracker)' : 'Daily Medication Tracker & Adherence'}
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {lang === 'ta' 
              ? 'அனைத்து மருந்துகளின் உட்கொள்ளல் நேரம், இருப்பு நாட்கள் மற்றும் குடும்ப எச்சரிக்கை விபரம்'
              : 'Medication logs saved securely in Supabase. SMS reminders require separate configuration.'}
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-xs transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>{lang === 'ta' ? 'புதிய மருந்து சேர்க்க' : 'Add Medication'}</span>
        </button>
      </div>

      {/* Adherence Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <span className="text-xs text-slate-500 block">Today's Adherence Rate</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-extrabold text-teal-600">{adherence}%</span>
            <span className="text-xs text-slate-500">({takenCount}/{medicines.length} Doses)</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 mt-3 overflow-hidden">
            <div className="bg-teal-600 h-2 rounded-full transition-all" style={{ width: `${adherence}%` }}></div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <span className="text-xs text-slate-500 block">Next Scheduled Dose</span>
          <div className="text-xl font-bold text-slate-800 mt-1">
            08:30 PM Tonight
          </div>
          <span className="text-xs text-teal-700 mt-1 inline-block">
            Enalapril Maleate (5 mg)
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <span className="text-xs text-slate-500 block">Pharmacy Refill Alert</span>
          <div className="text-xl font-bold text-amber-600 mt-1">
            8 Days Remaining
          </div>
          <span className="text-xs text-slate-500 mt-1 inline-block">
            Atorvastatin 20mg needs refill next week
          </span>
        </div>
      </div>

      {/* Medicine Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {medicines.map((med) => (
          <div 
            key={med.id} 
            className={`bg-white rounded-2xl border p-5 shadow-xs transition-all relative overflow-hidden ${
              med.takenToday ? 'border-emerald-200 bg-emerald-50/20' : 'border-slate-200'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <button
                  onClick={() => onToggleMedicine(med.id)}
                  className={`mt-1 w-6 h-6 rounded-lg border flex items-center justify-center transition-all ${
                    med.takenToday 
                      ? 'bg-emerald-600 border-emerald-600 text-white' 
                      : 'border-slate-300 hover:border-teal-500 bg-white'
                  }`}
                  title={med.takenToday ? "Mark as uncompleted" : "Mark as taken"}
                >
                  {med.takenToday && <CheckCircle2 className="w-4 h-4" />}
                </button>
                <div>
                  <h3 className={`text-base font-bold ${med.takenToday ? 'text-slate-500 line-through' : 'text-slate-900'}`}>
                    {med.name}
                  </h3>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 mt-1 inline-block">
                    Dosage: {med.dosage}
                  </span>
                </div>
              </div>

              <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                med.takenToday 
                  ? 'bg-emerald-100 text-emerald-800' 
                  : 'bg-amber-100 text-amber-800'
              }`}>
                {med.takenToday 
                  ? (lang === 'ta' ? 'எடுக்கப்பட்டது' : 'Taken') 
                  : (lang === 'ta' ? 'நிலுவை' : 'Pending')}
              </span>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span><strong>Timing:</strong> {med.timing} ({med.frequency})</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                <span><strong>Indication:</strong> {med.purpose}</span>
              </div>
              <div className="flex items-center justify-between text-slate-500 pt-1">
                <span>Refill remaining: <strong>{med.remainingDays} days</strong></span>
                <span className="text-[11px] text-teal-600 font-medium">Saved in Supabase</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Medication Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-4">
              {lang === 'ta' ? 'புதிய மருந்து விவரம் சேர்க்க' : 'Add Prescribed Medication'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Medication Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aspirin Cardio, Losartan"
                  value={newMed.name}
                  onChange={(e) => setNewMed({ ...newMed, name: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Dosage</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 50 mg, 1 tablet"
                    value={newMed.dosage}
                    onChange={(e) => setNewMed({ ...newMed, dosage: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Stock (Days)</label>
                  <input
                    type="number"
                    value={newMed.remainingDays}
                    onChange={(e) => setNewMed({ ...newMed, remainingDays: Number(e.target.value) })}
                    className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Schedule & Timing</label>
                <input
                  type="text"
                  value={newMed.timing}
                  onChange={(e) => setNewMed({ ...newMed, timing: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Purpose / Indication</label>
                <input
                  type="text"
                  placeholder="e.g. Hypertension, Blood thinner"
                  value={newMed.purpose}
                  onChange={(e) => setNewMed({ ...newMed, purpose: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl hover:bg-slate-50 font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-semibold shadow-xs"
                >
                  Save Medication
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
