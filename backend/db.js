import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'meditech.db');
const db = new DatabaseSync(dbPath);

db.exec('PRAGMA foreign_keys = ON;');

db.exec(`
  CREATE TABLE IF NOT EXISTS patients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    patient_code TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT DEFAULT '',
    age INTEGER,
    gender TEXT DEFAULT '',
    date_of_birth TEXT DEFAULT '',
    blood_group TEXT DEFAULT '',
    address TEXT DEFAULT '',
    medical_history TEXT DEFAULT '',
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS appointments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    patient_id INTEGER,
    patient_name TEXT NOT NULL,
    patient_phone TEXT NOT NULL,
    patient_email TEXT DEFAULT '',
    hospital_id TEXT NOT NULL,
    hospital_name TEXT NOT NULL,
    doctor_name TEXT NOT NULL,
    specialty TEXT NOT NULL,
    appointment_date TEXT NOT NULL,
    appointment_time TEXT NOT NULL,
    reason TEXT DEFAULT '',
    status TEXT DEFAULT 'Pending',
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE SET NULL
  );

  CREATE TABLE IF NOT EXISTS consultations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    patient_id INTEGER,
    patient_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    hospital TEXT NOT NULL,
    specialty TEXT NOT NULL,
    doctor TEXT NOT NULL,
    consultation_type TEXT NOT NULL,
    symptoms TEXT NOT NULL,
    preferred_time TEXT NOT NULL,
    status TEXT DEFAULT 'Pending',
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE SET NULL
  );

  CREATE TABLE IF NOT EXISTS otp_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    phone TEXT NOT NULL,
    otp_code TEXT NOT NULL,
    verified INTEGER DEFAULT 0,
    expires_at TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now'))
  );
`);

export function generatePatientCode() {
  const row = db.prepare('SELECT COALESCE(MAX(id), 0) AS maxId FROM patients').get();
  const nextNum = 1001 + (row?.maxId || 0);
  return `MED-${nextNum}`;
}

export function findOrCreatePatient({
  fullName,
  phone,
  email = '',
  age = null,
  gender = '',
  dateOfBirth = '',
  bloodGroup = '',
  address = '',
  medicalHistory = '',
}) {
  const normalizedPhone = String(phone || '').trim();
  const existing = db
    .prepare('SELECT * FROM patients WHERE phone = ? LIMIT 1')
    .get(normalizedPhone);

  if (existing) {
    // Update missing optional fields if provided
    db.prepare(
      `UPDATE patients
       SET full_name = COALESCE(NULLIF(?, ''), full_name),
           email = COALESCE(NULLIF(?, ''), email),
           age = COALESCE(?, age),
           gender = COALESCE(NULLIF(?, ''), gender),
           date_of_birth = COALESCE(NULLIF(?, ''), date_of_birth),
           blood_group = COALESCE(NULLIF(?, ''), blood_group),
           address = COALESCE(NULLIF(?, ''), address),
           medical_history = COALESCE(NULLIF(?, ''), medical_history),
           updated_at = datetime('now')
       WHERE id = ?`
    ).run(
      fullName?.trim() || '',
      email?.trim() || '',
      age ? Number(age) : null,
      gender?.trim() || '',
      dateOfBirth?.trim() || '',
      bloodGroup?.trim() || '',
      address?.trim() || '',
      medicalHistory?.trim() || '',
      existing.id
    );
    return db.prepare('SELECT * FROM patients WHERE id = ?').get(existing.id);
  }

  const patientCode = generatePatientCode();
  const info = db
    .prepare(
      `INSERT INTO patients
        (patient_code, full_name, phone, email, age, gender, date_of_birth, blood_group, address, medical_history)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      patientCode,
      fullName.trim(),
      normalizedPhone,
      email?.trim() || '',
      age ? Number(age) : null,
      gender?.trim() || '',
      dateOfBirth?.trim() || '',
      bloodGroup?.trim() || '',
      address?.trim() || '',
      medicalHistory?.trim() || ''
    );

  return db.prepare('SELECT * FROM patients WHERE id = ?').get(info.lastInsertRowid);
}

export default db;
