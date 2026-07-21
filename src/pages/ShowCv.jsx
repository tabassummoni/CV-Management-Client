import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config/api.jsx';

const ShowCv = () => {
  const { id } = useParams();
  const navigate = useNavigate();

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

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/cv/${id}`)
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

  if (loading) return <div className="min-h-screen bg-slate-900 text-slate-400 flex items-center justify-center">Generating CV Template...</div>;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans print:bg-white print:text-black">
      
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        <div className="mb-6 flex justify-between items-center print:hidden">
          <button onClick={() => navigate('/all-cvs')} className="btn btn-sm btn-outline text-slate-300 rounded-xl">⬅️ Back to All CVs</button>
          <button onClick={() => window.print()} className="btn btn-sm btn-primary">📄 Download PDF</button>
        </div>

        <div className="bg-white text-gray-800 p-12 rounded-lg shadow-2xl print:shadow-none print:rounded-none print:p-0" id="cv-content">
          <div className="text-center border-b-2 border-gray-200 pb-6 mb-8">
            <h1 className="text-4xl font-bold text-gray-900">{cvData.fullName}</h1>
            <p className="text-lg text-purple-600 font-semibold">{cvData.positionTitle}</p>
            <div className="flex justify-center gap-6 mt-4 text-sm text-gray-600">
              <span>{cvData.email}</span>
              {cvData.phone && <span>| &nbsp; {cvData.phone}</span>}
              {cvData.ieltsScore && <span>| &nbsp; IELTS: <strong>{cvData.ieltsScore}</strong></span>}
            </div>
          </div>

          <div className="space-y-10">
            {cvData.summary && (
              <div>
                <h2 className="text-xl font-bold border-b border-gray-300 pb-2 mb-3 text-purple-700">Professional Summary</h2>
                <p className="text-gray-700 leading-relaxed">{cvData.summary}</p>
              </div>
            )}

            {cvData.skills && (
              <div>
                <h2 className="text-xl font-bold border-b border-gray-300 pb-2 mb-3 text-purple-700">Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {cvData.skills.split(',').map((skill, i) => (
                    <span key={i} className="bg-purple-100 text-purple-800 text-xs font-semibold px-2.5 py-1 rounded-full">{skill.trim()}</span>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {cvData.experience && (
                <div>
                  <h2 className="text-xl font-bold border-b border-gray-300 pb-2 mb-3 text-purple-700">Work Experience</h2>
                  <p className="text-gray-700 whitespace-pre-wrap">{cvData.experience}</p>
                </div>
              )}

              {cvData.education && (
                <div>
                  <h2 className="text-xl font-bold border-b border-gray-300 pb-2 mb-3 text-purple-700">Education</h2>
                  <p className="text-gray-700 whitespace-pre-wrap">{cvData.education}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowCv;