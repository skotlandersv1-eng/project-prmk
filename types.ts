
export type MemberRole = 'Pradana' | 'Sekretaris' | 'Bendahara' | 'Seksi Bidang' | 'Anggota Aktif' | 'Pembina';

export interface Member {
  id: string;
  name: string;
  role: MemberRole;
  rank: string; // e.g., Penegak Bantara, Laksana
}

export type TaskStatus = 'Belum Dimulai' | 'Dalam Proses' | 'Selesai' | 'Terkendala';

export interface KanbanTask {
  id: string;
  title: string;
  description: string;
  assigneeId: string;
  status: TaskStatus;
}

export interface KanbanBoard {
  id: string;
  name: string;
  isOpen: boolean;
  tasks: KanbanTask[];
}

export interface ScoutEvent {
  id: string;
  title: string;
  date: string;
  description: string;
  boards: KanbanBoard[];
}

export enum AppView {
  DASHBOARD = 'dashboard',
  EVENT_ROOM = 'event_room',
  MEMBERS = 'members',
  CALENDAR = 'calendar',
  MANAGE_EVENTS = 'manage_events'
}
