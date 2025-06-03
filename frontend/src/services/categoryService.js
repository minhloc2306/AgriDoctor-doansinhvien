import axiosClient from '../utils/axiosClient';

const API_ENDPOINT = '/categories';

/**
 * Fetches all categories.
 * @returns {Promise<Array>} Array of category objects.
 */
export const getAllCategories = async () => {
    try {
        const response = await axiosClient.get(API_ENDPOINT);
        return response.data;
    } catch (error) {
        console.error('Error fetching categories:', error.response?.data || error.message);
        throw error.response?.data || new Error('Failed to fetch categories');
    }
};

/**
 * Fetches a single category by ID.
 * Requires Admin privileges.
 * @param {string} id Category ID.
 * @returns {Promise<object>} Category object.
 */
export const getCategoryById = async (id) => {
    try {
        const response = await axiosClient.get(`${API_ENDPOINT}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching category ${id}:`, error.response?.data || error.message);
        throw error.response?.data || new Error('Failed to fetch category');
    }
};

/**
 * Adds a new category.
 * Requires Admin privileges.
 * @param {object} categoryData Category data ({ name, description }).
 * @returns {Promise<object>} The newly created category object.
 */
export const addCategory = async (categoryData) => {
    try {
        const response = await axiosClient.post(API_ENDPOINT, categoryData);
        return response.data;
    } catch (error) {
        console.error('Error adding category:', error.response?.data || error.message);
        throw error.response?.data || new Error('Failed to add category');
    }
};

/**
 * Updates an existing category.
 * Requires Admin privileges.
 * @param {string} id Category ID.
 * @param {object} categoryData Category data ({ name, description }).
 * @returns {Promise<object>} The updated category object.
 */
export const updateCategory = async (id, categoryData) => {
    try {
        const response = await axiosClient.put(`${API_ENDPOINT}/${id}`, categoryData);
        return response.data;
    } catch (error) {
        console.error(`Error updating category ${id}:`, error.response?.data || error.message);
        throw error.response?.data || new Error('Failed to update category');
    }
};

/**
 * Deletes a category.
 * Requires Admin privileges.
 * @param {string} id Category ID.
 * @returns {Promise<object>} Response message.
 */
export const deleteCategory = async (id) => {
    try {
        const response = await axiosClient.delete(`${API_ENDPOINT}/${id}`);
        return response.data; // Should contain { msg: 'Category removed' }
    } catch (error) {
        console.error(`Error deleting category ${id}:`, error.response?.data || error.message);
        // Specific message for dependency error
        if (error.response?.status === 400 && error.response?.data?.msg?.includes('đang được gán cho')) {
             throw new Error(error.response.data.msg);
        }
        throw error.response?.data || new Error('Failed to delete category');
    }
}; 