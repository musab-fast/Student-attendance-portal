import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import axios from 'axios';
import config from '../config';

const AdminTimetable = () => {
    const [timetables, setTimetables] = useState([]);
    const [courses, setCourses] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        course_id: '',
        teacher_id: '',
        day: 'Monday',
        startTime: '',
        endTime: '',
        room: '',
        semester: 1
    });
    const [editingId, setEditingId] = useState(null);
    const [filterTeacher, setFilterTeacher] = useState('');
    const [filterSemester, setFilterSemester] = useState('');

    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const authConfig = {
        headers: { Authorization: `Bearer ${userInfo?.token}` }
    };

    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [timetableRes, coursesRes, usersRes] = await Promise.all([
                axios.get(`${config.API_URL}/admin/timetable`, authConfig),
                axios.get(`${config.API_URL}/admin/courses`, authConfig),
                axios.get(`${config.API_URL}/admin/users`, authConfig)
            ]);

            setTimetables(timetableRes.data);
            setCourses(coursesRes.data);
            setTeachers(usersRes.data.filter(u => u.role === 'teacher'));
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await axios.put(`${config.API_URL}/admin/timetable/${editingId}`, formData, authConfig);
            } else {
                await axios.post(`${config.API_URL}/admin/timetable`, formData, authConfig);
            }
            fetchData();
            resetForm();
        } catch (error) {
            console.error('Error saving timetable:', error);
            alert(error.response?.data?.message || 'Failed to save timetable');
        }
    };

    const handleEdit = (timetable) => {
        setFormData({
            course_id: timetable.course._id,
            teacher_id: timetable.teacher.user_id._id,
            day: timetable.day,
            startTime: timetable.startTime,
            endTime: timetable.endTime,
            room: timetable.room,
            semester: timetable.semester
        });
        setEditingId(timetable._id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this timetable entry?')) {
            try {
                await axios.delete(`${config.API_URL}/admin/timetable/${id}`, authConfig);
                fetchData();
            } catch (error) {
                console.error('Error deleting timetable:', error);
                alert('Failed to delete timetable entry');
            }
        }
    };

    const resetForm = () => {
        setFormData({
            course_id: '',
            teacher_id: '',
            day: 'Monday',
            startTime: '',
            endTime: '',
            room: '',
            semester: 1
        });
        setEditingId(null);
    };

    const filteredTimetables = timetables.filter(t => {
        const teacherMatch = !filterTeacher || t.teacher?.user_id?._id === filterTeacher;
        const semesterMatch = !filterSemester || t.semester === parseInt(filterSemester);
        return teacherMatch && semesterMatch;
    });

    return (
        <Layout role="admin">
            {/* Header */}
            <div className="mb-8 animate-fadeInUp">
                <h1 className="text-4xl font-bold text-[#F5F5F5] mb-2">Timetable Management</h1>
                <p className="text-[#D1D5DB]">Create and manage class schedules</p>
            </div>

            {/* Add/Edit Form */}
            <div className="card-dark p-6 mb-8 animate-fadeInUp">
                <h2 className="text-xl font-bold text-[#F5F5F5] mb-4">
                    {editingId ? 'Edit Timetable Entry' : 'Add New Timetable Entry'}
                </h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-[#D1D5DB] mb-2">Course</label>
                        <select
                            value={formData.course_id}
                            onChange={(e) => setFormData({ ...formData, course_id: e.target.value })}
                            className="input-dark w-full"
                            required
                        >
                            <option value="">Select Course</option>
                            {courses.map(course => (
                                <option key={course._id} value={course._id}>
                                    {course.course_name} ({course.course_id})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[#D1D5DB] mb-2">Teacher</label>
                        <select
                            value={formData.teacher_id}
                            onChange={(e) => setFormData({ ...formData, teacher_id: e.target.value })}
                            className="input-dark w-full"
                            required
                        >
                            <option value="">Select Teacher</option>
                            {teachers.map(teacher => (
                                <option key={teacher._id} value={teacher._id}>
                                    {teacher.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[#D1D5DB] mb-2">Day</label>
                        <select
                            value={formData.day}
                            onChange={(e) => setFormData({ ...formData, day: e.target.value })}
                            className="input-dark w-full"
                            required
                        >
                            {daysOfWeek.map(day => (
                                <option key={day} value={day}>{day}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[#D1D5DB] mb-2">Semester</label>
                        <input
                            type="number"
                            min="1"
                            max="8"
                            value={formData.semester}
                            onChange={(e) => setFormData({ ...formData, semester: parseInt(e.target.value) })}
                            className="input-dark w-full"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[#D1D5DB] mb-2">Start Time</label>
                        <input
                            type="time"
                            value={formData.startTime}
                            onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                            className="input-dark w-full"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[#D1D5DB] mb-2">End Time</label>
                        <input
                            type="time"
                            value={formData.endTime}
                            onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                            className="input-dark w-full"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[#D1D5DB] mb-2">Room</label>
                        <input
                            type="text"
                            value={formData.room}
                            onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                            className="input-dark w-full"
                            placeholder="e.g., 101, Lab-A"
                            required
                        />
                    </div>

                    <div className="flex items-end gap-2">
                        <button type="submit" className="btn-primary flex-1">
                            {editingId ? 'Update' : 'Add'} Entry
                        </button>
                        {editingId && (
                            <button type="button" onClick={resetForm} className="btn-secondary">
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* Filters */}
            <div className="card-dark p-6 mb-8 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
                <h2 className="text-xl font-bold text-[#F5F5F5] mb-4">Filter Timetables</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-[#D1D5DB] mb-2">Filter by Teacher</label>
                        <select
                            value={filterTeacher}
                            onChange={(e) => setFilterTeacher(e.target.value)}
                            className="input-dark w-full"
                        >
                            <option value="">All Teachers</option>
                            {teachers.map(teacher => (
                                <option key={teacher._id} value={teacher._id}>
                                    {teacher.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[#D1D5DB] mb-2">Filter by Semester</label>
                        <select
                            value={filterSemester}
                            onChange={(e) => setFilterSemester(e.target.value)}
                            className="input-dark w-full"
                        >
                            <option value="">All Semesters</option>
                            {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                                <option key={sem} value={sem}>Semester {sem}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-end">
                        <button
                            onClick={() => { setFilterTeacher(''); setFilterSemester(''); }}
                            className="btn-secondary w-full"
                        >
                            Clear Filters
                        </button>
                    </div>
                </div>
            </div>

            {/* Timetable List */}
            <div className="card-dark p-6 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
                <h2 className="text-xl font-bold text-[#F5F5F5] mb-4">
                    Existing Timetables ({filteredTimetables.length})
                </h2>

                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1D4ED8]"></div>
                    </div>
                ) : filteredTimetables.length === 0 ? (
                    <div className="text-center py-12">
                        <svg className="w-16 h-16 text-[#6B7280] mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                        <p className="text-[#6B7280]">No timetable entries found</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-[#2E2E2E]">
                                    <th className="text-left py-3 px-4 text-[#D1D5DB] font-medium">Course</th>
                                    <th className="text-left py-3 px-4 text-[#D1D5DB] font-medium">Teacher</th>
                                    <th className="text-left py-3 px-4 text-[#D1D5DB] font-medium">Day</th>
                                    <th className="text-left py-3 px-4 text-[#D1D5DB] font-medium">Time</th>
                                    <th className="text-left py-3 px-4 text-[#D1D5DB] font-medium">Room</th>
                                    <th className="text-left py-3 px-4 text-[#D1D5DB] font-medium">Semester</th>
                                    <th className="text-left py-3 px-4 text-[#D1D5DB] font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTimetables.map((timetable, index) => (
                                    <tr
                                        key={timetable._id}
                                        className="border-b border-[#2E2E2E] hover:bg-[#2E2E2E] transition-colors"
                                        style={{ animationDelay: `${index * 0.05}s` }}
                                    >
                                        <td className="py-3 px-4">
                                            <div className="text-[#F5F5F5] font-medium">{timetable.course?.course_name}</div>
                                            <div className="text-[#6B7280] text-sm">{timetable.course?.course_id}</div>
                                        </td>
                                        <td className="py-3 px-4 text-[#D1D5DB]">
                                            {timetable.teacher?.user_id?.name}
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className="bg-[#1D4ED8]/20 text-[#1D4ED8] text-xs px-2 py-1 rounded border border-[#1D4ED8]/30">
                                                {timetable.day}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-[#D1D5DB]">
                                            {timetable.startTime} - {timetable.endTime}
                                        </td>
                                        <td className="py-3 px-4 text-[#D1D5DB]">
                                            {timetable.room}
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className="bg-[#1D4ED8]/20 text-[#1D4ED8] text-xs px-2 py-1 rounded border border-[#1D4ED8]/30">
                                                Sem {timetable.semester}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleEdit(timetable)}
                                                    className="text-[#1D4ED8] hover:text-[#60A5FA] transition-colors"
                                                    title="Edit"
                                                >
                                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(timetable._id)}
                                                    className="text-[#6B7280] hover:text-[#F87171] transition-colors"
                                                    title="Delete"
                                                >
                                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default AdminTimetable;



