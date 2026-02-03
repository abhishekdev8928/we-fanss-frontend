import httpClient from "../config/http/httpClient";

export const getLanguageOptions = async () => {
  try {
    const response = await httpClient.get('/Moviev/languageOptions');
    return response.data;
  } catch (error) {
    console.error("Error fetching language options:", error);
    throw error;
  }
};

export const getProfessionsOptions = async () => {
  try {
    const response = await httpClient.get('/Moviev/professionsOptions');
    return response.data;
  } catch (error) {
    console.error("Error fetching profession options:", error);
    throw error;
  }
};

export const addMoviev = async (formData) => {
  try {
    const response = await httpClient.post('/moviev/addMoviev', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error adding movie:", error);
    throw error;
  }
};

export const getMoviesByCelebrity = async (id) => {
  try {
    const response = await httpClient.get(`/Moviev/getMoviesByCelebrity/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching movies by celebrity:", error);
    throw error;
  }
};

export const deleteMoviev = async (id) => {
  try {
    const response = await httpClient.delete(`/Moviev/deletemoviev/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting movie:", error);
    throw error;
  }
};

export const getMovievById = async (id) => {
  try {
    const response = await httpClient.get(`/Moviev/getMovievByid/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching movie by ID:", error);
    throw error;
  }
};

export const updateMoviev = async (id, formData) => {
  try {
    const response = await httpClient.patch(`/Moviev/updateMoviev/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating movie:", error);
    return { status: false, msg: "Network error" };
  }
};

export const getGenreMaster = async () => {
  try {
    const response = await httpClient.get('/Moviev/GenreMasterOptions');
    return response.data;
  } catch (error) {
    console.error("Error fetching genre master:", error);
    throw error;
  }
};

export const updateMovieStatus = async (id, status) => {
  try {
    const response = await httpClient.patch('/Moviev/update-statusMoviev', { id, status });
    return response.data;
  } catch (error) {
    console.error("Error updating movie status:", error);
    throw error;
  }
};

export const getSocialLinksOptions = async () => {
  try {
    const response = await httpClient.get('/Moviev/sociallist');
    return response.data;
  } catch (error) {
    console.error("Error fetching social link options:", error);
    throw error;
  }
};