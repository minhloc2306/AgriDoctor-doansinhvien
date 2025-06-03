import axiosClient from '../utils/axiosClient';

/**
 * Registers a new user.
 * @param {object} userData - User data (name, email, password, role?)
 * @returns {Promise<object>} - The response data (likely includes a token)
 */
export const register = async (userData) => {
  try {
    const response = await axiosClient.post('/auth/register', userData);
    // Assuming the token is in response.data.token
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data; // Return the full response data
  } catch (error) {
    console.error('Registration failed:', error.response?.data || error.message);
    // Re-throw the error or return a specific error object
    throw error.response?.data || new Error('Registration failed');
  }
};

/**
 * Logs in a user.
 * @param {object} credentials - User credentials (email, password)
 * @returns {Promise<object>} - The response data (likely includes a token)
 */
export const login = async (credentials) => {
  try {
    const response = await axiosClient.post('/auth/login', credentials);
    // Assuming the token is in response.data.token
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      // Optionally, you might want to fetch user data immediately after login here
      // or let the component handle it.
    }
    return response.data;
  } catch (error) {
    console.error('Login failed:', error.response?.data || error.message);
    // Re-throw the error or return a specific error object
    throw error.response?.data || new Error('Login failed');
  }
};

/**
 * Logs out the current user by removing the token.
 */
export const logout = () => {
  localStorage.removeItem('token');
  // You might want to add logic here to clear user state in your app
};

/**
 * Fetches the data of the currently logged-in user.
 * Requires a valid token to be set.
 * @returns {Promise<object>} - The user data (excluding password)
 */
export const getLoggedInUser = async () => {
    try {
        const response = await axiosClient.get('/auth');
        return response.data;
    } catch (error) {
        console.error('Failed to fetch user data:', error.response?.data || error.message);
        // Handle cases where token is invalid or expired (e.g., log out the user)
        if (error.response?.status === 401) {
            logout(); // Automatically log out if token is invalid
        }
        throw error.response?.data || new Error('Failed to fetch user data');
    }
}; 