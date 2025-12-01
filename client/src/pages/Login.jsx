import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Logo from '../components/Logo';
import config from '../config';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post(`${config.API_URL}/auth/login`, { email, password });
            localStorage.setItem('userInfo', JSON.stringify(data));

            if (data.role === 'admin') navigate('/admin');
            else if (data.role === 'teacher') navigate('/teacher');
            else if (data.role === 'student') navigate('/student');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="min-h-screen flex bg-[#0d1117]">
            {/* Left Panel - Branding (Hidden on mobile) */}
            <div className="hidden lg:flex lg:w-1/2 bg-[#161b22] border-r border-[#30363d] flex-col justify-center items-center p-12 relative overflow-hidden">
                {/* Background decoration */}
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#1D4ED8] rounded-full blur-3xl"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#238636] rounded-full blur-3xl"></div>
                </div>

                <div className="relative z-10 text-center space-y-8 animate-fadeInUp">
                    <div className="flex justify-center">
                        <Logo className="w-32 h-32" />
                    </div>
                    <div className="space-y-4">
                        <h1 className="text-4xl font-bold text-[#c9d1d9] tracking-tight">Student Portal</h1>
                        <p className="text-lg text-[#8b949e] max-w-md mx-auto">
                            Manage attendance, view results, and stay updated with your academic progress.
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Panel - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
                <div className="w-full max-w-[400px] space-y-8 animate-fadeInUp">
                    {/* Mobile Logo (Visible only on mobile) */}
                    <div className="lg:hidden flex flex-col items-center space-y-4 mb-8">
                        <Logo className="w-16 h-16" />
                        <h1 className="text-2xl font-bold text-[#c9d1d9]">Student Portal</h1>
                    </div>

                    <div className="text-center lg:text-left">
                        <h2 className="text-2xl font-semibold text-[#c9d1d9]">Welcome back</h2>
                        <p className="text-[#8b949e] mt-2">Please enter your details to sign in.</p>
                    </div>

                    {error && (
                        <div className="bg-[#f85149]/10 border border-[#f85149]/40 text-[#f85149] px-4 py-3 rounded-md text-sm flex items-center gap-2">
                            <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 16 16" fill="currentColor">
                                <path fillRule="evenodd" d="M2.343 13.657A8 8 0 1113.657 2.343 8 8 0 012.343 13.657zM6.03 4.97a.75.75 0 00-1.06 1.06L6.94 8 4.97 10.03a.75.75 0 101.06 1.06L8 9.06l2.03 2.03a.75.75 0 101.06-1.06L9.06 8l2.03-2.03a.75.75 0 10-1.06-1.06L8 6.94 6.03 4.97z" />
                            </svg>
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-[#c9d1d9]">Email address</label>
                            <input
                                type="email"
                                className="w-full px-4 py-2 bg-[#0d1117] border border-[#30363d] text-[#c9d1d9] rounded-lg focus:border-[#58a6ff] focus:ring-2 focus:ring-[#58a6ff]/30 transition-all duration-200 outline-none placeholder-[#484f58] text-sm"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <label className="block text-sm font-medium text-[#c9d1d9]">Password</label>
                                <a href="#" className="text-xs text-[#58a6ff] hover:underline">Forgot password?</a>
                            </div>
                            <input
                                type="password"
                                className="w-full px-4 py-2 bg-[#0d1117] border border-[#30363d] text-[#c9d1d9] rounded-lg focus:border-[#58a6ff] focus:ring-2 focus:ring-[#58a6ff]/30 transition-all duration-200 outline-none placeholder-[#484f58] text-sm"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-[#238636] text-white font-medium py-2.5 px-4 rounded-lg border border-[#f0f6fc]/10 hover:bg-[#2ea043] shadow-lg shadow-green-900/20 transition-all duration-200 text-sm"
                        >
                            Sign in
                        </button>
                    </form>

                    <div className="text-center text-sm text-[#8b949e]">
                        <p>Don't have an account? <a href="#" className="text-[#58a6ff] hover:underline font-medium">Create an account</a></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
