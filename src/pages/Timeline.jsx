import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Trash2, History, Plus, Loader2, Edit3, Image as ImageIcon, Camera } from 'lucide-react';
import Modal from '../components/Modal';

const Timeline = () => {
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [uploading, setUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    year: '',
    title: '',
    description: '',
    image: ''
  });

  useEffect(() => {
    fetchTimeline();
  }, []);

  const fetchTimeline = async () => {
    try {
      const { data } = await axios.get('https://portfolio-backend-95gv.onrender.com/api/portfolio-data');
      setTimeline(data.timeline);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const uploadData = new FormData();
    uploadData.append('image', file);

    try {
      const { data } = await axios.post('https://portfolio-backend-95gv.onrender.com/api/upload', uploadData);
      setFormData({ ...formData, image: data.url });
    } catch (err) {
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`https://portfolio-backend-95gv.onrender.com/api/timeline/${editId}`, formData);
      } else {
        await axios.post('https://portfolio-backend-95gv.onrender.com/api/timeline', formData);
      }
      setIsModalOpen(false);
      resetForm();
      fetchTimeline();
    } catch (err) {
      alert('Error saving timeline item');
    }
  };

  const resetForm = () => {
    setFormData({ year: '', title: '', description: '', image: '' });
    setEditId(null);
  };

  const handleEdit = (item) => {
    setFormData({
      year: item.year,
      title: item.title,
      description: item.description,
      image: item.image || ''
    });
    setEditId(item._id);
    setIsModalOpen(true);
  };

  const deleteItem = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await axios.delete(`https://portfolio-backend-95gv.onrender.com/api/timeline/${id}`);
        setTimeline(timeline.filter(t => t._id !== id));
      } catch (err) {
        alert('Error deleting');
      }
    }
  };

  const getImageUrl = (url) => {
    if (typeof url !== 'string' || !url) return '';
    if (url.startsWith('http')) return url;
    
    // Legacy paths
    const cleanUrl = url.replace('./', '').replace('images/', '');
    
    // New uploads
    if (!url.includes('/')) {
        return `https://portfolio-backend-95gv.onrender.com/uploads/${cleanUrl}`;
    }
    
    // Portfolio assets
    return `https://yogesh-pal.netlify.app/images/${cleanUrl}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Timeline & Certificates</h2>
          <p className="text-slate-500 text-sm">Chronological list of milestones and achievements</p>
        </div>
        <button 
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-primary/20 transition-all active:scale-95"
        >
          <Plus size={20} /> Add Item
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="animate-spin text-primary" size={40} />
          <p className="text-slate-500 font-medium">Loading timeline...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {timeline.map((item) => (
            <div key={item._id} className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start gap-6 hover:shadow-md transition-all group">
              <div className="w-24 h-16 bg-slate-50 rounded-xl overflow-hidden flex-shrink-0 border border-slate-100 group-hover:border-primary/30 transition-all">
                {item.image ? (
                  <img src={getImageUrl(item.image)} alt="cert" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors">
                    <History size={24} />
                  </div>
                )}
              </div>
              
              <div className="flex-1 w-full">
                <div className="flex justify-between items-start gap-4 mb-2">
                  <h4 className="text-lg font-bold text-slate-800 leading-tight">{item.title}</h4>
                  <span className="text-primary font-bold text-sm whitespace-nowrap">{item.year}</span>
                </div>
                <p className="text-slate-500 text-sm leading-relaxed mb-4">{item.description}</p>
                <div className="flex items-center gap-4 pt-4 border-t border-slate-50">
                  <button 
                    onClick={() => handleEdit(item)}
                    className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-primary transition-colors"
                  >
                    <Edit3 size={14} /> Edit
                  </button>
                  <button 
                    onClick={() => deleteItem(item._id)}
                    className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editId ? "Edit Timeline Item" : "Add Timeline Item"}>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Title / Certificate Name</label>
            <input 
              type="text" 
              required 
              value={formData.title} 
              onChange={e => setFormData({...formData, title: e.target.value})} 
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none"
              placeholder="E.g. Certified Cloud Architect"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Year</label>
            <input 
              type="text" 
              required 
              value={formData.year} 
              onChange={e => setFormData({...formData, year: e.target.value})} 
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none"
              placeholder="E.g. 2023"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Description</label>
            <textarea 
              rows="3" 
              value={formData.description} 
              onChange={e => setFormData({...formData, description: e.target.value})} 
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none resize-none"
              placeholder="Briefly explain this milestone..."
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Certificate Image</label>
            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="w-24 h-16 bg-white border border-slate-200 rounded-xl overflow-hidden shrink-0 shadow-sm">
                {formData.image ? (
                  <img src={getImageUrl(formData.image)} className="w-full h-full object-cover" alt="preview" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300">
                    <ImageIcon size={20} />
                  </div>
                )}
              </div>
              <label className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 cursor-pointer hover:bg-slate-50 hover:border-primary/50 transition-all">
                {uploading ? <Loader2 className="animate-spin" size={16} /> : <Camera size={16} />}
                {formData.image ? 'Change Image' : 'Upload Image'}
                <input type="file" className="hidden" onChange={handleImageUpload} />
              </label>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button 
              type="button" 
              onClick={() => setIsModalOpen(false)}
              className="flex-1 px-6 py-3 border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-all"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="flex-1 bg-primary text-white font-bold py-3 rounded-xl shadow-lg shadow-primary/20 hover:bg-primary-hover transition-all"
            >
              {editId ? 'Update Item' : 'Save Item'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Timeline;
