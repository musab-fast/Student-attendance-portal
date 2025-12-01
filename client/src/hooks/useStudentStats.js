import { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../config';
import { calculateAttendanceStats, calculateFeeStats } from '../utils/calculations';
import { getAuthConfig } from '../utils/auth';

/**
 * Custom hook for fetching and managing student statistics
 * @returns {Object} Stats, loading state, error, and refetch function
 */
export const useStudentStats = () => {
    const [stats, setStats] = useState({
        attendancePercentage: 0,
        presentCount: 0,
        absentCount: 0,
        leaveCount: 0,
        totalClasses: 0,
        feeStatus: 'Clear',
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
            const [attendanceRes, feesRes] = await Promise.all([
                axios.get(`${config.API_URL}/student/attendance`, authConfig),
                axios.get(`${config.API_URL}/student/fees`, authConfig)
            ]);

            const attendanceStats = calculateAttendanceStats(attendanceRes.data);
            const feeStats = calculateFeeStats(feesRes.data);

            setStats({ ...attendanceStats, ...feeStats });
        } catch (err) {
            console.error('Error fetching student stats:', err);
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
