import axiosInstance from './axiosInstance';

export const searchMusicRequest = (q = '') =>
  axiosInstance.get('/music/search', { params: { q } });
