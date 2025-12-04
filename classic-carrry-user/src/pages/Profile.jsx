import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import { orderAPI, userAPI } from '../services/api';
import { Link } from 'react-router-dom';

const Profile = () => {
  const { user, updateUser, loading: authLoading } = useAuth();
  const { showNotification } = useNotification();
  const [activeTab, setActiveTab] = useState('profile');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'Pakistan'
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        street: user.address?.street || '',
        city: user.address?.city || '',
        state: user.address?.state || '',
        postalCode: user.address?.postalCode || '',
        country: user.address?.country || 'Pakistan'
      });
    }
  }, [user]);

  useEffect(() => {
    if (activeTab === 'orders') {
      fetchOrders();
    }
  }, [activeTab]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await orderAPI.getMyOrders();
      setOrders(response.data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      showNotification('Failed to load orders', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const updateData = {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        address: {
          street: formData.street.trim(),
          city: formData.city.trim(),
          state: formData.state.trim(),
          postalCode: formData.postalCode.trim(),
          country: formData.country.trim()
        }
      };

      const response = await userAPI.updateProfile(updateData);
      if (response.success) {
        updateUser(response.data);
        showNotification('Profile updated successfully!', 'success');
      } else {
        showNotification(response.message || 'Failed to update profile', 'error');
      }
    } catch (error) {
      showNotification(error.message || 'Failed to update profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered': return 'fa-check-circle';
      case 'processing': return 'fa-cog';
      case 'shipped': return 'fa-shipping-fast';
      case 'pending': return 'fa-clock';
      case 'cancelled': return 'fa-times-circle';
      default: return 'fa-info-circle';
    }
  };

  // Show loading state while user data is being fetched
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#8B7355] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            My Account
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Manage your profile, track orders, and update your preferences
          </p>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-6 sticky top-24">
                {/* User Info */}
                <div className="text-center mb-6 pb-6 border-b border-gray-200">
                  <div className="w-20 h-20 bg-gradient-to-br from-[#8B7355] to-[#A68A6F] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <i className="fas fa-user text-white text-2xl"></i>
                  </div>
                  <h3 className="text-gray-900 font-semibold text-lg mb-1">{user?.name}</h3>
                  <p className="text-gray-500 text-sm">{user?.email}</p>
                  <div className="mt-2 inline-flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                    <i className="fas fa-check-circle text-xs"></i>
                    Verified Account
                  </div>
                </div>

                {/* Navigation */}
                <nav className="space-y-2">
                  {[
                    { id: 'profile', label: 'Profile', icon: 'fa-user', color: 'from-blue-500 to-blue-600' },
                    { id: 'orders', label: 'My Orders', icon: 'fa-shopping-bag', color: 'from-green-500 to-green-600' },
                    { id: 'address', label: 'Delivery Address', icon: 'fa-map-marker-alt', color: 'from-purple-500 to-purple-600' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full text-left px-4 py-4 rounded-xl transition-all duration-300 group ${
                        activeTab === tab.id
                          ? 'bg-gradient-to-r text-white shadow-lg transform scale-105'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:shadow-md'
                      } ${activeTab === tab.id ? tab.color : ''}`}
                    >
                      <div className="flex items-center">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 transition-all duration-300 ${
                          activeTab === tab.id 
                            ? 'bg-white/20' 
                            : 'bg-gray-100 group-hover:bg-gray-200'
                        }`}>
                          <i className={`fas ${tab.icon} ${activeTab === tab.id ? 'text-white' : 'text-gray-500 group-hover:text-gray-700'}`}></i>
                        </div>
                        <span className="font-medium">{tab.label}</span>
                      </div>
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
                {/* Profile Information Tab */}
                {activeTab === 'profile' && (
                  <div className="p-8">
                    <div className="flex items-center justify-between mb-8">
                      <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Profile Information</h2>
                        <p className="text-gray-600">Update your personal details and contact information</p>
                      </div>
                      <div className="w-12 h-12 bg-gradient-to-br from-[#8B7355] to-[#A68A6F] rounded-xl flex items-center justify-center shadow-lg">
                        <i className="fas fa-user-edit text-white text-lg"></i>
                      </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            <i className="fas fa-user mr-2 text-[#8B7355]"></i>
                            Full Name *
                          </label>
                          <input
                            type="text"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-4 py-4 rounded-xl bg-gray-50 text-gray-900 border-2 border-gray-200 focus:border-[#8B7355] focus:bg-white focus:ring-2 focus:ring-[#8B7355] focus:ring-opacity-20 focus:outline-none transition-all duration-300"
                            placeholder="Enter your full name"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            <i className="fas fa-envelope mr-2 text-[#8B7355]"></i>
                            Email Address
                          </label>
                          <input
                            type="email"
                            value={formData.email}
                            disabled
                            className="w-full px-4 py-4 rounded-xl bg-gray-100 text-gray-500 border-2 border-gray-200 cursor-not-allowed"
                          />
                          <p className="text-xs text-gray-500 mt-1 flex items-center">
                            <i className="fas fa-info-circle mr-1"></i>
                            Email cannot be changed
                          </p>
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            <i className="fas fa-phone mr-2 text-[#8B7355]"></i>
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full px-4 py-4 rounded-xl bg-gray-50 text-gray-900 border-2 border-gray-200 focus:border-[#8B7355] focus:bg-white focus:ring-2 focus:ring-[#8B7355] focus:ring-opacity-20 focus:outline-none transition-all duration-300"
                            placeholder="+92 300 1234567"
                          />
                        </div>
                      </div>

                      <div className="flex gap-4 pt-4">
                        <button
                          type="submit"
                          disabled={saving}
                          className="bg-gradient-to-r from-[#8B7355] to-[#A68A6F] text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:transform-none disabled:hover:shadow-none"
                        >
                          {saving ? (
                            <span className="flex items-center gap-2">
                              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              Saving Changes...
                            </span>
                          ) : (
                            <span className="flex items-center gap-2">
                              <i className="fas fa-save"></i>
                              Save Changes
                            </span>
                          )}
                        </button>
                        
                        <button
                          type="button"
                          onClick={() => window.location.reload()}
                          className="px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Orders Tab */}
                {activeTab === 'orders' && (
                  <div className="p-8">
                    <div className="flex items-center justify-between mb-8">
                      <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h2>
                        <p className="text-gray-600">Track and manage your recent purchases</p>
                      </div>
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                        <i className="fas fa-shopping-bag text-white text-lg"></i>
                      </div>
                    </div>

                    {loading ? (
                      <div className="text-center py-16">
                        <div className="w-16 h-16 border-4 border-[#8B7355] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-600 font-medium">Loading your orders...</p>
                      </div>
                    ) : orders.length === 0 ? (
                      <div className="text-center py-16">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                          <i className="fas fa-shopping-bag text-gray-400 text-3xl"></i>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">No Orders Yet</h3>
                        <p className="text-gray-600 mb-8 max-w-md mx-auto">
                          You haven't placed any orders yet. Start shopping to discover our premium collection.
                        </p>
                        <Link 
                          to="/products" 
                          className="inline-flex items-center gap-2 bg-gradient-to-r from-[#8B7355] to-[#A68A6F] text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                        >
                          <i className="fas fa-shopping-cart"></i>
                          Start Shopping
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {orders.map((order) => (
                          <div key={order._id} className="bg-white rounded-2xl border-2 border-gray-200 hover:border-[#8B7355] hover:shadow-xl transition-all duration-300 overflow-hidden">
                            {/* Order Header */}
                            <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 border-b border-gray-200">
                              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                <div>
                                  <p className="text-gray-900 font-bold text-xl mb-1">Order #{order.orderNumber}</p>
                                  <p className="text-gray-600 text-sm flex items-center gap-2">
                                    <i className="fas fa-calendar"></i>
                                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                                      year: 'numeric',
                                      month: 'long',
                                      day: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </p>
                                </div>
                                <div className="flex items-center gap-4">
                                  <span className={`px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 ${getStatusColor(order.status)}`}>
                                    <i className={`fas ${getStatusIcon(order.status)}`}></i>
                                    {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Order Items */}
                            <div className="p-6">
                              <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <i className="fas fa-box text-[#8B7355]"></i>
                                Order Items ({order.items?.length || 0})
                              </h4>
                              <div className="space-y-3 mb-6">
                                {order.items?.map((item, index) => (
                                  <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                                    <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                                      {item.image ? (
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                      ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                          <i className="fas fa-image text-gray-400"></i>
                                        </div>
                                      )}
                                    </div>
                                    <div className="flex-1">
                                      <p className="font-medium text-gray-900">{item.name}</p>
                                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                                    </div>
                                    <div className="text-right">
                                      <p className="font-bold text-[#8B7355]">Rs {(item.price * item.quantity).toLocaleString()}</p>
                                      <p className="text-xs text-gray-500">Rs {item.price.toLocaleString()} each</p>
                                    </div>
                                  </div>
                                ))}
                              </div>

                              {/* Customer & Delivery Info */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div className="bg-blue-50 p-4 rounded-xl">
                                  <h5 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                    <i className="fas fa-user text-blue-600"></i>
                                    Customer Details
                                  </h5>
                                  <div className="space-y-2 text-sm">
                                    <p className="text-gray-700"><span className="font-medium">Name:</span> {order.customer?.firstName} {order.customer?.lastName}</p>
                                    <p className="text-gray-700"><span className="font-medium">Email:</span> {order.customer?.email}</p>
                                    <p className="text-gray-700"><span className="font-medium">Phone:</span> {order.customer?.phone}</p>
                                  </div>
                                </div>

                                <div className="bg-green-50 p-4 rounded-xl">
                                  <h5 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                    <i className="fas fa-map-marker-alt text-green-600"></i>
                                    Delivery Address
                                  </h5>
                                  <div className="space-y-1 text-sm text-gray-700">
                                    <p>{order.customer?.address}</p>
                                    <p>{order.customer?.city}, {order.customer?.province}</p>
                                    {order.customer?.postalCode && <p>Postal Code: {order.customer?.postalCode}</p>}
                                    {order.customer?.deliveryNotes && (
                                      <p className="mt-2 text-gray-600 italic">Note: {order.customer?.deliveryNotes}</p>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* Order Summary */}
                              <div className="bg-gradient-to-br from-[#8B7355] to-[#A68A6F] p-6 rounded-xl text-white">
                                <h5 className="font-semibold mb-4 flex items-center gap-2">
                                  <i className="fas fa-receipt"></i>
                                  Order Summary
                                </h5>
                                <div className="space-y-2">
                                  <div className="flex justify-between">
                                    <span>Subtotal:</span>
                                    <span className="font-medium">Rs {order.pricing?.subtotal?.toLocaleString() || '0'}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Delivery Charge:</span>
                                    <span className="font-medium">Rs {order.pricing?.deliveryCharge?.toLocaleString() || '0'}</span>
                                  </div>
                                  <div className="border-t border-white/30 pt-2 mt-2">
                                    <div className="flex justify-between text-lg font-bold">
                                      <span>Total:</span>
                                      <span>Rs {order.pricing?.total?.toLocaleString() || '0'}</span>
                                    </div>
                                  </div>
                                  <div className="flex justify-between text-sm opacity-90">
                                    <span>Payment Status:</span>
                                    <span className="font-medium">{order.paymentStatus?.charAt(0).toUpperCase() + order.paymentStatus?.slice(1) || 'Pending'}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Address Tab */}
                {activeTab === 'address' && (
                  <div className="p-8">
                    <div className="flex items-center justify-between mb-8">
                      <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Delivery Address</h2>
                        <p className="text-gray-600">Update your shipping and delivery preferences</p>
                      </div>
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                        <i className="fas fa-map-marker-alt text-white text-lg"></i>
                      </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          <i className="fas fa-road mr-2 text-[#8B7355]"></i>
                          Street Address
                        </label>
                        <input
                          type="text"
                          name="street"
                          value={formData.street}
                          onChange={handleChange}
                          className="w-full px-4 py-4 rounded-xl bg-gray-50 text-gray-900 border-2 border-gray-200 focus:border-[#8B7355] focus:bg-white focus:ring-2 focus:ring-[#8B7355] focus:ring-opacity-20 focus:outline-none transition-all duration-300"
                          placeholder="House #, Street name, Area"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            <i className="fas fa-city mr-2 text-[#8B7355]"></i>
                            City
                          </label>
                          <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            className="w-full px-4 py-4 rounded-xl bg-gray-50 text-gray-900 border-2 border-gray-200 focus:border-[#8B7355] focus:bg-white focus:ring-2 focus:ring-[#8B7355] focus:ring-opacity-20 focus:outline-none transition-all duration-300"
                            placeholder="Karachi"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            <i className="fas fa-flag mr-2 text-[#8B7355]"></i>
                            Province
                          </label>
                          <select
                            name="state"
                            value={formData.state}
                            onChange={handleChange}
                            className="w-full px-4 py-4 rounded-xl bg-gray-50 text-gray-900 border-2 border-gray-200 focus:border-[#8B7355] focus:bg-white focus:ring-2 focus:ring-[#8B7355] focus:ring-opacity-20 focus:outline-none transition-all duration-300 cursor-pointer"
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

                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            <i className="fas fa-mail-bulk mr-2 text-[#8B7355]"></i>
                            Postal Code
                          </label>
                          <input
                            type="text"
                            name="postalCode"
                            value={formData.postalCode}
                            onChange={handleChange}
                            className="w-full px-4 py-4 rounded-xl bg-gray-50 text-gray-900 border-2 border-gray-200 focus:border-[#8B7355] focus:bg-white focus:ring-2 focus:ring-[#8B7355] focus:ring-opacity-20 focus:outline-none transition-all duration-300"
                            placeholder="75500"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            <i className="fas fa-globe mr-2 text-[#8B7355]"></i>
                            Country
                          </label>
                          <input
                            type="text"
                            name="country"
                            value={formData.country}
                            onChange={handleChange}
                            className="w-full px-4 py-4 rounded-xl bg-gray-50 text-gray-900 border-2 border-gray-200 focus:border-[#8B7355] focus:bg-white focus:ring-2 focus:ring-[#8B7355] focus:ring-opacity-20 focus:outline-none transition-all duration-300"
                          />
                        </div>
                      </div>

                      <div className="flex gap-4 pt-4">
                        <button
                          type="submit"
                          disabled={saving}
                          className="bg-gradient-to-r from-[#8B7355] to-[#A68A6F] text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:transform-none disabled:hover:shadow-none"
                        >
                          {saving ? (
                            <span className="flex items-center gap-2">
                              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              Saving Address...
                            </span>
                          ) : (
                            <span className="flex items-center gap-2">
                              <i className="fas fa-map-marker-alt"></i>
                              Save Address
                            </span>
                          )}
                        </button>
                        
                        <button
                          type="button"
                          onClick={() => window.location.reload()}
                          className="px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;