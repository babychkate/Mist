import axiosInstance from './axiosInstance';

export const getPlatformsRequest = () =>
  axiosInstance.get('/platform/all');

export const getPlatformFormatsRequest = (platformId) =>
  axiosInstance.get(`/platform/${platformId}/formats`);