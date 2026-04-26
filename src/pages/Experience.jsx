import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Trash2, Briefcase, MapPin, Plus, Loader2, Edit3 } from 'lucide-react';
import Modal from '../components/Modal';

const Experience = () => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  
  const [formData, setFormData] = useState({
    year: '',
    company: '',
    position: '',
    location: '',
    description: '',
    technologies: '',
    images: []
  });

  const getImageUrl = (url) => {
    if (!isString(url)) return '';
    if (url.startsWith('http')) return url;
    
    // If it's a legacy relative path like ./images/foo.jpg or images/foo.jpg
    const cleanUrl = url.replace('./', '').replace('images/', '');
    
    // Check if it's a new upload (doesn't have a directory prefix)
    if (!url.includes('/')) {
        return `https://portfolio-backend-95gv.onrender.com/uploads/${cleanUrl}`;
    }
    
    // Otherwise it's likely a static asset from the portfolio
    return `https://yogesh-pal.netlify.app/images/${cleanUrl}`;
  };

  // Helper to check if it's a string
  function isString(x) {
    return Object.prototype.toString.call(x) === "[object String]";
  }

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    const uploadData = new FormData();
    files.forEach(file => uploadData.append('images', file));

    try {
      const { data } = await axios.post('https://portfolio-backend-95gv.onrender.com/api/upload-multiple', uploadData);
      setFormData({ ...formData, images: [...formData.images, ...data.urls] });
    } catch (err) {
      alert('Failed to upload images');
    }
  };

  useEffect(() => {
    fetchExperience();
  }, []);

  const fetchExperience = async () => {
    try {
      const { data } = await axios.get('https://portfolio-backend-95gv.onrender.com/api/portfolio-data');
      setExperiences(data.experience);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { 
        ...formData, 
        technologies: typeof formData.technologies === 'string' ? formData.technologies.split(',').map(t => t.trim()) : formData.technologies
      };
      
      if (editId) {
        await axios.put(`https://portfolio-backend-95gv.onrender.com/api/experience/${editId}`, payload);
      } else {
        await axios.post('https://portfolio-backend-95gv.onrender.com/api/experience', payload);
      }
      
      setIsModalOpen(false);
      resetForm();
      fetchExperience();
    } catch (err) {
      alert('Error saving experience');
    }
  };

  const resetForm = () => {
    setFormData({ year: '', company: '', position: '', location: '', description: '', technologies: '', images: [] });
    setEditId(null);
  };

  const handleEdit = (exp) => {
    setFormData({
      year: exp.year,
      company: exp.company,
      position: exp.position,
      location: exp.location,
      description: exp.description,
      technologies: Array.isArray(exp.technologies) ? exp.technologies.join(', ') : exp.technologies,
      images: exp.images || []
    });
    setEditId(exp._id);
    setIsModalOpen(true);
  };

  const deleteExperience = async (id) => {
    if (window.confirm('Are you sure you want to delete this experience entry?')) {
      try {
        await axios.delete(`https://portfolio-backend-95gv.onrender.com/api/experience/${id}`);
        setExperiences(experiences.filter(e => e._id !== id));
      } catch (err) {
        alert('Error deleting');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Work Experience</h2>
          <p className="text-slate-500 text-sm">Manage your professional career history</p>
        </div>
        <button 
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-primary/20 transition-all active:scale-95"
        >
          <Plus size={20} /> Add Experience
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="animate-spin text-primary" size={40} />
          <p className="text-slate-500 font-medium">Loading career history...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {experiences.map((exp) => (
            <div key={exp._id} className="flex flex-col md:flex-row gap-6 p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative group">
              <div className="w-14 h-14 shrink-0 bg-slate-50 rounded-xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                <Briefcase size={28} />
              </div>
              
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-2 mb-2">
                  <div>
                    <h4 className="text-xl font-bold text-slate-800">{exp.position}</h4>
                    <p className="text-primary font-bold">{exp.company}</p>
                  </div>
                  <span className="px-4 py-1.5 bg-slate-100 text-slate-600 rounded-full text-xs font-bold whitespace-nowrap">
                    {exp.year}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-slate-500 text-sm mb-4 font-medium">
                  <MapPin size={16} className="text-slate-400" />
                  {exp.location}
                </div>

                <p className="text-slate-600 text-[0.95rem] leading-relaxed mb-6">{exp.description}</p>

                {exp.images && exp.images.length > 0 && (
                  <div className="flex flex-wrap gap-3 mb-6">
                    {exp.images.map((img, idx) => (
                      <div key={idx} className="w-16 h-16 rounded-lg overflow-hidden border border-slate-100 shadow-sm">
                        <img src={getImageUrl(img)} alt="experience" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-4 pt-4 border-t border-slate-50">
                  <button 
                    onClick={() => handleEdit(exp)} 
                    className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-primary transition-colors"
                  >
                    <Edit3 size={16} /> Edit Details
                  </button>
                  <button 
                    onClick={() => deleteExperience(exp._id)} 
                    className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={16} /> Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editId ? "Edit Experience" : "Add Experience"}>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Company Name</label>
              <input 
                type="text" 
                required 
                value={formData.company} 
                onChange={e => setFormData({...formData, company: e.target.value})} 
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                placeholder="E.g. Tech Solutions Inc."
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Position</label>
              <input 
                type="text" 
                required 
                value={formData.position} 
                onChange={e => setFormData({...formData, position: e.target.value})} 
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                placeholder="E.g. Senior Developer"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Duration</label>
              <input 
                type="text" 
                required 
                value={formData.year} 
                onChange={e => setFormData({...formData, year: e.target.value})} 
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                placeholder="E.g. 2021 - 2023"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Location</label>
              <input 
                type="text" 
                value={formData.location} 
                onChange={e => setFormData({...formData, location: e.target.value})} 
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                placeholder="E.g. New York, NY"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Technologies (comma separated)</label>
            <input 
              type="text" 
              value={formData.technologies} 
              onChange={e => setFormData({...formData, technologies: e.target.value})} 
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none"
              placeholder="E.g. React, Node.js, AWS"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Description</label>
            <textarea 
              rows="4" 
              value={formData.description} 
              onChange={e => setFormData({...formData, description: e.target.value})} 
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none resize-none"
              placeholder="What did you achieve in this role?"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Experience Gallery (Multiple Images)</label>
            <div className="flex flex-col gap-4 p-4 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl group hover:border-primary/50 transition-colors">
              <input 
                type="file" 
                multiple 
                accept="image/*" 
                onChange={handleImageUpload} 
                className="hidden" 
                id="exp-image-upload" 
              />
              <label htmlFor="exp-image-upload" className="flex flex-col items-center justify-center gap-2 cursor-pointer py-4">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors shadow-sm">
                  <Plus size={24} />
                </div>
                <span className="text-sm font-medium text-slate-500">Click to upload work samples</span>
              </label>

              {formData.images.length > 0 && (
                <div className="flex flex-wrap gap-3 pt-4 border-t border-slate-200">
                  {formData.images.map((url, i) => (
                    <div key={i} className="relative group/img w-20 h-20 rounded-xl overflow-hidden border border-slate-200 shadow-sm">
                      <img src={getImageUrl(url)} className="w-full h-full object-cover" alt="preview" />
                      <button 
                        type="button" 
                        onClick={() => setFormData({...formData, images: formData.images.filter((_, idx) => idx !== i)})} 
                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover/img:opacity-100 transition-opacity shadow-lg"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
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
              {editId ? 'Update Experience' : 'Save Experience'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Experience;
