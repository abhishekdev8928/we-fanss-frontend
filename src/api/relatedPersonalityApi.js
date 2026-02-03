import httpClient from "../config/http/httpClient";

export const createRelatedPersonality = async (relatedPersonalityData) => {
  try {
    const { data } = await httpClient.post("/related-personalities", relatedPersonalityData);
    return data;
  } catch (error) {
    throw error;
  }
};

export const getAllRelatedPersonalities = async (celebrityId, params = {}) => {
  try {
    const { data } = await httpClient.get(`/related-personalities/celebrity/${celebrityId}`, {
      params, // { page, limit, status }
    });
    return data;
  } catch (error) {
    throw error;
  }
};

export const getRelatedPersonalityById = async (id) => {
  try {
    const { data } = await httpClient.get(`/related-personalities/${id}`);
    return data;
  } catch (error) {
    throw error;
  }
};

export const updateRelatedPersonality = async (id, relatedPersonalityData) => {
  try {
    const { data } = await httpClient.put(`/related-personalities/${id}`, relatedPersonalityData);
    return data;
  } catch (error) {
    throw error;
  }
};

export const updateRelatedPersonalityStatus = async (id, status) => {
  try {
    const { data } = await httpClient.patch(`/related-personalities/${id}/status`, { status });
    return data;
  } catch (error) {
    throw error;
  }
};

export const deleteRelatedPersonality = async (id) => {
  try {
    const { data } = await httpClient.delete(`/related-personalities/${id}`);
    return data;
  } catch (error) {
    throw error;
  }
};