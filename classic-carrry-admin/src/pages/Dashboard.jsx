import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productAPI, orderAPI, userAPI } from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    pendingOrders: 0,
    totalRevenue: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [productsRes, ordersRes, usersRes] = await Promise.all([
        productAPI.getAll(),
        orderAPI.getAll(),
        userAPI.getAll()
      ]);

      const orders = ordersRes.data || [];
      const pendingOrders = orders.filter(o => o.status === 'pending').length;
      const totalRevenue = orders.reduce((sum, order) => sum + (order.pricing?.total || 0), 0);

      setStats({
        totalProducts: productsRes.data?.length || 0,
        totalOrders: orders.length,
        totalUsers: usersRes.data?.length || 0,
        pendingOrders,
        totalRevenue
      });

      setRecentOrders(orders.slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 fade-in">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-gray-400">Welcome to Classic Carrry Admin Panel</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-200 text-sm mb-1">Total Products</p>
              <h3 className="text-3xl font-bold text-white">{stats.totalProducts}</h3>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <i className="fas fa-box text-white text-xl"></i>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-200 text-sm mb-1">Total Orders</p>
              <h3 className="text-3xl font-bold text-white">{stats.totalOrders}</h3>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <i className="fas fa-shopping-cart text-white text-xl"></i>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-200 text-sm mb-1">Total Users</p>
              <h3 className="text-3xl font-bold text-white">{stats.totalUsers}</h3>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <i className="fas fa-users text-white text-xl"></i>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-600 to-yellow-800 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-200 text-sm mb-1">Pending Orders</p>
              <h3 className="text-3xl font-bold text-white">{stats.pendingOrders}</h3>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <i className="fas fa-clock text-white text-xl"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Card */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm mb-1">Total Revenue</p>
            <h3 className="text-4xl font-bold text-[#D2C1B6]">Rs {stats.totalRevenue.toLocaleString()}</h3>
          </div>
          <div className="w-16 h-16 bg-[#D2C1B6]/20 rounded-lg flex items-center justify-center">
            <i className="fas fa-dollar-sign text-[#D2C1B6] text-2xl"></i>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Recent Orders</h2>
          <Link to="/orders" className="text-[#D2C1B6] hover:text-white transition">
            View All <i className="fas fa-arrow-right ml-1"></i>
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No orders yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4 text-gray-400 font-semibold">Order #</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-semibold">Customer</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-semibold">Total</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-semibold">Status</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order._id} className="border-b border-gray-700/50 hover:bg-gray-700/30 transition">
                    <td className="py-3 px-4 text-white font-mono text-sm">{order.orderNumber}</td>
                    <td className="py-3 px-4 text-gray-300">{order.customer.firstName} {order.customer.lastName}</td>
                    <td className="py-3 px-4 text-[#D2C1B6] font-semibold">Rs {order.pricing.total.toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        order.status === 'delivered' ? 'bg-green-600/20 text-green-400' :
                        order.status === 'shipped' ? 'bg-blue-600/20 text-blue-400' :
                        order.status === 'processing' ? 'bg-yellow-600/20 text-yellow-400' :
                        'bg-gray-600/20 text-gray-400'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-400 text-sm">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/products/new" className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700 hover:border-[#D2C1B6] transition group">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center group-hover:bg-blue-600 transition">
              <i className="fas fa-plus text-blue-400 group-hover:text-white transition"></i>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-1">Add Product</h3>
              <p className="text-gray-400 text-sm">Create new product</p>
            </div>
          </div>
        </Link>

        <Link to="/orders" className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700 hover:border-[#D2C1B6] transition group">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center group-hover:bg-green-600 transition">
              <i className="fas fa-list text-green-400 group-hover:text-white transition"></i>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-1">Manage Orders</h3>
              <p className="text-gray-400 text-sm">View all orders</p>
            </div>
          </div>
        </Link>

        <Link to="/users" className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700 hover:border-[#D2C1B6] transition group">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center group-hover:bg-purple-600 transition">
              <i className="fas fa-users text-purple-400 group-hover:text-white transition"></i>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-1">View Users</h3>
              <p className="text-gray-400 text-sm">Manage users</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
