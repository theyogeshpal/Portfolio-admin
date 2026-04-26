import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Trash2, GraduationCap, Plus, Loader2, Edit3 } from 'lucide-react';
import Modal from '../components/Modal';

const Education = () => {
  const [education, setEducation] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  
  const [formData, setFormData] = useState({
    year: '',
    title: '',
    board: '',
    description: ''
  });

  useEffect(() => {
    fetchEducation();
  }, []);

  const fetchEducation = async () => {
    try {
      const { data } = await axios.get('https://portfolio-backend-95gv.onrender.com/api/portfolio-data');
      setEducation(data.education);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`https://portfolio-backend-95gv.onrender.com/api/education/${editId}`, formData);
      } else {
        await axios.post('https://portfolio-backend-95gv.onrender.com/api/education', formData);
      }
      setIsModalOpen(false);
      resetForm();
      fetchEducation();
    } catch (err) {
      alert('Error saving education');
    }
  };

  const resetForm = () => {
    setFormData({ year: '', title: '', board: '', description: '' });
    setEditId(null);
  };

  const handleEdit = (edu) => {
    setFormData({
      year: edu.year,
      title: edu.title,
      board: edu.board,
      description: edu.description
    });
    setEditId(edu._id);
    setIsModalOpen(true);
  };

  const deleteEdu = async (id) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      try {
        await axios.delete(`https://portfolio-backend-95gv.onrender.com/api/education/${id}`);
        setEducation(education.filter(e => e._id !== id));
      } catch (err) {
        alert('Error deleting');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Education</h2>
          <p className="text-slate-500 text-sm">Manage your academic qualifications</p>
        </div>
        <button 
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-primary/20 transition-all active:scale-95"
        >
          <Plus size={20} /> Add Education
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="animate-spin text-primary" size={40} />
          <p className="text-slate-500 font-medium">Loading academic records...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {education.map((edu) => (
            <div key={edu._id} className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm relative group hover:shadow-md transition-all">
              <div className="flex gap-4 mb-6">
                <div className="w-12 h-12 shrink-0 bg-slate-50 rounded-xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  <GraduationCap size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-lg leading-tight">{edu.title}</h4>
                  <p className="text-primary font-bold text-sm uppercase tracking-wide mt-1">{edu.board}</p>
                </div>
              </div>
              
              <div className="inline-block px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold mb-4">
                {edu.year}
              </div>
              
              <p className="text-slate-600 text-sm leading-relaxed mb-6 line-clamp-3">{edu.description}</p>
              
              <div className="flex items-center gap-4 pt-4 border-t border-slate-50">
                <button 
                  onClick={() => handleEdit(edu)} 
                  className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-primary transition-colors"
                >
                  <Edit3 size={14} /> Edit
                </button>
                <button 
                  onClick={() => deleteEdu(edu._id)} 
                  className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={14} /> Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editId ? "Edit Education" : "Add Education"}>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Degree / Certificate Title</label>
            <input 
              type="text" 
              required 
              value={formData.title} 
              onChange={e => setFormData({...formData, title: e.target.value})} 
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none"
              placeholder="E.g. Bachelor of Technology"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Board / University</label>
              <input 
                type="text" 
                required 
                value={formData.board} 
                onChange={e => setFormData({...formData, board: e.target.value})} 
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                placeholder="E.g. AKTU University"
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
                placeholder="E.g. 2018 - 2022"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Description</label>
            <textarea 
              rows="4" 
              value={formData.description} 
              onChange={e => setFormData({...formData, description: e.target.value})} 
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none resize-none"
              placeholder="Describe your studies, honors, or key subjects..."
            />
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
              {editId ? 'Update Education' : 'Save Education'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Education;
