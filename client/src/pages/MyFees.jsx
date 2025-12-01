import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

const MyFees = () => {
    const [fees, setFees] = useState([]);
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    const config = {
        headers: {
            Authorization: `Bearer ${userInfo?.token}`,
        },
    };

    useEffect(() => {
        const fetchFees = async () => {
            try {
                const { data } = await axios.get('http://localhost:5000/api/student/fees', config);
                setFees(data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchFees();
    }, []);

    const totalAmount = fees.reduce((sum, fee) => sum + fee.amount, 0);
    const paidAmount = fees.filter(f => f.status === 'Paid').reduce((sum, fee) => sum + fee.amount, 0);
    const unpaidAmount = totalAmount - paidAmount;

    return (
        <div className="flex min-h-screen bg-[#0D0D0D]">
            <Sidebar role="student" />
            <div className="flex-1 flex flex-col">
                <div className="flex-1 p-8 custom-scrollbar overflow-y-auto">
                    <div className="max-w-7xl mx-auto">
                        <h1 className="text-3xl font-bold mb-6 text-[#F5F5F5] animate-fadeInUp">My Fees</h1>

                        {/* Statistics Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div className="card-dark card-hover p-6 animate-fadeInUp">
                                <h3 className="text-[#D1D5DB] text-sm font-medium mb-2">Total Fees</h3>
                                <p className="text-3xl font-bold text-[#1D4ED8]">Rs. {totalAmount.toLocaleString()}</p>
                            </div>
                            <div className="card-dark card-hover p-6 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
                                <h3 className="text-[#D1D5DB] text-sm font-medium mb-2">Paid</h3>
                                <p className="text-3xl font-bold text-[#1D4ED8]">Rs. {paidAmount.toLocaleString()}</p>
                            </div>
                            <div className="card-dark card-hover p-6 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
                                <h3 className="text-[#D1D5DB] text-sm font-medium mb-2">Unpaid</h3>
                                <p className="text-3xl font-bold text-[#6B7280]">Rs. {unpaidAmount.toLocaleString()}</p>
                            </div>
                        </div>

                        {/* Fees Table */}
                        <div className="card-dark p-6 animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
                            <h2 className="text-xl font-bold mb-4 text-[#F5F5F5]">Fee Details</h2>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-[#2E2E2E]">
                                            <th className="p-3 text-[#D1D5DB] font-semibold">Description</th>
                                            <th className="p-3 text-[#D1D5DB] font-semibold">Semester</th>
                                            <th className="p-3 text-[#D1D5DB] font-semibold">Amount</th>
                                            <th className="p-3 text-[#D1D5DB] font-semibold">Due Date</th>
                                            <th className="p-3 text-[#D1D5DB] font-semibold">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {fees.map((fee) => (
                                            <tr key={fee._id} className="border-b border-[#2E2E2E] hover:bg-[#2E2E2E]/30 transition-colors">
                                                <td className="p-3 text-[#F5F5F5]">{fee.description}</td>
                                                <td className="p-3 text-[#D1D5DB]">{fee.semester}</td>
                                                <td className="p-3 font-semibold text-[#1D4ED8]">Rs. {fee.amount.toLocaleString()}</td>
                                                <td className="p-3 text-[#D1D5DB]">{new Date(fee.due_date).toLocaleDateString()}</td>
                                                <td className="p-3">
                                                    <span className={`px-3 py-1 rounded-full text-sm ${fee.status === 'Paid'
                                                        ? 'bg-[#1D4ED8]/20 text-[#1D4ED8] border border-[#1D4ED8]/30'
                                                        : 'bg-[#6B7280]/20 text-[#6B7280] border border-[#6B7280]/30'
                                                        }`}>
                                                        {fee.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {fees.length === 0 && (
                                    <p className="text-center text-[#6B7280] py-8">No fee records found</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        </div>
    );
};

export default MyFees;



