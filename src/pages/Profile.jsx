import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Save, User, Globe, Share2, Camera, Loader2, UploadCloud, Info, Trash2, Plus, Image as ImageIcon } from 'lucide-react';

const Profile = () => {
  const [profile, setProfile] = useState({
    contact: { socialLinks: [] },
    about: { images: [], strengths: [], technical: [] }
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState({ profile: false, about1: false, about2: false, footer: false, cv: false });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/portfolio-data');
      setProfile({ contact: data.contact, about: data.about });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e, type, index = null) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading({ ...uploading, [type]: true });
    const formData = new FormData();
    formData.append('image', file);

    try {
      const { data } = await axios.post('http://localhost:5000/api/upload', formData);
      if (type === 'profile') {
        setProfile({ ...profile, contact: { ...profile.contact, profileImage: data.url } });
      } else if (type === 'cv') {
        setProfile({ ...profile, contact: { ...profile.contact, cv: data.url } });
      } else if (type === 'footer') {
        setProfile({ ...profile, contact: { ...profile.contact, footerImage: data.url } });
      } else if (type.startsWith('about')) {
        const idx = parseInt(type.replace('about', '')) - 1;
        const newImages = [...(profile.about.images || [])];
        newImages[idx] = data.url;
        setProfile({ ...profile, about: { ...profile.about, images: newImages } });
      }
    } catch (err) {
      alert('Upload failed');
    } finally {
      setUploading({ ...uploading, [type]: false });
    }
  };

  const handleListChange = (field, index, value) => {
    const newList = [...profile.about[field]];
    newList[index] = value;
    setProfile({ ...profile, about: { ...profile.about, [field]: newList } });
  };

  const addListItem = (field) => {
    setProfile({ ...profile, about: { ...profile.about, [field]: [...profile.about[field], ''] } });
  };

  const removeListItem = (field, index) => {
    const newList = profile.about[field].filter((_, i) => i !== index);
    setProfile({ ...profile, about: { ...profile.about, [field]: newList } });
  };

  const handleUpdate = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);
    try {
      await axios.put('http://localhost:5000/api/profile', profile);
      alert('Profile updated successfully!');
    } catch (err) {
      alert('Error saving');
    } finally {
      setSaving(false);
    }
  };

  const getImageUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return `http://localhost:5500/Portfolio/${url.replace('./', '')}`;
  };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '100px' }}><Loader2 className="animate-spin" size={48} color="#6366f1" /></div>;

  return (
    <div className="profile-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h2>Global Settings & Profile</h2>
        <button onClick={handleUpdate} disabled={saving} className="login-submit-btn" style={{ width: 'auto', padding: '12px 28px' }}>
          {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />} Save Changes
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
        {/* Left Column: Images & Assets */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <div style={{ padding: '24px', background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
            <h4 style={{ marginBottom: '20px' }}>Hero Section Headings</h4>
            <div className="form-group">
                <label>Main Hero Heading</label>
                <input type="text" value={profile.contact.name || ''} onChange={e => setProfile({...profile, contact: {...profile.contact, name: e.target.value}})} placeholder="e.g. Yogesh Pal" />
            </div>
            <div className="form-group" style={{ marginTop: '16px' }}>
                <label>Hero Tagline / Sub-heading</label>
                <input type="text" value={profile.contact.tagline || ''} onChange={e => setProfile({...profile, contact: {...profile.contact, tagline: e.target.value}})} />
            </div>
          </div>

          <div style={{ padding: '24px', background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
            <h4 style={{ marginBottom: '20px' }}>Portfolio Images</h4>
            
            {/* Hero Image */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b' }}>Hero Profile Image</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '8px' }}>
                <img src={getImageUrl(profile.contact.profileImage)} style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover' }} />
                <label className="nav-item active" style={{ cursor: 'pointer', padding: '8px 16px', fontSize: '0.85rem' }}>
                   {uploading.profile ? 'Uploading...' : 'Change Hero Image'}
                   <input type="file" style={{ display: 'none' }} onChange={(e) => handleFileUpload(e, 'profile')} />
                </label>
              </div>
            </div>

            {/* About Images */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b' }}>About Section Images (2 Images)</label>
              <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
                {[1, 2].map(i => (
                  <div key={i} style={{ flex: 1, textAlign: 'center' }}>
                    <div style={{ height: '100px', backgroundColor: '#f8fafc', borderRadius: '8px', overflow: 'hidden', border: '1px solid #e2e8f0', marginBottom: '8px' }}>
                      <img src={getImageUrl(profile.about.images[i-1])} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <label style={{ fontSize: '0.75rem', cursor: 'pointer', color: '#6366f1', fontWeight: 600 }}>
                      Edit Img {i}
                      <input type="file" style={{ display: 'none' }} onChange={(e) => handleFileUpload(e, `about${i}`)} />
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer Image */}
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b' }}>Footer Logo/Image</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '8px' }}>
                <img src={getImageUrl(profile.contact.footerImage)} style={{ width: '60px', height: '60px', objectFit: 'contain' }} />
                <label style={{ fontSize: '0.85rem', cursor: 'pointer', color: '#6366f1', fontWeight: 600 }}>
                   Change Footer Image
                   <input type="file" style={{ display: 'none' }} onChange={(e) => handleFileUpload(e, 'footer')} />
                </label>
              </div>
            </div>
          </div>

          {/* List Management: Strengths & Tech */}
          <div style={{ padding: '24px', background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
            <h4 style={{ marginBottom: '20px' }}>Dynamic Lists (Skills & Strengths)</h4>
            <div className="tip-box">
              <p>Each item below will appear as a separate bullet point (<strong>&lt;li&gt;</strong>) in your portfolio.</p>
            </div>

            {/* Strengths */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <label style={{ fontWeight: 600, fontSize: '0.95rem', color: '#1e293b' }}>Strengths</label>
                <button 
                  onClick={() => addListItem('strengths')} 
                  style={{ padding: '6px 12px', fontSize: '0.8rem', borderRadius: '8px', backgroundColor: '#6366f1', color: '#fff', border: 'none', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <Plus size={14} /> Add Line
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {profile.about.strengths.map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'center', backgroundColor: '#f8fafc', padding: '8px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <input 
                      type="text" 
                      value={item} 
                      onChange={(e) => handleListChange('strengths', i, e.target.value)} 
                      style={{ flex: 1, border: 'none', background: 'none', padding: '4px 8px', outline: 'none', fontSize: '0.9rem' }} 
                      placeholder="Enter strength..."
                    />
                    <button 
                      onClick={() => removeListItem('strengths', i)} 
                      style={{ color: '#ef4444', border: 'none', background: '#fee2e2', padding: '6px', borderRadius: '8px', cursor: 'pointer', display: 'flex' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Technical */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <label style={{ fontWeight: 600, fontSize: '0.95rem', color: '#1e293b' }}>Technical Knowledge</label>
                <button 
                  onClick={() => addListItem('technical')} 
                  style={{ padding: '6px 12px', fontSize: '0.8rem', borderRadius: '8px', backgroundColor: '#6366f1', color: '#fff', border: 'none', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <Plus size={14} /> Add Line
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {profile.about.technical.map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'center', backgroundColor: '#f8fafc', padding: '8px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <input 
                      type="text" 
                      value={item} 
                      onChange={(e) => handleListChange('technical', i, e.target.value)} 
                      style={{ flex: 1, border: 'none', background: 'none', padding: '4px 8px', outline: 'none', fontSize: '0.9rem' }} 
                      placeholder="Enter technical skill..."
                    />
                    <button 
                      onClick={() => removeListItem('technical', i)} 
                      style={{ color: '#ef4444', border: 'none', background: '#fee2e2', padding: '6px', borderRadius: '8px', cursor: 'pointer', display: 'flex' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Bio & Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
           <div style={{ padding: '24px', background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
            <h4 style={{ marginBottom: '20px' }}>Bio Paragraphs</h4>
            <div className="tip-box">
              <p>💡 <strong>Highlighting Tip:</strong> Jin words ko aap highlight karna chahte hain, unhe <code>&lt;span&gt;word&lt;/span&gt;</code> ke beech mein likhein.</p>
            </div>
            <div className="form-group">
              <label>Paragraph 1</label>
              <textarea rows="4" value={profile.about.para1} onChange={e => setProfile({...profile, about: {...profile.about, para1: e.target.value}})} />
            </div>
            <div className="form-group" style={{ marginTop: '16px' }}>
              <label>Paragraph 2</label>
              <textarea rows="4" value={profile.about.para2} onChange={e => setProfile({...profile, about: {...profile.about, para2: e.target.value}})} />
            </div>
            <div className="form-group" style={{ marginTop: '16px' }}>
              <label>Paragraph 3</label>
              <textarea rows="4" value={profile.about.para3} onChange={e => setProfile({...profile, about: {...profile.about, para3: e.target.value}})} />
            </div>
           </div>

           <div style={{ padding: '24px', background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
            <h4 style={{ marginBottom: '20px' }}>CV & Socials</h4>
            <div className="form-group">
                <label>CV Upload (PDF)</label>
                <input type="file" onChange={(e) => handleFileUpload(e, 'cv')} style={{ marginTop: '4px' }} />
                {profile.contact.cv && <p style={{ fontSize: '0.75rem', color: '#10b981', marginTop: '4px' }}>CV current link: {profile.contact.cv.split('/').pop()}</p>}
            </div>
            <div style={{ marginTop: '24px' }}>
                <h4 style={{ marginBottom: '16px', fontSize: '1rem' }}>Global Settings</h4>
                <div className="form-group" style={{ marginTop: '12px' }}>
                    <label>Contact Section Subheading</label>
                    <input type="text" value={profile.contact.subheading || ''} onChange={e => setProfile({...profile, contact: {...profile.contact, subheading: e.target.value}})} />
                </div>
                <div className="form-group" style={{ marginTop: '16px' }}>
                    <label>Address / City (e.g. Bareilly, UP)</label>
                    <input type="text" value={profile.contact.address || ''} onChange={e => setProfile({...profile, contact: {...profile.contact, address: e.target.value}})} />
                </div>
            </div>

            <div style={{ marginTop: '32px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Update Social URLs</label>
                {profile.contact.socialLinks.map((link, i) => (
                    <div key={i} className="form-group" style={{ marginTop: '8px' }}>
                        <label style={{ fontSize: '0.75rem' }}>{link.name}</label>
                        <input type="text" value={link.url} onChange={e => {
                            const newLinks = [...profile.contact.socialLinks];
                            newLinks[i].url = e.target.value;
                            setProfile({...profile, contact: {...profile.contact, socialLinks: newLinks}});
                        }} />
                    </div>
                ))}
            </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
