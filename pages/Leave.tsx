
import React from 'react';
import { Layout } from '../components/Layout';
import { Calendar, AlertCircle } from 'lucide-react';

export const Leave: React.FC = () => {
  return (
    <Layout title="Pengajuan Cuti">
      <div className="p-4 space-y-6">
        {/* Leave Quota */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-indigo-600 text-white p-5 rounded-3xl shadow-lg">
            <p className="text-[10px] opacity-70 font-bold uppercase mb-1">Cuti Tahunan</p>
            <p className="text-3xl font-black">12</p>
            <p className="text-[10px] mt-2 italic">Tersedia</p>
          </div>
          <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
            <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Cuti Terpakai</p>
            <p className="text-3xl font-black text-gray-800">4</p>
            <p className="text-[10px] mt-2 text-gray-400 italic">Januari - Desember</p>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl flex items-start space-x-3">
          <AlertCircle className="text-amber-600 shrink-0" size={20} />
          <p className="text-[11px] text-amber-800 leading-tight">
            Pastikan pengajuan cuti dilakukan minimal 7 hari sebelum keberangkatan untuk persetujuan manajer.
          </p>
        </div>

        <div className="space-y-4">
           <div className="flex justify-between items-center px-1">
             <h4 className="font-bold text-gray-800">Status Pengajuan</h4>
             <button className="text-xs font-bold text-indigo-600">Buat Baru</button>
           </div>
          
          {[1].map(i => (
            <div key={i} className="bg-white p-4 rounded-2xl border border-gray-50 shadow-sm">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                    <Calendar size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Libur Keluarga</p>
                    <p className="text-[10px] text-gray-400">20 - 22 Feb 2024 (3 Hari)</p>
                  </div>
                </div>
                <span className="text-[10px] px-2 py-1 bg-amber-100 text-amber-600 rounded-full font-bold">PENDING</span>
              </div>
              <div className="w-full h-1 bg-gray-50 rounded-full overflow-hidden">
                <div className="w-1/3 h-full bg-amber-500" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};
