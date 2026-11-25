const API_BASE = '/api';

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `Request failed (${res.status})`);
  }
  return data;
}

export const api = {
  getHospitals: () => request('/hospitals'),
  getPatients: (search = '') =>
    request(`/patients${search ? `?search=${encodeURIComponent(search)}` : ''}`),
  getPatientById: (id) => request(`/patients/${id}`),
  createPatient: (payload) =>
    request('/patients', { method: 'POST', body: JSON.stringify(payload) }),
  updatePatient: (id, payload) =>
    request(`/patients/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  deletePatient: (id) => request(`/patients/${id}`, { method: 'DELETE' }),

  getAppointments: () => request('/appointments'),
  createAppointment: (payload) =>
    request('/appointments', { method: 'POST', body: JSON.stringify(payload) }),
  updateAppointmentStatus: (id, status) =>
    request(`/appointments/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),

  getConsultations: () => request('/consultations'),
  createConsultation: (payload) =>
    request('/consultations', { method: 'POST', body: JSON.stringify(payload) }),
  updateConsultationStatus: (id, status) =>
    request(`/consultations/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),

  getStats: () => request('/stats'),
  sendOtp: (phone) =>
    request('/auth/send-otp', { method: 'POST', body: JSON.stringify({ phone }) }),
  verifyOtp: (phone, otp) =>
    request('/auth/verify-otp', { method: 'POST', body: JSON.stringify({ phone, otp }) }),
};
