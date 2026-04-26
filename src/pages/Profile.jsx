import React, { useEffect, useState } from 'react';
import api, { API_URL } from '../api';
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
      const { data } = await api.get('/api/portfolio-data');
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
      const { data } = await api.post('/api/upload', formData);
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
      await api.put('/api/profile', profile);
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
    return `${API_URL}/${url.replace('./', '')}`;
  };

  if (loading) return <div className="flex items-center justify-center min-h-[400px]"><Loader2 className="animate-spin text-primary" size={48} /></div>;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Global Settings & Profile</h2>
          <p className="text-slate-500 text-sm">Configure your hero section, bio, assets and social links</p>
        </div>
        <button 
          onClick={handleUpdate} 
          disabled={saving} 
          className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-primary/20 transition-all active:scale-95 disabled:opacity-50"
        >
          {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />} 
          <span>{saving ? 'Saving Changes...' : 'Save Changes'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Left Column: Images & Assets */}
        <div className="space-y-8">
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <h4 className="text-lg font-bold text-slate-800 pb-4 border-b border-slate-100 flex items-center gap-2">
              <User className="text-primary" size={20} /> Hero Section Content
            </h4>
            <div className="space-y-4">
              <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Main Hero Heading (Name)</label>
                  <input 
                    type="text" 
                    value={profile.contact.name || ''} 
                    onChange={e => setProfile({...profile, contact: {...profile.contact, name: e.target.value}})} 
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                    placeholder="e.g. Yogesh Pal" 
                  />
              </div>
              <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Hero Tagline / Sub-heading</label>
                  <input 
                    type="text" 
                    value={profile.contact.tagline || ''} 
                    onChange={e => setProfile({...profile, contact: {...profile.contact, tagline: e.target.value}})} 
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                  />
              </div>
            </div>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <h4 className="text-lg font-bold text-slate-800 pb-4 border-b border-slate-100 flex items-center gap-2">
              <ImageIcon className="text-primary" size={20} /> Portfolio Assets
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Hero Image */}
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Hero Profile Image</label>
                <div className="flex flex-col items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="relative group/avatar">
                    <img src={getImageUrl(profile.contact.profileImage)} className="w-24 h-24 rounded-full object-cover ring-4 ring-white shadow-md" alt="hero" />
                    <label className="absolute inset-0 bg-black/40 text-white flex items-center justify-center rounded-full opacity-0 group-hover/avatar:opacity-100 cursor-pointer transition-all">
                       <Camera size={24} />
                       <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, 'profile')} />
                    </label>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">Recommended: 400x400 (Round)</span>
                </div>
              </div>

              {/* CV Asset */}
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Curriculum Vitae (CV)</label>
                <div className="flex flex-col justify-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100 h-full min-h-[136px]">
                  <label className="flex items-center justify-center gap-2 bg-white px-4 py-2 rounded-lg border border-slate-200 text-sm font-bold text-slate-600 hover:text-primary hover:border-primary/50 cursor-pointer transition-all">
                    <UploadCloud size={18} />
                    {uploading.cv ? 'Uploading...' : 'Upload PDF'}
                    <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, 'cv')} />
                  </label>
                  {profile.contact.cv && (
                    <p className="text-[10px] text-emerald-500 font-bold truncate text-center">
                      ✓ {profile.contact.cv.split('/').pop()}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* About Images */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">About Section Gallery</label>
              <div className="grid grid-cols-2 gap-4">
                {[1, 2].map(i => (
                  <div key={i} className="space-y-2">
                    <div className="relative group/about-img h-32 bg-slate-50 rounded-xl overflow-hidden border border-slate-100 shadow-sm">
                      <img src={getImageUrl(profile.about.images[i-1])} className="w-full h-full object-cover" alt="about" />
                      <label className="absolute inset-0 bg-black/40 text-white flex items-center justify-center opacity-0 group-hover/about-img:opacity-100 cursor-pointer transition-all">
                        <Camera size={20} />
                        <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, `about${i}`)} />
                      </label>
                    </div>
                    <p className="text-[10px] text-center text-slate-400 font-medium">About Image {i}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer Image */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Footer Logo / Mark</label>
              <div className="flex items-center gap-6 p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className="w-16 h-16 bg-white p-2 rounded-lg shadow-sm flex items-center justify-center">
                  <img src={getImageUrl(profile.contact.footerImage)} className="w-full h-full object-contain" alt="footer" />
                </div>
                <label className="text-sm font-bold text-primary hover:text-primary-hover cursor-pointer transition-colors">
                   Change Image
                   <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, 'footer')} />
                </label>
              </div>
            </div>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-8">
            <h4 className="text-lg font-bold text-slate-800 pb-4 border-b border-slate-100 flex items-center gap-2">
              <Plus className="text-primary" size={20} /> Skills & Strengths
            </h4>

            {['strengths', 'technical'].map(field => (
              <div key={field} className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-bold text-slate-700 capitalize">{field}</label>
                  <button 
                    onClick={() => addListItem(field)} 
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold hover:bg-primary hover:text-white transition-all"
                  >
                    <Plus size={14} /> Add Line
                  </button>
                </div>
                <div className="space-y-2">
                  {profile.about[field].map((item, i) => (
                    <div key={i} className="flex gap-2 group/list-item">
                      <input 
                        type="text" 
                        value={item} 
                        onChange={(e) => handleListChange(field, i, e.target.value)} 
                        className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-primary outline-none text-sm font-medium transition-all" 
                        placeholder={`Enter ${field.slice(0, -1)}...`}
                      />
                      <button 
                        onClick={() => removeListItem(field, i)} 
                        className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Bio & Info */}
        <div className="space-y-8">
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <h4 className="text-lg font-bold text-slate-800 pb-4 border-b border-slate-100 flex items-center gap-2">
              <Info className="text-primary" size={20} /> Biography Details
            </h4>
            <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl flex gap-3">
              <div className="w-10 h-10 shrink-0 bg-white rounded-lg flex items-center justify-center text-amber-500 shadow-sm">
                <Info size={20} />
              </div>
              <p className="text-xs text-amber-700 leading-relaxed font-medium">
                <strong>Highlighting Tip:</strong> Use <code>&lt;span&gt;text&lt;/span&gt;</code> to highlight specific words in your bio (e.g. your name or key achievements).
              </p>
            </div>
            
            <div className="space-y-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 italic opacity-60">Biography Paragraph {i}</label>
                  <textarea 
                    rows="5" 
                    value={profile.about[`para${i}`]} 
                    onChange={e => setProfile({...profile, about: {...profile.about, [`para${i}`]: e.target.value}})} 
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none resize-none text-[0.95rem] leading-relaxed"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <h4 className="text-lg font-bold text-slate-800 pb-4 border-b border-slate-100 flex items-center gap-2">
              <Globe className="text-primary" size={20} /> Contact & Social Presence
            </h4>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Contact Subheading</label>
                    <input 
                      type="text" 
                      value={profile.contact.subheading || ''} 
                      onChange={e => setProfile({...profile, contact: {...profile.contact, subheading: e.target.value}})} 
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-primary outline-none"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Location / Address</label>
                    <input 
                      type="text" 
                      value={profile.contact.address || ''} 
                      onChange={e => setProfile({...profile, contact: {...profile.contact, address: e.target.value}})} 
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-primary outline-none"
                      placeholder="e.g. Bareilly, UP"
                    />
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-50">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                  <Share2 size={14} /> Social Profiles
                </label>
                <div className="grid grid-cols-1 gap-3">
                  {profile.contact.socialLinks.map((link, i) => (
                    <div key={i} className="flex flex-col gap-1">
                      <span className="text-[10px] font-bold text-slate-400 pl-1 uppercase">{link.name}</span>
                      <input 
                        type="text" 
                        value={link.url} 
                        onChange={e => {
                          const newLinks = [...profile.contact.socialLinks];
                          newLinks[i].url = e.target.value;
                          setProfile({...profile, contact: {...profile.contact, socialLinks: newLinks}});
                        }} 
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-primary outline-none text-sm font-medium transition-all"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
