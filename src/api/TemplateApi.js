// src/api/celebratyApi.js
import httpClient from '../config/http/httpClient';

export const getSectionTemplateById = async (id) => {
  try {
    const response = await httpClient.get(`/template/getSectionTemplateById/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch section template');
  }
};

export const saveTemplateData = async (formData) => {
  try {
    const response = await httpClient.post('/template/save', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to save template data');
  }
};

export const getTemplateDataById = async (celebId, sectionId, dataId) => {
  try {
    const response = await httpClient.get(`/template/dataget/${celebId}/${sectionId}/${dataId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch template data');
  }
};

export const deleteTemplateData = async (celebId, sectionName, dataId) => {
  try {
    const response = await httpClient.delete(`/template/delete/${celebId}/${sectionName}/${dataId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to delete template data');
  }
};

export const updateTemplateData = async (formData) => {
  try {
    const response = await httpClient.post('/template/update', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update template data');
  }
};

export const getSectionData = async (celebId, id) => {
  try {
    const response = await httpClient.get(`/template/data/${celebId}/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch section data');
  }
};