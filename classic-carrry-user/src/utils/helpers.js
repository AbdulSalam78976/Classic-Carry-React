// Utility helper functions
export const formatPrice = (number) => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const getColorValue = (colorName) => {
  const colorMap = {
    'Black': '#000000',
    'Brown': '#8B4513',
    'Navy': '#000080',
    'Navy Blue': '#1e3a8a',
    'Forest Green': '#166534',
    'Burgundy': '#7c2d12',
    'Charcoal': '#374151',
    'Gray': '#6b7280',
    'White': '#ffffff',
    'Blush Pink': '#f9a8d4',
    'Lavender': '#a78bfa',
    'Mint Green': '#6ee7b7',
    'Cream': '#fef3c7',
    'Natural': '#d4a574',
    'Light Brown': '#cd853f',
    'Beige': '#f5f5dc',
    'Black Leather': '#1f2937',
    'Brown Leather': '#92400e',
    'Cognac': '#d97706',
    'Navy Leather': '#1e40af',
    'Pink': '#ec4899',
    'Red': '#ef4444',
    'Blue': '#3b82f6',
    'Silver': '#94a3b8',
    'Gold': '#fbbf24',
    'Olive': '#84cc16',
    'Camo': '#4b5563',
    'Tan': '#d2691e',
    'Khaki': '#c3b091',
    'Rose Gold': '#e0a899'
  };
  return colorMap[colorName] || '#6b7280';
};

export const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};
