import axiosInstance from './axiosInstance';

export const getTonesRequest = () =>
  axiosInstance.get('/tone/all');