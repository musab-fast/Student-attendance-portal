import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../config';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

const MyAttendance = () => {
    const [attendance, setAttendance] = useState([]);
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    const authConfig = {
        headers: {
            Authorization: `Bearer ${userInfo?.token}`,
        },
    };

    useEffect(() => {
        const fetchAttendance = async () => {
            try {
                const { data } = await axios.get(`${config.API_URL}/student/attendance`, authConfig);
                setAttendance(data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchAttendance();
    }, []);

    // Calculate statistics
    const presentCount = attendance.filter(a => a.status === 'Present').length;
    const absentCount = attendance.filter(a => a.status === 'Absent').length;
    const leaveCount = attendance.filter(a => a.status === 'Leave').length;
    const totalClasses = attendance.length;
    const attendancePercentage = totalClasses > 0 ? Math.round((presentCount / totalClasses) * 100) : 0;

    return (
        <div className="flex min-h-screen bg-[#0D0D0D]">
            <Sidebar role="student" />
            <div className="flex-1 flex flex-col">
                <div className="flex-1 p-8 custom-scrollbar overflow-y-auto">
                    <div className="max-w-7xl mx-auto">
                        <h1 className="text-3xl font-bold mb-6 text-[#F5F5F5] animate-fadeInUp">My Attendance</h1>

                        {/* Statistics Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                            <div className="card-dark card-hover p-6 animate-fadeInUp">
                                <h3 className="text-[#D1D5DB] text-sm font-medium mb-2">Attendance %</h3>
                                <p className={`text-3xl font-bold ${attendancePercentage >= 75 ? 'text-[#1D4ED8]' :
                                    attendancePercentage >= 50 ? 'text-[#6B7280]' : 'text-[#6B7280]'
                                    }`}>{attendancePercentage}%</p>
                            </div>
                            <div className="card-dark card-hover p-6 animate-fadeInUp animate-delay-100">
                                <h3 className="text-[#D1D5DB] text-sm font-medium mb-2">Present</h3>
                                <p className="text-3xl font-bold text-[#1D4ED8]">{presentCount}</p>
                            </div>
                            <div className="card-dark card-hover p-6 animate-fadeInUp animate-delay-200">
                                <h3 className="text-[#D1D5DB] text-sm font-medium mb-2">Absent</h3>
                                <p className="text-3xl font-bold text-[#6B7280]">{absentCount}</p>
                            </div>
                            <div className="card-dark card-hover p-6 animate-fadeInUp animate-delay-300">
                                <h3 className="text-[#D1D5DB] text-sm font-medium mb-2">Leave</h3>
                                <p className="text-3xl font-bold text-[#6B7280]">{leaveCount}</p>
                            </div>
                        </div>

                        {/* Attendance History */}
                        <div className="card-dark p-6 animate-fadeInUp animate-delay-400">
                            <h2 className="text-xl font-bold mb-4 text-[#F5F5F5]">Attendance History</h2>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-[#2E2E2E]">
                                            <th className="p-3 text-[#D1D5DB] font-semibold">Date</th>
                                            <th className="p-3 text-[#D1D5DB] font-semibold">Course</th>
                                            <th className="p-3 text-[#D1D5DB] font-semibold">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {attendance.map((record) => (
                                            <tr key={record._id} className="border-b border-[#2E2E2E] hover:bg-[#2E2E2E]/30 transition-colors">
                                                <td className="p-3 text-[#F5F5F5]">
                                                    {new Date(record.date).toLocaleDateString()}
                                                </td>
                                                <td className="p-3 text-[#D1D5DB]">
                                                    {record.course_id?.course_name || 'N/A'}
                                                </td>
                                                <td className="p-3">
                                                    <span className={`px-3 py-1 rounded-full text-sm ${record.status === 'Present'
                                                        ? 'bg-[#1D4ED8]/20 text-[#1D4ED8] border border-[#1D4ED8]/30'
                                                        : record.status === 'Absent'
                                                            ? 'bg-[#6B7280]/20 text-[#6B7280] border border-[#6B7280]/30'
                                                            : 'bg-[#6B7280]/20 text-[#6B7280] border border-[#6B7280]/30'
                                                        }`}>
                                                        {record.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {attendance.length === 0 && (
                                    <p className="text-center text-[#6B7280] py-8">No attendance records found</p>
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

export default MyAttendance;



