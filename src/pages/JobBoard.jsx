import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { API_BASE_URL } from '../config/api.jsx';

const JobBoard = () => {
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';

  useEffect(() => {
    const fetchPositions = async () => {
      try {
        const res = await fetch(new URL('/api/positions/all', API_BASE_URL).href);
        if (res.ok) {
          const data = await res.json();
          setPositions(data);
        }
      } catch (error) {
        console.error('Error fetching job positions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPositions();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const filteredPositions = positions.filter(pos => {
    const searchTerm = searchQuery.toLowerCase();
    const titleMatch = pos.title.toLowerCase().includes(searchTerm);
    const companyMatch = pos.companyName?.toLowerCase().includes(searchTerm) || false;
    return titleMatch || companyMatch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-400 flex items-center justify-center">
        Loading Open Positions...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          {searchQuery ? (
            <h1 className="text-3xl font-bold">Search Results for: "{searchQuery}"</h1>
          ) : (
            <h1 className="text-4xl font-extrabold mb-3 bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent tracking-tight">
              Open Positions
            </h1>
          )}
          <p className="text-slate-400 max-w-2xl mx-auto">
            Find your next career opportunity. Browse through our open roles and apply today.
          </p>
        </div>

        {loading ? <div className="text-center py-12">Loading...</div> :
         filteredPositions.length === 0 ? (
          <div className="text-center py-12 text-slate-500">No matching positions found. Please try a different search term.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPositions.map((pos) => {
              const isExpired = pos.deadline && new Date(pos.deadline) < new Date();

              return (
                <div
                  key={pos.id}
                  className="bg-slate-800 border border-white/10 rounded-2xl shadow-lg hover:shadow-purple-500/10 transition-all duration-300 flex flex-col p-6 group relative"
                >
                  <div className="flex-grow">
                    <div className="flex justify-between items-start mb-2">
                      <h2 className="text-lg font-bold text-slate-100 group-hover:text-purple-400 transition-colors">
                        {pos.title}
                      </h2>
                      {isExpired && (
                        <span className="badge badge-error text-white text-[10px] font-bold">Expired</span>
                      )}
                    </div>
                    <div className="text-xs text-slate-400 mb-2 font-semibold">
                      🏢 {pos.companyName || 'Confidential'}
                    </div>
                    
                    <p className="text-xs text-slate-400 mb-4 line-clamp-3">
                      {pos.description}
                    </p>

                    <div className="flex flex-col gap-1 text-[11px] text-slate-400 bg-slate-900/40 p-3 rounded-xl mb-4 border border-white/5">
                      <div className="flex justify-between">
                        <span>📅 Posted On:</span>
                        <span className="text-slate-300 font-medium">{formatDate(pos.createdAt)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>⏳ Deadline:</span>
                        <span className={`font-semibold ${isExpired ? 'text-red-400' : 'text-amber-400'}`}>
                          {formatDate(pos.deadline)}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-1.5 flex-wrap mb-4">
                      {pos.projectTags?.map((tag, i) => (
                        <span key={i} className="badge badge-sm badge-ghost font-medium">{tag}</span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
                    <span className="text-xs text-slate-500">{pos.attributes?.length || 0} required attributes</span>
                    <button
                      onClick={() => navigate(`/apply/${pos.id}`)}
                      disabled={isExpired} 
                      className={`btn btn-sm rounded-xl font-bold px-4 text-white ${
                        isExpired ? 'btn-disabled bg-slate-700 border-none' : 'btn-primary'
                      }`}
                    >
                      {isExpired ? 'Closed' : 'Apply Now'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

  export default JobBoard;