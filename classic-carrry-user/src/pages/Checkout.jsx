import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { cartManager } from '../utils/cartManager';
import { formatPrice } from '../utils/helpers';
import { getImageUrl, handleImageError } from '../utils/imageHelper';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import { orderAPI } from '../services/api';

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();
  const { showNotification } = useNotification();
  const [cart, setCart] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    city: '',
    province: '',
    postalCode: '',
    deliveryNotes: ''
  });

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      showNotification('Please login to place an order', 'error');
      navigate('/login', { state: { from: location }, replace: true });
    }
  }, [isAuthenticated, navigate, location, showNotification]);

  // Pre-fill form with user data
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        email: user.email || '',
        firstName: user.name?.split(' ')[0] || '',
        lastName: user.name?.split(' ').slice(1).join(' ') || '',
        phone: user.phone || '',
        address: user.address?.street || '',
        city: user.address?.city || '',
        province: user.address?.province || '',
        postalCode: user.address?.postalCode || ''
      }));
    }
  }, [user]);

  useEffect(() => {
    const loadCart = () => {
      setCart(cartManager.getCart());
      setLoading(false);
    };
    
    loadCart();
    const unsubscribe = cartManager.subscribe((updatedCart) => {
      setCart(updatedCart);
    });
    return unsubscribe;
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleQuantityChange = (productId, newQty) => {
    cartManager.updateQuantity(productId, newQty);
  };

  const handleRemoveItem = (productId) => {
    cartManager.removeFromCart(productId);
  };

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      cartManager.clearCart();
    }
  };

  const handleSubmit = async (e) => {
    if (e) {
      e.preventDefault();
    }
    
    if (!isAuthenticated) {
      showNotification('Please login to place an order', 'error');
      navigate('/login', { state: { from: location } });
      return;
    }

    if (cart.length === 0) {
      showNotification('Your cart is empty', 'error');
      navigate('/');
      return;
    }

    // Validate required fields
    if (!formData.email || !formData.firstName || !formData.lastName || !formData.phone || !formData.address || !formData.city || !formData.province) {
      showNotification('Please fill in all required fields', 'error');
      return;
    }

    setSubmitting(true);

    try {
      const orderData = {
        customer: {
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          province: formData.province,
          postalCode: formData.postalCode || '',
          deliveryNotes: formData.deliveryNotes || ''
        },
        items: cart.map(item => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.qty,
          image: item.img
        })),
        pricing: {
          subtotal: cartManager.getCartTotal(),
          deliveryCharge: cartManager.getDeliveryCharge(),
          total: cartManager.getTotalWithDelivery()
        }
      };

      const response = await orderAPI.create(orderData);
      
      // Handle different response structures
      const orderNumber = response.data?.orderNumber || response.orderNumber || response.data?.order?.orderNumber;
      
      if (orderNumber) {
        localStorage.setItem('lastOrderNumber', orderNumber);
      }
      
      // Clear cart
      cartManager.clearCart();
      
      showNotification('Order placed successfully!', 'success');
      navigate('/order-success');
    } catch (error) {
      console.error('Order creation failed:', error);
      const errorMessage = error.message || error.response?.data?.message || 'Failed to place order. Please try again.';
      showNotification(errorMessage, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const subtotal = cartManager.getCartTotal();
  const deliveryCharge = cartManager.getDeliveryCharge();
  const total = cartManager.getTotalWithDelivery();
  const qualifiesForFreeDelivery = cartManager.qualifiesForFreeDelivery();

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-4xl text-[#8B7355] mb-4"></i>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <i className="fas fa-shopping-cart text-6xl text-gray-300 mb-4"></i>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some products to your cart to checkout</p>
          <Link
            to="/"
            className="inline-block bg-[#8B7355] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#6B5744] transition"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-12 md:py-16">
      <div className="container mx-auto px-4">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
          <p className="text-gray-600">Complete your order</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Left: Cart + Delivery */}
          <div className="lg:col-span-2 space-y-6 md:space-y-8">
            {/* Cart Section */}
            <section className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                  Your Cart ({cartManager.getTotalItems()} items)
                </h2>
              </div>

              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-4 bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <img 
                      src={getImageUrl(item.img)} 
                      alt={item.name} 
                      className="w-20 h-20 object-cover rounded-lg"
                      onError={handleImageError}
                    />
                    <div className="flex-1">
                      <h3 className="text-gray-900 font-semibold mb-1">{item.name}</h3>
                      <p className="text-[#8B7355] font-bold mb-2">Rs {formatPrice(item.price)}</p>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleQuantityChange(item.id, item.qty - 1)}
                          className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded text-gray-700 transition"
                          disabled={item.qty <= 1}
                        >
                          <i className="fas fa-minus text-xs"></i>
                        </button>
                        <span className="text-gray-900 font-semibold w-8 text-center">{item.qty}</span>
                        <button
                          onClick={() => handleQuantityChange(item.id, item.qty + 1)}
                          className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded text-gray-700 transition"
                        >
                          <i className="fas fa-plus text-xs"></i>
                        </button>
                        <span className="text-gray-600 text-sm ml-2">
                          = Rs {formatPrice(item.price * item.qty)}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-red-600 hover:text-red-700 transition p-2"
                      title="Remove item"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200 flex gap-4">
                <button
                  onClick={handleClearCart}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition"
                >
                  <i className="fas fa-trash"></i>
                  Clear Cart
                </button>
                <Link
                  to="/"
                  className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition"
                >
                  <i className="fas fa-plus"></i>
                  Add More Items
                </Link>
              </div>
            </section>

            {/* Delivery Information */}
            <section className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">
                Delivery Information
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#8B7355] focus:outline-none transition"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      required
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#8B7355] focus:outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      required
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#8B7355] focus:outline-none transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#8B7355] focus:outline-none transition"
                    placeholder="+92 316 092 8206"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Address</label>
                  <textarea
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#8B7355] focus:outline-none transition resize-none"
                    placeholder="House/Street, Area, City, Province"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                    <input
                      type="text"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#8B7355] focus:outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Province</label>
                    <select
                      name="province"
                      required
                      value={formData.province}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#8B7355] focus:outline-none transition cursor-pointer bg-white"
                    >
                      <option value="">Select Province</option>
                      <option value="punjab">Punjab</option>
                      <option value="sindh">Sindh</option>
                      <option value="khyber-pakhtunkhwa">Khyber Pakhtunkhwa</option>
                      <option value="balochistan">Balochistan</option>
                      <option value="islamabad">Islamabad Capital Territory</option>
                      <option value="gilgit-baltistan">Gilgit-Baltistan</option>
                      <option value="azad-kashmir">Azad Kashmir</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Postal Code (Optional)</label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#8B7355] focus:outline-none transition"
                    placeholder="12345"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Notes (Optional)</label>
                  <textarea
                    name="deliveryNotes"
                    value={formData.deliveryNotes}
                    onChange={handleInputChange}
                    rows="2"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#8B7355] focus:outline-none transition resize-none"
                    placeholder="Any special delivery instructions..."
                  />
                </div>
              </form>
            </section>
          </div>

          {/* Right: Order Summary */}
          <aside className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-24">
              <h3 className="text-xl font-bold mb-6 text-gray-900">
                Order Summary
              </h3>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold text-gray-900">Rs {formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600 flex items-center gap-2">
                    <i className="fas fa-shipping-fast text-[#8B7355]"></i>
                    Delivery Charge
                  </span>
                  <span className="font-semibold text-gray-900">
                    {qualifiesForFreeDelivery ? (
                      <span className="text-green-600">FREE</span>
                    ) : (
                      `Rs ${formatPrice(deliveryCharge)}`
                    )}
                  </span>
                </div>
                {qualifiesForFreeDelivery && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-green-700 text-sm">
                      <i className="fas fa-gift text-green-600"></i>
                      <span className="font-medium">You qualify for FREE delivery!</span>
                    </div>
                  </div>
                )}
                <div className="flex justify-between items-center py-3 border-t-2 border-gray-300 bg-gray-50 rounded-lg px-4 mt-4">
                  <span className="font-bold text-lg text-gray-900">Total</span>
                  <span className="font-bold text-xl text-[#8B7355]">Rs {formatPrice(total)}</span>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-xs text-gray-600 leading-relaxed mb-2">
                  <i className="fas fa-info-circle text-[#8B7355] mr-2"></i>
                  Delivery charge of Rs 200 applies to orders below Rs 4,000.
                </p>
                <p className="text-xs text-green-700 leading-relaxed">
                  <i className="fas fa-gift text-green-600 mr-2"></i>
                  <strong>FREE delivery</strong> on orders above Rs 4,000!
                </p>
              </div>

              <button
                onClick={handleSubmit}
                disabled={submitting || !isAuthenticated || cart.length === 0}
                className="w-full bg-[#8B7355] hover:bg-[#6B5744] text-white px-5 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <i className="fas fa-shopping-cart"></i>
                    <span>Place Order</span>
                  </>
                )}
              </button>

              <div className="mt-6 space-y-2">
                <div className="flex items-center gap-2 text-gray-600 text-sm">
                  <i className="fas fa-shield-alt text-[#8B7355]"></i>
                  <span>Secure checkout</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 text-sm">
                  <i className="fas fa-lock text-[#8B7355]"></i>
                  <span>Your information is protected</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
