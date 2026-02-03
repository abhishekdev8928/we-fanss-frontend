// src/api/SectionTemplateApi.js
import httpClient from '../config/http/httpClient';

export const fetchSectionTemplate = async () => {
  try {
    const response = await httpClient.get('/sectiontemplate/getdataSectionTemplate');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch section templates');
  }
};

export const getSectionsOptions = async () => {
  try {
    const response = await httpClient.get('/sectiontemplate/sectionsOptions');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch section options');
  }
};

export const addSectionTemplate = async (category) => {
  try {
    const response = await httpClient.post('/sectiontemplate/addSectionTemplate', category);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to add section template');
  }
};

export const updateSectionTemplate = async (id, category) => {
  try {
    const response = await httpClient.patch(`/sectiontemplate/updateSectionTemplate/${id}`, category);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update section template');
  }
};

export const deleteSectionTemplate = async (id) => {
  try {
    const response = await httpClient.delete(`/sectiontemplate/deleteSectionTemplate/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to delete section template');
  }
};

export const getSectionTemplateById = async (id) => {
  try {
    const response = await httpClient.get(`/sectiontemplate/getSectionTemplateByid/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch section template');
  }
};

export const updateSectionTemplateStatus = async (id, status) => {
  try {
    const response = await httpClient.patch('/sectiontemplate/update-statuscategory', { id, status });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update section template status');
  }
};