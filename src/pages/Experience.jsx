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
    technologies: ''
  });

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
    setFormData({ year: '', company: '', position: '', location: '', description: '', technologies: '' });
    setEditId(null);
  };

  const handleEdit = (exp) => {
    setFormData({
      year: exp.year,
      company: exp.company,
      position: exp.position,
      location: exp.location,
      description: exp.description,
      technologies: Array.isArray(exp.technologies) ? exp.technologies.join(', ') : exp.technologies
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
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2>Work Experience</h2>
        <button 
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="login-submit-btn" style={{ width: 'auto', padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Plus size={18} /> Add Experience
        </button>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}><Loader2 className="animate-spin" /></div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {experiences.map((exp) => (
            <div key={exp._id} style={{ 
              padding: '24px', border: '1px solid #e2e8f0', borderRadius: '16px', 
              backgroundColor: '#fff', display: 'flex', gap: '20px', position: 'relative'
            }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '12px', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Briefcase color="#6366f1" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h4 style={{ fontSize: '1.2rem', marginBottom: '4px' }}>{exp.position}</h4>
                    <p style={{ color: '#6366f1', fontWeight: 600 }}>{exp.company}</p>
                  </div>
                  <span style={{ backgroundColor: '#f1f5f9', padding: '4px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 600 }}>
                    {exp.year}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '0.9rem', marginTop: '8px' }}>
                  <MapPin size={14} /> {exp.location}
                </div>
                <p style={{ marginTop: '12px', color: '#334155', fontSize: '0.95rem', lineHeight: 1.5 }}>{exp.description}</p>
                <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                  <button onClick={() => handleEdit(exp)} style={{ color: '#6366f1', border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem' }}>
                    <Edit3 size={16} /> Edit
                  </button>
                  <button onClick={() => deleteExperience(exp._id)} style={{ color: '#ef4444', border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem' }}>
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editId ? "Edit Experience" : "Add Experience"}>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-row">
            <div className="form-group"><label>Company Name</label><input type="text" required value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} /></div>
            <div className="form-group"><label>Position</label><input type="text" required value={formData.position} onChange={e => setFormData({...formData, position: e.target.value})} /></div>
          </div>
          <div className="form-row">
            <div className="form-group"><label>Duration</label><input type="text" required value={formData.year} onChange={e => setFormData({...formData, year: e.target.value})} /></div>
            <div className="form-group"><label>Location</label><input type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} /></div>
          </div>
          <div className="form-group"><label>Technologies (comma separated)</label><input type="text" value={formData.technologies} onChange={e => setFormData({...formData, technologies: e.target.value})} /></div>
          <div className="form-group"><label>Description</label><textarea rows="3" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} style={{ width: '100%', padding: '12px', border: '1px solid var(--border-color)', borderRadius: '10px' }} /></div>
          <button type="submit" className="login-submit-btn">{editId ? 'Update Experience' : 'Save Experience'}</button>
        </form>
      </Modal>
    </div>
  );
};

export default Experience;
