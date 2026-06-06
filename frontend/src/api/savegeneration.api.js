import axiosInstance from './axiosInstance';

export const saveGenerationRequest = (data) =>
  axiosInstance.post('/savegeneration/save', data);
