import React from 'react';
import { NavLink } from 'react-router-dom';
import { Cpu, Zap, Eye, Activity, History, BookOpen } from 'lucide-react';
import { cn } from '../lib/utils';

export const Sidebar = () => {
  const items = [
    { name: 'Overview', icon: Activity, path: '/' },
    { name: 'Wiring', icon: Zap, path: '/wiring' },
    { name: 'Codes', icon: Cpu, path: '/code' },
    { name: 'Docs', icon: BookOpen, path: '/docs' },
  ];

  return (
    <aside className="fixed left-0 top-20 h-[calc(100vh-80px)] w-[320px] border-r border-white/5 bg-surface-container-low flex flex-col justify-between py-12 hidden lg:flex z-40">
      <div className="space-y-12">
        <div className="px-10 flex items-center gap-6">
          <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center">
             <Cpu className="text-zinc-400 w-5 h-5" />
          </div>
          <div>
            <p className="text-white font-medium font-display text-[10px] uppercase tracking-[0.3em]">UNIT-01</p>
            <p className="text-zinc-600 font-display text-[9px] uppercase tracking-widest mt-1">Status: <span className="text-zinc-400">NOMINAL</span></p>
          </div>
        </div>
        
        <nav className="space-y-2">
          {items.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "flex items-center px-10 py-4 font-display text-[10px] uppercase tracking-[0.4em] transition-all duration-300 gap-6",
                  isActive 
                    ? "bg-white/5 text-white border-r border-white/40" 
                    : "text-zinc-600 hover:text-white"
                )
              }
            >
              <item.icon className="w-4 h-4 opacity-50" />
              {item.name}
            </NavLink>
          ))}
        </nav>

        {/* Live Status Indicators */}
        <div className="px-10 space-y-8 pt-8 border-t border-white/5">
          <div className="space-y-3">
            <div className="flex justify-between tech-label-sm">
              <span>BATTERY</span>
              <span className="text-zinc-400">88%</span>
            </div>
            <div className="h-0.5 bg-white/5 w-full">
              <div className="h-full bg-zinc-600 w-[88%]" />
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between tech-label-sm">
              <span>SIGNAL</span>
              <span className="text-zinc-400">STABLE</span>
            </div>
            <div className="flex gap-2 h-4 items-end">
              {[1, 2, 1.5, 3, 2.5].map((h, i) => (
                <div key={i} className="flex-1 bg-white/10" style={{ height: `${h * 5}px` }} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="px-8 space-y-6">
        <button className="w-full py-4 border border-white/10 text-[9px] uppercase tracking-[0.4em] font-bold text-zinc-500 hover:bg-white hover:text-black transition-all">
          REINITIALIZE
        </button>
        <div className="flex justify-center gap-6">
          <a className="text-zinc-600 hover:text-white transition-colors" href="#">
            <History className="w-4 h-4" />
          </a>
          <a className="text-zinc-600 hover:text-white transition-colors" href="#">
            <BookOpen className="w-4 h-4" />
          </a>
        </div>
      </div>
    </aside>
  );
};
