import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import axios from 'axios';
import config from '../config';

const AnnouncementManagement = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        target_audience: 'all',
        priority: 'medium',
        expiry_date: ''
    });

    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const authConfig = {
        headers: { Authorization: `Bearer ${userInfo?.token}` }
    };

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const fetchAnnouncements = async () => {
        try {
            const { data } = await axios.get(`${config.API_URL}/admin/announcements`, authConfig);
            setAnnouncements(data);
        } catch (error) {
            console.error('Error fetching announcements:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await axios.put(`${config.API_URL}/admin/announcements/${editingId}`, formData, authConfig);
            } else {
                await axios.post(`${config.API_URL}/admin/announcements`, formData, authConfig);
            }
            setShowForm(false);
            setEditingId(null);
            setFormData({ title: '', content: '', target_audience: 'all', priority: 'medium', expiry_date: '' });
            fetchAnnouncements();
        } catch (error) {
            console.error('Error saving announcement:', error);
        }
    };

    const handleEdit = (announcement) => {
        setEditingId(announcement._id);
        setFormData({
            title: announcement.title,
            content: announcement.content,
            target_audience: announcement.target_audience,
            priority: announcement.priority,
            expiry_date: announcement.expiry_date ? new Date(announcement.expiry_date).toISOString().split('T')[0] : ''
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this announcement?')) {
            try {
                await axios.delete(`${config.API_URL}/admin/announcements/${id}`, authConfig);
                fetchAnnouncements();
            } catch (error) {
                console.error('Error deleting announcement:', error);
            }
        }
    };

    return (
        <Layout role="admin">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-bold text-[#F5F5F5] mb-2">Announcement Management</h1>
                    <p className="text-[#D1D5DB]">Create and manage system announcements</p>
                </div>
                <button
                    onClick={() => {
                        setShowForm(true);
                        setEditingId(null);
                        setFormData({ title: '', content: '', target_audience: 'all', priority: 'medium', expiry_date: '' });
                    }}
                    className="px-6 py-3 bg-[#1D4ED8] text-white rounded-lg hover:bg-[#3B82F6] transition-colors flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    New Announcement
                </button>
            </div>

            {/* Form Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-[#1E1E1E] rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <h2 className="text-2xl font-bold text-[#F5F5F5] mb-6">
                            {editingId ? 'Edit Announcement' : 'New Announcement'}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-[#D1D5DB] mb-2">Title</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-4 py-2 bg-[#2E2E2E] border border-[#3E3E3E] rounded-lg text-[#F5F5F5] focus:outline-none focus:border-[#1D4ED8]"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#D1D5DB] mb-2">Content</label>
                                <textarea
                                    required
                                    rows="6"
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                    className="w-full px-4 py-2 bg-[#2E2E2E] border border-[#3E3E3E] rounded-lg text-[#F5F5F5] focus:outline-none focus:border-[#1D4ED8]"
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-[#D1D5DB] mb-2">Target Audience</label>
                                    <select
                                        value={formData.target_audience}
                                        onChange={(e) => setFormData({ ...formData, target_audience: e.target.value })}
                                        className="w-full px-4 py-2 bg-[#2E2E2E] border border-[#3E3E3E] rounded-lg text-[#F5F5F5] focus:outline-none focus:border-[#1D4ED8]"
                                    >
                                        <option value="all">All</option>
                                        <option value="students">Students</option>
                                        <option value="teachers">Teachers</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#D1D5DB] mb-2">Priority</label>
                                    <select
                                        value={formData.priority}
                                        onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                        className="w-full px-4 py-2 bg-[#2E2E2E] border border-[#3E3E3E] rounded-lg text-[#F5F5F5] focus:outline-none focus:border-[#1D4ED8]"
                                    >
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#D1D5DB] mb-2">Expiry Date (Optional)</label>
                                    <input
                                        type="date"
                                        value={formData.expiry_date}
                                        onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
                                        className="w-full px-4 py-2 bg-[#2E2E2E] border border-[#3E3E3E] rounded-lg text-[#F5F5F5] focus:outline-none focus:border-[#1D4ED8]"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-3 justify-end">
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="px-6 py-2 bg-[#2E2E2E] text-[#D1D5DB] rounded-lg hover:bg-[#3E3E3E] transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-[#1D4ED8] text-white rounded-lg hover:bg-[#3B82F6] transition-colors"
                                >
                                    {editingId ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Announcements List */}
            <div className="space-y-4">
                {announcements.map((announcement) => (
                    <div key={announcement._id} className="bg-[#2E2E2E] rounded-xl p-6 border border-[#2E2E2E] hover:border-[#3E3E3E] transition-all">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <h3 className="text-xl font-bold text-[#F5F5F5]">{announcement.title}</h3>
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${announcement.priority === 'high' ? 'bg-[#6B7280]/10 text-[#6B7280]' :
                                        announcement.priority === 'medium' ? 'bg-[#1D4ED8]/10 text-[#1D4ED8]' :
                                            'bg-[#6B7280]/10 text-[#6B7280]'
                                        }`}>
                                        {announcement.priority}
                                    </span>
                                    <span className="px-2 py-1 bg-[#2E2E2E] text-[#D1D5DB] rounded-full text-xs">
                                        {announcement.target_audience}
                                    </span>
                                </div>
                                <p className="text-[#D1D5DB] mb-2">{announcement.content}</p>
                                <div className="flex items-center gap-4 text-sm text-[#6B7280]">
                                    <span>{new Date(announcement.createdAt).toLocaleDateString()}</span>
                                    {announcement.expiry_date && (
                                        <span>Expires: {new Date(announcement.expiry_date).toLocaleDateString()}</span>
                                    )}
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleEdit(announcement)}
                                    className="p-2 text-[#1D4ED8] hover:bg-[#1D4ED8]/10 rounded-lg transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                    </svg>
                                </button>
                                <button
                                    onClick={() => handleDelete(announcement._id)}
                                    className="p-2 text-[#6B7280] hover:bg-[#6B7280]/10 rounded-lg transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </Layout>
    );
};

export default AnnouncementManagement;



