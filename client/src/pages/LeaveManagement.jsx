import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import axios from 'axios';
import config from '../config';

const LeaveManagement = () => {
    const [leaveRequests, setLeaveRequests] = useState([]);
    const [filter, setFilter] = useState('pending');
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [remarks, setRemarks] = useState('');

    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const authConfig = {
        headers: { Authorization: `Bearer ${userInfo?.token}` }
    };

    useEffect(() => {
        fetchLeaveRequests();
    }, [filter]);

    const fetchLeaveRequests = async () => {
        try {
            const { data } = await axios.get(`${config.API_URL}/admin/leave-requests?status=${filter}`, authConfig);
            setLeaveRequests(data);
        } catch (error) {
            console.error('Error fetching leave requests:', error);
        }
    };

    const handleAction = async (id, status) => {
        try {
            await axios.put(`${config.API_URL}/admin/leave-requests/${id}`, { status, admin_remarks: remarks }, authConfig);
            setSelectedRequest(null);
            setRemarks('');
            fetchLeaveRequests();
        } catch (error) {
            console.error('Error updating leave request:', error);
        }
    };

    return (
        <Layout role="admin">
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-[#F5F5F5] mb-2">Leave Management</h1>
                <p className="text-[#D1D5DB]">Review and manage student leave requests</p>
            </div>

            {/* Filter */}
            <div className="mb-6 flex gap-2">
                <button
                    onClick={() => setFilter('pending')}
                    className={`px-4 py-2 rounded-lg transition-colors ${filter === 'pending' ? 'bg-[#1D4ED8] text-white' : 'bg-[#2E2E2E] text-[#D1D5DB] hover:bg-[#3E3E3E]'
                        }`}
                >
                    Pending
                </button>
                <button
                    onClick={() => setFilter('approved')}
                    className={`px-4 py-2 rounded-lg transition-colors ${filter === 'approved' ? 'bg-[#1D4ED8] text-white' : 'bg-[#2E2E2E] text-[#D1D5DB] hover:bg-[#3E3E3E]'
                        }`}
                >
                    Approved
                </button>
                <button
                    onClick={() => setFilter('rejected')}
                    className={`px-4 py-2 rounded-lg transition-colors ${filter === 'rejected' ? 'bg-[#1D4ED8] text-white' : 'bg-[#2E2E2E] text-[#D1D5DB] hover:bg-[#3E3E3E]'
                        }`}
                >
                    Rejected
                </button>
            </div>

            {/* Leave Requests */}
            <div className="space-y-4">
                {leaveRequests.length === 0 ? (
                    <div className="bg-[#2E2E2E] rounded-xl p-12 text-center">
                        <p className="text-[#D1D5DB]">No {filter} leave requests</p>
                    </div>
                ) : (
                    leaveRequests.map((request) => (
                        <div key={request._id} className="bg-[#2E2E2E] rounded-xl p-6 border border-[#2E2E2E]">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-xl font-bold text-[#F5F5F5]">
                                            {request.student_id?.user_id?.name || 'Unknown Student'}
                                        </h3>
                                        <span className="px-2 py-1 bg-[#1D4ED8]/10 text-[#1D4ED8] rounded-full text-xs">
                                            {request.student_id?.student_id}
                                        </span>
                                    </div>
                                    <p className="text-sm text-[#6B7280] mb-3">{request.student_id?.user_id?.email}</p>
                                    <div className="mb-3">
                                        <p className="text-sm text-[#6B7280]">Duration:</p>
                                        <p className="text-lg font-semibold text-[#F5F5F5]">
                                            {new Date(request.start_date).toLocaleDateString()} - {new Date(request.end_date).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-[#6B7280]">Reason:</p>
                                        <p className="text-[#D1D5DB]">{request.reason}</p>
                                    </div>
                                    <p className="text-xs text-[#6B7280] mt-3">
                                        Submitted: {new Date(request.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                {request.status === 'pending' && (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setSelectedRequest(request)}
                                            className="px-4 py-2 bg-[#1D4ED8] text-white rounded-lg hover:bg-[#3B82F6] transition-colors"
                                        >
                                            Review
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Review Modal */}
            {selectedRequest && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-[#1E1E1E] rounded-xl p-6 max-w-md w-full">
                        <h2 className="text-2xl font-bold text-[#F5F5F5] mb-6">Review Leave Request</h2>
                        <div className="mb-4">
                            <p className="text-sm text-[#6B7280]">Student:</p>
                            <p className="text-lg font-semibold text-[#F5F5F5]">{selectedRequest.student_id?.user_id?.name}</p>
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-[#D1D5DB] mb-2">Admin Remarks (Optional)</label>
                            <textarea
                                rows="4"
                                value={remarks}
                                onChange={(e) => setRemarks(e.target.value)}
                                className="w-full px-4 py-2 bg-[#2E2E2E] border border-[#3E3E3E] rounded-lg text-[#F5F5F5] focus:outline-none focus:border-[#1D4ED8]"
                                placeholder="Add any remarks..."
                            />
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    setSelectedRequest(null);
                                    setRemarks('');
                                }}
                                className="flex-1 px-6 py-2 bg-[#2E2E2E] text-[#D1D5DB] rounded-lg hover:bg-[#3E3E3E] transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleAction(selectedRequest._id, 'rejected')}
                                className="flex-1 px-6 py-2 bg-[#6B7280] text-white rounded-lg hover:bg-[#9CA3AF] transition-colors"
                            >
                                Reject
                            </button>
                            <button
                                onClick={() => handleAction(selectedRequest._id, 'approved')}
                                className="flex-1 px-6 py-2 bg-[#1D4ED8] text-white rounded-lg hover:bg-[#3B82F6] transition-colors"
                            >
                                Approve
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
};

export default LeaveManagement;



