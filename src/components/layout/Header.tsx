import React from 'react';
import { Link } from 'react-router-dom';
import { Bell, User, Settings } from 'lucide-react';

interface HeaderProps {
  title: string;
  userEmail: string;
}

export const Header = ({ title, userEmail }: HeaderProps) => {
  return (
    <header className="h-20 border-b border-[#e0e7ff] flex items-center justify-between px-8 bg-[#fbfbfe]/80 backdrop-blur-md sticky top-0 z-30">
      <h1 className="text-2xl font-bold text-[#1e1b4b] tracking-tight">{title}</h1>
      
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3 pr-6 border-r border-[#e0e7ff]">
          <div className="w-10 h-10 rounded-xl bg-[#eef2ff] flex items-center justify-center text-[#4f46e5] shadow-inner">
            <User className="w-5 h-5" />
          </div>
          <div className="hidden sm:block">
            <p className="text-[10px] uppercase font-bold text-[#94a3b8] tracking-wider">Usuário Ativo</p>
            <p className="text-sm font-bold text-[#1e1b4b] leading-tight">{userEmail}</p>
          </div>
        </div>
        
        <Link to="/configuracoes">
          <button className="p-2.5 text-[#94a3b8] hover:text-[#4f46e5] hover:bg-[#eef2ff] rounded-xl transition-all">
            <Settings className="w-5 h-5" />
          </button>
        </Link>
      </div>
    </header>
  );
};
