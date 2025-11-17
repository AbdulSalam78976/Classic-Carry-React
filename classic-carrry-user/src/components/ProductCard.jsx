import { useNavigate } from 'react-router-dom';
import { cartManager } from '../utils/cartManager';
import { formatPrice } from '../utils/helpers';
import { useNotification } from '../contexts/NotificationContext';
import { getImageUrl, handleImageError } from '../utils/imageHelper';
import { useState } from 'react';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    setIsAdding(true);
    cartManager.addToCart(product);
    
    // Show notification
    showNotification(`${product.name} added to cart!`, 'success');
    
    setTimeout(() => {
      setIsAdding(false);
    }, 2000);
  };

  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
  };

  return (
    <div 
      className="card group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl fade-in flex flex-col h-full"
      onClick={handleCardClick}
    >
      {/* Image Container - Fixed Height */}
      <div className="relative overflow-hidden rounded-2xl mb-4 flex-shrink-0">
        <div className="w-full h-72 bg-gray-800">
          <img 
            src={getImageUrl(product.mainImage || product.img)} 
            alt={product.name}
            className="foto w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            onError={handleImageError}
          />
        </div>
        {product.tag && (
          <span className="absolute top-2 left-2 bg-[#D2C1B6] text-gray-900 px-3 py-1 rounded-full text-xs font-semibold shadow-lg z-10">
            {product.tag}
          </span>
        )}
      </div>

      {/* Product Info - Flexible Height */}
      <div className="text-center flex flex-col flex-grow">
        <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-[#D2C1B6] transition-colors duration-300 line-clamp-2 min-h-[3.5rem]">
          {product.name}
        </h3>
        
        <div className="text-xl font-bold text-[#D2C1B6] mb-3 price-text">
          Rs {formatPrice(product.price)}
        </div>

        {/* Add to Cart Button - Always at bottom */}
        <button
          onClick={handleAddToCart}
          disabled={isAdding}
          className={`add-to-cart w-full px-6 py-2 rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md mt-auto ${
            isAdding 
              ? 'bg-green-600 text-white' 
              : 'bg-[#D2C1B6] text-gray-900 hover:bg-[#e2c9b8]'
          }`}
        >
          {isAdding ? '✓ Added to Cart' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
