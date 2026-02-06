
import React, { useState, useRef } from 'react';
import { Layout } from '../components/Layout';
import { CreditCard, Plus, Receipt, Camera, Loader2, Check, X } from 'lucide-react';
import { formatCurrency } from '../utils';
import { scanReceipt } from '../services/geminiService';

export const Claims: React.FC = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [scannedData, setScannedData] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = (reader.result as string).split(',')[1];
      const data = await scanReceipt(base64);
      if (data) {
        setScannedData(data);
        setShowForm(true);
      } else {
        alert("Gagal memproses struk. Pastikan gambar jelas.");
      }
      setIsScanning(false);
    };
    reader.readAsDataURL(file);
  };

  return (
    <Layout title="Klaim & Reimbursement">
      <div className="p-4 space-y-6">
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-6 rounded-[32px] text-white shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <CreditCard size={32} />
            <span className="text-xs font-bold opacity-80 uppercase tracking-widest">Total Terbayar</span>
          </div>
          <p className="text-3xl font-black mb-1">{formatCurrency(1250000)}</p>
          <p className="text-[10px] opacity-70">Periode Februari 2024</p>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center px-1">
             <h4 className="font-bold text-gray-800">Daftar Klaim</h4>
             <button 
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center text-xs font-black text-white bg-indigo-600 px-4 py-2 rounded-xl shadow-lg shadow-indigo-100 active:scale-95 transition-all"
             >
               {isScanning ? <Loader2 size={14} className="animate-spin mr-2" /> : <Camera size={14} className="mr-2" />}
               Scan Struk AI
             </button>
             <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
          </div>

          {showForm && (
            <div className="bg-white p-5 rounded-[32px] border-2 border-indigo-500 shadow-xl animate-in zoom-in-95">
               <div className="flex justify-between items-center mb-4">
                 <h5 className="font-black text-sm text-indigo-600 uppercase">AI Extracted Data</h5>
                 <button onClick={() => setShowForm(false)}><X size={18} className="text-gray-400" /></button>
               </div>
               <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-50 p-3 rounded-2xl">
                       <p className="text-[8px] font-bold text-gray-400 uppercase">Merchant</p>
                       <p className="text-xs font-bold">{scannedData?.merchant || 'Unknown'}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-2xl">
                       <p className="text-[8px] font-bold text-gray-400 uppercase">Amount</p>
                       <p className="text-xs font-bold">{formatCurrency(scannedData?.amount || 0)}</p>
                    </div>
                  </div>
                  <button className="w-full py-3 bg-emerald-500 text-white rounded-xl font-bold text-xs flex items-center justify-center space-x-2">
                    <Check size={16} />
                    <span>Ajukan Reimbursement</span>
                  </button>
               </div>
            </div>
          )}

          {[
            { title: 'Transportasi Meeting', amount: 150000, date: '10 Feb', status: 'APPROVED' },
            { title: 'Internet Bulanan', amount: 350000, date: '08 Feb', status: 'PENDING' },
            { title: 'Dinner Client', amount: 750000, date: '05 Feb', status: 'APPROVED' },
          ].map((c, i) => (
            <div key={i} className="bg-white p-4 rounded-2xl border border-gray-50 flex items-center justify-between shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                  <Receipt size={20} />
                </div>
                <div>
                  <p className="font-bold text-sm">{c.title}</p>
                  <p className="text-[10px] text-gray-400">{c.date} • {formatCurrency(c.amount)}</p>
                </div>
              </div>
              <span className={`text-[10px] px-2 py-1 rounded-full font-bold ${
                c.status === 'APPROVED' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'
              }`}>
                {c.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};
