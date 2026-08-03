import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config/api.jsx'; 

const Profile = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));
    const [showSalesforceModal, setShowSalesforceModal] = useState(false);
    const [company, setCompany] = useState('');
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);

    const handleSalesforceSync = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
           const res = await fetch(new URL('/api/salesforce/sync', API_BASE_URL).href, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    userId: user.id || user._id,
    name: user.name || user.fullName,
    email: user.email,
    company,
    phone
  })
});

            const data = await res.json();

            if (res.ok) {
                alert('✅ Successfully synced with Salesforce CRM! Account and Linked Contact created.');
                setShowSalesforceModal(false);
                setCompany('');
                setPhone('');
            } else {
                alert(`❌ Salesforce Sync Failed: ${data.error || 'An unknown server error occurred.'}`);
            }
        } catch (err) {
            console.error('Salesforce Sync Error:', err);
            alert('❌ A network or server error occurred. Please check the console and ensure your backend is running correctly.');
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return <div className="min-h-screen bg-slate-900 text-center py-12 text-slate-400">Loading profile data...</div>;
    }

    return (
        <div className="min-h-screen bg-slate-900 text-slate-100 p-8">
            <div className="max-w-2xl mx-auto bg-slate-800 rounded-2xl shadow-lg p-8 border border-white/10">
                <h1 className="text-3xl font-bold mb-6 text-center text-purple-400">User Profile</h1>

                <div className="space-y-4">
                    <div className="p-4 bg-slate-700/50 rounded-xl">
                        <p className="text-sm text-slate-400">Name</p>
                        <p className="text-lg font-semibold">{user.name || user.fullName}</p>
                    </div>

                    <div className="p-4 bg-slate-700/50 rounded-xl">
                        <p className="text-sm text-slate-400">Email</p>
                        <p className="text-lg font-semibold">{user.email}</p>
                    </div>

                    <div className="p-4 bg-slate-700/50 rounded-xl">
                        <p className="text-sm text-slate-400">Role</p>
                        <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-extrabold mt-2 tracking-wider ${
                            user.role === 'ADMIN' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                            user.role === 'RECRUITER' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                            'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                        }`}>
                            {user.role || 'CANDIDATE'}
                        </span>
                    </div>

                    {/* Salesforce Sync Button */}
                    <div className="pt-4 border-t border-white/10 flex justify-end">
                        <button 
                            onClick={() => setShowSalesforceModal(true)} 
                            className="btn btn-sm bg-purple-400 hover:bg-purple-700 p-3 text-white rounded-xl flex items-center gap-2">
                            ☁️ Sync to Salesforce CRM
                        </button>
                    </div>
                </div>
            </div>

            {showSalesforceModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-slate-800 p-6 rounded-2xl border border-white/10 max-w-md w-full shadow-2xl">
                        <h2 className="text-xl font-bold mb-2 text-purple-400">Sync with Salesforce</h2>
                        <p className="text-xs text-slate-400 mb-4">Enter additional details to create an Account and linked Contact in Salesforce CRM.</p>
                        
                        <form onSubmit={handleSalesforceSync} className="space-y-4">
                            <div>
                                <label className="text-xs text-slate-400 block mb-1">Company / Organization Name *</label>
                                <input 
                                    type="text" 
                                    required 
                                    value={company} 
                                    onChange={e => setCompany(e.target.value)} 
                                    className="w-full bg-slate-900 border border-white/10 rounded-xl p-2.5 text-sm text-slate-100 focus:outline-none focus:border-purple-500" 
                                    placeholder="e.g. Tech Corp" 
                                />
                            </div>
                            <div>
                                <label className="text-xs text-slate-400 block mb-1">Phone Number *</label>
                                <input 
                                    type="text" 
                                    required 
                                    value={phone} 
                                    onChange={e => setPhone(e.target.value)} 
                                    className="w-full bg-slate-900 border border-white/10 rounded-xl p-2.5 text-sm text-slate-100 focus:outline-none focus:border-purple-500" 
                                    placeholder="+8801..." 
                                />
                            </div>
                            <div className="flex justify-end gap-3 pt-2">
                                <button type="button" onClick={() => setShowSalesforceModal(false)} className="btn btn-sm btn-ghost text-slate-400">Cancel</button>
                                <button type="submit" disabled={loading} className="btn btn-sm bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl px-4">
                                    {loading ? 'Syncing...' : 'Submit to Salesforce'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;