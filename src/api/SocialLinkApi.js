// src/api/SocialLinkApi.js
import httpClient from '../config/http/httpClient';

export const fetchSocialLink = async () => {
  try {
    const response = await httpClient.get('/socialLink/getdataSocialLink');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch social links');
  }
};

export const addSocialLink = async (category) => {
  try {
    const response = await httpClient.post('/socialLink/addSocialLink', category);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to add social link');
  }
};

export const updateSocialLink = async (id, category) => {
  try {
    const response = await httpClient.patch(`/socialLink/updateSocialLink/${id}`, category);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update social link');
  }
};

export const deleteSocialLink = async (id) => {
  try {
    const response = await httpClient.delete(`/socialLink/deleteSocialLink/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to delete social link');
  }
};

export const getSocialLinkById = async (id) => {
  try {
    const response = await httpClient.get(`/socialLink/getSocialLinkByid/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch social link');
  }
};

export const updateSocialLinkStatus = async (id, status) => {
  try {
    const response = await httpClient.patch('/socialLink/update-statuscategory', { id, status });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update social link status');
  }
};