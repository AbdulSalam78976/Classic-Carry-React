import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productAPI } from '../services/api';
import { cartManager } from '../utils/cartManager';
import { formatPrice, getColorValue } from '../utils/helpers';
import { useNotification } from '../contexts/NotificationContext';
import { getImageUrl, handleImageError } from '../utils/imageHelper';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await productAPI.getById(id);
        const foundProduct = response.data;
        setProduct(foundProduct);
        setMainImage(foundProduct.mainImage || foundProduct.img);
        setSelectedColor(foundProduct.colors?.[0] || '');
      } catch (error) {
        console.error('Error fetching product:', error);
        showNotification('Product not found', 'error');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate, showNotification]);

  const handleAddToCart = () => {
    if (!product) return;
    
    setIsAdding(true);
    for (let i = 0; i < quantity; i++) {
      cartManager.addToCart(product);
    }
    
    // Show notification
    const message = quantity > 1 
      ? `${quantity} × ${product.name} added to cart!` 
      : `${product.name} added to cart!`;
    showNotification(message, 'success');
    
    setTimeout(() => {
      setIsAdding(false);
    }, 2000);
  };

  if (loading || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-4xl text-[#D2C1B6] mb-4"></i>
          <p className="text-gray-300">Loading product...</p>
        </div>
      </div>
    );
  }

  const images = product.images || [product.mainImage || product.img];

  return (
    <div className="bg-gray-900 min-h-screen py-8 md:py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Image Gallery */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-2xl shadow-2xl overflow-hidden">
                <img
                  src={getImageUrl(mainImage)}
                  alt={product.name}
                  className="w-full h-96 sm:h-[500px] object-cover cursor-zoom-in transition-all duration-500 hover:scale-110"
                  onError={handleImageError}
                />
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className={`grid grid-cols-${Math.min(images.length, 4)} gap-4`}>
                  {images.slice(0, 4).map((img, index) => (
                    <div
                      key={index}
                      onClick={() => setMainImage(img)}
                      className={`bg-gradient-to-br from-gray-700 to-gray-600 rounded-xl shadow-lg cursor-pointer hover:shadow-xl transition-all duration-300 hover:ring-2 hover:ring-[#D2C1B6] hover:scale-105 ${
                        mainImage === img ? 'ring-2 ring-[#D2C1B6]' : ''
                      }`}
                    >
                      <img 
                        src={getImageUrl(img)} 
                        alt={`${product.name} - View ${index + 1}`} 
                        className="w-full h-24 object-cover rounded-xl"
                        onError={handleImageError}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              {/* Title and Tag */}
              <div className="space-y-3">
                {product.tag && (
                  <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#D2C1B6] text-gray-900 shadow-sm">
                    <i className="fas fa-star mr-2"></i>{product.tag}
                  </div>
                )}
                <h1 className="font-display text-3xl font-bold text-white leading-tight">{product.name}</h1>
              </div>

              {/* Price */}
              <div className="space-y-2">
                <div className="text-4xl font-bold text-[#D2C1B6]">Rs {formatPrice(product.price)}</div>
                <div className="text-sm text-gray-400">
                  <i className="fas fa-truck mr-2"></i>Free shipping on orders over Rs 4,000
                </div>
              </div>

              {/* Stock Status */}
              <div className="flex items-center gap-3">
                <i className="fas fa-check-circle text-green-400 text-lg"></i>
                <span className="font-semibold text-green-400">In Stock</span>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-white">Description</h3>
                <p className="text-gray-300 leading-relaxed text-base">
                  {product.description || 'Premium quality product from Classic Carry.'}
                </p>
              </div>

              {/* Quantity Selector */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-white">Quantity</h3>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 flex items-center justify-center rounded-xl bg-gray-700 hover:bg-[#D2C1B6] hover:text-gray-900 text-gray-200 transition-all duration-200 font-bold shadow-lg"
                  >
                    <i className="fas fa-minus"></i>
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-20 h-12 text-center text-xl font-bold bg-gray-700 text-white border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D2C1B6] focus:border-[#D2C1B6]"
                    min="1"
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-12 h-12 flex items-center justify-center rounded-xl bg-gray-700 hover:bg-[#D2C1B6] hover:text-gray-900 text-gray-200 transition-all duration-200 font-bold shadow-lg"
                  >
                    <i className="fas fa-plus"></i>
                  </button>
                </div>
              </div>

              {/* Color Selection */}
              {product.colors && product.colors.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Color: <span className="text-[#D2C1B6]">{selectedColor}</span></h3>
                  <div className="flex flex-wrap gap-3">
                    {product.colors.map((color, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedColor(color)}
                        className={`w-12 h-12 rounded-full border-3 transition-all duration-200 ${
                          selectedColor === color
                            ? 'border-[#D2C1B6] ring-2 ring-[#D2C1B6] ring-opacity-50 scale-110'
                            : 'border-gray-600 hover:border-[#D2C1B6] hover:scale-105'
                        }`}
                        style={{ backgroundColor: getColorValue(color) }}
                        title={color}
                      >
                        {selectedColor === color && (
                          <i className="fas fa-check text-white text-sm" style={{ textShadow: '0 0 3px rgba(0,0,0,0.8)' }}></i>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={isAdding}
                className={`w-full px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-2xl ${
                  isAdding
                    ? 'bg-green-600 text-white'
                    : 'bg-[#D2C1B6] text-gray-900 hover:bg-[#e2c9b8] transform hover:scale-105'
                }`}
              >
                {isAdding ? (
                  <>
                    <i className="fas fa-check mr-2"></i>
                    Added to Cart!
                  </>
                ) : (
                  <>
                    <i className="fas fa-shopping-cart mr-2"></i>
                    Add to Cart
                  </>
                )}
              </button>

              {/* Features */}
              {product.features && product.features.length > 0 && (
                <div className="space-y-3 bg-gray-800 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Features</h3>
                  <ul className="space-y-2">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-3 text-gray-300">
                        <i className="fas fa-check-circle text-[#D2C1B6]"></i>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
