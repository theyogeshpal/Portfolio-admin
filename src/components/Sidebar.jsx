import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Briefcase, 
  GraduationCap, 
  History, 
  User, 
  Mail, 
  LogOut,
  FolderKanban
} from 'lucide-react';

const Sidebar = ({ isOpen, closeSidebar }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/login');
  };

  const navItems = [
    { path: '/', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { path: '/projects', icon: <FolderKanban size={20} />, label: 'Projects' },
    { path: '/experience', icon: <Briefcase size={20} />, label: 'Experience' },
    { path: '/education', icon: <GraduationCap size={20} />, label: 'Education' },
    { path: '/timeline', icon: <History size={20} />, label: 'Timeline' },
    { path: '/profile', icon: <User size={20} />, label: 'Profile' },
    { path: '/messages', icon: <Mail size={20} />, label: 'Messages' },
  ];

  return (
    <aside className={`
      fixed inset-y-0 left-0 z-[65] w-[260px] bg-[#1e293b] text-slate-400 flex flex-col p-6 transition-transform duration-300 ease-in-out
      lg:relative lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}
    `}>
      <div className="mb-8 border-b border-slate-700 pb-6">
        <h2 className="text-white text-xl font-bold">Admin Panel</h2>
        <p className="text-sm opacity-60">Portfolio Manager</p>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => (
          <NavLink 
            key={item.path} 
            to={item.path} 
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all
              ${isActive ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'hover:bg-slate-800 hover:text-white'}
            `}
            onClick={closeSidebar}
          >
            {item.icon}
            <span className="text-[0.95rem]">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <button 
        className="mt-auto flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-red-400 hover:bg-red-500/10 transition-colors" 
        onClick={handleLogout}
      >
        <LogOut size={20} />
        <span className="text-[0.95rem]">Logout</span>
      </button>
    </aside>
  );
};

export default Sidebar;
