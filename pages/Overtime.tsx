
import React from 'react';
import { Layout } from '../components/Layout';
import { Clock, Plus } from 'lucide-react';

export const Overtime: React.FC = () => {
  return (
    <Layout title="Pengajuan Lembur">
      <div className="p-4 space-y-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <h3 className="font-bold mb-4">Data Lembur Bulan Ini</h3>
          <div className="flex items-center space-x-4">
            <div className="flex-1 bg-gray-50 p-4 rounded-2xl">
              <p className="text-[10px] text-gray-400 uppercase font-bold">Total Jam</p>
              <p className="text-xl font-bold">12.5 Jam</p>
            </div>
            <div className="flex-1 bg-gray-50 p-4 rounded-2xl">
              <p className="text-[10px] text-gray-400 uppercase font-bold">Terbayar</p>
              <p className="text-xl font-bold text-emerald-600">8 Jam</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-bold text-gray-800 px-1">Riwayat Pengajuan</h4>
          {[1, 2].map(i => (
            <div key={i} className="bg-white p-4 rounded-2xl border border-gray-50 shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-bold text-sm">Selesaikan Deployment</p>
                  <p className="text-[10px] text-gray-400">12 Feb 2024 • 18:00 - 21:00</p>
                </div>
                <span className="text-[10px] px-2 py-1 bg-green-100 text-green-600 rounded-full font-bold">APPROVED</span>
              </div>
              <p className="text-xs text-gray-500">3 Jam lembur dikonfirmasi oleh HR.</p>
            </div>
          ))}
        </div>

        <button className="fixed bottom-24 right-4 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-2xl flex items-center justify-center transition-transform active:scale-95 z-40">
          <Plus size={32} />
        </button>
      </div>
    </Layout>
  );
};
