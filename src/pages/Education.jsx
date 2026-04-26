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
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2>Education</h2>
        <button 
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="login-submit-btn" style={{ width: 'auto', padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Plus size={18} /> Add Education
        </button>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}><Loader2 className="animate-spin" /></div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px' }}>
          {education.map((edu) => (
            <div key={edu._id} style={{ 
              padding: '24px', border: '1px solid #e2e8f0', borderRadius: '16px', 
              backgroundColor: '#fff', position: 'relative'
            }}>
              <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                <div style={{ width: '50px', height: '50px', borderRadius: '10px', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <GraduationCap color="#6366f1" />
                </div>
                <div>
                  <h4 style={{ fontSize: '1.1rem' }}>{edu.title}</h4>
                  <p style={{ color: '#6366f1', fontWeight: 600, fontSize: '0.9rem' }}>{edu.board}</p>
                </div>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 500 }}>{edu.year}</p>
              <p style={{ marginTop: '12px', fontSize: '0.9rem', color: '#334155', lineHeight: 1.5 }}>{edu.description}</p>
              <div style={{ display: 'flex', gap: '12px', marginTop: '20px', borderTop: '1px solid #f1f5f9', paddingTop: '12px' }}>
                <button onClick={() => handleEdit(edu)} style={{ color: '#6366f1', border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem' }}>
                  <Edit3 size={16} /> Edit
                </button>
                <button onClick={() => deleteEdu(edu._id)} style={{ color: '#ef4444', border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem' }}>
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editId ? "Edit Education" : "Add Education"}>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group"><label>Degree / Certificate Title</label><input type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} /></div>
          <div className="form-row">
            <div className="form-group"><label>Board / University</label><input type="text" required value={formData.board} onChange={e => setFormData({...formData, board: e.target.value})} /></div>
            <div className="form-group"><label>Year</label><input type="text" required value={formData.year} onChange={e => setFormData({...formData, year: e.target.value})} /></div>
          </div>
          <div className="form-group"><label>Description</label><textarea rows="3" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} style={{ width: '100%', padding: '12px', border: '1px solid var(--border-color)', borderRadius: '10px' }} /></div>
          <button type="submit" className="login-submit-btn">{editId ? 'Update Education' : 'Save Education'}</button>
        </form>
      </Modal>
    </div>
  );
};

export default Education;
