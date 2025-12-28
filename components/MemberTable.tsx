
import React, { useState } from 'react';
import { Member, MemberRole } from '../types';
import { SCOUT_ROLES } from '../constants';

interface MemberTableProps {
  members: Member[];
  onAdd: (m: Omit<Member, 'id'>) => void;
  onDelete: (id: string) => void;
  isAdmin: boolean;
}

const MemberTable: React.FC<MemberTableProps> = ({ members, onAdd, onDelete, isAdmin }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [newMember, setNewMember] = useState({ name: '', role: 'Anggota Aktif' as MemberRole, rank: 'Penegak Bantara' });

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
        <h3 className="font-bold text-lg">Manajemen Anggota</h3>
        {isAdmin && (
          <button 
            type="button"
            onClick={() => setShowAdd(!showAdd)}
            className="px-4 py-2 bg-[#8b4513] text-white rounded-xl text-sm font-semibold hover:bg-[#5d2e0a] transition-colors flex items-center gap-2"
          >
            {showAdd ? 'Batal' : '➕ Tambah Anggota'}
          </button>
        )}
      </div>

      {showAdd && isAdmin && (
        <div className="p-6 bg-amber-50/50 border-b border-amber-100 grid grid-cols-1 md:grid-cols-4 gap-4 animate-in slide-in-from-top duration-300">
          <input 
            type="text" 
            placeholder="Nama Lengkap" 
            className="px-4 py-2 rounded-xl border border-amber-200 focus:outline-none focus:ring-2 focus:ring-[#8b4513]"
            value={newMember.name}
            onChange={(e) => setNewMember({...newMember, name: e.target.value})}
          />
          <select 
            className="px-4 py-2 rounded-xl border border-amber-200 focus:outline-none focus:ring-2 focus:ring-[#8b4513]"
            value={newMember.role}
            onChange={(e) => setNewMember({...newMember, role: e.target.value as MemberRole})}
          >
            {SCOUT_ROLES.map(role => <option key={role} value={role}>{role}</option>)}
          </select>
          <input 
            type="text" 
            placeholder="Tingkatan (Misal: Laksana)" 
            className="px-4 py-2 rounded-xl border border-amber-200 focus:outline-none focus:ring-2 focus:ring-[#8b4513]"
            value={newMember.rank}
            onChange={(e) => setNewMember({...newMember, rank: e.target.value})}
          />
          <button 
            type="button"
            onClick={() => {
              if (newMember.name) {
                onAdd(newMember);
                setNewMember({ name: '', role: 'Anggota Aktif', rank: 'Penegak Bantara' });
                setShowAdd(false);
              }
            }}
            className="bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-colors"
          >
            Simpan Anggota
          </button>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500 uppercase text-xs font-bold tracking-wider">
            <tr>
              <th className="px-6 py-4">Nama</th>
              <th className="px-6 py-4">Jabatan</th>
              <th className="px-6 py-4">Tingkatan</th>
              {isAdmin && <th className="px-6 py-4 text-center">Aksi</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {members.map((member) => (
              <tr key={member.id} className="hover:bg-slate-50 transition-colors group">
                <td className="px-6 py-4 font-medium text-slate-900">{member.name}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    member.role === 'Pradana' ? 'bg-amber-100 text-amber-700' :
                    member.role === 'Sekretaris' ? 'bg-blue-100 text-blue-700' :
                    'bg-slate-100 text-slate-600'
                  }`}>
                    {member.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-500">{member.rank}</td>
                {isAdmin && (
                  <td className="px-6 py-4 text-center">
                    <button 
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onDelete(member.id);
                      }}
                      className="bg-red-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md hover:bg-red-700 hover:shadow-lg active:scale-95"
                    >
                      Hapus
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {members.length === 0 && (
        <div className="p-20 text-center text-slate-400">
          Belum ada data anggota.
        </div>
      )}
    </div>
  );
};

export default MemberTable;
