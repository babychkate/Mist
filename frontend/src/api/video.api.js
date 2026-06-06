import axiosInstance from './axiosInstance';

export const fetchVideoRequest = (url) =>
  axiosInstance.post('/video/fetch', { url });