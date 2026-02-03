import httpClient from "../config/http/httpClient";

export const fetchLanguage = async () => {
  try {
    const response = await httpClient.get('/language/getdataLanguage');
    return response.data;
  } catch (error) {
    console.error("Error fetching language:", error);
    throw error;
  }
};

export const addLanguage = async (category) => {
  try {
    const response = await httpClient.post('/language/addLanguage', category);
    return response.data;
  } catch (error) {
    console.error("Error adding language:", error);
    throw error;
  }
};

export const updateLanguage = async (id, category) => {
  try {
    const response = await httpClient.patch(`/language/updateLanguage/${id}`, category);
    return response.data;
  } catch (error) {
    console.error("Error updating language:", error);
    throw error;
  }
};

export const deleteLanguage = async (id) => {
  try {
    const response = await httpClient.delete(`/language/deleteLanguage/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting language:", error);
    throw error;
  }
};

export const getLanguageById = async (id) => {
  try {
    const response = await httpClient.get(`/language/getLanguageByid/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching language by ID:", error);
    throw error;
  }
};

export const updateLanguageStatus = async (id, status) => {
  try {
    const response = await httpClient.patch('/language/update-statuscategory', { id, status });
    return response.data;
  } catch (error) {
    console.error("Error updating language status:", error);
    throw error;
  }
};