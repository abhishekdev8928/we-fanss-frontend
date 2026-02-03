// src/api/timelineApi.js
import httpClient from '../config/http/httpClient';

export const gettimelines = async (id) => {
  try {
    const response = await httpClient.get(`/timeline/getdata/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch timelines');
  }
};

export const addtimeline = async (formData) => {
  try {
    const response = await httpClient.post('/timeline/addtimeline', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to add timeline');
  }
};

export const updatetimeline = async (id, formData) => {
  try {
    const response = await httpClient.patch(`/timeline/updatetimeline/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update timeline');
  }
};

export const deletetimeline = async (id) => {
  try {
    const response = await httpClient.delete(`/timeline/deletetimeline/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to delete timeline');
  }
};

export const updatetimelineStatus = async (id, status) => {
  try {
    const response = await httpClient.patch('/timeline/updateStatus', { id, status });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update timeline status');
  }
};

export const gettimelineById = async (id) => {
  try {
    const response = await httpClient.get(`/timeline/gettimelineByid/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch timeline');
  }
};