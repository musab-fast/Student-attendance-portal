/**
 * Calculation utilities for statistics and data processing
 */

/**
 * Calculate attendance statistics from attendance records
 * @param {Array} attendance - Array of attendance records
 * @returns {Object} Attendance statistics
 */
export const calculateAttendanceStats = (attendance) => {
    const presentCount = attendance.filter(a => a.status === 'Present').length;
    const absentCount = attendance.filter(a => a.status === 'Absent').length;
    const leaveCount = attendance.filter(a => a.status === 'Leave').length;
    const totalClasses = attendance.length;
    const attendancePercentage = totalClasses > 0
        ? Math.round((presentCount / totalClasses) * 100)
        : 0;

    return {
        attendancePercentage,
        presentCount,
        absentCount,
        leaveCount,
        totalClasses
    };
};

/**
 * Calculate fee statistics from fee records
 * @param {Array} fees - Array of fee records
 * @returns {Object} Fee statistics
 */
export const calculateFeeStats = (fees) => {
    const totalFees = fees.reduce((sum, fee) => sum + fee.amount, 0);
    const paidFees = fees
        .filter(f => f.status === 'Paid')
        .reduce((sum, fee) => sum + fee.amount, 0);
    const unpaidFees = totalFees - paidFees;

    return {
        feeStatus: unpaidFees === 0 ? 'Clear' : 'Pending',
        totalFees,
        paidFees,
        unpaidFees
    };
};

/**
 * Calculate GPA from results
 * @param {Array} results - Array of result records
 * @returns {number} Average GPA
 */
export const calculateGPA = (results) => {
    if (results.length === 0) return 0;
    const totalGPA = results.reduce((sum, r) => sum + (r.gpa || 0), 0);
    return (totalGPA / results.length).toFixed(2);
};

/**
 * Get attendance status label based on percentage
 * @param {number} percentage - Attendance percentage
 * @returns {string} Status label
 */
export const getAttendanceLabel = (percentage) => {
    if (percentage >= 75) return 'Good';
    if (percentage >= 50) return 'Fair';
    return 'Low';
};

/**
 * Get attendance color based on percentage
 * @param {number} percentage - Attendance percentage
 * @returns {string} Tailwind color class
 */
export const getAttendanceColor = (percentage) => {
    if (percentage >= 75) return '[#1D4ED8]';
    if (percentage >= 50) return '[#6B7280]';
    return '[#6B7280]';
};
