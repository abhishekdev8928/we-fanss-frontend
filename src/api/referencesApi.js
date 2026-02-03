import httpClient from "../config/http/httpClient";

export const createReference = async (referenceData) => {
  try {
    const { data } = await httpClient.post("/references", referenceData);
    return data;
  } catch (error) {
    throw error;
  }
};

export const getAllReferences = async (celebrityId) => {
  try {
    const { data } = await httpClient.get(`/references/celebrity/${celebrityId}`);
    return data;
  } catch (error) {
    throw error;
  }
};

export const getReferenceById = async (id) => {
  try {
    const { data } = await httpClient.get(`/references/${id}`);
    return data;
  } catch (error) {
    throw error;
  }
};

export const updateReference = async (id, referenceData) => {
  try {
    const { data } = await httpClient.put(`/references/${id}`, referenceData);
    return data;
  } catch (error) {
    throw error;
  }
};

export const updateReferenceStatus = async (id, status) => {
  try {
    const { data } = await httpClient.patch(`/references/${id}/status`, { status });
    return data;
  } catch (error) {
    throw error;
  }
};

export const deleteReference = async (id) => {
  try {
    const { data } = await httpClient.delete(`/references/${id}`);
    return data;
  } catch (error) {
    throw error;
  }
};