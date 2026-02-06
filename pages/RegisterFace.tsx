
import React, { useState, useRef, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { Camera, ShieldCheck, Loader2, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { verifyFace } from '../services/geminiService';
import { UserProfile } from '../types';

export const RegisterFace: React.FC<{ user: UserProfile; setUser: (u: UserProfile) => void }> = ({ user, setUser }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (step === 2) {
      navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user', width: { ideal: 1080 }, height: { ideal: 1080 } } 
      }).then(stream => {
        if (videoRef.current) videoRef.current.srcObject = stream;
      }).catch(err => {
        setErrorMsg('Gagal mengakses kamera. Pastikan izin diberikan.');
      });
    }
    return () => {
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop());
      }
    };
  }, [step]);

  const handleRegister = async () => {
    setLoading(true);
    setErrorMsg('');
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        // High quality crop/capture
        context.drawImage(videoRef.current, 0, 0, 1080, 1080);
        const dataUrl = canvasRef.current.toDataURL('image/jpeg', 0.9);
        const base64 = dataUrl.split(',')[1];
        
        try {
          const ok = await verifyFace(base64);
          if (ok) {
            setUser({ ...user, faceRegistered: true, faceData: 'face_v2_stored_' + Date.now() });
            setSuccess(true);
          } else {
            setErrorMsg('Kualitas foto kurang baik. Pastikan wajah terlihat jelas dan pencahayaan terang.');
          }
        } catch (e) {
          setErrorMsg('Gagal memproses verifikasi. Coba lagi.');
        }
      }
    }
    setLoading(false);
  };

  if (success) {
    return (
      <Layout title="Berhasil!">
        <div className="p-6 flex flex-col items-center justify-center h-[calc(100vh-140px)] space-y-8 animate-in fade-in duration-500">
          <div className="w-32 h-32 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 animate-bounce">
            <CheckCircle2 size={64} />
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800">Wajah Terdaftar</h2>
            <p className="text-sm text-gray-500 mt-2 px-8">Data biometrik Anda telah diperbarui. Silakan lanjut untuk melakukan absensi.</p>
          </div>
          <div className="w-full space-y-3">
            <button 
              onClick={() => navigate('/attendance')} 
              className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-100 flex items-center justify-center space-x-2 transition-transform active:scale-95"
            >
              <span>Langsung Absen Sekarang</span>
              <ArrowRight size={18} />
            </button>
            <button 
              onClick={() => navigate('/')} 
              className="w-full py-4 bg-white text-gray-600 rounded-2xl font-bold border border-gray-100 shadow-sm"
            >
              Kembali ke Beranda
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Registrasi Biometrik">
      <div className="p-6 space-y-8 h-full flex flex-col">
        {step === 1 ? (
          <div className="flex-1 flex flex-col items-center justify-center space-y-6 text-center animate-in slide-in-from-bottom-4 duration-300">
            <div className="w-24 h-24 bg-indigo-100 rounded-[32px] flex items-center justify-center text-indigo-600 shadow-inner">
              <ShieldCheck size={48} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Perbarui Data Wajah</h2>
              <p className="text-sm text-gray-500 mt-3 px-6 leading-relaxed">
                Gunakan pencahayaan yang terang dan lepaskan aksesoris wajah agar verifikasi lebih akurat.
              </p>
            </div>
            <div className="w-full grid grid-cols-1 gap-3">
               {[
                 { t: 'Resolusi Tinggi', d: 'Mendeteksi fitur wajah lebih detail' },
                 { t: 'Pencahayaan Terang', d: 'Pastikan wajah tidak terbayang' },
                 { t: 'Posisi Sejajar', d: 'Hadapkan wajah tepat ke depan' }
               ].map((item, i) => (
                 <div key={i} className="flex items-center p-4 bg-white rounded-2xl border border-gray-50 shadow-sm text-left">
                    <div className="w-2 h-2 rounded-full bg-indigo-500 mr-4" />
                    <div>
                      <p className="text-xs font-bold text-gray-800">{item.t}</p>
                      <p className="text-[10px] text-gray-400">{item.d}</p>
                    </div>
                 </div>
               ))}
            </div>
            <button
              onClick={() => setStep(2)}
              className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-xl shadow-indigo-100 flex items-center justify-center space-x-2 transition-transform active:scale-95 mt-auto"
            >
              <span>Mulai Pindai</span>
              <ArrowRight size={18} />
            </button>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center space-y-6 animate-in slide-in-from-right-4 duration-300">
            <div className="w-full bg-white p-4 rounded-3xl border border-gray-100 flex items-center justify-between shadow-sm">
               <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">High Accuracy Scan</span>
               <div className="flex space-x-1">
                 <div className="w-2 h-2 rounded-full bg-indigo-600" />
                 <div className="w-2 h-2 rounded-full bg-indigo-600" />
                 <div className="w-2 h-2 rounded-full bg-gray-200" />
               </div>
            </div>

            <div className="relative w-full aspect-square max-w-[320px] rounded-full overflow-hidden border-8 border-white shadow-2xl bg-gray-900 ring-1 ring-gray-100">
              <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover scale-x-[-1]" />
              <canvas ref={canvasRef} className="hidden" width="1080" height="1080" />
              
              {/* Scan Overlay */}
              <div className="absolute inset-0 border-[2px] border-white/20 rounded-full m-6 pointer-events-none" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-52 h-52 border-2 border-indigo-400/30 rounded-full border-dashed" />
              
              {loading && (
                <div className="absolute inset-0 bg-indigo-900/40 flex flex-col items-center justify-center">
                  <Loader2 className="animate-spin text-white mb-2" size={32} />
                  <span className="text-white text-[10px] font-bold uppercase tracking-widest">Menganalisa...</span>
                </div>
              )}
            </div>

            {errorMsg ? (
              <div className="flex items-center space-x-2 p-3 bg-red-50 rounded-2xl border border-red-100 text-red-600">
                <AlertCircle size={14} className="shrink-0" />
                <p className="text-[10px] font-bold leading-tight">{errorMsg}</p>
              </div>
            ) : (
              <p className="text-xs font-semibold text-gray-500 text-center px-8">
                Tatap kamera dengan ekspresi natural. Pastikan wajah berada di dalam lingkaran.
              </p>
            )}

            <button
              onClick={handleRegister}
              disabled={loading}
              className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-100 flex items-center justify-center space-x-2 transition-transform active:scale-95 mt-auto disabled:grayscale"
            >
              {loading ? <Loader2 className="animate-spin" /> : (
                <>
                  <Camera size={20} />
                  <span>Daftar Wajah Baru</span>
                </>
              )}
            </button>
            
            <button 
              onClick={() => setStep(1)} 
              disabled={loading}
              className="text-sm font-bold text-gray-400 hover:text-indigo-600 transition-colors py-2"
            >
              Batal
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
};
