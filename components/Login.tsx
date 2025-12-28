
import React, { useState } from 'react';
import { ScoutLogoIcon } from '../constants';

interface LoginProps {
  onLogin: (role: 'admin' | 'user') => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'readygo') {
      onLogin('admin');
    } else if (password === 'jayazo') {
      onLogin('user');
    } else {
      setError('Kata sandi salah. Silakan coba lagi.');
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fdfaf5] p-6 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 -translate-x-1/4 -translate-y-1/4 opacity-5">
        <ScoutLogoIcon className="w-[600px] h-[600px] text-[#8b4513]" />
      </div>
      <div className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 opacity-5">
        <ScoutLogoIcon className="w-[600px] h-[600px] text-[#2f4f4f]" />
      </div>

      <div className="bg-white p-10 rounded-[40px] shadow-2xl border border-slate-100 w-full max-w-md relative z-10 animate-in zoom-in duration-500">
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 bg-[#8b4513] rounded-3xl flex items-center justify-center shadow-lg mb-4 text-[#daa520]">
            <ScoutLogoIcon className="w-12 h-12" />
          </div>
          <h1 className="text-3xl font-bold scout-title text-[#5d2e0a]">PramukaFlow</h1>
          <p className="text-slate-400 text-sm mt-2">Sistem Manajemen Ambalan SMA</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2 px-1">Kode Akses</label>
            <input 
              type="password"
              placeholder="••••••••"
              className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-[#8b4513] focus:ring-4 focus:ring-[#8b4513]/5 outline-none transition-all"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              autoFocus
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-500 text-xs font-bold p-4 rounded-xl flex items-center gap-2 animate-shake">
              ⚠️ {error}
            </div>
          )}

          <button 
            type="submit"
            className="w-full py-4 bg-[#8b4513] text-[#daa520] font-bold rounded-2xl text-lg hover:bg-[#5d2e0a] hover:shadow-xl hover:-translate-y-1 active:translate-y-0 transition-all shadow-lg"
          >
            Masuk Ke Sistem
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-slate-50 text-center">
          <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-4">Motto Kami</p>
          <p className="text-sm italic text-[#8b4513] font-medium leading-relaxed">
            "Suro Diro Jayaningrat Lebur Dening Pangastuti"
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
