import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'student',
        student_id: '',
        department: '',
        semester: '',
        section: '',
        roll_number: '',
        teacher_id: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    const config = {
        headers: {
            Authorization: `Bearer ${userInfo?.token}`,
        },
    };

    const fetchUsers = async () => {
        try {
            const { data } = await axios.get('http://localhost:5000/api/admin/users', config);
            setUsers(data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await axios.post('http://localhost:5000/api/admin/users', formData, config);
            fetchUsers();
            setFormData({
                name: '',
                email: '',
                password: '',
                role: 'student',
                student_id: '',
                department: '',
                semester: '',
                section: '',
                roll_number: '',
                teacher_id: '',
            });
        } catch (err) {
            setError(err.response?.data?.message || 'Error creating user');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await axios.delete(`http://localhost:5000/api/admin/users/${userId}`, config);
                fetchUsers();
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
                        <h1 className="text-3xl font-bold mb-6 text-[#F5F5F5] animate-fadeInUp">User Management</h1>

                        {error && (
                            <div className="bg-[#6B7280] text-white p-4 rounded-lg mb-6 animate-slideInRight">
                                {error}
                            </div>
                        )}

                        {/* Add User Form */}
                        <div className="card-dark p-6 mb-8 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
                            <h2 className="text-xl font-bold mb-4 text-[#F5F5F5]">Add New User</h2>
                            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block mb-2 font-medium text-[#F5F5F5]">Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="input-dark"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2 font-medium text-[#F5F5F5]">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="input-dark"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2 font-medium text-[#F5F5F5]">Password</label>
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="input-dark"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2 font-medium text-[#F5F5F5]">Role</label>
                                    <select
                                        name="role"
                                        value={formData.role}
                                        onChange={handleChange}
                                        className="input-dark"
                                        required
                                    >
                                        <option value="student">Student</option>
                                        <option value="teacher">Teacher</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>

                                {formData.role === 'student' && (
                                    <>
                                        <div>
                                            <label className="block mb-2 font-medium text-[#F5F5F5]">Roll Number</label>
                                            <input
                                                type="text"
                                                name="roll_number"
                                                value={formData.roll_number}
                                                onChange={handleChange}
                                                className="input-dark"
                                            />
                                        </div>
                                        <div>
                                            <label className="block mb-2 font-medium text-[#F5F5F5]">Department</label>
                                            <input
                                                type="text"
                                                name="department"
                                                value={formData.department}
                                                onChange={handleChange}
                                                className="input-dark"
                                            />
                                        </div>
                                        <div>
                                            <label className="block mb-2 font-medium text-[#F5F5F5]">Semester</label>
                                            <input
                                                type="number"
                                                name="semester"
                                                value={formData.semester}
                                                onChange={handleChange}
                                                className="input-dark"
                                            />
                                        </div>
                                        <div>
                                            <label className="block mb-2 font-medium text-[#F5F5F5]">Section</label>
                                            <input
                                                type="text"
                                                name="section"
                                                value={formData.section}
                                                onChange={handleChange}
                                                className="input-dark"
                                            />
                                        </div>
                                    </>
                                )}

                                {formData.role === 'teacher' && (
                                    <>
                                        <div>
                                            <label className="block mb-2 font-medium text-[#F5F5F5]">Teacher ID</label>
                                            <input
                                                type="text"
                                                name="teacher_id"
                                                value={formData.teacher_id}
                                                onChange={handleChange}
                                                className="input-dark"
                                            />
                                        </div>
                                        <div>
                                            <label className="block mb-2 font-medium text-[#F5F5F5]">Department</label>
                                            <input
                                                type="text"
                                                name="department"
                                                value={formData.department}
                                                onChange={handleChange}
                                                className="input-dark"
                                            />
                                        </div>
                                    </>
                                )}

                                <div className="md:col-span-2">
                                    <button type="submit" className="btn-primary" disabled={loading}>
                                        {loading ? 'Creating...' : 'Create User'}
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Users List */}
                        <div className="card-dark p-6 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
                            <h2 className="text-xl font-bold mb-4 text-[#F5F5F5]">All Users</h2>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-[#2E2E2E]">
                                            <th className="p-3 text-[#D1D5DB] font-semibold">Name</th>
                                            <th className="p-3 text-[#D1D5DB] font-semibold">Email</th>
                                            <th className="p-3 text-[#D1D5DB] font-semibold">Role</th>
                                            <th className="p-3 text-[#D1D5DB] font-semibold">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map(user => (
                                            <tr key={user._id} className="border-b border-[#2E2E2E] hover:bg-[#2E2E2E]/30 transition-colors">
                                                <td className="p-3 text-[#F5F5F5] font-medium">{user.name}</td>
                                                <td className="p-3 text-[#D1D5DB]">{user.email}</td>
                                                <td className="p-3">
                                                    <span className={`px-3 py-1 rounded-full text-sm ${user.role === 'admin'
                                                            ? 'bg-[#6B7280]/20 text-[#6B7280] border border-[#6B7280]/30'
                                                            : user.role === 'teacher'
                                                                ? 'bg-[#1D4ED8]/20 text-[#1D4ED8] border border-[#1D4ED8]/30'
                                                                : 'bg-[#1D4ED8]/20 text-[#1D4ED8] border border-[#1D4ED8]/30'
                                                        }`}>
                                                        {user.role}
                                                    </span>
                                                </td>
                                                <td className="p-3">
                                                    <button
                                                        onClick={() => handleDelete(user._id)}
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

export default UserManagement;



