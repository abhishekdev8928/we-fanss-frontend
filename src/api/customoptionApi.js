import httpClient from "../config/http/httpClient";

export const getcustomoption = async (id) => {
  try {
    const response = await httpClient.get(`/customoption/getdata/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching customoption:", error);
    throw error;
  }
};

export const addcustomoption = async (formData) => {
  try {
    const response = await httpClient.post('/customoption/addcustomoption', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error adding customoption:", error);
    throw error;
  }
};

export const updatecustomoption = async (id, formData) => {
  try {
    const response = await httpClient.patch(`/customoption/updatecustomoption/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating customoption:", error);
    throw error;
  }
};

export const deletecustomoption = async (id) => {
  try {
    const response = await httpClient.delete(`/customoption/deletecustomoption/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting customoption:", error);
    throw error;
  }
};

export const updatecustomoptionStatus = async (id, status) => {
  try {
    const response = await httpClient.patch('/customoption/updateStatus', { id, status });
    return response.data;
  } catch (error) {
    console.error("Error updating customoption status:", error);
    throw error;
  }
};

export const getcustomoptionById = async (id) => {
  try {
    const response = await httpClient.get(`/customoption/getcustomoptionByid/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching customoption by ID:", error);
    throw error;
  }
};