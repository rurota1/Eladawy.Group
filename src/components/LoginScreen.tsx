import React, { useState } from 'react';
import { Lock, AlertCircle, Sparkles } from 'lucide-react';

interface LoginScreenProps {
  onLoginSuccess: (role: 'مدير' | 'مبيعات') => void;
}

export default function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === '1111') {
      onLoginSuccess('مدير');
    } else if (pin === '2222') {
      onLoginSuccess('مبيعات');
    } else {
      setError('رمز PIN الخاص بك غير صحيح، جرب 1111 أو 2222');
      setPin('');
    }
  };

  const handleQuickFill = (val: string) => {
    setPin(val);
    setError('');
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black text-white px-4">
      {/* Radiant Glowing Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-900/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/4 right-1/4 w-[300px] h-[300px] bg-amber-900/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Decorative Grid Lines to simulate Luxury Showroom Garage */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#33111122_1px,transparent_1px),linear-gradient(to_bottom,#33111122_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

      {/* Login Card */}
      <div className="relative w-full max-w-md z-10 transition-all duration-300">
        <div className="backdrop-blur-xl bg-neutral-900/80 border border-red-950/80 rounded-3xl p-8 shadow-2xl shadow-red-950/20">
          
          {/* Logo & Brand Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-gradient-to-br from-red-800 to-red-950 border border-amber-500/35 mb-4 shadow-lg shadow-red-900/20">
              <Sparkles className="w-8 h-8 text-amber-500" />
            </div>
            <h1 className="font-sans text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500">
              ELADAWY GROUP
            </h1>
            <p className="font-sans text-sm text-amber-500/80 font-medium tracking-widest mt-1">
              مــجـمـوعــة الــعــدوي الاسـتـثـمـاريــة
            </p>
            <div className="mt-4 flex justify-center">
              <span className="h-[2px] w-12 bg-gradient-to-r from-transparent via-amber-500 to-transparent" />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-right text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                أدخل رمز المرور المالي (PIN)
              </label>
              
              <div className="relative">
                <input
                  type="password"
                  maxLength={4}
                  value={pin}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    setPin(val);
                    setError('');
                  }}
                  placeholder="••••"
                  className="w-full text-center bg-black/60 border border-neutral-800 focus:border-amber-500/80 rounded-xl py-3.5 text-2xl font-bold tracking-[1em] text-amber-400 placeholder-neutral-700 transition-all focus:outline-none focus:ring-1 focus:ring-amber-500/30"
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">
                  <Lock className="w-5 h-5" />
                </div>
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-2 text-right bg-red-950/40 border border-red-900/60 rounded-xl p-3 text-red-400 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="flex-1">{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={pin.length < 4}
              className="w-full bg-gradient-to-r from-red-800 to-red-950 hover:from-red-700 hover:to-red-900 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg border border-amber-500/30 hover:shadow-red-900/45 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm leading-6 tracking-wide"
            >
              دخول بوابة الاستثمار الآمنة
            </button>
          </form>

          {/* Easy demo access box */}
          <div className="mt-8 pt-6 border-t border-neutral-800/60 text-center">
            <p className="text-xs text-neutral-400 mb-3">
              الوصول التجريبي السريع (انقر للتعبئة)
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => handleQuickFill('1111')}
                className="px-3.5 py-1.5 rounded-lg bg-neutral-900 border border-red-950 text-xs font-semibold text-amber-400 hover:bg-neutral-800/80 transition-all"
              >
                المدير العام: 1111
              </button>
              <button
                onClick={() => handleQuickFill('2222')}
                className="px-3.5 py-1.5 rounded-lg bg-neutral-900 border border-red-950 text-xs font-semibold text-amber-400 hover:bg-neutral-800/80 transition-all"
              >
                مسؤول المبيعات: 2222
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
