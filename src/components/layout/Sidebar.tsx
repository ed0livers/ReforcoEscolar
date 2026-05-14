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
    <aside className="w-64 bg-[#eef2ff] border-r border-[#e0e7ff] flex flex-col py-6">
      <Link to="/" className="px-6 mb-10 block hover:opacity-80 transition-opacity">
        <div className="logo-container scale-75 origin-left !gap-3">
          <div className="logo-icon">
            <div className="circle !w-12 !h-12 after:!text-xl">
              <span className="plus-badge !w-5 !h-5 !text-xs !-top-1 !-right-1">+</span>
            </div>
          </div>
          <div className="logo-text">
            <h1 className="!text-lg !text-[#1e1b4b]">
              <span className="!text-[#4f46e5]">Edu</span><span className="!text-[#8ea2ff]">Gest</span><span className="plus-accent">+</span>
            </h1>
            <p className="logo-tagline !text-[8px] !tracking-tighter opacity-60">Gestão Acadêmica</p>
          </div>
        </div>
      </Link>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const isActive = currentSection === item.id;
          return (
            <Link 
              key={item.id}
              to={item.path}
              className={`w-full flex items-center gap-3 px-6 py-4 transition-all text-sm font-bold ${isActive ? 'bg-white border-y border-[#e0e7ff] text-[#4f46e5]' : 'text-[#1e1b4b]/60 hover:bg-white/50'}`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? 'text-[#4f46e5]' : 'text-[#8fa88e]'}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
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
