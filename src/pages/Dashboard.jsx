import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [cvs, setCvs] = useState([]);
  const [positions, setPositions] = useState([]); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedCvIds, setSelectedCvIds] = useState([]);
  const user = JSON.parse(localStorage.getItem('user')) 

  const [formData, setFormData] = useState({
    title: '', 
    positionId: '',
    fullName: user?.name || '', 
    email: user?.email || '', 
    phone: '', 
    summary: '', 
    skills: '', 
    ieltsScore: '', 
    experience: '', 
    education: ''
  });

  const fetchCvs = async () => {
  if (!user?.id) return;
  try {
    const response = await fetch(`http://localhost:5001/api/cv/user/${user.id}`, {
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data)) {
        const formattedCvs = data.map(cv => ({
          ...cv,
          fullName: cv.fullName || cv.user?.name || '',
          title: cv.title || cv.position?.title || ''
        }));
        setCvs(formattedCvs);
      }
    }
  } catch (error) {
    console.error(error);
  }
};

  const fetchPositions = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/cv/positions/all');
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data)) {
          setPositions(data);
          if (data.length > 0) {
            setFormData(prev => ({ ...prev, positionId: data[0].id }));
          }
        }
      } else {
        console.error("Failed to fetch positions");
      }
    } catch (error) {
      console.error("Error loading positions:", error);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchCvs();
      fetchPositions(); 
    }
  }, [user?.id]);

  useEffect(() => {
    if (location.state?.openCreateCvModal) {
      setIsModalOpen(true);
    }
  }, [location.state]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.positionId) {
      alert("Please select a position template!");
      return;
    }
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5001/api/cv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ...formData, 
          userId: user.id,
          positionId: Number(formData.positionId) 
        })
      });
      
      if (response.ok) {
        setIsModalOpen(false);
        setFormData(prev => ({
          title: '', 
          positionId: positions[0]?.id || '', 
          fullName: user?.name || '', 
          email: user?.email || '', 
          phone: '', 
          summary: '', 
          skills: '', 
          ieltsScore: '', 
          experience: '', 
          education: ''
        }));
        fetchCvs();
      }
      else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error || 'Something went wrong'}`);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCv = (id) => {
    setSelectedCvIds(prev => prev.includes(id) ? prev.filter(cvId => cvId !== id) : [...prev, id]);
  };

  const handleBulkDelete = async () => {
    if (selectedCvIds.length === 0) return;
    if (window.confirm('Delete selected CVs?')) {
      const res = await fetch('http://localhost:5001/api/cv/bulk-delete', { // Correct endpoint
        method: 'POST', // Correct HTTP method
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedCvIds })
      });
      if (res.ok) {
        setSelectedCvIds([]);
        fetchCvs();
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Welcome, {user.name}</h1>
        <div className="flex gap-5 mr-35 ">
          <button onClick={() => setIsModalOpen(true)} className="btn btn-sm btn-primary">➕ Create CV</button>
          <button onClick={() => navigate(`/view-cv/${selectedCvIds[0]}`)} disabled={selectedCvIds.length !== 1} className="btn btn-sm btn-info text-white">👁️ View</button>
          <button onClick={handleBulkDelete} disabled={selectedCvIds.length === 0} className="btn btn-sm btn-error text-white">🗑️ Delete</button>
        </div>
      </div>

      <div className="overflow-x-auto bg-slate-800 rounded-xl border border-white/10">
        <table className="table w-full text-center text-slate-200">
         
          <thead>
            <tr className="bg-slate-700/50 text-slate-300">
              <th className="w-12 text-center">Select</th>
              <th>CV Title</th>
              <th>Target Position Template</th>
              <th>IELTS Score</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {cvs.map(cv => (
              <tr key={cv.id} className="hover:bg-white/5 border-b border-white/5">
                <td className="text-center"><input type="checkbox" className="checkbox checkbox-sm checkbox-primary" checked={selectedCvIds.includes(cv.id)} onChange={() => handleSelectCv(cv.id)} /></td>
                <td className="font-semibold text-purple-400 cursor-pointer hover:underline" onClick={() => navigate(`/view-cv/${cv.id}`)}>{cv.title || 'Untitled CV'}</td>
                <td><span className="badge badge-ghost text-xs font-semibold">{cv.positionTitle}</span></td>
                <td>{cv.ieltsScore || <span className="text-red-400 font-bold">Empty</span>}</td>
                <td>{new Date(cv.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="modal modal-open mt-5  text-center flex items-center justify-center   ">
          <div className="modal-box bg-slate-800/95 rounded-4xl backdrop-blur-sm border border-white/10 max-w-4xl text-slate-200 shadow-2xl shadow-purple-500/10 p-0">
            <div className="p-6 sm:p-8">
            <h3 className="font-bold text-2xl mb-1 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Create a New CV</h3>
            <p className="text-sm text-slate-400 mb-6">Fill in the details below to generate a new CV based on a template.</p>
            </div>

            <form onSubmit={handleSubmit} className="p-6  ">
              <div className="space-y-6">
              
              <div>
                  <h4 className="text-sm font-semibold text-slate-400 border-b border-white/80 pb-2 mb-4">Basic Info</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="form-control w-full">
                      <label className="label text-xs text-slate-400 font-medium">CV  Title </label>
                      <input type="text" name="title" placeholder=" My Frontend CV ...." className="input input-bordered border border-b-gray-600  w-full bg-slate-800/50 border-slate-600 rounded-xl text-sm focus:border-purple-500 transition-all" value={formData.title} onChange={handleChange} required />
                    </div>
                    <div className="form-control w-full">
                      <label className="label text-xs text-slate-400 font-medium">Full Name </label>
                      <input type="text" name="fullName" placeholder="Your Full Name" className="input input-bordered border border-b-gray-600 w-full bg-slate-800/50 border-slate-600 rounded-xl text-sm focus:border-purple-500 transition-all" value={formData.fullName} onChange={handleChange} required />
                    </div>
                    <div className="form-control w-full sm:col-span-2"> 
                      <label className="label text-xs text-indigo-400 font-bold">Target Position Template  </label>
                      <select name="positionId" className="select select-bordered w-1/2 border border-b-gray-600 bg-slate-800/50 border-slate-600 rounded-xl text-sm ml-3 focus:border-purple-500 text-slate-200 transition-all" value={formData.positionId} onChange={handleChange} required>
                        {positions.map(p => <option key={p.id} value={p.id} className="bg-slate-900 text-slate-200">{p.title}</option>)}
                      </select>
                    </div>
                  </div>
              </div>

              <div>
                  <h4 className="inline-block text-sm font-semibold text-slate-400 border-b border-white/80 pb-1 mb-4">Professional Details</h4>
                  <div className="space-y-4 text-start">
                    <div className="form-control w-full">
                      <label className="label text-[16px] text-slate-400 font-medium">Skills (comma separated)</label>
                      <input type="text" name="skills" placeholder="React, Node.js, Python, etc." className="input input-bordered border border-b-gray-600 w-full h-10 bg-slate-800/50 border-slate-600 rounded-xl text-sm focus:border-purple-500 transition-all" value={formData.skills} onChange={handleChange} />
                    </div>
                   <div>
                     <label className="label text-[16px] text-slate-400 font-medium">Professional Summary</label>
                    <textarea name="summary" placeholder=" Summary ......." className="textarea textarea-bordered w-full border border-b-gray-600 bg-slate-800/50 border-slate-600 rounded-xl text-sm h-20 focus:border-purple-500 transition-all" value={formData.summary} onChange={handleChange} />
                    </div>
                    <div>
                         <label className="label text-[16px] text-slate-400 font-medium">Work Experience</label>
                    <textarea name="experience" placeholder=" Experience" className="textarea textarea-bordered w-full bg-slate-800/50 border border-b-gray-600 border-slate-600 rounded-xl text-sm h-24 focus:border-purple-500 transition-all" value={formData.experience} onChange={handleChange} />
                    </div>
                    <div>
                                              <label className="label text-[16px] text-slate-400 font-medium">Education </label>   
                    <textarea name="education" placeholder="Education" className="textarea textarea-bordered w-full bg-slate-800/50 border-slate-600 border border-b-gray-600 rounded-xl text-sm h-20 focus:border-purple-500 transition-all" value={formData.education} onChange={handleChange} />
                    </div>
                  </div>
              </div>

              <div>
                  <h4 className="text-sm font-semibold text-slate-400 border-b border-white/80 pb-2 mb-4">Contact Details</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="form-control w-full">
                      <label className="label text-xs text-slate-400 font-medium">Email </label>
                      <input type="email" name="email" placeholder="your.email@example.com" className="input input-bordered border border-b-gray-600 w-full bg-slate-800/50 border-slate-600 rounded-xl text-sm focus:border-purple-500 transition-all" value={formData.email} onChange={handleChange} required />
                    </div>
                    <div className="form-control w-full">
                      <label className="label text-xs text-slate-400 font-medium">Phone</label>
                      <input type="text" name="phone" placeholder="+123456789" className="input input-bordered border border-b-gray-600 w-full bg-slate-800/50 border-slate-600 rounded-xl text-sm focus:border-purple-500 transition-all" value={formData.phone} onChange={handleChange} />
                    </div>
                    <div className="form-control w-full">
                      <label className="label text-xs text-slate-400 font-medium">IELTS Score</label>
                      <input type="text" name="ieltsScore" placeholder="e.g., 7.5" className="input input-bordered border border-b-gray-600 w-full bg-slate-800/50 border-slate-600 rounded-xl text-sm focus:border-purple-500 transition-all" value={formData.ieltsScore} onChange={handleChange} />
                    </div>
                  </div>
              </div>
              </div>

             
              <div className="modal-action mt-8 gap-3 pt-4 border-t border-white/10">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-ghost text-slate-300">Cancel</button>
                <button type="submit" className="btn  btn-primary bg-gradient-to-r ml-3 rounded-2xl w-28 from-blue-500 to-purple-600 border-none text-white" disabled={loading}>
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