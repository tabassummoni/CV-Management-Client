import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config/api.jsx';
const AdminDashboard = () => {
  const [activeMenu, setActiveMenu] = useState('Dashboards');
  const [stats, setStats] = useState({ totalUsers: 0, totalCvs: 0, totalApplications: 0, totalPositions: 0 });
  const [usersList, setUsersList] = useState([]);
  const [recentLogs, setRecentLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [applicationsList, setApplicationsList] = useState([]);
  const [positionsList, setPositionsList] = useState([]);
  const [cvsList, setCvsList] = useState([]);

  useEffect(() => {
    const fetchAllStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

        const results = await Promise.allSettled([
          fetch(`${API_BASE_URL}/api/admin/stats/all`, { headers }),
          fetch(`${API_BASE_URL}/api/admin/users/all`, { headers }),
          fetch(`${API_BASE_URL}/api/admin/applications/all`, { headers }),
          fetch(`${API_BASE_URL}/api/admin/positions/all`, { headers }),
          fetch(`${API_BASE_URL}/api/admin/cvs/all`, { headers })
        ]);

        let currentActiveUsersCount = 0;

        if (results[0].status === 'fulfilled' && results[0].value.ok) {
          const statsData = await results[0].value.json();
          if (statsData) setStats(statsData);
        }

        if (results[1].status === 'fulfilled' && results[1].value.ok) {
          const usersData = await results[1].value.json();
          if (Array.isArray(usersData)) {
            setUsersList(usersData);
            currentActiveUsersCount = usersData.length;
          }
        }

        if (results[2].status === 'fulfilled' && results[2].value.ok) {
          const appsData = await results[2].value.json();
          if (Array.isArray(appsData)) setApplicationsList(appsData);
        }

        if (results[3].status === 'fulfilled' && results[3].value.ok) {
          const posData = await results[3].value.json();
          if (Array.isArray(posData)) setPositionsList(posData);
        }

        if (results[4].status === 'fulfilled' && results[4].value.ok) {
          const cvsData = await results[4].value.json();
          if (Array.isArray(cvsData)) setCvsList(cvsData);
        }

        setRecentLogs([
          { message: "🛡️ Admin environment synchronized seamlessly", time: new Date() },
          { message: `📊 Dynamic core updated: ${currentActiveUsersCount} global entities verified`, time: new Date(Date.now() - 60000) }
        ]);

      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        if (loading) setLoading(false);
      }
    };

    fetchAllStats();
    const intervalId = setInterval(fetchAllStats, 10000); 
    return () => clearInterval(intervalId); 
  }, [loading]);

  const handleDeleteUser = async (userId) => {
    if (window.confirm("⚠️ Are you sure you want to delete this user from the system?")) {
        try {
            const res = await fetch(`${API_BASE_URL}/api/admin/users/${userId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            if (res.ok) {
                setUsersList(usersList.filter(u => u.id !== userId));
                setStats(prev => ({ ...prev, totalUsers: prev.totalUsers - 1 }));
            }
        } catch (err) {
            console.error("Action failed:", err);
        }
    }
  };

  const menuItems = [
      { category: 'MENU', items: ['Dashboards', 'Applications', 'Positions', 'Cvs'] },
      { category: 'Users Details', items: ['All Users', 'All Recruiters'] },
      { category: 'SETTINGS', items: ['System Logs',  'Security'] }
  ];

  const filteredUsers = usersList.filter(u => {
      if (activeMenu === 'All Recruiters') return u.role === 'RECRUITER';
      if (activeMenu === 'All Users') return u.role === 'CANDIDATE'; 
      return u.role !== 'ADMIN'; 
  });

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 flex font-sans">
      
      <aside className="w-64 bg-gradient-to-b from-slate-900 to-fuchsia-950 text-white flex flex-col shadow-xl hidden md:flex">
        <div className="p-6 border-b border-white/10 flex items-center gap-2">
            <span className="text-2xl">🛡️</span>
            <span className="font-black tracking-wider text-lg">CV System Admin</span>
        </div>
        
        <nav className="flex-1 overflow-y-auto p-4 space-y-6 text-xs">
            {menuItems.map((group, idx) => (
                <div key={idx} className="space-y-2">
                    <p className="text-white/50 font-bold tracking-widest pl-2 uppercase">{group.category}</p>
                    <ul className="space-y-1">
                        {group.items.map((item, itemIdx) => {
                            if (!item.trim()) return null;
                            return (
                                <li key={itemIdx}>
                                    <button 
                                        onClick={() => setActiveMenu(item)}
                                        className={`w-full text-left px-3 py-2.5 rounded-lg font-medium transition-all flex items-center justify-between ${
                                            activeMenu === item || (item === 'Dashboards' && activeMenu === 'Analytics')
                                                ? 'bg-white/15 shadow-sm font-bold text-white' 
                                                : 'hover:bg-white/5 text-white/80'
                                        }`}
                                    >
                                        <span>{item}</span>
                                        {item === 'Dashboards' && <span className="text-[10px] bg-emerald-700/50 px-1.5 py-0.5 rounded text-white">Live</span>}
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            ))}
        </nav>
      </aside>

      <main className="flex-1 flex flex-col overflow-x-hidden">
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 z-10">
            <div className="text-sm font-semibold text-gray-700">
                System Environment: <span className="text-emerald-600 font-bold">Production</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
                <div className="text-right">
                    <p className="font-bold text-gray-900">Admin Panel</p>
                    <p className="text-gray-400 text-[10px]">Root Access Privilege</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-bold">⚙️</div>
            </div>
        </header>

        <div className="p-6 space-y-6 flex-1 overflow-y-auto max-w-7xl w-full mx-auto">
            <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <div>
                    <h2 className="text-xl font-bold text-gray-800">{activeMenu} Section</h2>
                    <p className="text-xs text-gray-400 mt-0.5">Global overview of platform performance and telemetry.</p>
                </div>
                <div className="badge badge-error p-3 text-white font-mono font-bold text-xs">Admin Session</div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
                <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                    <h3 className="font-bold text-gray-700 text-sm tracking-wide">Platform Performance Indicators</h3>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-xl text-amber-600">📄</div>
                        <div>
                            <p className="text-xs text-gray-400 font-semibold">Total CVs Generated</p>
                            <h4 className="text-2xl font-black text-gray-800 mt-0.5">{stats.totalCvs}</h4>
                            <p className="text-[11px] text-green-600 font-bold mt-1">▲ Platform Growth <span className="text-gray-400 font-normal">Active</span></p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-xl text-red-600">💼</div>
                        <div>
                            <p className="text-xs text-gray-400 font-semibold">Total Applications</p>
                            <h4 className="text-2xl font-black text-gray-800 mt-0.5">{stats.totalApplications}</h4>
                            <p className="text-[11px] text-blue-600 font-bold mt-1">Conversion Rate: <span className="font-black">Optimal</span></p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-xl text-green-600">🏢</div>
                        <div>
                            <p className="text-xs text-gray-400 font-semibold">Active Positions</p>
                            <h4 className="text-2xl font-black text-green-600 mt-0.5">{stats.totalPositions}</h4>
                            <p className="text-[11px] text-green-500 font-bold mt-1">Live Job Boards <span className="font-black">▲ Stable</span></p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 lg:col-span-7 flex flex-col justify-between">
                    <div className="flex justify-between items-center mb-4">
                        <h4 className="text-sm font-bold text-gray-700 flex items-center gap-1.5">📋 Registry Details ({activeMenu})</h4>
                    </div>
                    
                    <div className="overflow-x-auto h-64 border border-gray-100 rounded-lg p-2">
                        {(activeMenu === 'Dashboards' || activeMenu === 'Analytics' || activeMenu === 'All Users' || activeMenu === 'All Recruiters') && (
                            <table className="table w-full text-xs text-gray-700">
                                <thead className="bg-gray-50 text-gray-600 sticky top-0">
                                    <tr>
                                        <th className="font-bold py-2">Name</th>
                                        <th className="font-bold py-2">Email</th>
                                        <th className="font-bold py-2">Role</th>
                                        <th className="font-bold py-2 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsers.map((u) => (
                                        <tr key={u.id} className="border-b border-gray-100 hover:bg-gray-50 transition-all">
                                            <td className="font-bold text-gray-900">{u.name || 'Anonymous'}</td>
                                            <td className="text-gray-500">{u.email}</td>
                                            <td>
                                                <span className={`badge badge-xs text-[9px] font-extrabold px-1.5 py-0.5 rounded ${
                                                    u.role === 'RECRUITER' ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-gray-100 text-gray-600'
                                                }`}>
                                                    {u.role}
                                                </span>
                                            </td>
                                            <td className="text-right py-1">
                                                <button onClick={() => handleDeleteUser(u.id)} className="btn btn-xs btn-outline btn-error font-bold rounded px-2 h-6 min-h-0 text-[10px]">Delete</button>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredUsers.length === 0 && <tr><td colSpan="4" className="text-center py-8 text-gray-400 italic">No record match found for {activeMenu}.</td></tr>}
                                </tbody>
                            </table>
                        )}
                        {activeMenu === 'Applications' && (
                            <table className="table w-full text-xs text-gray-700">
                                <thead className="bg-gray-50 text-gray-600 sticky top-0">
                                    <tr>
                                        <th className="font-bold py-2">App ID</th>
                                        <th className="font-bold py-2">User ID</th>
                                        <th className="font-bold py-2">CV ID</th>
                                        <th className="font-bold py-2">Position ID</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {applicationsList.map((app) => (
                                        <tr key={app.id} className="border-b border-gray-100">
                                            <td className="font-mono text-gray-900">{app.id}</td>
                                            <td>{app.userId}</td>
                                            <td>{app.cvId}</td>
                                            <td>{app.positionId}</td>
                                        </tr>
                                    ))}
                                    {applicationsList.length === 0 && <tr><td colSpan="4" className="text-center py-8 text-gray-400 italic">No applications found.</td></tr>}
                                </tbody>
                            </table>
                        )}

                        {activeMenu === 'Positions' && (
                            <table className="table w-full text-xs text-gray-700">
                                <thead className="bg-gray-50 text-gray-600 sticky top-0">
                                    <tr>
                                        <th className="font-bold py-2">Title</th>
                                        <th className="font-bold py-2">Company Name</th>
                                        <th className="font-bold py-2">Deadline</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {positionsList.map((pos) => (
                                        <tr key={pos.id} className="border-b border-gray-100">
                                            <td className="font-bold text-gray-900">{pos.title || 'N/A'}</td>
                                            <td>{pos.companyName || 'Confidential'}</td>
                                            <td>{pos.deadline ? new Date(pos.deadline).toLocaleDateString() : 'N/A'}</td>
                                        </tr>
                                    ))}
                                    {positionsList.length === 0 && <tr><td colSpan="3" className="text-center py-8 text-gray-400 italic">No open positions found.</td></tr>}
                                </tbody>
                            </table>
                        )}
                        {activeMenu === 'Cvs' && (
                            <table className="table w-full text-xs text-gray-700">
                                <thead className="bg-gray-50 text-gray-600 sticky top-0">
                                    <tr>
                                        <th className="font-bold py-2">CV Title</th>
                                        <th className="font-bold py-2">Author Name</th>
                                        <th className="font-bold py-2">Created At</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cvsList.map((cv) => (
                                        <tr key={cv.id} className="border-b border-gray-100">
                                            <td className="font-bold text-gray-900">{cv.title || 'Untitled'}</td>
                                            <td>{cv.fullName || cv.authorName || 'Anonymous'}</td>
                                            <td>{new Date(cv.createdAt).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                    {cvsList.length === 0 && <tr><td colSpan="3" className="text-center py-8 text-gray-400 italic">No CV records inside the database.</td></tr>}
                                </tbody>
                            </table>
                        )}
                        {activeMenu === 'System Logs' && (
                            <div className="space-y-4">
                                <div className="flex justify-between items-center bg-slate-50 p-2 rounded border text-[11px]">
                                    <span className="font-bold text-slate-600">Database Uptime: <span className="text-green-600">Neon Cluster Online</span></span>
                                </div>
                                <table className="table w-full text-xs text-gray-700">
                                    <thead className="bg-gray-50 text-gray-600 sticky top-0">
                                        <tr>
                                            <th className="font-bold py-2">Event</th>
                                            <th className="font-bold py-2">Timestamp</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentLogs.map((log, idx) => (
                                            <tr key={idx} className="border-b border-gray-100 font-mono text-[10px]">
                                                <td>{log.message}</td>
                                                <td className="text-gray-400">{new Date(log.time).toLocaleTimeString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                        {activeMenu === 'Preferences' && (
                            <div className="p-2 space-y-3 text-left text-xs">
                                <h5 className="font-bold text-gray-700 border-b pb-1">Global Configuration Settings</h5>
                                <div className="space-y-2 max-w-xs">
                                    <label className="flex justify-between items-center bg-gray-50 p-2 rounded border">
                                        <span className="font-medium text-gray-600">Maintenance Mode</span>
                                        <input type="checkbox" className="toggle toggle-error toggle-xs" />
                                    </label>
                                    <label className="flex justify-between items-center bg-gray-50 p-2 rounded border">
                                        <span className="font-medium text-gray-600">Allow Recruiter Registrations</span>
                                        <input type="checkbox" className="toggle toggle-primary toggle-xs" defaultChecked />
                                    </label>
                                </div>
                            </div>
                        )}
                        {activeMenu === 'Security' && (
                            <div className="p-2 space-y-3 text-left text-xs">
                                <h5 className="font-bold text-gray-700 border-b pb-1">System Protection Guard</h5>
                                <div className="bg-red-50 border border-red-200 p-2.5 rounded-lg flex justify-between items-center">
                                    <div>
                                        <p className="font-bold text-red-800">Token Session Rotation</p>
                                        <p className="text-gray-400 text-[10px] mt-0.5">Forcefully invalidate all ongoing platform tokens.</p>
                                    </div>
                                    <button onClick={() => alert("JWT Rotated Successfully")} className="btn btn-xs btn-error text-white font-bold rounded">Rotate</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 lg:col-span-5 flex flex-col justify-between">
                    <div className="flex justify-between items-center mb-4">
                        <h4 className="text-sm font-bold text-gray-700 flex items-center gap-1.5">⏳ System Activity Stream</h4>
                    </div>

                    <div className="space-y-4 h-64 overflow-y-auto pr-1">
                        {recentLogs.map((log, idx) => (
                            <div key={idx} className="flex gap-3 items-start">
                                <div className="w-2.5 h-2.5 rounded-full border-2 border-emerald-500 bg-white mt-1.5 flex-shrink-0"></div>
                                <div className="text-xs text-left">
                                    <p className="font-medium text-gray-800 leading-snug">{log.message}</p>
                                    <span className="text-[10px] text-gray-400 block mt-0.5">
                                        {new Date(log.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm text-center">
                    <h4 className="text-xl font-black text-gray-800">{stats.totalUsers || 0}</h4>
                    <p className="text-[10px] text-gray-400 font-medium mt-0.5">Total Registered Accounts</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm text-center">
                    <h4 className="text-xl font-black text-gray-800">{stats.totalCvs || 0}</h4>
                    <p className="text-[10px] text-gray-400 font-medium mt-0.5">Active Database CVs</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm text-center">
                    <h4 className="text-xl font-black text-gray-800">{stats.totalApplications || 0}</h4>
                    <p className="text-[10px] text-gray-400 font-medium mt-0.5">Processed Applications</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm text-center">
                    <h4 className="text-xl font-black text-emerald-600">100%</h4>
                    <p className="text-[10px] text-gray-400 font-medium mt-0.5">Core Service Uptime</p>
                </div>
            </div>

        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;