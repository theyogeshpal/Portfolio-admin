import React, { useEffect, useState } from 'react';
import api from '../api';
import { FolderKanban, Briefcase, GraduationCap, Mail } from 'lucide-react';

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

  if (loading) return <div>Loading dashboard...</div>;

  const stats = [
    { label: 'Total Projects', value: data?.projects?.length || 0, icon: <FolderKanban />, color: '#6366f1' },
    { label: 'Work Experience', value: data?.experience?.length || 0, icon: <Briefcase />, color: '#10b981' },
    { label: 'Education', value: data?.education?.length || 0, icon: <GraduationCap />, color: '#f59e0b' },
    { label: 'New Messages', value: data?.messages?.length || 0, icon: <Mail />, color: '#ef4444' },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: '24px' }}>Dashboard Overview</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
        {stats.map((stat, index) => (
          <div key={index} style={{ 
            padding: '24px', 
            borderRadius: '12px', 
            backgroundColor: '#f1f5f9',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ color: stat.color, marginBottom: '12px' }}>{stat.icon}</div>
            <p style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: 500 }}>{stat.label}</p>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{stat.value}</h3>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '40px' }}>
        <h3>Quick Links</h3>
        <p style={{ color: '#64748b' }}>Select a category from the sidebar to manage your portfolio content.</p>
      </div>
    </div>
  );
};

export default Dashboard;
