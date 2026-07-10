import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
    const [lang, setLang] = useState(localStorage.getItem('lang') || 'en');
    const [isLangOpen, setIsLangOpen] = useState(false);
    
    const navigate = useNavigate();
    const dropdownRef = useRef(null);

    // চেক করা ইউজার লগইন আছে কিনা
    const isLoggedIn = !!localStorage.getItem('token');

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsLangOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleLanguage = (selectedLang) => {
        setLang(selectedLang);
        localStorage.setItem('lang', selectedLang);
        window.location.reload(); 
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
    };

    // 🌐 ড্যাশবোর্ড সহ ল্যাঙ্গুয়েজ টেক্সট আপডেট
    const text = {
        en: { logo: '📄 CV Management', home: 'Home', about: 'About', templates: 'Templates', contact: 'Contact', searchPlaceholder: 'Search anything...', logout: 'Logout', login: 'Login', signup: 'SignUp', dashboard: 'Dashboard' },
        sp: { logo: '📄 Gestión de CV', home: 'Inicio', about: 'Sobre nosotros', templates: 'Plantillas', contact: 'Contacto', searchPlaceholder: 'Buscar todo...', logout: 'Cerrar sesión', login: 'Acceso', signup: 'Inscribirse', dashboard: 'Tablero' }
    };

    const currentText = text[lang] || text.en;

    return (
        <div className="navbar flex flex-wrap md:flex-nowrap justify-between bg-base-100 h-16 shadow-lg sticky top-0 z-20 px-4 gap-4">
            
            <div className="flex items-center gap-2">
                <div className="dropdown dropdown-start">
                    <button 
                        className="btn btn-ghost btn-circle"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <circle cx="12" cy="5" r="2"/>
                            <circle cx="12" cy="12" r="2"/>
                            <circle cx="12" cy="19" r="2"/>
                        </svg>
                    </button>
                    
                    {isMenuOpen && (
                        <ul className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-56 absolute left-0 top-12">
                            {/* 📝 লগইন থাকলে ড্রপডাউনেও ড্যাশবোর্ড দেখাবে */}
                            {isLoggedIn ? (
                                <li><Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>📊 {currentText.dashboard}</Link></li>
                            ) : (
                                <li><Link to="/login" onClick={() => setIsMenuOpen(false)}>📝 My CV</Link></li>
                            )}
                            <li><a onClick={() => setIsMenuOpen(false)}>❤️ Saved Templates</a></li>
                            <li><a onClick={() => setIsMenuOpen(false)}>⚙️ Settings</a></li>
                        </ul>
                    )}
                </div>

                <Link to="/" className="btn btn-ghost text-xl font-bold">
                    {currentText.logo}
                </Link>
            </div>

            <form onSubmit={handleSearch} className="flex-1 mt-4 max-w-md mx-4">
                <div className="relative w-full">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
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
                    <li><Link to="/about">{currentText.about}</Link></li>
                    <li><Link to="/templates">{currentText.templates}</Link></li>
                    <li><Link to="/contact">{currentText.contact}</Link></li>
                    
                    {/* 🔐 কন্ডিশনাল রেন্ডারিং: লগইন থাকলে বড় স্ক্রিনে "Dashboard" লিঙ্ক দেখাবে */}
                    {isLoggedIn && (
                        <li>
                            <Link to="/dashboard" className="text-purple-600 font-bold dark:text-purple-400">
                                {currentText.dashboard}
                            </Link>
                        </li>
                    )}
                </ul>

                {/* ল্যাঙ্গুয়েজ ড্রপডাউন */}
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

                {/* থিম বাটন */}
                <button 
                    onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                    className="btn btn-sm btn-ghost btn-circle text-lg"
                    title="Toggle Theme"
                >
                    {theme === 'light' ? '🌙' : '☀️'}
                </button>

                {/* 🔒 অথেনটিকেশন অ্যাকশন */}
                {isLoggedIn ? (
                    <div className="flex items-center gap-2">
                        <div className="avatar placeholder">
                            {/* ইউজারের প্রোফাইল আইকনটিতে ক্লিক করলেও এখন সোজা ড্যাশবোর্ডে যাবে */}
                            <Link to="/dashboard" className="bg-purple-600 text-white rounded-full w-9 h-9 flex items-center justify-center hover:bg-purple-700 transition-all">
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
                        <Link to="/signup" className="btn btn-sm btn-primary rounded-2xl w-18 bg-purple-600 border-0 hover:bg-purple-700 text-white">{currentText.signup}</Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Navbar;