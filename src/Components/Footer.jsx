import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white py-8 mt-12">
            <div className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    <div>
                        <h3 className="text-lg font-bold mb-4">CV Management</h3>
                        <p className="text-gray-400">Create and manage your professional CV with ease.</p>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold mb-4">Quick Links</h3>
                        <ul className="space-y-2 text-gray-400">
                            <li><a href="/" className="hover:text-white">Home</a></li>
                            <li><a href="/about" className="hover:text-white">About</a></li>
                            <li><a href="/contact" className="hover:text-white">Contact</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold mb-4">Follow Us</h3>
                        <div className="flex gap-4">
                            <a href="#" className="text-gray-400 hover:text-white">Facebook</a>
                            <a href="#" className="text-gray-400 hover:text-white">Twitter</a>
                            <a href="#" className="text-gray-400 hover:text-white">LinkedIn</a>
                        </div>
                    </div>
                </div>
                <div className="border-t border-gray-700 pt-8 text-center">
                    <p className="text-gray-400">&copy; 2026 CV Management System. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;