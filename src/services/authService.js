import api from './api';

// Auth API endpoints
export const authAPI = {
  // Register new user
  register: async (userData) => {
    const response = await api.post('/users/register/', userData);
    return response.data;
  },

  // Login user
  login: async (email, password) => {
    const response = await api.post('/users/login/', { email, password });
    return response.data;
  },

  // Logout user
  logout: async (refreshToken) => {
    const response = await api.post('/users/logout/', { refresh_token: refreshToken });
    return response.data;
  },

  // Get user profile
  getProfile: async () => {
    const response = await api.get('/users/profile/');
    return response.data;
  },

  // Update user profile
  updateProfile: async (userData) => {
    const response = await api.put('/users/profile/update/', userData);
    return response.data;
  },

  // Change password
  changePassword: async (passwordData) => {
    const response = await api.post('/users/password/change/', passwordData);
    return response.data;
  },

  // Request password reset
  requestPasswordReset: async (email) => {
    const response = await api.post('/users/password/reset/', { email });
    return response.data;
  },

  // Confirm password reset
  confirmPasswordReset: async (token, newPassword, newPassword2) => {
    const response = await api.post('/users/password/reset/confirm/', {
      token,
      new_password: newPassword,
      new_password2: newPassword2,
    });
    return response.data;
  },

  // Upload profile image
  uploadProfileImage: async (formData) => {
    const response = await api.post('/users/profile/image/upload/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Delete profile image
  deleteProfileImage: async () => {
    const response = await api.delete('/users/profile/image/delete/');
    return response.data;
  },
};
