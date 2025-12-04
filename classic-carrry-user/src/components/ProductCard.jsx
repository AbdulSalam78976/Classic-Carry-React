import { Link } from 'react-router-dom';
import { cartManager } from '../utils/cartManager';
import { useNotification } from '../contexts/NotificationContext';
import { useWishlist } from '../contexts/WishlistContext';
import { getImageUrl, handleImageError } from '../utils/imageHelper';
import { useState } from 'react';

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
    <div className="relative group">
      {/* Sale/Hot Badge */}
      {(product.isHot || product.tag) && (
        <div className="absolute top-2 left-2 z-10">
          <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
            {product.isHot ? 'HOT' : product.tag || 'SALE'}
          </span>
        </div>
      )}
      
      {/* Wishlist Heart */}
      <button
        onClick={handleWishlistToggle}
        className="absolute top-2 right-2 z-10 w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
      >
        <i className={`${isInWishlist(product._id || product.id) ? 'fas' : 'far'} fa-heart text-red-500`}></i>
      </button>
      
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300">
        <Link to={`/product/${product.id || product._id}`}>
          <div className="aspect-square overflow-hidden bg-gray-100">
            <img
              src={getImageUrl(product.mainImage || product.img)}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              onError={handleImageError}
            />
          </div>
        </Link>
        
        <div className="p-3">
          {product.categoryName && (
            <p className="text-gray-500 text-xs mb-1">{product.categoryName}</p>
          )}
          <Link to={`/product/${product.id || product._id}`}>
            <h3 className="text-gray-900 text-sm font-medium mb-2 line-clamp-2 hover:text-[#8B7355] transition">
              {product.name}
            </h3>
          </Link>
          
          {/* Price */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[#8B7355] font-bold">
              Rs {product.price.toLocaleString()}
            </span>
          </div>
          
          {/* Add to Cart Button */}
          <button 
            onClick={handleAddToCart}
            disabled={isAdding}
            className={`w-full bg-[#8B7355] text-white py-2 rounded font-medium hover:bg-[#6B5744] transition text-sm ${
              isAdding ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isAdding ? 'Adding...' : 'Add to cart'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
