import React from 'react';
import { Link } from 'react-router-dom';

const Footer = ({ role }) => {
    const currentYear = new Date().getFullYear();

    const quickLinks = {
        admin: [
            { name: 'Dashboard', path: '/admin' },
            { name: 'Users', path: '/admin/users' },
            { name: 'Courses', path: '/admin/courses' },
            { name: 'Reports', path: '/admin/reports' },
        ],
        teacher: [
            { name: 'Dashboard', path: '/teacher' },
            { name: 'Attendance', path: '/teacher/attendance' },
            { name: 'Results', path: '/teacher/results' },
            { name: 'Timetable', path: '/teacher/timetable' },
        ],
        student: [
            { name: 'Dashboard', path: '/student' },
            { name: 'Attendance', path: '/student/attendance' },
            { name: 'Results', path: '/student/results' },
            { name: 'Timetable', path: '/student/timetable' },
        ]
    };

    const links = quickLinks[role] || [];

    return (
        <footer className="bg-[#222222] border-t border-[#2E2E2E] mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* About Section */}
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-[#1D4ED8] rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/50">
                                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-bold text-[#F5F5F5]">Student Portal</h3>
                        </div>
                        <p className="text-sm text-[#6B7280] leading-relaxed">
                            Comprehensive student management system for attendance, results, and fee tracking.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-sm font-semibold text-[#F5F5F5] mb-4 uppercase tracking-wider">Quick Links</h4>
                        <ul className="space-y-2">
                            {links.map(link => (
                                <li key={link.path}>
                                    <Link
                                        to={link.path}
                                        className="text-sm text-[#6B7280] hover:text-[#1D4ED8] transition-colors flex items-center gap-2"
                                    >
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                        </svg>
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-sm font-semibold text-[#F5F5F5] mb-4 uppercase tracking-wider">Support</h4>
                        <ul className="space-y-3 text-sm text-[#6B7280]">
                            <li className="flex items-center gap-2">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                </svg>
                                support@studentportal.com
                            </li>
                            <li className="flex items-center gap-2">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                                </svg>
                                +1 (555) 123-4567
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-8 pt-6 border-t border-[#2E2E2E]">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                        <p className="text-sm text-[#6B7280]">
                            © {currentYear} Student Portal. All rights reserved.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="text-[#6B7280] hover:text-[#1D4ED8] transition-colors">
                                <span className="sr-only">Privacy Policy</span>
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                            </a>
                            <a href="#" className="text-[#6B7280] hover:text-[#1D4ED8] transition-colors">
                                <span className="sr-only">Terms</span>
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;



