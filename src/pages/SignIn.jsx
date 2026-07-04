import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function SignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Basic validation
        if (!email || !password) {
            setError('Please fill in all fields');
            return;
        }
        
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError('Please enter a valid email');
            return;
        }
        
        // Here you would typically make an API call
        console.log('Sign In:', { email, password, rememberMe });
        setError('');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md">
                {/* Card */}
                <div className="bg-white rounded-lg shadow-2xl p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="text-5xl mb-4">📄</div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">CV Management</h1>
                        <p className="text-gray-600">Sign in to your account</p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none transition"
                            />
                        </div>

                        {/* Password Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none transition"
                            />
                        </div>

                        {/* Remember Me & Forgot Password */}
                        <div className="flex items-center justify-between">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="w-4 h-4 text-purple-600 rounded focus:ring-2 focus:ring-purple-600"
                                />
                                <span className="ml-2 text-sm text-gray-700">Remember me</span>
                            </label>
                            <a href="#" className="text-sm text-purple-600 hover:text-purple-700 font-medium">
                                Forgot password?
                            </a>
                        </div>

                        {/* Sign In Button */}
                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold py-2 rounded-lg hover:shadow-lg transition duration-300"
                        >
                            Sign In
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">Or</span>
                        </div>
                    </div>

                    {/* Social Login */}
                    <div className="space-y-3">
                        <button className="w-full border border-gray-300 text-gray-700 font-semibold py-2 rounded-lg hover:bg-gray-50 transition">
                            Google
                        </button>
                        <button className="w-full border border-gray-300 text-gray-700 font-semibold py-2 rounded-lg hover:bg-gray-50 transition">
                            GitHub
                        </button>
                    </div>

                    {/* Sign Up Link */}
                    <p className="text-center text-gray-600 mt-6">
                        Don't have an account?{' '}
                        <Link to="/signup" className="text-purple-600 hover:text-purple-700 font-semibold">
                            Sign Up
                        </Link>
                    </p>

                    {/* Back to Home */}
                    <p className="text-center text-gray-600 mt-4">
                        <Link to="/" className="text-gray-600 hover:text-gray-700 font-medium">
                            ← Back to Home
                        </Link>
                    </p>
                </div>

                {/* Footer Info */}
                <div className="text-center mt-8 text-white">
                    <p className="text-sm opacity-90">
                        By signing in, you agree to our Terms & Conditions
                    </p>
                </div>
            </div>
        </div>
    );
}
