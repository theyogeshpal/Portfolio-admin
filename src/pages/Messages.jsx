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
      const { data } = await axios.get('https://portfolio-backend-95gv.onrender.com/api/messages');
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
        await axios.delete(`https://portfolio-backend-95gv.onrender.com/api/messages/${id}`);
        setMessages(messages.filter(m => m._id !== id));
      } catch (err) {
        alert('Failed to delete message');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Inbound Messages</h2>
          <p className="text-slate-500 text-sm">Review inquiries from your portfolio visitors</p>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-slate-500 font-medium">
          <Mail className="animate-bounce" size={40} />
          <p>Fetching your messages...</p>
        </div>
      ) : messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-6 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50">
          <Mail size={48} className="text-slate-300 mb-4" />
          <h3 className="text-lg font-bold text-slate-600 mb-1">Inbox is empty</h3>
          <p className="text-slate-400 max-w-sm">No one has reached out yet. Your messages will appear here once they do.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => (
            <div key={msg._id} className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm relative group hover:shadow-md transition-all">
              <div className="flex flex-col md:flex-row justify-between gap-6 mb-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0">
                    <User size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-lg leading-tight">{msg.name}</h4>
                    <a href={`mailto:${msg.email}`} className="text-primary hover:underline text-sm font-medium inline-flex items-center gap-1.5 mt-1">
                      <Mail size={14} />
                      {msg.email}
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-slate-400 text-sm font-medium bg-slate-50 px-3 py-1.5 rounded-lg h-fit">
                  <Calendar size={16} />
                  {new Date(msg.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                </div>
              </div>

              <div className="p-5 bg-slate-50 rounded-xl border border-slate-100">
                <p className="font-bold text-slate-700 text-sm mb-2">Subject: {msg.subject || 'No Subject'}</p>
                <p className="text-slate-600 text-[0.95rem] leading-relaxed whitespace-pre-wrap">{msg.message}</p>
              </div>

              <button 
                onClick={() => deleteMessage(msg._id)}
                className="absolute top-6 right-6 p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                title="Delete Message"
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
