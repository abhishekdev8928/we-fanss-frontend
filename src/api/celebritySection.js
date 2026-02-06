import httpClient from "../config/http/httpClient";

export const getCelebritySections = async (celebrityId) => {
  try {
    const response = await httpClient.get(`/celebrity-sections/${celebrityId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching celebrity sections:", error);
    throw error;
  }
};