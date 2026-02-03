// src/api/triviaentriesApi.js
import httpClient from '../config/http/httpClient';

export const addtriviaentries = async (formData) => {
  try {
    const response = await httpClient.post('/triviaentries/addtriviaentries', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to add trivia entry');
  }
};

export const gettriviaentriesCategories = async () => {
  try {
    const response = await httpClient.get('/triviaentries/categoryOptions');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch trivia categories');
  }
};

export const getTriviaentries = async (id) => {
  try {
    const response = await httpClient.get(`/triviaentries/getdatatriviaentries/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch trivia entries');
  }
};

export const getTriviaentriesById = async (id) => {
  try {
    const response = await httpClient.get(`/triviaentries/gettriviaentriesByid/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch trivia entry');
  }
};

export const updateTriviaentries = async (id, formData) => {
  try {
    const response = await httpClient.patch(`/triviaentries/updatetriviaentries/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update trivia entry');
  }
};

export const updateTriviaentriesStatus = async (id, status) => {
  try {
    const response = await httpClient.patch('/triviaentries/update-statustriviaentries', { id, status });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update trivia entry status');
  }
};

export const deleteTriviaentries = async (id) => {
  try {
    const response = await httpClient.delete(`/triviaentries/deletetriviaentries/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to delete trivia entry');
  }
};