import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { productAPI } from '../services/api';
import { cartManager } from '../utils/cartManager';
import { formatPrice, getColorValue } from '../utils/helpers';
import { useNotification } from '../contexts/NotificationContext';
import { useSettings } from '../contexts/SettingsContext';
import { getImageUrl, handleImageError } from '../utils/imageHelper';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const { settings } = useSettings();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
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
        setSelectedSize(foundProduct.sizes?.[0] || '');
        
        // Fetch related products from the same category
        if (foundProduct.category) {
          try {
            // Get category ID (it might be an object or just an ID)
            const categoryId = typeof foundProduct.category === 'object' 
              ? foundProduct.category._id 
              : foundProduct.category;
            
            console.log('Fetching related products for category:', categoryId);
            
            // Fetch all products and filter by category
            const allProductsResponse = await productAPI.getAll();
            console.log('All products:', allProductsResponse.data?.length);
            
            const related = (allProductsResponse.data || [])
              .filter(p => {
                const pCategoryId = typeof p.category === 'object' ? p.category._id : p.category;
                return pCategoryId === categoryId && p._id !== foundProduct._id;
              })
              .slice(0, 4); // Limit to 4 products
            
            console.log('Related products found:', related.length);
            setRelatedProducts(related);
          } catch (err) {
            console.error('Error fetching related products:', err);
          }
        } else {
          console.log('No category found for product');
        }
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
    
    // Create product with selected options
    const productWithOptions = {
      ...product,
      selectedColor,
      selectedSize
    };
    
    setIsAdding(true);
    for (let i = 0; i < quantity; i++) {
      cartManager.addToCart(productWithOptions);
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
      navigate('/checkout');
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
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center space-x-2 text-xs text-gray-600">
            <Link to="/" className="hover:text-[#8B7355] transition-colors">Home</Link>
            <i className="fas fa-chevron-right text-xs"></i>
            {(product.category?.name || product.categoryName) && (
              <>
                <Link 
                  to={`/category/${product.category?.slug || product.categorySlug || (product.category?.name || product.categoryName).toLowerCase().replace(/\s+/g, '-')}`} 
                  className="hover:text-[#8B7355] transition-colors"
                >
                  {product.category?.name || product.categoryName}
                </Link>
                <i className="fas fa-chevron-right text-xs"></i>
              </>
            )}
            <span className="text-gray-900 font-medium truncate">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            {/* Image Gallery */}
            <div className="space-y-4 lg:max-w-md mx-auto">
              {/* Main Image */}
              <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden group">
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
              <div className="space-y-3">
                <h1 className="font-display text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">
                  {product.name}
                </h1>
                
                {/* Price & Stock */}
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="text-3xl font-bold text-[#8B7355]">
                      Rs {formatPrice(product.price)}
                    </div>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <div className="text-lg text-gray-500 line-through">
                        Rs {formatPrice(product.originalPrice)}
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-2 rounded-full">
                      <i className="fas fa-check-circle"></i>
                      <span className="font-semibold">In Stock</span>
                    </div>
                    <div className="text-sm text-gray-600 text-right">
                      <span className="font-semibold text-gray-900">{product.stock || 0}</span> units available
                    </div>
                  </div>
                </div>
              </div>

              {/* Description Preview */}
              <p className="text-base text-gray-600 leading-relaxed border-l-4 border-[#8B7355] pl-4">
                {product.shortDescription || product.description || `Premium quality product from ${settings.appearance.siteName}.`}
              </p>

              {/* Color Selection */}
              {product.colors && product.colors.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-semibold text-gray-900">
                      Color: <span className="text-[#8B7355]">{selectedColor}</span>
                    </h3>
                    <span className="text-xs text-gray-500">{product.colors.length} options</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((color, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedColor(color)}
                        className={`relative w-12 h-12 rounded-full border-3 transition-all duration-300 transform hover:scale-110 ${
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

              {/* Size Selection */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-semibold text-gray-900">
                      Size: <span className="text-[#8B7355]">{selectedSize}</span>
                    </h3>
                    <span className="text-xs text-gray-500">{product.sizes.length} options</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 rounded-lg border-2 font-semibold transition-all duration-300 transform hover:scale-105 ${
                          selectedSize === size
                            ? 'border-[#8B7355] bg-[#8B7355] text-white'
                            : 'border-gray-300 bg-white text-gray-700 hover:border-[#8B7355]'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity & Actions */}
              <div className="space-y-4">
                {/* Quantity Selector */}
                <div className="space-y-2">
                  <h3 className="text-base font-semibold text-gray-900">Quantity</h3>
                  <div className="flex items-center gap-3 max-w-xs">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 flex items-center justify-center rounded-lg bg-white border-2 border-gray-200 hover:border-[#8B7355] hover:bg-[#8B7355] hover:text-white text-gray-600 transition-all duration-200 font-bold shadow-sm"
                    >
                      <i className="fas fa-minus text-sm"></i>
                    </button>
                    <div className="flex-1 text-center">
                      <input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-full h-10 text-center text-lg font-bold bg-white border-2 border-gray-200 text-gray-900 rounded-lg focus:outline-none focus:border-[#8B7355] focus:ring-2 focus:ring-[#8B7355] focus:ring-opacity-20"
                        min="1"
                      />
                    </div>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 flex items-center justify-center rounded-lg bg-white border-2 border-gray-200 hover:border-[#8B7355] hover:bg-[#8B7355] hover:text-white text-gray-600 transition-all duration-200 font-bold shadow-sm"
                    >
                      <i className="fas fa-plus text-sm"></i>
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={handleAddToCart}
                    disabled={isAdding}
                    className={`group relative px-6 py-3 rounded-xl font-bold text-base transition-all duration-300 shadow-lg overflow-hidden ${
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
                    className="px-6 py-3 rounded-xl font-bold text-base bg-[#8B7355] text-white hover:bg-[#6B5744] transform hover:scale-105 transition-all duration-300 shadow-lg flex items-center justify-center gap-2"
                  >
                    <i className="fas fa-bolt"></i>
                    Buy Now
                  </button>
                </div>


              </div>
            </div>
          </div>

          {/* Product Features */}
          <div className="mt-8 bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Header */}
            <div className="border-b border-gray-200 px-6 py-4">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <i className="fas fa-star text-[#8B7355]"></i>
                Product Features
              </h2>
            </div>

            {/* Features Content */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(product.features || ['Premium Quality', 'Durable Material', 'Expert Craftsmanship']).map((feature, index) => (
                  <div key={index} className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                    <i className="fas fa-check-circle text-[#8B7355] text-lg"></i>
                    <span className="text-gray-700 font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mt-12">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">You May Also Like</h2>
                  <p className="text-sm text-gray-600">Similar products from the same category</p>
                </div>
                {product.categorySlug && (
                  <Link 
                    to={`/category/${product.categorySlug}`}
                    className="text-[#8B7355] hover:text-[#6B5744] font-semibold flex items-center gap-2"
                  >
                    View All
                    <i className="fas fa-arrow-right"></i>
                  </Link>
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {relatedProducts.map((relatedProduct) => (
                  <Link
                    key={relatedProduct._id}
                    to={`/product/${relatedProduct._id}`}
                    className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                  >
                    <div className="aspect-square overflow-hidden bg-gray-100">
                      <img
                        src={getImageUrl(relatedProduct.mainImage || relatedProduct.img)}
                        alt={relatedProduct.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        onError={handleImageError}
                      />
                    </div>
                    <div className="p-4">
                      <p className="text-gray-500 text-xs mb-1">{relatedProduct.categoryName}</p>
                      <h3 className="text-gray-900 font-semibold mb-2 line-clamp-2 group-hover:text-[#8B7355] transition">
                        {relatedProduct.name}
                      </h3>
                      <div className="flex items-center justify-between">
                        <span className="text-[#8B7355] font-bold text-lg">
                          Rs {formatPrice(relatedProduct.price)}
                        </span>
                        <i className="fas fa-arrow-right text-[#8B7355] opacity-0 group-hover:opacity-100 transition-opacity"></i>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;