import httpClient from "../config/http/httpClient";

export const getLanguageOptions = async () => {
  try {
    const response = await httpClient.get('/election/languageOptions');
    return response.data;
  } catch (error) {
    console.error("Error fetching language options:", error);
    throw error;
  }
};

export const getProfessionsOptions = async () => {
  try {
    const response = await httpClient.get('/election/professionsOptions');
    return response.data;
  } catch (error) {
    console.error("Error fetching profession options:", error);
    throw error;
  }
};

export const addElection = async (formData) => {
  try {
    const response = await httpClient.post('/election/addElection', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error adding election:", error);
    throw error;
  }
};

export const getElectionByCelebrity = async (id) => {
  try {
    const response = await httpClient.get(`/election/getElectionByCelebrity/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching election by celebrity:", error);
    throw error;
  }
};

export const deleteElection = async (id) => {
  try {
    const response = await httpClient.delete(`/election/deleteelection/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting election:", error);
    throw error;
  }
};

export const getElectionById = async (id) => {
  try {
    const response = await httpClient.get(`/election/getElectionByid/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching election by ID:", error);
    throw error;
  }
};

export const updateElection = async (id, formData) => {
  try {
    const response = await httpClient.patch(`/election/updateElection/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating election:", error);
    return { status: false, msg: "Network error" };
  }
};

export const updateElectionStatus = async (id, status) => {
  try {
    const response = await httpClient.patch('/election/update-statusElection', { id, status });
    return response.data;
  } catch (error) {
    console.error("Error updating election status:", error);
    throw error;
  }
};

export const getSocialLinksOptions = async () => {
  try {
    const response = await httpClient.get('/election/sociallist');
    return response.data;
  } catch (error) {
    console.error("Error fetching social link options:", error);
    throw error;
  }
};