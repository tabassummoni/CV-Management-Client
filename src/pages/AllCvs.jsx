import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config/api.jsx';

const HeartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const ThumbsUpIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <path d="M7 10v12" />
    <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h3z" />
  </svg>
);

const ShareIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
    <polyline points="16 6 12 2 8 6" />
    <line x1="12" x2="12" y1="2" y2="15" />
  </svg>
);

const AllCvs = () => {
  const [publishedCvs, setPublishedCvs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPublishedCvs = async () => {
      try {
        setLoading(true);
        const response = await fetch('${API_BASE_URL}/api/cv/all/published');
        if (response.ok) {
          const data = await response.json();
          setPublishedCvs(data);
        } else {
          console.error('Failed to fetch published CVs');
        }
      } catch (error) {
        console.error('Error fetching published CVs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPublishedCvs();
  }, []);

  if (loading) {
    return <div className="min-h-screen bg-slate-900 text-slate-400 flex items-center justify-center">Loading Published CVs...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-8">
      <div className="max-w-7xl mx-auto animate-fade-in">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold mb-3 bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent tracking-tight">Community CV Showcase</h1>
          <p className="text-slate-400 max-w-2xl mx-auto">Explore and get inspired by CVs published by our talented community members.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {publishedCvs.map(cv => (
            <div 
              key={cv.id} 
              className="relative bg-gradient-to-br from-slate-800 to-slate-900/70 border border-white/10 rounded-2xl shadow-lg hover:shadow-purple-500/10 transition-all duration-300 flex flex-col p-6 cursor-pointer group overflow-hidden"
              onClick={() => {
                const url = `/show-cv/${cv.id}`;
                window.open(url, '_blank');
              }}
            >
              <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-gradient-to-br from-purple-500/20 via-transparent to-transparent opacity-0 group-hover:opacity-50 transition-opacity duration-500 animate-spin-slow" />
              <div className="flex-grow">
                <span className="badge badge-ghost bg-purple-500/10 text-purple-300 border-purple-500/20 text-xs font-semibold mb-3">{cv.positionTitle}</span>
                <h2 className="text-lg font-bold text-slate-100 group-hover:text-purple-400 transition-colors">{cv.title || 'Untitled CV'}</h2>
                <div className="flex items-center gap-2 mt-2">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500" />
                  <p className="text-sm text-slate-400">by {cv.authorName}</p>
                </div>
              </div>
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/5">
                <p className="text-xs text-slate-500">{new Date(cv.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                <div className="flex items-center gap-3">
                  <button onClick={(e) => { e.stopPropagation(); alert('Liked!'); }} className="btn btn-xs btn-ghost text-slate-400 hover:bg-blue-500/10 hover:text-blue-400 gap-1.5">
                    <ThumbsUpIcon /> 12
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); alert('Loved!'); }} className="btn btn-xs btn-ghost text-slate-400 hover:bg-red-500/10 hover:text-red-400 gap-1.5">
                    <HeartIcon /> 5
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); alert('Shared!'); }} className="btn btn-xs btn-ghost text-slate-400 hover:bg-green-500/10 hover:text-green-400">
                    <ShareIcon />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllCvs;