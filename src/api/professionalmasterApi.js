import httpClient from "../config/http/httpClient";

export const getprofessionalmasters = async () => {
  try {
    const response = await httpClient.get('/professionalmaster');
    return response.data;
  } catch (error) {
    console.error("Error fetching professional masters:", error);
    throw error;
  }
};

export const getSectionTemplateOptions = async () => {
  try {
    const response = await httpClient.get('/professionalmaster/section-templates');
    return response.data;
  } catch (error) {
    console.error("Error fetching section template options:", error);
    throw error;
  }
};

export const addprofessionalmaster = async (formData) => {
  try {
    const response = await httpClient.post('/professionalmaster', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error adding professional master:", error);
    throw error;
  }
};

export const updateprofessionalmaster = async (id, formData) => {
  try {
    const response = await httpClient.put(`/professionalmaster/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating professional master:", error);
    throw error;
  }
};

export const updateprofessionalmasterStatus = async (id, status) => {
  try {
    const response = await httpClient.patch('/professionalmaster/status', { id, status });
    return response.data;
  } catch (error) {
    console.error("Error updating professional master status:", error);
    throw error;
  }
};

export const getprofessionalmasterById = async (id) => {
  try {
    const response = await httpClient.get(`/professionalmaster/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching professional master by ID:", error);
    throw error;
  }
};

export const deleteprofessionalmaster = async (id) => {
  try {
    const response = await httpClient.delete(`/professionalmaster/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting professional master:", error);
    throw error;
  }
};