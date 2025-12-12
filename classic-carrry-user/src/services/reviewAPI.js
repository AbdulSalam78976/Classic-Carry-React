import api from './api';

export const reviewAPI = {
  // Create a new review
  createReview: (reviewData) => {
    return api.post('/reviews', reviewData);
  },

  // Get reviews for a product
  getProductReviews: (productId, params = {}) => {
    return api.get(`/reviews/product/${productId}`, { params });
  },

  // Get user's reviews
  getUserReviews: (params = {}) => {
    return api.get('/reviews/user/reviews', { params });
  },

  // Get reviewable products for user
  getReviewableProducts: () => {
    return api.get('/reviews/user/reviewable');
  },

  // Update a review
  updateReview: (reviewId, reviewData) => {
    return api.put(`/reviews/${reviewId}`, reviewData);
  },

  // Delete a review
  deleteReview: (reviewId) => {
    return api.delete(`/reviews/${reviewId}`);
  }
};