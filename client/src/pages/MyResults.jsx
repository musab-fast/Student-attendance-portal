import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../config';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

const MyResults = () => {
    const [results, setResults] = useState([]);
    const [activeTab, setActiveTab] = useState('all');
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    const authConfig = {
        headers: {
            Authorization: `Bearer ${userInfo?.token}`,
        },
    };

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const { data } = await axios.get(`${config.API_URL}/student/results`, authConfig);
                setResults(data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchResults();
    }, []);

    const filterResults = () => {
        if (activeTab === 'all') return results;
        if (activeTab === 'quiz') return results.filter(r => r.quiz1 !== undefined || r.quiz2 !== undefined || r.assignment1 !== undefined || r.assignment2 !== undefined);
        if (activeTab === 'mid') return results.filter(r => r.midterm !== undefined);
        if (activeTab === 'final') return results.filter(r => r.final_exam !== undefined);
        return results;
    };

    const getMarkColor = (marks, total = 100) => {
        const percentage = (marks / total) * 100;
        if (percentage >= 80) return 'text-[#1D4ED8]';
        if (percentage >= 60) return 'text-[#6B7280]';
        return 'text-[#6B7280]';
    };

    const filteredResults = filterResults();

    return (
        <div className="flex min-h-screen bg-[#0D0D0D]">
            <Sidebar role="student" />
            <div className="flex-1 flex flex-col">
                <div className="flex-1 p-8 custom-scrollbar overflow-y-auto">
                    <div className="max-w-7xl mx-auto">
                        <h1 className="text-3xl font-bold mb-6 text-[#F5F5F5] animate-fadeInUp">My Results</h1>

                        {/* Tabs */}
                        <div className="card-dark rounded-xl mb-6 overflow-hidden animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
                            <div className="flex border-b border-[#2E2E2E]">
                                <button
                                    onClick={() => setActiveTab('all')}
                                    className={`px-6 py-3 font-medium transition-all ${activeTab === 'all'
                                        ? 'border-b-2 border-[#1D4ED8] text-[#1D4ED8] bg-[#1D4ED8]/10'
                                        : 'text-[#D1D5DB] hover:text-[#F5F5F5] hover:bg-[#2E2E2E]/30'
                                        }`}
                                >
                                    All Results
                                </button>
                                <button
                                    onClick={() => setActiveTab('quiz')}
                                    className={`px-6 py-3 font-medium transition-all ${activeTab === 'quiz'
                                        ? 'border-b-2 border-[#1D4ED8] text-[#1D4ED8] bg-[#1D4ED8]/10'
                                        : 'text-[#D1D5DB] hover:text-[#F5F5F5] hover:bg-[#2E2E2E]/30'
                                        }`}
                                >
                                    Quizzes & Assignments
                                </button>
                                <button
                                    onClick={() => setActiveTab('mid')}
                                    className={`px-6 py-3 font-medium transition-all ${activeTab === 'mid'
                                        ? 'border-b-2 border-[#1D4ED8] text-[#1D4ED8] bg-[#1D4ED8]/10'
                                        : 'text-[#D1D5DB] hover:text-[#F5F5F5] hover:bg-[#2E2E2E]/30'
                                        }`}
                                >
                                    Midterms
                                </button>
                                <button
                                    onClick={() => setActiveTab('final')}
                                    className={`px-6 py-3 font-medium transition-all ${activeTab === 'final'
                                        ? 'border-b-2 border-[#1D4ED8] text-[#1D4ED8] bg-[#1D4ED8]/10'
                                        : 'text-[#D1D5DB] hover:text-[#F5F5F5] hover:bg-[#2E2E2E]/30'
                                        }`}
                                >
                                    Finals
                                </button>
                            </div>

                            <div className="p-6">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-[#2E2E2E]">
                                                <th className="p-3 text-[#D1D5DB] font-semibold">Course</th>
                                                {activeTab === 'all' && (
                                                    <>
                                                        <th className="p-3 text-[#D1D5DB] font-semibold">Quiz 1</th>
                                                        <th className="p-3 text-[#D1D5DB] font-semibold">Quiz 2</th>
                                                        <th className="p-3 text-[#D1D5DB] font-semibold">Assign 1</th>
                                                        <th className="p-3 text-[#D1D5DB] font-semibold">Assign 2</th>
                                                        <th className="p-3 text-[#D1D5DB] font-semibold">Midterm</th>
                                                        <th className="p-3 text-[#D1D5DB] font-semibold">Final</th>
                                                    </>
                                                )}
                                                {activeTab === 'quiz' && (
                                                    <>
                                                        <th className="p-3 text-[#D1D5DB] font-semibold">Quiz 1</th>
                                                        <th className="p-3 text-[#D1D5DB] font-semibold">Quiz 2</th>
                                                        <th className="p-3 text-[#D1D5DB] font-semibold">Assignment 1</th>
                                                        <th className="p-3 text-[#D1D5DB] font-semibold">Assignment 2</th>
                                                        <th className="p-3 text-[#D1D5DB] font-semibold">Average</th>
                                                    </>
                                                )}
                                                {activeTab === 'mid' && (
                                                    <>
                                                        <th className="p-3 text-[#D1D5DB] font-semibold">Midterm Marks</th>
                                                        <th className="p-3 text-[#D1D5DB] font-semibold">Status</th>
                                                    </>
                                                )}
                                                {activeTab === 'final' && (
                                                    <>
                                                        <th className="p-3 text-[#D1D5DB] font-semibold">Final Marks</th>
                                                        <th className="p-3 text-[#D1D5DB] font-semibold">Status</th>
                                                    </>
                                                )}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredResults.map((result) => {
                                                const quizAvg = ((result.quiz1 || 0) + (result.quiz2 || 0) + (result.assignment1 || 0) + (result.assignment2 || 0)) / 4;
                                                return (
                                                    <tr key={result._id} className="border-b border-[#2E2E2E] hover:bg-[#2E2E2E]/30 transition-colors">
                                                        <td className="p-3 text-[#F5F5F5] font-medium">
                                                            {result.course_id?.course_name || 'N/A'}
                                                        </td>
                                                        {activeTab === 'all' && (
                                                            <>
                                                                <td className={`p-3 font-semibold ${getMarkColor(result.quiz1 || 0, 10)}`}>
                                                                    {result.quiz1 !== undefined ? `${result.quiz1}/10` : '-'}
                                                                </td>
                                                                <td className={`p-3 font-semibold ${getMarkColor(result.quiz2 || 0, 10)}`}>
                                                                    {result.quiz2 !== undefined ? `${result.quiz2}/10` : '-'}
                                                                </td>
                                                                <td className={`p-3 font-semibold ${getMarkColor(result.assignment1 || 0, 10)}`}>
                                                                    {result.assignment1 !== undefined ? `${result.assignment1}/10` : '-'}
                                                                </td>
                                                                <td className={`p-3 font-semibold ${getMarkColor(result.assignment2 || 0, 10)}`}>
                                                                    {result.assignment2 !== undefined ? `${result.assignment2}/10` : '-'}
                                                                </td>
                                                                <td className={`p-3 font-semibold ${getMarkColor(result.midterm || 0, 30)}`}>
                                                                    {result.midterm !== undefined ? `${result.midterm}/30` : '-'}
                                                                </td>
                                                                <td className={`p-3 font-semibold ${getMarkColor(result.final_exam || 0, 40)}`}>
                                                                    {result.final_exam !== undefined ? `${result.final_exam}/40` : '-'}
                                                                </td>
                                                            </>
                                                        )}
                                                        {activeTab === 'quiz' && (
                                                            <>
                                                                <td className={`p-3 font-semibold ${getMarkColor(result.quiz1 || 0, 10)}`}>
                                                                    {result.quiz1 !== undefined ? `${result.quiz1}/10` : '-'}
                                                                </td>
                                                                <td className={`p-3 font-semibold ${getMarkColor(result.quiz2 || 0, 10)}`}>
                                                                    {result.quiz2 !== undefined ? `${result.quiz2}/10` : '-'}
                                                                </td>
                                                                <td className={`p-3 font-semibold ${getMarkColor(result.assignment1 || 0, 10)}`}>
                                                                    {result.assignment1 !== undefined ? `${result.assignment1}/10` : '-'}
                                                                </td>
                                                                <td className={`p-3 font-semibold ${getMarkColor(result.assignment2 || 0, 10)}`}>
                                                                    {result.assignment2 !== undefined ? `${result.assignment2}/10` : '-'}
                                                                </td>
                                                                <td className={`p-3 font-semibold ${getMarkColor(quizAvg, 10)}`}>
                                                                    {quizAvg.toFixed(1)}/10
                                                                </td>
                                                            </>
                                                        )}
                                                        {activeTab === 'mid' && (
                                                            <>
                                                                <td className={`p-3 font-semibold ${getMarkColor(result.midterm || 0, 30)}`}>
                                                                    {result.midterm !== undefined ? `${result.midterm}/30` : '-'}
                                                                </td>
                                                                <td className="p-3">
                                                                    {result.midterm !== undefined && (
                                                                        <span className={`px-3 py-1 rounded-full text-sm ${result.midterm >= 15
                                                                            ? 'bg-[#1D4ED8]/20 text-[#1D4ED8] border border-[#1D4ED8]/30'
                                                                            : 'bg-[#6B7280]/20 text-[#6B7280] border border-[#6B7280]/30'
                                                                            }`}>
                                                                            {result.midterm >= 15 ? 'Pass' : 'Fail'}
                                                                        </span>
                                                                    )}
                                                                </td>
                                                            </>
                                                        )}
                                                        {activeTab === 'final' && (
                                                            <>
                                                                <td className={`p-3 font-semibold ${getMarkColor(result.final_exam || 0, 40)}`}>
                                                                    {result.final_exam !== undefined ? `${result.final_exam}/40` : '-'}
                                                                </td>
                                                                <td className="p-3">
                                                                    {result.final_exam !== undefined && (
                                                                        <span className={`px-3 py-1 rounded-full text-sm ${result.final_exam >= 20
                                                                            ? 'bg-[#1D4ED8]/20 text-[#1D4ED8] border border-[#1D4ED8]/30'
                                                                            : 'bg-[#6B7280]/20 text-[#6B7280] border border-[#6B7280]/30'
                                                                            }`}>
                                                                            {result.final_exam >= 20 ? 'Pass' : 'Fail'}
                                                                        </span>
                                                                    )}
                                                                </td>
                                                            </>
                                                        )}
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                    {filteredResults.length === 0 && (
                                        <p className="text-center text-[#6B7280] py-8">No results found</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        </div>
    );
};

export default MyResults;



