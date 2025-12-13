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

export const analyticsAPI = {
  // Get dashboard overview stats
  getDashboardStats: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiCall(`/analytics/dashboard${query ? `?${query}` : ''}`);
  },

  // Get sales analytics
  getSalesAnalytics: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiCall(`/analytics/sales${query ? `?${query}` : ''}`);
  },

  // Get product analytics
  getProductAnalytics: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiCall(`/analytics/products${query ? `?${query}` : ''}`);
  },

  // Get user analytics
  getUserAnalytics: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiCall(`/analytics/users${query ? `?${query}` : ''}`);
  },

  // Get order analytics
  getOrderAnalytics: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiCall(`/analytics/orders${query ? `?${query}` : ''}`);
  },

  // Get revenue analytics
  getRevenueAnalytics: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiCall(`/analytics/revenue${query ? `?${query}` : ''}`);
  },

  // Get category performance
  getCategoryAnalytics: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiCall(`/analytics/categories${query ? `?${query}` : ''}`);
  },

  // Export reports
  exportReport: (type, format, params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiCall(`/analytics/export/${type}/${format}${query ? `?${query}` : ''}`, {
      method: 'GET'
    });
  }
};