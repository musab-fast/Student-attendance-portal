import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import axios from 'axios';
import config from '../config';

const AssignCourse = () => {
    const [students, setStudents] = useState([]);
    const [courses, setCourses] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState('');
    const [selectedCourse, setSelectedCourse] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userInfo = JSON.parse(localStorage.getItem('userInfo'));
                const authConfig = {
                    headers: { Authorization: `Bearer ${userInfo.token}` },
                };

                const usersRes = await axios.get(`${config.API_URL}/admin/users`, authConfig);
                const coursesRes = await axios.get(`${config.API_URL}/admin/courses`, authConfig);

                setStudents(usersRes.data.filter(user => user.role === 'student'));
                setCourses(coursesRes.data);
            } catch (err) {
                setError('Failed to fetch data');
            }
        };
        fetchData();
    }, []);

    const handleAssign = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        if (!selectedStudent || !selectedCourse) {
            setError('Please select both student and course');
            return;
        }

        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const authConfig = {
                headers: { Authorization: `Bearer ${userInfo.token}` },
            };

            await axios.post(`${config.API_URL}/admin/assign-course`, {
                studentId: selectedStudent,
                courseId: selectedCourse
            }, authConfig);

            setMessage('✅ Course assigned successfully');
            setSelectedStudent('');
            setSelectedCourse('');
        } catch (err) {
            setError('❌ ' + (err.response?.data?.message || 'Failed to assign course'));
        }
    };

    return (
        <div className="flex min-h-screen bg-[#0D0D0D]">
            <Sidebar role="admin" />
            <div className="flex-1 flex flex-col">
                <div className="flex-1 p-8 custom-scrollbar overflow-y-auto">
                    <div className="max-w-3xl mx-auto">
                        <h1 className="text-3xl font-bold mb-6 text-[#F5F5F5] animate-fadeInUp">Assign Course</h1>

                        {message && (
                            <div className="bg-[#1D4ED8] text-white p-4 rounded-lg mb-6 animate-slideInRight">
                                {message}
                            </div>
                        )}

                        {error && (
                            <div className="bg-[#6B7280] text-white p-4 rounded-lg mb-6 animate-slideInRight">
                                {error}
                            </div>
                        )}

                        <div className="card-dark p-6 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
                            <h2 className="text-xl font-bold mb-4 text-[#F5F5F5]">Assign Course to Student</h2>
                            <form onSubmit={handleAssign} className="space-y-4">
                                <div>
                                    <label className="block mb-2 font-medium text-[#F5F5F5]">Select Student</label>
                                    <select
                                        value={selectedStudent}
                                        onChange={(e) => setSelectedStudent(e.target.value)}
                                        className="input-dark"
                                        required
                                    >
                                        <option value="">-- Select Student --</option>
                                        {students.map(student => (
                                            <option key={student._id} value={student._id}>
                                                {student.name} ({student.email})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block mb-2 font-medium text-[#F5F5F5]">Select Course</label>
                                    <select
                                        value={selectedCourse}
                                        onChange={(e) => setSelectedCourse(e.target.value)}
                                        className="input-dark"
                                        required
                                    >
                                        <option value="">-- Select Course --</option>
                                        {courses.map(course => (
                                            <option key={course._id} value={course._id}>
                                                {course.course_name} ({course.course_id})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <button type="submit" className="btn-primary">
                                    Assign Course
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        </div>
    );
};

export default AssignCourse;



