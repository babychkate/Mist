import axiosInstance from './axiosInstance';

export const loginRequest = (credentials) =>
  axiosInstance.post('/auth/login', credentials);

export const logoutRequest = () =>
  axiosInstance.post('/auth/logout');

export const registerRequest = (data) =>
  axiosInstance.post('/auth/register', data);

export const getMeRequest = () =>
  axiosInstance.get('/auth/me');