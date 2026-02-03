import httpClient from "../config/http/httpClient";

export const getLanguageOptions = async () => {
  try {
    const response = await httpClient.get('/positions/languageOptions');
    return response.data;
  } catch (error) {
    console.error("Error fetching language options:", error);
    throw error;
  }
};

export const getProfessionsOptions = async () => {
  try {
    const response = await httpClient.get('/positions/professionsOptions');
    return response.data;
  } catch (error) {
    console.error("Error fetching profession options:", error);
    throw error;
  }
};

export const addPositions = async (formData) => {
  try {
    const response = await httpClient.post('/positions/addPositions', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error adding positions:", error);
    throw error;
  }
};

export const getPositionsByCelebrity = async (id) => {
  try {
    const response = await httpClient.get(`/positions/getPositionsByCelebrity/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching positions by celebrity:", error);
    throw error;
  }
};

export const deletePositions = async (id) => {
  try {
    const response = await httpClient.delete(`/positions/deletepositions/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting positions:", error);
    throw error;
  }
};

export const getPositionsById = async (id) => {
  try {
    const response = await httpClient.get(`/positions/getPositionsByid/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching positions by ID:", error);
    throw error;
  }
};

export const updatePositions = async (id, formData) => {
  try {
    const response = await httpClient.patch(`/positions/updatePositions/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating positions:", error);
    return { status: false, msg: "Network error" };
  }
};

export const updatePositionsStatus = async (id, status) => {
  try {
    const response = await httpClient.patch('/positions/update-statusPositions', { id, status });
    return response.data;
  } catch (error) {
    console.error("Error updating positions status:", error);
    throw error;
  }
};

export const getSocialLinksOptions = async () => {
  try {
    const response = await httpClient.get('/positions/sociallist');
    return response.data;
  } catch (error) {
    console.error("Error fetching social link options:", error);
    throw error;
  }
};