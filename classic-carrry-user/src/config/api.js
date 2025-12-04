// Centralized API configuration
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// API endpoints
export const API_ENDPOINTS = {
  // Products
  PRODUCTS: `${API_URL}/products`,
  PRODUCT_BY_ID: (id) => `${API_URL}/products/${id}`,
  
  // Categories
  CATEGORIES: `${API_URL}/categories`,
  CATEGORY_BY_SLUG: (slug) => `${API_URL}/categories/slug/${slug}`,
  
  // Orders
  ORDERS: `${API_URL}/orders`,
  MY_ORDERS: `${API_URL}/orders/my-orders`,
  ORDER_BY_ID: (id) => `${API_URL}/orders/${id}`,
  
  // Users
  USERS: `${API_URL}/users`,
  USER_LOGIN: `${API_URL}/users/login`,
  USER_REGISTER: `${API_URL}/users/register`,
  USER_PROFILE: `${API_URL}/users/profile`,
  USER_RESET_PASSWORD: `${API_URL}/users/reset-password`,
  
  // Coupons
  COUPONS: `${API_URL}/coupons`,
  COUPON_VALIDATE: `${API_URL}/coupons/validate`,
  COUPON_CHECK_ACTIVE: `${API_URL}/coupons/check-active`,
  
  // Settings
  SETTINGS_GENERAL: `${API_URL}/settings/general`,
  SETTINGS_APPEARANCE: `${API_URL}/settings/appearance`,
  SETTINGS_CONTACT: `${API_URL}/settings/contact`,
  SETTINGS_FAQS: `${API_URL}/settings/faqs`,
  
  // Hero Images
  HERO_IMAGES: `${API_URL}/hero-images`,
  
  // Contacts
  CONTACTS: `${API_URL}/contacts`,
};

export default API_URL;
