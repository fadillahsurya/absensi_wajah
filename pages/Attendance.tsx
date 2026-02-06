
import React, { useState, useEffect, useRef } from 'react';
import { Layout } from '../components/Layout';
import { Camera, MapPin, Loader2, CheckCircle, XCircle, ArrowLeft, Radio } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { isWithinOffice, calculateDistance } from '../utils';
import { OFFICE_COORDS, ALLOWED_RADIUS_METERS } from '../constants';
import { verifyFace } from '../services/geminiService';
import { AttendanceStatus, UserProfile } from '../types';

interface AttendanceProps {
  attendanceState: AttendanceStatus;
  onComplete: (type: 'CLOCK_IN' | 'CLOCK_OUT', lat: number, lng: number) => void;
  user: UserProfile;
}

export const Attendance: React.FC<AttendanceProps> = ({ attendanceState, onComplete, user }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [locationStatus, setLocationStatus] = useState<'IDLE' | 'CHECKING' | 'SUCCESS' | 'ERROR'>('IDLE');
  const [faceStatus, setFaceStatus] = useState<'IDLE' | 'CHECKING' | 'SUCCESS' | 'ERROR'>('IDLE');
  const [errorMsg, setErrorMsg] = useState('');
  const [userLoc, setUserLoc] = useState({ lat: 0, lng: 0 });
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!user.faceRegistered) {
      navigate('/register-face');
      return;
    }
    startCamera();
    checkLocation();
    
    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, [user.faceRegistered, navigate]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } } 
      });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (e) {
      setErrorMsg('Kamera tidak dapat diakses.');
    }
  };

  const checkLocation = () => {
    setLocationStatus('CHECKING');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setUserLoc({ lat: latitude, lng: longitude });
        if (isWithinOffice(latitude, longitude, ALLOWED_RADIUS_METERS)) {
          setLocationStatus('SUCCESS');
        } else {
          setLocationStatus('ERROR');
          const dist = calculateDistance(latitude, longitude, OFFICE_COORDS.lat, OFFICE_COORDS.lng);
          setErrorMsg(`Anda berada ${Math.round(dist)}m dari kantor.`);
        }
      },
      () => {
        setLocationStatus('ERROR');
        setErrorMsg('Gagal mendapatkan lokasi GPS.');
      },
      { enableHighAccuracy: true }
    );
  };

  const captureAndVerify = async () => {
    if (locationStatus !== 'SUCCESS') return;
    setLoading(true);
    setFaceStatus('CHECKING');
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        context.drawImage(videoRef.current, 0, 0, 640, 480);
        const dataUrl = canvasRef.current.toDataURL('image/jpeg', 0.8);
        const base64 = dataUrl.split(',')[1];
        try {
          const verified = await verifyFace(base64);
          if (verified) {
            setFaceStatus('SUCCESS');
            onComplete(attendanceState === 'NONE' ? 'CLOCK_IN' : 'CLOCK_OUT', userLoc.lat, userLoc.lng);
            setTimeout(() => navigate('/'), 1500);
          } else {
            setFaceStatus('ERROR');
            setErrorMsg('Wajah tidak dikenali.');
          }
        } catch { setFaceStatus('ERROR'); }
      }
    }
    setLoading(false);
  };

  return (
    <Layout title={attendanceState === 'NONE' ? 'Presensi Masuk' : 'Presensi Keluar'}>
      <div className="p-6 flex flex-col items-center">
        <div className="w-full flex items-center mb-6">
          <button onClick={() => navigate(-1)} className="p-2 text-gray-400"><ArrowLeft size={24} /></button>
          <div className="flex-1 text-center pr-8 font-black text-gray-800 uppercase tracking-widest text-sm">Verify Presence</div>
        </div>

        {/* Radar Map Visualization */}
        <div className="w-full bg-white p-4 rounded-[32px] border border-gray-100 mb-6 shadow-sm flex items-center justify-between overflow-hidden relative">
           <div className="relative z-10 flex items-center space-x-3">
              <div className={`p-3 rounded-2xl ${locationStatus === 'SUCCESS' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                 <Radio className={locationStatus === 'CHECKING' ? 'animate-pulse' : ''} />
              </div>
              <div>
                <p className="text-xs font-black text-gray-800 uppercase tracking-tighter">Geofence Status</p>
                <p className="text-[10px] text-gray-400 font-bold">{locationStatus === 'SUCCESS' ? 'Inside Office Area' : 'Outside Office Area'}</p>
              </div>
           </div>
           {locationStatus === 'SUCCESS' && <CheckCircle className="text-emerald-500 relative z-10" size={20} />}
           {/* Radar Waves */}
           {locationStatus === 'CHECKING' && (
             <div className="absolute inset-0 flex items-center justify-center opacity-20">
                <div className="w-24 h-24 bg-indigo-500 rounded-full animate-ping" />
             </div>
           )}
        </div>

        <div className="relative w-full aspect-square max-w-[280px] mb-8">
          <div className="absolute inset-0 rounded-full overflow-hidden border-8 border-white shadow-2xl ring-1 ring-gray-100 bg-gray-900">
            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover scale-x-[-1]" />
            {faceStatus === 'CHECKING' && (
              <div className="absolute inset-0 bg-indigo-500/20 animate-pulse flex items-center justify-center">
                <div className="w-full h-1 bg-indigo-400 shadow-[0_0_15px_indigo] absolute animate-[scan_2s_infinite]" />
              </div>
            )}
            {faceStatus === 'SUCCESS' && (
               <div className="absolute inset-0 bg-emerald-500/30 flex items-center justify-center animate-in fade-in"><CheckCircle size={80} className="text-white" /></div>
            )}
          </div>
          <canvas ref={canvasRef} className="hidden" width="640" height="480" />
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50 rounded-2xl border border-red-100 flex items-center space-x-3 text-red-600 animate-in slide-in-from-top-2">
            <XCircle size={18} className="shrink-0" />
            <p className="text-[10px] font-black leading-tight uppercase tracking-tight">{errorMsg}</p>
          </div>
        )}

        <button
          onClick={captureAndVerify}
          disabled={loading || locationStatus !== 'SUCCESS' || faceStatus === 'SUCCESS'}
          className={`w-full py-5 rounded-[28px] font-black text-white shadow-xl transition-all active:scale-[0.95] disabled:opacity-40 flex items-center justify-center space-x-3 uppercase tracking-widest text-sm
            ${attendanceState === 'NONE' ? 'bg-indigo-600 shadow-indigo-100' : 'bg-rose-600 shadow-rose-100'}`}
        >
          {loading ? <Loader2 className="animate-spin" /> : <><Camera size={20} /><span>Verify Now</span></>}
        </button>
      </div>
      <style>{`
        @keyframes scan {
          0% { top: 10%; }
          50% { top: 90%; }
          100% { top: 10%; }
        }
      `}</style>
    </Layout>
  );
};
