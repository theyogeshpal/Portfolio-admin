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
      const { data } = await axios.get('http://localhost:5000/api/portfolio-data');
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
      const { data } = await axios.post('http://localhost:5000/api/upload', uploadData);
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
        await axios.put(`http://localhost:5000/api/timeline/${editId}`, formData);
      } else {
        await axios.post('http://localhost:5000/api/timeline', formData);
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
        await axios.delete(`http://localhost:5000/api/timeline/${id}`);
        setTimeline(timeline.filter(t => t._id !== id));
      } catch (err) {
        alert('Error deleting');
      }
    }
  };

  const getImageUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return `http://localhost:5500/Portfolio/${url.replace('./', '')}`;
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2>Timeline & Certificates</h2>
        <button 
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          style={{ 
            display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px',
            backgroundColor: '#6366f1', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 600
          }}
        >
          <Plus size={18} />
          Add Item
        </button>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}><Loader2 className="animate-spin" /></div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {timeline.map((item) => (
            <div key={item._id} style={{ 
              padding: '24px', border: '1px solid #e2e8f0', borderRadius: '16px', 
              backgroundColor: '#fff', display: 'flex', gap: '20px', position: 'relative'
            }}>
              <div style={{ width: '80px', height: '60px', borderRadius: '12px', backgroundColor: '#f1f5f9', overflow: 'hidden', flexShrink: 0 }}>
                {item.image ? (
                  <img src={getImageUrl(item.image)} alt="cert" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <History size={20} color="#6366f1" />
                  </div>
                )}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <h4 style={{ fontSize: '1.1rem' }}>{item.title}</h4>
                  <span style={{ fontSize: '0.85rem', color: '#6366f1', fontWeight: 600 }}>{item.year}</span>
                </div>
                <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '4px' }}>{item.description}</p>
                <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                  <button 
                    onClick={() => handleEdit(item)}
                    style={{ color: '#6366f1', border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem' }}
                  >
                    <Edit3 size={16} /> Edit
                  </button>
                  <button 
                    onClick={() => deleteItem(item._id)}
                    style={{ color: '#ef4444', border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem' }}
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editId ? "Edit Timeline Item" : "Add Timeline Item"}>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Title / Certificate Name</label>
            <input type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
          </div>
          <div className="form-group">
            <label>Year</label>
            <input type="text" required value={formData.year} onChange={e => setFormData({...formData, year: e.target.value})} />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea rows="3" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} style={{ width: '100%', padding: '12px', border: '1px solid var(--border-color)', borderRadius: '10px' }} />
          </div>
          
          <div className="form-group">
            <label>Certificate Image</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '100px', height: '70px', border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#f8fafc' }}>
                {formData.image && <img src={getImageUrl(formData.image)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
              </div>
              <label style={{ 
                padding: '8px 16px', backgroundColor: '#f1f5f9', borderRadius: '8px', 
                cursor: 'pointer', fontSize: '0.9rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '8px' 
              }}>
                {uploading ? <Loader2 className="animate-spin" size={16} /> : <Camera size={16} />}
                {formData.image ? 'Change Image' : 'Upload Image'}
                <input type="file" style={{ display: 'none' }} onChange={handleImageUpload} />
              </label>
            </div>
          </div>

          <button type="submit" className="login-submit-btn">
            {editId ? 'Update Item' : 'Save Item'}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default Timeline;
