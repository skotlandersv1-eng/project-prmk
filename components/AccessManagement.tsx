
import React from 'react';
import { Member, MemberRole } from '../types';
import { SCOUT_ROLES } from '../constants';

interface AccessManagementProps {
  members: Member[];
  onUpdateMember: (id: string, updates: Partial<Member>) => void;
  isAdmin: boolean;
}

const AccessManagement: React.FC<AccessManagementProps> = ({ members, onUpdateMember, isAdmin }) => {
  if (!isAdmin) {
    return (
      <div className="bg-red-50 p-10 rounded-3xl border border-red-100 text-center">
        <span className="text-4xl mb-4 block">🚫</span>
        <h3 className="text-xl font-bold text-red-700">Akses Ditolak</h3>
        <p className="text-red-500">Hanya administrator yang dapat mengakses menu manajemen izin.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-6 border-b border-slate-100 bg-slate-50/50">
        <h3 className="font-bold text-lg flex items-center gap-2">
          <span className="text-xl">🔐</span> Manajemen Izin & Jabatan
        </h3>
        <p className="text-sm text-slate-500">Atur jabatan anggota untuk menentukan wewenang dalam organisasi.</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500 uppercase text-xs font-bold tracking-wider">
            <tr>
              <th className="px-6 py-4">Anggota</th>
              <th className="px-6 py-4">Jabatan Saat Ini</th>
              <th className="px-6 py-4">Ubah Jabatan</th>
              <th className="px-6 py-4">Status Akses</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {members.map((member) => (
              <tr key={member.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-medium text-slate-900">{member.name}</div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{member.rank}</div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    member.role === 'Pradana' ? 'bg-amber-100 text-amber-700' :
                    member.role === 'Sekretaris' ? 'bg-blue-100 text-blue-700' :
                    'bg-slate-100 text-slate-600'
                  }`}>
                    {member.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <select 
                    className="text-xs bg-white border border-slate-200 rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-[#8b4513]"
                    value={member.role}
                    onChange={(e) => onUpdateMember(member.id, { role: e.target.value as MemberRole })}
                  >
                    {SCOUT_ROLES.map(role => <option key={role} value={role}>{role}</option>)}
                  </select>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${['Pradana', 'Sekretaris', 'Bendahara'].includes(member.role) ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                    <span className="text-xs text-slate-600">
                      {['Pradana', 'Sekretaris', 'Bendahara'].includes(member.role) ? 'Izin Editor' : 'Izin Viewer'}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AccessManagement;
