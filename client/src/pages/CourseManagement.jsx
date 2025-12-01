import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../config';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

const CourseManagement = () => {
    const [courses, setCourses] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [formData, setFormData] = useState({
        course_id: '',
        course_name: '',
        credit_hours: '',
        semester: '',
        instructor_id: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    const authConfig = {
        headers: {
            Authorization: `Bearer ${userInfo?.token}`,
        },
    };

    const fetchCourses = async () => {
        try {
            const { data } = await axios.get(`${config.API_URL}/admin/courses`, authConfig);
            setCourses(data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchTeachers = async () => {
        try {
            const { data } = await axios.get(`${config.API_URL}/admin/users`, authConfig);
            setTeachers(data.filter(user => user.role === 'teacher'));
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchCourses();
        fetchTeachers();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await axios.post(`${config.API_URL}/admin/courses`, formData, authConfig);
            fetchCourses();
            setFormData({
                course_id: '',
                course_name: '',
                credit_hours: '',
                semester: '',
                instructor_id: '',
            });
        } catch (err) {
            setError(err.response?.data?.message || 'Error creating course');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (courseId) => {
        if (window.confirm('Are you sure you want to delete this course?')) {
            try {
                await axios.delete(`${config.API_URL}/admin/courses/${courseId}`, authConfig);
                fetchCourses();
            } catch (err) {
                console.error(err);
            }
        }
    };

    return (
        <div className="flex min-h-screen bg-[#0D0D0D]">
            <Sidebar role="admin" />
            <div className="flex-1 flex flex-col">
                <div className="flex-1 p-8 custom-scrollbar overflow-y-auto">
                    <div className="max-w-7xl mx-auto">
                        <h1 className="text-3xl font-bold mb-6 text-[#F5F5F5] animate-fadeInUp">Course Management</h1>

                        {error && (
                            <div className="bg-[#6B7280] text-white p-4 rounded-lg mb-6 animate-slideInRight">
                                {error}
                            </div>
                        )}

                        {/* Add Course Form */}
                        <div className="card-dark p-6 mb-8 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
                            <h2 className="text-xl font-bold mb-4 text-[#F5F5F5]">Add New Course</h2>
                            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block mb-2 font-medium text-[#F5F5F5]">Course ID</label>
                                    <input
                                        type="text"
                                        name="course_id"
                                        value={formData.course_id}
                                        onChange={handleChange}
                                        className="input-dark"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2 font-medium text-[#F5F5F5]">Course Name</label>
                                    <input
                                        type="text"
                                        name="course_name"
                                        value={formData.course_name}
                                        onChange={handleChange}
                                        className="input-dark"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2 font-medium text-[#F5F5F5]">Credit Hours</label>
                                    <input
                                        type="number"
                                        name="credit_hours"
                                        value={formData.credit_hours}
                                        onChange={handleChange}
                                        className="input-dark"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2 font-medium text-[#F5F5F5]">Semester</label>
                                    <input
                                        type="text"
                                        name="semester"
                                        value={formData.semester}
                                        onChange={handleChange}
                                        className="input-dark"
                                        placeholder="e.g., Fall 2024"
                                        required
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block mb-2 font-medium text-[#F5F5F5]">Instructor (Optional)</label>
                                    <select
                                        name="instructor_id"
                                        value={formData.instructor_id}
                                        onChange={handleChange}
                                        className="input-dark"
                                    >
                                        <option value="">-- Select Instructor --</option>
                                        {teachers.map(teacher => (
                                            <option key={teacher._id} value={teacher._id}>{teacher.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="md:col-span-2">
                                    <button type="submit" className="btn-primary" disabled={loading}>
                                        {loading ? 'Creating...' : 'Create Course'}
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Courses List */}
                        <div className="card-dark p-6 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
                            <h2 className="text-xl font-bold mb-4 text-[#F5F5F5]">All Courses</h2>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-[#2E2E2E]">
                                            <th className="p-3 text-[#D1D5DB] font-semibold">Course ID</th>
                                            <th className="p-3 text-[#D1D5DB] font-semibold">Course Name</th>
                                            <th className="p-3 text-[#D1D5DB] font-semibold">Credits</th>
                                            <th className="p-3 text-[#D1D5DB] font-semibold">Semester</th>
                                            <th className="p-3 text-[#D1D5DB] font-semibold">Instructor</th>
                                            <th className="p-3 text-[#D1D5DB] font-semibold">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {courses.map(course => (
                                            <tr key={course._id} className="border-b border-[#2E2E2E] hover:bg-[#2E2E2E]/30 transition-colors">
                                                <td className="p-3 text-[#1D4ED8] font-medium">{course.course_id}</td>
                                                <td className="p-3 text-[#F5F5F5]">{course.course_name}</td>
                                                <td className="p-3 text-[#D1D5DB]">{course.credit_hours}</td>
                                                <td className="p-3 text-[#D1D5DB]">{course.semester}</td>
                                                <td className="p-3 text-[#F5F5F5]">{course.instructor_id?.name || 'Not Assigned'}</td>
                                                <td className="p-3">
                                                    <button
                                                        onClick={() => handleDelete(course._id)}
                                                        className="text-[#6B7280] hover:text-[#4B5563] font-medium transition-colors"
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        </div>
    );
};

export default CourseManagement;



