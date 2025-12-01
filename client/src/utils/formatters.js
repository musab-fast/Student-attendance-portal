/**
 * Formatting utilities for display purposes
 */

/**
 * Format currency amount
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount) => {
    return `Rs. ${amount.toLocaleString()}`;
};

/**
 * Format date to locale string
 * @param {Date|string} date - Date to format
 * @returns {string} Formatted date string
 */
export const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
};

/**
 * Format percentage value
 * @param {number} value - Percentage value
 * @returns {string} Formatted percentage string
 */
export const formatPercentage = (value) => {
    return `${value}%`;
};

/**
 * Format grade with GPA
 * @param {string} grade - Letter grade
 * @param {number} gpa - GPA value
 * @returns {string} Formatted grade string
 */
export const formatGrade = (grade, gpa) => {
    return `${grade} (${gpa.toFixed(1)})`;
};

/**
 * Truncate text to specified length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 50) => {
    if (text.length <= maxLength) return text;
    return `${text.substring(0, maxLength)}...`;
};
