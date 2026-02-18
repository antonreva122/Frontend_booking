import api from './api';

// Booking API endpoints
export const bookingAPI = {
  // Get all bookings (user's own or all for admin)
  getBookings: async () => {
    const response = await api.get('/bookings/list/');
    return response.data;
  },

  // Get single booking
  getBooking: async (id) => {
    const response = await api.get(`/bookings/list/${id}/`);
    return response.data;
  },

  // Create booking
  createBooking: async (bookingData) => {
    const response = await api.post('/bookings/list/', bookingData);
    return response.data;
  },

  // Update booking
  updateBooking: async (id, bookingData) => {
    const response = await api.put(`/bookings/list/${id}/`, bookingData);
    return response.data;
  },

  // Cancel booking
  cancelBooking: async (id) => {
    const response = await api.post(`/bookings/list/${id}/cancel/`);
    return response.data;
  },

  // Delete booking
  deleteBooking: async (id) => {
    const response = await api.delete(`/bookings/list/${id}/`);
    return response.data;
  },

  // Get upcoming bookings
  getUpcomingBookings: async () => {
    const response = await api.get('/bookings/list/upcoming/');
    return response.data;
  },

  // Get past bookings
  getPastBookings: async () => {
    const response = await api.get('/bookings/list/past/');
    return response.data;
  },

  // Check availability
  checkAvailability: async (resourceId, date) => {
    const response = await api.get('/bookings/availability/', {
      params: { resource_id: resourceId, date },
    });
    return response.data;
  },
};

// Resource API endpoints
export const resourceAPI = {
  // Get all resources
  getResources: async () => {
    const response = await api.get('/bookings/resources/');
    return response.data;
  },

  // Get available resources
  getAvailableResources: async () => {
    const response = await api.get('/bookings/resources/available/');
    return response.data;
  },

  // Get single resource
  getResource: async (id) => {
    const response = await api.get(`/bookings/resources/${id}/`);
    return response.data;
  },

  // Create resource (admin only)
  createResource: async (resourceData) => {
    const response = await api.post('/bookings/resources/', resourceData);
    return response.data;
  },

  // Update resource (admin only)
  updateResource: async (id, resourceData) => {
    const response = await api.put(`/bookings/resources/${id}/`, resourceData);
    return response.data;
  },

  // Delete resource (admin only)
  deleteResource: async (id) => {
    const response = await api.delete(`/bookings/resources/${id}/`);
    return response.data;
  },
};
