// src/api/MovievApi.js
import httpClient from '../config/http/httpClient';

export const getLanguageOptions = async () => {
  try {
    const response = await httpClient.get('/series/languageOptions');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch language options');
  }
};

export const getProfessionsOptions = async () => {
  try {
    const response = await httpClient.get('/series/professionsOptions');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch profession options');
  }
};

export const addSeries = async (formData) => {
  try {
    const response = await httpClient.post('/series/addSeries', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to add series');
  }
};

export const getSeriesByCelebrity = async (id) => {
  try {
    const response = await httpClient.get(`/series/getSeriesByCelebrity/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch series by celebrity');
  }
};

export const deleteSeries = async (id) => {
  try {
    const response = await httpClient.delete(`/series/deleteseries/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to delete series');
  }
};

export const getSeriesById = async (id) => {
  try {
    const response = await httpClient.get(`/series/getSeriesByid/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch series by ID');
  }
};

export const updateSeries = async (id, formData) => {
  try {
    const response = await httpClient.patch(`/series/updateSeries/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update series');
  }
};

export const getGenreMaster = async () => {
  try {
    const response = await httpClient.get('/series/GenreMasterOptions');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch genre options');
  }
};

export const updateSeriesStatus = async (id, status) => {
  try {
    const response = await httpClient.patch('/series/update-statusSeries', { id, status });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update series status');
  }
};

export const getSocialLinksOptions = async () => {
  try {
    const response = await httpClient.get('/series/sociallist');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch social link options');
  }
};