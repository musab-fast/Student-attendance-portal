import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import axios from 'axios';
import config from '../config';

const LeaveRequests = () => {
    const [leaveRequests, setLeaveRequests] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ start_date: '', end_date: '', reason: '' });

    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const authConfig = {
        headers: { Authorization: `Bearer ${userInfo?.token}` }
    };

    useEffect(() => {
        fetchLeaveRequests();
    }, []);

    const fetchLeaveRequests = async () => {
        try {
            const { data } = await axios.get(`${config.API_URL}/student/leave-requests`, authConfig);
            setLeaveRequests(data);
        } catch (error) {
            console.error('Error fetching leave requests:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${config.API_URL}/student/leave-request`, formData, authConfig);
            setShowForm(false);
            setFormData({ start_date: '', end_date: '', reason: '' });
            fetchLeaveRequests();
        } catch (error) {
            console.error('Error submitting leave request:', error);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'approved': return 'bg-[#1D4ED8]/10 text-[#1D4ED8] border-[#1D4ED8]';
            case 'rejected': return 'bg-[#6B7280]/10 text-[#6B7280] border-[#6B7280]';
            default: return 'bg-[#6B7280]/10 text-[#6B7280] border-[#6B7280]';
        }
    };

    return (
        <Layout role="student">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-bold text-[#F5F5F5] mb-2">Leave Requests</h1>
                    <p className="text-[#D1D5DB]">Submit and track your leave requests</p>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="px-6 py-3 bg-[#1D4ED8] text-white rounded-lg hover:bg-[#3B82F6] transition-colors flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    New Request
                </button>
            </div>

            {/* Form Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-[#1E1E1E] rounded-xl p-6 max-w-md w-full">
                        <h2 className="text-2xl font-bold text-[#F5F5F5] mb-6">Submit Leave Request</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-[#D1D5DB] mb-2">Start Date</label>
                                <input
                                    type="date"
                                    required
                                    value={formData.start_date}
                                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                                    className="w-full px-4 py-2 bg-[#2E2E2E] border border-[#3E3E3E] rounded-lg text-[#F5F5F5] focus:outline-none focus:border-[#1D4ED8]"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#D1D5DB] mb-2">End Date</label>
                                <input
                                    type="date"
                                    required
                                    value={formData.end_date}
                                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                                    className="w-full px-4 py-2 bg-[#2E2E2E] border border-[#3E3E3E] rounded-lg text-[#F5F5F5] focus:outline-none focus:border-[#1D4ED8]"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#D1D5DB] mb-2">Reason</label>
                                <textarea
                                    required
                                    rows="4"
                                    value={formData.reason}
                                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                                    className="w-full px-4 py-2 bg-[#2E2E2E] border border-[#3E3E3E] rounded-lg text-[#F5F5F5] focus:outline-none focus:border-[#1D4ED8]"
                                    placeholder="Explain the reason for your leave..."
                                />
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
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Leave Requests List */}
            <div className="space-y-4">
                {leaveRequests.length === 0 ? (
                    <div className="bg-[#2E2E2E] rounded-xl p-12 text-center">
                        <svg className="w-16 h-16 mx-auto mb-4 text-[#6B7280]" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                        <p className="text-[#D1D5DB]">No leave requests yet</p>
                    </div>
                ) : (
                    leaveRequests.map((request) => (
                        <div key={request._id} className="bg-[#2E2E2E] rounded-xl p-6 border border-[#2E2E2E] hover:border-[#3E3E3E] transition-all">
                            <div className="flex items-start justify-between gap-4 mb-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-lg font-bold text-[#F5F5F5]">
                                            {new Date(request.start_date).toLocaleDateString()} - {new Date(request.end_date).toLocaleDateString()}
                                        </h3>
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(request.status)}`}>
                                            {request.status.toUpperCase()}
                                        </span>
                                    </div>
                                    <p className="text-[#D1D5DB] mb-2">{request.reason}</p>
                                    <p className="text-sm text-[#6B7280]">
                                        Submitted: {new Date(request.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                            {request.status !== 'pending' && (
                                <div className="mt-4 p-4 bg-[#1E1E1E] rounded-lg">
                                    <div className="flex items-center justify-between mb-2">
                                        <p className="text-sm font-semibold text-[#F5F5F5]">Admin Response</p>
                                        {request.reviewed_by && (
                                            <p className="text-xs text-[#6B7280]">By: {request.reviewed_by.name}</p>
                                        )}
                                    </div>
                                    {request.admin_remarks && (
                                        <p className="text-sm text-[#D1D5DB]">{request.admin_remarks}</p>
                                    )}
                                    {request.review_date && (
                                        <p className="text-xs text-[#6B7280] mt-2">
                                            Reviewed on: {new Date(request.review_date).toLocaleDateString()}
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </Layout>
    );
};

export default LeaveRequests;



