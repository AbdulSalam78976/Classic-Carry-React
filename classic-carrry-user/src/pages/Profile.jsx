import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import { orderAPI, userAPI } from '../services/api';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const { showNotification } = useNotification();
  const [activeTab, setActiveTab] = useState('profile');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
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
    setLoading(true);

    try {
      const updateData = {
        name: formData.name,
        phone: formData.phone,
        address: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
          country: formData.country
        }
      };

      const response = await userAPI.updateProfile(updateData);
      if (response.success) {
        updateUser(response.data);
        showNotification('Profile updated successfully!', 'success');
      }
    } catch (error) {
      showNotification(error.message || 'Failed to update profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            My Account
          </h1>
          <p className="text-gray-400">Manage your profile and orders</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              {/* User Info */}
              <div className="text-center mb-6 pb-6 border-b border-gray-700">
                <div className="w-20 h-20 bg-[#D2C1B6] rounded-full flex items-center justify-center mx-auto mb-3">
                  <i className="fas fa-user text-gray-900 text-2xl"></i>
                </div>
                <h3 className="text-white font-semibold text-lg">{user?.name}</h3>
                <p className="text-gray-400 text-sm">{user?.email}</p>
              </div>

              {/* Navigation */}
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full text-left px-4 py-3 rounded-lg transition ${
                    activeTab === 'profile'
                      ? 'bg-[#D2C1B6] text-gray-900 font-medium'
                      : 'text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  <i className="fas fa-user mr-3"></i>
                  Profile Information
                </button>
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`w-full text-left px-4 py-3 rounded-lg transition ${
                    activeTab === 'orders'
                      ? 'bg-[#D2C1B6] text-gray-900 font-medium'
                      : 'text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  <i className="fas fa-shopping-bag mr-3"></i>
                  My Orders
                </button>
                <button
                  onClick={() => setActiveTab('address')}
                  className={`w-full text-left px-4 py-3 rounded-lg transition ${
                    activeTab === 'address'
                      ? 'bg-[#D2C1B6] text-gray-900 font-medium'
                      : 'text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  <i className="fas fa-map-marker-alt mr-3"></i>
                  Delivery Address
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-gray-800 rounded-lg p-6 md:p-8 border border-gray-700">
              {/* Profile Information Tab */}
              {activeTab === 'profile' && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">Profile Information</h2>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-[#D2C1B6] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          disabled
                          className="w-full px-4 py-3 rounded-lg bg-gray-600 text-gray-400 border border-gray-600 cursor-not-allowed"
                        />
                        <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-[#D2C1B6] focus:outline-none"
                          placeholder="+92 300 1234567"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-[#D2C1B6] text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-[#e2c9b8] transition disabled:opacity-50"
                    >
                      {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </form>
                </div>
              )}

              {/* Orders Tab */}
              {activeTab === 'orders' && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">My Orders</h2>
                  {loading ? (
                    <div className="text-center py-12">
                      <i className="fas fa-spinner fa-spin text-4xl text-[#D2C1B6] mb-4"></i>
                      <p className="text-gray-400">Loading orders...</p>
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-12">
                      <i className="fas fa-shopping-bag text-6xl text-gray-600 mb-4"></i>
                      <p className="text-gray-400 mb-4">No orders yet</p>
                      <a href="/" className="text-[#D2C1B6] hover:underline">
                        Start Shopping
                      </a>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div key={order._id} className="bg-gray-700 rounded-lg p-6 border border-gray-600">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <p className="text-white font-semibold">Order #{order.orderNumber}</p>
                              <p className="text-gray-400 text-sm">
                                {new Date(order.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              order.status === 'delivered' ? 'bg-green-600 text-white' :
                              order.status === 'processing' ? 'bg-blue-600 text-white' :
                              order.status === 'shipped' ? 'bg-purple-600 text-white' :
                              'bg-yellow-600 text-white'
                            }`}>
                              {order.status}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <p className="text-gray-300">
                              {order.items?.length || 0} item(s)
                            </p>
                            <p className="text-[#D2C1B6] font-bold text-lg">
                              Rs {order.totalAmount?.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Address Tab */}
              {activeTab === 'address' && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">Delivery Address</h2>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Street Address
                      </label>
                      <input
                        type="text"
                        name="street"
                        value={formData.street}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-[#D2C1B6] focus:outline-none"
                        placeholder="House #, Street name"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          City
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-[#D2C1B6] focus:outline-none"
                          placeholder="Karachi"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          State/Province
                        </label>
                        <input
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-[#D2C1B6] focus:outline-none"
                          placeholder="Sindh"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Postal Code
                        </label>
                        <input
                          type="text"
                          name="postalCode"
                          value={formData.postalCode}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-[#D2C1B6] focus:outline-none"
                          placeholder="75500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Country
                        </label>
                        <input
                          type="text"
                          name="country"
                          value={formData.country}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-[#D2C1B6] focus:outline-none"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-[#D2C1B6] text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-[#e2c9b8] transition disabled:opacity-50"
                    >
                      {loading ? 'Saving...' : 'Save Address'}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
