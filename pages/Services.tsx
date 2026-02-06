
import React from 'react';
import { Layout } from '../components/Layout';
import { Clock, Calendar, FileText, CreditCard, Users, Briefcase, Shield, Smartphone } from 'lucide-react';
import { Link } from 'react-router-dom';

const services = [
  { icon: Clock, label: 'Lembur', path: '/overtime', color: 'bg-orange-100 text-orange-600' },
  { icon: Calendar, label: 'Cuti', path: '/leave', color: 'bg-indigo-100 text-indigo-600' },
  { icon: CreditCard, label: 'Klaim', path: '/claims', color: 'bg-emerald-100 text-emerald-600' },
  { icon: FileText, label: 'Slip Gaji', path: '/payslip', color: 'bg-blue-100 text-blue-600' },
  { icon: Users, label: 'Tim Saya', path: '/team', color: 'bg-pink-100 text-pink-600' },
  { icon: Shield, label: 'Asuransi', path: '/insurance', color: 'bg-purple-100 text-purple-600' },
  { icon: Smartphone, label: 'Aset', path: '/assets', color: 'bg-gray-100 text-gray-600' },
  { icon: Briefcase, label: 'Project', path: '/projects', color: 'bg-amber-100 text-amber-600' },
];

export const Services: React.FC = () => {
  return (
    <Layout title="Layanan Mandiri">
      <div className="p-4 space-y-6">
        <div className="grid grid-cols-4 gap-4">
          {services.map((s) => (
            <Link key={s.path} to={s.path} className="flex flex-col items-center transition-transform active:scale-95">
              <div className={`w-14 h-14 rounded-[20px] mb-2 flex items-center justify-center shadow-sm ${s.color}`}>
                <s.icon size={22} />
              </div>
              <span className="text-[9px] font-bold text-gray-500 text-center uppercase tracking-tighter">{s.label}</span>
            </Link>
          ))}
        </div>
        
        <div className="bg-white rounded-[32px] p-6 border border-gray-100 shadow-sm">
           <h3 className="font-black text-gray-800 mb-4">Informasi Perusahaan</h3>
           <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl">
                 <div className="flex items-center space-x-3">
                    <FileText size={18} className="text-gray-400" />
                    <span className="text-xs font-bold text-gray-700">Peraturan Perusahaan 2024</span>
                 </div>
                 <span className="text-[10px] text-indigo-600 font-bold">Unduh</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl">
                 <div className="flex items-center space-x-3">
                    <Calendar size={18} className="text-gray-400" />
                    <span className="text-xs font-bold text-gray-700">Kalender Libur Nasional</span>
                 </div>
                 <span className="text-[10px] text-indigo-600 font-bold">Lihat</span>
              </div>
           </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[32px] p-6 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="font-black text-lg mb-1">Butuh Bantuan Cepat?</h3>
            <p className="text-[10px] text-indigo-100 opacity-80 mb-4">Chat dengan AI untuk pertanyaan seputar BPJS, Cuti, dan lainnya.</p>
            <Link to="/chat" className="inline-block px-8 py-2.5 bg-white text-indigo-600 rounded-xl text-xs font-black shadow-lg">
              Tanya HR AI
            </Link>
          </div>
          <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/10 rounded-full" />
        </div>
      </div>
    </Layout>
  );
};
