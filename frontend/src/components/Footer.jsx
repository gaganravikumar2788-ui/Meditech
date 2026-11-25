import { Link } from 'react-router-dom';
import { Mail, Globe, HeartPulse } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 text-white font-bold text-lg mb-3">
              <HeartPulse className="w-5 h-5 text-emerald-400" />
              MediTech
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Smart healthcare web application providing hospital appointment booking, digital
              patient records, video consultations, and AI wellness guidance.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/register" className="hover:text-white transition-colors">
                  Patient Registration &amp; Appointments
                </Link>
              </li>
              <li>
                <Link to="/patients" className="hover:text-white transition-colors">
                  Registered Patients Database
                </Link>
              </li>
              <li>
                <Link to="/video-consult" className="hover:text-white transition-colors">
                  Video Consultation
                </Link>
              </li>
              <li>
                <Link to="/ai" className="hover:text-white transition-colors">
                  Medicom AI Wellness Assistant
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">
              Contact Us
            </h3>
            <div className="space-y-2 text-sm text-slate-400">
              <p className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-indigo-400" />
                Available 24/7 Online
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400" />
                meditech@gmail.com
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-6 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} MediTech Healthcare Platform. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
