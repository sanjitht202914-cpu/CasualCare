/**
 * Patient Service Layer
 * 
 * NOTE FOR FUTURE BACKEND INTEGRATION:
 * When connecting to SNS Workbench or REST/GraphQL backends:
 * 1. Replace the simulated Promises below with real fetch() or axios calls.
 * 2. Keep the method signatures identical so UI components require zero rewrites.
 * 3. Environment variables (e.g., import.meta.env.VITE_API_BASE_URL) can be configured here.
 */

export const patientService = {
  /**
   * Fetch current patient profile and vitals
   * Backend Endpoint Target: GET /api/v1/patient/profile
   */
  async getPatientProfile(patientId) {
    // PLACEHOLDER: Replace with -> return (await fetch(`/api/v1/patient/${patientId}`)).json();
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, timestamp: new Date().toISOString() });
      }, 200);
    });
  },

  /**
   * Fetch patient appointments (upcoming & history)
   * Backend Endpoint Target: GET /api/v1/patient/:id/appointments
   */
  async getAppointments(patientId) {
    // PLACEHOLDER: Replace with -> return (await fetch(`/api/v1/patient/${patientId}/appointments`)).json();
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, timestamp: new Date().toISOString() });
      }, 200);
    });
  },

  /**
   * Acknowledge daily check-in
   * Backend Endpoint Target: POST /api/v1/patient/checkin
   */
  async submitDailyCheckIn(patientId, status = 'OK') {
    // PLACEHOLDER: Replace with -> return (await fetch(`/api/v1/patient/checkin`, { method: 'POST', body: JSON.stringify({ patientId, status }) })).json();
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, status: 'ACKNOWLEDGED', recordedAt: new Date().toISOString() });
      }, 300);
    });
  }
};
