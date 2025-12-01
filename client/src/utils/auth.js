/**
 * Authentication utilities
 */

/**
 * Get user info from localStorage
 * @returns {Object|null} User info object or null
 */
export const getUserInfo = () => {
    const userInfo = localStorage.getItem('userInfo');
    return userInfo ? JSON.parse(userInfo) : null;
};

/**
 * Get auth config for axios requests
 * @returns {Object} Auth config object with headers
 */
export const getAuthConfig = () => {
    const userInfo = getUserInfo();
    return {
        headers: {
            Authorization: `Bearer ${userInfo?.token}`
        }
    };
};

/**
 * Check if user is authenticated
 * @returns {boolean} True if authenticated
 */
export const isAuthenticated = () => {
    const userInfo = getUserInfo();
    return userInfo && userInfo.token;
};

/**
 * Get user role
 * @returns {string|null} User role or null
 */
export const getUserRole = () => {
    const userInfo = getUserInfo();
    return userInfo?.role || null;
};

/**
 * Logout user
 */
export const logout = () => {
    localStorage.removeItem('userInfo');
    window.location.href = '/';
};
