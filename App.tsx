
import React, { useState, useEffect, useCallback } from 'react';
import { AppView, ScoutEvent, Member, MemberRole, KanbanBoard, KanbanTask, TaskStatus } from './types';
import { ScoutLogoIcon } from './constants';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import MemberTable from './components/MemberTable';
import EventManager from './components/EventManager';
import CalendarView from './components/CalendarView';
import Login from './components/Login';

const App: React.FC = () => {
  const [userRole, setUserRole] = useState<'admin' | 'user' | null>(() => {
    const saved = localStorage.getItem('pramuka-auth');
    return (saved as 'admin' | 'user') || null;
  });
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
  const [members, setMembers] = useState<Member[]>(() => {
    const saved = localStorage.getItem('pramuka-members');
    return saved ? JSON.parse(saved) : [
      { id: '1', name: 'Andi Pradana', role: 'Pradana', rank: 'Penegak Laksana' },
      { id: '2', name: 'Budi Santoso', role: 'Sekretaris', rank: 'Penegak Bantara' },
      { id: '3', name: 'Siti Aminah', role: 'Bendahara', rank: 'Penegak Bantara' },
    ];
  });

  const [events, setEvents] = useState<ScoutEvent[]>(() => {
    const saved = localStorage.getItem('pramuka-events');
    return saved ? JSON.parse(saved) : [
      {
        id: 'e1',
        title: 'Kemah Bakti 2024',
        date: '2024-08-14',
        description: 'Kegiatan kemah tahunan di Bumi Perkemahan.',
        boards: [
          {
            id: 'b1',
            name: 'To Do',
            isOpen: true,
            tasks: [
              { id: 't1', title: 'Survey Lokasi', description: 'Cek akses air dan keamanan', assigneeId: '1', status: 'Selesai' },
              { id: 't2', title: 'Sewa Tenda', description: 'Hubungi penyedia jasa tenda', assigneeId: '3', status: 'Dalam Proses' }
            ]
          },
          { id: 'b2', name: 'In Progress', isOpen: true, tasks: [] },
          { id: 'b3', name: 'Done', isOpen: true, tasks: [] }
        ]
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('pramuka-members', JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    localStorage.setItem('pramuka-events', JSON.stringify(events));
  }, [events]);

  const handleLogin = (role: 'admin' | 'user') => {
    setUserRole(role);
    localStorage.setItem('pramuka-auth', role);
  };

  const handleLogout = () => {
    setUserRole(null);
    localStorage.removeItem('pramuka-auth');
  };

  const addMember = useCallback((m: Omit<Member, 'id'>) => {
    if (userRole !== 'admin') return alert("Hanya admin yang dapat menambah anggota.");
    setMembers(prev => [...prev, { ...m, id: Date.now().toString() }]);
  }, [userRole]);

  const deleteMember = useCallback((id: string) => {
    if (userRole !== 'admin') return alert("Hanya admin yang dapat menghapus data.");
    if (window.confirm("Apakah Anda yakin ingin menghapus anggota ini?")) {
      setMembers(prev => prev.filter(m => m.id !== id));
    }
  }, [userRole]);

  const addEvent = useCallback((e: Omit<ScoutEvent, 'id' | 'boards'>) => {
    if (userRole !== 'admin') return alert("Hanya admin yang dapat membuat acara baru.");
    const newId = Date.now().toString();
    setEvents(prev => [...prev, { ...e, id: newId, boards: [
      { id: `b1-${newId}`, name: 'To Do', isOpen: true, tasks: [] },
      { id: `b2-${newId}`, name: 'In Progress', isOpen: true, tasks: [] },
      { id: `b3-${newId}`, name: 'Done', isOpen: true, tasks: [] }
    ] }]);
  }, [userRole]);

  const deleteEvent = useCallback((id: string) => {
    if (userRole !== 'admin') return alert("Hanya admin yang dapat menghapus acara.");
    if (window.confirm("Hapus acara ini beserta seluruh datanya?")) {
      setEvents(prev => prev.filter(e => e.id !== id));
      if (selectedEventId === id) {
        setCurrentView(AppView.DASHBOARD);
        setSelectedEventId(null);
      }
    }
  }, [userRole, selectedEventId]);

  const toggleBoard = useCallback((eventId: string, boardId: string) => {
    setEvents(prev => prev.map(e => {
      if (e.id !== eventId) return e;
      return {
        ...e,
        boards: e.boards.map(b => b.id === boardId ? { ...b, isOpen: !b.isOpen } : b)
      };
    }));
  }, []);

  const addBoard = useCallback((eventId: string) => {
    if (userRole !== 'admin') return alert("Izin ditolak.");
    setEvents(prev => prev.map(e => {
      if (e.id !== eventId) return e;
      return {
        ...e,
        boards: [...e.boards, { id: `b-${Date.now()}`, name: 'Kolom Baru', isOpen: true, tasks: [] }]
      };
    }));
  }, [userRole]);

  const deleteBoard = useCallback((eventId: string, boardId: string) => {
    if (userRole !== 'admin') return alert("Izin ditolak.");
    if (window.confirm("Hapus kolom ini?")) {
      setEvents(prev => prev.map(e => {
        if (e.id !== eventId) return e;
        return {
          ...e,
          boards: e.boards.filter(b => b.id !== boardId)
        };
      }));
    }
  }, [userRole]);

  const updateTask = useCallback((eventId: string, boardId: string, taskId: string, updates: Partial<KanbanTask>) => {
    setEvents(prev => prev.map(e => {
      if (e.id !== eventId) return e;
      return {
        ...e,
        boards: e.boards.map(b => {
          if (b.id !== boardId) return b;
          return {
            ...b,
            tasks: b.tasks.map(t => t.id === taskId ? { ...t, ...updates } : t)
          };
        })
      };
    }));
  }, []);

  const deleteTask = useCallback((eventId: string, boardId: string, taskId: string) => {
    if (userRole !== 'admin') return;
    // Alert dihapus sesuai permintaan user untuk memastikan eksekusi lancar
    setEvents(prev => prev.map(e => {
      if (e.id !== eventId) return e;
      return {
        ...e,
        boards: e.boards.map(b => {
          if (b.id !== boardId) return b;
          return {
            ...b,
            tasks: b.tasks.filter(t => t.id !== taskId)
          };
        })
      };
    }));
  }, [userRole]);

  const addTask = useCallback((eventId: string, boardId: string) => {
    if (userRole !== 'admin') return;
    setEvents(prev => prev.map(e => {
      if (e.id !== eventId) return e;
      return {
        ...e,
        boards: e.boards.map(b => {
          if (b.id !== boardId) return b;
          return {
            ...b,
            tasks: [...b.tasks, {
              id: `t-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
              title: 'Tugas Baru',
              description: '',
              assigneeId: members[0]?.id || '',
              status: 'Belum Dimulai' as TaskStatus
            }]
          };
        })
      };
    }));
  }, [userRole, members]);

  const handleSelectEvent = useCallback((id: string) => {
    setSelectedEventId(id || null);
    if (id) setCurrentView(AppView.EVENT_ROOM);
    else setCurrentView(AppView.DASHBOARD);
  }, []);

  if (!userRole) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen overflow-hidden text-slate-800 bg-[#fdfaf5]">
      <Sidebar 
        currentView={currentView} 
        setView={setCurrentView} 
        events={events} 
        onSelectEvent={handleSelectEvent}
        selectedEventId={selectedEventId}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        userRole={userRole}
        onLogout={handleLogout}
      />
      
      <main className="flex-1 overflow-y-auto p-6 lg:p-10 relative transition-all duration-300">
        <div className="absolute top-0 right-0 opacity-5 pointer-events-none p-20">
            <ScoutLogoIcon className="w-96 h-96" />
        </div>
        
        <div className="max-w-7xl mx-auto z-10 relative">
          <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${userRole === 'admin' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                  {userRole === 'admin' ? 'Administrator' : 'Akses Pengguna'}
                </span>
              </div>
              <h1 className="text-4xl font-bold scout-title text-[#5d2e0a]">
                {currentView === AppView.DASHBOARD && 'Dashboard Ambalan'}
                {currentView === AppView.EVENT_ROOM && `Room: ${events.find(e => e.id === selectedEventId)?.title}`}
                {currentView === AppView.MANAGE_EVENTS && 'Daftar Semua Acara'}
                {currentView === AppView.MEMBERS && 'Daftar Anggota'}
                {currentView === AppView.CALENDAR && 'Kalender Kegiatan'}
              </h1>
              <p className="text-slate-500 mt-1">Sistem Informasi Organisasi Pramuka SMA</p>
            </div>
          </header>

          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {currentView === AppView.DASHBOARD && <Dashboard events={events} members={members} />}
            {currentView === AppView.MEMBERS && (
              <MemberTable 
                members={members} 
                onAdd={addMember} 
                onDelete={deleteMember} 
                isAdmin={userRole === 'admin'} 
              />
            )}
            {(currentView === AppView.MANAGE_EVENTS || currentView === AppView.EVENT_ROOM) && (
              <EventManager 
                events={currentView === AppView.EVENT_ROOM ? events.filter(e => e.id === selectedEventId) : events} 
                members={members}
                onToggleBoard={toggleBoard}
                onAddBoard={addBoard}
                onDeleteBoard={deleteBoard}
                onUpdateTask={updateTask}
                onDeleteTask={deleteTask}
                onAddTask={addTask}
                onAddEvent={addEvent}
                onDeleteEvent={deleteEvent}
                setEvents={setEvents}
                isAdmin={userRole === 'admin'}
                isSingleView={currentView === AppView.EVENT_ROOM}
              />
            )}
            {currentView === AppView.CALENDAR && <CalendarView events={events} />}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
