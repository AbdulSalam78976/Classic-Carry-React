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
    <div className="group relative bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 h-full flex flex-col border border-gray-100">
      {/* Image Section */}
      <Link to={`/product/${product.id || product._id}`} className="block relative aspect-[4/5] overflow-hidden bg-gray-50">
        <img
          src={getImageUrl(product.mainImage || product.img)}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          onError={handleImageError}
        />

        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        {/* Badges */}
        <div className="absolute top-2 left-2 md:top-3 md:left-3 flex flex-col gap-2 z-10">
          {(product.isHot || product.tag) && (
            <span className={`px-3 py-1 text-xs font-bold rounded-full shadow-lg backdrop-blur-md ${product.isHot
              ? 'bg-red-500/90 text-white'
              : 'bg-white/90 text-gray-900 border border-white/20'
              }`}>
              {product.isHot ? 'HOT' : product.tag || 'SALE'}
            </span>
          )}
        </div>

        {/* Wishlist Button - Floating */}
        <button
          onClick={handleWishlistToggle}
          className="absolute top-2 right-2 md:top-3 md:right-3 z-10 w-7 h-7 md:w-8 md:h-8 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-md shadow-lg hover:bg-white hover:scale-110 transition-all duration-300 group/btn"
        >
          <i className={`${isInWishlist(product._id || product.id) ? 'fas text-red-500' : 'far text-gray-600'} fa-heart group-hover/btn:text-red-500 transition-colors`}></i>
        </button>


      </Link>

      {/* Content Section */}
      <div className="p-3 md:p-4 flex flex-col flex-grow relative bg-white">
        {/* Category */}
        {product.categoryName && (
          <p className="text-primary/80 text-xs font-bold uppercase tracking-wider mb-2">
            {product.categoryName}
          </p>
        )}

        {/* Title */}
        <Link to={`/product/${product.id || product._id}`} className="block mb-2">
          <h3 className="text-gray-900 text-sm md:text-base font-bold leading-tight group-hover:text-primary transition-colors line-clamp-2" title={product.name}>
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <StarRating
            rating={product.averageRating || 0}
            size="sm"
            readonly
          />
          {product.totalReviews > 0 && (
            <span className="text-xs text-gray-400 font-medium">
              ({product.totalReviews})
            </span>
          )}
        </div>

        <div className="mt-auto flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-xs text-gray-400 font-medium">Price</span>
            <span className="text-base md:text-lg font-bold text-gray-900">
              Rs {product.price.toLocaleString()}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isAdding}
            className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center bg-primary text-white rounded-lg md:rounded-xl shadow-lg hover:bg-primary-dark hover:shadow-primary/30 transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-75 disabled:cursor-not-allowed"
            title="Add to Cart"
          >
            {isAdding ? (
              <i className="fas fa-spinner fa-spin"></i>
            ) : (
              <i className="fas fa-plus"></i>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
