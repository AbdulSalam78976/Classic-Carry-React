import { API_URL } from '../config/api.js';

// Helper function for API calls
const apiCall = async (endpoint, options = {}) => {
  const token = localStorage.getItem('adminToken');
  
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  const response = await fetch(`${API_URL}${endpoint}`, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
};

export const reviewAPI = {
  // Admin: Get all reviews
  getAllReviews: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiCall(`/reviews/admin/all${query ? `?${query}` : ''}`);
  },

  // Admin: Toggle review approval
  toggleReviewApproval: async (reviewId, data) => {
    return apiCall(`/reviews/admin/${reviewId}/approval`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Admin: Delete review
  adminDeleteReview: async (reviewId) => {
    return apiCall(`/reviews/admin/${reviewId}`, {
      method: 'DELETE',
    });
  },

  // Get reviews for a product (public)
  getProductReviews: async (productId, params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiCall(`/reviews/product/${productId}${query ? `?${query}` : ''}`);
  }
};