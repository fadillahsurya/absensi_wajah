
import React from 'react';
import { Home, Calendar, MessageSquare, User, Briefcase } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { icon: Home, label: 'Beranda', path: '/' },
  { icon: Briefcase, label: 'Layanan', path: '/services' },
  { icon: Calendar, label: 'Jadwal', path: '/schedule' },
  { icon: MessageSquare, label: 'Bantuan', path: '/chat' },
  { icon: User, label: 'Profil', path: '/profile' },
];

export const Layout: React.FC<{ children: React.ReactNode; title?: string }> = ({ children, title }) => {
  const location = useLocation();

  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto bg-gray-50 shadow-xl overflow-hidden relative">
      {/* Header */}
      <header className="bg-indigo-600 text-white p-4 sticky top-0 z-40 shadow-md">
        <h1 className="text-xl font-bold">{title || 'HRIS Pro'}</h1>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-24 no-scrollbar">
        {children}
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-gray-200 flex justify-around items-center py-2 px-1 z-50 safe-area-bottom shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link 
              key={item.path} 
              to={item.path} 
              className={`flex flex-col items-center p-2 rounded-xl transition-all ${isActive ? 'text-indigo-600' : 'text-gray-400'}`}
            >
              <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] mt-1 font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};
