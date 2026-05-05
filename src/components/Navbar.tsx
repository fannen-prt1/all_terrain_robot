import React from 'react';
import { NavLink } from 'react-router-dom';
import { Settings, Wrench, SignalHigh } from 'lucide-react';
import { cn } from '../lib/utils';

export const Navbar = () => {
  const links = [
    { name: 'Dashboard', path: '/' },
    { name: 'Hardware', path: '/hardware' },
    { name: 'Terrain', path: '/terrain' },
    { name: 'Gallery', path: '/gallery' },
  ];

  return (
    <header className="fixed top-0 w-full z-50 flex justify-between items-center px-12 h-20 bg-surface border-b border-white/5 shadow-2xl">
      <div className="flex items-center gap-12">
        <span className="text-2xl font-semibold tracking-tighter italic text-white font-display uppercase">ROBOT-X</span>
        <nav className="hidden md:flex gap-12">
          {links.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                cn(
                  "font-display tracking-[0.4em] uppercase font-medium text-[10px] transition-all pb-1",
                  isActive 
                    ? "text-white border-b border-white/40" 
                    : "text-zinc-500 hover:text-white"
                )
              }
            >
              {link.name}
            </NavLink>
          ))}
        </nav>
      </div>
      
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-6">
          <button className="text-zinc-500 hover:text-white transition-colors p-2 cursor-pointer">
            <Settings className="w-4 h-4" />
          </button>
          <button className="text-zinc-500 hover:text-white transition-colors p-2 cursor-pointer">
            <Wrench className="w-4 h-4" />
          </button>
          <button className="text-zinc-500 hover:text-white transition-colors p-2 cursor-pointer">
            <SignalHigh className="w-4 h-4" />
          </button>
        </div>
        <button className="px-8 py-3 border border-white/10 text-[10px] uppercase tracking-[0.4em] bg-white/5 hover:bg-white hover:text-black transition-all duration-500 font-bold">
          DEPLOY
        </button>
      </div>
    </header>
  );
};
