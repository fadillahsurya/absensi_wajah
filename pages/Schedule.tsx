
import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import { Calendar as CalendarIcon, Clock, ChevronRight, ChevronLeft, MapPin, CheckCircle, AlertCircle } from 'lucide-react';
import { AttendanceRecord } from '../types';

interface ScheduleProps {
  history: AttendanceRecord[];
}

export const Schedule: React.FC<ScheduleProps> = ({ history }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewDate, setViewDate] = useState(new Date());

  const daysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();
  const firstDayOfMonth = (y: number, m: number) => new Date(y, m, 1).getDay();

  const handlePrevMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1));
  const handleNextMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1));

  const monthName = viewDate.toLocaleString('id-ID', { month: 'long', year: 'numeric' });
  const dayLabels = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

  const todayStr = new Date().toISOString().split('T')[0];
  const selectedDateStr = selectedDate.toISOString().split('T')[0];
  const selectedRecord = history.find(h => h.date === selectedDateStr);

  const renderCalendar = () => {
    const totalDays = daysInMonth(viewDate.getFullYear(), viewDate.getMonth());
    const startDay = firstDayOfMonth(viewDate.getFullYear(), viewDate.getMonth());
    const cells = [];

    // Empty cells for padding
    for (let i = 0; i < startDay; i++) {
      cells.push(<div key={`empty-${i}`} className="h-10 w-10" />);
    }

    // Actual days
    for (let d = 1; d <= totalDays; d++) {
      const date = new Date(viewDate.getFullYear(), viewDate.getMonth(), d);
      const dateStr = date.toISOString().split('T')[0];
      const hasRecord = history.find(h => h.date === dateStr);
      const isSelected = selectedDateStr === dateStr;
      const isToday = todayStr === dateStr;

      cells.push(
        <button
          key={d}
          onClick={() => setSelectedDate(date)}
          className={`h-10 w-10 flex flex-col items-center justify-center rounded-xl text-xs font-bold transition-all relative
            ${isSelected ? 'bg-indigo-600 text-white shadow-lg' : 'hover:bg-gray-100 text-gray-700'}
            ${isToday && !isSelected ? 'border-2 border-indigo-200 text-indigo-600' : ''}
          `}
        >
          {d}
          {hasRecord && !isSelected && (
            <div className={`absolute bottom-1 w-1 h-1 rounded-full ${hasRecord.status === 'LATE' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
          )}
        </button>
      );
    }

    return cells;
  };

  return (
    <Layout title="Presensi & Jadwal">
      <div className="p-4 space-y-6 pb-12">
        {/* Calendar Card */}
        <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-black text-gray-800 text-lg">{monthName}</h3>
            <div className="flex space-x-2">
              <button onClick={handlePrevMonth} className="p-2 bg-gray-50 rounded-xl text-gray-400 hover:text-indigo-600">
                <ChevronLeft size={18} />
              </button>
              <button onClick={handleNextMonth} className="p-2 bg-gray-50 rounded-xl text-gray-400 hover:text-indigo-600">
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-y-2 text-center mb-2">
            {dayLabels.map(day => (
              <span key={day} className="text-[10px] font-bold text-gray-300 uppercase tracking-wider">{day}</span>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-y-3">
            {renderCalendar()}
          </div>
        </div>

        {/* Selected Date Details */}
        <div className="animate-in slide-in-from-bottom-2 duration-500">
          <div className="flex items-center justify-between mb-4 px-2">
             <h4 className="font-bold text-gray-800">
               {selectedDate.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'short' })}
             </h4>
             <span className="text-[10px] font-bold text-indigo-500 bg-indigo-50 px-3 py-1 rounded-full uppercase">Details</span>
          </div>

          {selectedRecord ? (
            <div className="space-y-3">
              <div className="bg-white p-5 rounded-3xl border border-gray-50 shadow-sm flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                    <CheckCircle size={24} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-tight">Clock In</p>
                    <p className="text-lg font-black text-gray-800">{selectedRecord.clockIn || '--:--'}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-[10px] font-bold px-3 py-1 rounded-full ${
                    selectedRecord.status === 'LATE' ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'
                  }`}>
                    {selectedRecord.status}
                  </p>
                </div>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-gray-50 shadow-sm flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                    <Clock size={24} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-tight">Clock Out</p>
                    <p className="text-lg font-black text-gray-800">{selectedRecord.clockOut || 'Belum Keluar'}</p>
                  </div>
                </div>
              </div>

              {selectedRecord.lat && (
                <div className="flex items-center space-x-2 text-[10px] text-gray-400 px-4 mt-2">
                  <MapPin size={12} />
                  <span>Presensi via Mobile App ({selectedRecord.lat.toFixed(4)}, {selectedRecord.lng?.toFixed(4)})</span>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-gray-50/50 border-2 border-dashed border-gray-100 rounded-[32px] p-10 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-gray-200 mb-4 shadow-sm">
                <AlertCircle size={32} />
              </div>
              <p className="text-sm font-bold text-gray-400">Tidak ada log presensi</p>
              <p className="text-[10px] text-gray-300 mt-1 max-w-[200px]">Data kehadiran untuk tanggal ini belum tercatat dalam sistem.</p>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="flex justify-center space-x-6 pt-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-[10px] font-bold text-gray-400 uppercase">Tepat Waktu</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="text-[10px] font-bold text-gray-400 uppercase">Terlambat</span>
          </div>
        </div>
      </div>
    </Layout>
  );
};
