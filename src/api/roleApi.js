import httpClient from '../config/http/httpClient';

/* =========================
   ROLE API
========================= */

/**
 * Create a new role
 * @param {Object} roleData - { name, description, permissions, isActive }
 */
export const createRole = async (roleData) => {
  try {
    const { data } = await httpClient.post('/roles', roleData);
    return data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to create role.';
    throw message;
  }
};

/**
 * Get all roles
 * @param {Object} params - Optional query params { page, limit, search, isActive }
 */
export const getAllRoles = async (params = {}) => {
  try {
    const { data } = await httpClient.get('/roles', { params });
    return data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to fetch roles.';
    throw message;
  }
};

/**
 * Get role by ID
 * @param {String} roleId - Role ID
 */
export const getRoleById = async (roleId) => {
  try {
    const { data } = await httpClient.get(`/roles/${roleId}`);
    return data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to fetch role details.';
    throw message;
  }
};

/**
 * Update role details
 * @param {String} roleId - Role ID
 * @param {Object} roleData - { name, description, permissions }
 */
export const updateRole = async (roleId, roleData) => {
  try {
    const { data } = await httpClient.put(`/roles/${roleId}`, roleData);
    return data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to update role.';
    throw message;
  }
};

/**
 * Update role status (activate/deactivate)
 * @param {String} roleId - Role ID
 * @param {Boolean} isActive - Status to set
 */
export const updateRoleStatus = async (roleId, isActive) => {
  try {
    const { data } = await httpClient.patch(`/roles/${roleId}/status`, { isActive });
    return data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to update role status.';
    throw message;
  }
};

/**
 * Delete role
 * @param {String} roleId - Role ID
 */
export const deleteRole = async (roleId) => {
  try {
    const { data } = await httpClient.delete(`/roles/${roleId}`);
    return data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to delete role.';
    throw message;
  }
};

/**
 * Bulk operations (if needed in future)
 */
export const bulkUpdateRoleStatus = async (roleIds, isActive) => {
  try {
    const { data } = await httpClient.patch('/roles/bulk/status', { 
      roleIds, 
      isActive 
    });
    return data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to update roles.';
    throw message;
  }
};

export const bulkDeleteRoles = async (roleIds) => {
  try {
    const { data } = await httpClient.post('/roles/bulk/delete', { roleIds });
    return data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to delete roles.';
    throw message;
  }
};