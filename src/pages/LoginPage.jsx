import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

 const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
        setError('Please fill in all fields');
        return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setError('Please enter a valid email');
        return;
    }
    
    try {
        const response = await fetch('http://localhost:5001/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Something went wrong');
        }

        console.log('Login successful:', data);
        
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/'); 
        
    } catch (err) {
        setError(err.message);
    }
};

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-lg shadow-2xl p-8">
                    <div className="text-center mb-8">
                        <div className="text-5xl mb-4">📄</div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">CV Management</h1>
                        <p className="text-gray-600">Login to your account</p>
                    </div>

                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none transition"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none transition"
                            />
                        </div>

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
                            <a href="#" className="text-sm text-purple-600 hover:text-purple-700 font-medium">Forgot password?</a>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold py-2 rounded-lg hover:shadow-lg transition duration-300"
                        >
                            Login
                        </button>
                    </form>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300"></div></div>
                        <div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-gray-500">Or</span></div>
                    </div>

                    <div className="space-y-3">
                        
                        <button 
                            type="button"
                            onClick={() => window.location.href = 'http://localhost:5001/api/auth/google'}
                            className="w-full border border-gray-300 text-gray-700 font-semibold py-2 rounded-lg hover:bg-gray-50 transition"
                        >
                            Continue with Google
                        </button>
                    </div>

                    <p className="text-center text-gray-600 mt-6">
                        Don't have an account?{' '}
                        <Link to="/signup" className="text-purple-600 hover:text-purple-700 font-semibold">Sign Up</Link>
                    </p>

                    <p className="text-center text-gray-600 mt-4">
                        <Link to="/" className="text-gray-600 hover:text-gray-700 font-medium">← Back to Home</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}