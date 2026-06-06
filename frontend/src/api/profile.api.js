import axiosInstance from './axiosInstance';

export const getProfileRequest = () =>
  axiosInstance.get('/profile');

export const updateProfileRequest = (data) =>
  axiosInstance.put('/profile', data);

export const changePasswordRequest = (data) =>
  axiosInstance.put('/profile/password', data);

export const updateAvatarRequest = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return axiosInstance.put('/profile/avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const deleteAccountRequest = () =>
  axiosInstance.delete('/profile');