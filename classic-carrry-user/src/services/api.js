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

// Product APIs
export const productAPI = {
  getAll: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiCall(`/products${query ? `?${query}` : ''}`);
  },
  
  getHot: async () => {
    return apiCall('/products/hot');
  },
  
  getById: async (id) => {
    return apiCall(`/products/${id}`);
  },
  
  getByCategory: async (slug) => {
    return apiCall(`/products/category/${slug}`);
  },
  
  getCategories: async (productType) => {
    return apiCall(`/products/categories/${productType}`);
  },
};

// Category APIs
export const categoryAPI = {
  getAll: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiCall(`/categories${query ? `?${query}` : ''}`);
  },
  
  getFeatured: async () => {
    return apiCall('/categories?isFeatured=true');
  },
  
  getFeaturedWithProducts: async () => {
    return apiCall('/categories/featured/with-products');
  },
  
  getBySlug: async (slug) => {
    return apiCall(`/categories/${slug}`);
  },
};

// Order APIs
export const orderAPI = {
  create: async (orderData) => {
    return apiCall('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  },
  
  getById: async (orderNumber) => {
    return apiCall(`/orders/${orderNumber}`);
  },
  
  getMyOrders: async () => {
    return apiCall('/orders/myorders');
  },
};

// User APIs
export const userAPI = {
  register: async (userData) => {
    return apiCall('/users/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },
  
  login: async (credentials) => {
    return apiCall('/users/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },
  
  getProfile: async () => {
    return apiCall('/users/profile');
  },
  
  updateProfile: async (userData) => {
    return apiCall('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },
};

export default { productAPI, orderAPI, userAPI, categoryAPI };
