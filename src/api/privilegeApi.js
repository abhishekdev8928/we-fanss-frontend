import httpClient from "../config/http/httpClient";

export const getUserPrivileges = async () => {
  try {
    const response = await httpClient.get("/privileges");
    return response.data;
  } catch (error) {
    console.error("Error fetching privileges:", error);
    throw error;
  }
};

export const getPrivilegesByRoleId = async (roleId) => {
  try {
    const response = await httpClient.get(`/privileges/role/${roleId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching privileges by role ID:", error);
    throw error;
  }
};

export const setPrivileges = async (roleId, privilegeData) => {
  try {
    const response = await httpClient.put(`/privileges/role/${roleId}`, privilegeData);
    return response.data;
  } catch (error) {
    console.error("Error updating privileges:", error);
    throw error;
  }
};