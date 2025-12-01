import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import axios from 'axios';
import config from '../config';

const Announcements = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);

    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const authConfig = {
        headers: { Authorization: `Bearer ${userInfo?.token}` }
    };

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const fetchAnnouncements = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`${config.API_URL}/announcements`, authConfig);
            setAnnouncements(data);
        } catch (error) {
            console.error('Error fetching announcements:', error);
        } finally {
            setLoading(false);
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high': return 'bg-[#6B7280]/10 text-[#6B7280] border-[#6B7280]';
            case 'medium': return 'bg-[#1D4ED8]/10 text-[#1D4ED8] border-[#1D4ED8]';
            case 'low': return 'bg-[#6B7280]/10 text-[#6B7280] border-[#6B7280]';
            default: return 'bg-[#1D4ED8]/10 text-[#1D4ED8] border-[#1D4ED8]';
        }
    };

    return (
        <Layout role={userInfo?.role}>
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-[#F5F5F5] mb-2">Announcements</h1>
                <p className="text-[#D1D5DB]">Important updates and notices</p>
            </div>

            {loading ? (
                <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#1D4ED8]"></div>
                </div>
            ) : announcements.length === 0 ? (
                <div className="bg-[#2E2E2E] rounded-xl p-12 text-center">
                    <svg className="w-16 h-16 mx-auto mb-4 text-[#6B7280]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <p className="text-[#D1D5DB]">No announcements at this time</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {announcements.map((announcement) => (
                        <div
                            key={announcement._id}
                            className="bg-gradient-to-br from-[#2E2E2E] to-[#0F172A] rounded-xl p-6 border border-[#2E2E2E] hover:border-[#1D4ED8] transition-all"
                        >
                            <div className="flex items-start justify-between gap-4 mb-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h2 className="text-2xl font-bold text-[#F5F5F5]">
                                            {announcement.title}
                                        </h2>
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getPriorityColor(announcement.priority)}`}>
                                            {announcement.priority.toUpperCase()}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-[#6B7280]">
                                        <span className="flex items-center gap-1">
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                            </svg>
                                            {announcement.author_id?.name || 'Admin'}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                            </svg>
                                            {new Date(announcement.createdAt).toLocaleDateString()}
                                        </span>
                                        {announcement.expiry_date && (
                                            <span className="flex items-center gap-1 text-[#6B7280]">
                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                                </svg>
                                                Expires: {new Date(announcement.expiry_date).toLocaleDateString()}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="prose prose-invert max-w-none">
                                <p className="text-[#D1D5DB] whitespace-pre-wrap">{announcement.content}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </Layout>
    );
};

export default Announcements;



