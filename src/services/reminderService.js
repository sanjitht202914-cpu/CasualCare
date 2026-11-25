/**
 * Reminder & Notification Service Layer
 * 
 * NOTE FOR FUTURE BACKEND INTEGRATION:
 * This service is designed to seamlessly plug into AWS SNS (via SNS Workbench),
 * Twilio, or custom SMS/WhatsApp gateways.
 * 
 * Current Mode: FRONTEND DEMO ONLY (No external network requests).
 * Delivery status is never reported as "Delivered / Sent" without actual backend response.
 */

import { configured, getSession } from './supabaseApi';
export async function sendTestSms(to,message) {
  if(!configured) throw Error('Supabase not configured');
  const session=getSession(); if(!session?.access_token) throw Error('Sign in first');
  const url=import.meta.env.VITE_SUPABASE_URL.replace(/\/$/,'')+'/functions/v1/send-sms';
  const res=await fetch(url,{method:'POST',headers:{'Content-Type':'application/json',apikey:import.meta.env.VITE_SUPABASE_ANON_KEY,Authorization:`Bearer ${session.access_token}`},body:JSON.stringify({to,message})});
  const result=await res.json();
  if(!res.ok || !result.success)throw Error(result.error || 'SMS provider rejected request');
  return result;
}
export const reminderService = {
  /**
   * Fetch scheduled reminders and notification history
   * Backend Target: GET /api/v1/reminders?patientId=:id
   */
  async getReminders(patientId) {
    // PLACEHOLDER: Replace with -> return (await fetch(`/api/v1/reminders?patientId=${patientId}`)).json();
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, timestamp: new Date().toISOString() });
      }, 200);
    });
  },

  /**
   * Update notification channel preferences & registered mobile number
   * Backend Target: PUT /api/v1/patient/reminder-settings
   */
  async updateReminderSettings(settings) {
    // PLACEHOLDER: Replace with -> return (await fetch(`/api/v1/patient/reminder-settings`, { method: 'PUT', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(settings) })).json();
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, updatedSettings: settings, updatedAt: new Date().toISOString() });
      }, 300);
    });
  },

  /**
   * Request confirmation for an upcoming appointment
   * Backend Target: POST /api/v1/appointments/:id/confirm
   */
  async confirmAppointment(appointmentId, channel = 'WhatsApp') {
    // PLACEHOLDER: Connect with SNS Workbench / Twilio WhatsApp Webhook:
    // return (await fetch(`/api/v1/appointments/${appointmentId}/confirm`, { method: 'POST', body: JSON.stringify({ channel }) })).json();
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          appointmentId,
          status: 'Confirmed (Local Demo)',
          channel,
          timestamp: new Date().toISOString()
        });
      }, 350);
    });
  },

  /**
   * Request rescheduling for an upcoming appointment
   * Backend Target: POST /api/v1/appointments/:id/reschedule-request
   */
  async requestReschedule(appointmentId, reason = 'Patient Requested Reschedule') {
    // PLACEHOLDER: Connect with SNS Workbench / Hospital booking API:
    // return (await fetch(`/api/v1/appointments/${appointmentId}/reschedule-request`, { method: 'POST', body: JSON.stringify({ reason }) })).json();
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          appointmentId,
          status: 'Reschedule Requested (Local Demo)',
          note: 'Clinic administration will send available alternate slots.',
          timestamp: new Date().toISOString()
        });
      }, 350);
    });
  },

  /**
   * Schedule or dispatch a reminder preview
   * Backend Target: POST /api/v1/sns/dispatch-preview
   */
  async dispatchReminderPreview(reminderPayload) {
    // PLACEHOLDER: Trigger SNS Workbench event:
    // return (await fetch(`/api/v1/sns/dispatch`, { method: 'POST', body: JSON.stringify(reminderPayload) })).json();
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          deliveryStatus: 'Scheduled (Awaiting Backend Trigger)',
          payload: reminderPayload,
          timestamp: new Date().toISOString()
        });
      }, 400);
    });
  }
};
