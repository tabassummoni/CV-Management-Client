import React, { useState, useEffect } from 'react';

const CvCard = ({ cv }) => (
  <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-5 hover:border-purple-500/50 transition-all shadow-lg hover:shadow-purple-500/10 flex flex-col justify-between">
    <div>
      <h3 className="text-lg font-bold text-slate-200 tracking-wide">{cv.title}</h3>
      <p className="text-xs text-slate-400 mt-1">For: {cv.fullName}</p>
      {cv.ieltsScore && (
        <div className="badge badge-accent badge-outline mt-3 text-xs font-semibold px-2 py-2">IELTS: {cv.ieltsScore}</div>
      )}
    </div>
    <div className="mt-5 flex gap-2">
      <button className="btn btn-xs btn-outline btn-info flex-1 rounded-lg">View</button>
      <button className="btn btn-xs btn-outline btn-error flex-1 rounded-lg">Delete</button>
    </div>
  </div>
);

const CvSkeleton = () => (
  <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-5 shadow-lg animate-pulse">
    <div className="h-5 bg-slate-700/50 rounded-lg w-3/4 mb-2"></div>
    <div className="h-3 bg-slate-700/50 rounded-lg w-1/2 mb-4"></div>
    <div className="h-6 bg-slate-700/50 rounded-lg w-1/4"></div>
    <div className="mt-5 flex gap-2">
      <div className="h-6 flex-1 bg-slate-700/50 rounded-lg"></div>
      <div className="h-6 flex-1 bg-slate-700/50 rounded-lg"></div>
    </div>
  </div>
);

const Notification = ({ message, type, onDismiss }) => (
  <div className={`fixed top-5 right-5 alert ${type === 'success' ? 'alert-success text-success-content' : 'alert-error text-error-content'} shadow-2xl w-auto max-w-sm z-50 rounded-xl p-4 flex items-center justify-between gap-4 backdrop-blur-md`}>
    <span className="text-sm font-medium">{message}</span>
    <button onClick={onDismiss} className="btn btn-sm btn-circle btn-ghost text-xs">✕</button>
  </div>
);

const Dashboard = () => {
  const [cvs, setCvs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  
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
    setIsInitialLoading(true);
    fetch(`http://localhost:5000/api/cv/user/${user.id}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setCvs(data);
      })
      .catch(err => {
        console.error("Error fetching CVs:", err);
        setNotification({ show: true, message: 'Failed to fetch CVs.', type: 'error' });
      })
      .finally(() => setIsInitialLoading(false));
  }, [user.id]);

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
          <p className="text-slate-400 text-xs md:text-sm mt-1">Manage your professional resumes and CVs here.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="btn btn-primary w-full sm:w-auto bg-gradient-to-r from-blue-500 to-purple-600 border-none text-white hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-purple-500/25 rounded-xl px-6"
        >
          ➕ Create New CV
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-bold text-slate-300 flex items-center gap-2">
            📂 Your Resumes <div className="badge badge-secondary px-2 py-2 font-bold">{cvs.length}</div>
          </h2>
          
          {isInitialLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => <CvSkeleton key={i} />)}
            </div>
          ) : cvs.length === 0 ? (
            <div className="backdrop-blur-sm bg-white/5 border border-dashed border-white/20 rounded-xl p-12 text-center text-slate-400">
              No CVs found. Click "Create New CV" to build your first one!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {cvs.map((cv) => <CvCard key={cv.id} cv={cv} />)}
            </div>
          )}
        </div>

        <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-6 h-fit shadow-lg space-y-4">
          <h2 className="text-xl font-bold text-slate-300">Quick Stats</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center border-b border-white/10 pb-2">
              <span className="text-slate-400 text-sm">Account Email</span>
              <span className="badge badge-primary badge-outline text-xs font-semibold px-2 py-2 max-w-[160px] truncate">{user.email}</span>
            </div>
            <div className="flex justify-between items-center border-b border-white/10 pb-2">
              <span className="text-slate-400 text-sm">Total CVs</span>
              <span className="text-slate-200 font-bold">{cvs.length}</span>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal modal-open backdrop-blur-sm bg-black/60 z-40 transition-all duration-300">
          <div className="modal-box bg-slate-900 border border-white/10 max-w-2xl text-slate-200 p-6 rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
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
                  {loading ? 'Saving...' : 'Save CV'}
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