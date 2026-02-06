
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Profile } from './pages/Profile';
import { Chat } from './pages/Chat';
import { Attendance } from './pages/Attendance';
import { RegisterFace } from './pages/RegisterFace';
import { Schedule } from './pages/Schedule';
import { Services } from './pages/Services';
import { Overtime } from './pages/Overtime';
import { Leave } from './pages/Leave';
import { Claims } from './pages/Claims';
import { Login } from './pages/Login';
import { AttendanceStatus, UserProfile, AttendanceRecord } from './types';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('hris_token') === 'true';
  });

  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('hris_user');
    return saved ? JSON.parse(saved) : {
      id: 'EMP001',
      name: 'Budi Santoso',
      role: 'Senior Developer',
      department: 'Engineering',
      avatar: 'https://i.pravatar.cc/150?u=budi',
      faceRegistered: false,
      baseSalary: 7500000,
      gender: 'Laki-laki',
      email: 'budi.santoso@company.com',
      phone: '081234567890'
    };
  });

  const [history, setHistory] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem('hris_history');
    return saved ? JSON.parse(saved) : [
      { id: '1', date: '2024-05-20', clockIn: '08:02', clockOut: '17:05', status: 'PRESENT' },
      { id: '2', date: '2024-05-21', clockIn: '08:15', clockOut: '17:10', status: 'LATE' },
    ];
  });

  const [attendanceState, setAttendanceState] = useState<AttendanceStatus>(() => {
    const today = new Date().toISOString().split('T')[0];
    const todayRecord = history.find(h => h.date === today);
    if (!todayRecord) return 'NONE';
    if (todayRecord.clockIn && !todayRecord.clockOut) return 'CLOCK_IN';
    if (todayRecord.clockIn && todayRecord.clockOut) return 'CLOCK_OUT';
    return 'NONE';
  });

  useEffect(() => {
    localStorage.setItem('hris_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('hris_history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem('hris_token', isLoggedIn ? 'true' : 'false');
  }, [isLoggedIn]);

  const handleLogin = () => setIsLoggedIn(true);
  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('hris_token');
  };

  const addAttendance = (type: 'CLOCK_IN' | 'CLOCK_OUT', lat: number, lng: number) => {
    const today = new Date().toISOString().split('T')[0];
    const nowTime = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    
    setHistory(prev => {
      const existingIdx = prev.findIndex(h => h.date === today);
      if (existingIdx > -1) {
        const updated = [...prev];
        if (type === 'CLOCK_OUT') updated[existingIdx].clockOut = nowTime;
        return updated;
      } else {
        return [...prev, {
          id: Math.random().toString(),
          date: today,
          clockIn: type === 'CLOCK_IN' ? nowTime : undefined,
          status: 'PRESENT',
          lat,
          lng
        }];
      }
    });

    setAttendanceState(type);
  };

  if (!isLoggedIn) {
    return (
      <HashRouter>
        <Routes>
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </HashRouter>
    );
  }

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home user={user} attendanceState={attendanceState} />} />
        <Route path="/services" element={<Services />} />
        <Route path="/schedule" element={<Schedule history={history} />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/profile" element={<Profile user={user} setUser={setUser} onLogout={handleLogout} />} />
        <Route path="/attendance" element={<Attendance attendanceState={attendanceState} onComplete={addAttendance} user={user} />} />
        <Route path="/register-face" element={<RegisterFace user={user} setUser={setUser} />} />
        <Route path="/overtime" element={<Overtime />} />
        <Route path="/leave" element={<Leave />} />
        <Route path="/claims" element={<Claims />} />
        <Route path="/login" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
};

export default App;
