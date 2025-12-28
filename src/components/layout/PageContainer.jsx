import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';

export default function PageContainer({ children }) {
  const location = useLocation();

  const navItems = [
    { label: 'HOME', path: '/' },
    { label: 'PLAY', path: '/play' },
    { label: 'PULSE', path: '/pulse' },
    { label: 'COLLECT', path: '/collect' },
  ];

  return (
    <div className="h-screen w-full bg-slate-950 flex flex-col overflow-hidden relative">
      {/* GLOBAL HEADER (Visible on Mobile & Desktop) */}
      <header className="h-14 md:h-16 shrink-0 flex items-center justify-between px-4 md:px-6 border-b border-white/5 bg-slate-950/50 backdrop-blur-md z-50">
        
        {/* Logo */}
        <div className="flex items-center gap-2">
           <img src="/Beta-logo.png" alt="NBA REPLAY" className="h-6 md:h-8 w-auto object-contain" />
        </div>

        {/* Navigation (Compact on Mobile) */}
        <nav className="flex items-center gap-1 bg-black/20 p-1 rounded-full border border-white/5 backdrop-blur-sm">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.label}
                to={item.path}
                className={`px-3 md:px-5 py-1 md:py-1.5 rounded-full text-[9px] md:text-[10px] font-black tracking-widest md:tracking-[0.2em] transition-all duration-300 ${
                  isActive 
                    ? 'bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.3)]' 
                    : 'text-slate-500 hover:text-white hover:bg-white/5'
                }`}
              >
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        {/* User Status (Simplified on Mobile) */}
        <div className="hidden md:flex items-center gap-4">
            <div className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800 flex items-center gap-2">
                <span className="text-[9px] text-purple-400 font-black tracking-wider">VIP 1</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
                <svg className="w-4 h-4 text-slate-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
            </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 min-h-0 relative z-0 flex flex-col">
        {children}
      </main>
    </div>
  );
}