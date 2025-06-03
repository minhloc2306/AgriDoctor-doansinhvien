import axiosClient from '../utils/axiosClient';

const API_ENDPOINT = '/feedback';

/**
 * Fetches all feedback submissions.
 * Requires Admin privileges.
 * @returns {Promise<Array>} Array of feedback objects.
 */
export const getAllFeedback = async () => {
    try {
        const response = await axiosClient.get(API_ENDPOINT);
        return response.data;
    } catch (error) {
        console.error('Error fetching feedback:', error.response?.data || error.message);
        throw error.response?.data || new Error('Failed to fetch feedback');
    }
};

/**
 * Fetches a single feedback submission by ID.
 * Requires Admin privileges.
 * @param {string} id Feedback ID.
 * @returns {Promise<object>} Feedback object.
 */
export const getFeedbackById = async (id) => {
    try {
        const response = await axiosClient.get(`${API_ENDPOINT}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching feedback ${id}:`, error.response?.data || error.message);
        throw error.response?.data || new Error('Failed to fetch feedback');
    }
};

/**
 * Updates the status of a feedback submission.
 * Requires Admin privileges.
 * @param {string} id Feedback ID.
 * @param {object} statusData Object containing the new status (e.g., { status: 'reviewed' }).
 * @returns {Promise<object>} The updated feedback object.
 */
export const updateFeedbackStatus = async (id, statusData) => {
    try {
        const response = await axiosClient.put(`${API_ENDPOINT}/${id}`, statusData);
        return response.data;
    } catch (error) {
        console.error(`Error updating feedback status ${id}:`, error.response?.data || error.message);
        throw error.response?.data || new Error('Failed to update feedback status');
    }
};

/**
 * Deletes a feedback submission.
 * Requires Admin privileges.
 * @param {string} id Feedback ID.
 * @returns {Promise<object>} Response message.
 */
export const deleteFeedback = async (id) => {
    try {
        const response = await axiosClient.delete(`${API_ENDPOINT}/${id}`);
        return response.data; // Should contain { msg: 'Feedback removed' }
    } catch (error) {
        console.error(`Error deleting feedback ${id}:`, error.response?.data || error.message);
        throw error.response?.data || new Error('Failed to delete feedback');
    }
};

/**
 * Submits new feedback (Public endpoint).
 * @param {object} feedbackData Feedback data ({ name, email, subject, message, type }).
 * @returns {Promise<object>} Response message and created feedback.
 */
export const submitFeedback = async (feedbackData) => {
    try {
        // This endpoint is public, so it might use a different client or configuration
        // if your public API differs significantly, but using the same for now.
        const response = await axiosClient.post(API_ENDPOINT, feedbackData);
        return response.data;
    } catch (error) {
        console.error('Error submitting feedback:', error.response?.data || error.message);
        throw error.response?.data || new Error('Failed to submit feedback');
    }
}; 