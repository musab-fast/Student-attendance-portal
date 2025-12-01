import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../config';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

const AttendanceManagement = () => {
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState('');
    const [students, setStudents] = useState([]);
    const [date, setDate] = useState('');
    const [attendanceData, setAttendanceData] = useState({});
    const [message, setMessage] = useState('');

    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    const authConfig = {
        headers: {
            Authorization: `Bearer ${userInfo?.token}`,
        },
    };

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const { data } = await axios.get(`${config.API_URL}/teacher/courses`, authConfig);
                setCourses(data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchCourses();
    }, []);

    useEffect(() => {
        if (selectedCourse) {
            const fetchStudents = async () => {
                try {
                    const { data } = await axios.get(`${config.API_URL}/teacher/enrolled-students/${selectedCourse}`, authConfig);
                    setStudents(data);
                } catch (err) {
                    console.error(err);
                    setStudents([]);
                }
            };
            fetchStudents();
        } else {
            setStudents([]);
        }
    }, [selectedCourse]);

    const handleAttendanceChange = (studentId, status) => {
        setAttendanceData({ ...attendanceData, [studentId]: status });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        if (!date) {
            setMessage('❌ Please select a date');
            return;
        }

        if (Object.keys(attendanceData).length === 0) {
            setMessage('❌ Please mark attendance for at least one student');
            return;
        }

        try {
            let successCount = 0;
            let errorCount = 0;

            for (const studentId of Object.keys(attendanceData)) {
                try {
                    await axios.post(`${config.API_URL}/teacher/attendance`, {
                        student_id: studentId,
                        course_id: selectedCourse,
                        date: date,
                        status: attendanceData[studentId]
                    }, authConfig);
                    successCount++;
                } catch (err) {
                    console.error(err);
                    errorCount++;
                }
            }

            if (errorCount === 0) {
                setMessage(`✅ Attendance marked successfully for ${successCount} students`);
                setAttendanceData({});
            } else {
                setMessage(`⚠️ Attendance marked for ${successCount} students, ${errorCount} failed`);
            }
        } catch (err) {
            setMessage('❌ Error marking attendance');
        }
    };

    const markAll = (status) => {
        const newData = {};
        students.forEach(student => {
            newData[student._id] = status;
        });
        setAttendanceData(newData);
    };

    return (
        <div className="flex min-h-screen bg-[#0D0D0D]">
            <Sidebar role="teacher" />
            <div className="flex-1 flex flex-col">
                <div className="flex-1 p-8 custom-scrollbar overflow-y-auto">
                    <div className="max-w-7xl mx-auto">
                        <h1 className="text-3xl font-bold mb-6 text-[#F5F5F5] animate-fadeInUp">Mark Attendance</h1>

                        {message && (
                            <div className={`p-4 rounded-lg mb-6 animate-slideInRight ${message.includes('✅')
                                ? 'bg-[#1D4ED8] text-white'
                                : message.includes('⚠️')
                                    ? 'bg-[#6B7280] text-white'
                                    : 'bg-[#6B7280] text-white'
                                }`}>
                                {message}
                            </div>
                        )}

                        {/* Course Selection */}
                        <div className="card-dark p-6 mb-6 animate-fadeInUp animate-delay-100">
                            <h2 className="text-xl font-bold mb-4 text-[#F5F5F5]">Select Course & Date</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block mb-2 font-medium text-[#F5F5F5]">Course</label>
                                    <select
                                        value={selectedCourse}
                                        onChange={(e) => setSelectedCourse(e.target.value)}
                                        className="input-dark"
                                    >
                                        <option value="">-- Select Course --</option>
                                        {courses.map(course => (
                                            <option key={course._id} value={course._id}>
                                                {course.course_name} ({course.course_id})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block mb-2 font-medium text-[#F5F5F5]">Date</label>
                                    <input
                                        type="date"
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                        className="input-dark"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Student List */}
                        {selectedCourse && students.length > 0 && (
                            <div className="card-dark p-6 animate-fadeInUp animate-delay-200">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-bold text-[#F5F5F5]">Students ({students.length})</h2>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => markAll('Present')}
                                            className="btn-success text-sm"
                                        >
                                            Mark All Present
                                        </button>
                                        <button
                                            onClick={() => markAll('Absent')}
                                            className="btn-danger text-sm"
                                        >
                                            Mark All Absent
                                        </button>
                                    </div>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-[#2E2E2E]">
                                                <th className="p-3 text-[#D1D5DB] font-semibold">Roll No</th>
                                                <th className="p-3 text-[#D1D5DB] font-semibold">Name</th>
                                                <th className="p-3 text-[#D1D5DB] font-semibold">Email</th>
                                                <th className="p-3 text-[#D1D5DB] font-semibold">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {students.map((student) => (
                                                <tr key={student._id} className="border-b border-[#2E2E2E] hover:bg-[#2E2E2E]/30 transition-colors">
                                                    <td className="p-3 text-[#F5F5F5]">{student.roll_number || 'N/A'}</td>
                                                    <td className="p-3 text-[#F5F5F5] font-medium">{student.user_id?.name}</td>
                                                    <td className="p-3 text-[#D1D5DB]">{student.user_id?.email}</td>
                                                    <td className="p-3">
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => handleAttendanceChange(student._id, 'Present')}
                                                                className={`px-4 py-2 rounded-lg font-medium transition-all ${attendanceData[student._id] === 'Present'
                                                                    ? 'bg-[#1D4ED8] text-white shadow-lg'
                                                                    : 'bg-[#2E2E2E] text-[#D1D5DB] hover:bg-[#1D4ED8]/20 hover:text-[#1D4ED8]'
                                                                    }`}
                                                            >
                                                                Present
                                                            </button>
                                                            <button
                                                                onClick={() => handleAttendanceChange(student._id, 'Absent')}
                                                                className={`px-4 py-2 rounded-lg font-medium transition-all ${attendanceData[student._id] === 'Absent'
                                                                    ? 'bg-[#6B7280] text-white shadow-lg'
                                                                    : 'bg-[#2E2E2E] text-[#D1D5DB] hover:bg-[#6B7280]/20 hover:text-[#6B7280]'
                                                                    }`}
                                                            >
                                                                Absent
                                                            </button>
                                                            <button
                                                                onClick={() => handleAttendanceChange(student._id, 'Leave')}
                                                                className={`px-4 py-2 rounded-lg font-medium transition-all ${attendanceData[student._id] === 'Leave'
                                                                    ? 'bg-[#6B7280] text-white shadow-lg'
                                                                    : 'bg-[#2E2E2E] text-[#D1D5DB] hover:bg-[#6B7280]/20 hover:text-[#6B7280]'
                                                                    }`}
                                                            >
                                                                Leave
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="mt-6">
                                    <button
                                        onClick={handleSubmit}
                                        className="btn-primary"
                                    >
                                        Submit Attendance
                                    </button>
                                </div>
                            </div>
                        )}

                        {selectedCourse && students.length === 0 && (
                            <div className="card-dark p-6 text-center">
                                <p className="text-[#6B7280]">No students enrolled in this course</p>
                            </div>
                        )}
                    </div>
                </div>
                <Footer />
            </div>
        </div>
    );
};

export default AttendanceManagement;



