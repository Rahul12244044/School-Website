// api.js
import axios from 'axios';
import { store } from '../store/store';
import { showToast } from '../store/slices/uiSlice';

const STRAPI_URL = process.env.REACT_APP_STRAPI_URL || 'http://localhost:1337';
const API_URL = `${STRAPI_URL}/api`;

// Create TWO axios instances: one public, one authenticated
const publicApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

const privateApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Add interceptor only to privateApi
privateApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Common response interceptor for both
const setupResponseInterceptor = (instance) => {
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      const message = error.response?.data?.error?.message || error.message || 'An error occurred';
      
      // Dispatch toast notification
      store.dispatch(showToast({
        message,
        type: 'error',
      }));
      
      return Promise.reject(error);
    }
  );
};

setupResponseInterceptor(publicApi);
setupResponseInterceptor(privateApi);

// Helper functions (same as before)
const buildQuery = (params = {}) => {
  const queryParams = new URLSearchParams();
  
  if (params.populate) {
    queryParams.append('populate', params.populate);
  }
  
  if (params.filters) {
    Object.entries(params.filters).forEach(([key, value]) => {
      queryParams.append(`filters[${key}][$eq]`, value);
    });
  }
  
  if (params.sort) {
    queryParams.append('sort', params.sort);
  }
  
  if (params.pagination) {
    Object.entries(params.pagination).forEach(([key, value]) => {
      queryParams.append(`pagination[${key}]`, value);
    });
  }
  
  const queryString = queryParams.toString();
  return queryString ? `?${queryString}` : '';
};

// PUBLIC API functions - Use publicApi for public endpoints
export const fetchEvents = async (params = {}) => {
  try {
    const query = buildQuery({ populate: 'image', ...params });
    const response = await publicApi.get(`/events${query}`);
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
};

export const fetchNews = async (params = {}) => {
  try {
    const query = buildQuery({ populate: 'image', ...params });
    const response = await publicApi.get(`/news${query}`);
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching news:', error);
    throw error;
  }
};

// In api.js
export const fetchGallery = async (params = {}) => {
  try {
    // Your API endpoint returns data in response.data.data
    const response = await publicApi.get('/galleries?populate=images');
    
    console.log('Gallery API full response:', response.data);
    
    // Based on your data, return response.data.data
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching gallery:', error);
    throw error;
  }
};

// PRIVATE API functions - Use privateApi for authenticated endpoints
// In api.js - Update fetchSingleEvent
export const fetchSingleEvent = async (id) => {
  try {
    const response = await publicApi.get(`/events/${id}?populate=*`);
    console.log('Single event response:', response.data);
    
    // Check response structure
    if (response.data && response.data.data) {
      return response.data.data; // Strapi v4 format
    } else if (response.data) {
      return response.data; // Direct format
    } else {
      throw new Error('Invalid response format');
    }
  } catch (error) {
    console.error(`Error fetching event ${id}:`, error);
    throw error;
  }
};

export const fetchSingleNews = async (id) => {
  try {
    const response = await privateApi.get(`/news/${id}?populate=*`);
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching news ${id}:`, error);
    throw error;
  }
};

// Auth functions
export const login = async (credentials) => {
  try {
    const response = await publicApi.post('/auth/local', credentials);
    localStorage.setItem('token', response.data.jwt);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export { publicApi, privateApi };