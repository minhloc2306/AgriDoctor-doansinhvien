import axiosClient from '../utils/axiosClient';

const API_ENDPOINT = '/users';

/**
 * Fetches all users.
 * Requires Admin privileges.
 * @returns {Promise<Array>} Array of user objects (excluding passwords).
 */
export const getAllUsers = async () => {
    try {
        const response = await axiosClient.get(API_ENDPOINT);
        return response.data;
    } catch (error) {
        console.error('Error fetching users:', error.response?.data || error.message);
        throw error.response?.data || new Error('Failed to fetch users');
    }
};

/**
 * Fetches a single user by ID.
 * Requires Admin privileges.
 * @param {string} id User ID.
 * @returns {Promise<object>} User object (excluding password).
 */
export const getUserById = async (id) => {
    try {
        const response = await axiosClient.get(`${API_ENDPOINT}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching user ${id}:`, error.response?.data || error.message);
        throw error.response?.data || new Error('Failed to fetch user');
    }
};

/**
 * Updates an existing user (e.g., role, name, potentially password).
 * Requires Admin privileges.
 * @param {string} id User ID.
 * @param {object} userData User data to update (e.g., { name, email, role, password }).
 * @returns {Promise<object>} The updated user object (excluding password).
 */
export const updateUser = async (id, userData) => {
    try {
        const response = await axiosClient.put(`${API_ENDPOINT}/${id}`, userData);
        return response.data;
    } catch (error) {
        console.error(`Error updating user ${id}:`, error.response?.data || error.message);
        // Handle specific errors like duplicate email if possible
        throw error.response?.data || new Error('Failed to update user');
    }
};

/**
 * Deletes a user.
 * Requires Admin privileges.
 * @param {string} id User ID.
 * @returns {Promise<object>} Response message.
 */
export const deleteUser = async (id) => {
    try {
        const response = await axiosClient.delete(`${API_ENDPOINT}/${id}`);
        return response.data; // Should contain { msg: 'User removed' }
    } catch (error) {
        console.error(`Error deleting user ${id}:`, error.response?.data || error.message);
        throw error.response?.data || new Error('Failed to delete user');
    }
}; 