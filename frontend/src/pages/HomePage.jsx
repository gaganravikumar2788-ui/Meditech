import { Link } from 'react-router-dom';
import { Building2, Video, ClipboardList, Bot, ArrowRight, ShieldCheck, Clock } from 'lucide-react';

const features = [
  {
    icon: Building2,
    title: 'Hospital Network',
    description:
      'Access to top-tier hospitals and medical facilities with state-of-the-art equipment and expert medical staff.',
    to: '/register',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Video,
    title: 'Video Consultations',
    description:
      'Connect with healthcare professionals from the comfort of your home through secure video, phone, or chat consultations.',
    to: '/video-consult',
    color: 'from-indigo-500 to-purple-500',
  },
  {
    icon: ClipboardList,
    title: 'Digital Health Records',
    description:
      'Secure, searchable database of registered patients, appointments, and consultation history.',
    to: '/patients',
    color: 'from-emerald-500 to-teal-500',
  },
  {
    icon: Bot,
    title: 'Medicom AI Assistant',
    description:
      'Instant general wellness suggestions for minor symptoms like headaches, colds, fever, and sleep issues.',
    to: '/ai',
    color: 'from-amber-500 to-orange-500',
  },
];

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 text-white">
        <div className="absolute inset-0 opacity-15 pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/30 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-emerald-400/30 blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-sm text-sm font-medium mb-6 border border-white/20">
            <ShieldCheck className="w-4 h-4 text-emerald-300" />
            Smart Healthcare &amp; Patient Management Platform
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
            Your Health, Our Priority
          </h1>
          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-indigo-100 mb-10 leading-relaxed">
            Advanced medical care with cutting-edge technology and compassionate healthcare
            professionals dedicated to your wellbeing.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-7 py-3.5 rounded-full shadow-lg shadow-emerald-500/30 transition-all hover:-translate-y-0.5"
            >
              Register &amp; Book Appointment
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/patients"
              className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 backdrop-blur-sm text-white font-semibold px-7 py-3.5 rounded-full border border-white/30 transition-all"
            >
              View Registered Patients
            </Link>
          </div>

          <div className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto text-left">
            {[
              { label: 'Partner Hospitals', value: '8+' },
              { label: 'Specialist Doctors', value: '32+' },
              { label: 'Online Support', value: '24/7' },
              { label: 'Emergency Helpline', value: '108' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/15"
              >
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-xs text-indigo-100 mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900">Comprehensive Healthcare Services</h2>
          <p className="text-slate-600 mt-2 max-w-2xl mx-auto">
            Everything you need to register patients, book hospital appointments, consult doctors
            online, and manage health records.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <Link
                key={f.title}
                to={f.to}
                className="group bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col"
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center text-white mb-5 shadow-md`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors mb-2">
                  {f.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed flex-1">{f.description}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-indigo-600">
                  Explore <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Emergency Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-gradient-to-r from-rose-50 to-amber-50 border border-rose-200 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-rose-900">24/7 Medical Assistance</h3>
              <p className="text-sm text-rose-700 mt-1">
                For medical emergencies, please call <strong>108</strong> or visit the nearest
                hospital immediately.
              </p>
            </div>
          </div>
          <Link
            to="/video-consult"
            className="shrink-0 bg-rose-600 hover:bg-rose-700 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors"
          >
            Book Urgent Consult
          </Link>
        </div>
      </section>
    </div>
  );
}
