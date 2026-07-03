import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <div className="navbar flex justify-between bg-base-100 shadow-lg sticky  z-20">
            {/* 3 Dot Menu + Logo - Left Side */}
            <div className="flex items-center gap-2">
                {/* 3 Dot Menu */}
                <div className="dropdown dropdown-start p-3 px-2">
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
                            <li><Link to="/my-cv" className="flex items-center gap-2" onClick={() => setIsMenuOpen(false)}>📝 My CV</Link></li>
                            <li><a className="flex items-center gap-2" onClick={() => setIsMenuOpen(false)}>❤️ Saved Templates</a></li>
                            <li><a className="flex items-center gap-2" onClick={() => setIsMenuOpen(false)}>⚙️ Settings</a></li>
                        </ul>
                    )}
                </div>

                {/* Logo */}
                <div className="p-3">
                    <Link to="/" className="btn btn-ghost text-xl font-bold ">
                        📄 CV Management
                    </Link>
                </div>
            </div>
            
            {/* Navigation Menu */}
            <div className="flex-none flex mt-2 ml-64 gap-2">
                <ul className="menu menu-horizontal flex gap-3  px-1 py-2 bg-base-100">
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/about">About</Link></li>
                    <li><Link to="/templates">Templates</Link></li>
                    <li><Link to="/contact">Contact</Link></li>
                </ul>

                {/* Sign Up & Login Buttons */}
                <div className="flex gap-2 mt-2">
                    <Link className="btn btn-sm btn-outline">
                        Login
                    </Link>
                    <Link className="btn btn-sm btn-primary">
                        Sign Up
                    </Link>
                </div>
            </div>

            {/* Avatar + Logout - Right Side */}
            <div className="flex-none  flex items-center gap-2 px-2">
                <div className="avatar placeholder">
                    <div className="bg-purple-600 text-white rounded-full w-10">
                        <span className="text-lg">👤</span>
                    </div>
                </div>
                <Link className="btn btn-sm btn-ghost text-red-500 hover:bg-red-100">
                    Logout
                </Link>
            </div>
        </div>
    );
};

export default Navbar;