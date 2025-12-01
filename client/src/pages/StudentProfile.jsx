import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import axios from 'axios';

const StudentProfile = () => {
    const [profile, setProfile] = useState(null);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({});

    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const config = {
        headers: { Authorization: `Bearer ${userInfo?.token}` }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const { data } = await axios.get('http://localhost:5000/api/student/profile', config);
            setProfile(data);
            setFormData({
                phone: data.phone || '',
                address: data.address || '',
                date_of_birth: data.date_of_birth ? new Date(data.date_of_birth).toISOString().split('T')[0] : '',
                guardian_name: data.guardian_name || '',
                guardian_phone: data.guardian_phone || '',
                blood_group: data.blood_group || ''
            });
        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put('http://localhost:5000/api/student/profile', formData, config);
            setEditing(false);
            fetchProfile();
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    if (!profile) {
        return (
            <Layout role="student">
                <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#1D4ED8]"></div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout role="student">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-bold text-[#F5F5F5] mb-2">My Profile</h1>
                    <p className="text-[#D1D5DB]">View and manage your profile information</p>
                </div>
                {!editing && (
                    <button
                        onClick={() => setEditing(true)}
                        className="px-6 py-3 bg-[#1D4ED8] text-white rounded-lg hover:bg-[#3B82F6] transition-colors"
                    >
                        Edit Profile
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile Card */}
                <div className="lg:col-span-1">
                    <div className="bg-gradient-to-br from-[#2E2E2E] to-[#0F172A] rounded-xl p-6 border border-[#2E2E2E]">
                        <div className="text-center">
                            <div className="w-32 h-32 mx-auto mb-4 bg-[#1D4ED8] rounded-full flex items-center justify-center text-white text-4xl font-bold">
                                {profile.user_id?.name?.charAt(0) || 'S'}
                            </div>
                            <h2 className="text-2xl font-bold text-[#F5F5F5] mb-1">{profile.user_id?.name}</h2>
                            <p className="text-[#6B7280] mb-4">{profile.user_id?.email}</p>
                            <div className="space-y-2">
                                <div className="px-4 py-2 bg-[#1D4ED8]/10 rounded-lg">
                                    <p className="text-xs text-[#6B7280]">Student ID</p>
                                    <p className="text-sm font-semibold text-[#1D4ED8]">{profile.student_id}</p>
                                </div>
                                <div className="px-4 py-2 bg-[#1D4ED8]/10 rounded-lg">
                                    <p className="text-xs text-[#6B7280]">Roll Number</p>
                                    <p className="text-sm font-semibold text-[#1D4ED8]">{profile.roll_number}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Information */}
                <div className="lg:col-span-2">
                    {editing ? (
                        <form onSubmit={handleSubmit} className="bg-[#2E2E2E] rounded-xl p-6 border border-[#2E2E2E]">
                            <h3 className="text-xl font-bold text-[#F5F5F5] mb-6">Edit Profile Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-[#D1D5DB] mb-2">Phone</label>
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full px-4 py-2 bg-[#1E1E1E] border border-[#3E3E3E] rounded-lg text-[#F5F5F5] focus:outline-none focus:border-[#1D4ED8]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#D1D5DB] mb-2">Date of Birth</label>
                                    <input
                                        type="date"
                                        value={formData.date_of_birth}
                                        onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                                        className="w-full px-4 py-2 bg-[#1E1E1E] border border-[#3E3E3E] rounded-lg text-[#F5F5F5] focus:outline-none focus:border-[#1D4ED8]"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-[#D1D5DB] mb-2">Address</label>
                                    <textarea
                                        rows="3"
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        className="w-full px-4 py-2 bg-[#1E1E1E] border border-[#3E3E3E] rounded-lg text-[#F5F5F5] focus:outline-none focus:border-[#1D4ED8]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#D1D5DB] mb-2">Guardian Name</label>
                                    <input
                                        type="text"
                                        value={formData.guardian_name}
                                        onChange={(e) => setFormData({ ...formData, guardian_name: e.target.value })}
                                        className="w-full px-4 py-2 bg-[#1E1E1E] border border-[#3E3E3E] rounded-lg text-[#F5F5F5] focus:outline-none focus:border-[#1D4ED8]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#D1D5DB] mb-2">Guardian Phone</label>
                                    <input
                                        type="tel"
                                        value={formData.guardian_phone}
                                        onChange={(e) => setFormData({ ...formData, guardian_phone: e.target.value })}
                                        className="w-full px-4 py-2 bg-[#1E1E1E] border border-[#3E3E3E] rounded-lg text-[#F5F5F5] focus:outline-none focus:border-[#1D4ED8]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#D1D5DB] mb-2">Blood Group</label>
                                    <select
                                        value={formData.blood_group}
                                        onChange={(e) => setFormData({ ...formData, blood_group: e.target.value })}
                                        className="w-full px-4 py-2 bg-[#1E1E1E] border border-[#3E3E3E] rounded-lg text-[#F5F5F5] focus:outline-none focus:border-[#1D4ED8]"
                                    >
                                        <option value="">Select</option>
                                        <option value="A+">A+</option>
                                        <option value="A-">A-</option>
                                        <option value="B+">B+</option>
                                        <option value="B-">B-</option>
                                        <option value="AB+">AB+</option>
                                        <option value="AB-">AB-</option>
                                        <option value="O+">O+</option>
                                        <option value="O-">O-</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex gap-3 justify-end mt-6">
                                <button
                                    type="button"
                                    onClick={() => setEditing(false)}
                                    className="px-6 py-2 bg-[#2E2E2E] text-[#D1D5DB] rounded-lg hover:bg-[#3E3E3E] transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-[#1D4ED8] text-white rounded-lg hover:bg-[#3B82F6] transition-colors"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="space-y-6">
                            <div className="bg-[#2E2E2E] rounded-xl p-6 border border-[#2E2E2E]">
                                <h3 className="text-xl font-bold text-[#F5F5F5] mb-4">Academic Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-[#6B7280]">Department</p>
                                        <p className="text-lg font-semibold text-[#F5F5F5]">{profile.department}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-[#6B7280]">Semester</p>
                                        <p className="text-lg font-semibold text-[#F5F5F5]">{profile.semester}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-[#6B7280]">Section</p>
                                        <p className="text-lg font-semibold text-[#F5F5F5]">{profile.section}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-[#6B7280]">Enrolled Courses</p>
                                        <p className="text-lg font-semibold text-[#F5F5F5]">{profile.enrolled_courses?.length || 0}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-[#2E2E2E] rounded-xl p-6 border border-[#2E2E2E]">
                                <h3 className="text-xl font-bold text-[#F5F5F5] mb-4">Personal Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-[#6B7280]">Phone</p>
                                        <p className="text-lg font-semibold text-[#F5F5F5]">{profile.phone || 'Not provided'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-[#6B7280]">Date of Birth</p>
                                        <p className="text-lg font-semibold text-[#F5F5F5]">
                                            {profile.date_of_birth ? new Date(profile.date_of_birth).toLocaleDateString() : 'Not provided'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-[#6B7280]">Blood Group</p>
                                        <p className="text-lg font-semibold text-[#F5F5F5]">{profile.blood_group || 'Not provided'}</p>
                                    </div>
                                    <div className="md:col-span-2">
                                        <p className="text-sm text-[#6B7280]">Address</p>
                                        <p className="text-lg font-semibold text-[#F5F5F5]">{profile.address || 'Not provided'}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-[#2E2E2E] rounded-xl p-6 border border-[#2E2E2E]">
                                <h3 className="text-xl font-bold text-[#F5F5F5] mb-4">Guardian Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-[#6B7280]">Guardian Name</p>
                                        <p className="text-lg font-semibold text-[#F5F5F5]">{profile.guardian_name || 'Not provided'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-[#6B7280]">Guardian Phone</p>
                                        <p className="text-lg font-semibold text-[#F5F5F5]">{profile.guardian_phone || 'Not provided'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default StudentProfile;



