import React, { useState } from 'react';
import { 
  Users, 
  Phone, 
  ShieldCheck, 
  MessageSquare, 
  Plus, 
  AlertTriangle, 
  Check, 
  BellRing,
  HeartHandshake,
  UserCheck
} from 'lucide-react';
import { translations } from '../data/mockData';

export default function FamilyCircle({ 
  familyCircle, 
  onAddContact, 
  lang,
  onTriggerSOS 
}) {
  const t = translations[lang];
  const [showAdd, setShowAdd] = useState(false);
  const [newMember, setNewMember] = useState({
    name: '',
    relationship: 'Family Member',
    phone: '',
    canAuthorizeSOS: true,
    smsAlerts: true,
    whatsappAlerts: true
  });

  const [testSent, setTestSent] = useState(null);

  const handleSendTestAlert = (memberId, memberName) => {
    setTestSent(memberId);
    setTimeout(() => setTestSent(null), 3000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newMember.name || !newMember.phone) return;

    onAddContact({
      id: `fc-${Date.now()}`,
      ...newMember,
      status: "Verified Emergency Contact",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80"
    });

    setNewMember({
      name: '',
      relationship: 'Family Member',
      phone: '',
      canAuthorizeSOS: true,
      smsAlerts: true,
      whatsappAlerts: true
    });
    setShowAdd(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-blue-50 text-blue-700 rounded-lg">
              <Users className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-900">
              {lang === 'ta' ? 'குடும்பப் பாதுகாப்பு வட்டம் (Family Care Circle)' : 'Family Care Circle & Emergency Guardians'}
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {lang === 'ta' 
              ? 'நோயாளியிடமிருந்து பதில் இல்லாதபோது உடனடி SMS மற்றும் WhatsApp எச்சரிக்கைகள் பெறும் குடும்பத்தினர்'
              : 'Designated family caregivers connected to the automated 3-tier escalation safety protocol.'}
          </p>
        </div>

        <button
          onClick={() => setShowAdd(true)}
          className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-xs transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>{lang === 'ta' ? 'உறுப்பினர் சேர்க்க' : 'Add Caregiver Contact'}</span>
        </button>
      </div>

      {/* Escalation Safety Protocol Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-900 to-indigo-950 text-white shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <HeartHandshake className="w-6 h-6 text-cyan-300 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-bold">
                {lang === 'ta' ? 'தானியங்கி குடும்ப பாதுகாப்பு முறை' : 'Automated Family Safety Chain'}
              </h3>
              <p className="text-xs text-blue-200/90 mt-0.5 leading-relaxed">
                If Karthik does not acknowledge morning or evening health check-ins within 45 minutes, Priya Subramanian receives an automated priority WhatsApp &amp; voice notification.
              </p>
            </div>
          </div>
          <button
            onClick={onTriggerSOS}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shrink-0 transition-colors shadow-sm"
          >
            Trigger Circle SOS Test
          </button>
        </div>
      </div>

      {/* Family Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {familyCircle.map((member) => (
          <div 
            key={member.id} 
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-teal-300 transition-all"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <img 
                  src={member.avatar} 
                  alt={member.name} 
                  className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shadow-2xs"
                />
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {member.status}
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900">{member.name}</h3>
                <p className="text-xs font-medium text-teal-700">{member.relationship}</p>
                <p className="text-xs text-slate-500 mt-1">{member.phone}</p>
              </div>

              {/* Notification Badges */}
              <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-1 text-[11px]">
                <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md">
                  ✓ SMS Alerts Active
                </span>
                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 rounded-md">
                  ✓ WhatsApp Bot Synced
                </span>
                {member.canAuthorizeSOS && (
                  <span className="px-2 py-0.5 bg-rose-50 text-rose-700 rounded-md font-semibold">
                    ★ SOS Authorized
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
              <a
                href={`tel:${member.phone}`}
                className="flex-1 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call</span>
              </a>

              <button
                onClick={() => handleSendTestAlert(member.id, member.name)}
                className="flex-1 py-2 px-3 bg-teal-50 hover:bg-teal-100 text-teal-800 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <BellRing className="w-3.5 h-3.5 text-teal-600" />
                <span>{testSent === member.id ? "Alert Sent!" : "Test Ping"}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-4">
              {lang === 'ta' ? 'புதிய பாதுகாவலர் விவரம்' : 'Add Family Guardian Contact'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Anand Subramanian"
                  value={newMember.name}
                  onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Relationship</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Brother, Son, Caregiver"
                  value={newMember.relationship}
                  onChange={(e) => setNewMember({ ...newMember, relationship: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Phone Number (with Country Code)</label>
                <input
                  type="text"
                  required
                  placeholder="+91 98400 00000"
                  value={newMember.phone}
                  onChange={(e) => setNewMember({ ...newMember, phone: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                />
              </div>

              <div className="pt-2 space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newMember.canAuthorizeSOS}
                    onChange={(e) => setNewMember({ ...newMember, canAuthorizeSOS: e.target.checked })}
                    className="accent-teal-600 rounded"
                  />
                  <span>Authorize to dispatch ACLS Emergency Ambulance</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newMember.whatsappAlerts}
                    onChange={(e) => setNewMember({ ...newMember, whatsappAlerts: e.target.checked })}
                    className="accent-teal-600 rounded"
                  />
                  <span>Receive WhatsApp check-up escalation updates</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAdd(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl hover:bg-slate-50 font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-semibold shadow-xs"
                >
                  Save Guardian
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
