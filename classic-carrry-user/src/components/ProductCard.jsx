import { Link } from 'react-router-dom';
import { cartManager } from '../utils/cartManager';
import { useNotification } from '../contexts/NotificationContext';
import { useWishlist } from '../contexts/WishlistContext';
import { getImageUrl, handleImageError } from '../utils/imageHelper';
import { useState } from 'react';
import StarRating from './StarRating';

const ProductCard = ({ product }) => {
  // Safety check
  if (!product) {
    console.error('ProductCard received null/undefined product');
    return <div className="p-4 border border-red-300">Error: No product data</div>;
  }
  
  if (!product.name || !product.price) {
    console.error('ProductCard received invalid product:', product);
    return <div className="p-4 border border-red-300">Error: Invalid product data</div>;
  }
  
  const { showNotification } = useNotification();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdding(true);
    cartManager.addToCart(product);
    
    // Show notification
    showNotification(`${product.name} added to cart!`, 'success');
    
    setTimeout(() => {
      setIsAdding(false);
    }, 2000);
  };

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const result = toggleWishlist(product);
    if (result.success) {
      showNotification(result.message, 'success');
    }
  };

  return (
    <div className="product-card relative group h-full border-10">
      {/* Sale/Hot Badge */}
      {(product.isHot || product.tag) && (
        <div className="absolute top-3 left-3 z-10">
          <span className="product-badge">
            {product.isHot ? 'HOT' : product.tag || 'SALE'}
          </span>
        </div>
      )}
      
      {/* Wishlist Heart */}
      <button
        onClick={handleWishlistToggle}
        className="wishlist-btn absolute top-3 right-3 z-10"
      >
        <i className={`${isInWishlist(product._id || product.id) ? 'fas' : 'far'} fa-heart text-red-500`}></i>
      </button>
      
      {/* Product Card with Fixed Height */}
      <div className="product-border bg-white overflow-hidden h-full flex flex-col">
        {/* Image Section - Fixed Height */}
        <Link to={`/product/${product.id || product._id}`} className="block">
          <div className="aspect-square overflow-hidden bg-gray-100 relative">
            <img
              src={getImageUrl(product.mainImage || product.img)}
              alt={product.name}
              className="product-image group-hover:scale-105 transition-transform duration-500"
              onError={handleImageError}
            />
            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300"></div>
          </div>
        </Link>
        
        {/* Content Section - Flexible Height */}
        <div className="p-4 flex flex-col flex-grow">
          {/* Category */}
          {product.categoryName && (
            <p className="text-gray-500 text-xs mb-2 uppercase tracking-wide font-medium">
              {product.categoryName}
            </p>
          )}
          
          {/* Product Name - Fixed Height */}
          <Link to={`/product/${product.id || product._id}`} className="block mb-3">
            <h3 className="text-gray-900 text-sm font-semibold leading-tight hover:text-[#8B7355] transition-colors duration-200 h-10 overflow-hidden">
              <span className="line-clamp-2">
                {product.name}
              </span>
            </h3>
          </Link>
          
          {/* Rating Section - Fixed Height */}
          <div className="mb-3 h-5 flex items-center">
            {product.totalReviews > 0 ? (
              <div className="flex items-center gap-2">
                <StarRating 
                  rating={product.averageRating || 0} 
                  size="sm" 
                  readonly 
                />
                <span className="text-xs text-gray-500 font-medium">
                  ({product.totalReviews})
                </span>
              </div>
            ) : (
              <div className="text-xs text-gray-400">No reviews yet</div>
            )}
          </div>
          
          {/* Price Section */}
          <div className="mb-4 flex-grow flex items-end">
            <span className="product-price">
              Rs {product.price.toLocaleString()}
            </span>
          </div>
          
          {/* Add to Cart Button - Fixed at Bottom */}
          <button 
            onClick={handleAddToCart}
            disabled={isAdding}
            className={`product-btn ${isAdding ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isAdding ? (
              <span className="flex items-center justify-center gap-2">
                <i className="fas fa-spinner fa-spin"></i>
                Adding...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <i className="fas fa-shopping-cart"></i>
                Add to Cart
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
