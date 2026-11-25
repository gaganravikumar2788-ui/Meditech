import { useEffect, useState } from 'react';
import { Video, BarChart3, CalendarCheck, Database, CheckCircle2 } from 'lucide-react';
import { api } from '../api';

const SPECIALTIES = [
  'General Medicine',
  'Cardiology',
  'Dermatology',
  'Orthopedics',
  'Pediatrics',
  'Gynecology',
  'Neurology',
  'Emergency Medicine',
];

const CONSULT_TYPES = [
  'Video Call',
  'Phone Call',
  'Chat Consultation',
  'Emergency Consultation',
];

export default function VideoConsultPage() {
  const [tab, setTab] = useState('book'); // 'book' | 'appointments' | 'stats' | 'data'
  const [hospitals, setHospitals] = useState([]);
  const [consultations, setConsultations] = useState([]);
  const [stats, setStats] = useState(null);

  const [form, setForm] = useState({
    patientName: '',
    phone: '',
    hospital: '',
    specialty: '',
    doctor: '',
    consultationType: '',
    symptoms: '',
    preferredTime: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const loadAll = async () => {
    try {
      const [hData, cData, sData] = await Promise.all([
        api.getHospitals(),
        api.getConsultations(),
        api.getStats(),
      ]);
      setHospitals(hData);
      setConsultations(cData);
      setStats(sData);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const selectedHospitalObj = hospitals.find((h) => h.name === form.hospital);
  const availableDoctors = selectedHospitalObj ? selectedHospitalObj.doctors : [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const res = await api.createConsultation(form);
      setSuccessMsg(
        `Consultation booked! Patient ID: ${res.patient.patient_code}. Saved to database.`
      );
      setForm({
        patientName: '',
        phone: '',
        hospital: '',
        specialty: '',
        doctor: '',
        consultationType: '',
        symptoms: '',
        preferredTime: '',
      });
      await loadAll();
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await api.updateConsultationStatus(id, status);
      await loadAll();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-100 text-blue-600 mb-4">
          <Video className="w-7 h-7" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
          Online Doctor Consultation
        </h1>
        <p className="text-slate-600 mt-2">Connect with qualified doctors from top hospitals</p>
        <div className="mt-4 max-w-2xl mx-auto bg-rose-50 border border-rose-200 rounded-xl px-4 py-3 text-sm text-rose-700">
          <strong>⚠️ Emergency Notice:</strong> For medical emergencies, please call{' '}
          <strong>108</strong> or visit the nearest hospital.
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {[
          { id: 'book', label: 'Book Consultation', icon: Video },
          { id: 'appointments', label: 'My Consultations', icon: CalendarCheck },
          { id: 'stats', label: 'App Statistics', icon: BarChart3 },
          { id: 'data', label: 'Submitted Data', icon: Database },
        ].map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                tab === t.id
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                  : 'bg-white text-slate-600 border border-slate-200 hover:text-blue-600'
              }`}
            >
              <Icon className="w-4 h-4" />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Book Consultation */}
      {tab === 'book' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">
            Book Your Consultation
          </h2>

          {successMsg && (
            <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl p-4 flex items-center gap-3 text-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="mb-6 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl p-4 text-sm">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Patient Name *
                </label>
                <input
                  type="text"
                  required
                  value={form.patientName}
                  onChange={(e) => setForm({ ...form, patientName: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Select Hospital *
                </label>
                <select
                  required
                  value={form.hospital}
                  onChange={(e) => setForm({ ...form, hospital: e.target.value, doctor: '' })}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                >
                  <option value="">Choose Hospital</option>
                  {hospitals.map((h) => (
                    <option key={h.id} value={h.name}>
                      {h.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Medical Specialty *
                </label>
                <select
                  required
                  value={form.specialty}
                  onChange={(e) => setForm({ ...form, specialty: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                >
                  <option value="">Choose Specialty</option>
                  {SPECIALTIES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Preferred Doctor *
                </label>
                <select
                  required
                  value={form.doctor}
                  onChange={(e) => setForm({ ...form, doctor: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                >
                  <option value="">
                    {form.hospital ? 'Choose Doctor' : 'Select a hospital first'}
                  </option>
                  {availableDoctors.map((d) => (
                    <option key={d.name} value={d.name}>
                      {d.name} ({d.specialty})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Consultation Type *
                </label>
                <select
                  required
                  value={form.consultationType}
                  onChange={(e) => setForm({ ...form, consultationType: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                >
                  <option value="">Choose Type</option>
                  {CONSULT_TYPES.map((ct) => (
                    <option key={ct} value={ct}>
                      {ct}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Describe Your Symptoms *
              </label>
              <textarea
                rows="3"
                required
                value={form.symptoms}
                onChange={(e) => setForm({ ...form, symptoms: e.target.value })}
                placeholder="Please describe your symptoms and concerns..."
                className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Preferred Date &amp; Time *
              </label>
              <input
                type="datetime-local"
                required
                value={form.preferredTime}
                onChange={(e) => setForm({ ...form, preferredTime: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white py-3.5 px-6 rounded-xl font-semibold transition-colors"
            >
              {submitting ? 'Booking...' : 'Book Consultation'}
            </button>
          </form>
        </div>
      )}

      {/* My Consultations */}
      {tab === 'appointments' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">My Consultations</h2>
          {consultations.length === 0 ? (
            <p className="text-center py-10 text-slate-500">No consultations booked yet.</p>
          ) : (
            <div className="space-y-4">
              {consultations.map((c) => (
                <div
                  key={c.id}
                  className="border border-slate-200 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-md transition-shadow"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{c.patient_name}</span>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-semibold">
                        {c.consultation_type}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 mt-1">
                      {c.doctor} ({c.specialty}) • {c.hospital}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Preferred: {c.preferred_time} | Symptoms: {c.symptoms}
                    </p>
                  </div>
                  <select
                    value={c.status}
                    onChange={(e) => handleStatusUpdate(c.id, e.target.value)}
                    className="text-xs font-semibold px-3 py-2 rounded-lg border border-slate-300 bg-white self-start sm:self-center"
                  >
                    {['Pending', 'Confirmed', 'Completed', 'Cancelled'].map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Statistics */}
      {tab === 'stats' && stats && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">App Statistics</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
              <div className="text-sm font-medium text-blue-700">Total Registered Patients</div>
              <div className="text-3xl font-extrabold text-blue-950 mt-1">{stats.totalPatients}</div>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5">
              <div className="text-sm font-medium text-emerald-700">Total Bookings</div>
              <div className="text-3xl font-extrabold text-emerald-950 mt-1">
                {stats.totalBookings}
              </div>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
              <div className="text-sm font-medium text-amber-700">Pending Consults</div>
              <div className="text-3xl font-extrabold text-amber-950 mt-1">
                {stats.pendingConsultations}
              </div>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-5">
              <div className="text-sm font-medium text-purple-700">Confirmed Consults</div>
              <div className="text-3xl font-extrabold text-purple-950 mt-1">
                {stats.confirmedConsultations}
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
              <h3 className="font-bold text-slate-800 mb-3">Top Specialties</h3>
              {stats.topSpecialties.length === 0 ? (
                <p className="text-sm text-slate-500">No bookings yet.</p>
              ) : (
                <ul className="space-y-2 text-sm">
                  {stats.topSpecialties.map((s) => (
                    <li key={s.specialty} className="flex justify-between">
                      <span className="text-slate-700">{s.specialty}</span>
                      <span className="font-bold text-slate-900">{s.count}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
              <h3 className="font-bold text-slate-800 mb-3">Consultation Types</h3>
              {stats.topConsultationTypes.length === 0 ? (
                <p className="text-sm text-slate-500">No consultations yet.</p>
              ) : (
                <ul className="space-y-2 text-sm">
                  {stats.topConsultationTypes.map((t) => (
                    <li key={t.type} className="flex justify-between">
                      <span className="text-slate-700">{t.type}</span>
                      <span className="font-bold text-slate-900">{t.count}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Submitted Data */}
      {tab === 'data' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 overflow-x-auto">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">
            All Submitted Consultations
          </h2>
          {consultations.length === 0 ? (
            <p className="text-center py-10 text-slate-500">No consultation data submitted yet.</p>
          ) : (
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase">
                  <th className="px-4 py-3">Patient</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3">Hospital</th>
                  <th className="px-4 py-3">Doctor</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Preferred Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {consultations.map((c) => (
                  <tr key={c.id}>
                    <td className="px-4 py-3 font-medium text-slate-900">{c.patient_name}</td>
                    <td className="px-4 py-3 text-slate-600">{c.phone}</td>
                    <td className="px-4 py-3 text-slate-600">{c.hospital}</td>
                    <td className="px-4 py-3 text-slate-600">{c.doctor}</td>
                    <td className="px-4 py-3 text-slate-600">{c.consultation_type}</td>
                    <td className="px-4 py-3 font-semibold text-indigo-700">{c.status}</td>
                    <td className="px-4 py-3 text-slate-600">{c.preferred_time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
