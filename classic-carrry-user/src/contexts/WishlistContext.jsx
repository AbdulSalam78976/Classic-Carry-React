import { createContext, useContext, useState, useEffect } from 'react';
import { wishlistManager } from '../utils/wishlistManager';

const WishlistContext = createContext();

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within WishlistProvider');
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const [wishlistCount, setWishlistCount] = useState(0);

  // Load wishlist on mount
  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = () => {
    const items = wishlistManager.getWishlist();
    setWishlist(items);
    setWishlistCount(items.length);
  };

  const addToWishlist = (product) => {
    const result = wishlistManager.addToWishlist(product);
    if (result.success) {
      loadWishlist();
    }
    return result;
  };

  const removeFromWishlist = (productId) => {
    const result = wishlistManager.removeFromWishlist(productId);
    if (result.success) {
      loadWishlist();
    }
    return result;
  };

  const toggleWishlist = (product) => {
    if (isInWishlist(product._id || product.id)) {
      return removeFromWishlist(product._id || product.id);
    } else {
      return addToWishlist(product);
    }
  };

  const isInWishlist = (productId) => {
    return wishlistManager.isInWishlist(productId);
  };

  const clearWishlist = () => {
    const result = wishlistManager.clearWishlist();
    if (result.success) {
      loadWishlist();
    }
    return result;
  };

  const value = {
    wishlist,
    wishlistCount,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isInWishlist,
    clearWishlist,
    loadWishlist
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

export default WishlistContext;
