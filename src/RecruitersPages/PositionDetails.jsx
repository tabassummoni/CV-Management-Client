import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DiscussionTab from "./DiscussionTab";
import { API_BASE_URL } from '../config/api.jsx';

const PositionDetails = ({ currentUserId }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [position, setPosition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchPositionDetails = async () => {
      try {
        const res = await fetch('${API_BASE_URL}/api/position/all');
        if (res.ok) {
          const positions = await res.json();
          const target = positions.find(p => p.id === parseInt(id));
          if (target) {
            setPosition(target);
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

  if (loading) {
    return <div className="text-center py-12 text-white text-sm">Loading details...</div>;
  }

  if (!position) {
    return <div className="text-center py-12 text-error text-sm">Position template not found.</div>;
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-base-100 rounded-2xl shadow-xl text-white min-h-[500px]">
      <div className="flex justify-between items-start mb-6 border-b border-base-200 pb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-primary">Target Position Layout</span>
          <h1 className="text-2xl font-black mt-1">{position.title}</h1>
        </div>
        <button 
          onClick={() => navigate('/recruiter/dashboard')} 
          className="btn btn-ghost btn-sm rounded-xl text-xs border border-white/10"
        >
          Back to Panel
        </button>
      </div>

      <div className="tabs tabs-boxed bg-base-200 p-1 rounded-xl mb-6 inline-flex">
        <button 
          onClick={() => setActiveTab('overview')} 
          className={`tab rounded-lg text-xs font-bold px-6 py-2 transition-all ${activeTab === 'overview' ? 'tab-active bg-primary text-white' : 'text-base-content/70'}`}
        >
          Overview & Requirements
        </button>
        <button 
          onClick={() => setActiveTab('discussion')} 
          className={`tab rounded-lg text-xs font-bold px-6 py-2 transition-all ${activeTab === 'discussion' ? 'tab-active bg-primary text-white' : 'text-base-content/70'}`}
        >
          Discussion Tab
        </button>
      </div>

      {activeTab === 'overview' ? (
        <div className="space-y-6">
          <div className="bg-base-200 p-4 rounded-xl border border-white/5">
            <h3 className="text-sm font-bold mb-2 text-primary">Job Description</h3>
            <p className="text-sm opacity-80 leading-relaxed whitespace-pre-line">{position.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-base-200 p-4 rounded-xl border border-white/5">
              <h3 className="text-sm font-bold mb-2 text-primary">Filtering Meta Rules</h3>
              <div className="space-y-2 text-xs">
                <p><span className="opacity-60">Max Allowed Projects:</span> <span className="font-mono text-white font-semibold">{position.maxProjects}</span></p>
                <div className="flex items-center gap-1 mt-1">
                  <span className="opacity-60">Tech Badges:</span>
                  <div className="flex flex-wrap gap-1">
                    {position.projectTags?.map((tag, i) => (
                      <span key={i} className="bg-base-300 px-2 py-0.5 rounded text-[10px] font-medium border border-white/5">{tag}</span>
                    ))}
                    {(!position.projectTags || position.projectTags.length === 0) && <span className="opacity-40">None</span>}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-base-200 p-4 rounded-xl border border-white/5">
              <h3 className="text-sm font-bold mb-2 text-primary">Mandatory Fields Checklist</h3>
              <div className="flex flex-wrap gap-1.5">
                {position.attributes?.map((attr) => (
                  <span key={attr.id} className="badge badge-outline text-xs py-2 px-2.5 rounded-lg">
                    {attr.name} ({attr.dataType})
                  </span>
                ))}
                {(!position.attributes || position.attributes.length === 0) && (
                  <p className="text-xs opacity-40">No core attributes assigned to this schema.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <DiscussionTab positionId={position.id} currentUserId={currentUserId} />
      )}
    </div>
  );
};

export default PositionDetails;
