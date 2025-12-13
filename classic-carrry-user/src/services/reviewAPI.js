import API_URL from '../config/api.js';

// Helper function for API calls
const apiCall = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  
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
  // Create a new review
  createReview: async (reviewData) => {
    return apiCall('/reviews', {
      method: 'POST',
      body: JSON.stringify(reviewData),
    });
  },

  // Get reviews for a product
  getProductReviews: async (productId, params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiCall(`/reviews/product/${productId}${query ? `?${query}` : ''}`);
  },

  // Get user's reviews
  getUserReviews: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiCall(`/reviews/user/reviews${query ? `?${query}` : ''}`);
  },

  // Get reviewable products for user
  getReviewableProducts: async () => {
    return apiCall('/reviews/user/reviewable');
  },

  // Update a review
  updateReview: async (reviewId, reviewData) => {
    return apiCall(`/reviews/${reviewId}`, {
      method: 'PUT',
      body: JSON.stringify(reviewData),
    });
  },

  // Delete a review
  deleteReview: async (reviewId) => {
    return apiCall(`/reviews/${reviewId}`, {
      method: 'DELETE',
    });
  }
};