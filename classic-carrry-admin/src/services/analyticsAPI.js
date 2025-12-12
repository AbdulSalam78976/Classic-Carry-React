import api from './api';

export const analyticsAPI = {
  // Get dashboard overview stats
  getDashboardStats: () => {
    return api.get('/analytics/dashboard');
  },

  // Get sales analytics
  getSalesAnalytics: (params = {}) => {
    return api.get('/analytics/sales', { params });
  },

  // Get product analytics
  getProductAnalytics: (params = {}) => {
    return api.get('/analytics/products', { params });
  },

  // Get user analytics
  getUserAnalytics: (params = {}) => {
    return api.get('/analytics/users', { params });
  },

  // Get order analytics
  getOrderAnalytics: (params = {}) => {
    return api.get('/analytics/orders', { params });
  },

  // Get revenue analytics
  getRevenueAnalytics: (params = {}) => {
    return api.get('/analytics/revenue', { params });
  },

  // Get category performance
  getCategoryAnalytics: (params = {}) => {
    return api.get('/analytics/categories', { params });
  },

  // Export reports
  exportReport: (type, format, params = {}) => {
    return api.get(`/analytics/export/${type}/${format}`, { 
      params,
      responseType: 'blob'
    });
  }
};