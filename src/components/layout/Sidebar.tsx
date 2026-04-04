import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, LogOut, LucideIcon } from 'lucide-react';

interface NavItem {
  id: string;
  path: string;
  label: string;
  icon: LucideIcon;
}

interface SidebarProps {
  navItems: NavItem[];
  currentSection: string;
  unitName?: string;
  handleLogout: () => void;
}

export const Sidebar = ({ navItems, currentSection, unitName, handleLogout }: SidebarProps) => {
  return (
    <aside className="w-64 bg-[#feebff] border-r border-purple-100 flex flex-col py-6">
      <div className="px-6 mb-10 flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-md shadow-purple-100 border border-purple-50 shrink-0">
           <GraduationCap className="text-[#8126cf] w-7 h-7" />
        </div>
        <div className="overflow-hidden">
          <h2 className="font-bold text-[#3e2548] leading-tight truncate text-sm">{unitName || 'Reforço Escolar'}</h2>
          <p className="text-[10px] uppercase font-bold text-[#b08cc2]">Gestão Acadêmica</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => (
          <Link 
            key={item.id}
            to={item.path}
            className={`w-full flex items-center gap-3 px-6 py-4 transition-all text-sm font-bold ${currentSection === item.id ? 'bg-white border-y border-purple-100 text-[#8126cf]' : 'text-[#6e5177] hover:bg-white/50'}`}
          >
            <item.icon className={`w-5 h-5 ${currentSection === item.id ? 'text-[#8126cf]' : 'text-[#b08cc2]'}`} />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="mt-auto px-4">
        <button 
          onClick={handleLogout} 
          className="flex items-center gap-3 px-6 py-4 text-red-500 hover:bg-red-50 w-full rounded-2xl transition-all font-bold text-sm"
        >
          <LogOut className="w-5 h-5" />
          <span>Sair</span>
        </button>
      </div>
    </aside>
  );
};
