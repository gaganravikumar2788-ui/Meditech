import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Phone, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { api } from '../api';

export default function LoginPage() {
  const [step, setStep] = useState('phone'); // 'phone' | 'otp' | 'verified'
  const [phone, setPhone] = useState('');
  const [demoOtp, setDemoOtp] = useState('');
  const [otpDigits, setOtpDigits] = useState(['', '', '', '']);
  const [verifiedData, setVerifiedData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.sendOtp(phone);
      setDemoOtp(res.demoOtp);
      setStep('otp');
      setOtpDigits(['', '', '', '']);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const next = [...otpDigits];
    next[index] = value;
    setOtpDigits(next);
    if (value && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const code = otpDigits.join('');
      const res = await api.verifyOtp(phone, code);
      setVerifiedData(res);
      setStep('verified');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl max-w-md w-full p-8">
        <div className="text-center mb-6">
          <img
            src="/images/image.npg.png"
            alt="MediTech"
            className="h-14 mx-auto mb-3 object-contain"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <h1 className="text-2xl font-extrabold text-slate-900">Sign in to MediTech</h1>
          <p className="text-sm text-slate-500 mt-1">
            Access your patient profile and appointment updates
          </p>
        </div>

        {error && (
          <div className="mb-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl p-3 text-sm text-center">
            {error}
          </div>
        )}

        {step === 'phone' && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-3">
              <a
                href="https://accounts.google.com"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 border border-slate-300 rounded-xl py-2.5 px-3 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                <img src="/images/image2.png" alt="Google" className="w-5 h-5 object-contain" />
                Google
              </a>
              <a
                href="https://account.apple.com"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 border border-slate-300 rounded-xl py-2.5 px-3 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                <img src="/images/image3.png" alt="Apple" className="w-5 h-5 object-contain" />
                Apple
              </a>
            </div>

            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-slate-200" />
              <span className="shrink mx-3 text-xs uppercase text-slate-400 font-semibold">or</span>
              <div className="flex-grow border-t border-slate-200" />
            </div>

            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Enter your phone number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 9876543210"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-60"
              >
                {loading ? 'Sending OTP...' : 'Get OTP'}
              </button>
            </form>
          </div>
        )}

        {step === 'otp' && (
          <form onSubmit={handleVerifyOtp} className="space-y-5 text-center">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Enter 4-Digit OTP</h2>
              <p className="text-xs text-slate-500 mt-1">
                Verification code sent to <strong>{phone}</strong>
              </p>
              {demoOtp && (
                <p className="text-xs bg-amber-50 border border-amber-200 text-amber-800 rounded-lg py-1.5 px-3 mt-2 inline-block">
                  Demo OTP: <strong className="font-mono">{demoOtp}</strong>
                </p>
              )}
            </div>

            <div className="flex justify-center gap-3">
              {otpDigits.map((d, i) => (
                <input
                  key={i}
                  ref={inputRefs[i]}
                  type="text"
                  maxLength={1}
                  required
                  value={d}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  className="w-12 h-12 text-center text-lg font-bold rounded-xl border-2 border-emerald-400 bg-emerald-50 text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>

            <button
              type="button"
              onClick={() => setStep('phone')}
              className="text-xs text-slate-500 hover:text-indigo-600"
            >
              Change phone number
            </button>
          </form>
        )}

        {step === 'verified' && verifiedData && (
          <div className="text-center space-y-4">
            <CheckCircle2 className="w-14 h-14 text-emerald-500 mx-auto" />
            <h2 className="text-xl font-bold text-slate-900">Phone Verified!</h2>
            {verifiedData.patient ? (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-left text-sm space-y-1">
                <p className="font-bold text-indigo-700">{verifiedData.patient.patient_code}</p>
                <p className="font-semibold text-slate-900">{verifiedData.patient.full_name}</p>
                <p className="text-slate-600">{verifiedData.patient.phone}</p>
              </div>
            ) : (
              <p className="text-sm text-slate-600">
                No patient profile found for {verifiedData.phone} yet. Register now to create your
                health record!
              </p>
            )}
            <div className="flex gap-3 pt-2">
              <Link
                to="/patients"
                className="flex-1 bg-indigo-600 text-white font-semibold py-2.5 rounded-xl text-sm"
              >
                Patient Records
              </Link>
              <Link
                to="/register"
                className="flex-1 bg-slate-100 text-slate-700 font-semibold py-2.5 rounded-xl text-sm"
              >
                Register / Book
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
