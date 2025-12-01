import { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../config';
import { calculateFeeStats } from '../utils/calculations';
import { getAuthConfig } from '../utils/auth';

/**
 * Custom hook for fetching and managing admin statistics
 * @returns {Object} Stats, loading state, error, and refetch function
 */
export const useAdminStats = () => {
    const [stats, setStats] = useState({
        totalStudents: 0,
        totalTeachers: 0,
        totalCourses: 0,
        totalFees: 0,
        paidFees: 0,
        unpaidFees: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchStats = async () => {
        try {
            setLoading(true);
            setError(null);

            const authConfig = getAuthConfig();
            const [usersRes, coursesRes, feesRes] = await Promise.all([
                axios.get(`${config.API_URL}/admin/users`, authConfig),
                axios.get(`${config.API_URL}/admin/courses`, authConfig),
                axios.get(`${config.API_URL}/admin/fees`, authConfig)
            ]);

            const students = usersRes.data.filter(u => u.role === 'student').length;
            const teachers = usersRes.data.filter(u => u.role === 'teacher').length;
            const feeStats = calculateFeeStats(feesRes.data);

            setStats({
                totalStudents: students,
                totalTeachers: teachers,
                totalCourses: coursesRes.data.length,
                ...feeStats
            });
        } catch (err) {
            console.error('Error fetching admin stats:', err);
            setError(err.response?.data?.message || 'Failed to fetch statistics');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    return { stats, loading, error, refetch: fetchStats };
};
