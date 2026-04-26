import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Plus, Trash2, ExternalLink, Image as ImageIcon, Loader2, Edit3, Star } from 'lucide-react';
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

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/portfolio-data');
      setProjects(data.projects);
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
      const { data } = await axios.post('http://localhost:5000/api/upload-multiple', uploadData);
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
        await axios.put(`http://localhost:5000/api/projects/${editId}`, formData);
      } else {
        await axios.post('http://localhost:5000/api/projects', formData);
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
      technologies: project.technologies,
      description: project.description,
      images: project.images
    });
    setEditId(project._id);
    setIsModalOpen(true);
  };

  const deleteProject = async (id) => {
    if (window.confirm('Delete this project?')) {
      try {
        await axios.delete(`http://localhost:5000/api/projects/${id}`);
        setProjects(projects.filter(p => p._id !== id));
      } catch (err) {
        alert('Failed to delete project');
      }
    }
  };

  const getImageUrl = (url) => {
    if (url.startsWith('http')) return url;
    return `http://localhost:5500/Portfolio/${url.replace('./', '')}`;
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2>Manage Projects</h2>
        <button 
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="login-submit-btn" style={{ width: 'auto', padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Plus size={18} /> Add Project
        </button>
      </div>

      {loading ? (
        <p>Loading projects...</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
          {projects.map((project) => (
            <div key={project._id} style={{ border: '1px solid #e2e8f0', borderRadius: '16px', overflow: 'hidden', backgroundColor: '#fff' }}>
              <div style={{ position: 'relative' }}>
                <img src={getImageUrl(project.images[0])} alt={project.title} style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
                <button 
                  onClick={() => handleEdit(project)}
                  style={{ position: 'absolute', top: '10px', right: '10px', backgroundColor: '#fff', border: 'none', padding: '8px', borderRadius: '50%', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
                >
                  <Edit3 size={16} color="#6366f1" />
                </button>
              </div>
              <div style={{ padding: '20px' }}>
                <h4 style={{ marginBottom: '4px' }}>{project.title}</h4>
                <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '8px' }}>{project.category}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '16px' }}>
                  <Star size={14} color="#fbbf24" fill="#fbbf24" />
                  <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{project.averageRating?.toFixed(1) || '0.0'}</span>
                  <span style={{ fontSize: '0.875rem', color: '#94a3b8' }}>({project.ratings?.length || 0})</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <a href={project.link} target="_blank" rel="noopener noreferrer" style={{ color: '#6366f1', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.875rem', fontWeight: 600 }}>
                    <ExternalLink size={14} /> Live Link
                  </a>
                  <button onClick={() => deleteProject(project._id)} style={{ color: '#ef4444', border: 'none', background: 'none', cursor: 'pointer' }}>
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editId ? "Edit Project" : "Add Project"}>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Project Title</label>
            <input type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
          </div>
          <div className="form-row">
            <div className="form-group"><label>Category</label><input type="text" required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} /></div>
            <div className="form-group"><label>Live Link</label><input type="text" value={formData.link} onChange={e => setFormData({...formData, link: e.target.value})} /></div>
          </div>
          <div className="form-group"><label>Technologies</label><input type="text" required value={formData.technologies} onChange={e => setFormData({...formData, technologies: e.target.value})} /></div>
          <div className="form-group"><label>Description</label><textarea rows="3" required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} style={{ width: '100%', padding: '12px', border: '1px solid var(--border-color)', borderRadius: '10px' }} /></div>
          <div className="form-group">
            <label>Upload Images</label>
            <input type="file" multiple accept="image/*" onChange={handleImageUpload} />
            <div className="image-preview-container">
              {formData.images.map((url, i) => (
                <div key={i} style={{ position: 'relative' }}>
                  <img src={getImageUrl(url)} className="preview-img" alt="preview" />
                  <button type="button" onClick={() => setFormData({...formData, images: formData.images.filter((_, idx) => idx !== i)})} style={{ position: 'absolute', top: '-5px', right: '-5px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '50%', width: '16px', height: '16px', fontSize: '10px', cursor: 'pointer' }}>x</button>
                </div>
              ))}
            </div>
          </div>
          <button type="submit" className="login-submit-btn">{editId ? 'Update Project' : 'Save Project'}</button>
        </form>
      </Modal>
    </div>
  );
};

export default Projects;
