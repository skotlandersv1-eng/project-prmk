
import React, { useState } from 'react';
import { AppView, ScoutEvent } from '../types';
import { ScoutLogoIcon, SLOGAN } from '../constants';

interface SidebarProps {
  currentView: AppView;
  setView: (view: AppView) => void;
  events: ScoutEvent[];
  onSelectEvent: (id: string) => void;
  selectedEventId: string | null;
  isCollapsed: boolean;
  setIsCollapsed: (c: boolean) => void;
  userRole: 'admin' | 'user';
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  currentView, 
  setView, 
  events, 
  onSelectEvent, 
  selectedEventId,
  isCollapsed,
  setIsCollapsed,
  userRole,
  onLogout
}) => {
  const [eventsOpen, setEventsOpen] = useState(true);
  const [menuOpen, setMenuOpen] = useState(true);

  const menuItems = [
    { id: AppView.DASHBOARD, label: 'Dashboard', icon: '🏠' },
    { id: AppView.MEMBERS, label: 'Data Anggota', icon: '👥' },
    { id: AppView.CALENDAR, label: 'Kalender', icon: '📅' },
    { id: AppView.MANAGE_EVENTS, label: 'Kelola Acara', icon: '⚙️' },
  ];

  return (
    <aside className={`${isCollapsed ? 'w-20' : 'w-72'} bg-[#2f4f4f] text-white flex flex-col h-full transition-all duration-300 relative shadow-2xl z-50`}>
      {/* Collapse Toggle Button */}
      <button 
        type="button"
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-10 bg-[#8b4513] text-[#daa520] w-7 h-7 rounded-full flex items-center justify-center border-2 border-[#2f4f4f] shadow-lg hover:scale-110 transition-transform z-[60]"
      >
        {isCollapsed ? '▶' : '◀'}
      </button>

      <div className={`p-6 flex items-center gap-3 border-b border-green-800/30 ${isCollapsed ? 'justify-center' : ''}`}>
        <div className="p-2 bg-[#8b4513] rounded-xl shadow-lg shrink-0">
          <ScoutLogoIcon className="w-6 h-6 lg:w-8 lg:h-8 text-[#daa520]" />
        </div>
        {!isCollapsed && (
          <div className="overflow-hidden">
            <span className="font-bold text-xl scout-title tracking-wide text-[#daa520] block truncate">PramukaFlow</span>
          </div>
        )}
      </div>

      <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto scrollbar-hide">
        {!isCollapsed && (
          <button 
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-full flex items-center justify-between px-4 py-2 text-xs font-bold uppercase tracking-widest text-white/40 hover:text-white/60 transition-colors"
          >
            <span>Menu Utama</span>
            <span>{menuOpen ? '▼' : '▶'}</span>
          </button>
        )}

        {(isCollapsed || menuOpen) && (
          <div className="space-y-1 animate-in fade-in duration-300">
            {menuItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                   onSelectEvent(''); 
                   setView(item.id);
                }}
                title={isCollapsed ? item.label : ''}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  currentView === item.id && !selectedEventId
                    ? 'bg-[#8b4513] text-[#daa520] shadow-md'
                    : 'hover:bg-white/10 text-white/70'
                } ${isCollapsed ? 'justify-center' : ''}`}
              >
                <span className="text-xl group-hover:scale-110 transition-transform">{item.icon}</span>
                {!isCollapsed && <span className="font-medium">{item.label}</span>}
              </button>
            ))}
          </div>
        )}

        {!isCollapsed && (
          <div className="pt-4 mt-4 border-t border-white/10">
            <button 
              type="button"
              onClick={() => setEventsOpen(!eventsOpen)}
              className="w-full flex items-center justify-between px-4 py-2 text-xs font-bold uppercase tracking-widest text-white/40 hover:text-white/60 transition-colors"
            >
              <span>Daftar Kegiatan</span>
              <span>{eventsOpen ? '▼' : '▶'}</span>
            </button>
            
            {eventsOpen && (
              <div className="mt-2 space-y-1 animate-in slide-in-from-top-2 duration-300">
                {events.map((event) => (
                  <button
                    key={event.id}
                    type="button"
                    onClick={() => onSelectEvent(event.id)}
                    className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-all ${
                      selectedEventId === event.id 
                        ? 'bg-white/10 text-[#daa520] border-l-4 border-[#daa520]' 
                        : 'text-white/60 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span className="shrink-0 text-lg">📁</span>
                    <span className="truncate">{event.title}</span>
                  </button>
                ))}
                {events.length === 0 && (
                  <p className="text-[10px] text-white/30 px-4 italic">Belum ada acara</p>
                )}
              </div>
            )}
          </div>
        )}
      </nav>

      <div className="p-4 border-t border-green-800/30">
        {!isCollapsed && (
          <div className="bg-black/20 rounded-2xl p-4 text-xs mb-4">
            <p className="text-white/50 mb-2 uppercase tracking-tighter font-bold">Motto:</p>
            <p className="italic font-medium text-[#daa520]">"{SLOGAN}"</p>
          </div>
        )}
        <button 
          type="button"
          onClick={onLogout}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/20 text-white/60 hover:text-red-400 transition-all ${isCollapsed ? 'justify-center' : ''}`}
          title="Logout"
        >
          <span className="text-xl">🚪</span>
          {!isCollapsed && <span className="font-bold">Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
