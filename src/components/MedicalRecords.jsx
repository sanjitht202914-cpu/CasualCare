import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Eye, 
  Plus, 
  Search, 
  CheckCircle2, 
  FileCheck, 
  Calendar, 
  Building, 
  UserCheck,
  ShieldCheck,
  Share2
} from 'lucide-react';
import { translations } from '../data/mockData';

export default function MedicalRecords({ records, onAddRecord, lang }) {
  const t = translations[lang];
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [activeModalRecord, setActiveModalRecord] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const [newRec, setNewRec] = useState({
    title: '',
    category: 'Discharge & Surgery',
    doctor: '',
    hospital: '',
    summary: ''
  });

  const categories = ['All', 'Discharge & Surgery', 'Laboratory', 'Diagnostics', 'Ophthalmology'];

  const filteredRecords = records.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          r.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          r.hospital.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || r.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleUpload = (e) => {
    e.preventDefault();
    if (!newRec.title || !newRec.doctor) return;

    onAddRecord({
      id: `REC-2026-${Math.floor(100 + Math.random() * 900)}`,
      ...newRec,
      date: new Date().toISOString().split('T')[0],
      fileSize: "1.2 MB PDF",
      verified: true
    });

    setNewRec({
      title: '',
      category: 'Discharge & Surgery',
      doctor: '',
      hospital: '',
      summary: ''
    });
    setShowUploadModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-teal-50 text-teal-700 rounded-lg">
              <FileText className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-900">
              {lang === 'ta' ? 'மருத்துவ ஆவணங்கள் & அறிக்கைகள்' : 'Digital Health Records & Diagnostics'}
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {lang === 'ta' 
              ? 'அனைத்து மருத்துவ ஆவணங்கள், ரத்த பரிசோதனைகள் மற்றும் வெளியேற்ற சுருக்கம்' 
              : 'Encrypted post-operative clinical summaries, lab reports, ECGs, and imaging documents.'}
          </p>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-xs transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>{lang === 'ta' ? 'புதிய ஆவணம் பதிவேற்ற' : 'Upload Medical Report'}</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={t.common.searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        {/* Categories */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto scrollbar-none">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                categoryFilter === cat 
                  ? 'bg-teal-600 text-white shadow-xs' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Records Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredRecords.map((rec) => (
          <div key={rec.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3 hover:border-teal-300 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-teal-50 text-teal-700 border border-teal-200">
                    {rec.category}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 mt-2">{rec.title}</h3>
                </div>
                <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded font-mono">
                  {rec.id}
                </span>
              </div>

              <div className="mt-3 space-y-1 text-xs text-slate-600">
                <div className="flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-teal-600" />
                  <span>{rec.doctor}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-slate-400" />
                  <span>{rec.hospital}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Date: {rec.date} • {rec.fileSize}</span>
                </div>
              </div>

              <p className="mt-3 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 line-clamp-2">
                "{rec.summary}"
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-emerald-600 flex items-center gap-1 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Verified Clinical Document
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveModalRecord(rec)}
                  className="px-2.5 py-1 text-xs font-semibold text-teal-700 hover:bg-teal-50 rounded-lg flex items-center gap-1 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View</span>
                </button>
                <a
                  href={`#download-${rec.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    alert(`Downloading verified copy of: ${rec.title}`);
                  }}
                  className="px-2.5 py-1 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg flex items-center gap-1 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>PDF</span>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Record Preview Modal */}
      {activeModalRecord && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold text-teal-600 uppercase tracking-wider">{activeModalRecord.category}</span>
                <h3 className="text-base font-bold text-slate-900 mt-1">{activeModalRecord.title}</h3>
                <p className="text-xs text-slate-500">{activeModalRecord.hospital} • {activeModalRecord.date}</p>
              </div>
              <button 
                onClick={() => setActiveModalRecord(null)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-2">
              <div className="font-semibold text-slate-900">Clinical Finding Summary:</div>
              <p className="leading-relaxed">{activeModalRecord.summary}</p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
              <div><strong>Attending Physician:</strong> {activeModalRecord.doctor}</div>
              <div><strong>Record Reference:</strong> {activeModalRecord.id}</div>
              <div><strong>Digital Signature:</strong> Verified Cryptographic SHA-256</div>
              <div><strong>Encryption:</strong> CasualCare HIPAA Compliant</div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  alert("Sharable temporary secure link copied to clipboard for attending specialists.");
                }}
                className="px-3 py-2 border border-slate-300 rounded-xl text-xs font-semibold hover:bg-slate-50 flex items-center gap-1.5"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share with Doctor</span>
              </button>
              <button
                onClick={() => setActiveModalRecord(null)}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-4">
              {lang === 'ta' ? 'புதிய மருத்துவ அறிக்கை பதிவேற்றம்' : 'Upload Medical Report / Diagnostic File'}
            </h3>

            <form onSubmit={handleUpload} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Document Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 2D Echo Cardiogram Report"
                  value={newRec.title}
                  onChange={(e) => setNewRec({ ...newRec, title: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Category</label>
                <select
                  value={newRec.category}
                  onChange={(e) => setNewRec({ ...newRec, category: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option>Discharge & Surgery</option>
                  <option>Laboratory</option>
                  <option>Diagnostics</option>
                  <option>Ophthalmology</option>
                  <option>General Medicine</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Doctor Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. K. Ravichandran"
                    value={newRec.doctor}
                    onChange={(e) => setNewRec({ ...newRec, doctor: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Hospital / Lab</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Apollo Hospital"
                    value={newRec.hospital}
                    onChange={(e) => setNewRec({ ...newRec, hospital: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Clinical Summary / Key Readings</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Summary of findings, normal levels, or doctor prescriptions..."
                  value={newRec.summary}
                  onChange={(e) => setNewRec({ ...newRec, summary: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl hover:bg-slate-50 font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-semibold shadow-xs"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
