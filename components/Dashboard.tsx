
import React, { useState } from 'react';
import { ScoutEvent, Member } from '../types';
import { TRI_SATYA, DASA_DARMA } from '../constants';

interface DashboardProps {
  events: ScoutEvent[];
  members: Member[];
}

const Dashboard: React.FC<DashboardProps> = ({ events, members }) => {
  const [triSatyaOpen, setTriSatyaOpen] = useState(true);
  const [dasaDarmaOpen, setDasaDarmaOpen] = useState(false);

  const totalTasks = events.reduce((acc, e) => acc + e.boards.reduce((bAcc, b) => bAcc + b.tasks.length, 0), 0);
  const completedTasks = events.reduce((acc, e) => 
    acc + e.boards.reduce((bAcc, b) => bAcc + b.tasks.filter(t => t.status === 'Selesai').length, 0), 0);

  const stats = [
    { label: 'Total Anggota', value: members.length, color: 'bg-blue-100 text-blue-600', icon: '👥' },
    { label: 'Acara Mendatang', value: events.length, color: 'bg-green-100 text-green-600', icon: '🚩' },
    { label: 'Tugas Selesai', value: `${completedTasks}/${totalTasks}`, color: 'bg-amber-100 text-amber-600', icon: '✅' },
  ];

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-5 hover:shadow-md transition-shadow">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${stat.color}`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">{stat.label}</p>
              <h3 className="text-3xl font-bold mt-1">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Kode Kehormatan Section */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold flex items-center gap-2 px-2">
            <span className="w-2 h-8 bg-[#8b4513] rounded-full"></span>
            Kode Kehormatan
          </h3>

          {/* Tri Satya Card */}
          <div className="bg-[#8b4513] rounded-3xl overflow-hidden shadow-lg transition-all duration-300">
            <button 
              onClick={() => setTriSatyaOpen(!triSatyaOpen)}
              className="w-full p-6 flex justify-between items-center text-[#daa520] hover:bg-black/10 transition-colors"
            >
              <h4 className="text-2xl font-bold scout-title">Tri Satya</h4>
              <span className="text-xl">{triSatyaOpen ? '▲' : '▼'}</span>
            </button>
            <div className={`transition-all duration-500 overflow-hidden ${triSatyaOpen ? 'max-h-96' : 'max-h-0'}`}>
              <div className="p-6 pt-0 space-y-4">
                {TRI_SATYA.map((item, idx) => (
                  <div key={idx} className="flex gap-4 items-start text-white/90">
                    <span className="bg-[#daa520] text-[#8b4513] w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">{idx + 1}</span>
                    <p className="text-sm leading-relaxed">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Dasa Darma Card */}
          <div className="bg-[#2f4f4f] rounded-3xl overflow-hidden shadow-lg transition-all duration-300">
            <button 
              onClick={() => setDasaDarmaOpen(!dasaDarmaOpen)}
              className="w-full p-6 flex justify-between items-center text-[#daa520] hover:bg-black/10 transition-colors"
            >
              <h4 className="text-2xl font-bold scout-title">Dasa Darma</h4>
              <span className="text-xl">{dasaDarmaOpen ? '▲' : '▼'}</span>
            </button>
            <div className={`transition-all duration-500 overflow-hidden ${dasaDarmaOpen ? 'max-h-[600px]' : 'max-h-0'}`}>
              <div className="p-6 pt-0 grid grid-cols-1 md:grid-cols-2 gap-4">
                {DASA_DARMA.map((item, idx) => (
                  <div key={idx} className="flex gap-3 items-center bg-white/5 p-3 rounded-2xl border border-white/10">
                    <span className="text-[#daa520] font-bold text-lg">{idx + 1}.</span>
                    <p className="text-xs text-white/80">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity / Upcoming */}
        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm flex flex-col">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <span className="w-2 h-8 bg-green-700 rounded-full"></span>
            Agenda Terdekat
          </h3>
          <div className="space-y-4 flex-1">
            {events.slice(0, 4).map(event => (
              <div key={event.id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 group hover:border-[#8b4513]/20 transition-colors">
                <div className="flex gap-4 items-center">
                    <div className="bg-[#8b4513]/10 p-3 rounded-xl text-[#8b4513] text-xl">
                        📅
                    </div>
                    <div>
                        <h4 className="font-semibold text-slate-800">{event.title}</h4>
                        <p className="text-sm text-slate-500">{new Date(event.date).toLocaleDateString('id-ID', { dateStyle: 'medium' })}</p>
                    </div>
                </div>
                <div className="bg-[#daa520] text-[#8b4513] text-[10px] font-bold px-2 py-1 rounded-lg">
                    {event.boards.reduce((acc, b) => acc + b.tasks.length, 0)} TUGAS
                </div>
              </div>
            ))}
            {events.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                <span className="text-4xl mb-2">🔭</span>
                <p>Belum ada agenda kegiatan.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
