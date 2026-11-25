import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  MapPin, 
  PhoneCall, 
  Radio, 
  Navigation, 
  Building2, 
  Clock, 
  AlertOctagon, 
  CheckCircle2, 
  Sparkles,
  Ambulance,
  Phone
} from 'lucide-react';
import { initialEmergencyData, translations } from '../data/mockData';
import { snsService } from '../services/snsService';

export default function EmergencySOS({ 
  patient, 
  lang, 
  sosActive, 
  setSosActive,
  escalationLevel,
  onSendEmergencyAlert 
}) {
  const t = translations[lang];
  const [emergencyData, setEmergencyData] = useState(initialEmergencyData);
  const [eta, setEta] = useState(6);
  const [dispatchStatus, setDispatchStatus] = useState("Unit En Route");
  const [isDispatching, setIsDispatching] = useState(false);
  const [dispatchFeedback, setDispatchFeedback] = useState(null);

  // Live countdown effect when SOS is triggered
  useEffect(() => {
    let timer;
    if (sosActive && eta > 1) {
      timer = setInterval(() => {
        setEta((prev) => (prev > 1 ? prev - 1 : 1));
      }, 30000); // decrement every 30s in demo
    }
    return () => clearInterval(timer);
  }, [sosActive, eta]);

  const handleTrigger = async () => {
    if (isDispatching) return;
    setIsDispatching(true);
    setDispatchFeedback(null);
    try {
      const patientId = patient?.id || patient?.patient_id || 'PT-9042';
      const location = emergencyData?.currentLocation?.address || patient?.address || 'Plot 42, 4th Avenue, Anna Nagar, Chennai - 600040';
      const message = `Critical Emergency SOS: Immediate ACLS Ambulance & Paramedic dispatch requested for patient ${patient?.name || patientId}.`;

      if (onSendEmergencyAlert) {
        const res = await onSendEmergencyAlert(message, location);
        if (!res?.success) {
          throw new Error(res?.error || 'Failed to dispatch alert.');
        }
      } else {
        await snsService.sendEmergencyAlertViaSns({
          patientId,
          location,
          message
        });
        setSosActive(true);
      }

      setEta(6);
      setDispatchStatus("Unit En Route - Code Red Priority (Dispatched via SNS Workbench)");
      setDispatchFeedback({
        type: 'success',
        text: 'Emergency SOS alert dispatched successfully via SNS Agent Workbench.'
      });
    } catch (err) {
      setDispatchFeedback({
        type: 'error',
        text: err.message || 'Emergency dispatch failed. Please call 108 / 112 directly.'
      });
    } finally {
      setIsDispatching(false);
    }
  };

  const handleCancelSOS = () => {
    if (window.confirm("Are you sure you want to cancel the Emergency SOS dispatch?")) {
      setSosActive(false);
      setDispatchStatus("Standby");
      setEta(6);
      setDispatchFeedback(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Alert */}
      <div className={`p-6 rounded-2xl border transition-all ${
        sosActive 
          ? 'bg-rose-600 text-white shadow-xl ring-4 ring-rose-200' 
          : 'bg-white border-slate-200 shadow-xs'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
              sosActive ? 'bg-white text-rose-600 animate-bounce' : 'bg-rose-50 text-rose-600'
            }`}>
              <ShieldAlert className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                  sosActive ? 'bg-rose-800 text-white' : 'bg-rose-100 text-rose-700'
                }`}>
                  {sosActive ? "CRITICAL EMERGENCY ACTIVE" : "EMERGENCY PROTOCOL STANDBY"}
                </span>
                <span className={`text-xs ${sosActive ? 'text-rose-100' : 'text-slate-500'}`}>
                  ● 24/7 Paramedic Response
                </span>
              </div>
              <h1 className={`text-xl sm:text-2xl font-black mt-1 ${sosActive ? 'text-white' : 'text-slate-900'}`}>
                {lang === 'ta' ? 'அவசர SOS & ஆம்புலன்ஸ் ஜி.பி.எஸ் உதவி' : 'GPS Emergency SOS & ACLS Ambulance Assistance'}
              </h1>
              <p className={`text-xs mt-1 ${sosActive ? 'text-rose-100' : 'text-slate-500'}`}>
                {lang === 'ta' 
                  ? 'ஒரே தட்டலில் நேரலை ஜிபிஎஸ் பகிர்வு, குடும்ப எச்சரிக்கை மற்றும் உடனடி ஆம்புலன்ஸ் புறப்பாடு' 
                  : 'Instant satellite telemetry, nearest hospital ICU routing, and automated family voice alert.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {!sosActive ? (
              <button
                onClick={handleTrigger}
                disabled={isDispatching}
                className="px-6 py-3.5 bg-rose-600 hover:bg-rose-700 disabled:bg-rose-400 disabled:cursor-not-allowed text-white font-extrabold text-sm rounded-xl shadow-lg transition-all active:scale-95 flex items-center gap-2"
              >
                <ShieldAlert className={`w-5 h-5 ${isDispatching ? 'animate-spin' : 'animate-pulse'}`} />
                <span>{isDispatching ? 'DISPATCHING VIA SNS...' : 'ACTIVATE SOS NOW'}</span>
              </button>
            ) : (
              <button
                onClick={handleCancelSOS}
                disabled={isDispatching}
                className="px-5 py-3 bg-white text-rose-700 hover:bg-rose-50 font-bold text-xs sm:text-sm rounded-xl shadow transition-all"
              >
                Cancel / Stand Down SOS
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Real-time Dispatch Feedback Banner */}
      {dispatchFeedback && (
        <div
          role="alert"
          className={`p-4 rounded-2xl border text-xs font-semibold flex items-start gap-3 shadow-xs ${
            dispatchFeedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
              : 'bg-rose-50 text-rose-900 border-rose-300'
          }`}
        >
          {dispatchFeedback.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <AlertOctagon className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          )}
          <div className="flex-1">
            <div className="font-bold">
              {dispatchFeedback.type === 'success' ? 'SNS Dispatch Verified' : 'SNS Dispatch Status'}
            </div>
            <p className="mt-0.5 leading-relaxed font-normal">{dispatchFeedback.text}</p>
          </div>
        </div>
      )}

      {/* Ambulance Dispatch & GPS Live Tracker Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Live Ambulance Telemetry & Map Simulation */}
        <div className="lg:col-span-2 space-y-6">
          {/* Simulated Map View */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Navigation className="w-4 h-4 text-teal-400 animate-spin" />
                <span className="text-xs font-bold font-mono">GPS SATELLITE DISPATCH GRID - 13.0850° N, 80.2101° E</span>
              </div>
              <span className="text-[11px] bg-teal-500/20 text-teal-300 border border-teal-400/40 px-2 py-0.5 rounded font-mono">
                High Precision GPS Lock
              </span>
            </div>

            {/* Visual Vector Grid Map Container */}
            <div className="h-72 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 relative flex items-center justify-center p-6 text-white overflow-hidden">
              {/* Grid Lines Pattern */}
              <div className="absolute inset-0 opacity-15 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
              
              {/* Radar Sweeper if SOS Active */}
              {sosActive && (
                <div className="absolute w-80 h-80 rounded-full border border-rose-500/40 animate-ping"></div>
              )}

              {/* Patient Pin */}
              <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 text-center z-10">
                <div className="w-10 h-10 rounded-full bg-teal-500 text-white flex items-center justify-center shadow-lg border-2 border-white mx-auto">
                  <MapPin className="w-6 h-6" />
                </div>
                <div className="bg-slate-900/90 backdrop-blur-xs px-2 py-1 rounded text-[10px] font-bold mt-1 border border-slate-700 whitespace-nowrap">
                  Patient: Karthik Subramanian
                </div>
              </div>

              {/* Ambulance Pin */}
              <div className={`absolute top-1/3 right-1/4 -translate-x-1/2 -translate-y-1/2 text-center z-10 transition-all duration-1000 ${
                sosActive ? 'scale-110' : ''
              }`}>
                <div className="w-10 h-10 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-lg border-2 border-white mx-auto animate-pulse">
                  <Radio className="w-5 h-5" />
                </div>
                <div className="bg-rose-950/90 text-rose-200 px-2 py-1 rounded text-[10px] font-bold mt-1 border border-rose-700 whitespace-nowrap">
                  Unit {emergencyData.nearestAmbulance.unitId} ({eta} mins away)
                </div>
              </div>

              {/* Connection Vector */}
              <div className="absolute top-1/2 left-1/3 right-1/4 h-0.5 border-t-2 border-dashed border-rose-400/60 pointer-events-none"></div>

              {/* Quick Map Overlay Footer */}
              <div className="absolute bottom-3 left-3 right-3 bg-slate-900/90 backdrop-blur-md rounded-xl p-3 border border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs gap-2">
                <div>
                  <span className="text-slate-400 block text-[10px]">CURRENT GEO-LOCATION:</span>
                  <span className="font-semibold text-slate-200">{emergencyData.currentLocation.address}</span>
                </div>
                <span className="text-teal-400 text-[11px] font-mono shrink-0">
                  Landmark: {emergencyData.currentLocation.landmark}
                </span>
              </div>
            </div>
          </div>

          {/* Dispatched Ambulance Telemetry Details */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Radio className="w-4 h-4 text-rose-600" />
                <span>{lang === 'ta' ? 'அவசர ஆம்புலன்ஸ் விவரங்கள்' : 'Dispatched Paramedic & ACLS Unit'}</span>
              </h3>
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                sosActive ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-600'
              }`}>
                Status: {dispatchStatus}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                <span className="text-[10px] text-slate-500">Unit Call Sign</span>
                <div className="font-bold text-slate-900 mt-0.5">{emergencyData.nearestAmbulance.unitId}</div>
                <span className="text-[10px] text-slate-600">{emergencyData.nearestAmbulance.type}</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                <span className="text-[10px] text-slate-500">Estimated Arrival</span>
                <div className="font-bold text-rose-600 text-base mt-0.5">{eta} Minutes</div>
                <span className="text-[10px] text-slate-600">Distance: {emergencyData.nearestAmbulance.distanceKm} km</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                <span className="text-[10px] text-slate-500">Paramedic Driver</span>
                <div className="font-bold text-slate-900 mt-0.5">{emergencyData.nearestAmbulance.driver}</div>
                <span className="text-[10px] text-teal-700">ACLS Certified</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex flex-col justify-between">
                <span className="text-[10px] text-slate-500">Direct Comms</span>
                <a 
                  href={`tel:${emergencyData.nearestAmbulance.contact}`}
                  className="py-1 px-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-center font-bold text-[11px] transition-colors"
                >
                  Call Ambulance Driver
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Nearest Network Hospitals & Rapid SOS Trigger */}
        <div className="space-y-6">
          {/* Quick Panic Trigger Card */}
          <div className="bg-gradient-to-b from-rose-700 to-rose-900 text-white rounded-2xl p-6 shadow-md text-center space-y-4">
            <h3 className="font-black text-lg">ONE-TAP EMERGENCY DISPATCH</h3>
            <p className="text-xs text-rose-100 leading-relaxed">
              Tapping will immediately broadcast your medical profile (Blood Group: O+, Post-Op Cardiac) to emergency responders and notify your family guardians.
            </p>

            <button
              onClick={handleTrigger}
              disabled={isDispatching || sosActive}
              className="w-full py-4 bg-white hover:bg-rose-50 disabled:bg-rose-100 disabled:text-rose-400 disabled:cursor-not-allowed text-rose-700 font-black text-sm rounded-xl shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2"
            >
              <ShieldAlert className={`w-5 h-5 text-rose-600 ${isDispatching ? 'animate-spin' : ''}`} />
              <span>
                {isDispatching
                  ? 'DISPATCHING VIA SNS WORKBENCH...'
                  : sosActive
                  ? 'SOS DISPATCH ACTIVE'
                  : 'DISPATCH CODE RED AMBULANCE'}
              </span>
            </button>

            <div className="pt-2 text-[11px] text-rose-200 flex items-center justify-center gap-2">
              <Phone className="w-3.5 h-3.5" />
              <span>Direct Emergency Helpline: <strong>108 / 112</strong></span>
            </div>
          </div>

          {/* Nearest Network Hospitals */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-teal-600" />
              <span>{lang === 'ta' ? 'அருகிலுள்ள மருத்துவமனைகள்' : 'Nearest Network Emergency Hubs'}</span>
            </h3>

            <div className="space-y-3 text-xs">
              {emergencyData.hospitalsNearby.map((h, i) => (
                <div key={i} className="p-3 rounded-xl border border-slate-100 bg-slate-50 space-y-1.5">
                  <div className="flex items-start justify-between">
                    <span className="font-bold text-slate-900">{h.name}</span>
                    <span className="text-[11px] text-teal-700 font-semibold">{h.distance}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-500 text-[11px]">
                    <span>Transit: <strong>{h.time}</strong></span>
                    <span className="text-emerald-700 font-semibold">● {h.icuBeds} ICU Beds Available</span>
                  </div>
                  <a 
                    href={`tel:${h.phone}`}
                    className="block text-right text-teal-600 hover:underline font-semibold text-[11px]"
                  >
                    Call Emergency Desk ({h.phone}) →
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
