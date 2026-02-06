
import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import { User, Shield, Bell, Settings, LogOut, ChevronRight, Camera, Trash2, AlertTriangle, Edit3, Check, X, Phone, Mail, UserCheck } from 'lucide-react';
import { UserProfile } from '../types';
import { Link, useNavigate } from 'react-router-dom';

interface ProfileProps {
  user: UserProfile;
  setUser: (u: UserProfile) => void;
  onLogout: () => void;
}

export const Profile: React.FC<ProfileProps> = ({ user, setUser, onLogout }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(user);

  const handleSave = () => {
    setUser(editForm);
    setIsEditing(false);
    alert('Profil berhasil diperbarui!');
  };

  const handleDeleteFace = () => {
    if (window.confirm('Apakah Anda yakin ingin menghapus data wajah? Anda harus mendaftar ulang untuk melakukan absensi.')) {
      setUser({ ...user, faceRegistered: false, faceData: undefined });
      alert('Data wajah berhasil dihapus.');
    }
  };

  return (
    <Layout title="Profil Karyawan">
      <div className="p-6 space-y-8 pb-32">
        {/* Profile Header & Edit Toggle */}
        <div className="flex flex-col items-center relative">
          <div className="relative">
            <img src={user.avatar} className="w-24 h-24 rounded-[32px] object-cover ring-4 ring-white shadow-xl" />
            <div className="absolute -bottom-2 -right-2 bg-indigo-600 text-white p-2 rounded-xl shadow-lg border-2 border-white">
               <Camera size={16} />
            </div>
          </div>
          
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className="absolute top-0 right-0 p-2 bg-white rounded-xl shadow-sm border border-gray-100 text-indigo-600"
          >
            {isEditing ? <X size={20} /> : <Edit3 size={20} />}
          </button>

          {!isEditing ? (
            <>
              <h2 className="mt-4 text-xl font-black text-gray-800">{user.name}</h2>
              <p className="text-sm font-bold text-gray-400">{user.role}</p>
              <div className="mt-2 flex items-center space-x-2">
                <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                  {user.department}
                </span>
                <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                  {user.gender}
                </span>
              </div>
            </>
          ) : (
            <div className="w-full mt-6 space-y-4 bg-white p-5 rounded-3xl border border-indigo-100 shadow-xl shadow-indigo-50/50 animate-in zoom-in-95 duration-200">
               <div className="space-y-1">
                 <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Nama Lengkap</label>
                 <input 
                    className="w-full px-4 py-3 bg-gray-50 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                    value={editForm.name}
                    onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                 />
               </div>
               <div className="space-y-1">
                 <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Jenis Kelamin</label>
                 <select 
                    className="w-full px-4 py-3 bg-gray-50 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all appearance-none"
                    value={editForm.gender}
                    onChange={(e) => setEditForm({...editForm, gender: e.target.value as any})}
                 >
                   <option value="Laki-laki">Laki-laki</option>
                   <option value="Perempuan">Perempuan</option>
                 </select>
               </div>
               <div className="space-y-1">
                 <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Email Perusahaan</label>
                 <input 
                    className="w-full px-4 py-3 bg-gray-50 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                    value={editForm.email}
                    onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                 />
               </div>
               <div className="space-y-1">
                 <label className="text-[10px] font-black text-gray-400 uppercase ml-1">No. Telepon</label>
                 <input 
                    className="w-full px-4 py-3 bg-gray-50 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                 />
               </div>
               <button 
                  onClick={handleSave}
                  className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold flex items-center justify-center space-x-2 mt-4"
               >
                 <Check size={20} />
                 <span>Simpan Perubahan</span>
               </button>
            </div>
          )}
        </div>

        {/* Biometric Status */}
        <div className="bg-white p-5 rounded-[32px] border border-gray-100 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`p-3 rounded-2xl ${user.faceRegistered ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>
                <Shield size={24} />
              </div>
              <div>
                <p className="text-sm font-black text-gray-800">Biometrik Wajah</p>
                <p className="text-[10px] text-gray-400 font-medium">{user.faceRegistered ? 'Aktif - Terenkripsi' : 'Belum didaftarkan'}</p>
              </div>
            </div>
            {user.faceRegistered ? (
              <button 
                onClick={handleDeleteFace}
                className="p-3 text-rose-500 hover:bg-rose-50 rounded-2xl transition-colors"
                title="Hapus Data Wajah"
              >
                <Trash2 size={20} />
              </button>
            ) : (
              <Link to="/register-face" className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-4 py-2 rounded-xl uppercase tracking-widest">Daftar</Link>
            )}
          </div>
        </div>

        {/* Contact Info Card */}
        {!isEditing && (
          <div className="bg-white rounded-[32px] p-5 shadow-sm border border-gray-100 space-y-4">
            <div className="flex items-center space-x-4">
               <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">
                  <Mail size={18} />
               </div>
               <div>
                 <p className="text-[10px] font-black text-gray-300 uppercase">Email</p>
                 <p className="text-sm font-bold text-gray-700">{user.email}</p>
               </div>
            </div>
            <div className="flex items-center space-x-4">
               <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">
                  <Phone size={18} />
               </div>
               <div>
                 <p className="text-[10px] font-black text-gray-300 uppercase">Telepon</p>
                 <p className="text-sm font-bold text-gray-700">{user.phone}</p>
               </div>
            </div>
          </div>
        )}

        {/* Settings Menu */}
        <div className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-gray-100">
          {[
            { icon: UserCheck, label: 'Data Personal', sub: 'NIK, KTP, NPWP' },
            { icon: Bell, label: 'Notifikasi', sub: 'Atur pengingat absensi' },
            { icon: Settings, label: 'Preferensi', sub: 'Tema & Bahasa' },
          ].map((item, i) => (
            <div key={item.label} className={`flex items-center justify-between p-5 active:bg-gray-50 transition-colors ${i !== 2 ? 'border-b border-gray-50' : ''}`}>
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-gray-50 text-gray-500 rounded-xl">
                  <item.icon size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-800">{item.label}</p>
                  <p className="text-[10px] text-gray-400">{item.sub}</p>
                </div>
              </div>
              <ChevronRight size={18} className="text-gray-300" />
            </div>
          ))}
        </div>

        {/* Logout Button */}
        <button 
          onClick={onLogout}
          className="w-full flex items-center justify-center space-x-3 py-5 bg-rose-50 text-rose-600 rounded-3xl font-black transition-all active:scale-[0.98] border border-rose-100/50 shadow-sm"
        >
          <LogOut size={20} />
          <span className="uppercase tracking-widest text-sm">Keluar Akun</span>
        </button>

        <p className="text-center text-[10px] text-gray-300 font-bold uppercase tracking-widest">HRIS Pro Mobile v2.5.0</p>
      </div>
    </Layout>
  );
};
