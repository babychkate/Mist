import axiosInstance from './axiosInstance';

export const generatePlatformRequest = (data) =>
  axiosInstance.post('/generationplatform/generate', data);

const fetchAsBase64 = async (url) => {
  const response = await fetch(url);
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

export const toBase64 = async (src) => {
  if (src.startsWith('data:')) return src;
  return fetchAsBase64(src);
};