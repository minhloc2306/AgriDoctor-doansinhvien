import axiosClient from '../utils/axiosClient';

const API_ENDPOINT = '/diseases';

/**
 * Fetches all diseases, populating category name.
 * @returns {Promise<Array>} Array of disease objects.
 */
export const getAllDiseases = async () => {
    try {
        // Backend route GET /api/diseases should already populate category
        const response = await axiosClient.get(API_ENDPOINT);
        return response.data;
    } catch (error) {
        console.error('Error fetching diseases:', error.response?.data || error.message);
        throw error.response?.data || new Error('Failed to fetch diseases');
    }
};

/**
 * Fetches a single disease by ID, populating category details.
 * @param {string} id Disease ID.
 * @returns {Promise<object>} Disease object.
 */
export const getDiseaseById = async (id) => {
    try {
        // Backend route GET /api/diseases/:id should populate category
        const response = await axiosClient.get(`${API_ENDPOINT}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching disease ${id}:`, error.response?.data || error.message);
        throw error.response?.data || new Error('Failed to fetch disease');
    }
};

/**
 * Adds a new disease.
 * Requires Admin privileges.
 * Uses FormData to handle image uploads.
 * @param {FormData} formData Disease data including images.
 * @returns {Promise<object>} The newly created disease object.
 */
export const addDisease = async (formData) => {
    try {
        // Axios client defaults to application/json, override for FormData
        const response = await axiosClient.post(API_ENDPOINT, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error adding disease:', error.response?.data || error.message);
        throw error.response?.data || new Error('Failed to add disease');
    }
};

/**
 * Updates an existing disease.
 * Requires Admin privileges.
 * Uses FormData to handle image uploads and existing image references.
 * @param {string} id Disease ID.
 * @param {FormData} formData Disease data including new images and existing image paths.
 * @returns {Promise<object>} The updated disease object.
 */
export const updateDisease = async (id, formData) => {
    try {
         // Axios client defaults to application/json, override for FormData
        const response = await axiosClient.put(`${API_ENDPOINT}/${id}`, formData, {
             headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error(`Error updating disease ${id}:`, error.response?.data || error.message);
        throw error.response?.data || new Error('Failed to update disease');
    }
};

/**
 * Deletes a disease.
 * Requires Admin privileges.
 * @param {string} id Disease ID.
 * @returns {Promise<object>} Response message.
 */
export const deleteDisease = async (id) => {
    try {
        const response = await axiosClient.delete(`${API_ENDPOINT}/${id}`);
        return response.data; // Should contain { msg: 'Disease removed' }
    } catch (error) {
        console.error(`Error deleting disease ${id}:`, error.response?.data || error.message);
        throw error.response?.data || new Error('Failed to delete disease');
    }
};

/**
 * Searches for diseases based on a search term.
 * @param {string} searchTerm The search term to use.
 * @returns {Promise<Array>} Array of disease objects matching the search term.
 */
export const searchDiseases = async (searchTerm) => {
    try {
        const response = await axiosClient.get(`${API_ENDPOINT}/search`, {
            params: { q: searchTerm }
        });
        return response.data;
    } catch (error) {
        console.error('Error searching diseases:', error);
        throw error.response?.data || error;
    }
}; 