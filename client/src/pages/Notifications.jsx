import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import axios from 'axios';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [filter, setFilter] = useState('all'); // all, unread, read
    const [loading, setLoading] = useState(true);

    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const config = {
        headers: { Authorization: `Bearer ${userInfo?.token}` }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get('http://localhost:5000/api/notifications?limit=100', config);
            setNotifications(data.notifications);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (id) => {
        try {
            await axios.put(`http://localhost:5000/api/notifications/${id}/read`, {}, config);
            fetchNotifications();
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await axios.put('http://localhost:5000/api/notifications/mark-all-read', {}, config);
            fetchNotifications();
        } catch (error) {
            console.error('Error marking all as read:', error);
        }
    };

    const deleteNotification = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/notifications/${id}`, config);
            fetchNotifications();
        } catch (error) {
            console.error('Error deleting notification:', error);
        }
    };

    const filteredNotifications = notifications.filter(n => {
        if (filter === 'unread') return !n.read;
        if (filter === 'read') return n.read;
        return true;
    });

    const getTypeColor = (type) => {
        switch (type) {
            case 'success': return 'text-[#1D4ED8]';
            case 'warning': return 'text-[#6B7280]';
            case 'error': return 'text-[#6B7280]';
            default: return 'text-[#1D4ED8]';
        }
    };

    return (
        <Layout role={userInfo?.role}>
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-[#F5F5F5] mb-2">Notifications</h1>
                <p className="text-[#D1D5DB]">Manage your notifications</p>
            </div>

            {/* Filter and Actions */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                <div className="flex gap-2">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 rounded-lg transition-colors ${filter === 'all'
                                ? 'bg-[#1D4ED8] text-white'
                                : 'bg-[#2E2E2E] text-[#D1D5DB] hover:bg-[#3E3E3E]'
                            }`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setFilter('unread')}
                        className={`px-4 py-2 rounded-lg transition-colors ${filter === 'unread'
                                ? 'bg-[#1D4ED8] text-white'
                                : 'bg-[#2E2E2E] text-[#D1D5DB] hover:bg-[#3E3E3E]'
                            }`}
                    >
                        Unread
                    </button>
                    <button
                        onClick={() => setFilter('read')}
                        className={`px-4 py-2 rounded-lg transition-colors ${filter === 'read'
                                ? 'bg-[#1D4ED8] text-white'
                                : 'bg-[#2E2E2E] text-[#D1D5DB] hover:bg-[#3E3E3E]'
                            }`}
                    >
                        Read
                    </button>
                </div>

                {notifications.some(n => !n.read) && (
                    <button
                        onClick={markAllAsRead}
                        className="px-4 py-2 bg-[#1D4ED8] text-white rounded-lg hover:bg-[#3B82F6] transition-colors"
                    >
                        Mark All as Read
                    </button>
                )}
            </div>

            {/* Notifications List */}
            {loading ? (
                <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#1D4ED8]"></div>
                </div>
            ) : filteredNotifications.length === 0 ? (
                <div className="bg-[#2E2E2E] rounded-xl p-12 text-center">
                    <svg className="w-16 h-16 mx-auto mb-4 text-[#6B7280]" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                    </svg>
                    <p className="text-[#D1D5DB]">No notifications found</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {filteredNotifications.map((notification) => (
                        <div
                            key={notification._id}
                            className={`bg-[#2E2E2E] rounded-xl p-6 border transition-all ${!notification.read
                                    ? 'border-[#1D4ED8] bg-[#1D4ED8]/5'
                                    : 'border-[#2E2E2E] hover:border-[#3E3E3E]'
                                }`}
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className={`text-lg font-semibold ${getTypeColor(notification.type)}`}>
                                            {notification.title}
                                        </h3>
                                        {!notification.read && (
                                            <span className="px-2 py-1 bg-[#1D4ED8] text-white text-xs rounded-full">
                                                New
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-[#D1D5DB] mb-3">{notification.message}</p>
                                    <p className="text-sm text-[#6B7280]">
                                        {new Date(notification.createdAt).toLocaleString()}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    {!notification.read && (
                                        <button
                                            onClick={() => markAsRead(notification._id)}
                                            className="p-2 text-[#1D4ED8] hover:bg-[#1D4ED8]/10 rounded-lg transition-colors"
                                            title="Mark as read"
                                        >
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    )}
                                    <button
                                        onClick={() => deleteNotification(notification._id)}
                                        className="p-2 text-[#6B7280] hover:bg-[#6B7280]/10 rounded-lg transition-colors"
                                        title="Delete"
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
            )}
        </Layout>
    );
};

export default Notifications;



