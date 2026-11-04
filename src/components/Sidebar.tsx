import { Page } from '../types';
import { LayoutDashboard, CheckSquare, Calendar, BookOpen, Lightbulb, Target, Menu, X } from 'lucide-react';
import { useState } from 'react';

interface SidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

const navItems: { page: Page; label: string; icon: React.ReactNode }[] = [
  { page: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  { page: 'tasks', label: 'Tasks', icon: <CheckSquare size={20} /> },
  { page: 'calendar', label: 'Calendar', icon: <Calendar size={20} /> },
  { page: 'journal', label: 'Journal', icon: <BookOpen size={20} /> },
  { page: 'ideas', label: 'Ideas', icon: <Lightbulb size={20} /> },
  { page: 'plans', label: 'Plans', icon: <Target size={20} /> },
];

export default function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden bg-slate-800 text-white p-2 rounded-lg shadow-lg"
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-slate-900 border-r border-slate-700 z-40 transform transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
            LifeOS
          </h1>
          <p className="text-slate-400 text-sm mt-1">Personal Dashboard</p>
        </div>

        <nav className="px-3">
          {navItems.map((item) => (
            <button
              key={item.page}
              onClick={() => {
                onNavigate(item.page);
                setMobileOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-all duration-200 ${
                currentPage === item.page
                  ? 'bg-violet-600/20 text-violet-300 border border-violet-500/30'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="absolute bottom-6 left-6 right-6">
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <p className="text-slate-300 text-sm font-medium">💡 Quick Tip</p>
            <p className="text-slate-500 text-xs mt-1">
              All data is saved locally in your browser.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
