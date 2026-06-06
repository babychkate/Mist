import axiosInstance from './axiosInstance';

export const generateImageRequest = (prompt) =>
  axiosInstance.post('/image/generate', { prompt });