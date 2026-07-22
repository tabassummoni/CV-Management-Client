import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config/api.jsx';

const RecruiterDashboard = () => {
  const [positions, setPositions] = useState([]);
  const [applications, setApplications] = useState([]);
  const [reacts, setReacts] = useState({});
  const [pendingReacts, setPendingReacts] = useState({});
  const [activeApplicationId, setActiveApplicationId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPositionIds, setSelectedPositionIds] = useState([]);
  const [activeTab, setActiveTab] = useState('positions');
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const posRes = await fetch(new URL('/api/positions/all', API_BASE_URL).href);
      if (posRes.ok) {
        const posData = await posRes.json();
        setPositions(posData);
      }

      const appRes = await fetch(new URL('/api/applications/all', API_BASE_URL).href);
      if (appRes.ok) {
        const appData = await appRes.json();
        setApplications(appData);
      }

      const reactRes = await fetch(new URL('/api/applications/reacts', API_BASE_URL).href);
      if (reactRes.ok) {
        const reactData = await reactRes.json();
        setReacts(reactData);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSelectPosition = (id) => {
    setSelectedPositionIds(prev => 
      prev.includes(id) ? prev.filter(posId => posId !== id) : [...prev, id]
    );
  };

  const handleBulkDuplicate = async () => {
    if (selectedPositionIds.length === 0) return;
    try {
      const res = await fetch(new URL('/api/positions/bulk-duplicate', API_BASE_URL).href, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedPositionIds })
      });
      if (res.ok) {
        fetchData();
        setSelectedPositionIds([]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedPositionIds.length === 0) return;
    if (window.confirm(`Are you sure you want to delete ${selectedPositionIds.length} selected position(s)?`)) {
      try {
        const res = await fetch(new URL('/api/positions/bulk-delete', API_BASE_URL).href, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ids: selectedPositionIds })
        });
        if (res.ok) {
          fetchData();
          setSelectedPositionIds([]);
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleSelectReact = (appId, type) => {
    setPendingReacts(prev => {
      if (prev[appId] === type) {
        setActiveApplicationId(null);
        const updated = { ...prev };
        delete updated[appId];
        return updated;
      }
      setActiveApplicationId(appId);
      return { [appId]: type };
    });
  };

  const handleSendFeedback = async () => {
    if (!activeApplicationId) {
      alert("Please click Love ❤️ or Like 👍 react for a candidate first.");
      return;
    }

    const selectedApp = applications.find(app => app.id === activeApplicationId);
    const selectedType = pendingReacts[activeApplicationId];

    if (!selectedApp || !selectedType) return;

    try {
      const res = await fetch(new URL('/api/applications/react', API_BASE_URL).href, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          positionId: selectedApp.positionId,
          userId: selectedApp.userId,
          type: selectedType,
        }),
      });

      if (res.ok) {
        alert("🎉 Feedback submitted successfully!");
        setPendingReacts({});
        setActiveApplicationId(null);
        await fetchData();
      } else {
        alert("Failed to send feedback.");
      }
    } catch (error) {
      console.error('Error submitting react feedback:', error);
      alert("An error occurred while sending feedback.");
    }
  };

  return (
    <div className="w-full p-6 bg-base-100 rounded-2xl shadow-xl min-h-screen text-white">
      <div className="flex justify-between items-center mb-6 border-b border-base-200 pb-4 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-wide">Recruiter Management Panel</h1>
          <p className="text-xs opacity-60 mt-1">Manage shared job positions, templates, and view candidate responses</p>
        </div>
        
        {activeTab === 'positions' && (
          <div className="flex items-center gap-2">
            <button 
              onClick={() => navigate('/recruiter/positions/new')}
              className="btn btn-primary rounded-xl text-white font-bold px-5 text-sm"
            >
              ➕ New Position
            </button>
            <button 
              onClick={() => navigate(`/recruiter/positions/edit/${selectedPositionIds[0]}`)}
              disabled={selectedPositionIds.length !== 1}
              className="btn btn-info btn-sm rounded-xl text-white"
            >
              ✏️ Edit
            </button>
            <button onClick={handleBulkDelete} disabled={selectedPositionIds.length === 0} className="btn btn-error btn-sm rounded-xl ml-2 text-white">
              🗑️ Delete
            </button>
          </div>
        )}
        
        {activeTab === 'applications' && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleSendFeedback}
              disabled={!activeApplicationId}
              className="btn btn-success rounded-xl text-white font-bold px-5 text-sm shadow-md"
            >
              Send Your Feedback
            </button>
          </div>
        )}
      </div>

      <div className="tabs tabs-boxed bg-base-200 flex gap-5 p-1 mb-6 rounded-xl">
        <button 
          onClick={() => {
            setActiveTab('positions');
            setPendingReacts({});
            setActiveApplicationId(null);
          }}
          className={`tab font-bold text-xl rounded-lg transition-all ${activeTab === 'positions' ? 'tab-active bg-primary text-white' : 'text-slate-400'}`}
        >
          💼 Job Positions ({positions.length})
        </button>
        <button 
          onClick={() => {
            setActiveTab('applications');
            setSelectedPositionIds([]);
          }}
          className={`tab font-bold text-xl rounded-lg transition-all ${activeTab === 'applications' ? 'tab-active bg-primary text-white' : 'text-slate-400'}`}
        >
          📬 Candidate Responses ({applications.length})
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12 text-sm">Loading dashboard data...</div>
      ) : (
        <div className="overflow-x-auto w-full">
          
          {activeTab === 'positions' && (
            <table className="table w-full text-center">
              <thead>
                <tr className="bg-base-200 text-center border border-b-gray-700 text-sm">
                  <th className="w-12 text-center p-3">Select</th>
                  <th>Company Name</th>
                  <th>Position Title</th>
                  <th>Target Tectonic Tags</th>
                  <th>Max Projects</th>
                  <th>Required Attributes</th>
                  <th>Application Deadline</th>
                </tr>
              </thead>
              <tbody>
                {positions.map((pos) => {
                  const isExpired = pos.deadline && new Date(pos.deadline) < new Date();
                  return (
                    <tr key={pos.id} className="hover:bg-base-200/50 transition-all border-b border-base-200/50">
                      <td className="text-center">
                        <input type="checkbox" className="checkbox checkbox-sm checkbox-primary" checked={selectedPositionIds.includes(pos.id)} onChange={() => handleSelectPosition(pos.id)} />
                      </td>
                      <td className="font-semibold text-slate-300">
                        {pos.companyName || 'N/A'}
                      </td>
                      <td className="font-semibold text-white">
                        <span 
                          onClick={() => navigate(`/recruiter/positions/${pos.id}`)}
                          className="cursor-pointer hover:underline text-primary"
                        >
                          {pos.title}
                        </span>
                      </td>
                      <td>
                        <div className="flex gap-1 flex-wrap justify-center">
                          {pos.projectTags?.map((tag, i) => (
                            <span key={i} className="badge badge-sm badge-ghost font-medium">{tag}</span>
                          ))}
                        </div>
                      </td>
                      <td className="font-mono text-sm">{pos.maxProjects}</td>
                      <td>
                        <div className="tooltip tooltip-info" data-tip={pos.attributes?.map(a => a.name).join(', ') || 'No attributes required'}>
                          <span className="text-xs opacity-80 bg-base-300 px-2 py-1 rounded-md cursor-pointer">
                            {pos.attributes?.length || 0} fields
                          </span>
                        </div>
                      </td>
                      <td className={`text-sm font-medium ${isExpired ? 'text-red-400 font-bold' : 'text-amber-400'}`}>
                        {formatDate(pos.deadline)}
                        {isExpired && <span className="text-[10px] block text-red-500 font-normal">(Closed)</span>}
                      </td>
                    </tr>
                  );
                })}
                {positions.length === 0 && (
                  <tr>
                    <td colSpan="7" className="text-center py-12 opacity-50 text-sm">
                      No position templates created yet. Click "New Position" to build one.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}

          {activeTab === 'applications' && (
            <table className="table w-full text-center">
              <thead>
                <tr className="bg-base-200 text-sm text-center">
                  <th>Candidate Name</th>
                  <th>Applied Position</th>
                  <th>Submitted CV Title</th>
                  <th>Contact Email</th>
                  <th>Applied Date</th>
                  <th>Select React</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => {
                  const dbReactKey = `${app.positionId}_${app.userId}`;
                  const savedReact = reacts[dbReactKey];
                  const currentSelection = pendingReacts[app.id] || savedReact;

                  return (
                    <tr key={app.id} className="hover:bg-base-200/50 transition-all border-b border-base-200/50 text-center">
                      <td className="font-bold text-white">
                        {app.user?.name || app.cv?.fullName || "Anonymous"}
                      </td>
                      <td className="text-primary font-bold">
                        {app.position?.title || "Unknown Position"}
                      </td>
                      <td>
                        <span 
                          onClick={() => window.open(`/show-cv/${app.cvId}`, '_blank')}
                          className="cursor-pointer text-xs font-mono bg-slate-800 text-emerald-400 border border-emerald-500/20 px-3 py-1.5 rounded-xl hover:bg-emerald-500/10 transition-colors inline-block"
                        >
                          📄 {app.cv?.title || "View CV"}
                        </span>
                      </td>
                      <td className="opacity-80 text-xs font-mono">
                        {app.user?.email || app.cv?.email}
                      </td>
                      <td className="text-slate-400 text-xs">
                        {formatDate(app.createdAt)}
                      </td>
                      <td>
                        <div className="flex justify-center gap-1">
                          <span
                            onClick={() => handleSelectReact(app.id, 'LOVE')}
                            className={`cursor-pointer text-xs px-2.5 py-1.5 rounded-xl transition-all ${
                              currentSelection === 'LOVE' ? 'bg-rose-500 text-white scale-105 font-bold shadow-md' : 'bg-rose-500/10 text-rose-400/60 hover:bg-rose-500/20'
                            }`}
                          >❤️</span>
                          <span
                            onClick={() => handleSelectReact(app.id, 'LIKE')}
                            className={`cursor-pointer text-xs px-2.5 py-1.5 rounded-xl transition-all ${
                              currentSelection === 'LIKE' ? 'bg-sky-500 text-white scale-105 font-bold shadow-md' : 'bg-sky-500/10 text-sky-400/60 hover:bg-sky-500/20'
                            }`}
                          >👍</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {applications.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center py-12 opacity-50 text-sm">
                      No applications received yet. Once candidates apply, their resumes will appear here!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}

        </div>
      )}
    </div>
  );
};

export default RecruiterDashboard;