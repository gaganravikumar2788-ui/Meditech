import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Users,
  Calendar,
  Video,
  Eye,
  Trash2,
  X,
  Phone,
  Mail,
  Droplets,
  MapPin,
  FileText,
  UserPlus,
} from 'lucide-react';
import { api } from '../api';

export default function PatientsPage() {
  const [patients, setPatients] = useState([]);
  const [stats, setStats] = useState(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const loadData = async (query = search) => {
    setLoading(true);
    try {
      const [pList, sData] = await Promise.all([api.getPatients(query), api.getStats()]);
      setPatients(pList);
      setStats(sData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData('');
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    loadData(search);
  };

  const openPatientDetail = async (id) => {
    setDetailLoading(true);
    try {
      const data = await api.getPatientById(id);
      setSelectedPatient(data);
    } catch (err) {
      console.error(err);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleDeletePatient = async (id) => {
    if (!window.confirm('Are you sure you want to remove this patient record?')) return;
    try {
      await api.deletePatient(id);
      if (selectedPatient?.id === id) setSelectedPatient(null);
      loadData(search);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleStatusChange = async (type, itemId, newStatus) => {
    try {
      if (type === 'appointment') {
        await api.updateAppointmentStatus(itemId, newStatus);
      } else {
        await api.updateConsultationStatus(itemId, newStatus);
      }
      if (selectedPatient) {
        await openPatientDetail(selectedPatient.id);
      }
      loadData(search);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">
            Registered Patients Database
          </h1>
          <p className="text-slate-600 mt-1">
            Search, view, and manage all registered patients, hospital appointments, and
            consultations.
          </p>
        </div>
        <Link
          to="/register"
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2.5 rounded-xl shadow-sm text-sm shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          Register New Patient
        </Link>
      </div>

      {/* Summary Stats */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center gap-4 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">{stats.totalPatients}</div>
              <div className="text-xs font-medium text-slate-500">Registered Patients</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center gap-4 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">{stats.totalAppointments}</div>
              <div className="text-xs font-medium text-slate-500">Hospital Appointments</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center gap-4 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Video className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">{stats.totalConsultations}</div>
              <div className="text-xs font-medium text-slate-500">Online Consultations</div>
            </div>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="mb-6 flex gap-3">
        <div className="relative flex-1">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Patient ID (MED-1001), name, phone number, or email..."
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-white border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm"
          />
        </div>
        <button
          type="submit"
          className="bg-slate-900 hover:bg-slate-800 text-white font-semibold px-6 py-3 rounded-xl text-sm transition-colors"
        >
          Search
        </button>
        {search && (
          <button
            type="button"
            onClick={() => {
              setSearch('');
              loadData('');
            }}
            className="bg-white border border-slate-300 text-slate-700 font-semibold px-4 py-3 rounded-xl text-sm hover:bg-slate-50"
          >
            Reset
          </button>
        )}
      </form>

      {/* Patients Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-500">Loading patient records...</div>
        ) : patients.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <p className="text-lg font-semibold text-slate-700">No registered patients found</p>
            <p className="text-sm mt-1">
              Register a new patient or book an appointment to see records appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="px-5 py-3.5">Patient ID</th>
                  <th className="px-5 py-3.5">Name</th>
                  <th className="px-5 py-3.5">Phone</th>
                  <th className="px-5 py-3.5">Age / Gender</th>
                  <th className="px-5 py-3.5">Blood Group</th>
                  <th className="px-5 py-3.5">Bookings</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-sm">
                {patients.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-5 py-4 font-mono text-xs font-semibold text-indigo-700">
                      {p.patient_code}
                    </td>
                    <td className="px-5 py-4">
                      <div className="font-semibold text-slate-900">{p.full_name}</div>
                      {p.email && <div className="text-xs text-slate-500">{p.email}</div>}
                    </td>
                    <td className="px-5 py-4 text-slate-700">{p.phone}</td>
                    <td className="px-5 py-4 text-slate-600">
                      {p.age ? `${p.age} yrs` : '—'} {p.gender ? `/ ${p.gender}` : ''}
                    </td>
                    <td className="px-5 py-4">
                      {p.blood_group ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                          {p.blood_group}
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="px-2 py-0.5 rounded-md bg-sky-50 text-sky-700 font-medium">
                          {p.appointment_count} Appts
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-medium">
                          {p.consultation_count} Consults
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-right space-x-2">
                      <button
                        type="button"
                        onClick={() => openPatientDetail(p.id)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 text-xs font-semibold transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Details
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeletePatient(p.id)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 text-xs font-semibold transition-colors"
                        title="Delete patient"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Patient Detail Modal */}
      {(selectedPatient || detailLoading) && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedPatient(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {detailLoading && !selectedPatient ? (
              <div className="py-12 text-center text-slate-500">Loading patient profile...</div>
            ) : (
              selectedPatient && (
                <div className="space-y-6">
                  <div className="flex items-start justify-between border-b border-slate-200 pb-4">
                    <div>
                      <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700">
                        {selectedPatient.patient_code}
                      </span>
                      <h2 className="text-2xl font-bold text-slate-900 mt-2">
                        {selectedPatient.full_name}
                      </h2>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Registered on {selectedPatient.created_at}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedPatient(null)}
                      className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Personal Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 rounded-xl p-4 text-sm">
                    <div className="flex items-center gap-2.5 text-slate-700">
                      <Phone className="w-4 h-4 text-indigo-500" />
                      <span>{selectedPatient.phone}</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-slate-700">
                      <Mail className="w-4 h-4 text-indigo-500" />
                      <span>{selectedPatient.email || 'No email provided'}</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-slate-700">
                      <Droplets className="w-4 h-4 text-rose-500" />
                      <span>
                        Blood Group: <strong>{selectedPatient.blood_group || '—'}</strong> | Age:{' '}
                        <strong>{selectedPatient.age || '—'}</strong> | Gender:{' '}
                        <strong>{selectedPatient.gender || '—'}</strong>
                      </span>
                    </div>
                    <div className="flex items-center gap-2.5 text-slate-700">
                      <MapPin className="w-4 h-4 text-emerald-500" />
                      <span>{selectedPatient.address || 'No address provided'}</span>
                    </div>
                    {selectedPatient.medical_history && (
                      <div className="sm:col-span-2 flex items-start gap-2.5 text-slate-700 pt-2 border-t border-slate-200">
                        <FileText className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                        <span>
                          <strong>Medical History:</strong> {selectedPatient.medical_history}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Appointments */}
                  <div>
                    <h3 className="text-base font-bold text-slate-900 mb-3">
                      Hospital Appointments ({selectedPatient.appointments?.length || 0})
                    </h3>
                    {selectedPatient.appointments?.length === 0 ? (
                      <p className="text-sm text-slate-500">No hospital appointments booked.</p>
                    ) : (
                      <div className="space-y-3">
                        {selectedPatient.appointments.map((a) => (
                          <div
                            key={a.id}
                            className="border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                          >
                            <div>
                              <div className="font-semibold text-slate-900">
                                {a.doctor_name} ({a.specialty})
                              </div>
                              <div className="text-xs text-slate-600 mt-0.5">
                                {a.hospital_name} • {a.appointment_date} at {a.appointment_time}
                              </div>
                              {a.reason && (
                                <div className="text-xs text-slate-500 mt-1">Reason: {a.reason}</div>
                              )}
                            </div>
                            <select
                              value={a.status}
                              onChange={(e) =>
                                handleStatusChange('appointment', a.id, e.target.value)
                              }
                              className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-300 bg-white"
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

                  {/* Video Consultations */}
                  <div>
                    <h3 className="text-base font-bold text-slate-900 mb-3">
                      Online Consultations ({selectedPatient.consultations?.length || 0})
                    </h3>
                    {selectedPatient.consultations?.length === 0 ? (
                      <p className="text-sm text-slate-500">No online consultations booked.</p>
                    ) : (
                      <div className="space-y-3">
                        {selectedPatient.consultations.map((c) => (
                          <div
                            key={c.id}
                            className="border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                          >
                            <div>
                              <div className="font-semibold text-slate-900">
                                {c.doctor} ({c.specialty}) — {c.consultation_type}
                              </div>
                              <div className="text-xs text-slate-600 mt-0.5">
                                {c.hospital} • {c.preferred_time}
                              </div>
                              <div className="text-xs text-slate-500 mt-1">
                                Symptoms: {c.symptoms}
                              </div>
                            </div>
                            <select
                              value={c.status}
                              onChange={(e) =>
                                handleStatusChange('consultation', c.id, e.target.value)
                              }
                              className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-300 bg-white"
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
                </div>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}
