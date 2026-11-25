export const translations = {
  en: {
    brandName: "CasualCare",
    tagline: "Intelligent, Empathetic Healthcare & Continuous Remote Care",
    emergencySOS: "EMERGENCY SOS",
    emergencySOSSub: "Instant Dispatch & Family Alert",
    nav: {
      dashboard: "Patient Dashboard",
      doctorPortal: "Doctor Portal",
      aiAssistant: "AI Care Assistant",
      medicines: "Medicine Tracker",
      recovery: "Recovery Tracker",
      familyCircle: "Family Circle",
      medicalRecords: "Health Records",
      reminders: "Check-up & SMS",
      sos: "Emergency Dispatch"
    },
    common: {
      patient: "Patient",
      doctor: "Doctor",
      status: "Status",
      action: "Action",
      save: "Save Changes",
      viewAll: "View All",
      callNow: "Call Now",
      sendAlert: "Send Immediate Alert",
      active: "Active",
      pending: "Pending",
      completed: "Completed",
      highPriority: "High Priority",
      normal: "Normal",
      searchPlaceholder: "Search records, doctors, prescriptions...",
      tamil: "தமிழ்",
      english: "English",
      emergencyNotice: "24/7 Paramedic & Critical Ambulance Line Connected"
    },
    stats: {
      adherence: "Med Adherence",
      vitals: "Vitals Status",
      recoveryRate: "Recovery Score",
      escalationLevel: "Escalation Level",
      stable: "Stable",
      critical: "Attention Required"
    },
    ai: {
      title: "CasualCare AI Clinical Assistant",
      subtitle: "Bilingual triage, recovery symptom check, and wellness advisory",
      inputPlaceholder: "Ask in English or தமிழில் கேளுங்கள் (e.g., headache remedies, dose queries)...",
      send: "Ask Assistant",
      disclaimer: "AI advice is supportive. In emergencies, tap the red SOS button immediately."
    },
    escalation: {
      level0: "Normal - Check-in Acknowledged",
      level1: "First Reminder Sent via SMS / WhatsApp",
      level2: "Repeated No-Response: Primary Family Contact Notified",
      level3: "Escalated: Automated Paramedic Alert & Emergency Services Triggered"
    }
  },
  ta: {
    brandName: "கேஷுவல் கேர் (CasualCare)",
    tagline: "அறிவார்ந்த, அக்கறையுள்ள மருத்துவ பராமரிப்பு & அவசர உதவி",
    emergencySOS: "அவசர SOS உதவி",
    emergencySOSSub: "உடனடி ஆம்புலன்ஸ் & குடும்ப எச்சரிக்கை",
    nav: {
      dashboard: "நோயாளி கட்டுப்பாட்டகம்",
      doctorPortal: "மருத்துவர் தளம்",
      aiAssistant: "AI மருத்துவ உதவியாளர்",
      medicines: "மருந்து கண்காணிப்பு",
      recovery: "குணமடைதல் நிலை",
      familyCircle: "குடும்பப் பாதுகாப்பு வட்டம்",
      medicalRecords: "மருத்துவ ஆவணங்கள்",
      reminders: "பரிசோதனை & SMS எச்சரிக்கை",
      sos: "அவசர ஆம்புலன்ஸ் சேவை"
    },
    common: {
      patient: "நோயாளி",
      doctor: "மருத்துவர்",
      status: "நிலை",
      action: "நடவடிக்கை",
      save: "சேமிக்கவும்",
      viewAll: "அனைத்தையும் காண்க",
      callNow: "உடனே அழைக்க",
      sendAlert: "உடனடி தகவல் அனுப்பு",
      active: "செயலில் உள்ளது",
      pending: "நிலுவையில் உள்ளது",
      completed: "முடிந்தது",
      highPriority: "அதிமுக்கியம்",
      normal: "இயல்பானது",
      searchPlaceholder: "ஆவணங்கள், மருத்துவர்கள், மருந்துகளைத் தேடுங்கள்...",
      tamil: "தமிழ்",
      english: "English",
      emergencyNotice: "24/7 மருத்துவ அவசர உதவி மற்றும் ஆம்புலன்ஸ் தயார் நிலையில் உள்ளது"
    },
    stats: {
      adherence: "மருந்து உட்கொள்ளல் வீதம்",
      vitals: "உடல் நலம் (Vitals)",
      recoveryRate: "குணமடையும் குறியீடு",
      escalationLevel: "எச்சரிக்கை நிலை",
      stable: "சீரானது",
      critical: "கவனம் தேவை"
    },
    ai: {
      title: "கேஷுவல் கேர் AI மருத்துவ உதவியாளர்",
      subtitle: "தமிழ் & ஆங்கிலத்தில் உடனடி அறிகுறிகள் ஆலோசனை மற்றும் மருந்தறிவு",
      inputPlaceholder: "தமிழிலோ ஆங்கிலத்திலோ கேளுங்கள் (எ.கா: தலைவலி, காய்ச்சல் அல்லது மருந்து நேரம்)...",
      send: "கேளுங்கள்",
      disclaimer: "இது AI மருத்துவ வழிகாட்டல் மட்டுமே. தீவிர அவசரத்திற்கு உடனடியாக SOS பொத்தானை அழுத்தவும்."
    },
    escalation: {
      level0: "இயல்பானது - பதில் பெறப்பட்டது",
      level1: "முதல் நினைவூட்டல் SMS / WhatsApp வழியாக அனுப்பப்பட்டது",
      level2: "பதிலில்லை: குடும்பத்தினருக்கு அவசர அழைப்பு/செய்தி விடுக்கப்பட்டது",
      level3: "தீவிரம்: ஆம்புலன்ஸ் மற்றும் தீவிர மருத்துவ குழுவுக்குத் தகவல் அனுப்பப்பட்டது"
    }
  }
};

export const initialPatientData = {
  id: "PT-9042",
  name: "Karthik Subramanian",
  age: 62,
  gender: "Male",
  bloodGroup: "O+",
  condition: "Post-Cardiac Surgery & Type 2 Diabetes",
  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
  phone: "+91 98401 23456",
  email: "karthik.subramanian@casualcare.org",
  address: "Anna Nagar West, Chennai, Tamil Nadu, 600040",
  currentGPS: {
    lat: 13.0850,
    lng: 80.2101,
    locationName: "Plot 42, 4th Avenue, Anna Nagar, Chennai"
  },
  vitals: {
    heartRate: 74,
    bp: "124/82",
    bloodSugar: "138 mg/dL",
    spo2: "98%",
    temperature: "98.4 °F"
  },
  recoveryScore: 84
};

export const initialMedicines = [
  {
    id: "med-1",
    name: "Metformin Hydrochloride",
    dosage: "500 mg",
    timing: "08:00 AM (After Breakfast)",
    frequency: "Twice daily",
    purpose: "Blood sugar control",
    takenToday: true,
    pillColor: "emerald",
    remainingDays: 14
  },
  {
    id: "med-2",
    name: "Atorvastatin Calcium",
    dosage: "20 mg",
    timing: "01:30 PM (After Lunch)",
    frequency: "Once daily",
    purpose: "Cholesterol & cardiac regulation",
    takenToday: true,
    pillColor: "blue",
    remainingDays: 8
  },
  {
    id: "med-3",
    name: "Enalapril Maleate",
    dosage: "5 mg",
    timing: "08:30 PM (After Dinner)",
    frequency: "Once daily night",
    purpose: "Blood pressure regulation",
    takenToday: false,
    pillColor: "amber",
    remainingDays: 22
  },
  {
    id: "med-4",
    name: "Eco-Aspirin 75",
    dosage: "75 mg",
    timing: "09:00 PM (Bedtime)",
    frequency: "Once daily",
    purpose: "Antiplatelet blood thinner",
    takenToday: false,
    pillColor: "rose",
    remainingDays: 18
  }
];

export const initialRecoveryMilestones = [
  { id: 1, title: "Surgery & CCU Transition", day: "Day 1-3", completed: true, date: "Oct 24, 2026" },
  { id: 2, title: "Independent Assisted Mobility (100m walk)", day: "Day 5-7", completed: true, date: "Oct 28, 2026" },
  { id: 3, title: "Surgical Incision Healing Check", day: "Day 10", completed: true, date: "Nov 02, 2026" },
  { id: 4, title: "Cardiac Stress Test & ECG Follow-up", day: "Day 14", completed: false, date: "Nov 09, 2026", active: true },
  { id: 5, title: "Unassisted 1km Walk & Stair Climb", day: "Day 21", completed: false, date: "Nov 16, 2026" },
  { id: 6, title: "Full Daily Routine Normalization", day: "Day 30", completed: false, date: "Nov 25, 2026" }
];

export const initialFamilyCircle = [
  {
    id: "fc-1",
    name: "Priya Subramanian",
    relationship: "Daughter (Primary Caregiver)",
    phone: "+91 98409 87654",
    status: "Verified Emergency Contact",
    canAuthorizeSOS: true,
    smsAlerts: true,
    whatsappAlerts: true,
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80"
  },
  {
    id: "fc-2",
    name: "Dr. Arvind Subramanian",
    relationship: "Son (Medical Professional)",
    phone: "+91 97910 11223",
    status: "Secondary Contact",
    canAuthorizeSOS: true,
    smsAlerts: true,
    whatsappAlerts: true,
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=80"
  },
  {
    id: "fc-3",
    name: "Meenakshi Subramanian",
    relationship: "Spouse",
    phone: "+91 94441 55667",
    status: "Resident Contact",
    canAuthorizeSOS: true,
    smsAlerts: true,
    whatsappAlerts: true,
    avatar: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=100&auto=format&fit=crop&q=80"
  }
];

export const initialMedicalRecords = [
  {
    id: "REC-2026-089",
    title: "Post-Operative Cardiac Discharge Summary",
    category: "Discharge & Surgery",
    doctor: "Dr. K. Ravichandran, MS, MCh (Cardio)",
    date: "2026-10-27",
    hospital: "Apollo Specialty Heart Centre, Greams Road",
    fileSize: "2.8 MB PDF",
    verified: true,
    summary: "Successful coronary revascularization. Left ventricular ejection fraction 52%. Advised regular glycemic monitoring."
  },
  {
    id: "REC-2026-074",
    title: "Comprehensive Lipid Profile & HbA1c Lab Report",
    category: "Laboratory",
    doctor: "Dr. S. Deepa, MD (Pathology)",
    date: "2026-11-01",
    hospital: "Medall Diagnostic Laboratories, Anna Nagar",
    fileSize: "1.1 MB PDF",
    verified: true,
    summary: "HbA1c: 6.8% (Well controlled). Total Cholesterol: 168 mg/dL. Triglycerides: 142 mg/dL."
  },
  {
    id: "REC-2026-061",
    title: "12-Lead Electrocardiogram (ECG) Report",
    category: "Diagnostics",
    doctor: "Dr. K. Ravichandran",
    date: "2026-11-04",
    hospital: "CasualCare Tele-Monitoring Hub",
    fileSize: "840 KB PDF",
    verified: true,
    summary: "Normal sinus rhythm, HR 74 bpm. Normal ST segment, no ischemic repolarization changes."
  },
  {
    id: "REC-2026-049",
    title: "Diabetic Retinopathy & Vision Clearance",
    category: "Ophthalmology",
    doctor: "Dr. G. Sundararaman, DO",
    date: "2026-09-15",
    hospital: "Sankara Nethralaya Eye Hospital",
    fileSize: "1.4 MB PDF",
    verified: true,
    summary: "Mild non-proliferative retinopathy without macular edema. Annual follow-up recommended."
  }
];

export const initialReminders = [
  {
    id: "rem-1",
    type: "Check-up Reminder",
    channel: "WhatsApp & SMS",
    title: "Morning Vitals & Blood Glucose Log",
    scheduledTime: "08:30 AM Daily",
    status: "Delivered & Responded",
    recipient: "+91 98401 23456",
    lastDispatched: "Today at 08:30 AM",
    escalationTriggerMins: 60,
    escalationStatus: "Safe"
  },
  {
    id: "rem-2",
    type: "Automated SMS Check-in",
    channel: "SMS Gateway",
    title: "Afternoon Recovery Wellbeing Ping",
    scheduledTime: "02:00 PM Daily",
    status: "Delivered & Responded",
    recipient: "+91 98401 23456",
    lastDispatched: "Today at 02:00 PM",
    escalationTriggerMins: 45,
    escalationStatus: "Safe"
  },
  {
    id: "rem-3",
    type: "Evening Medicine & Symptoms Ping",
    channel: "WhatsApp Interactive Bot",
    title: "Post-Dinner Blood Pressure & Med Confirmation",
    scheduledTime: "09:00 PM Daily",
    status: "Upcoming",
    recipient: "+91 98401 23456",
    lastDispatched: "Scheduled for Tonight",
    escalationTriggerMins: 30,
    escalationStatus: "Monitoring"
  },
  {
    id: "rem-4",
    type: "Clinical Follow-up",
    channel: "SMS + Automated Voice Prompt",
    title: "Dr. Ravichandran Tele-Consultation Prep",
    scheduledTime: "Nov 09, 2026 - 10:00 AM",
    status: "Queued",
    recipient: "+91 98401 23456 & +91 98409 87654",
    lastDispatched: "Pending dispatch",
    escalationTriggerMins: 120,
    escalationStatus: "Safe"
  }
];

export const initialAppointments = [
  {
    id: "apt-01",
    type: "Follow-up Check-up",
    category: "Cardiology & Post-Surgical",
    doctorName: "Dr. K. Ravichandran, MS, MCh",
    doctorSpecialty: "Senior Cardiothoracic Surgeon",
    hospitalName: "Apollo Specialty Heart Centre, Chennai",
    hospitalAddress: "21 Greams Lane, Thousand Lights, Chennai, TN 600006",
    appointmentDate: "2026-11-14",
    appointmentTime: "10:30 AM",
    status: "Upcoming",
    confirmationStatus: "Pending Confirmation",
    reason: "Post-surgery recovery 3-week follow-up and ECG review",
    instructions: "Please bring your latest blood glucose log and fasting lipid report. Arrive 15 minutes before scheduled slot."
  },
  {
    id: "apt-02",
    type: "Routine Evaluation",
    category: "Endocrinology",
    doctorName: "Dr. Malini Soundararajan, MD, DM",
    doctorSpecialty: "Endocrinologist & Diabetologist",
    hospitalName: "Tamil Nadu Diabetes Foundation",
    hospitalAddress: "Kilpauk Garden Road, Chennai, TN 600010",
    appointmentDate: "2026-11-20",
    appointmentTime: "04:15 PM",
    status: "Upcoming",
    confirmationStatus: "Confirmed",
    reason: "Type 2 Diabetes glycemic titration review",
    instructions: "Fasting not required. Bring your current Metformin medication strip."
  },
  {
    id: "apt-03",
    type: "Completed Follow-up",
    category: "Cardiology",
    doctorName: "Dr. K. Ravichandran, MS, MCh",
    doctorSpecialty: "Senior Cardiothoracic Surgeon",
    hospitalName: "Apollo Specialty Heart Centre, Chennai",
    hospitalAddress: "21 Greams Lane, Thousand Lights, Chennai, TN 600006",
    appointmentDate: "2026-10-27",
    appointmentTime: "11:00 AM",
    status: "Completed",
    confirmationStatus: "Attended",
    reason: "Post-operative hospital discharge sign-off",
    instructions: "Discharge clearance granted. Initiated home rehabilitation protocol."
  },
  {
    id: "apt-04",
    type: "Completed Consultation",
    category: "Ophthalmology",
    doctorName: "Dr. G. Sundararaman, DO",
    doctorSpecialty: "Retina & Vitreous Specialist",
    hospitalName: "Sankara Nethralaya Eye Hospital",
    hospitalAddress: "College Road, Nungambakkam, Chennai, TN 600006",
    appointmentDate: "2026-09-15",
    appointmentTime: "02:30 PM",
    status: "Completed",
    confirmationStatus: "Attended",
    reason: "Diabetic retinopathy annual screening",
    instructions: "Mild non-proliferative changes; annual re-assessment required."
  },
  {
    id: "apt-05",
    type: "Check-up",
    category: "Pathology Lab",
    doctorName: "Dr. S. Deepa, MD",
    doctorSpecialty: "Consultant Pathologist",
    hospitalName: "Medall Diagnostic Laboratories, Anna Nagar",
    hospitalAddress: "2nd Avenue, Anna Nagar, Chennai, TN 600040",
    appointmentDate: "2026-11-01",
    appointmentTime: "07:30 AM",
    status: "Completed",
    confirmationStatus: "Attended",
    reason: "Comprehensive Lipid Profile & Fasting HbA1c",
    instructions: "Completed. Reports archived in Health Records."
  }
];

export const initialNotificationHistory = [
  {
    id: "notif-101",
    type: "WhatsApp",
    scheduledDate: "2026-11-11",
    scheduledTime: "09:00 AM",
    appointmentDate: "2026-11-14",
    appointmentTime: "10:30 AM",
    doctorName: "Dr. K. Ravichandran",
    hospitalName: "Apollo Specialty Heart Centre",
    deliveryStatus: "Scheduled",
    details: "3-day advance WhatsApp interactive reminder with confirmation buttons.",
    recipientPhone: "+91 98401 23456"
  },
  {
    id: "notif-102",
    type: "SMS",
    scheduledDate: "2026-11-11",
    scheduledTime: "09:30 AM",
    appointmentDate: "2026-11-14",
    appointmentTime: "10:30 AM",
    doctorName: "Dr. K. Ravichandran",
    hospitalName: "Apollo Specialty Heart Centre",
    deliveryStatus: "Scheduled",
    details: "3-day advance standard SMS check-up notice.",
    recipientPhone: "+91 98401 23456"
  },
  {
    id: "notif-103",
    type: "WhatsApp",
    scheduledDate: "2026-11-13",
    scheduledTime: "09:00 AM",
    appointmentDate: "2026-11-14",
    appointmentTime: "10:30 AM",
    doctorName: "Dr. K. Ravichandran",
    hospitalName: "Apollo Specialty Heart Centre",
    deliveryStatus: "Pending",
    details: "1-day prior urgent WhatsApp confirmation prompt.",
    recipientPhone: "+91 98401 23456"
  },
  {
    id: "notif-104",
    type: "SMS",
    scheduledDate: "2026-11-13",
    scheduledTime: "10:00 AM",
    appointmentDate: "2026-11-14",
    appointmentTime: "10:30 AM",
    doctorName: "Dr. K. Ravichandran",
    hospitalName: "Apollo Specialty Heart Centre",
    deliveryStatus: "Pending",
    details: "1-day prior SMS travel and document advisory.",
    recipientPhone: "+91 98401 23456"
  },
  {
    id: "notif-105",
    type: "WhatsApp",
    scheduledDate: "2026-11-14",
    scheduledTime: "07:00 AM",
    appointmentDate: "2026-11-14",
    appointmentTime: "10:30 AM",
    doctorName: "Dr. K. Ravichandran",
    hospitalName: "Apollo Specialty Heart Centre",
    deliveryStatus: "Demo",
    details: "Appointment day reminder with live navigation link.",
    recipientPhone: "+91 98401 23456"
  },
  {
    id: "notif-106",
    type: "SMS",
    scheduledDate: "2026-11-14",
    scheduledTime: "07:30 AM",
    appointmentDate: "2026-11-14",
    appointmentTime: "10:30 AM",
    doctorName: "Dr. K. Ravichandran",
    hospitalName: "Apollo Specialty Heart Centre",
    deliveryStatus: "Demo",
    details: "Appointment day gate pass and appointment token SMS preview.",
    recipientPhone: "+91 98401 23456"
  }
];

export const initialReminderSettings = {
  smsNotifications: true,
  whatsappNotifications: true,
  registeredMobile: "+91 98401 23456",
  languagePreference: "en" // 'en' | 'ta'
};

export const initialDoctors = [
  {
    id: "doc-1",
    name: "Dr. K. Ravichandran",
    role: "Senior Consultant Cardiologist",
    qualification: "MBBS, MD, MCh (Cardiothoracic)",
    department: "Cardiology",
    experience: "22 years experience",
    availableToday: true,
    rating: 4.9,
    patientsCount: 42,
    hospital: "CasualCare Prime Network, Chennai",
    avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "doc-2",
    name: "Dr. Malini Soundararajan",
    role: "Endocrinologist & Diabetologist",
    qualification: "MBBS, MD, DM (Endocrinology)",
    department: "Metabolic Care",
    experience: "16 years experience",
    availableToday: true,
    rating: 4.8,
    patientsCount: 38,
    hospital: "Tamil Nadu Diabetes Foundation",
    avatar: "https://images.unsplash.com/photo-1594824813515-5151240c49b3?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "doc-3",
    name: "Dr. V. Ananthakrishnan",
    role: "Geriatric Rehabilitation Specialist",
    qualification: "MBBS, DNB (Physical Med & Rehab)",
    department: "Post-Acute Recovery",
    experience: "14 years experience",
    availableToday: false,
    rating: 4.9,
    patientsCount: 29,
    hospital: "CasualCare Recovery Hub, Guindy",
    avatar: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&auto=format&fit=crop&q=80"
  }
];

export const initialEmergencyData = {
  activeEmergency: false,
  status: "Standby",
  currentLocation: {
    lat: 13.0850,
    lng: 80.2101,
    address: "Plot 42, 4th Avenue, Anna Nagar, Chennai - 600040",
    landmark: "Near Tower Park & Roundtana"
  },
  nearestAmbulance: {
    unitId: "TN-01-AMB-8420",
    type: "Advanced Cardiac Life Support (ACLS)",
    driver: "M. Saravanan",
    contact: "+91 94440 99881",
    etaMinutes: 6,
    distanceKm: 2.3,
    hospitalDestination: "Apollo Emergency Care Centre, Kilpauk"
  },
  hospitalsNearby: [
    { name: "Apollo Specialty Hospital, Kilpauk", distance: "2.8 km", time: "7 mins", icuBeds: 12, phone: "044-28290200" },
    { name: "Sundaram Medical Foundation (SMF), Anna Nagar", distance: "1.4 km", time: "4 mins", icuBeds: 6, phone: "044-26268844" },
    { name: "MGM Healthcare, Aminjikarai", distance: "3.6 km", time: "9 mins", icuBeds: 18, phone: "044-45242424" }
  ]
};
