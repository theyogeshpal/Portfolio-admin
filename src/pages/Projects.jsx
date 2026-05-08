import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Plus, Trash2, ExternalLink, Image as ImageIcon, Loader2, Edit3, Star, Search, X, Eye, EyeOff, ArrowUp, ArrowDown } from 'lucide-react';
import Modal from '../components/Modal';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [uploading, setUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    link: '',
    technologies: '',
    description: '',
    images: []
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [sortBy, setSortBy] = useState('newest'); // newest, top-rated

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data } = await axios.get('https://portfolio-backend-95gv.onrender.com/api/projects/all');
      setProjects(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);
    const uploadData = new FormData();
    files.forEach(file => uploadData.append('images', file));

    try {
      const { data } = await axios.post('https://portfolio-backend-95gv.onrender.com/api/upload-multiple', uploadData);
      setFormData({ ...formData, images: [...formData.images, ...data.urls] });
    } catch (err) {
      alert('Failed to upload images');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.images.length === 0) return alert('Please upload at least one image');

    try {
      if (editId) {
        await axios.put(`https://portfolio-backend-95gv.onrender.com/api/projects/${editId}`, formData);
      } else {
        await axios.post('https://portfolio-backend-95gv.onrender.com/api/projects', formData);
      }
      setIsModalOpen(false);
      resetForm();
      fetchProjects();
    } catch (err) {
      alert('Error saving project');
    }
  };

  const resetForm = () => {
    setFormData({ title: '', category: '', link: '', technologies: '', description: '', images: [] });
    setEditId(null);
  };

  const handleEdit = (project) => {
    setFormData({
      title: project.title,
      category: project.category,
      link: project.link,
      technologies: Array.isArray(project.technologies) ? project.technologies.join(', ') : (project.technologies || ''),
      description: project.description,
      images: project.images || []
    });
    setEditId(project._id);
    setIsModalOpen(true);
  };

  const deleteProject = async (id) => {
    if (window.confirm('Delete this project?')) {
      try {
        await axios.delete(`https://portfolio-backend-95gv.onrender.com/api/projects/${id}`);
        setProjects(projects.filter(p => p._id !== id));
      } catch (err) {
        alert('Failed to delete project');
      }
    }
  };

  const moveProject = async (projectId, direction) => {
    // Work on full projects list sorted by order
    const sorted = [...projects].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    const index = sorted.findIndex(p => p._id === projectId);
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= sorted.length) return;
    [sorted[index], sorted[swapIndex]] = [sorted[swapIndex], sorted[index]];
    const orderedIds = sorted.map(p => p._id);
    try {
      await axios.patch('https://portfolio-backend-95gv.onrender.com/api/projects/reorder', { orderedIds });
      setProjects(sorted.map((p, i) => ({ ...p, order: i })));
    } catch (err) {
      alert('Failed to reorder');
    }
  };

  const toggleVisibility = async (id, currentState) => {
    try {
      const { data } = await axios.patch(`https://portfolio-backend-95gv.onrender.com/api/projects/${id}/toggle-visibility`);
      setProjects(projects.map(p => p._id === id ? { ...p, isVisible: data.isVisible } : p));
    } catch (err) {
      alert('Failed to toggle visibility');
    }
  };

  const getImageUrl = (url) => {
    if (typeof url !== 'string' || !url) return '';
    if (url.startsWith('http')) return url;
    const filename = url.replace(/^.*[\/\\]/, '');
    return `https://yogesh-pal.netlify.app/images/${filename}`;
  };

  const filteredProjects = projects
    .filter(p => {
      const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           p.technologies?.toString().toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === 'All' || p.category === filterCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'top-rated') return (b.averageRating || 0) - (a.averageRating || 0);
      return (a.order ?? 0) - (b.order ?? 0);
    });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Manage Projects</h2>
          <p className="text-slate-500 text-sm">Total {projects.length} projects published</p>
        </div>
        <button 
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-primary/20 transition-all active:scale-95"
        >
          <Plus size={20} /> Add New Project
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search projects..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none text-sm"
          />
        </div>
        
        <div className="flex gap-3 w-full md:w-auto">
          <select 
            value={filterCategory} 
            onChange={(e) => setFilterCategory(e.target.value)}
            className="flex-1 md:w-40 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-primary outline-none text-sm font-medium transition-all"
          >
            <option value="All">All Categories</option>
            {[...new Set(projects.map(p => p.category))].map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="flex-1 md:w-40 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-primary outline-none text-sm font-medium transition-all"
          >
            <option value="newest">Custom Order</option>
            <option value="top-rated">Top Rated</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="animate-spin text-primary" size={40} />
          <p className="text-slate-500 font-medium">Loading your projects...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProjects.map((project, index) => (
            <div key={project._id} className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300">
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={getImageUrl(project.images[0])}
                  alt={project.title}
                  className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${!project.isVisible ? 'opacity-40 grayscale' : ''}`}
                />
                {!project.isVisible && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="bg-black/60 text-white text-xs font-bold px-3 py-1 rounded-full">Hidden from website</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-[2px]">
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleVisibility(project._id); }}
                    className={`w-10 h-10 rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg ${project.isVisible ? 'bg-emerald-500 text-white' : 'bg-slate-500 text-white'}`}
                    title={project.isVisible ? 'Hide from website' : 'Show on website'}
                  >
                    {project.isVisible ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleEdit(project); }}
                    className="w-10 h-10 bg-white text-primary rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg"
                    title="Edit Project"
                  >
                    <Edit3 size={18} />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteProject(project._id); }}
                    className="w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg"
                    title="Delete Project"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-bold text-slate-800 line-clamp-1">{project.title}</h4>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary px-2 py-1 rounded-md">
                    {project.category}
                  </span>
                </div>
                
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center gap-1 bg-amber-50 text-amber-600 px-2 py-1 rounded-lg border border-amber-100 text-xs font-bold">
                    <Star size={12} fill="currentColor" />
                    <span>{project.averageRating?.toFixed(1) || '0.0'}</span>
                  </div>
                  <span className="text-xs text-slate-400">({project.ratings?.length || 0} reviews)</span>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                  <a 
                    href={project.link} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-primary transition-colors"
                  >
                    <ExternalLink size={14} />
                    <span>Live Preview</span>
                  </a>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => moveProject(project._id, 'up')}
                      disabled={projects.sort((a,b)=>(a.order??0)-(b.order??0)).findIndex(p=>p._id===project._id) === 0}
                      className="w-7 h-7 flex items-center justify-center rounded-lg bg-slate-100 hover:bg-primary hover:text-white text-slate-500 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Move Up"
                    >
                      <ArrowUp size={14} />
                    </button>
                    <span className="text-[10px] font-bold text-slate-400">#{index + 1}</span>
                    <button
                      onClick={() => moveProject(project._id, 'down')}
                      disabled={projects.sort((a,b)=>(a.order??0)-(b.order??0)).findIndex(p=>p._id===project._id) === projects.length - 1}
                      className="w-7 h-7 flex items-center justify-center rounded-lg bg-slate-100 hover:bg-primary hover:text-white text-slate-500 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Move Down"
                    >
                      <ArrowDown size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editId ? "Edit Project" : "Add Project"}>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Project Title</label>
            <input 
              type="text" 
              required 
              value={formData.title} 
              onChange={e => setFormData({...formData, title: e.target.value})} 
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none"
              placeholder="E.g. E-Commerce Platform"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Category</label>
              <input 
                type="text" 
                required 
                value={formData.category} 
                onChange={e => setFormData({...formData, category: e.target.value})} 
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                placeholder="E.g. Web Development"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Live Link</label>
              <input 
                type="text" 
                value={formData.link} 
                onChange={e => setFormData({...formData, link: e.target.value})} 
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                placeholder="https://..."
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Technologies (comma separated)</label>
            <input 
              type="text" 
              required 
              value={formData.technologies} 
              onChange={e => setFormData({...formData, technologies: e.target.value})} 
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none"
              placeholder="React, Node.js, MongoDB"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Description</label>
            <textarea 
              rows="4" 
              required 
              value={formData.description} 
              onChange={e => setFormData({...formData, description: e.target.value})} 
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none resize-none"
              placeholder="Briefly describe your project..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Project Images</label>
            <div className="flex flex-col gap-4 p-4 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl group hover:border-primary/50 transition-colors">
              <input 
                type="file" 
                multiple 
                accept="image/*" 
                onChange={handleImageUpload} 
                className="hidden" 
                id="image-upload" 
              />
              <label htmlFor="image-upload" className="flex flex-col items-center justify-center gap-2 cursor-pointer py-4">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors shadow-sm">
                  <Plus size={24} />
                </div>
                <span className="text-sm font-medium text-slate-500">Click to upload multiple images</span>
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
              disabled={uploading}
              className="flex-1 bg-primary text-white font-bold py-3 rounded-xl shadow-lg shadow-primary/20 hover:bg-primary-hover transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? 'Uploading...' : (editId ? 'Update Project' : 'Save Project')}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Projects;
