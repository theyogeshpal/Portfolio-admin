import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Trash2, User, Mail, Calendar } from 'lucide-react';

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/messages');
      setMessages(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteMessage = async (id) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      try {
        await axios.delete(`http://localhost:5000/api/messages/${id}`);
        setMessages(messages.filter(m => m._id !== id));
      } catch (err) {
        alert('Failed to delete message');
      }
    }
  };

  return (
    <div>
      <h2 style={{ marginBottom: '24px' }}>Inbound Messages</h2>

      {loading ? (
        <p>Loading messages...</p>
      ) : messages.length === 0 ? (
        <div style={{ padding: '40px', textAlign: 'center', backgroundColor: '#f8fafc', borderRadius: '12px', border: '2px dashed #e2e8f0' }}>
          <p style={{ color: '#64748b' }}>No messages received yet.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {messages.map((msg) => (
            <div key={msg._id} style={{ 
              padding: '24px', 
              border: '1px solid #e2e8f0', 
              borderRadius: '12px', 
              backgroundColor: '#fff',
              position: 'relative'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, fontSize: '1.1rem' }}>
                    <User size={18} /> {msg.name}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '0.9rem', marginTop: '4px' }}>
                    <Mail size={16} /> {msg.email}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8', fontSize: '0.85rem' }}>
                  <Calendar size={16} /> {new Date(msg.createdAt).toLocaleDateString()}
                </div>
              </div>
              <div style={{ padding: '16px', backgroundColor: '#f1f5f9', borderRadius: '8px' }}>
                <p style={{ fontWeight: 600, marginBottom: '8px' }}>Subject: {msg.subject || 'No Subject'}</p>
                <p style={{ color: '#334155', lineHeight: 1.6 }}>{msg.message}</p>
              </div>
              <button 
                onClick={() => deleteMessage(msg._id)}
                style={{ 
                  position: 'absolute', 
                  top: '24px', 
                  right: '24px', 
                  color: '#ef4444', 
                  border: 'none', 
                  background: 'none', 
                  cursor: 'pointer',
                  padding: '8px',
                  borderRadius: '6px'
                }}
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Messages;
