import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import axios from 'axios';

const TeacherTimetable = () => {
    const [timetable, setTimetable] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const config = {
        headers: { Authorization: `Bearer ${userInfo?.token}` }
    };

    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    useEffect(() => {
        fetchTimetable();
    }, []);

    const fetchTimetable = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get('http://localhost:5000/api/teacher/timetable', config);
            setTimetable(data);
            setLoading(false);
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to fetch timetable');
            setLoading(false);
        }
    };

    const getTimetableForDay = (day) => {
        return timetable.filter(entry => entry.day === day).sort((a, b) => {
            return a.startTime.localeCompare(b.startTime);
        });
    };

    const TimeSlot = ({ entry }) => (
        <div className="bg-[#2E2E2E] p-4 rounded-lg border border-[#2E2E2E] hover:border-[#1D4ED8] transition-all duration-300 hover:shadow-lg hover:shadow-[#1D4ED8]/10">
            <div className="flex items-start justify-between mb-2">
                <h4 className="font-bold text-[#F5F5F5] text-sm">{entry.course?.course_name}</h4>
                <span className="bg-[#1D4ED8]/20 text-[#1D4ED8] text-xs px-2 py-1 rounded border border-[#1D4ED8]/30">
                    {entry.course?.course_id}
                </span>
            </div>
            <div className="space-y-1 text-xs text-[#D1D5DB]">
                <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-[#6B7280]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    <span>{entry.startTime} - {entry.endTime}</span>
                </div>
                <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-[#6B7280]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    <span>Room {entry.room}</span>
                </div>
                <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-[#6B7280]" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z" />
                    </svg>
                    <span>{entry.course?.credit_hours} Credits</span>
                </div>
            </div>
        </div>
    );

    return (
        <Layout role="teacher">
            {/* Header */}
            <div className="mb-8 animate-fadeInUp">
                <h1 className="text-4xl font-bold text-[#F5F5F5] mb-2">My Timetable</h1>
                <p className="text-[#D1D5DB]">Your weekly teaching schedule</p>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1D4ED8]"></div>
                </div>
            ) : error ? (
                <div className="card-dark p-6 text-center">
                    <svg className="w-16 h-16 text-[#6B7280] mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <p className="text-[#6B7280] text-lg">{error}</p>
                </div>
            ) : timetable.length === 0 ? (
                <div className="card-dark p-12 text-center">
                    <svg className="w-20 h-20 text-[#6B7280] mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                    <p className="text-[#6B7280] text-lg">No timetable available yet</p>
                    <p className="text-[#4B5563] text-sm mt-2">Your teaching schedule will appear here once classes are assigned</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {daysOfWeek.map((day, index) => {
                        const daySchedule = getTimetableForDay(day);
                        return (
                            <div
                                key={day}
                                className="card-dark p-6 animate-fadeInUp"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[#2E2E2E]">
                                    <div className="w-10 h-10 bg-[#1D4ED8]/10 rounded-lg flex items-center justify-center border border-[#1D4ED8]/20">
                                        <svg className="w-6 h-6 text-[#1D4ED8]" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-[#F5F5F5]">{day}</h3>
                                        <p className="text-xs text-[#6B7280]">{daySchedule.length} {daySchedule.length === 1 ? 'class' : 'classes'}</p>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    {daySchedule.length > 0 ? (
                                        daySchedule.map((entry) => (
                                            <TimeSlot key={entry._id} entry={entry} />
                                        ))
                                    ) : (
                                        <div className="text-center py-8">
                                            <p className="text-[#6B7280] text-sm">No classes scheduled</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </Layout>
    );
};

export default TeacherTimetable;



