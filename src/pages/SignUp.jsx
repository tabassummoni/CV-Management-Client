import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function SignUp() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [agreeTerms, setAgreeTerms] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        if (!firstName || !lastName || !email || !password || !confirmPassword) {
            setError('Please fill in all fields');
            return;
        }
        
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError('Please enter a valid email');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }
        
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (!agreeTerms) {
            setError('Please agree to the Terms & Conditions');
            return;
        }
        
        try {
            const response = await fetch('http://localhost:5001/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: `${firstName} ${lastName}`,
                    email,
                    password,
                }),
            });

            const textData = await response.text();
            let data = {};
            if (textData) {
                try {
                    data = JSON.parse(textData);
                } catch (e) {
                    console.log("Response parsing error:", textData);
                }
            }

            if (!response.ok) {
                throw new Error(data.error || 'Something went wrong');
            }

   
            if (data.token) {
                localStorage.setItem('token', data.token);
                if (data.user) {
                    localStorage.setItem('user', JSON.stringify(data.user));
                }
                window.location.href = '/';
            } else {
                navigate('/login');
            }
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
                        <p className="text-gray-600">Create your account</p>
                    </div>

                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm font-semibold">
                            ⚠️ {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                                <input
                                    type="text"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    placeholder="First name"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none bg-white text-gray-900 text-sm focus:ring-2 focus:ring-purple-600"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                                <input
                                    type="text"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    placeholder="Last name"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none bg-white text-gray-900 text-sm focus:ring-2 focus:ring-purple-600"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none bg-white text-gray-900 text-sm focus:ring-2 focus:ring-purple-600"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Min 6 characters"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none bg-white text-gray-900 text-sm focus:ring-2 focus:ring-purple-600"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm password"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none bg-white text-gray-900 text-sm focus:ring-2 focus:ring-purple-600"
                            />
                        </div>

                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={agreeTerms}
                                onChange={(e) => setAgreeTerms(e.target.checked)}
                                className="w-4 h-4 text-purple-600 rounded focus:ring-2 focus:ring-purple-600"
                            />
                            <span className="ml-2 text-sm text-gray-700">
                                I agree to the <span className="text-purple-600 hover:text-purple-700 font-medium cursor-pointer">Terms & Conditions</span>
                            </span>
                        </label>

                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold py-2.5 rounded-lg hover:shadow-lg transition duration-300 text-sm mt-2"
                        >
                            Sign Up
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
                            className="w-full border border-gray-300 text-gray-700 font-semibold py-2 rounded-lg hover:bg-gray-50 transition text-sm flex items-center justify-center bg-white"
                        >
                            🌐 Continue with Google
                        </button>
                    </div>

                    <p className="text-center text-gray-600 mt-6 text-sm">
                        Already have an account?{' '}
                        <Link to="/login" className="text-purple-600 hover:text-purple-700 font-semibold">Login</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}