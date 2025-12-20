import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Gamepad2 } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="fixed bottom-0 left-0 w-full bg-slate-900 border-t border-slate-800 h-16 flex justify-around items-center z-50">
      <NavLink to="/" className={({isActive}) => isActive ? "text-blue-500" : "text-slate-500"}>
        <Home size={24} />
      </NavLink>
      <NavLink to="/play" className={({isActive}) => isActive ? "text-blue-500" : "text-slate-500"}>
        <Gamepad2 size={24} />
      </NavLink>
    </nav>
  );
}