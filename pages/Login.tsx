
import React, { useState } from 'react';
import { LogIn, ShieldCheck, Mail, Lock, Loader2 } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call to Go backend
    setTimeout(() => {
      onLogin();
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 max-w-md mx-auto relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute -top-24 -left-24 w-64 h-64 bg-indigo-100 rounded-full blur-3xl opacity-60" />
      <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-emerald-50 rounded-full blur-3xl opacity-60" />

      <div className="w-full relative z-10 space-y-8">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-20 h-20 bg-indigo-600 rounded-[30px] flex items-center justify-center text-white shadow-xl shadow-indigo-100 rotate-6">
            <ShieldCheck size={40} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-gray-800">HRIS Pro</h1>
            <p className="text-sm text-gray-500 font-medium">Masuk ke akun karyawan Anda</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1">
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
              <input 
                type="email" 
                placeholder="Email Perusahaan"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl shadow-sm focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 outline-none transition-all text-sm font-medium"
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
              <input 
                type="password" 
                placeholder="Kata Sandi"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl shadow-sm focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 outline-none transition-all text-sm font-medium"
              />
            </div>
            <div className="flex justify-end pr-1">
              <button type="button" className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">Lupa Password?</button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-xl shadow-indigo-100 flex items-center justify-center space-x-3 transition-transform active:scale-[0.98] disabled:opacity-70"
          >
            {loading ? <Loader2 className="animate-spin" size={24} /> : (
              <>
                <LogIn size={20} />
                <span>Masuk Sekarang</span>
              </>
            )}
          </button>
        </form>

        <div className="pt-8 text-center">
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">Trusted Biometric System v2.5</p>
        </div>
      </div>
    </div>
  );
};
