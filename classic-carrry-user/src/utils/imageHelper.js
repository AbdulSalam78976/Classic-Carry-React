/**
 * Image Helper Utility
 * Handles image URLs for backend-served images
 */

/**
 * Get the full image URL from backend
 * @param {string} imagePath - The image path from the database
 * @returns {string} - Full URL to the image
 */
export const getImageUrl = (imagePath) => {
  // If no image path, return placeholder
  if (!imagePath) {
    return '/assets/images/logo.png';
  }

  // If already a full URL, return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  // Get backend URL from environment variable
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const backendUrl = apiUrl.replace('/api', '');

  // Ensure path starts with /
  const path = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;

  return `${backendUrl}${path}`;
};

/**
 * Get multiple image URLs
 * @param {string[]} imagePaths - Array of image paths
 * @returns {string[]} - Array of full URLs
 */
export const getImageUrls = (imagePaths) => {
  if (!Array.isArray(imagePaths)) {
    return [];
  }
  return imagePaths.map(getImageUrl);
};

/**
 * Handle image load error
 * @param {Event} event - The error event
 * @param {string} fallbackUrl - Optional fallback URL
 */
export const handleImageError = (event, fallbackUrl = '/assets/images/logo.png') => {
  event.target.src = fallbackUrl;
  event.target.onerror = null; // Prevent infinite loop
};

export default {
  getImageUrl,
  getImageUrls,
  handleImageError
};
