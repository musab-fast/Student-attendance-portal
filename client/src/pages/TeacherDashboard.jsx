import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import axios from 'axios';

const TeacherDashboard = () => {
    const [courses, setCourses] = useState([]);
    const [stats, setStats] = useState({
        totalCourses: 0,
        totalStudents: 0
    });

    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const config = {
        headers: { Authorization: `Bearer ${userInfo?.token}` }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const { data } = await axios.get('http://localhost:5000/api/teacher/courses', config);
            setCourses(data);

            let totalStudents = 0;
            for (const course of data) {
                try {
                    const { data: students } = await axios.get(
                        `http://localhost:5000/api/teacher/enrolled-students/${course._id}`,
                        config
                    );
                    totalStudents += students.length;
                } catch (err) {
                    console.error(`Error fetching students for course ${course._id}:`, err);
                }
            }

            setStats({
                totalCourses: data.length,
                totalStudents
            });
        } catch (err) {
            console.error(err);
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
        <Layout role="teacher">
            {/* Header */}
            <div className="mb-8 animate-fadeInUp">
                <h1 className="text-4xl font-bold text-[#F5F5F5] mb-2">Teacher Dashboard</h1>
                <p className="text-[#D1D5DB]">Welcome back! Here's your academic overview</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <StatCard
                    title="Total Courses"
                    value={stats.totalCourses}
                    color="[#1D4ED8]"
                    delay={0}
                    subtitle="Assigned"
                    icon={
                        <svg className="w-6 h-6 text-[#1D4ED8]" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z" />
                        </svg>
                    }
                />
                <StatCard
                    title="Total Students"
                    value={stats.totalStudents}
                    color="[#1D4ED8]"
                    delay={0.1}
                    subtitle="Enrolled"
                    icon={
                        <svg className="w-6 h-6 text-[#1D4ED8]" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                        </svg>
                    }
                />
            </div>

            {/* Assigned Courses */}
            <div className="card-dark p-6 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
                <h2 className="text-xl font-bold mb-4 text-[#F5F5F5] flex items-center gap-2">
                    <svg className="w-6 h-6 text-[#1D4ED8]" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z" />
                    </svg>
                    Assigned Courses
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {courses.map((course, index) => (
                        <div
                            key={course._id}
                            className="bg-gradient-to-br from-[#2E2E2E] to-[#0F172A] p-5 rounded-xl border border-[#2E2E2E] hover:border-[#1D4ED8] transition-all duration-300 hover:shadow-lg hover:shadow-[#1D4ED8]/10 group"
                            style={{ animationDelay: `${0.3 + index * 0.05}s` }}
                        >
                            <div className="flex items-start justify-between mb-3">
                                <h3 className="font-bold text-[#F5F5F5] group-hover:text-[#1D4ED8] transition-colors">{course.course_name}</h3>
                                <span className="bg-[#1D4ED8]/10 text-[#1D4ED8] text-xs px-2 py-1 rounded-full border border-[#1D4ED8]/20">
                                    {course.course_id}
                                </span>
                            </div>
                            <div className="space-y-2 text-sm">
                                <p className="text-[#D1D5DB] flex items-center gap-2">
                                    <svg className="w-4 h-4 text-[#6B7280]" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z" />
                                    </svg>
                                    <span className="text-[#6B7280]">Credits:</span> {course.credit_hours}
                                </p>
                                <p className="text-[#D1D5DB] flex items-center gap-2">
                                    <svg className="w-4 h-4 text-[#6B7280]" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                                    </svg>
                                    <span className="text-[#6B7280]">Semester:</span> {course.semester}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
                {courses.length === 0 && (
                    <div className="text-center py-12">
                        <svg className="w-16 h-16 text-[#6B7280] mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                        <p className="text-[#6B7280]">No courses assigned yet</p>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default TeacherDashboard;



