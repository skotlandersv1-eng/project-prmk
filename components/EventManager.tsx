
import React, { useState } from 'react';
import { ScoutEvent, Member, KanbanBoard, KanbanTask, TaskStatus } from '../types';
import { generateScoutTasks } from '../services/geminiService';

interface EventManagerProps {
  events: ScoutEvent[];
  members: Member[];
  onToggleBoard: (eventId: string, boardId: string) => void;
  onAddBoard: (eventId: string) => void;
  onDeleteBoard: (eventId: string, boardId: string) => void;
  onUpdateTask: (eventId: string, boardId: string, taskId: string, updates: Partial<KanbanTask>) => void;
  onDeleteTask: (eventId: string, boardId: string, taskId: string) => void;
  onAddTask: (eventId: string, boardId: string) => void;
  onAddEvent: (e: Omit<ScoutEvent, 'id' | 'boards'>) => void;
  onDeleteEvent: (id: string) => void;
  setEvents: React.Dispatch<React.SetStateAction<ScoutEvent[]>>;
  isSingleView?: boolean;
  isAdmin: boolean;
}

const EventManager: React.FC<EventManagerProps> = ({ 
  events, 
  members, 
  onToggleBoard, 
  onAddBoard,
  onDeleteBoard,
  onUpdateTask,
  onDeleteTask,
  onAddTask,
  onAddEvent,
  onDeleteEvent,
  setEvents,
  isSingleView = false,
  isAdmin
}) => {
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', date: '', description: '' });
  const [isLoadingAI, setIsLoadingAI] = useState(false);

  const handleAIPlanning = async (event: ScoutEvent) => {
    if (!isAdmin) return;
    setIsLoadingAI(true);
    const suggestedTasks = await generateScoutTasks(event.title, event.description);
    
    if (suggestedTasks.length > 0) {
      const newBoard: KanbanBoard = {
        id: `b-ai-${Date.now()}`,
        name: 'Saran AI',
        isOpen: true,
        tasks: suggestedTasks.map((t: any, i: number) => ({
          id: `t-ai-${i}-${Date.now()}`,
          title: t.title,
          description: t.description,
          status: 'Belum Dimulai' as TaskStatus,
          assigneeId: members[0]?.id || ''
        }))
      };

      setEvents(prev => prev.map(e => e.id === event.id ? { ...e, boards: [...e.boards, newBoard] } : e));
    }
    setIsLoadingAI(false);
  };

  const updateBoardName = (eventId: string, boardId: string, name: string) => {
    if (!isAdmin) return;
    setEvents(prev => prev.map(e => {
      if (e.id !== eventId) return e;
      return {
        ...e,
        boards: e.boards.map(b => b.id === boardId ? { ...b, name } : b)
      };
    }));
  };

  return (
    <div className="space-y-12">
      {!isSingleView && isAdmin && (
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-slate-700">Manajemen Semua Acara</h2>
            <button 
              type="button"
              onClick={() => setShowAddEvent(!showAddEvent)}
              className="bg-[#2f4f4f] text-white px-6 py-3 rounded-2xl font-bold hover:bg-slate-800 transition-all flex items-center gap-2 shadow-lg"
            >
              {showAddEvent ? 'Batal' : '➕ Tambah Acara Baru'}
            </button>
        </div>
      )}

      {showAddEvent && !isSingleView && isAdmin && (
        <div className="bg-white p-8 rounded-3xl border-2 border-dashed border-slate-200 mb-8 animate-in zoom-in duration-300 shadow-sm">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-500">Nama Acara</label>
                <input 
                  className="w-full px-5 py-3 rounded-2xl border-2 border-slate-100 focus:border-[#8b4513] outline-none"
                  placeholder="Misal: Pelantikan Penegak"
                  value={newEvent.title}
                  onChange={e => setNewEvent({...newEvent, title: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-500">Tanggal Pelaksanaan</label>
                <input 
                  type="date"
                  className="w-full px-5 py-3 rounded-2xl border-2 border-slate-100 focus:border-[#8b4513] outline-none"
                  value={newEvent.date}
                  onChange={e => setNewEvent({...newEvent, date: e.target.value})}
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-bold text-slate-500">Deskripsi Singkat</label>
                <textarea 
                  className="w-full px-5 py-3 rounded-2xl border-2 border-slate-100 focus:border-[#8b4513] outline-none h-24"
                  placeholder="Ceritakan gambaran kegiatan ini..."
                  value={newEvent.description}
                  onChange={e => setNewEvent({...newEvent, description: e.target.value})}
                />
              </div>
           </div>
           <button 
             type="button"
             onClick={() => {
               if(newEvent.title && newEvent.date) {
                 onAddEvent(newEvent);
                 setNewEvent({ title: '', date: '', description: '' });
                 setShowAddEvent(false);
               }
             }}
             className="mt-6 w-full py-4 bg-[#8b4513] text-[#daa520] font-bold rounded-2xl text-lg hover:bg-[#5d2e0a] transition-colors"
           >
             Buat Acara Baru
           </button>
        </div>
      )}

      {events.map((event) => (
        <div key={event.id} className="space-y-4 animate-in fade-in duration-500">
          <div className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-[#8b4513] text-[#daa520] rounded-t-3xl shadow-xl">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-2xl">⚜️</div>
               <div>
                  <h3 className="text-xl font-bold uppercase tracking-wide text-white">{event.title}</h3>
                  <p className="text-sm text-white/70">{new Date(event.date).toLocaleDateString('id-ID', { dateStyle: 'full' })}</p>
               </div>
            </div>
            <div className="flex items-center gap-2 mt-4 md:mt-0">
               {isAdmin && (
                 <>
                  <button 
                    type="button"
                    disabled={isLoadingAI}
                    onClick={() => handleAIPlanning(event)}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold uppercase tracking-widest border border-white/20 transition-colors flex items-center gap-2 text-white"
                  >
                    ✨ {isLoadingAI ? 'Saran AI...' : 'AI Planner'}
                  </button>
                  <button 
                    type="button"
                    onClick={() => onAddBoard(event.id)}
                    className="px-4 py-2 bg-[#daa520] text-[#8b4513] rounded-xl text-xs font-bold uppercase tracking-widest transition-colors shadow-sm"
                  >
                    ➕ Kolom
                  </button>
                  <button 
                    type="button"
                    onClick={() => onDeleteEvent(event.id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-red-700 transition-colors shadow-md"
                  >
                    Hapus Acara
                  </button>
                 </>
               )}
            </div>
          </div>

          <div className="flex flex-nowrap overflow-x-auto pb-6 gap-6 scroll-smooth scrollbar-hide min-h-[300px]">
            {event.boards.map((board) => (
              <div key={board.id} className={`flex-shrink-0 transition-all duration-300 ${board.isOpen ? 'w-80' : 'w-16'}`}>
                <div className={`bg-white rounded-3xl border border-slate-200 shadow-sm h-full flex flex-col overflow-hidden ${!board.isOpen ? 'bg-slate-100' : ''}`}>
                  <div className={`p-4 flex items-center justify-between border-b border-slate-100 ${!board.isOpen ? 'h-full flex-col py-8' : ''}`}>
                    {board.isOpen ? (
                      <>
                        <input 
                           disabled={!isAdmin}
                           className="font-bold text-slate-700 truncate bg-transparent border-none focus:outline-none focus:text-[#8b4513] w-40 disabled:opacity-100"
                           value={board.name}
                           onChange={(e) => updateBoardName(event.id, board.id, e.target.value)}
                        />
                        <div className="flex items-center gap-1">
                          {isAdmin && (
                            <button 
                              type="button" 
                              onClick={() => onDeleteBoard(event.id, board.id)} 
                              title="Hapus Kolom" 
                              className="text-xs text-red-400 hover:text-red-600 p-1 bg-red-50 rounded-lg"
                            >
                              🗑️
                            </button>
                          )}
                          <button type="button" onClick={() => onToggleBoard(event.id, board.id)} title="Tutup Kolom" className="text-slate-400 p-1">⬅️</button>
                        </div>
                      </>
                    ) : (
                      <button type="button" onClick={() => onToggleBoard(event.id, board.id)} title="Buka Kolom" className="h-full flex flex-col items-center justify-start space-y-4">
                        <span className="font-bold text-slate-400 uppercase tracking-widest [writing-mode:vertical-lr] text-xs py-2">{board.name}</span>
                        <span className="text-slate-400">➡️</span>
                      </button>
                    )}
                  </div>
                  
                  {board.isOpen && (
                    <div className="flex-1 p-4 space-y-4 max-h-[600px] overflow-y-auto bg-slate-50/50 scrollbar-hide">
                      {board.tasks.map((task) => (
                        <div key={task.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 group hover:shadow-md transition-all relative">
                           <div className="flex justify-between items-start mb-2">
                               <div className="flex-1 mr-2">
                                 <input 
                                   disabled={!isAdmin}
                                   onClick={(e) => e.stopPropagation()}
                                   className="font-bold text-slate-800 bg-transparent outline-none focus:text-[#8b4513] w-full disabled:opacity-100 text-sm"
                                   value={task.title}
                                   onChange={(e) => onUpdateTask(event.id, board.id, task.id, { title: e.target.value })}
                                 />
                               </div>
                               {isAdmin && (
                                 <button 
                                   type="button"
                                   onClick={(e) => {
                                     e.preventDefault();
                                     e.stopPropagation();
                                     onDeleteTask(event.id, board.id, task.id);
                                   }}
                                   className="bg-red-500 text-white w-6 h-6 flex items-center justify-center rounded-lg shadow hover:bg-red-700 transition-colors flex-shrink-0"
                                   title="Hapus Tugas"
                                 >
                                   <span className="text-[12px] pointer-events-none">✕</span>
                                 </button>
                               )}
                           </div>
                           <textarea 
                             disabled={!isAdmin}
                             onClick={(e) => e.stopPropagation()}
                             className="text-xs text-slate-500 w-full bg-transparent outline-none resize-none mb-3 h-12 scrollbar-hide disabled:opacity-100"
                             value={task.description}
                             onChange={(e) => onUpdateTask(event.id, board.id, task.id, { description: e.target.value })}
                             placeholder="Tambah deskripsi..."
                           />
                           <div className="flex justify-between items-center pt-3 border-t border-slate-50">
                             <select 
                               disabled={!isAdmin}
                               onClick={(e) => e.stopPropagation()}
                               className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-transparent outline-none hover:text-[#8b4513] disabled:opacity-100 cursor-pointer"
                               value={task.status}
                               onChange={(e) => onUpdateTask(event.id, board.id, task.id, { status: e.target.value as TaskStatus })}
                             >
                                <option value="Belum Dimulai">Belum Dimulai</option>
                                <option value="Dalam Proses">Dalam Proses</option>
                                <option value="Selesai">Selesai</option>
                                <option value="Terkendala">Terkendala</option>
                             </select>
                             <div className="flex items-center gap-1">
                                <span className="text-[10px] text-slate-400">PIC:</span>
                                <select 
                                  disabled={!isAdmin}
                                  onClick={(e) => e.stopPropagation()}
                                  className="text-[10px] font-bold bg-slate-100 rounded px-1 max-w-[80px] truncate disabled:opacity-100"
                                  value={task.assigneeId}
                                  onChange={(e) => onUpdateTask(event.id, board.id, task.id, { assigneeId: e.target.value })}
                                >
                                  {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                                </select>
                             </div>
                           </div>
                        </div>
                      ))}
                      {isAdmin && (
                        <button 
                          type="button"
                          onClick={() => onAddTask(event.id, board.id)}
                          className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 text-sm font-bold hover:border-[#8b4513] hover:text-[#8b4513] transition-all bg-white/50"
                        >
                          + Tambah Kartu
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {event.boards.length === 0 && (
                <div className="py-20 px-10 border-2 border-dashed border-slate-200 rounded-3xl w-full text-center text-slate-400 flex flex-col items-center">
                    <span className="text-4xl mb-4">⚜️</span>
                    <p className="font-medium">Belum ada kolom Kanban.</p>
                    {isAdmin && (
                      <button 
                        type="button"
                        onClick={() => onAddBoard(event.id)}
                        className="mt-4 text-[#8b4513] font-bold underline"
                      >
                        Klik untuk membuat kolom pertama
                      </button>
                    )}
                </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default EventManager;
