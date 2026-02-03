import httpClient from "../config/http/httpClient";

export const fetchGenreMaster = async () => {
  try {
    const response = await httpClient.get('/genreMaster/getdataGenreMaster');
    return response.data;
  } catch (error) {
    console.error("Error fetching genre master:", error);
    throw error;
  }
};

export const addGenreMaster = async (category) => {
  try {
    const response = await httpClient.post('/genreMaster/addGenreMaster', category);
    return response.data;
  } catch (error) {
    console.error("Error adding genre master:", error);
    throw error;
  }
};

export const updateGenreMaster = async (id, category) => {
  try {
    const response = await httpClient.patch(`/genreMaster/updateGenreMaster/${id}`, category);
    return response.data;
  } catch (error) {
    console.error("Error updating genre master:", error);
    throw error;
  }
};

export const deleteGenreMaster = async (id) => {
  try {
    const response = await httpClient.delete(`/genreMaster/deleteGenreMaster/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting genre master:", error);
    throw error;
  }
};

export const getGenreMasterById = async (id) => {
  try {
    const response = await httpClient.get(`/genreMaster/getGenreMasterByid/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching genre master by ID:", error);
    throw error;
  }
};

export const updateGenreMasterStatus = async (id, status) => {
  try {
    const response = await httpClient.patch('/genreMaster/update-statuscategory', { id, status });
    return response.data;
  } catch (error) {
    console.error("Error updating genre master status:", error);
    throw error;
  }
};