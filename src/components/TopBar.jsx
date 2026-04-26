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
    <header className="top-bar">
      <div className="top-bar-left">
        <div className="search-box">
          <Search size={18} />
          <input type="text" placeholder="Search anything..." />
        </div>
      </div>

      <div className="top-bar-right">
        <div className="date-info">
          <Calendar size={18} />
          <span>{today}</span>
        </div>
        
        <button className="icon-btn">
          <Bell size={20} />
          <span className="badge"></span>
        </button>

        <div className="profile-info">
          <div className="profile-text">
            <span className="profile-name">Yogesh Pal</span>
            <span className="profile-role">Administrator</span>
          </div>
          <div className="profile-avatar">
            <User size={20} color="#fff" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
