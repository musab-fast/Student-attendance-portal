import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NotificationCenter from './NotificationCenter';
import Logo from './Logo';

const TopNavbar = ({ role, onToggleSidebar }) => {
    const [showUserMenu, setShowUserMenu] = useState(false);
    const navigate = useNavigate();
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    const handleLogout = () => {
        localStorage.removeItem('userInfo');
        navigate('/');
    };

    return (
        <nav className="bg-[#222222] border-b border-[#2E2E2E] sticky top-0 z-50">
            <div className="px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Left side - Logo and Toggle */}
                    <div className="flex items-center gap-4">
                        <button
                            onClick={onToggleSidebar}
                            className="p-2 rounded-lg text-[#D1D5DB] hover:bg-[#2E2E2E] hover:text-[#F5F5F5] transition-colors lg:hidden"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>

                        <div className="flex items-center gap-3">
                            <Logo />
                            <div className="hidden sm:block">
                                <h1 className="text-lg font-bold text-[#F5F5F5]">Student Portal</h1>
                                <p className="text-xs text-[#6B7280] capitalize">{role} Panel</p>
                            </div>
                        </div>
                    </div>

                    {/* Right side - Notifications and User Menu */}
                    <div className="flex items-center gap-2">
                        <NotificationCenter />

                        <div className="relative">
                            <button
                                onClick={() => setShowUserMenu(!showUserMenu)}
                                className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#2E2E2E] transition-colors"
                            >
                                <div className="hidden md:block text-right">
                                    <p className="text-sm font-semibold text-[#F5F5F5]">{userInfo?.name || 'User'}</p>
                                    <p className="text-xs text-[#6B7280] capitalize">{role}</p>
                                </div>
                                <div className="w-10 h-10 bg-[#2E2E2E] rounded-full flex items-center justify-center border-2 border-[#1D4ED8]">
                                    <svg className="w-6 h-6 text-[#1D4ED8]" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </button>

                            {/* Dropdown Menu */}
                            {showUserMenu && (
                                <>
                                    <div
                                        className="fixed inset-0 z-10"
                                        onClick={() => setShowUserMenu(false)}
                                    ></div>
                                    <div className="absolute right-0 mt-2 w-48 bg-[#2E2E2E] rounded-lg shadow-xl border border-[#2E2E2E] z-20">
                                        <div className="p-3 border-b border-[#2E2E2E]">
                                            <p className="text-sm font-semibold text-[#F5F5F5]">{userInfo?.name}</p>
                                            <p className="text-xs text-[#6B7280]">{userInfo?.email}</p>
                                        </div>
                                        <div className="p-2">
                                            <button
                                                onClick={handleLogout}
                                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[#6B7280] hover:bg-[#2E2E2E] rounded-lg transition-colors"
                                            >
                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                                                </svg>
                                                Logout
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default TopNavbar;



