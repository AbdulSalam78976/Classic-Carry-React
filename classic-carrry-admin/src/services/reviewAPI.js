import api from './api';

export const reviewAPI = {
  // Admin: Get all reviews
  getAllReviews: (params = {}) => {
    return api.get('/reviews/admin/all', { params });
  },

  // Admin: Toggle review approval
  toggleReviewApproval: (reviewId, data) => {
    return api.put(`/reviews/admin/${reviewId}/approval`, data);
  },

  // Admin: Delete review
  adminDeleteReview: (reviewId) => {
    return api.delete(`/reviews/admin/${reviewId}`);
  },

  // Get reviews for a product (public)
  getProductReviews: (productId, params = {}) => {
    return api.get(`/reviews/product/${productId}`, { params });
  }
};