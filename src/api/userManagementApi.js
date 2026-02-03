// api/userManagement.api.js
import httpClient from "../config/http/httpClient";
/**
 * User Management API
 * Handles all user-related API calls for admin functionality
 */

/**
 * Get all users with pagination and filters
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number
 * @param {number} params.limit - Items per page
 * @param {string} params.search - Search term
 * @param {string} params.role - Filter by role
 * @param {string} params.status - Filter by status
 * @param {string} params.sortBy - Sort field
 * @param {string} params.sortOrder - Sort order (asc/desc)
 * @returns {Promise} API response with users list
 */
export const getAllUsers = async (params = {}) => {
  try {
    const response = await httpClient.get('/users', { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get single user by ID
 * @param {string} userId - User ID
 * @returns {Promise} API response with user details
 */
export const getUserById = async (userId) => {
  try {
    const response = await httpClient.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Update user role
 * @param {string} userId - User ID
 * @param {Object} data - Update data
 * @param {string} data.role - New role (admin/user/moderator)
 * @returns {Promise} API response
 */
export const updateUserRole = async (userId, data) => {
  try {
    const response = await httpClient.patch(`/users/${userId}/role`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Update user status (activate/deactivate)
 * @param {string} userId - User ID
 * @param {Object} data - Update data
 * @param {boolean} data.isActive - Active status
 * @returns {Promise} API response
 */
export const updateUserStatus = async (userId, data) => {
  try {
    const response = await httpClient.patch(`/users/${userId}/status`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Delete user
 * @param {string} userId - User ID
 * @returns {Promise} API response
 */
export const deleteUser = async (userId) => {
  try {
    const response = await httpClient.delete(`/users/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Export all functions as default object for easier imports
export default {
  getAllUsers,
  getUserById,
  updateUserRole,
  updateUserStatus,
  deleteUser,
};