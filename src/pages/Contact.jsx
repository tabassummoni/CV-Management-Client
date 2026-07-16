import React from 'react';

const Contact = () => {
  const lang = localStorage.getItem('lang') || 'en';

  const text = {
    en: {
      title: '📬 Contact Talent Desk',
      desc: 'Have queries regarding customisable position templates, reusable attribute mapping, or full-text profile synchronization?',
      desk: 'Talent Acquisition Desk',
      admin: 'System Administrators',
      window: 'Response Window',
      footer: 'CV Management System • Course Project 2026'
    },
    sp: {
      title: '📬 Contactar con la Mesa de Talento',
      desc: '¿Tiene preguntas sobre las plantillas de puestos personalizables, el mapeo de atributos reutilizables o la sincronización de perfiles?',
      desk: 'Mesa de Adquisición de Talento',
      admin: 'Administradores del Sistema',
      window: 'Ventana de Respuesta',
      footer: 'Sistema de Gestión de CV • Proyecto de Curso 2026'
    }
  };

  const currentText = text[lang] || text.en;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full backdrop-blur-md bg-white/5 border border-white/10 p-8 rounded-2xl shadow-2xl text-center space-y-6">
        
        <h2 className="text-xl font-black text-purple-400 uppercase tracking-wider">{currentText.title}</h2>
        <p className="text-xs text-slate-300 leading-relaxed">{currentText.desc}</p>
        
        <div className="bg-slate-950/50 p-5 rounded-xl border border-white/5 text-left space-y-3 text-xs">
          <div>
            <span className="font-bold text-slate-400 block uppercase tracking-wide text-[10px]">{currentText.desk}</span>
            <p className="text-purple-300 font-mono mt-0.5">recruit@acmecorp.com</p>
          </div>
          <div className="border-t border-white/5 pt-2">
            <span className="font-bold text-slate-400 block uppercase tracking-wide text-[10px]">{currentText.admin}</span>
            <p className="text-purple-300 font-mono mt-0.5">admin@cvmanagement.io</p>
          </div>
          <div className="border-t border-white/5 pt-2">
            <span className="font-bold text-slate-400 block uppercase tracking-wide text-[10px]">{currentText.window}</span>
            <p className="text-slate-200 mt-0.5">24 - 48 Business Hours</p>
          </div>
        </div>

        <p className="text-[9px] text-slate-500 font-medium tracking-wide pt-2 border-t border-white/5">
          {currentText.footer}
        </p>
      </div>
    </div>
  );
};

export default Contact;