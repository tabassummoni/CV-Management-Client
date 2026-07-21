import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config/api.jsx';

const Templates = () => {
  const navigate = useNavigate();
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user'));

  const lang = localStorage.getItem('lang') || 'en';
  
  const text = {
    en: {
      title: '📋 Available Position Templates',
      subtitle: 'Browse through recruiter-defined requirements. Go to Dashboard to automatically generate a tailored CV.',
      thId: 'Template ID',
      thTitle: 'Position Title',
      thAction: 'Action Context',
      actionText: 'Generate CV via Dashboard ⚡',
      empty: 'No active templates found in the shared pool.'
    },
    sp: {
      title: '📋 Plantillas de Puestos Disponibles',
      subtitle: 'Examine los requisitos definidos por el reclutador. Vaya al Tablero para generar un CV adaptado.',
      thId: 'ID de Plantilla',
      thTitle: 'Título del Puesto',
      thAction: 'Contexto de Acción',
      actionText: 'Generar CV a través del Tablero ⚡',
      empty: 'No se encontraron plantillas activas en el grupo compartido.'
    }
  };

  const currentText = text[lang] || text.en;

  useEffect(() => {
    fetch('${API_BASE_URL}/api/cv/positions/all')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setPositions(data);
      })
      .catch(err => console.error("Error fetching positions:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-400 flex items-center justify-center font-sans">
        <span className="animate-pulse">Loading Position Templates...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6 md:p-12 font-sans">
      <div className="max-w-5xl mx-auto mb-8">
        <h1 className="text-2xl font-black tracking-tight text-purple-400 uppercase">{currentText.title}</h1>
        <p className="text-xs text-slate-400 mt-2 max-w-2xl">{currentText.subtitle}</p>
      </div>

      <div className="max-w-5xl mx-auto overflow-x-auto bg-slate-800 rounded-2xl border border-white/10 shadow-2xl">
        <table className="table w-full border-collapse">
          <thead>
            <tr className="bg-slate-950/40 text-slate-300 border-b border-white/10 text-left">
              <th className="py-4 px-6 text-xs uppercase font-bold tracking-wider">{currentText.thId}</th>
              <th className="py-4 px-6 text-xs uppercase font-bold tracking-wider">{currentText.thTitle}</th>
              <th className="py-4 px-6 text-xs uppercase font-bold tracking-wider">{currentText.thAction}</th>
            </tr>
          </thead>
          <tbody>
            {positions.length === 0 ? (
              <tr>
                <td colSpan="3" className="text-center py-12 text-slate-500 text-sm font-medium">{currentText.empty}</td>
              </tr>
            ) : (
              positions.map(pos => (
                <tr key={pos.id} className="hover:bg-white/5 border-b border-white/5 transition-colors group">
                  <td className="py-4 px-6 text-sm text-slate-400 font-mono">#{pos.id}</td>
                  <td className="py-4 px-6 text-sm font-bold text-slate-200 group-hover:text-purple-400 transition-colors">{pos.title}</td>
                  <td className="py-4 px-6 text-sm">
                    <span 
                      onClick={() => navigate(user?.role === 'ADMIN' ? '/admin-dashboard' : '/dashboard')} 
                      className="text-xs font-bold text-purple-400 hover:text-purple-300 hover:underline cursor-pointer select-none"
                    >
                      {currentText.actionText}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Templates;