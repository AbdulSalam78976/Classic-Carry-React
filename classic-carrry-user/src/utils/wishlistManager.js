// Wishlist Manager - Local Storage Based
const WISHLIST_KEY = 'classiccarrry_wishlist';

export const wishlistManager = {
  // Get all wishlist items
  getWishlist: () => {
    try {
      const wishlist = localStorage.getItem(WISHLIST_KEY);
      return wishlist ? JSON.parse(wishlist) : [];
    } catch (error) {
      console.error('Error reading wishlist:', error);
      return [];
    }
  },

  // Add item to wishlist
  addToWishlist: (product) => {
    try {
      const wishlist = wishlistManager.getWishlist();
      
      // Check if product already exists
      const exists = wishlist.some(item => item._id === product._id || item.id === product.id);
      
      if (!exists) {
        wishlist.push({
          _id: product._id,
          id: product.id,
          name: product.name,
          price: product.price,
          mainImage: product.mainImage,
          categoryName: product.categoryName,
          addedAt: new Date().toISOString()
        });
        
        localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
        return { success: true, message: 'Added to wishlist' };
      }
      
      return { success: false, message: 'Already in wishlist' };
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      return { success: false, message: 'Failed to add to wishlist' };
    }
  },

  // Remove item from wishlist
  removeFromWishlist: (productId) => {
    try {
      let wishlist = wishlistManager.getWishlist();
      wishlist = wishlist.filter(item => item._id !== productId && item.id !== productId);
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
      return { success: true, message: 'Removed from wishlist' };
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      return { success: false, message: 'Failed to remove from wishlist' };
    }
  },

  // Check if item is in wishlist
  isInWishlist: (productId) => {
    const wishlist = wishlistManager.getWishlist();
    return wishlist.some(item => item._id === productId || item.id === productId);
  },

  // Get wishlist count
  getWishlistCount: () => {
    return wishlistManager.getWishlist().length;
  },

  // Clear entire wishlist
  clearWishlist: () => {
    try {
      localStorage.removeItem(WISHLIST_KEY);
      return { success: true, message: 'Wishlist cleared' };
    } catch (error) {
      console.error('Error clearing wishlist:', error);
      return { success: false, message: 'Failed to clear wishlist' };
    }
  }
};

export default wishlistManager;
