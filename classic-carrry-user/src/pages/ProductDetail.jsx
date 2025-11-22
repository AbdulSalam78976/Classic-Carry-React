import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
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
  const [activeTab, setActiveTab] = useState('description');
  const [imageLoading, setImageLoading] = useState(true);

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
    
    const message = quantity > 1 
      ? `${quantity} × ${product.name} added to cart!` 
      : `${product.name} added to cart!`;
    showNotification(message, 'success');
    
    setTimeout(() => {
      setIsAdding(false);
    }, 2000);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    setTimeout(() => {
      navigate('/cart');
    }, 1000);
  };

  if (loading || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#8B7355] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading product details...</p>
        </div>
      </div>
    );
  }

  const images = product.images || [product.mainImage || product.img];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-[#8B7355] transition-colors">Home</Link>
            <i className="fas fa-chevron-right text-xs"></i>
            <Link to="/products" className="hover:text-[#8B7355] transition-colors">Products</Link>
            <i className="fas fa-chevron-right text-xs"></i>
            <span className="text-gray-900 font-medium truncate">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            {/* Image Gallery */}
            <div className="space-y-6">
              {/* Main Image */}
              <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden group">
                <div className="aspect-square relative">
                  {imageLoading && (
                    <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
                      <i className="fas fa-image text-gray-400 text-4xl"></i>
                    </div>
                  )}
                  <img
                    src={getImageUrl(mainImage)}
                    alt={product.name}
                    className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-105 ${
                      imageLoading ? 'opacity-0' : 'opacity-100'
                    }`}
                    onLoad={() => setImageLoading(false)}
                    onError={handleImageError}
                  />
                </div>
                
                {/* Image Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {product.tag && (
                    <span className="bg-[#8B7355] text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                      {product.tag}
                    </span>
                  )}
                  {product.featured && (
                    <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                      Featured
                    </span>
                  )}
                </div>

                {/* Zoom Hint */}
                <div className="absolute bottom-4 right-4 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <i className="fas fa-search-plus text-sm"></i>
                </div>
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                  {images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setMainImage(img)}
                      className={`aspect-square bg-white rounded-2xl shadow-lg overflow-hidden border-2 transition-all duration-300 hover:scale-105 ${
                        mainImage === img 
                          ? 'border-[#8B7355] ring-2 ring-[#8B7355] ring-opacity-30' 
                          : 'border-gray-200 hover:border-[#8B7355]'
                      }`}
                    >
                      <img 
                        src={getImageUrl(img)} 
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={handleImageError}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-8">
              {/* Header */}
              <div className="space-y-4">
                <h1 className="font-display text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                  {product.name}
                </h1>
                
                {/* Price & Stock */}
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="text-4xl font-bold text-[#8B7355]">
                      Rs {formatPrice(product.price)}
                    </div>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <div className="text-lg text-gray-500 line-through">
                        Rs {formatPrice(product.originalPrice)}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-2 rounded-full">
                    <i className="fas fa-check-circle"></i>
                    <span className="font-semibold">In Stock</span>
                  </div>
                </div>
              </div>

              {/* Description Preview */}
              <p className="text-lg text-gray-600 leading-relaxed border-l-4 border-[#8B7355] pl-4">
                {product.shortDescription || product.description || 'Premium quality product from Classic Carry.'}
              </p>

              {/* Color Selection */}
              {product.colors && product.colors.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Color: <span className="text-[#8B7355]">{selectedColor}</span>
                    </h3>
                    <span className="text-sm text-gray-500">{product.colors.length} options</span>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {product.colors.map((color, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedColor(color)}
                        className={`relative w-14 h-14 rounded-full border-3 transition-all duration-300 transform hover:scale-110 ${
                          selectedColor === color
                            ? 'border-[#8B7355] ring-4 ring-[#8B7355] ring-opacity-20 scale-110'
                            : 'border-gray-300 hover:border-[#8B7355]'
                        }`}
                        style={{ backgroundColor: getColorValue(color) }}
                        title={color}
                      >
                        {selectedColor === color && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <i className="fas fa-check text-white text-sm drop-shadow-md"></i>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity & Actions */}
              <div className="space-y-6">
                {/* Quantity Selector */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-900">Quantity</h3>
                  <div className="flex items-center gap-4 max-w-xs">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-14 h-14 flex items-center justify-center rounded-2xl bg-white border-2 border-gray-200 hover:border-[#8B7355] hover:bg-[#8B7355] hover:text-white text-gray-600 transition-all duration-200 font-bold shadow-sm"
                    >
                      <i className="fas fa-minus"></i>
                    </button>
                    <div className="flex-1 text-center">
                      <input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-full h-14 text-center text-xl font-bold bg-white border-2 border-gray-200 text-gray-900 rounded-2xl focus:outline-none focus:border-[#8B7355] focus:ring-2 focus:ring-[#8B7355] focus:ring-opacity-20"
                        min="1"
                      />
                    </div>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-14 h-14 flex items-center justify-center rounded-2xl bg-white border-2 border-gray-200 hover:border-[#8B7355] hover:bg-[#8B7355] hover:text-white text-gray-600 transition-all duration-200 font-bold shadow-sm"
                    >
                      <i className="fas fa-plus"></i>
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    onClick={handleAddToCart}
                    disabled={isAdding}
                    className={`group relative px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 shadow-lg overflow-hidden ${
                      isAdding
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-900 text-white hover:bg-[#8B7355] transform hover:scale-105'
                    }`}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {isAdding ? (
                        <>
                          <i className="fas fa-check"></i>
                          Added!
                        </>
                      ) : (
                        <>
                          <i className="fas fa-shopping-cart"></i>
                          Add to Cart
                        </>
                      )}
                    </span>
                  </button>

                  <button
                    onClick={handleBuyNow}
                    className="px-8 py-4 rounded-2xl font-bold text-lg bg-[#8B7355] text-white hover:bg-[#6B5744] transform hover:scale-105 transition-all duration-300 shadow-lg flex items-center justify-center gap-2"
                  >
                    <i className="fas fa-bolt"></i>
                    Buy Now
                  </button>
                </div>

                {/* Trust Badges */}
                <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200">
                  <div className="text-center">
                    <i className="fas fa-shipping-fast text-2xl text-[#8B7355] mb-2"></i>
                    <p className="text-xs text-gray-600 font-medium">Free Shipping</p>
                  </div>
                  <div className="text-center">
                    <i className="fas fa-shield-alt text-2xl text-[#8B7355] mb-2"></i>
                    <p className="text-xs text-gray-600 font-medium">2-Year Warranty</p>
                  </div>
                  <div className="text-center">
                    <i className="fas fa-undo-alt text-2xl text-[#8B7355] mb-2"></i>
                    <p className="text-xs text-gray-600 font-medium">30-Day Returns</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Details Tabs */}
          <div className="mt-16 bg-white rounded-3xl shadow-xl overflow-hidden">
            {/* Tab Headers */}
            <div className="border-b border-gray-200">
              <nav className="flex flex-wrap">
                {[
                  { id: 'description', label: 'Description', icon: 'fa-file-alt' },
                  { id: 'features', label: 'Features', icon: 'fa-star' },
                  { id: 'specifications', label: 'Specifications', icon: 'fa-list' },
                  { id: 'shipping', label: 'Shipping', icon: 'fa-truck' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-4 font-semibold transition-all duration-300 border-b-2 ${
                      activeTab === tab.id
                        ? 'border-[#8B7355] text-[#8B7355] bg-[#8B7355]/5'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <i className={`fas ${tab.icon}`}></i>
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-8">
              {activeTab === 'description' && (
                <div className="prose prose-lg max-w-none">
                  <p className="text-gray-600 leading-relaxed text-lg">
                    {product.description || 'No description available.'}
                  </p>
                </div>
              )}

              {activeTab === 'features' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {(product.features || ['Premium Quality', 'Durable Material', 'Expert Craftsmanship']).map((feature, index) => (
                    <div key={index} className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                      <i className="fas fa-check-circle text-[#8B7355] text-lg"></i>
                      <span className="text-gray-700 font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'specifications' && (
                <div className="space-y-4">
                  {[
                    { label: 'Material', value: product.material || 'Premium Materials' },
                    { label: 'Dimensions', value: product.dimensions || 'Standard Size' },
                    { label: 'Weight', value: product.weight || 'Lightweight' },
                    { label: 'Care Instructions', value: product.careInstructions || 'Hand wash recommended' }
                  ].map((spec, index) => (
                    <div key={index} className="flex justify-between py-3 border-b border-gray-100">
                      <span className="font-semibold text-gray-600">{spec.label}</span>
                      <span className="text-gray-900">{spec.value}</span>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'shipping' && (
                <div className="space-y-6">
                  <div className="flex items-center gap-4 p-4 bg-green-50 rounded-xl">
                    <i className="fas fa-shipping-fast text-2xl text-green-600"></i>
                    <div>
                      <h4 className="font-semibold text-green-900">Free Shipping</h4>
                      <p className="text-green-700">On orders over Rs 4,000</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 border border-gray-200 rounded-xl">
                      <i className="fas fa-clock text-2xl text-[#8B7355] mb-2"></i>
                      <p className="font-semibold">2-3 Days</p>
                      <p className="text-sm text-gray-600">Standard Delivery</p>
                    </div>
                    <div className="text-center p-4 border border-gray-200 rounded-xl">
                      <i className="fas fa-bolt text-2xl text-[#8B7355] mb-2"></i>
                      <p className="font-semibold">24 Hours</p>
                      <p className="text-sm text-gray-600">Express Delivery</p>
                    </div>
                    <div className="text-center p-4 border border-gray-200 rounded-xl">
                      <i className="fas fa-store text-2xl text-[#8B7355] mb-2"></i>
                      <p className="font-semibold">Pickup</p>
                      <p className="text-sm text-gray-600">From Store</p>
                    </div>
                  </div>
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