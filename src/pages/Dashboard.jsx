import React, { useEffect, useState } from 'react';
import api from '../api';
import { FolderKanban, Briefcase, GraduationCap, Mail, Loader2 } from 'lucide-react';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await api.get('/api/portfolio-data');
        setData(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 text-slate-500 font-medium">
        <Loader2 className="animate-spin text-primary" size={40} />
        <p>Initializing your dashboard...</p>
      </div>
    );
  }

  const stats = [
    { label: 'Total Projects', value: data?.projects?.length || 0, icon: <FolderKanban size={24} />, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Work Experience', value: data?.experience?.length || 0, icon: <Briefcase size={24} />, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Education', value: data?.education?.length || 0, icon: <GraduationCap size={24} />, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'New Messages', value: data?.messages?.length || 0, icon: <Mail size={24} />, color: 'text-rose-600', bg: 'bg-rose-50' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Dashboard Overview</h2>
        <p className="text-slate-500 text-sm">A quick snapshot of your portfolio performance</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center mb-4`}>
              {stat.icon}
            </div>
            <p className="text-sm font-semibold text-slate-500 mb-1">{stat.label}</p>
            <h3 className="text-3xl font-bold text-slate-800 tracking-tight">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="mt-8 p-8 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col items-center text-center">
        <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-4 text-primary">
          <FolderKanban size={32} />
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">Welcome to your Portfolio Admin</h3>
        <p className="text-slate-500 max-w-lg leading-relaxed">
          Use the sidebar to manage your projects, update your work experience, or reply to inbound messages. Everything you change here will reflect instantly on your live portfolio.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
