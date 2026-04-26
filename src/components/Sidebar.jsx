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
    <aside className={`sidebar ${isOpen ? 'active' : ''}`}>
      <div className="sidebar-header">
        <h2>Admin Panel</h2>
        <p>Portfolio Manager</p>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink 
            key={item.path} 
            to={item.path} 
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            onClick={closeSidebar}
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <button className="logout-btn" onClick={handleLogout}>
        <LogOut size={20} />
        <span>Logout</span>
      </button>
    </aside>
  );
};

export default Sidebar;
