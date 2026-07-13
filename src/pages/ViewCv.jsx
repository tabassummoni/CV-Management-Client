import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ViewCv = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [cvData, setCvData] = useState({
    id: null, title: '', version: 1, fullName: '', email: '', phone: '', ieltsScore: '', summary: '', skills: '', experience: '', education: ''
  });

  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetch(`http://localhost:5001/api/cv/${id}`)
      .then(res => res.json())
      .then(data => {
        setCvData({
          id: data.id, title: data.title, version: data.version,
          fullName: data.fullName || '', email: data.email || '', phone: data.phone || '',
          ieltsScore: data.ieltsScore || '', summary: data.summary || '', skills: data.skills || '',
          experience: data.experience || '', education: data.education || ''
        });
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  const handleInputChange = (e) => setCvData({ ...cvData, [e.target.name]: e.target.value });

  const handleSaveProfile = async () => {
    setIsSaving(true);
    setErrorMsg('');

    try {
      const response = await fetch(`http://localhost:5001/api/cv/${id}/inplace`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cvData),
      });

      const data = await response.json();

      if (response.ok) {
        alert('🎉 Master profile synchronized seamlessly!');
        if (data.cv) setCvData(prev => ({ ...prev, version: data.cv.version }));
      } else if (response.status === 409) {
        setErrorMsg('❌ Stale Data Session Conflict! Reloading page required.');
        alert(data.error);
      } else {
        setErrorMsg(data.error);
      }
    } catch (error) {
      setErrorMsg('Connection failure.');
    } finally {
      setIsSaving(false);
    }
  };

  const getInputClass = (value, extra = '') => {
    return `bg-transparent border-b focus:border-purple-500 focus:outline-none transition-all ${
      !value ? 'border-red-500 text-red-400 placeholder-red-400/50 bg-red-500/5' : 'border-white/10 text-slate-200'
    } ${extra}`;
  };

  if (loading) return <div className="min-h-screen bg-slate-900 text-slate-400 flex items-center justify-center">Generating CV Template...</div>;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-8">
      <div className="max-w-4xl mx-auto mb-6 flex justify-between items-center">
        <button onClick={() => navigate('/dashboard')} className="btn btn-sm btn-outline text-slate-300">⬅️ Dashboard</button>
        <div className="flex items-center gap-4">
          <span className="text-xs bg-purple-500/20 text-purple-400 px-3 py-1.5 rounded-xl border border-purple-500/30">Version: {cvData.version}</span>
          <button onClick={handleSaveProfile} disabled={isSaving} className="btn btn-sm bg-emerald-500 text-slate-900 font-bold">{isSaving ? 'Saving...' : '💾 Save System Changes'}</button>
        </div>
      </div>

      {errorMsg && <div className="max-w-4xl mx-auto mb-4 alert alert-error text-xs">{errorMsg}</div>}

      <div className="max-w-4xl mx-auto bg-slate-800 border border-white/10 rounded-2xl p-8 space-y-6">
        <div>
          <label className="text-xs text-slate-400 block">Full Name</label>
          <input type="text" name="fullName" value={cvData.fullName} onChange={handleInputChange} className={getInputClass(cvData.fullName, "text-2xl font-bold w-full pb-1")} placeholder="[Empty Name]" />
        </div>

        <div className="grid grid-cols-3 gap-6 bg-slate-900/50 p-4 rounded-xl">
          <div>
            <span className="text-xs text-slate-400 block">Email</span>
            <input type="email" name="email" value={cvData.email} onChange={handleInputChange} className={getInputClass(cvData.email, "w-full text-sm")} placeholder="[Empty Email]" />
          </div>
          <div>
            <span className="text-xs text-slate-400 block">Phone</span>
            <input type="text" name="phone" value={cvData.phone} onChange={handleInputChange} className={getInputClass(cvData.phone, "w-full text-sm")} placeholder="[Empty Phone]" />
          </div>
          <div>
            <span className="text-xs text-indigo-300 block">IELTS Score</span>
            <input type="text" name="ieltsScore" value={cvData.ieltsScore} onChange={handleInputChange} className={getInputClass(cvData.ieltsScore, "w-full text-sm font-bold text-indigo-300")} placeholder="[Empty IELTS]" />
          </div>
        </div>

        <div>
          <h4 className="text-xs text-indigo-400 uppercase font-bold mb-1">Professional Summary</h4>
          <textarea name="summary" value={cvData.summary} onChange={handleInputChange} className={`w-full bg-slate-900/40 text-sm p-3 rounded-xl h-20 border ${!cvData.summary ? 'border-red-500 text-red-400 bg-red-500/5' : 'border-white/10 text-slate-300'}`} placeholder="[Summary Empty]" />
        </div>

        <div>
          <h4 className="text-xs text-indigo-400 uppercase font-bold mb-1">Skills</h4>
          <input type="text" name="skills" value={cvData.skills} onChange={handleInputChange} className={getInputClass(cvData.skills, "w-full text-sm p-1")} placeholder="[Skills Empty]" />
        </div>

        <div className="grid grid-cols-2 gap-6 pt-4 border-t border-white/10">
          <div>
            <h4 className="text-xs text-indigo-400 uppercase font-bold mb-1">Experience</h4>
            <textarea name="experience" value={cvData.experience} onChange={handleInputChange} className={`w-full bg-slate-900/40 text-sm p-3 rounded-xl h-24 border ${!cvData.experience ? 'border-red-500 text-red-400 bg-red-500/5' : 'border-white/10 text-slate-300'}`} placeholder="[Experience Empty]" />
          </div>
          <div>
            <h4 className="text-xs text-indigo-400 uppercase font-bold mb-1">Education</h4>
            <textarea name="education" value={cvData.education} onChange={handleInputChange} className={`w-full bg-slate-900/40 text-sm p-3 rounded-xl h-24 border ${!cvData.education ? 'border-red-500 text-red-400 bg-red-500/5' : 'border-white/10 text-slate-300'}`} placeholder="[Education Empty]" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewCv;