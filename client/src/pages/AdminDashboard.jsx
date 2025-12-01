import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import axios from 'axios';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalStudents: 0,
        totalTeachers: 0,
        totalCourses: 0,
        totalFees: 0,
        paidFees: 0,
        unpaidFees: 0
    });

    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const config = {
        headers: { Authorization: `Bearer ${userInfo?.token}` }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const { data: users } = await axios.get('http://localhost:5000/api/admin/users', config);
            const students = users.filter(u => u.role === 'student').length;
            const teachers = users.filter(u => u.role === 'teacher').length;

            const { data: courses } = await axios.get('http://localhost:5000/api/admin/courses', config);

            const { data: fees } = await axios.get('http://localhost:5000/api/admin/fees', config);
            const totalFees = fees.reduce((sum, fee) => sum + fee.amount, 0);
            const paidFees = fees.filter(f => f.status === 'Paid').reduce((sum, fee) => sum + fee.amount, 0);

            setStats({
                totalStudents: students,
                totalTeachers: teachers,
                totalCourses: courses.length,
                totalFees,
                paidFees,
                unpaidFees: totalFees - paidFees
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const StatCard = ({ title, value, icon, color, delay, subtitle }) => (
        <div className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10 hover:border-[#58a6ff]/50 hover:bg-white/10 transition-all duration-300 hover:shadow-xl hover:shadow-[#58a6ff]/10 animate-fadeInUp transform hover:-translate-y-1" style={{ animationDelay: `${delay}s` }}>
            <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-[#58a6ff]/10 rounded-lg flex items-center justify-center border border-[#58a6ff]/20">
                    {icon}
                </div>
                {subtitle && (
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#58a6ff]/10 text-[#58a6ff] border border-[#58a6ff]/20">
                        {subtitle}
                    </span>
                )}
            </div>
            <div>
                <p className="text-[#8b949e] text-sm font-medium mb-1">{title}</p>
                <p className="text-3xl font-bold text-[#c9d1d9]">{value}</p>
            </div>
        </div>
    );

    return (
        <Layout role="admin">
            {/* Header */}
            <div className="mb-8 animate-fadeInUp">
                <h1 className="text-4xl font-bold text-[#F5F5F5] mb-2">Admin Dashboard</h1>
                <p className="text-[#D1D5DB]">Welcome back! Here's your system overview</p>
            </div>

            {/* Core Stats */}
            <div className="mb-8">
                <h2 className="text-xl font-bold text-[#F5F5F5] mb-4 flex items-center gap-2">
                    <svg className="w-6 h-6 text-[#1D4ED8]" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z" />
                    </svg>
                    System Overview
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCard
                        title="Total Students"
                        value={stats.totalStudents}
                        color="[#1D4ED8]"
                        delay={0}
                        subtitle="Active"
                        icon={
                            <svg className="w-6 h-6 text-[#1D4ED8]" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                            </svg>
                        }
                    />
                    <StatCard
                        title="Total Teachers"
                        value={stats.totalTeachers}
                        color="[#1D4ED8]"
                        delay={0.1}
                        subtitle="Active"
                        icon={
                            <svg className="w-6 h-6 text-[#1D4ED8]" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z" />
                            </svg>
                        }
                    />
                    <StatCard
                        title="Total Courses"
                        value={stats.totalCourses}
                        color="[#1D4ED8]"
                        delay={0.2}
                        subtitle="Offered"
                        icon={
                            <svg className="w-6 h-6 text-[#1D4ED8]" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                            </svg>
                        }
                    />
                </div>
            </div>

            {/* Fee Stats */}
            <div>
                <h2 className="text-xl font-bold text-[#F5F5F5] mb-4 flex items-center gap-2">
                    <svg className="w-6 h-6 text-[#6B7280]" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                    </svg>
                    Financial Overview
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCard
                        title="Total Fees"
                        value={`Rs. ${stats.totalFees.toLocaleString()}`}
                        color="[#1D4ED8]"
                        delay={0.3}
                        subtitle="PKR"
                        icon={
                            <svg className="w-6 h-6 text-[#1D4ED8]" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                            </svg>
                        }
                    />
                    <StatCard
                        title="Paid Fees"
                        value={`Rs. ${stats.paidFees.toLocaleString()}`}
                        color="[#1D4ED8]"
                        delay={0.4}
                        subtitle="PKR"
                        icon={
                            <svg className="w-6 h-6 text-[#1D4ED8]" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                        }
                    />
                    <StatCard
                        title="Unpaid Fees"
                        value={`Rs. ${stats.unpaidFees.toLocaleString()}`}
                        color="[#6B7280]"
                        delay={0.5}
                        subtitle="PKR"
                        icon={
                            <svg className="w-6 h-6 text-[#6B7280]" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        }
                    />
                </div>
            </div>
        </Layout>
    );
};

export default AdminDashboard;



