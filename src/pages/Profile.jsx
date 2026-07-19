import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);

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
                        <p className="text-lg font-semibold">{user.name}</p>
                    </div>

                    <div className="p-4 bg-slate-700/50 rounded-xl">
                        <p className="text-sm text-slate-400">Email</p>
                        <p className="text-lg font-semibold">{user.email}</p>
                    </div>

                    <div className="p-4 bg-slate-700/50 rounded-xl">
                        <p className="text-sm text-slate-400">Role</p>
                        <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-extrabold mt-2 tracking-wider ${user.role === 'ADMIN' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                                user.role === 'RECRUITER' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                                    'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                            }`}>
                            {user.role || 'CANDIDATE'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;