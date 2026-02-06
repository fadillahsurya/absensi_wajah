
import React from 'react';
import { Layout } from '../components/Layout';
import { UserProfile, AttendanceStatus } from '../types';
// Added LogIn to the import list
import { LogOut, Clock, Calendar, CheckCircle, AlertCircle, ScanFace, TrendingUp, Wallet, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../utils';

interface HomeProps {
  user: UserProfile;
  attendanceState: AttendanceStatus;
}

export const Home: React.FC<HomeProps> = ({ user, attendanceState }) => {
  const getAttendanceConfig = () => {
    switch (attendanceState) {
      case 'NONE':
        return { label: 'Presensi Masuk', icon: ScanFace, color: 'bg-indigo-600', shadow: 'shadow-indigo-200' };
      case 'CLOCK_IN':
        return { label: 'Presensi Keluar', icon: LogOut, color: 'bg-rose-600', shadow: 'shadow-rose-200' };
      default:
        return { label: 'Selesai Hari Ini', icon: CheckCircle, color: 'bg-gray-400', shadow: 'shadow-none' };
    }
  };

  const config = getAttendanceConfig();

  return (
    <Layout title="Dashboard HRIS">
      <div className="p-4 space-y-6">
        {/* Profile & Greeting */}
        <div className="flex items-center justify-between px-2">
          <div>
            <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Selamat Pagi,</p>
            <h2 className="text-2xl font-black text-gray-800 leading-tight">{user.name.split(' ')[0]} 👋</h2>
          </div>
          <Link to="/profile">
            <img src={user.avatar} className="w-12 h-12 rounded-2xl object-cover ring-2 ring-indigo-100 shadow-sm" />
          </Link>
        </div>

        {/* Attendance Main Action */}
        <div className="bg-white rounded-[40px] p-6 shadow-xl border border-gray-50 relative overflow-hidden group">
          <div className="relative z-10 flex flex-col items-center">
            <div className="mb-4 flex items-center justify-center w-20 h-20 bg-indigo-50 rounded-3xl group-hover:rotate-12 transition-transform duration-500">
               <Clock size={36} className={attendanceState === 'CLOCK_IN' ? 'text-indigo-600' : 'text-gray-300'} />
            </div>
            
            <h3 className="text-xl font-black text-gray-800 mb-1">
              {attendanceState === 'NONE' ? 'Ready to Work?' : 
               attendanceState === 'CLOCK_IN' ? 'Sedang Bekerja' : 'Kerja Bagus!'}
            </h3>
            <p className="text-[10px] font-medium text-gray-400 mb-6 uppercase tracking-wider">
               {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>

            {!user.faceRegistered ? (
              <Link to="/register-face" className="w-full py-4 bg-amber-500 text-white rounded-[24px] font-bold shadow-lg shadow-amber-100 flex items-center justify-center space-x-3 transition-all active:scale-95">
                <ScanFace size={20} />
                <span>Registrasi Wajah</span>
              </Link>
            ) : attendanceState !== 'CLOCK_OUT' ? (
              <Link to="/attendance" className={`w-full py-4 ${config.color} text-white rounded-[24px] font-bold shadow-lg ${config.shadow} flex items-center justify-center space-x-3 transition-all active:scale-95`}>
                <config.icon size={20} />
                <span>{config.label}</span>
              </Link>
            ) : (
              <div className="bg-emerald-50 text-emerald-600 w-full py-4 rounded-[24px] flex items-center justify-center font-bold">
                <CheckCircle size={20} className="mr-2" /> DATA TERSIMPAN
              </div>
            )}
          </div>
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-50/50 rounded-full blur-3xl" />
        </div>

        {/* Analytics Section */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-[32px] border border-gray-50 shadow-sm">
            <div className="w-10 h-10 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-3">
              <TrendingUp size={20} />
            </div>
            <p className="text-[10px] font-bold text-gray-400 uppercase">Kehadiran</p>
            <p className="text-xl font-black text-gray-800">96%</p>
            <div className="w-full h-1 bg-gray-100 rounded-full mt-2 overflow-hidden">
              <div className="w-[96%] h-full bg-indigo-500" />
            </div>
          </div>
          <div className="bg-white p-5 rounded-[32px] border border-gray-50 shadow-sm">
            <div className="w-10 h-10 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-3">
              <Wallet size={20} />
            </div>
            <p className="text-[10px] font-bold text-gray-400 uppercase">Est. Take Home Pay</p>
            <p className="text-sm font-black text-gray-800 mt-1">{formatCurrency(7500000)}</p>
            <p className="text-[8px] text-emerald-600 font-bold mt-1">+ Rp 450rb Lembur</p>
          </div>
        </div>

        {/* AI Insight Card */}
        <div className="bg-indigo-900 rounded-[32px] p-5 text-white shadow-xl relative overflow-hidden">
          <div className="flex items-start space-x-3 relative z-10">
            <div className="w-8 h-8 bg-indigo-400 rounded-xl flex items-center justify-center shrink-0">
               <AlertCircle size={18} />
            </div>
            <div>
              <p className="text-xs font-bold text-indigo-200 uppercase tracking-tighter">AI HR Insight</p>
              <p className="text-xs leading-relaxed mt-1">
                "Budi, performa kehadiranmu meningkat 5% dari bulan lalu. Kamu punya sisa 12 hari cuti, mau ambil libur di akhir pekan?"
              </p>
              <Link to="/chat" className="inline-block mt-3 text-[10px] font-bold bg-white/20 px-3 py-1.5 rounded-full hover:bg-white/30 transition-colors">
                 Balas AI
              </Link>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-12 -mt-12" />
        </div>

        {/* Navigation Grid */}
        <div className="grid grid-cols-4 gap-4 px-2">
          {[
            { icon: Calendar, label: 'Jadwal', path: '/schedule' },
            { icon: LogIn, label: 'Lembur', path: '/overtime' },
            { icon: CheckCircle, label: 'Cuti', path: '/leave' },
            { icon: Wallet, label: 'Klaim', path: '/claims' },
          ].map((item, i) => (
            <Link key={i} to={item.path} className="flex flex-col items-center">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-gray-500 shadow-sm border border-gray-50 mb-2 active:scale-90 transition-transform">
                 <item.icon size={20} />
              </div>
              <span className="text-[9px] font-bold text-gray-500 uppercase">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
};
