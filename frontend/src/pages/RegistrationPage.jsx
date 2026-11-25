import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  Calendar,
  CheckCircle2,
  UserPlus,
  Stethoscope,
  X,
  ArrowRight,
} from 'lucide-react';
import { api } from '../api';

const TIME_SLOTS = [
  { value: '09:00', label: '9:00 AM' },
  { value: '09:30', label: '9:30 AM' },
  { value: '10:00', label: '10:00 AM' },
  { value: '10:30', label: '10:30 AM' },
  { value: '11:00', label: '11:00 AM' },
  { value: '11:30', label: '11:30 AM' },
  { value: '14:00', label: '2:00 PM' },
  { value: '14:30', label: '2:30 PM' },
  { value: '15:00', label: '3:00 PM' },
  { value: '15:30', label: '3:30 PM' },
  { value: '16:00', label: '4:00 PM' },
  { value: '16:30', label: '4:30 PM' },
  { value: '17:00', label: '5:00 PM' },
];

export default function RegistrationPage() {
  const [activeTab, setActiveTab] = useState('appointment'); // 'appointment' | 'patient'
  const [hospitals, setHospitals] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [modalDoctor, setModalDoctor] = useState(null);

  // Appointment form state
  const [apptForm, setApptForm] = useState({
    patientName: '',
    patientPhone: '',
    patientEmail: '',
    age: '',
    gender: '',
    appointmentDate: '',
    appointmentTime: '',
    reason: '',
  });
  const [apptSubmitting, setApptSubmitting] = useState(false);
  const [apptSuccess, setApptSuccess] = useState(null);
  const [apptError, setApptError] = useState('');

  // Direct patient registration form state
  const [patientForm, setPatientForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    age: '',
    gender: '',
    dateOfBirth: '',
    bloodGroup: '',
    address: '',
    medicalHistory: '',
  });
  const [patientSubmitting, setPatientSubmitting] = useState(false);
  const [patientSuccess, setPatientSuccess] = useState(null);
  const [patientError, setPatientError] = useState('');

  useEffect(() => {
    api.getHospitals().then(setHospitals).catch(console.error);
  }, []);

  const today = new Date().toISOString().split('T')[0];

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    if (!selectedHospital || !modalDoctor) return;
    setApptSubmitting(true);
    setApptError('');
    try {
      const res = await api.createAppointment({
        ...apptForm,
        hospitalId: selectedHospital.id,
        hospitalName: selectedHospital.name,
        doctorName: modalDoctor.name,
        specialty: modalDoctor.specialty,
      });
      setApptSuccess(res);
      setApptForm({
        patientName: '',
        patientPhone: '',
        patientEmail: '',
        age: '',
        gender: '',
        appointmentDate: '',
        appointmentTime: '',
        reason: '',
      });
    } catch (err) {
      setApptError(err.message);
    } finally {
      setApptSubmitting(false);
    }
  };

  const handleRegisterPatient = async (e) => {
    e.preventDefault();
    setPatientSubmitting(true);
    setPatientError('');
    setPatientSuccess(null);
    try {
      const created = await api.createPatient(patientForm);
      setPatientSuccess(created);
      setPatientForm({
        fullName: '',
        phone: '',
        email: '',
        age: '',
        gender: '',
        dateOfBirth: '',
        bloodGroup: '',
        address: '',
        medicalHistory: '',
      });
    } catch (err) {
      setPatientError(err.message);
    } finally {
      setPatientSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="bg-gradient-to-r from-sky-500 to-indigo-600 rounded-3xl p-8 text-white shadow-xl mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-2">
          Patient Registration &amp; Appointment Booking
        </h1>
        <p className="text-sky-100 text-base sm:text-lg">
          Register a patient profile directly into our database or select a hospital to book an
          appointment with your preferred doctor.
        </p>

        <div className="mt-6 inline-flex bg-white/15 backdrop-blur-sm p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setActiveTab('appointment')}
            className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'appointment'
                ? 'bg-white text-indigo-700 shadow-sm'
                : 'text-white hover:bg-white/10'
            }`}
          >
            🏥 Book by Hospital &amp; Doctor
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('patient')}
            className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'patient'
                ? 'bg-white text-indigo-700 shadow-sm'
                : 'text-white hover:bg-white/10'
            }`}
          >
            🩺 Register New Patient
          </button>
        </div>
      </div>

      {activeTab === 'appointment' ? (
        <div className="space-y-8">
          {/* Hospital Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {hospitals.map((h) => {
              const isSelected = selectedHospital?.id === h.id;
              return (
                <button
                  key={h.id}
                  type="button"
                  onClick={() => setSelectedHospital(h)}
                  className={`text-left p-5 rounded-2xl border-2 transition-all ${
                    isSelected
                      ? 'bg-sky-50 border-sky-500 shadow-md -translate-y-0.5'
                      : 'bg-white border-slate-200 hover:border-sky-300 hover:shadow-md'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center mb-3">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-900">{h.name}</h3>
                  <p className="text-xs text-slate-500 mt-1">{h.location}</p>
                  <p className="text-xs font-medium text-sky-600 mt-2">
                    {h.doctors.length} Specialists Available
                  </p>
                </button>
              );
            })}
          </div>

          {/* Doctors Section */}
          {!selectedHospital ? (
            <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center text-slate-500">
              Click on any hospital above to view available doctors and book an appointment.
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    Doctors at {selectedHospital.name}
                  </h2>
                  <p className="text-sm text-slate-500">{selectedHospital.location}</p>
                </div>
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-sky-50 text-sky-700 border border-sky-200">
                  {selectedHospital.phone}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {selectedHospital.doctors.map((doc) => (
                  <div
                    key={doc.name}
                    className="rounded-xl border border-slate-200 border-l-4 border-l-sky-500 p-5 bg-slate-50/50 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2 text-sky-600 text-xs font-semibold uppercase tracking-wide mb-1">
                        <Stethoscope className="w-3.5 h-3.5" />
                        {doc.specialty}
                      </div>
                      <h3 className="font-bold text-slate-900 text-lg">{doc.name}</h3>
                      <p className="text-xs text-slate-500 mt-1">{doc.experience}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setModalDoctor(doc);
                        setApptSuccess(null);
                        setApptError('');
                      }}
                      className="mt-4 w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-semibold py-2.5 px-4 rounded-xl text-sm transition-all"
                    >
                      <Calendar className="w-4 h-4" />
                      Book Appointment
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Direct Patient Registration Form */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <UserPlus className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Register New Patient</h2>
              <p className="text-sm text-slate-500">
                Patient details are saved directly to the MediTech SQLite database.
              </p>
            </div>
          </div>

          {patientSuccess && (
            <div className="mb-6 bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                <div>
                  <p className="font-bold text-emerald-900">
                    Patient Registered Successfully! ({patientSuccess.patient_code})
                  </p>
                  <p className="text-sm text-emerald-700">
                    {patientSuccess.full_name} ({patientSuccess.phone}) has been saved to the
                    database.
                  </p>
                </div>
              </div>
              <Link
                to="/patients"
                className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2 rounded-lg shrink-0"
              >
                View in Patient Records <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}

          {patientError && (
            <div className="mb-6 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl p-4 text-sm">
              {patientError}
            </div>
          )}

          <form onSubmit={handleRegisterPatient} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={patientForm.fullName}
                  onChange={(e) => setPatientForm({ ...patientForm, fullName: e.target.value })}
                  placeholder="e.g. Aarav Sharma"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={patientForm.phone}
                  onChange={(e) => setPatientForm({ ...patientForm, phone: e.target.value })}
                  placeholder="e.g. 9876543210"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  value={patientForm.email}
                  onChange={(e) => setPatientForm({ ...patientForm, email: e.target.value })}
                  placeholder="patient@example.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Age</label>
                <input
                  type="number"
                  min="0"
                  max="130"
                  value={patientForm.age}
                  onChange={(e) => setPatientForm({ ...patientForm, age: e.target.value })}
                  placeholder="e.g. 32"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Gender</label>
                <select
                  value={patientForm.gender}
                  onChange={(e) => setPatientForm({ ...patientForm, gender: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none bg-white"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={patientForm.dateOfBirth}
                  onChange={(e) => setPatientForm({ ...patientForm, dateOfBirth: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Blood Group
                </label>
                <select
                  value={patientForm.bloodGroup}
                  onChange={(e) => setPatientForm({ ...patientForm, bloodGroup: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none bg-white"
                >
                  <option value="">Select</option>
                  {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                    <option key={bg} value={bg}>
                      {bg}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Address</label>
                <textarea
                  rows="3"
                  value={patientForm.address}
                  onChange={(e) => setPatientForm({ ...patientForm, address: e.target.value })}
                  placeholder="Street, City, State"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Medical History / Allergies
                </label>
                <textarea
                  rows="3"
                  value={patientForm.medicalHistory}
                  onChange={(e) =>
                    setPatientForm({ ...patientForm, medicalHistory: e.target.value })
                  }
                  placeholder="Existing conditions, allergies, or current medications"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={patientSubmitting}
              className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold px-8 py-3 rounded-xl shadow-md transition-colors"
            >
              {patientSubmitting ? 'Saving Patient...' : 'Register Patient'}
            </button>
          </form>
        </div>
      )}

      {/* Appointment Booking Modal */}
      {modalDoctor && selectedHospital && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setModalDoctor(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-5">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Book Appointment</h3>
                <p className="text-sm text-indigo-600 font-medium mt-0.5">
                  {modalDoctor.name} — {modalDoctor.specialty} at {selectedHospital.name}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setModalDoctor(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {apptSuccess ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="text-lg font-bold text-emerald-900">
                  Appointment Booked Successfully!
                </h4>
                <p className="text-sm text-emerald-700">
                  Patient ID: <strong>{apptSuccess.patient.patient_code}</strong>. Your appointment
                  is scheduled for <strong>{apptSuccess.appointment.appointment_date}</strong> at{' '}
                  <strong>{apptSuccess.appointment.appointment_time}</strong>.
                </p>
                <div className="pt-2 flex justify-center gap-3">
                  <Link
                    to="/patients"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-4 py-2 rounded-xl"
                  >
                    View Patient Record
                  </Link>
                  <button
                    type="button"
                    onClick={() => setModalDoctor(null)}
                    className="bg-white border border-slate-300 text-slate-700 text-sm font-semibold px-4 py-2 rounded-xl"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleBookAppointment} className="space-y-4">
                {apptError && (
                  <div className="bg-rose-50 border border-rose-200 text-rose-700 rounded-xl p-3 text-sm">
                    {apptError}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">
                    Patient Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={apptForm.patientName}
                    onChange={(e) => setApptForm({ ...apptForm, patientName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500 outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={apptForm.patientPhone}
                      onChange={(e) => setApptForm({ ...apptForm, patientPhone: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={apptForm.patientEmail}
                      onChange={(e) => setApptForm({ ...apptForm, patientEmail: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Age</label>
                    <input
                      type="number"
                      min="0"
                      max="130"
                      value={apptForm.age}
                      onChange={(e) => setApptForm({ ...apptForm, age: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">
                      Gender
                    </label>
                    <select
                      value={apptForm.gender}
                      onChange={(e) => setApptForm({ ...apptForm, gender: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500 outline-none bg-white"
                    >
                      <option value="">Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">
                      Preferred Date *
                    </label>
                    <input
                      type="date"
                      min={today}
                      required
                      value={apptForm.appointmentDate}
                      onChange={(e) =>
                        setApptForm({ ...apptForm, appointmentDate: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">
                      Preferred Time *
                    </label>
                    <select
                      required
                      value={apptForm.appointmentTime}
                      onChange={(e) =>
                        setApptForm({ ...apptForm, appointmentTime: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500 outline-none bg-white"
                    >
                      <option value="">Select Time</option>
                      {TIME_SLOTS.map((slot) => (
                        <option key={slot.value} value={slot.value}>
                          {slot.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">
                    Reason for Visit
                  </label>
                  <textarea
                    rows="3"
                    value={apptForm.reason}
                    onChange={(e) => setApptForm({ ...apptForm, reason: e.target.value })}
                    placeholder="Brief description of your health concern"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500 outline-none"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setModalDoctor(null)}
                    className="flex-1 py-2.5 px-4 rounded-xl border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={apptSubmitting}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-semibold hover:from-sky-600 hover:to-indigo-700 disabled:opacity-60"
                  >
                    {apptSubmitting ? 'Booking...' : 'Book Appointment'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
