import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

const Reports = () => {
    const [teacherReports, setTeacherReports] = useState([]);
    const [studentReports, setStudentReports] = useState([]);
    const [activeTab, setActiveTab] = useState('teachers');
    const [loading, setLoading] = useState(false);

    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const config = {
        headers: { Authorization: `Bearer ${userInfo?.token}` }
    };

    useEffect(() => {
        fetchReports();
    }, [activeTab]);

    const fetchReports = async () => {
        setLoading(true);
        try {
            if (activeTab === 'teachers') {
                const { data } = await axios.get('http://localhost:5000/api/admin/reports/teachers', config);
                setTeacherReports(data);
            } else {
                const { data } = await axios.get('http://localhost:5000/api/admin/reports/students', config);
                setStudentReports(data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-[#0D0D0D]">
            <Sidebar role="admin" />
            <div className="flex-1 flex flex-col">
                <div className="flex-1 p-8 custom-scrollbar overflow-y-auto">
                    <div className="max-w-7xl mx-auto">
                        <h1 className="text-3xl font-bold mb-6 text-[#F5F5F5] animate-fadeInUp">Reports</h1>

                        {/* Tabs */}
                        <div className="card-dark rounded-xl mb-6 overflow-hidden animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
                            <div className="flex border-b border-[#2E2E2E]">
                                <button
                                    onClick={() => setActiveTab('teachers')}
                                    className={`px-6 py-3 font-medium transition-all ${activeTab === 'teachers'
                                        ? 'border-b-2 border-[#1D4ED8] text-[#1D4ED8] bg-[#1D4ED8]/10'
                                        : 'text-[#D1D5DB] hover:text-[#F5F5F5] hover:bg-[#2E2E2E]/30'
                                        }`}
                                >
                                    Teacher Reports
                                </button>
                                <button
                                    onClick={() => setActiveTab('students')}
                                    className={`px-6 py-3 font-medium transition-all ${activeTab === 'students'
                                        ? 'border-b-2 border-[#1D4ED8] text-[#1D4ED8] bg-[#1D4ED8]/10'
                                        : 'text-[#D1D5DB] hover:text-[#F5F5F5] hover:bg-[#2E2E2E]/30'
                                        }`}
                                >
                                    Student Reports
                                </button>
                            </div>

                            <div className="p-6">
                                {loading ? (
                                    <p className="text-center text-[#6B7280] py-8">Loading...</p>
                                ) : activeTab === 'teachers' ? (
                                    <div>
                                        <h2 className="text-xl font-bold mb-4 text-[#F5F5F5]">Teacher Statistics</h2>
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left border-collapse">
                                                <thead>
                                                    <tr className="border-b border-[#2E2E2E]">
                                                        <th className="p-3 text-[#D1D5DB] font-semibold">Name</th>
                                                        <th className="p-3 text-[#D1D5DB] font-semibold">Email</th>
                                                        <th className="p-3 text-[#D1D5DB] font-semibold">Teacher ID</th>
                                                        <th className="p-3 text-[#D1D5DB] font-semibold">Department</th>
                                                        <th className="p-3 text-[#D1D5DB] font-semibold">Courses</th>
                                                        <th className="p-3 text-[#D1D5DB] font-semibold">Total Students</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {teacherReports.map(teacher => (
                                                        <tr key={teacher._id} className="border-b border-[#2E2E2E] hover:bg-[#2E2E2E]/30 transition-colors">
                                                            <td className="p-3 font-medium text-[#F5F5F5]">{teacher.name}</td>
                                                            <td className="p-3 text-[#D1D5DB]">{teacher.email}</td>
                                                            <td className="p-3 text-[#F5F5F5]">{teacher.teacher_id}</td>
                                                            <td className="p-3 text-[#F5F5F5]">{teacher.department}</td>
                                                            <td className="p-3">
                                                                <span className="bg-[#1D4ED8]/20 text-[#1D4ED8] px-3 py-1 rounded-full text-sm border border-[#1D4ED8]/30">
                                                                    {teacher.courses}
                                                                </span>
                                                            </td>
                                                            <td className="p-3">
                                                                <span className="bg-[#1D4ED8]/20 text-[#1D4ED8] px-3 py-1 rounded-full text-sm border border-[#1D4ED8]/30">
                                                                    {teacher.students}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                            {teacherReports.length === 0 && (
                                                <p className="text-center text-[#6B7280] py-8">No teacher data available</p>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <h2 className="text-xl font-bold mb-4 text-[#F5F5F5]">Student Statistics</h2>
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left border-collapse text-sm">
                                                <thead>
                                                    <tr className="border-b border-[#2E2E2E]">
                                                        <th className="p-3 text-[#D1D5DB] font-semibold">Name</th>
                                                        <th className="p-3 text-[#D1D5DB] font-semibold">Roll No</th>
                                                        <th className="p-3 text-[#D1D5DB] font-semibold">Dept</th>
                                                        <th className="p-3 text-[#D1D5DB] font-semibold">Sem</th>
                                                        <th className="p-3 text-[#D1D5DB] font-semibold">Sec</th>
                                                        <th className="p-3 text-[#D1D5DB] font-semibold">Courses</th>
                                                        <th className="p-3 text-[#D1D5DB] font-semibold">Attendance</th>
                                                        <th className="p-3 text-[#D1D5DB] font-semibold">Results</th>
                                                        <th className="p-3 text-[#D1D5DB] font-semibold">Fees</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {studentReports.map(student => (
                                                        <tr key={student._id} className="border-b border-[#2E2E2E] hover:bg-[#2E2E2E]/30 transition-colors">
                                                            <td className="p-3">
                                                                <div className="font-medium text-[#F5F5F5]">{student.name}</div>
                                                                <div className="text-xs text-[#6B7280]">{student.email}</div>
                                                            </td>
                                                            <td className="p-3 text-[#F5F5F5]">{student.roll_number}</td>
                                                            <td className="p-3 text-[#F5F5F5]">{student.department}</td>
                                                            <td className="p-3 text-[#F5F5F5]">{student.semester}</td>
                                                            <td className="p-3 text-[#F5F5F5]">{student.section}</td>
                                                            <td className="p-3">
                                                                <span className="bg-[#1D4ED8]/20 text-[#1D4ED8] px-2 py-1 rounded border border-[#1D4ED8]/30">
                                                                    {student.enrolledCourses}
                                                                </span>
                                                            </td>
                                                            <td className="p-3">
                                                                <div className="flex items-center gap-2">
                                                                    <span className={`px-2 py-1 rounded ${student.attendancePercentage >= 75
                                                                        ? 'bg-[#1D4ED8]/20 text-[#1D4ED8] border border-[#1D4ED8]/30'
                                                                        : student.attendancePercentage >= 50
                                                                            ? 'bg-[#6B7280]/20 text-[#6B7280] border border-[#6B7280]/30'
                                                                            : 'bg-[#6B7280]/20 text-[#6B7280] border border-[#6B7280]/30'
                                                                        }`}>
                                                                        {student.attendancePercentage}%
                                                                    </span>
                                                                </div>
                                                                <div className="text-xs text-[#6B7280] mt-1">
                                                                    {student.presentCount}/{student.totalAttendance}
                                                                </div>
                                                            </td>
                                                            <td className="p-3">
                                                                <span className="bg-[#1D4ED8]/20 text-[#1D4ED8] px-2 py-1 rounded border border-[#1D4ED8]/30">
                                                                    {student.resultsCount}
                                                                </span>
                                                            </td>
                                                            <td className="p-3">
                                                                <div className="text-xs">
                                                                    <div className="text-[#1D4ED8]">Paid: Rs. {student.paidFees.toLocaleString()}</div>
                                                                    <div className="text-[#6B7280]">Unpaid: Rs. {student.unpaidFees.toLocaleString()}</div>
                                                                </div>
                                                                <span className={`px-2 py-1 rounded text-xs mt-1 inline-block ${student.feeStatus === 'Clear'
                                                                    ? 'bg-[#1D4ED8]/20 text-[#1D4ED8] border border-[#1D4ED8]/30'
                                                                    : 'bg-[#6B7280]/20 text-[#6B7280] border border-[#6B7280]/30'
                                                                    }`}>
                                                                    {student.feeStatus}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                            {studentReports.length === 0 && (
                                                <p className="text-center text-[#6B7280] py-8">No student data available</p>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        </div>
    );
};

export default Reports;



