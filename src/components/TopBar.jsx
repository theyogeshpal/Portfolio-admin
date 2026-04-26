import React from 'react';
import { Bell, Search, User, Calendar } from 'lucide-react';

const TopBar = () => {
  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <header className="h-[70px] bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 shrink-0">
      <div className="hidden lg:block">
        <div className="flex items-center gap-3 bg-slate-100 px-4 py-2 rounded-xl text-slate-500 w-[300px] border border-transparent focus-within:border-primary/30 focus-within:bg-white transition-all">
          <Search size={18} />
          <input type="text" placeholder="Search anything..." className="bg-transparent border-none outline-none w-full text-sm text-slate-700" />
        </div>
      </div>

      <div className="flex items-center gap-4 lg:gap-6 ml-auto">
        <div className="hidden md:flex items-center gap-2 text-slate-500 text-sm font-medium">
          <Calendar size={18} className="text-primary" />
          <span>{today}</span>
        </div>
        
        <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-xl transition-all group">
          <Bell size={20} className="group-hover:text-primary transition-colors" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        <div className="flex items-center gap-3 pl-4 lg:pl-6 border-l border-slate-200">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-sm font-bold text-slate-800">Yogesh Pal</span>
            <span className="text-[0.7rem] text-slate-500 font-medium uppercase tracking-wider">Administrator</span>
          </div>
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 ring-2 ring-primary/10">
            <User size={20} color="#fff" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
