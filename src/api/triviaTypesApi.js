// src/api/TriviaTypesApi.js
import httpClient from '../config/http/httpClient';

export const fetchTriviaTypes = async () => {
  try {
    const response = await httpClient.get('/triviaTypes/getdataTriviaTypes');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch trivia types');
  }
};

export const addTriviaTypes = async (category) => {
  try {
    const response = await httpClient.post('/triviaTypes/addTriviaTypes', category);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to add trivia type');
  }
};

export const updateTriviaTypes = async (id, category) => {
  try {
    const response = await httpClient.patch(`/TriviaTypes/updateTriviaTypes/${id}`, category);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update trivia type');
  }
};

export const deleteTriviaTypes = async (id) => {
  try {
    const response = await httpClient.delete(`/TriviaTypes/deleteTriviaTypes/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to delete trivia type');
  }
};

export const getTriviaTypesById = async (id) => {
  try {
    const response = await httpClient.get(`/TriviaTypes/getTriviaTypesByid/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch trivia type');
  }
};

export const updateTriviaTypesStatus = async (id, status) => {
  try {
    const response = await httpClient.patch('/TriviaTypes/update-statuscategory', { id, status });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update trivia type status');
  }
};