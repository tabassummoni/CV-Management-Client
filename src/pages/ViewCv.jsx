import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown'; 

const useDebounce = (callback, delay) => {
  const [timeoutId, setTimeoutId] = useState(null);

  return (...args) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    const newTimeoutId = setTimeout(() => callback(...args), delay);
    setTimeoutId(newTimeoutId);
  };
};

const ViewCv = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all'); 

  const [cvData, setCvData] = useState({
    id: null,
    title: '',
    version: 1, 
    fullName: '',
    email: '',
    phone: '',
    ieltsScore: '', 
    summary: '',
    skills: '',
    experience: '',
    education: '',
    positionTitle: '',
    projects: []
  });

  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetch(`http://localhost:5001/api/cv/${id}`)
      .then(res => res.json())
      .then(data => {
        setCvData({
          id: data.id,
          title: data.title || '',
          version: data.version || 1,
          fullName: data.fullName || '', 
          email: data.email || '', 
          phone: data.phone || '',
          ieltsScore: data.ieltsScore || '', 
          summary: data.summary || '', 
          skills: data.skills || '',
          experience: data.experience || '', 
          education: data.education || '',
          positionTitle: data.positionTitle || 'Frontend Developer Template',
          projects: data.projects || []
        });
      })
      .catch(err => console.error("Error loading CV:", err))
      .finally(() => setLoading(false));
  }, [id]);

  const handleFieldChange = async (field, value) => {
    // Optimistically update the UI
    setIsSaving(true);
    setErrorMsg('');

    try {
      const response = await fetch(`http://localhost:5001/api/cv/${id}/inplace`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          field,
          value,
          version: cvData.version
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Update version from server response
        if (data.cv) setCvData(prev => ({ ...prev, version: data.cv.version, [field]: data.cv[field] }));
      } else {
        // If save fails, show error and revert UI change
        setErrorMsg(`Failed to save ${field}: ${data.error || 'Unknown error'}`);
        // Note: For a better UX, you might want to refetch the original data here
      }
    } catch (error) {
      setErrorMsg('Connection failure.');
    } finally {
      setIsSaving(false);
    }
  };

  const debouncedSave = useDebounce(handleFieldChange, 500);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCvData(prev => ({ ...prev, [name]: value }));
    debouncedSave(name, value);
  };

  const getInputClass = (extra = '') => {
    return `w-full bg-slate-900/60 border border-white/20 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:border-purple-500 focus:outline-none transition-all mt-1 block ${extra}`;
  };

  if (loading) return <div className="min-h-screen bg-slate-900 text-slate-400 flex items-center justify-center">Generating CV Template...</div>;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 md:p-8 font-sans">
      
      <div className="max-w-4xl mx-auto mb-6 flex justify-between items-center">
        <button onClick={() => navigate('/dashboard')} className="btn btn-sm btn-outline text-slate-300 rounded-xl">⬅️ Dashboard</button>
        <div className="flex items-center gap-4">
          <span className="text-xs bg-purple-500/20 text-purple-400 px-3 py-1.5 rounded-xl border border-purple-500/30">Version: {cvData.version}</span>
          <button disabled={isSaving} className="btn btn-sm bg-emerald-500 text-slate-900 font-bold rounded-xl px-4">
            {isSaving ? 'Saving...' : '💾 Auto-Saved'}
          </button>
        </div>
      </div>

      {errorMsg && <div className="max-w-4xl mx-auto mb-4 alert alert-error text-xs rounded-xl">{errorMsg}</div>}

      <div className="max-w-4xl mx-auto bg-slate-800 border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
        
        <div className="flex bg-slate-950/60 border-b border-white/10 overflow-x-auto patches-nav">
          <button onClick={() => setActiveTab('all')} className={`px-6 py-4 text-xs font-bold uppercase tracking-wider transition-all border-b-2 whitespace-nowrap ${activeTab === 'all' ? 'border-purple-500 text-purple-400 bg-white/5' : 'border-transparent text-slate-400 hover:text-slate-200'}`}>📋 Full CV View</button>
          <button onClick={() => setActiveTab('contact')} className={`px-6 py-4 text-xs font-bold uppercase tracking-wider transition-all border-b-2 whitespace-nowrap ${activeTab === 'contact' ? 'border-purple-500 text-purple-400 bg-white/5' : 'border-transparent text-slate-400 hover:text-slate-200'}`}>👤 Contact Info</button>
          <button onClick={() => setActiveTab('projects')} className={`px-6 py-4 text-xs font-bold uppercase tracking-wider transition-all border-b-2 whitespace-nowrap ${activeTab === 'projects' ? 'border-purple-500 text-purple-400 bg-white/5' : 'border-transparent text-slate-400 hover:text-slate-200'}`}>🚀 Tailored Projects ({cvData.projects.length})</button>
        </div>

        <div className="p-6 md:p-10 space-y-8">
          
          <div className="pb-2 border-b border-white/5 flex justify-between items-center">
            <h2 className="text-xl font-black text-slate-100">CV Title: {cvData.title}</h2>
            <span className="text-xs bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-3 py-1 rounded-full font-bold">
              {cvData.positionTitle}
            </span>
          </div>

          {(activeTab === 'all' || activeTab === 'contact') && (
            <div className="space-y-6">
              <div>
                <label className="text-xs font-bold text-purple-400 uppercase tracking-wider block">Full Name</label>
                <input type="text" name="fullName" value={cvData.fullName} onChange={handleInputChange} className={getInputClass("text-base font-semibold")} placeholder="Your Full Name" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="text-xs text-slate-400 block font-bold uppercase tracking-wider">Email</label>
                  <input type="email" name="email" value={cvData.email} onChange={handleInputChange} className={getInputClass()} placeholder="name@example.com" />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block font-bold uppercase tracking-wider">Phone</label>
                  <input type="text" name="phone" value={cvData.phone} onChange={handleInputChange} className={getInputClass()} placeholder="+8801..." />
                </div>
                <div>
                  <label className="text-xs text-indigo-300 font-bold block uppercase tracking-wider">IELTS Score</label>
                  <input type="text" name="ieltsScore" value={cvData.ieltsScore} onChange={handleInputChange} className={getInputClass("font-bold text-indigo-300")} placeholder="e.g. 7.5" />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 uppercase font-bold tracking-wider block">Professional Summary</label>
                <textarea name="summary" value={cvData.summary} onChange={handleInputChange} className="w-full bg-slate-900/60 border border-white/20 rounded-xl p-3 h-24 text-sm text-slate-200 focus:border-purple-500 focus:outline-none transition-all mt-1 resize-none" placeholder="Write summary..." />
              </div>

              <div>
                <label className="text-xs text-slate-400 uppercase font-bold tracking-wider block">Skills</label>
                <input type="text" name="skills" value={cvData.skills} onChange={handleInputChange} className={getInputClass()} placeholder="React, Vite, Tailwind..." />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div>
                  <label className="text-xs text-slate-400 uppercase font-bold tracking-wider block">Experience</label>
                  <textarea name="experience" value={cvData.experience} onChange={handleInputChange} className="w-full bg-slate-900/60 border border-white/20 rounded-xl p-3 h-28 text-sm text-slate-200 focus:border-purple-500 focus:outline-none transition-all mt-1 resize-none" placeholder="Describe your experience..." />
                </div>
                <div>
                  <label className="text-xs text-slate-400 uppercase font-bold tracking-wider block">Education</label>
                  <textarea name="education" value={cvData.education} onChange={handleInputChange} className="w-full bg-slate-900/60 border border-white/20 rounded-xl p-3 h-28 text-sm text-slate-200 focus:border-purple-500 focus:outline-none transition-all mt-1 resize-none" placeholder="University, Degrees..." />
                </div>
              </div>
            </div>
          )}

          {(activeTab === 'all' || activeTab === 'projects') && (
            <div className="pt-6 border-t border-white/10 space-y-6">
              <h4 className="text-xs text-purple-400 uppercase font-bold tracking-wider">🚀 Dynamically Tailored Projects</h4>
              
              {cvData.projects.length === 0 ? (
                <p className="text-xs text-slate-500 italic bg-slate-900/30 p-4 rounded-xl border border-dashed border-white/5">
                  No matching projects found with the required technology tags in your profile.
                </p>
              ) : (
                <div className="space-y-6">
                  {cvData.projects.map(project => (
                    <div key={project.id} className="bg-slate-900/40 border border-white/5 p-5 rounded-2xl shadow-md space-y-3">
                      <div className="flex justify-between items-start">
                        <h5 className="text-sm font-bold text-slate-100">{project.name}</h5>
                        <span className="text-[10px] text-slate-400 bg-slate-950/60 px-2.5 py-1 rounded-md font-mono">{project.period}</span>
                      </div>

                      <div className="text-xs text-slate-300 prose prose-invert max-w-none bg-slate-950/30 p-4 rounded-xl border border-white/5 leading-relaxed">
                        <ReactMarkdown>{project.description}</ReactMarkdown>
                      </div>

                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {project.tags && project.tags.split(',').map((tag, i) => (
                          <span key={i} className="text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-400 border border-purple-500/20">
                            {tag.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default ViewCv;