import React, { useState } from 'react';
import { 
  Users, 
  UserCheck, 
  Calendar, 
  Clock, 
  FileCheck, 
  AlertTriangle, 
  Send, 
  Activity, 
  Phone, 
  FileText, 
  Check, 
  Search,
  Filter
} from 'lucide-react';
import { translations } from '../data/mockData';

export default function DoctorPortal({ lang, patient, medicines, doctors = [], onBookAppointment }) {
  const t = translations[lang];
  const [selectedDoctorId, setSelectedDoctorId] = useState(null);
  const selectedDoctor = doctors.find(d=>d.id===selectedDoctorId) || doctors[0];
  const [bookingOpen,setBookingOpen]=useState(false);
  const [bookingDate,setBookingDate]=useState('');
  const [bookingTime,setBookingTime]=useState('');
  const [bookingBusy,setBookingBusy]=useState(false);
  const [bookingMessage,setBookingMessage]=useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('clinical');
  const [clinicalNotes, setClinicalNotes] = useState(
    "Patient is responding favorably to postoperative regimen. Sinus rhythm is consistent. Blood glucose post-breakfast remains well controlled under Metformin 500mg. Recommended scheduled walking 15 mins daily with hydration."
  );
  const [isSaved, setIsSaved] = useState(false);

  const handleSaveNotes = (e) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  if (!selectedDoctor) return <div className="p-6">No doctors available from Supabase.</div>;
  return (
    <div className="space-y-6">
      {/* Doctor Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img 
              src={selectedDoctor.avatar} 
              alt={selectedDoctor.name} 
              className="w-16 h-16 rounded-2xl object-cover border-2 border-teal-500 shadow-sm"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs bg-teal-100 text-teal-800 font-semibold px-2.5 py-0.5 rounded-full">
                  {selectedDoctor.department}
                </span>
                <span className="text-xs text-slate-500">
                  {selectedDoctor.experience}
                </span>
              </div>
              <h1 className="text-xl font-bold text-slate-900 mt-1">{selectedDoctor.name}</h1>
              <p className="text-xs text-slate-600">
                {selectedDoctor.qualification} • {selectedDoctor.hospital}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <span className="text-xs text-slate-500 block">Assigned Active Patients</span>
              <span className="text-lg font-bold text-teal-700">{selectedDoctor.patientsCount} Under Monitoring</span>
            </div>
            <button 
              onClick={() => {setBookingMessage('');setBookingOpen(true);}}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-medium text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Calendar className="w-4 h-4" />
              <span>{lang === 'ta' ? 'அமர்வு திட்டமிடல்' : 'Schedule Tele-Consult'}</span>
            </button>
          </div>
        </div>

        {/* Doctor Switcher Pills */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 mr-2">
            {lang === 'ta' ? 'மருத்துவர் தேர்வு:' : 'Switch Active Specialist:'}
          </span>
          {doctors.map(doc => (
            <button
              key={doc.id}
              onClick={() => setSelectedDoctorId(doc.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedDoctor.id === doc.id
                  ? 'bg-teal-600 text-white shadow-xs font-semibold'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {doc.name} ({doc.department})
            </button>
          ))}
        </div>
      </div>

      {bookingOpen && <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Schedule Tele-Consult">
        <form className="bg-white rounded-2xl p-6 w-full max-w-md space-y-4 shadow-xl" onSubmit={async e=>{
          e.preventDefault();
          if (bookingBusy) return;
          setBookingBusy(true);
          setBookingMessage(null);
          try {
            const res = await onBookAppointment(selectedDoctor.id, bookingDate, bookingTime);
            if (res === true || res?.success) {
              setBookingMessage({
                type: 'success',
                text: 'Appointment scheduled via SNS Workbench and verified in Supabase.'
              });
              setBookingDate('');
              setBookingTime('');
            } else {
              setBookingMessage({
                type: 'error',
                text: res?.error || 'Booking failed. Check connection and try again.'
              });
            }
          } catch (err) {
            setBookingMessage({
              type: 'error',
              text: err.message || 'Booking failed.'
            });
          } finally {
            setBookingBusy(false);
          }
        }}>
          <h2 className="text-lg font-bold">Schedule Tele-Consult</h2>
          <p className="text-sm text-slate-600">Doctor: {selectedDoctor.name}</p>
          <label className="block text-sm">Appointment date<input disabled={bookingBusy} className="mt-1 w-full border rounded-lg p-2 disabled:bg-slate-100 disabled:cursor-not-allowed" type="date" min={new Date().toLocaleDateString('en-CA')} required value={bookingDate} onChange={e=>setBookingDate(e.target.value)}/></label>
          <label className="block text-sm">Appointment time<input disabled={bookingBusy} className="mt-1 w-full border rounded-lg p-2 disabled:bg-slate-100 disabled:cursor-not-allowed" type="time" required value={bookingTime} onChange={e=>setBookingTime(e.target.value)}/></label>
          {bookingMessage && (
            <div
              role="status"
              className={`p-3 rounded-xl text-xs font-semibold leading-relaxed ${
                bookingMessage.type === 'error'
                  ? 'bg-rose-50 text-rose-800 border border-rose-200'
                  : 'bg-teal-50 text-teal-800 border border-teal-200'
              }`}
            >
              {bookingMessage.text}
            </div>
          )}
          <div className="flex justify-end gap-3"><button type="button" disabled={bookingBusy} onClick={()=>{setBookingOpen(false); setBookingMessage(null);}} className="px-4 py-2 border rounded-lg hover:bg-slate-50 disabled:opacity-50">Close</button><button disabled={bookingBusy} type="submit" className="px-4 py-2 bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-semibold text-xs">{bookingBusy?'Verifying with SNS & Supabase...':'Confirm Booking'}</button></div>
        </form>
      </div>}
      {/* Main Grid: Patient Overview & Clinical Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Comprehensive Patient Clinical Telemetry */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Stats on selected patient */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  {lang === 'ta' ? 'நோயாளி மருத்துவ சுருக்கம்' : 'Patient Clinical Status & Vitals History'}
                </h2>
                <p className="text-xs text-slate-500">
                  Patient: <strong className="text-slate-800">{patient.name} ({patient.id})</strong> • Condition: {patient.condition}
                </p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                ● Tele-Telemetry Active
              </span>
            </div>

            {/* Vitals overview */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60">
                <span className="text-[11px] text-slate-500">Blood Pressure</span>
                <div className="text-lg font-bold text-slate-800 mt-0.5">{patient.vitals.bp}</div>
                <span className="text-[10px] text-emerald-600">Controlled</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60">
                <span className="text-[11px] text-slate-500">Heart Rate</span>
                <div className="text-lg font-bold text-slate-800 mt-0.5">{patient.vitals.heartRate} bpm</div>
                <span className="text-[10px] text-emerald-600">Resting Sinus</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60">
                <span className="text-[11px] text-slate-500">Blood Glucose</span>
                <div className="text-lg font-bold text-slate-800 mt-0.5">{patient.vitals.bloodSugar}</div>
                <span className="text-[10px] text-amber-600">Post Meal OK</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60">
                <span className="text-[11px] text-slate-500">Recovery Score</span>
                <div className="text-lg font-bold text-teal-700 mt-0.5">{patient.recoveryScore}%</div>
                <span className="text-[10px] text-teal-600">Stage 2 Track</span>
              </div>
            </div>

            {/* Clinical Observations & Progress Notes */}
            <div className="pt-2">
              <label className="block text-xs font-bold text-slate-700 mb-2">
                {lang === 'ta' ? 'மருத்துவர் மருத்துவக் குறிப்பு & ஆலோசனைகள்:' : 'Physician Clinical Directives & Tele-Notes:'}
              </label>
              <textarea
                rows={4}
                value={clinicalNotes}
                onChange={(e) => setClinicalNotes(e.target.value)}
                className="w-full text-xs p-3.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none leading-relaxed text-slate-800 bg-slate-50/50"
              />
              <div className="flex items-center justify-between mt-3">
                <span className="text-[11px] text-slate-500">
                  Last updated by {selectedDoctor.name} at 09:15 AM today
                </span>
                <button
                  type="button"
                  onClick={handleSaveNotes}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <Check className="w-3.5 h-3.5 text-teal-400" />
                  <span>{isSaved ? (lang === 'ta' ? 'பதிவானது!' : 'Notes Saved!') : (lang === 'ta' ? 'குறிப்பை சேமிக்க' : 'Save Directives')}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Active Medication Review Table */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-teal-600" />
              <span>{lang === 'ta' ? 'செயலில் உள்ள மருந்துகள் பட்டியல்' : 'Active Prescribed Regimen Review'}</span>
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500">
                    <th className="pb-2 font-semibold">Medicine & Dosage</th>
                    <th className="pb-2 font-semibold">Frequency / Timing</th>
                    <th className="pb-2 font-semibold">Indication</th>
                    <th className="pb-2 font-semibold text-right">Adherence</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {medicines.map((m) => (
                    <tr key={m.id} className="text-slate-700">
                      <td className="py-2.5 font-medium text-slate-900">
                        {m.name} <span className="text-slate-500 font-normal">({m.dosage})</span>
                      </td>
                      <td className="py-2.5 text-slate-600">{m.timing}</td>
                      <td className="py-2.5 text-slate-600">{m.purpose}</td>
                      <td className="py-2.5 text-right">
                        <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold ${
                          m.takenToday ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                        }`}>
                          {m.takenToday ? 'Dose Taken' : 'Pending Confirmation'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Col: Remote Communication & Quick Call */}
        <div className="space-y-6">
          {/* Quick Patient & Family Contact Box */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Phone className="w-4 h-4 text-teal-600" />
              <span>{lang === 'ta' ? 'நேரடி தொடர்பு வசதி' : 'Instant Tele-Channel'}</span>
            </h3>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="text-xs font-semibold text-slate-800">Primary Patient:</div>
              <div className="text-xs text-slate-600">{patient.name} ({patient.phone})</div>
              <a 
                href={`tel:${patient.phone}`}
                className="w-full mt-2 py-2 px-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Patient Directly</span>
              </a>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="text-xs font-semibold text-slate-800">Family Caregiver Contact:</div>
              <div className="text-xs text-slate-600">Priya Subramanian (+91 98409 87654)</div>
              <a 
                href="https://wa.me/919840987654?text=Hello%20Priya,%20this%20is%20Dr.%20Ravichandran%20regarding%20Karthik's%20CasualCare%20recovery."
                target="_blank"
                rel="noreferrer"
                className="w-full mt-2 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Message Caregiver on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Clinical Escalation Matrix Notice */}
          <div className="bg-amber-50 rounded-2xl border border-amber-200 p-5 shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-amber-800 text-xs font-bold uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Escalation Rule Active</span>
            </div>
            <p className="text-xs text-amber-900 leading-relaxed">
              If patient vitals exceed Systolic &gt; 150 mmHg or pulse falls below 50 bpm, the automated CasualCare algorithm alerts Dr. Ravichandran and family circle simultaneously within 3 minutes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
