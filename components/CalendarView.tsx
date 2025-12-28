
import React from 'react';
import { ScoutEvent } from '../types';

interface CalendarViewProps {
  events: ScoutEvent[];
}

const CalendarView: React.FC<CalendarViewProps> = ({ events }) => {
  const days = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
  const now = new Date();
  const month = now.toLocaleString('id-ID', { month: 'long' });
  const year = now.getFullYear();

  // Simple static calendar grid representation for current month
  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, now.getMonth(), 1).getDay();
  const totalDays = getDaysInMonth(year, now.getMonth());

  const grid = [];
  for (let i = 0; i < firstDay; i++) grid.push(null);
  for (let i = 1; i <= totalDays; i++) grid.push(i);

  const isEventDay = (day: number) => {
    const dStr = `${year}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.find(e => e.date === dStr);
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-2xl font-bold text-slate-800">{month} {year}</h3>
        <div className="flex gap-2">
            <button className="p-2 hover:bg-slate-100 rounded-xl">◀️</button>
            <button className="p-2 hover:bg-slate-100 rounded-xl">▶️</button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-4 mb-4">
        {days.map(day => (
          <div key={day} className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-4">
        {grid.map((day, idx) => {
          const event = day ? isEventDay(day) : null;
          return (
            <div key={idx} className={`h-32 rounded-2xl border border-slate-50 relative group transition-all p-3 ${
              day ? 'bg-white hover:border-[#8b4513] hover:shadow-lg' : 'bg-transparent border-none'
            }`}>
              {day && (
                <>
                  <span className={`text-sm font-bold ${day === now.getDate() ? 'bg-[#8b4513] text-white w-7 h-7 flex items-center justify-center rounded-full' : 'text-slate-400'}`}>
                    {day}
                  </span>
                  {event && (
                    <div className="mt-2 p-2 bg-[#daa520]/20 border border-[#daa520]/40 rounded-lg text-[10px] font-bold text-[#8b4513] animate-pulse">
                      🚩 {event.title}
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>
      <div className="mt-8 flex items-center gap-6">
          <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#8b4513]"></div>
              <span className="text-xs text-slate-500 font-medium">Hari Ini</span>
          </div>
          <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#daa520]"></div>
              <span className="text-xs text-slate-500 font-medium">Kegiatan Pramuka</span>
          </div>
      </div>
    </div>
  );
};

export default CalendarView;
