import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config/api.jsx';

const Search = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q') || '';
  
  const user = JSON.parse(localStorage.getItem('user'));
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query) {
      setLoading(true);
      fetch(new URL(`/api/cv/search/query?q=${encodeURIComponent(query)}`, API_BASE_URL).href)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) setSearchResults(data);
        })
        .catch(err => console.error("Search fetch error:", err))
        .finally(() => setLoading(false));
    }
  }, [query]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6 md:p-12 font-sans">
      <div className="max-w-5xl mx-auto mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-200">
            🔍 Search Results for: <span className="text-purple-400">"{query}"</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Found {searchResults.length} profiles matching keyword via consistent lookup.
          </p>
        </div>
        <button onClick={() => navigate(user?.role === 'ADMIN' ? '/admin-dashboard' : '/dashboard')} className="btn btn-sm btn-outline text-slate-300 rounded-xl">
          ⬅️ Back to Dashboard
        </button>
      </div>


      <div className="max-w-5xl mx-auto overflow-x-auto bg-slate-800 rounded-2xl border border-white/10 shadow-2xl">
        {loading ? (
          <div className="text-center py-12 text-sm text-slate-400 animate-pulse">Scanning full-text indices...</div>
        ) : searchResults.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-sm">No profiles or templates matched your keyword.</div>
        ) : (
          <table className="table w-full border-collapse">
            <thead>
              <tr className="bg-slate-950/40 text-slate-300 border-b border-white/10 text-left">
                <th className="py-4 px-6 text-xs uppercase font-bold tracking-wider">Candidate Name</th>
                <th className="py-4 px-6 text-xs uppercase font-bold tracking-wider">CV Custom Title</th>
                <th className="py-4 px-6 text-xs uppercase font-bold tracking-wider">Target Position</th>
                <th className="py-4 px-6 text-xs uppercase font-bold tracking-wider">IELTS Score</th>
              </tr>
            </thead>
            <tbody>
              {searchResults.map(row => (
                <tr key={row.id} className="hover:bg-white/5 border-b border-white/5 transition-colors">
                  <td className="py-4 px-6 text-sm font-semibold text-slate-200">{row.fullName || 'Anonymous Candidate'}</td>
                  <td 
                    onClick={() => navigate(`/view-cv/${row.id}`)}
                    className="py-4 px-6 text-sm text-purple-400 cursor-pointer hover:underline font-medium"
                  >
                    {row.title}
                  </td>
                  <td className="py-4 px-6 text-sm text-slate-300">
                    <span className="badge badge-ghost text-xs">{row.positionTitle}</span>
                  </td>
                  <td className="py-4 px-6 text-sm font-bold text-slate-400">{row.ieltsScore || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Search;