import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Notification = ({ message, type, onDismiss }) => (
  <div className={`fixed top-5 right-5 alert ${type === 'success' ? 'alert-success text-success-content' : 'alert-error text-error-content'} shadow-2xl w-auto max-w-sm z-50 rounded-xl p-4 flex items-center justify-between gap-4 backdrop-blur-md`}>
    <span className="text-sm font-medium">{message}</span>
    <button onClick={onDismiss} className="btn btn-sm btn-circle btn-ghost text-xs">✕</button>
  </div>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const [cvs, setCvs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [selectedCvIds, setSelectedCvIds] = useState([]);

  const [formData, setFormData] = useState({
    title: '',
    fullName: '',
    email: '',
    phone: '',
    summary: '',
    skills: '',
    ieltsScore: '',
    experience: '',
    education: ''
  });

  const user = JSON.parse(localStorage.getItem('user')) || { id: 1, name: 'Fouzia', email: 'fouzia@iu.com' }; 

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (!token || !storedUser) {
      alert("🔒 Access Denied! Please Login or Sign Up first to access your dashboard.");
      navigate('/login');
      return;
    }

    setIsInitialLoading(true);
    fetch(`http://localhost:5001/api/cv/user/${user.id}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setCvs(data);
      })
      .catch(err => {
        console.error("Error fetching CVs:", err);
        setNotification({ show: true, message: 'Failed to fetch CVs.', type: 'error' });
      })
      .finally(() => setIsInitialLoading(false));
  }, [user.id, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = { ...formData, userId: user.id };

    try {
      const response = await fetch('http://localhost:5001/api/cv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setNotification({ show: true, message: '🎉 CV Created Successfully!', type: 'success' });
        setCvs([data.cv, ...cvs]); 
        setIsModalOpen(false); 
        setFormData({ title: '', fullName: '', email: '', phone: '', summary: '', skills: '', ieltsScore: '', experience: '', education: '' });
      } else {
        setNotification({ show: true, message: data.error || 'Something went wrong', type: 'error' });
      }
    } catch (error) {
      console.error("Submission error:", error);      
      setNotification({ show: true, message: 'Failed to connect to the server.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCv = (id) => {
    if (selectedCvIds.includes(id)) {
      setSelectedCvIds(selectedCvIds.filter(cvId => cvId !== id));
    } else {
      setSelectedCvIds([...selectedCvIds, id]);
    }
  };

  const handleSelectAll = () => {
    if (selectedCvIds.length === cvs.length) {
      setSelectedCvIds([]);
    } else {
      setSelectedCvIds(cvs.map(cv => cv.id));
    }
  };

  const handleViewSelected = () => {
    if (selectedCvIds.length === 1) {
      const selectedId = selectedCvIds[0];
      navigate(`/view-cv/${selectedId}`); 
    }
  };

  const handleBulkDelete = async () => {
    if (selectedCvIds.length === 0) return;
    
    if (window.confirm(`Are you sure you want to delete the selected ${selectedCvIds.length} CV(s)?`)) {
      setLoading(true);
      try {
        setNotification({ show: true, message: '🚀 Selected CVs removed successfully!', type: 'success' });
        setCvs(cvs.filter(cv => !selectedCvIds.includes(cv.id)));
        setSelectedCvIds([]);
      } catch (error) {
        setNotification({ show: true, message: 'Failed to delete selected CVs.', type: 'error' });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-slate-100 p-4 md:p-12 font-sans">
      
      {notification.show && (
        <Notification message={notification.message} type={notification.type} onDismiss={() => setNotification({ show: false, message: '', type: '' })} />
      )}
      
      <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-6 mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-xl">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-wide bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Welcome back, {user.name}!
          </h1>
          <p className="text-slate-400 text-xs md:text-sm mt-1">Manage your CVs using compliant structured tables.</p>
        </div>
      </div>

      <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-4 mb-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-slate-300">
            Selected CVs: <span className="text-purple-400 font-bold">{selectedCvIds.length}</span>
          </span>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="btn btn-sm btn-primary bg-gradient-to-r from-blue-500 to-purple-600 border-none text-white rounded-lg px-4"
          >
            ➕ Create New CV
          </button>

          <button 
            onClick={handleViewSelected}
            disabled={selectedCvIds.length !== 1}
            className="btn btn-sm btn-info text-white disabled:bg-slate-800 disabled:text-slate-600 rounded-lg px-4 border-none"
          >
            👁️ View Selected
          </button>

          <button 
            onClick={handleBulkDelete}
            disabled={selectedCvIds.length === 0 || loading}
            className="btn btn-sm btn-error text-white disabled:bg-slate-800 disabled:text-slate-600 rounded-lg px-4 border-none"
          >
            🗑️ Delete Selected
          </button>
        </div>
      </div>

      <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="table w-full text-left border-collapse">
            
            <thead className="bg-slate-800/80 text-slate-300 text-xs uppercase tracking-wider border-b border-white/10">
              <tr>
                <th className="p-4 w-12 text-center">
                  <input 
                    type="checkbox" 
                    className="checkbox checkbox-primary checkbox-sm rounded"
                    checked={cvs.length > 0 && selectedCvIds.length === cvs.length}
                    onChange={handleSelectAll}
                  />
                </th>
                <th className="p-4">CV Title (Click text or use toolbar)</th>
                <th className="p-4">Position Template</th>
                <th className="p-4 text-center">IELTS Score</th>
                <th className="p-4 text-right">Created Date</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/5 text-sm">
              {isInitialLoading ? (
                <tr>
                  <td colSpan="5" className="p-12 text-center text-slate-500 animate-pulse">
                    Loading your CV grid structure...
                  </td>
                </tr>
              ) : cvs.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-12 text-center text-slate-400 italic">
                    No CVs found. Access a template to generate one.
                  </td>
                </tr>
              ) : (
                cvs.map((cv) => (
                  <tr 
                    key={cv.id} 
                    className={`hover:bg-white/5 transition-colors ${selectedCvIds.includes(cv.id) ? 'bg-purple-950/20' : ''}`}
                  >
                    <td className="p-4 text-center">
                      <input 
                        type="checkbox" 
                        className="checkbox checkbox-primary checkbox-sm rounded"
                        checked={selectedCvIds.includes(cv.id)}
                        onChange={() => handleSelectCv(cv.id)}
                      />
                    </td>
                    
                    <td className="p-4 font-semibold text-slate-200">
                      <spen href={`/view-cv/${cv.id}`} className="hover:underline hover:text-purple-400 transition-all cursor-pointer">
                        {cv.title}
                      </spen>
                    </td>
                    
                    <td className="p-4 text-slate-400">
                      {cv.positionTitle || 'Standard Profile'}
                    </td>
                    
                    <td className="p-4 text-center">
                      {cv.ieltsScore ? (
                        <span className="badge badge-accent badge-outline font-bold text-xs">{cv.ieltsScore}</span>
                      ) : (
                        <span className="text-red-400 font-bold bg-red-500/10 px-2 py-0.5 rounded text-xs border border-red-500/20">Empty</span>
                      )}
                    </td>
                    
                    <td className="p-4 text-right text-xs text-slate-400">
                      {cv.createdAt ? new Date(cv.createdAt).toLocaleDateString() : '11/07/2026'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>

          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal modal-open backdrop-blur-sm bg-black/60 z-40 transition-all duration-300">
          <div className="modal-box bg-slate-900 border border-white/10 max-w-2xl text-slate-200 p-6 rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="font-extrabold text-2xl mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Create a Professional CV
            </h3>
            <p className="text-xs text-slate-400 mb-6">Fill in the fields below to push your new resume data to the cloud.</p>
            
            <form onSubmit={handleSubmit} className="space-y-6">

              <div>
                <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider border-b border-slate-800 pb-2 mb-4">Basic Information</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="form-control w-full">
                    <label className="label text-xs text-slate-400 font-medium">CV Title *</label>
                    <input type="text" name="title" placeholder="e.g., Frontend Developer Resume" className="input input-bordered w-full bg-slate-800/50 border-white/10 rounded-xl text-sm focus:border-purple-500 transition-all" value={formData.title} onChange={handleChange} required />
                  </div>
                  <div className="form-control w-full">
                    <label className="label text-xs text-slate-400 font-medium">Full Name *</label>
                    <input type="text" name="fullName" placeholder="Fouzia Tabassum" className="input input-bordered w-full bg-slate-800/50 border-white/10 rounded-xl text-sm focus:border-purple-500 transition-all" value={formData.fullName} onChange={handleChange} required />
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider border-b border-slate-800 pb-2 mb-4">Contact & Credentials</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="form-control w-full sm:col-span-1">
                    <label className="label text-xs text-slate-400 font-medium">Email *</label>
                    <input type="email" name="email" placeholder="example@gmail.com" className="input input-bordered w-full bg-slate-800/50 border-white/10 rounded-xl text-sm focus:border-purple-500 transition-all" value={formData.email} onChange={handleChange} required />
                  </div>
                  <div className="form-control w-full">
                    <label className="label text-xs text-slate-400 font-medium">Phone</label>
                    <input type="text" name="phone" placeholder="+49 123 456789" className="input input-bordered w-full bg-slate-800/50 border-white/10 rounded-xl text-sm focus:border-purple-500 transition-all" value={formData.phone} onChange={handleChange} />
                  </div>
                  <div className="form-control w-full">
                    <label className="label text-xs text-indigo-300 font-semibold flex items-center gap-1">IELTS Score</label>
                    <input type="text" name="ieltsScore" placeholder="e.g., 7.5" className="input input-bordered w-full bg-slate-800/50 border-indigo-500/30 text-indigo-300 rounded-xl text-sm focus:border-indigo-400 font-bold transition-all" value={formData.ieltsScore} onChange={handleChange} />
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider border-b border-slate-800 pb-2 mb-4">Professional Details</h4>
                <div className="space-y-4">
                  <div className="form-control w-full">
                    <label className="label text-xs text-slate-400 font-medium">Skills</label>
                    <input type="text" name="skills" placeholder="React, Vite, Tailwind CSS v4, daisyUI" className="input input-bordered w-full bg-slate-800/50 border-white/10 rounded-xl text-sm focus:border-purple-500 transition-all" value={formData.skills} onChange={handleChange} />
                  </div>

                  <div className="form-control w-full">
                    <label className="label text-xs text-slate-400 font-medium">Professional Summary</label>
                    <textarea name="summary" placeholder="Briefly describe your career goal and core expertise..." className="textarea textarea-bordered w-full bg-slate-800/50 border-white/10 rounded-xl text-sm h-20 focus:border-purple-500 transition-all p-3" value={formData.summary} onChange={handleChange} />
                  </div>

                  <div className="form-control w-full">
                    <label className="label text-xs text-slate-400 font-medium">Experience</label>
                    <textarea name="experience" placeholder="Company Name - Role (Year)&#10;• Achieved X using Y... " className="textarea textarea-bordered w-full bg-slate-800/50 border-white/10 rounded-xl text-sm h-24 focus:border-purple-500 transition-all p-3" value={formData.experience} onChange={handleChange} />
                  </div>

                  <div className="form-control w-full">
                    <label className="label text-xs text-slate-400 font-medium">Education</label>
                    <textarea name="education" placeholder="Degree/Major - University/Institution (Year)" className="textarea textarea-bordered w-full bg-slate-800/50 border-white/10 rounded-xl text-sm h-20 focus:border-purple-500 transition-all p-3" value={formData.education} onChange={handleChange} />
                  </div>
                </div>
              </div>

              <div className="modal-action border-t border-white/10 pt-4 flex justify-end gap-3 mt-8">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-outline border-white/20 text-slate-300 hover:bg-white/10 rounded-xl px-5">Cancel</button>
                <button type="submit" className={`btn btn-primary bg-gradient-to-r from-blue-500 to-purple-600 text-white border-none rounded-xl px-6 shadow-lg shadow-purple-500/20 ${loading ? 'loading' : ''}`} disabled={loading}>
                  Saving...
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Dashboard;