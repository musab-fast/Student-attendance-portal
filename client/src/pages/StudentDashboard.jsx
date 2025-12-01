import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import axios from 'axios';

const StudentDashboard = () => {
    const [stats, setStats] = useState({
        attendancePercentage: 0,
        presentCount: 0,
        absentCount: 0,
        totalClasses: 0,
        feeStatus: 'Clear',
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
            const { data: attendance } = await axios.get('http://localhost:5000/api/student/attendance', config);
            const { data: fees } = await axios.get('http://localhost:5000/api/student/fees', config);

            const presentCount = attendance.filter(a => a.status === 'Present').length;
            const absentCount = attendance.filter(a => a.status === 'Absent').length;
            const totalClasses = attendance.length;
            const attendancePercentage = totalClasses > 0 ? Math.round((presentCount / totalClasses) * 100) : 0;

            const totalFees = fees.reduce((sum, fee) => sum + fee.amount, 0);
            const paidFees = fees.filter(f => f.status === 'Paid').reduce((sum, fee) => sum + fee.amount, 0);
            const unpaidFees = totalFees - paidFees;

            setStats({
                attendancePercentage,
                presentCount,
                absentCount,
                totalClasses,
                feeStatus: unpaidFees === 0 ? 'Clear' : 'Pending',
                totalFees,
                paidFees,
                unpaidFees
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const StatCard = ({ title, value, icon, color, delay, subtitle, isHighlight }) => (
        <div className={`bg-white/5 backdrop-blur-sm p-5 rounded-xl border ${isHighlight ? 'border-[#238636]/50 bg-[#238636]/5' : 'border-white/10'} hover:border-[#58a6ff]/50 hover:bg-white/10 transition-all duration-300 hover:shadow-xl hover:shadow-[#58a6ff]/10 animate-fadeInUp transform hover:-translate-y-1`} style={{ animationDelay: `${delay}s` }}>
            <div className="flex items-start justify-between mb-3">
                <div className={isHighlight ? 'text-[#238636]' : 'text-[#58a6ff]'}>
                    {icon}
                </div>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${isHighlight ? 'bg-[#238636]/10 text-[#238636] border border-[#238636]/20' : 'bg-[#58a6ff]/10 text-[#58a6ff] border border-[#58a6ff]/20'}`}>
                    {subtitle}
                </span>
            </div>
            <div>
                <p className="text-[#8b949e] text-sm font-medium mb-1">{title}</p>
                <p className="text-2xl font-bold text-[#c9d1d9]">{value}</p>
            </div>
        </div>
    );

    return (
        <Layout role="student">
            {/* Header */}
            <div className="mb-8 animate-fadeInUp">
                <h1 className="text-4xl font-bold text-[#F5F5F5] mb-2">Welcome Back!</h1>
                <p className="text-[#D1D5DB]">Here's your academic overview</p>
            </div>

            {/* Attendance Stats */}
            <div className="mb-8">
                <h2 className="text-xl font-bold text-[#F5F5F5] mb-4 flex items-center gap-2">
                    <svg className="w-6 h-6 text-[#1D4ED8]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                    Attendance Overview
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    <StatCard
                        title="Attendance Rate"
                        value={`${stats.attendancePercentage}%`}
                        subtitle={stats.attendancePercentage >= 75 ? 'Good' : stats.attendancePercentage >= 50 ? 'Fair' : 'Low'}
                        color={stats.attendancePercentage >= 75 ? '[#1D4ED8]' : stats.attendancePercentage >= 50 ? '[#6B7280]' : '[#6B7280]'}
                        delay={0}
                        isHighlight={stats.attendancePercentage >= 75}
                        icon={
                            <svg className={`w-6 h-6 ${stats.attendancePercentage >= 75 ? 'text-[#1D4ED8]' : stats.attendancePercentage >= 50 ? 'text-[#6B7280]' : 'text-[#6B7280]'}`} fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                        }
                    />
                    <StatCard
                        title="Present Days"
                        value={stats.presentCount}
                        subtitle="Days"
                        color="[#1D4ED8]"
                        delay={0.1}
                        icon={
                            <svg className="w-6 h-6 text-[#1D4ED8]" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                        }
                    />
                    <StatCard
                        title="Absent Days"
                        value={stats.absentCount}
                        subtitle="Days"
                        color="[#6B7280]"
                        delay={0.2}
                        icon={
                            <svg className="w-6 h-6 text-[#6B7280]" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        }
                    />
                    <StatCard
                        title="Total Classes"
                        value={stats.totalClasses}
                        subtitle="Classes"
                        color="[#1D4ED8]"
                        delay={0.3}
                        icon={
                            <svg className="w-6 h-6 text-[#1D4ED8]" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                            </svg>
                        }
                    />
                </div>
            </div>

            {/* Fee Stats */}
            <div>
                <h2 className="text-xl font-bold text-[#F5F5F5] mb-4 flex items-center gap-2">
                    <svg className="w-6 h-6 text-[#1D4ED8]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    Fee Information
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    <StatCard
                        title="Fee Status"
                        value={stats.feeStatus}
                        subtitle={stats.feeStatus === 'Clear' ? 'Paid' : 'Pending'}
                        color={stats.feeStatus === 'Clear' ? '[#1D4ED8]' : '[#6B7280]'}
                        delay={0.4}
                        icon={
                            <svg className={`w-6 h-6 ${stats.feeStatus === 'Clear' ? 'text-[#1D4ED8]' : 'text-[#6B7280]'}`} fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                            </svg>
                        }
                    />
                    <StatCard
                        title="Total Fees"
                        value={`Rs. ${stats.totalFees.toLocaleString()}`}
                        subtitle="PKR"
                        color="[#1D4ED8]"
                        delay={0.5}
                        icon={
                            <svg className="w-6 h-6 text-[#1D4ED8]" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                            </svg>
                        }
                    />
                    <StatCard
                        title="Paid Fees"
                        value={`Rs. ${stats.paidFees.toLocaleString()}`}
                        subtitle="PKR"
                        color="[#1D4ED8]"
                        delay={0.6}
                        icon={
                            <svg className="w-6 h-6 text-[#1D4ED8]" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                        }
                    />
                    <StatCard
                        title="Unpaid Fees"
                        value={`Rs. ${stats.unpaidFees.toLocaleString()}`}
                        subtitle="PKR"
                        color="[#6B7280]"
                        delay={0.7}
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

export default StudentDashboard;

