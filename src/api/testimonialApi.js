// src/api/testimonialApi.js
import httpClient from '../config/http/httpClient';

export const addTestimonial = async (formData) => {
  try {
    const response = await httpClient.post('/testimonial/addtestimonial', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to add testimonial');
  }
};

export const getTestimonials = async () => {
  try {
    const response = await httpClient.get('/testimonial/getdatatestimonial');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch testimonials');
  }
};

export const getTestimonialById = async (id) => {
  try {
    const response = await httpClient.get(`/testimonial/gettestimonialsByid/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch testimonial');
  }
};

export const updateTestimonial = async (id, formData) => {
  try {
    const response = await httpClient.patch(`/testimonial/updatetestimonial/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update testimonial');
  }
};

export const deleteTestimonial = async (id) => {
  try {
    const response = await httpClient.delete(`/testimonial/deletetestimonial/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to delete testimonial');
  }
};

export const updateTestimonialStatus = async (id, status) => {
  try {
    const response = await httpClient.patch('/testimonial/update-statustestimonial', { id, status });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update testimonial status');
  }
};