import httpClient from "../config/http/httpClient";

export const getLanguageOptions = async () => {
  const response = await httpClient.get('/celebraty/languageOptions');
  return response.data;
};

export const getProfessionsOptions = async () => {
  const response = await httpClient.get('/celebraty/professionsOptions');
  return response.data;
};

export const getProfessions = async () => {
  try {
    const response = await httpClient.get('/celebraty/professions');
    return response.data || [];
  } catch (error) {
    console.error("Error fetching professions:", error);
    return [];
  }
};

export const fetchSectionTemplate = async () => {
  try {
    const response = await httpClient.get('/celebraty/fetchSectionTemplate');
    return response.data || [];
  } catch (error) {
    console.error("Error fetching fetchSectionTemplate:", error);
    return [];
  }
};

export const addCelebraty = async (formData) => {
  const response = await httpClient.post('/celebraty/addcelebraty', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const getCelebraties = async () => {
  const response = await httpClient.get('/celebraty/getcelebraties');
  return response.data;
};

export const getCelebratyById = async (id) => {
  const response = await httpClient.get(`/celebraty/getCelebratyById/${id}`);
  return response.data;
};

export const getSectionMasters = async () => {
  const response = await httpClient.get('/celebraty/getSectionMasters');
  return response.data;
};

export const getCelebratySectionsByCeleb = async (celebratyId) => {
  try {
    if (!celebratyId) throw new Error("celebratyId is required");
    const response = await httpClient.get(`/celebraty/getCelebratySectionsByCeleb/${celebratyId}`);
    return response.data.data || [];
  } catch (error) {
    console.error("Error fetching celebraty sections:", error);
    return [];
  }
};

export const updateCelebraty = async (id, formData) => {
  try {
    const response = await httpClient.patch(`/celebraty/updatecelebraty/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error("Update Celebraty API Error:", error);
    return { status: false, msg: "Network error" };
  }
};

export const deleteCelebraty = async (id) => {
  const response = await httpClient.delete(`/celebraty/deletecelebraty/${id}`);
  return response.data;
};

export const updateCelebratyStatus = async (id, status) => {
  const response = await httpClient.patch('/celebraty/update-statuscelebraty', { id, status });
  return response.data;
};

export const getSocialLinksOptions = async () => {
  const response = await httpClient.get('/celebraty/sociallist');
  return response.data;
};