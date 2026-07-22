import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { API_BASE_URL as CONFIG_API_URL } from '../config/api.jsx';

const PublicPositionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [position, setPosition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCv, setSelectedCv] = useState(null);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchPositionDetails = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/position/all`);
        if (res.ok) {
          const positions = await res.json();
          const targetPosition = positions.find(p => p.id === parseInt(id));
          if (targetPosition) {
            setPosition(targetPosition);
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchPositionDetails();
  }, [id]);

  useEffect(() => {
    if (location.state?.selectedCvId && location.state?.selectedCvTitle) {
      setSelectedCv({ id: location.state.selectedCvId, title: location.state.selectedCvTitle });
    }
  }, [location.state, location.key]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleApply = async () => {
    if (!user) {
      alert('Please login to apply.');
      navigate('/login');
      return;
    }

    if (!selectedCv || !selectedCv.id) {
      alert('Please select or add a CV first!');
      return;
    }

    if (window.confirm(`Are you sure you want to apply with this CV?`)) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/applications`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.id,
            cvId: selectedCv.id,
            positionId: position.id,
          }),
        });

        if (res.ok) {
          alert('🎉 Successfully applied for the position!');
          navigate('/job-board');
        } else {
          alert('Failed to apply for the position.');
        }
      } catch (error) {
        console.error('Application error:', error);
      }
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-white text-sm">Loading position details...</div>;
  }

  if (!position) {
    return <div className="text-center py-12 text-error text-sm">Position not found.</div>;
  }

  // ডেডলাইন চেক
  const isExpired = position.deadline && new Date(position.deadline) < new Date();

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto bg-slate-800 border border-white/10 rounded-2xl shadow-lg p-8">
        <div className="border-b border-white/10 pb-6 mb-6 flex justify-between items-start flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-100 mb-2">{position.title}</h1>
            <p className="text-slate-400 text-sm">
              Explore the details of this role and apply with your best CV.
            </p>
          </div>
          {isExpired && (
            <span className="badge badge-error text-white font-bold p-3">Expired / Closed</span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-400 bg-slate-900/40 p-4 rounded-xl mb-6 border border-white/5">
          <div className="flex justify-between sm:justify-start sm:gap-4">
            <span>📅 Posted On:</span>
            <span className="text-slate-200 font-medium">{formatDate(position.createdAt)}</span>
          </div>
          <div className="flex justify-between sm:justify-start sm:gap-4">
            <span>⏳ Application Deadline:</span>
            <span className={`font-semibold ${isExpired ? 'text-red-400' : 'text-amber-400'}`}>
              {formatDate(position.deadline)}
            </span>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-bold mb-2 text-purple-400">Job Description</h3>
            <p className="text-slate-300 leading-relaxed whitespace-pre-line text-sm">{position.description}</p>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-2 text-purple-400">Required Attributes</h3>
            {position.attributes && position.attributes.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {position.attributes.map(attr => (
                  <span key={attr.id} className="badge badge-outline badge-primary font-medium text-xs py-2.5">
                    {attr.name} <span className="text-[10px] text-slate-400 ml-1">({attr.dataType})</span>
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-slate-400 text-sm">No specific attributes required.</p>
            )}
          </div>
        </div>

        {!isExpired && (
          <div className="mt-8 pt-6 border-t border-white/5">
            <h3 className="text-lg font-bold mb-3 text-purple-400">Your Selected CV</h3>
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/dashboard', { state: { applyingForPositionId: position.id } })}
                className="btn btn-sm btn-outline btn-primary rounded-xl"
              >
                {selectedCv ? 'Change CV' : 'Add your CV'}
              </button>
              <div className="flex-1 bg-slate-900/50 border border-slate-700 rounded-xl p-2 min-h-[42px] flex items-center">
                {selectedCv ? (
                  <div className="flex justify-between items-center w-full bg-slate-700/50 p-1 px-3 rounded-lg">
                    <span className="text-sm font-mono text-slate-200">📄 {selectedCv.title}</span>
                    <button onClick={() => setSelectedCv(null)} className="btn btn-xs btn-ghost text-red-400 hover:bg-transparent">
                      ❌
                    </button>
                  </div>
                ) : (
                  <span className="text-sm text-slate-500 italic px-2">No CV selected</span>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-white/10 text-center">
          <button
            onClick={handleApply}
            disabled={!selectedCv || isExpired}
            className={`btn btn-lg text-white font-bold px-8 rounded-xl ${isExpired ? 'btn-disabled bg-slate-700' : 'btn-success'
              }`}
          >
            {isExpired ? '🔒 Position Closed' : '🚀 Apply for this Position'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PublicPositionDetails;