import httpClient from "../config/http/httpClient";

export const getsectionmaster = async () => {
  try {
    const response = await httpClient.get('/sectionmaster/getdata');
    return response.data;
  } catch (error) {
    console.error("Error fetching section master:", error);
    throw error;
  }
};

export const addsectionmaster = async (payload) => {
  try {
    const response = await httpClient.post('/sectionmaster/addsectionmaster', payload);
    return response.data;
  } catch (error) {
    console.error("Error adding section master:", error);
    throw error;
  }
};

export const updatesectionmaster = async (id, payload) => {
  try {
    const response = await httpClient.patch(`/sectionmaster/updatesectionmaster/${id}`, payload);
    return response.data;
  } catch (error) {
    console.error("Error updating section master:", error);
    throw error;
  }
};

export const deletesectionmaster = async (id) => {
  try {
    const response = await httpClient.delete(`/sectionmaster/deletesectionmaster/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting section master:", error);
    throw error;
  }
};

export const updatesectionmasterStatus = async (id, status) => {
  try {
    const response = await httpClient.patch('/sectionmaster/updateStatus', { id, status });
    return response.data;
  } catch (error) {
    console.error("Error updating section master status:", error);
    throw error;
  }
};

export const getsectionmasterById = async (id) => {
  try {
    const response = await httpClient.get(`/sectionmaster/getsectionmasterByid/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching section master by ID:", error);
    throw error;
  }
};