import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config/api.jsx';
const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
    const [lang, setLang] = useState(localStorage.getItem('lang') || 'en');
    const [isLangOpen, setIsLangOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    
    const navigate = useNavigate();
    const dropdownRef = useRef(null);
    const notifRef = useRef(null);

    const isLoggedIn = !!localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    const userRole = user?.role;
    const isRecruiter = userRole === 'RECRUITER';

    const fetchNotifications = async () => {
        if (!user?.id || isRecruiter) return;
        try {
            const response = await fetch(new URL('/api/applications/all', API_BASE_URL).href, {
                headers: {
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache'
                }
            });
            
            if (response.ok) { 
                const apps = await response.json();
                
                const reactRes = await fetch(new URL('/api/applications/reacts', API_BASE_URL).href, {
                    headers: {
                        'Cache-Control': 'no-cache',
                        'Pragma': 'no-cache'
                    }
                });
                
                if (reactRes.ok && Array.isArray(apps)) {
                    const reactMap = await reactRes.json();
                    const list = [];
                    
                    apps.forEach(app => {
                        if (Number(app.userId) === Number(user.id)) {
                            const dbReactKey = `${app.positionId}_${app.userId}`;
                            const savedReact = reactMap[dbReactKey];
                            
                            if (savedReact && (savedReact === 'LOVE' || savedReact === 'LIKE')) {
                                const emoji = savedReact === 'LOVE' ? '❤️' : '👍';
                                const actionText = savedReact === 'LOVE' ? 'loved' : 'liked';
                                
                                list.push({
                                    id: `${app.id}_${savedReact}`,
                                    message: `Recruiter ${emoji} ${actionText} your application for "${app.position?.title || 'Job'}"`,
                                    createdAt: app.updatedAt || app.createdAt
                                });
                            }
                        }
                    });
                    
                    const sortedList = list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                    
                    setNotifications(sortedList);

                    const lastSeenCount = Number(localStorage.getItem(`lastSeenNotifCount_${user.id}`) || 0);
                    const newUnreadCount = sortedList.length - lastSeenCount;
                    setUnreadCount(newUnreadCount > 0 ? newUnreadCount : 0);
                }
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    useEffect(() => {
        if (isLoggedIn && user?.id && !isRecruiter) {
            fetchNotifications();
            const interval = setInterval(fetchNotifications, 15000);
            return () => clearInterval(interval);
        }
    }, [isLoggedIn, user?.id]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsLangOpen(false);
            }
            if (notifRef.current && !notifRef.current.contains(event.target)) {
                setIsNotifOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleNotifClick = () => {
        setIsNotifOpen(prev => !prev);
    };

    const handleMarkAllAsRead = () => {
        if (user?.id) {
            setUnreadCount(0);
            localStorage.setItem(`lastSeenNotifCount_${user.id}`, notifications.length.toString());
        }
    };

    const toggleLanguage = (selectedLang) => {
        setLang(selectedLang);
        localStorage.setItem('lang', selectedLang);
        window.location.reload(); 
    };

      const handleSearch = (e) => {
        e.preventDefault();
        const trimmedQuery = searchQuery.trim();
        navigate(trimmedQuery ? `/job-board?q=${encodeURIComponent(trimmedQuery)}` : '/job-board');
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
    };

    const text = {
        en: { logo: '📄 CV Management', home: 'Home', about: 'About', templates: 'Job Board', contact: 'Contact', allcv: 'All CVs', searchPlaceholder: 'Search anything...', logout: 'Logout', login: 'Login', signup: 'SignUp', dashboard: 'Dashboard', recruiter: 'Recruiter' },
        sp: { logo: '📄 Gestión de CV', home: 'Inicio', about: 'Sobre nosotros', templates: 'Bolsa de trabajo', contact: 'Contacto', allcv: 'Todos los CVs', searchPlaceholder: 'Buscar todo...', logout: 'Cerrar sesión', login: 'Acceso', signup: 'Inscribirse', dashboard: 'Tablero', recruiter: 'Reclutador' }
    };

    const currentText = text[lang] || text.en;

    return (
        <div className="navbar flex flex-wrap md:flex-nowrap justify-between bg-base-100 h-16 shadow-lg sticky top-0 z-20 px-4 gap-4">
            
            <div className="flex items-center gap-2">
                <div className="dropdown dropdown-start">
                    <button 
                        className="btn btn-ghost btn-circle"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="Open menu"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                    
                    {isMenuOpen && (
                        <ul className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-56 absolute left-0 top-12">
                            <li><Link to="/" onClick={() => setIsMenuOpen(false)}>{currentText.home}</Link></li>
                            {userRole !== 'RECRUITER' && userRole !== 'ADMIN' && <li><Link to="/job-board" onClick={() => setIsMenuOpen(false)}>{currentText.templates}</Link></li>}
                            <li><Link to="/about" onClick={() => setIsMenuOpen(false)}>{currentText.about}</Link></li>
                            <li><Link to="/contact" onClick={() => setIsMenuOpen(false)}>{currentText.contact}</Link></li>
                            <li><Link to="/all-cvs" onClick={() => setIsMenuOpen(false)}>{currentText.allcv}</Link></li>
                            {isLoggedIn ? (<>
                                {userRole === 'ADMIN' && <li><Link to="/admin-dashboard" onClick={() => setIsMenuOpen(false)}>👑 Admin</Link></li>}
                                {userRole === 'RECRUITER' && <li><Link to="/recruiter/dashboard" onClick={() => setIsMenuOpen(false)}>💼 {currentText.recruiter}</Link></li>}
                                {userRole === 'CANDIDATE' && <li><Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>📊 {currentText.dashboard}</Link></li>}
                            </>

                            ) : (
                                <li><Link to="/login" onClick={() => setIsMenuOpen(false)}>📝 {currentText.dashboard}</Link></li>
                            )}
                        </ul>
                    )}
                </div>

                <Link to="/" className="btn btn-ghost text-xl font-bold">
                    {currentText.logo}
                </Link>
            </div>

           <form onSubmit={handleSearch} className="flex-1 mt-4 max-w-md mx-4">
                <div className="relative w-full">
                    <input type="text"
                            value={searchQuery}
    onChange={(e) => {
        const value = e.target.value;
        setSearchQuery(value);
        const trimmedValue = value.trim();
        if (trimmedValue) {
            navigate(`/job-board?q=${encodeURIComponent(trimmedValue)}`);
        }
       
    }}
    placeholder={currentText.searchPlaceholder}
    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none bg-base-200 text-base-content transition text-sm"
                                />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>
            </form>
           
            <div className="flex items-center gap-4">
                <ul className="menu menu-horizontal hidden lg:flex gap-4 px-1">
                    <li><Link to="/">{currentText.home}</Link></li>
                    {userRole !== 'RECRUITER' && userRole !== 'ADMIN' && <li><Link to="/job-board">{currentText.templates}</Link></li>}
                    <li><Link to="/about">{currentText.about}</Link></li>
                    <li><Link to="/contact">{currentText.contact}</Link></li>
    

                    {isLoggedIn && (<>
                        {userRole === 'ADMIN' && <li><Link to="/admin-dashboard" className="text-red-500 font-bold dark:text-red-400">Admin</Link></li>}
                        {userRole === 'RECRUITER' && <li><Link to="/recruiter/dashboard" className="text-blue-600 font-bold dark:text-blue-400">{currentText.recruiter}</Link></li>}
                        {userRole === 'CANDIDATE' && <li><Link to="/dashboard" className="text-purple-600 font-bold dark:text-purple-400">{currentText.dashboard}</Link>
                        </li> }
                    </>
                    )}
                </ul>

                {isLoggedIn && !isRecruiter && (
                    <div className="relative inline-flex items-center" ref={notifRef}>
                        <button 
                            type="button" 
                            onClick={handleNotifClick} 
                            className="btn btn-ghost btn-circle relative bg-base-200 hover:bg-base-300"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                        </button>
                        
                        <span className="ml-1 font-bold font-mono text-sm text-base-content min-w-[12px]">
                            {unreadCount}
                        </span>

                        {isNotifOpen && (
                            <div className="absolute right-0 top-12 mt-2 p-2 shadow-2xl bg-base-100 rounded-box w-72 border border-base-300 z-[50] menu">
                                <div className="p-2 font-bold text-sm tracking-wide border-b border-base-300 flex justify-between items-center">
                                    <span>Notifications</span>
                                    {unreadCount > 0 && (
                                        <button onClick={handleMarkAllAsRead} className="btn btn-xs btn-ghost text-primary font-semibold">
                                            Mark all as read
                                        </button>
                                    )}
                                </div>
                                <div className="max-h-60 overflow-y-auto space-y-1 mt-2">
                                    {notifications.map((notif) => (
                                        <div key={notif.id} className="p-2 bg-base-200 hover:bg-base-300/70 rounded-xl text-xs transition-all">
                                            <p className="font-medium text-base-content leading-relaxed">{notif.message}</p>
                                            <span className="text-[10px] opacity-40 block mt-1">
                                                {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    ))}
                                    {notifications.length === 0 && (
                                        <div className="text-center py-6 opacity-40 text-xs italic">
                                            No new updates yet
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                <div className="relative inline-block text-left" ref={dropdownRef}>
                    <button
                        type="button"
                        onClick={() => setIsLangOpen(!isLangOpen)}
                        className="btn btn-sm btn-ghost gap-1 font-semibold border border-gray-300 rounded-lg flex items-center"
                    >
                        🌐 {lang.toUpperCase()}
                        <svg className="fill-current h-4 w-4 ml-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                        </svg>
                    </button>

                    {isLangOpen && (
                        <ul className="absolute right-0 mt-2 p-2 shadow-2xl bg-base-100 rounded-box w-32 border border-base-300 z-[50] menu">
                            <li>
                                <button
                                    onClick={() => {
                                        toggleLanguage('en');
                                        setIsLangOpen(false);
                                    }}
                                    className={`flex justify-between w-full px-3 py-2 text-sm ${lang === 'en' ? 'bg-purple-100 text-purple-700 font-bold dark:bg-purple-950/40' : ''}`}
                                >
                                    English {lang === 'en' && '✓'}
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => {
                                        toggleLanguage('sp');
                                        setIsLangOpen(false);
                                    }}
                                    className={`flex justify-between w-full px-3 py-2 text-sm ${lang === 'sp' ? 'bg-purple-100 text-purple-700 font-bold dark:bg-purple-950/40' : ''}`}
                                >
                                    Español {lang === 'sp' && '✓'}
                                </button>
                            </li>
                        </ul>
                    )}
                </div>

                <button 
                    onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                    className="btn btn-sm btn-ghost btn-circle text-lg"
                    title="Toggle Theme"
                >
                    {theme === 'light' ? '🌙' : '☀️'}
                </button>

                {isLoggedIn ? (
                    <div className="flex items-center gap-2">
                        <div className="avatar placeholder">
                            <Link to="/profile" className="bg-purple-600 text-white rounded-full w-9 h-9 flex items-center justify-center hover:bg-purple-700 transition-all">
                                <span className="text-sm">👤</span>
                            </Link>
                        </div>
                        <button 
                            onClick={handleLogout}
                            className="btn btn-sm btn-ghost text-red-500 hover:bg-red-100 dark:hover:bg-red-950/30 font-semibold"
                        >
                            {currentText.logout}
                        </button>
                    </div>
                ) : (
                    <div className="flex gap-2">
                        <Link to="/login" className="btn btn-sm btn-outline">{currentText.login}</Link>
                        <Link to="/signup" className="btn btn-sm btn-primary rounded-2xl w-18 bg-purple-600 border-0 text-center hover:bg-purple-700 text-white">{currentText.signup}</Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Navbar;