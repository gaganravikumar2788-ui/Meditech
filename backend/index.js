import express from 'express';
import cors from 'cors';
import db, { findOrCreatePatient } from './db.js';
import { HOSPITALS } from './seedData.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'MediTech API', timestamp: new Date().toISOString() });
});

// Hospitals & Doctors
app.get('/api/hospitals', (_req, res) => {
  res.json(HOSPITALS);
});

// ==================== PATIENTS API ====================

// List & search registered patients (with appointment & consultation counts)
app.get('/api/patients', (req, res) => {
  const search = String(req.query.search || '').trim();
  let patients;

  if (search) {
    const like = `%${search}%`;
    patients = db
      .prepare(
        `SELECT p.*,
          (SELECT COUNT(*) FROM appointments a WHERE a.patient_id = p.id) AS appointment_count,
          (SELECT COUNT(*) FROM consultations c WHERE c.patient_id = p.id) AS consultation_count
         FROM patients p
         WHERE p.full_name LIKE ? OR p.phone LIKE ? OR p.email LIKE ? OR p.patient_code LIKE ?
         ORDER BY p.created_at DESC, p.id DESC`
      )
      .all(like, like, like, like);
  } else {
    patients = db
      .prepare(
        `SELECT p.*,
          (SELECT COUNT(*) FROM appointments a WHERE a.patient_id = p.id) AS appointment_count,
          (SELECT COUNT(*) FROM consultations c WHERE c.patient_id = p.id) AS consultation_count
         FROM patients p
         ORDER BY p.created_at DESC, p.id DESC`
      )
      .all();
  }

  res.json(patients);
});

// Get single patient details with their appointments & consultations
app.get('/api/patients/:id', (req, res) => {
  const patient = db.prepare('SELECT * FROM patients WHERE id = ?').get(req.params.id);
  if (!patient) {
    return res.status(404).json({ error: 'Patient not found' });
  }

  const appointments = db
    .prepare('SELECT * FROM appointments WHERE patient_id = ? ORDER BY created_at DESC')
    .all(patient.id);
  const consultations = db
    .prepare('SELECT * FROM consultations WHERE patient_id = ? ORDER BY created_at DESC')
    .all(patient.id);

  res.json({ ...patient, appointments, consultations });
});

// Register a new patient
app.post('/api/patients', (req, res) => {
  const {
    fullName,
    phone,
    email,
    age,
    gender,
    dateOfBirth,
    bloodGroup,
    address,
    medicalHistory,
  } = req.body;

  if (!fullName || !phone) {
    return res.status(400).json({ error: 'Full name and phone number are required.' });
  }

  try {
    const patient = findOrCreatePatient({
      fullName,
      phone,
      email,
      age,
      gender,
      dateOfBirth,
      bloodGroup,
      address,
      medicalHistory,
    });
    res.status(201).json(patient);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update patient record
app.put('/api/patients/:id', (req, res) => {
  const existing = db.prepare('SELECT * FROM patients WHERE id = ?').get(req.params.id);
  if (!existing) {
    return res.status(404).json({ error: 'Patient not found' });
  }

  const {
    fullName,
    phone,
    email,
    age,
    gender,
    dateOfBirth,
    bloodGroup,
    address,
    medicalHistory,
  } = req.body;

  db.prepare(
    `UPDATE patients
     SET full_name = ?, phone = ?, email = ?, age = ?, gender = ?,
         date_of_birth = ?, blood_group = ?, address = ?, medical_history = ?,
         updated_at = datetime('now')
     WHERE id = ?`
  ).run(
    fullName ?? existing.full_name,
    phone ?? existing.phone,
    email ?? existing.email,
    age !== undefined && age !== '' ? Number(age) : existing.age,
    gender ?? existing.gender,
    dateOfBirth ?? existing.date_of_birth,
    bloodGroup ?? existing.blood_group,
    address ?? existing.address,
    medicalHistory ?? existing.medical_history,
    req.params.id
  );

  const updated = db.prepare('SELECT * FROM patients WHERE id = ?').get(req.params.id);
  res.json(updated);
});

// Delete patient record
app.delete('/api/patients/:id', (req, res) => {
  const result = db.prepare('DELETE FROM patients WHERE id = ?').run(req.params.id);
  if (result.changes === 0) {
    return res.status(404).json({ error: 'Patient not found' });
  }
  res.json({ deleted: true });
});

// ==================== APPOINTMENTS API ====================

app.get('/api/appointments', (_req, res) => {
  const rows = db.prepare('SELECT * FROM appointments ORDER BY created_at DESC, id DESC').all();
  res.json(rows);
});

app.post('/api/appointments', (req, res) => {
  const {
    patientName,
    patientPhone,
    patientEmail,
    hospitalId,
    hospitalName,
    doctorName,
    specialty,
    appointmentDate,
    appointmentTime,
    reason,
    age,
    gender,
  } = req.body;

  if (!patientName || !patientPhone || !hospitalName || !doctorName || !appointmentDate || !appointmentTime) {
    return res.status(400).json({ error: 'Missing required appointment fields.' });
  }

  const patient = findOrCreatePatient({
    fullName: patientName,
    phone: patientPhone,
    email: patientEmail,
    age,
    gender,
  });

  const info = db
    .prepare(
      `INSERT INTO appointments
        (patient_id, patient_name, patient_phone, patient_email, hospital_id, hospital_name, doctor_name, specialty, appointment_date, appointment_time, reason)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      patient.id,
      patientName.trim(),
      patientPhone.trim(),
      patientEmail?.trim() || '',
      hospitalId || 'general',
      hospitalName,
      doctorName,
      specialty || 'General',
      appointmentDate,
      appointmentTime,
      reason?.trim() || ''
    );

  const created = db.prepare('SELECT * FROM appointments WHERE id = ?').get(info.lastInsertRowid);
  res.status(201).json({ appointment: created, patient });
});

app.patch('/api/appointments/:id/status', (req, res) => {
  const { status } = req.body;
  const allowed = ['Pending', 'Confirmed', 'Completed', 'Cancelled'];
  if (!allowed.includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }
  const result = db.prepare('UPDATE appointments SET status = ? WHERE id = ?').run(status, req.params.id);
  if (result.changes === 0) {
    return res.status(404).json({ error: 'Appointment not found' });
  }
  const updated = db.prepare('SELECT * FROM appointments WHERE id = ?').get(req.params.id);
  res.json(updated);
});

// ==================== CONSULTATIONS API ====================

app.get('/api/consultations', (_req, res) => {
  const rows = db.prepare('SELECT * FROM consultations ORDER BY created_at DESC, id DESC').all();
  res.json(rows);
});

app.post('/api/consultations', (req, res) => {
  const {
    patientName,
    phone,
    hospital,
    specialty,
    doctor,
    consultationType,
    symptoms,
    preferredTime,
  } = req.body;

  if (!patientName || !phone || !hospital || !specialty || !doctor || !consultationType || !symptoms || !preferredTime) {
    return res.status(400).json({ error: 'All consultation fields are required.' });
  }

  const patient = findOrCreatePatient({
    fullName: patientName,
    phone,
  });

  const info = db
    .prepare(
      `INSERT INTO consultations
        (patient_id, patient_name, phone, hospital, specialty, doctor, consultation_type, symptoms, preferred_time)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      patient.id,
      patientName.trim(),
      phone.trim(),
      hospital,
      specialty,
      doctor,
      consultationType,
      symptoms.trim(),
      preferredTime
    );

  const created = db.prepare('SELECT * FROM consultations WHERE id = ?').get(info.lastInsertRowid);
  res.status(201).json({ consultation: created, patient });
});

app.patch('/api/consultations/:id/status', (req, res) => {
  const { status } = req.body;
  const allowed = ['Pending', 'Confirmed', 'Completed', 'Cancelled'];
  if (!allowed.includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }
  const result = db.prepare('UPDATE consultations SET status = ? WHERE id = ?').run(status, req.params.id);
  if (result.changes === 0) {
    return res.status(404).json({ error: 'Consultation not found' });
  }
  const updated = db.prepare('SELECT * FROM consultations WHERE id = ?').get(req.params.id);
  res.json(updated);
});

// ==================== STATS API ====================

app.get('/api/stats', (_req, res) => {
  const totalPatients = db.prepare('SELECT COUNT(*) AS count FROM patients').get().count;
  const totalAppointments = db.prepare('SELECT COUNT(*) AS count FROM appointments').get().count;
  const totalConsultations = db.prepare('SELECT COUNT(*) AS count FROM consultations').get().count;

  const pendingConsultations = db
    .prepare("SELECT COUNT(*) AS count FROM consultations WHERE status = 'Pending'")
    .get().count;
  const confirmedConsultations = db
    .prepare("SELECT COUNT(*) AS count FROM consultations WHERE status = 'Confirmed'")
    .get().count;

  const topSpecialties = db
    .prepare(
      `SELECT specialty, COUNT(*) AS count FROM (
         SELECT specialty FROM appointments
         UNION ALL
         SELECT specialty FROM consultations
       ) GROUP BY specialty ORDER BY count DESC LIMIT 6`
    )
    .all();

  const topConsultationTypes = db
    .prepare(
      `SELECT consultation_type AS type, COUNT(*) AS count
       FROM consultations
       GROUP BY consultation_type
       ORDER BY count DESC`
    )
    .all();

  res.json({
    totalPatients,
    totalAppointments,
    totalConsultations,
    totalBookings: totalAppointments + totalConsultations,
    pendingConsultations,
    confirmedConsultations,
    topSpecialties,
    topConsultationTypes,
  });
});

// ==================== OTP AUTH API ====================

app.post('/api/auth/send-otp', (req, res) => {
  const { phone } = req.body;
  if (!phone || String(phone).trim().length < 8) {
    return res.status(400).json({ error: 'Please enter a valid phone number.' });
  }

  const otpCode = String(Math.floor(1000 + Math.random() * 9000));
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

  db.prepare('INSERT INTO otp_sessions (phone, otp_code, expires_at) VALUES (?, ?, ?)').run(
    String(phone).trim(),
    otpCode,
    expiresAt
  );

  // In a demo/local environment we return demoOtp so the user can test OTP verification immediately
  res.json({
    sent: true,
    phone: String(phone).trim(),
    demoOtp: otpCode,
    message: 'OTP generated and stored in database.',
  });
});

app.post('/api/auth/verify-otp', (req, res) => {
  const { phone, otp } = req.body;
  if (!phone || !otp) {
    return res.status(400).json({ error: 'Phone and 4-digit OTP are required.' });
  }

  const session = db
    .prepare('SELECT * FROM otp_sessions WHERE phone = ? ORDER BY id DESC LIMIT 1')
    .get(String(phone).trim());

  if (!session || session.otp_code !== String(otp).trim()) {
    return res.status(401).json({ error: 'Invalid OTP code. Please try again.' });
  }

  db.prepare('UPDATE otp_sessions SET verified = 1 WHERE id = ?').run(session.id);

  const patient = db
    .prepare('SELECT * FROM patients WHERE phone = ? LIMIT 1')
    .get(String(phone).trim());

  res.json({
    verified: true,
    phone: session.phone,
    patient: patient || null,
  });
});

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`MediTech API server running on http://localhost:${PORT}`);
  });
}

export default app;
