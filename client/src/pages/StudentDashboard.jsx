import React from 'react';
import Layout from '../components/Layout';
import { useStudentStats } from '../hooks/useStudentStats';
import { formatCurrency, formatPercentage } from '../utils/formatters';
import { getAttendanceLabel, getAttendanceColor } from '../utils/calculations';

const StudentDashboard = () => {
    const { stats, loading, error } = useStudentStats();

    if (loading) {
        return (
            <Layout role="student">
                <div className="flex items-center justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1D4ED8]"></div>
                </div>
            </Layout>
        );
    }

    if (error) {
        return (
            <Layout role="student">
                <div className="card-dark p-6 text-center">
                    <p className="text-[#6B7280]">{error}</p>
                </div>
            </Layout>
        );
    }

    const StatCard = ({ title, value, icon, delay, subtitle, isHighlight }) => {
        const delayClass = `animate-delay-${delay}00`;
        return (
            <div className={`bg-white/5 backdrop-blur-sm p-5 rounded-xl border ${isHighlight ? 'border-[#238636]/50 bg-[#238636]/5' : 'border-white/10'} hover:border-[#58a6ff]/50 hover:bg-white/10 transition-all duration-300 hover:shadow-xl hover:shadow-[#58a6ff]/10 animate-fadeInUp transform hover:-translate-y-1 ${delayClass}`}>
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
    };

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
                        value={formatPercentage(stats.attendancePercentage)}
                        subtitle={getAttendanceLabel(stats.attendancePercentage)}
                        delay={0}
                        isHighlight={stats.attendancePercentage >= 75}
                        icon={
                            <svg className={`w-6 h-6 text-${getAttendanceColor(stats.attendancePercentage)}`} fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                        }
                    />
                    <StatCard
                        title="Present Days"
                        value={stats.presentCount}
                        subtitle="Days"
                        delay={1}
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
                        delay={2}
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
                        delay={3}
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
                        delay={4}
                        icon={
                            <svg className={`w-6 h-6 ${stats.feeStatus === 'Clear' ? 'text-[#1D4ED8]' : 'text-[#6B7280]'}`} fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                            </svg>
                        }
                    />
                    <StatCard
                        title="Total Fees"
                        value={formatCurrency(stats.totalFees)}
                        subtitle="PKR"
                        delay={5}
                        icon={
                            <svg className="w-6 h-6 text-[#1D4ED8]" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                            </svg>
                        }
                    />
                    <StatCard
                        title="Paid Fees"
                        value={formatCurrency(stats.paidFees)}
                        subtitle="PKR"
                        delay={6}
                        icon={
                            <svg className="w-6 h-6 text-[#1D4ED8]" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                        }
                    />
                    <StatCard
                        title="Unpaid Fees"
                        value={formatCurrency(stats.unpaidFees)}
                        subtitle="PKR"
                        delay={7}
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
