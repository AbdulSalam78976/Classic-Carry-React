import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { cartManager } from '../utils/cartManager';
import { formatPrice } from '../utils/helpers';
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
    setCart(cartManager.getCart());
    const unsubscribe = cartManager.subscribe((updatedCart) => {
      setCart(updatedCart);
    });
    return unsubscribe;
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
    e.preventDefault();
    
    if (!isAuthenticated) {
      showNotification('Please login to place an order', 'error');
      navigate('/login', { state: { from: location } });
      return;
    }

    if (cart.length === 0) {
      showNotification('Your cart is empty', 'error');
      return;
    }

    setSubmitting(true);

    try {
      const orderData = {
        customer: formData,
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
      
      // Save order number for confirmation page
      localStorage.setItem('lastOrderNumber', response.data.orderNumber);
      
      // Clear cart
      cartManager.clearCart();
      
      showNotification('Order placed successfully!', 'success');
      navigate('/order-success');
    } catch (error) {
      console.error('Order creation failed:', error);
      showNotification(error.message || 'Failed to place order. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const subtotal = cartManager.getCartTotal();
  const deliveryCharge = cartManager.getDeliveryCharge();
  const total = cartManager.getTotalWithDelivery();
  const qualifiesForFreeDelivery = cartManager.qualifiesForFreeDelivery();

  return (
    <div className="bg-gray-900 min-h-screen py-8 md:py-12">
      <div className="container mx-auto px-4">
        {/* Page Title */}
        <div className="text-center mb-8 md:mb-12">
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3">Checkout</h1>
          <p className="text-gray-400 text-lg">Complete your order in just a few steps</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Left: Cart + Delivery */}
          <div className="lg:col-span-2 space-y-6 md:space-y-8">
            {/* Cart Section */}
            <section className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8 border border-gray-700">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <h2 className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-[#D2C1B6] to-amber-200 rounded-lg flex items-center justify-center">
                    <i className="fas fa-shopping-bag text-gray-900 text-sm sm:text-base"></i>
                  </div>
                  Your Cart
                </h2>
                <div className="bg-[#D2C1B6] text-gray-900 px-3 py-2 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-bold shadow-lg self-start sm:self-auto">
                  {cartManager.getTotalItems()} items
                </div>
              </div>

              {cart.length === 0 ? (
                <div className="text-center py-8 sm:py-12 md:py-16">
                  <div className="bg-gradient-to-br from-gray-700 to-gray-600 rounded-full w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 flex items-center justify-center mx-auto mb-4 sm:mb-6">
                    <i className="fas fa-shopping-cart text-2xl sm:text-3xl md:text-4xl text-gray-400"></i>
                  </div>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-300 mb-2 sm:mb-3 px-4">Your cart is empty</h3>
                  <p className="text-gray-400 mb-6 sm:mb-8 max-w-md mx-auto leading-relaxed text-sm sm:text-base px-4">
                    Looks like you haven't added any products yet. Browse our collection and add some amazing items!
                  </p>
                  <Link
                    to="/"
                    className="inline-flex items-center gap-2 bg-[#D2C1B6] text-gray-900 px-4 sm:px-6 md:px-8 py-3 md:py-4 rounded-xl font-semibold shadow-lg text-sm sm:text-base transition-all duration-300 hover:scale-105"
                  >
                    <i className="fas fa-arrow-left text-sm"></i>
                    Continue Shopping
                  </Link>
                </div>
              ) : (
                <>
                  <div className="space-y-3 sm:space-y-4">
                    {cart.map((item) => (
                      <div key={item.id} className="flex gap-4 bg-gray-700/30 rounded-xl p-4 border border-gray-600 hover:border-[#D2C1B6] transition-all">
                        <img src={item.img} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
                        <div className="flex-1">
                          <h3 className="text-white font-semibold mb-2">{item.name}</h3>
                          <p className="text-[#D2C1B6] font-bold">Rs {formatPrice(item.price)}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <button
                              onClick={() => handleQuantityChange(item.id, item.qty - 1)}
                              className="w-8 h-8 bg-gray-600 hover:bg-[#D2C1B6] hover:text-gray-900 rounded text-white transition"
                            >
                              <i className="fas fa-minus text-xs"></i>
                            </button>
                            <span className="text-white font-semibold w-8 text-center">{item.qty}</span>
                            <button
                              onClick={() => handleQuantityChange(item.id, item.qty + 1)}
                              className="w-8 h-8 bg-gray-600 hover:bg-[#D2C1B6] hover:text-gray-900 rounded text-white transition"
                            >
                              <i className="fas fa-plus text-xs"></i>
                            </button>
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-red-400 hover:text-red-300 transition"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-700 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <button
                      onClick={handleClearCart}
                      className="flex items-center justify-center gap-2 px-4 py-3 sm:px-6 sm:py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold text-sm sm:text-base transition-all duration-300 hover:scale-105"
                    >
                      <i className="fas fa-trash text-sm"></i>
                      Clear Cart
                    </button>
                    <Link
                      to="/"
                      className="flex items-center justify-center gap-2 px-4 py-3 sm:px-6 sm:py-3 bg-gray-700 text-gray-200 rounded-xl hover:bg-gray-600 transition-all duration-300 font-semibold text-sm sm:text-base hover:scale-105"
                    >
                      <i className="fas fa-plus text-sm"></i>
                      Add More Items
                    </Link>
                  </div>
                </>
              )}
            </section>

            {/* Delivery Information */}
            {cart.length > 0 && (
              <section className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8 border border-gray-700">
                <h2 className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-white mb-4 sm:mb-6 flex items-center gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center">
                    <i className="fas fa-truck text-white text-sm sm:text-base"></i>
                  </div>
                  Delivery Information
                </h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg bg-gray-700 text-gray-100 border-2 border-gray-600 focus:border-[#D2C1B6] focus:outline-none transition"
                      placeholder="your.email@example.com"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">First Name</label>
                      <input
                        type="text"
                        name="firstName"
                        required
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg bg-gray-700 text-gray-100 border-2 border-gray-600 focus:border-[#D2C1B6] focus:outline-none transition"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">Last Name</label>
                      <input
                        type="text"
                        name="lastName"
                        required
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg bg-gray-700 text-gray-100 border-2 border-gray-600 focus:border-[#D2C1B6] focus:outline-none transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg bg-gray-700 text-gray-100 border-2 border-gray-600 focus:border-[#D2C1B6] focus:outline-none transition"
                      placeholder="+92 316 092 8206"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Full Address</label>
                    <textarea
                      name="address"
                      required
                      value={formData.address}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-4 py-3 rounded-lg bg-gray-700 text-gray-100 border-2 border-gray-600 focus:border-[#D2C1B6] focus:outline-none transition resize-none"
                      placeholder="House/Street, Area, City, Province"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">City</label>
                      <input
                        type="text"
                        name="city"
                        required
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg bg-gray-700 text-gray-100 border-2 border-gray-600 focus:border-[#D2C1B6] focus:outline-none transition"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">Province</label>
                      <select
                        name="province"
                        required
                        value={formData.province}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg bg-gray-700 text-gray-100 border-2 border-gray-600 focus:border-[#D2C1B6] focus:outline-none transition cursor-pointer"
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
                </form>
              </section>
            )}
          </div>

          {/* Right: Order Summary */}
          {cart.length > 0 && (
            <aside className="lg:col-span-1">
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl p-6 md:p-8 sticky top-24 border border-gray-700">
                <h3 className="font-display text-2xl font-bold mb-6 text-white flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-700 rounded-lg flex items-center justify-center">
                    <i className="fas fa-receipt text-white"></i>
                  </div>
                  Order Summary
                </h3>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center text-gray-300 py-3 border-b border-gray-700">
                    <span className="font-medium">Subtotal</span>
                    <span className="font-bold text-white text-lg">Rs {formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between items-center text-gray-300 py-3 border-b border-gray-700">
                    <span className="flex items-center gap-2">
                      <i className="fas fa-shipping-fast text-[#D2C1B6]"></i>
                      Delivery Charge
                    </span>
                    <span className="font-bold text-white text-lg">
                      {qualifiesForFreeDelivery ? 'FREE' : `Rs ${formatPrice(deliveryCharge)}`}
                    </span>
                  </div>
                  {qualifiesForFreeDelivery && (
                    <div className="bg-gradient-to-r from-green-600/20 to-green-700/20 border border-green-500/30 rounded-lg p-3">
                      <div className="flex items-center gap-2 text-green-300 text-sm">
                        <i className="fas fa-gift text-green-400"></i>
                        <span className="font-semibold">Congratulations! You qualify for FREE delivery!</span>
                      </div>
                    </div>
                  )}
                  <div className="flex justify-between items-center text-white py-3 border-t border-gray-600 bg-gray-700/30 rounded-lg px-4">
                    <span className="font-bold text-lg">Total</span>
                    <span className="font-bold text-xl text-[#D2C1B6]">Rs {formatPrice(total)}</span>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-gray-700/50 to-gray-600/50 rounded-lg p-4 mb-6">
                  <p className="text-xs text-gray-300 leading-relaxed flex items-start gap-2 mb-2">
                    <i className="fas fa-info-circle text-[#D2C1B6] mt-0.5"></i>
                    <span>Delivery charge of Rs 200 applies to orders below Rs 4,000.</span>
                  </p>
                  <p className="text-xs text-green-300 leading-relaxed flex items-start gap-2">
                    <i className="fas fa-gift text-green-400 mt-0.5"></i>
                    <span><strong>FREE delivery</strong> on orders above Rs 4,000!</span>
                  </p>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={submitting || !isAuthenticated}
                  className="w-full bg-green-600 hover:bg-green-700 text-white px-5 py-4 rounded-xl font-bold flex items-center justify-center gap-3 shadow-2xl text-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <i className="fas fa-spinner fa-spin text-xl"></i>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <i className="fas fa-shopping-cart text-xl"></i>
                      <span>Place Order</span>
                    </>
                  )}
                </button>

                <div className="mt-6 space-y-3">
                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <i className="fas fa-shield-alt text-[#D2C1B6]"></i>
                    <span>Secure checkout</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <i className="fas fa-lock text-[#D2C1B6]"></i>
                    <span>Your information is protected</span>
                  </div>
                </div>
              </div>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
};

export default Checkout;
