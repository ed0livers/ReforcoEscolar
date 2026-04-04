import React from 'react';
import { Link } from 'react-router-dom';
import { Bell } from 'lucide-react';

interface HeaderProps {
  title: string;
  userEmail: string;
}

export const Header = ({ title, userEmail }: HeaderProps) => {
  return (
    <header className="h-16 bg-white border-b border-purple-100 px-8 flex items-center justify-between sticky top-0 z-30">
      <h1 className="text-xl font-black">{title}</h1>
      <div className="flex items-center gap-4">
        <button className="p-2 text-purple-300 hover:bg-purple-50 rounded-full transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-400 rounded-full border-2 border-white"></span>
        </button>
        <div className="h-4 w-px bg-purple-100"></div>
        <Link to="/configuracoes" className="flex items-center gap-3 hover:bg-purple-50/50 p-2 rounded-2xl transition-all group">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-black group-hover:text-[#8126cf] transition-colors">{userEmail}</p>
            <p className="text-[10px] text-purple-300 font-bold uppercase">Adm • Configurações</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center font-black text-purple-600 border-2 border-white shadow-sm group-hover:scale-105 transition-transform">
            {userEmail.substring(0, 2).toUpperCase()}
          </div>
        </Link>
      </div>
    </header>
  );
};
