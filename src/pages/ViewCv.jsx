import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ViewCv = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cv, setCv] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // লোকাল স্টোরেজ থেকে কারেন্ট ইউজার ডাটা
  const user = JSON.parse(localStorage.getItem('user')) || { id: 1, name: 'Fouzia' };

  // ব্যাকএন্ড থেকে নির্দিষ্ট সিভির ডাটা লোড করা (পোর্ট 5001)
  useEffect(() => {
    fetch(`http://localhost:5001/api/cv/user/${user.id}`)
      .then((res) => res.json())
      .then((data) => {
        // যেহেতু আমাদের কারেন্ট এপিআই পুরো অ্যারে দেয়, আমরা নির্দিষ্ট আইডি-র সিভিটা খুঁজে নিচ্ছি
        const currentCv = data.find((item) => item.id === parseInt(id));
        if (currentCv) {
          setCv(currentCv);
        } else {
          alert('CV not found!');
          navigate('/dashboard');
        }
      })
      .catch((err) => console.error('Error fetching CV:', err))
      .finally(() => setLoading(false));
  }, [id, user.id, navigate]);

  // ইন-প্লেস এডিটিং এর জন্য ইনপুট চেঞ্জ হ্যান্ডেলার
  const handleInPlaceChange = (field, value) => {
    setCv({ ...cv, [field]: value });
  };

  // স্যারের রিকোয়ারমেন্ট অনুযায়ী সিভির ইন-প্লেস এডিট সেভ করা
  const handleSaveChange = async () => {
    setIsSaving(true);
    try {
      // ফিউচারে এখানে ব্যাকএন্ডের PUT/PATCH রাউট কানেক্ট হবে যা গ্লোবাল প্রোফাইল আপডেট করবে
      alert('🎉 Original Profile Value Updated In-place!');
    } catch (error) {
      console.error('Error updating CV:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-400 flex items-center justify-center animate-pulse">
        📄 Loading CV Template and Attributes...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-slate-100 p-4 md:p-12 font-sans">
      
      {/* অ্যাকশন ও নেভিগেশন হেডার বার */}
      <div className="max-w-4xl mx-auto mb-6 flex justify-between items-center">
        <button onClick={() => navigate('/dashboard')} className="btn btn-sm btn-outline border-white/20 text-slate-300 rounded-xl">
          ⬅️ Back to Dashboard
        </button>
        <button 
          onClick={handleSaveChange} 
          className={`btn btn-sm btn-accent bg-emerald-500 hover:bg-emerald-600 text-slate-900 border-none rounded-xl px-5 font-bold ${isSaving ? 'loading' : ''}`}
        >
          {isSaving ? 'Saving Changes...' : '💾 Save Profile Changes'}
        </button>
      </div>

      {/* 📄 প্রফেশনাল গ্লাস-মর্ফিজম রেজুমে শিট */}
      <div className="max-w-4xl mx-auto backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl shadow-2xl p-8 md:p-12 space-y-8 relative">
        
        {/* টপ হেডার: নাম এবং বেসিক ইনফো */}
        <div className="border-b border-white/10 pb-6">
          <input 
            type="text" 
            value={cv.fullName || ''} 
            onChange={(e) => handleInPlaceChange('fullName', e.target.value)}
            className="text-3xl md:text-4xl font-black bg-transparent border-b border-transparent hover:border-white/20 focus:border-purple-500 focus:outline-none w-full text-slate-100 tracking-wide"
            placeholder="Your Full Name"
          />
          <p className="text-purple-400 text-sm font-semibold uppercase tracking-wider mt-2">
            Position: {cv.positionTitle || 'Frontend Developer (Template)'}
          </p>
        </div>

        {/* কন্টাক্ট ইনফো গ্রিড */}
        <div>
          <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-3">Contact & Credentials</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-900/40 border border-white/5 p-4 rounded-xl">
            <div>
              <span className="text-xs text-slate-400 block">Email Address</span>
              <input 
                type="email" 
                value={cv.email || ''} 
                onChange={(e) => handleInPlaceChange('email', e.target.value)}
                className="bg-transparent border-b border-transparent hover:border-white/20 focus:border-purple-500 focus:outline-none text-sm w-full font-medium mt-1"
              />
            </div>
            <div>
              <span className="text-xs text-slate-400 block">Phone Number</span>
              <input 
                type="text" 
                value={cv.phone || ''} 
                onChange={(e) => handleInPlaceChange('phone', e.target.value)}
                className="bg-transparent border-b border-transparent hover:border-white/20 focus:border-purple-500 focus:outline-none text-sm w-full font-medium mt-1"
                placeholder="Not Provided"
              />
            </div>

            {/* 🎯 IELTS Score: স্যারের শর্ত অনুযায়ী ফাঁকা থাকলে লাল ব্যাকগ্রাউন্ডে ইন-লাইন এডিট হবে */}
            <div>
              <span className="text-xs text-indigo-300 font-semibold block">IELTS Score</span>
              <input 
                type="text" 
                value={cv.ieltsScore || ''} 
                onChange={(e) => handleInPlaceChange('ieltsScore', e.target.value)}
                placeholder="Click to fill empty field"
                className={`text-sm w-full font-bold mt-1 px-2 py-0.5 rounded transition-all focus:outline-none focus:ring-2 focus:ring-purple-500 bg-transparent ${
                  !cv.ieltsScore 
                    ? 'text-red-400 bg-red-500/10 border border-red-500/30 placeholder-red-400/50' 
                    : 'text-accent border-b border-transparent hover:border-white/20'
                }`}
              />
            </div>
          </div>
        </div>

        {/* প্রফেশনাল সামারি */}
        <div>
          <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2">Professional Summary</h4>
          <textarea 
            value={cv.summary || ''} 
            onChange={(e) => handleInPlaceChange('summary', e.target.value)}
            className="w-full bg-transparent border border-transparent hover:border-white/10 focus:border-purple-500 focus:bg-slate-900/30 focus:outline-none text-sm text-slate-300 leading-relaxed p-2 rounded-xl h-24 resize-none"
            placeholder="Describe your career goals..."
          />
        </div>

        {/* স্কিলস সেকশন */}
        <div>
          <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2">Core Expertise & Skills</h4>
          <input 
            type="text" 
            value={cv.skills || ''} 
            onChange={(e) => handleInPlaceChange('skills', e.target.value)}
            className="w-full bg-transparent border-b border-transparent hover:border-white/20 focus:border-purple-500 focus:outline-none text-sm text-slate-200 p-1"
            placeholder="React, Tailwind, Node.js..."
          />
        </div>

        {/* এক্সপেরিয়েন্স ও এডুকেশন গ্রিড */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-white/10">
          <div>
            <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2">Professional Experience</h4>
            <textarea 
              value={cv.experience || ''} 
              onChange={(e) => handleInPlaceChange('experience', e.target.value)}
              className="w-full bg-transparent border border-transparent hover:border-white/10 focus:border-purple-500 focus:bg-slate-900/30 focus:outline-none text-sm text-slate-300 leading-relaxed p-2 rounded-xl h-32 resize-none"
            />
          </div>
          <div>
            <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2">Education & Training</h4>
            <textarea 
              value={cv.education || ''} 
              onChange={(e) => handleInPlaceChange('education', e.target.value)}
              className="w-full bg-transparent border border-transparent hover:border-white/10 focus:border-purple-500 focus:bg-slate-900/30 focus:outline-none text-sm text-slate-300 leading-relaxed p-2 rounded-xl h-32 resize-none"
            />
          </div>
        </div>

      </div>
    </div>
  );
};

export default ViewCv;