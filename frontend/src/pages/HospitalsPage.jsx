import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2, MapPin, Phone, ArrowRight } from 'lucide-react';
import { api } from '../api';

export default function HospitalsPage() {
  const [hospitals, setHospitals] = useState([]);

  useEffect(() => {
    api.getHospitals().then(setHospitals).catch(console.error);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-3xl p-8 text-white shadow-xl mb-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-3">Partner Hospitals Network</h1>
        <p className="text-indigo-100 max-w-3xl leading-relaxed">
          The main aim of MediTech is to provide seamless online treatment, AI-assisted wellness
          guidance, and direct hospital appointment scheduling with trusted medical institutions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hospitals.map((h) => (
          <div
            key={h.id}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-lg transition-shadow flex flex-col justify-between"
          >
            <div>
              <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
                <Building2 className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">{h.name}</h2>
              <p className="text-sm text-slate-500 flex items-center gap-1.5 mt-2">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                {h.location}
              </p>
              <p className="text-sm text-slate-500 flex items-center gap-1.5 mt-1">
                <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                {h.phone}
              </p>

              <div className="mt-4 pt-4 border-t border-slate-100">
                <div className="text-xs font-semibold text-slate-400 uppercase mb-2">
                  Specialists ({h.doctors.length})
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {h.doctors.map((d) => (
                    <span
                      key={d.name}
                      className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-700"
                    >
                      {d.specialty}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <Link
              to="/register"
              className="mt-6 inline-flex items-center justify-center gap-2 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors"
            >
              Book Appointment <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
