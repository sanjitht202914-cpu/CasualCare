/**
 * SNS Agent Workbench Integration Service
 * Production Webhook: https://api.agents.snsihub.ai/webhook/casual-care-master
 *
 * Supported modules:
 * - 'patient': retrieve patient details
 * - 'doctor': retrieve doctor details
 * - 'appointment': create an appointment
 * - 'emergency alerts': create an emergency alert
 */

export const SNS_PRODUCTION_URL = 'https://api.agents.snsihub.ai/webhook/casual-care-master';
export const SNS_LOCAL_PROXY_URL = '/sns-webhook';

/**
 * Detects whether an error thrown by fetch is likely a browser CORS or network restriction.
 */
export function isNetworkOrCorsError(err) {
  if (!err) return false;
  const message = String(err.message || '').toLowerCase();
  const name = String(err.name || '');

  return (
    name === 'TypeError' &&
    (message.includes('fetch') ||
      message.includes('network') ||
      message.includes('failed') ||
      message.includes('cors') ||
      message === 'load failed')
  );
}

/**
 * Builds a clear, actionable error message explaining CORS restrictions
 * and the exact backend configuration required on SNS Agent Workbench.
 */
export function formatCorsErrorMessage(targetUrl) {
  return (
    `[Browser CORS Restriction] The browser blocked the cross-origin request to SNS Workbench (${targetUrl}). ` +
    `Backend configuration required on SNS Workbench: ` +
    `1. Handle HTTP OPTIONS preflight requests returning status 200 or 204. ` +
    `2. Add CORS headers to the webhook response: ` +
    `'Access-Control-Allow-Origin: *' (or your application origin), ` +
    `'Access-Control-Allow-Methods: POST, OPTIONS', ` +
    `'Access-Control-Allow-Headers: Content-Type, Accept, Authorization'. ` +
    `For local development, route requests through the Vite dev proxy ('/sns-webhook') to avoid browser CORS blocks.`
  );
}

/**
 * Internal executor for sending JSON POST request to a given URL
 */
async function executePost(url, payload) {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  const rawText = await response.text();
  let data;
  try {
    data = rawText ? JSON.parse(rawText) : {};
  } catch {
    data = { raw: rawText };
  }

  if (!response.ok) {
    const errorMsg =
      data?.message ||
      data?.error ||
      data?.msg ||
      `SNS Workbench error ${response.status}: ${response.statusText || 'Request failed'}`;
    throw new Error(errorMsg);
  }

  if (data?.success === false || data?.error) {
    throw new Error(data?.message || data?.error || 'SNS Workbench returned an unsuccessful response.');
  }

  return data;
}

/**
 * Sends a POST request with JSON payload to the SNS Agent Workbench workflow.
 * Prioritizes configured/local proxy to bypass CORS in development,
 * and handles fallbacks and browser CORS diagnostics.
 */
export async function sendSnsWebhook(payload) {
  const envUrl = import.meta.env.VITE_SNS_WEBHOOK_URL;
  // If explicitly configured in env, use that; otherwise default to local Vite proxy /sns-webhook
  const primaryUrl = envUrl || SNS_LOCAL_PROXY_URL;
  const fallbackUrl = primaryUrl === SNS_LOCAL_PROXY_URL ? SNS_PRODUCTION_URL : SNS_LOCAL_PROXY_URL;

  let primaryError = null;

  try {
    return await executePost(primaryUrl, payload);
  } catch (err) {
    primaryError = err;

    // If failed due to network / CORS or 404 (e.g. proxy missing in static build), try fallback endpoint
    if (fallbackUrl && fallbackUrl !== primaryUrl) {
      try {
        console.warn(`Primary SNS endpoint (${primaryUrl}) failed. Attempting fallback (${fallbackUrl})...`);
        return await executePost(fallbackUrl, payload);
      } catch (fallbackErr) {
        // If the fallback also failed with CORS/Network error, report clear CORS guidance
        if (isNetworkOrCorsError(fallbackErr) || isNetworkOrCorsError(primaryError)) {
          throw new Error(formatCorsErrorMessage(fallbackUrl));
        }
        throw fallbackErr;
      }
    }

    if (isNetworkOrCorsError(primaryError)) {
      throw new Error(formatCorsErrorMessage(primaryUrl));
    }

    throw primaryError;
  }
}

/**
 * Creates an appointment via SNS Agent Workbench.
 * Payload:
 * {
 *   "module": "appointment",
 *   "patient_id": "...",
 *   "doctor_id": "...",
 *   "appointment_date": "YYYY-MM-DD",
 *   "appointment_time": "HH:mm"
 * }
 */
export async function bookAppointmentViaSns({ patientId, doctorId, appointmentDate, appointmentTime }) {
  if (!patientId || !doctorId || !appointmentDate || !appointmentTime) {
    throw new Error('Missing required appointment parameters: patient_id, doctor_id, appointment_date, appointment_time.');
  }

  const payload = {
    module: 'appointment',
    patient_id: String(patientId),
    doctor_id: String(doctorId),
    appointment_date: String(appointmentDate),
    appointment_time: String(appointmentTime)
  };

  return sendSnsWebhook(payload);
}

/**
 * Creates an emergency alert via SNS Agent Workbench.
 * Payload:
 * {
 *   "module": "emergency alerts",
 *   "patient_id": "...",
 *   "location": "...",
 *   "message": "..."
 * }
 */
export async function sendEmergencyAlertViaSns({ patientId, location, message }) {
  if (!patientId) {
    throw new Error('Patient ID is required to dispatch an emergency alert.');
  }

  const payload = {
    module: 'emergency alerts',
    patient_id: String(patientId),
    location: String(location || 'Current GPS Location'),
    message: String(message || 'Critical Emergency: Emergency assistance requested.')
  };

  return sendSnsWebhook(payload);
}

/**
 * Retrieves patient details via SNS Agent Workbench.
 * Payload:
 * {
 *   "module": "patient",
 *   "patient_id": "..."
 * }
 */
export async function getPatientDetailsViaSns(patientId) {
  if (!patientId) throw new Error('Patient ID is required.');
  return sendSnsWebhook({
    module: 'patient',
    patient_id: String(patientId)
  });
}

/**
 * Retrieves doctor details via SNS Agent Workbench.
 * Payload:
 * {
 *   "module": "doctor",
 *   "doctor_id": "..."
 * }
 */
export async function getDoctorDetailsViaSns(doctorId) {
  if (!doctorId) throw new Error('Doctor ID is required.');
  return sendSnsWebhook({
    module: 'doctor',
    doctor_id: String(doctorId)
  });
}

/**
 * Communicates with the AI Care Assistant via SNS Agent Workbench.
 * Payload:
 * {
 *   "module": "ai_care_assistant",
 *   "message": "..."
 * }
 * Expected response:
 * {
 *   "success": true,
 *   "module": "ai_care_assistant",
 *   "reply": "..."
 * }
 */
export async function askAiCareAssistant(message) {
  if (!message || typeof message !== 'string' || !message.trim()) {
    throw new Error('Message cannot be empty.');
  }

  const payload = {
    module: 'ai_care_assistant',
    message: message.trim()
  };

  const response = await sendSnsWebhook(payload);

  const item = Array.isArray(response) ? response[0] : response;
  const reply = item?.reply || item?.data?.reply || item?.message || '';

  return {
    success: item?.success ?? true,
    module: item?.module || 'ai_care_assistant',
    reply: typeof reply === 'string' ? reply : JSON.stringify(reply)
  };
}

export const snsService = {
  sendSnsWebhook,
  bookAppointmentViaSns,
  sendEmergencyAlertViaSns,
  getPatientDetailsViaSns,
  getDoctorDetailsViaSns,
  askAiCareAssistant,
  SNS_PRODUCTION_URL,
  SNS_LOCAL_PROXY_URL,
  isNetworkOrCorsError,
  formatCorsErrorMessage
};

export default snsService;

