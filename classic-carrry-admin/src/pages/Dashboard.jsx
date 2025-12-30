import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productAPI, orderAPI, userAPI } from '../services/api';
import { reviewAPI } from '../services/reviewAPI';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    pendingOrders: 0,
    totalRevenue: 0,
    todayRevenue: 0,
    weekRevenue: 0,
    monthRevenue: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [reviewStats, setReviewStats] = useState({ total: 0, pending: 0, approved: 0, avgRating: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [productsRes, ordersRes, usersRes, reviewsRes] = await Promise.all([
        productAPI.getAll(),
        orderAPI.getAll(),
        userAPI.getAll(),
        reviewAPI.getAllReviews({ limit: 100 })
      ]);

      const products = productsRes.data || [];
      const orders = ordersRes.data || [];
      const users = usersRes.data || [];
      const reviews = reviewsRes.reviews || [];

      // Calculate stats
      const pendingOrders = orders.filter(o => o.status === 'pending').length;
      const totalRevenue = orders.reduce((sum, order) => sum + (order.pricing?.total || 0), 0);

      // Calculate time-based revenue
      const now = new Date();
      const todayStart = new Date(now.setHours(0, 0, 0, 0));
      const weekStart = new Date(now.setDate(now.getDate() - 7));
      const monthStart = new Date(now.setMonth(now.getMonth() - 1));

      const todayRevenue = orders.filter(o => new Date(o.createdAt) >= todayStart)
        .reduce((sum, order) => sum + (order.pricing?.total || 0), 0);
      const weekRevenue = orders.filter(o => new Date(o.createdAt) >= weekStart)
        .reduce((sum, order) => sum + (order.pricing?.total || 0), 0);
      const monthRevenue = orders.filter(o => new Date(o.createdAt) >= monthStart)
        .reduce((sum, order) => sum + (order.pricing?.total || 0), 0);

      setStats({
        totalProducts: products.length,
        totalOrders: orders.length,
        totalUsers: users.length,
        pendingOrders,
        totalRevenue,
        todayRevenue,
        weekRevenue,
        monthRevenue
      });

      // Low stock products (stock < 10)
      const lowStock = products.filter(p => p.stock < 10).slice(0, 5);
      setLowStockProducts(lowStock);

      // Recent orders
      setRecentOrders(orders.slice(0, 5));

      // Recent activity (combine orders and users)
      const activity = [
        ...orders.slice(0, 3).map(o => ({
          type: 'order',
          message: `New order #${o.orderNumber} from ${o.customer?.firstName || 'Guest'}`,
          time: o.createdAt,
          icon: 'fa-shopping-bag',
          color: 'green'
        })),
        ...users.slice(0, 2).map(u => ({
          type: 'user',
          message: `New user registered: ${u.name}`,
          time: u.createdAt,
          icon: 'fa-user-plus',
          color: 'purple'
        }))
      ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 5);
      setRecentActivity(activity);

      // Sales data for last 7 days
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        date.setHours(0, 0, 0, 0);
        return date;
      });

      const salesByDay = last7Days.map(targetDate => {
        const dateStr = targetDate.toISOString().split('T')[0];
        const dayOrders = orders.filter(o => {
          const orderDate = new Date(o.createdAt).toISOString().split('T')[0];
          return orderDate === dateStr;
        });
        return {
          date: targetDate.toLocaleDateString('en-US', { weekday: 'short' }),
          revenue: dayOrders.reduce((sum, order) => sum + (order.pricing?.total || 0), 0),
          orders: dayOrders.length
        };
      });
      setSalesData(salesByDay);

      // Review stats
      const totalReviews = reviews.length;
      const pendingReviews = reviews.filter(r => !r.isApproved).length;
      const approvedReviews = reviews.filter(r => r.isApproved).length;
      const avgRating = totalReviews > 0 
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1)
        : 0;

      setReviewStats({
        total: totalReviews,
        pending: pendingReviews,
        approved: approvedReviews,
        avgRating: parseFloat(avgRating)
      });

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-100px)]">
        <div className="spinner"></div>
      </div>
    );
  }

  const StatCard = ({ title, value, icon, color, gradient }) => (
    <div className={`glass-card p-6 relative overflow-hidden group`}>
      <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500`}>
        <i className={`fas ${icon} text-6xl text-${color}-400`}></i>
      </div>
      <div className="relative z-10">
        <p className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-white mb-2">{value}</h3>
        <div className={`h-1 w-12 rounded-full bg-gradient-to-r ${gradient}`}></div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2 font-display">Dashboard</h1>
          <p className="text-gray-400">Overview of your store's performance</p>
        </div>
        <div className="flex gap-3">
          <button onClick={fetchDashboardData} className="glass-card px-4 py-2 text-sm hover:text-white text-gray-400 flex items-center gap-2">
            <i className="fas fa-sync-alt"></i> Refresh
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={`Rs ${stats.totalRevenue.toLocaleString()}`}
          icon="fa-coins"
          color="yellow"
          gradient="from-yellow-400 to-yellow-600"
        />
        <StatCard
          title="Total Orders"
          value={stats.totalOrders}
          icon="fa-shopping-bag"
          color="blue"
          gradient="from-blue-400 to-blue-600"
        />
        <StatCard
          title="Active Users"
          value={stats.totalUsers}
          icon="fa-users"
          color="purple"
          gradient="from-purple-400 to-purple-600"
        />
        <StatCard
          title="products"
          value={stats.totalProducts}
          icon="fa-box"
          color="green"
          gradient="from-green-400 to-green-600"
        />
      </div>

      {/* Review Analytics */}
      <div className="glass-panel rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-white">Review Analytics</h2>
            <p className="text-sm text-gray-400">Customer feedback overview</p>
          </div>
          <Link to="/reviews" className="text-primary hover:text-white text-sm flex items-center gap-1 transition-colors">
            Manage Reviews <i className="fas fa-arrow-right"></i>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="glass-card p-5 rounded-xl border-white/5 bg-gradient-to-br from-white/5 to-transparent">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <i className="fas fa-star text-blue-400"></i>
              </div>
              <span className="text-xs font-bold text-gray-500 uppercase">Total</span>
            </div>
            <p className="text-3xl font-bold text-white">{reviewStats.total}</p>
            <p className="text-xs text-gray-400 mt-1">Reviews</p>
          </div>

          <div className="glass-card p-5 rounded-xl border-white/5 bg-gradient-to-br from-white/5 to-transparent">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                <i className="fas fa-clock text-yellow-400"></i>
              </div>
              <span className="text-xs font-bold text-gray-500 uppercase">Pending</span>
            </div>
            <p className="text-3xl font-bold text-yellow-400">{reviewStats.pending}</p>
            <p className="text-xs text-gray-400 mt-1">Awaiting approval</p>
          </div>

          <div className="glass-card p-5 rounded-xl border-white/5 bg-gradient-to-br from-white/5 to-transparent">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                <i className="fas fa-check-circle text-green-400"></i>
              </div>
              <span className="text-xs font-bold text-gray-500 uppercase">Approved</span>
            </div>
            <p className="text-3xl font-bold text-green-400">{reviewStats.approved}</p>
            <p className="text-xs text-gray-400 mt-1">Live reviews</p>
          </div>

          <div className="glass-card p-5 rounded-xl border-white/5 bg-gradient-to-br from-white/5 to-transparent">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <i className="fas fa-chart-line text-purple-400"></i>
              </div>
              <span className="text-xs font-bold text-gray-500 uppercase">Average</span>
            </div>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-bold text-white">{reviewStats.avgRating}</p>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <i
                    key={star}
                    className={`fas fa-star text-xs ${
                      star <= Math.round(reviewStats.avgRating) ? 'text-yellow-400' : 'text-gray-600'
                    }`}
                  ></i>
                ))}
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-1">Rating</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart Section */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-white">Revenue Analytics</h2>
              <p className="text-sm text-gray-400">Last 7 days performance</p>
            </div>
            <Link to="/analytics" className="text-primary hover:text-white text-sm flex items-center gap-1 transition-colors">
              Full Report <i className="fas fa-arrow-right"></i>
            </Link>
          </div>

          <div className="h-64 flex items-end justify-between gap-2 px-2">
            {salesData.length > 0 ? (
              salesData.map((day, index) => {
                const maxRevenue = Math.max(...salesData.map(d => d.revenue), 100);
                const heightPercent = day.revenue > 0 
                  ? Math.max((day.revenue / maxRevenue) * 100, 5)
                  : 5;
                
                return (
                  <div key={index} className="flex flex-col items-center gap-2 flex-1 group">
                    <div className="w-full relative h-48 flex items-end justify-center">
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className={`w-full max-w-[40px] rounded-t-lg transition-all duration-300 relative ${
                          day.revenue > 0 
                            ? 'bg-gradient-to-t from-blue-600 to-blue-400 group-hover:from-blue-500 group-hover:to-blue-300 shadow-lg shadow-blue-500/50' 
                            : 'bg-gradient-to-t from-gray-600 to-gray-500 group-hover:from-gray-500 group-hover:to-gray-400'
                        }`}
                      >
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-white/10 z-10">
                          Rs {day.revenue.toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500 font-medium">{day.date}</span>
                  </div>
                );
              })
            ) : (
              <div className="w-full h-48 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <i className="fas fa-chart-bar text-4xl mb-2 opacity-20"></i>
                  <p className="text-sm">Loading sales data...</p>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-white/5">
            <div className="text-center">
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Today</p>
              <p className="text-lg font-bold text-white">Rs {stats.todayRevenue.toLocaleString()}</p>
            </div>
            <div className="text-center border-l border-white/5">
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">This Week</p>
              <p className="text-lg font-bold text-white">Rs {stats.weekRevenue.toLocaleString()}</p>
            </div>
            <div className="text-center border-l border-white/5">
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">This Month</p>
              <p className="text-lg font-bold text-white">Rs {stats.monthRevenue.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Side Widgets */}
        <div className="space-y-8">
          {/* Pending Orders */}
          <div className="glass-panel rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center justify-between">
              <span>Pending Orders</span>
              <span className="bg-yellow-500/20 text-yellow-500 text-xs px-2 py-1 rounded-full">{stats.pendingOrders} New</span>
            </h3>
            <div className="space-y-3">
              {recentOrders.filter(o => o.status === 'pending').slice(0, 3).map(order => (
                <div key={order._id} className="glass-card p-3 flex justify-between items-center group cursor-pointer hover:border-primary/30">
                  <div>
                    <p className="text-white font-medium text-sm">#{order.orderNumber}</p>
                    <p className="text-xs text-gray-400">{order.customer?.firstName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-primary font-bold text-sm">Rs {order.pricing.total.toLocaleString()}</p>
                    <Link to={`/orders/${order.orderNumber}`} className="w-8 h-8 rounded-lg bg-white/5 hover:bg-primary/20 hover:text-primary flex items-center justify-center transition-all">
                      <i className="fas fa-eye text-xs"></i>
                    </Link>
                  </div>
                </div>
              ))}
              {recentOrders.filter(o => o.status === 'pending').length === 0 && (
                <p className="text-gray-500 text-sm text-center py-4">No pending orders</p>
              )}
            </div>
            <Link to="/orders" className="block mt-4 text-center text-sm text-gray-400 hover:text-white transition-colors">
              View All Orders
            </Link>
          </div>

          {/* Low Stock */}
          <div className="glass-panel rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">Low Stock Alerts</h3>
            <div className="space-y-3">
              {lowStockProducts.map(product => (
                <Link to={`/products/edit/${product._id}`} key={product._id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors group">
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-white/5">
                    <img src={product.mainImage} alt="" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-300 truncate group-hover:text-white">{product.name}</p>
                    <p className="text-xs text-red-400">{product.stock} remaining</p>
                  </div>
                  <i className="fas fa-chevron-right text-gray-600 text-xs group-hover:text-white"></i>
                </Link>
              ))}
              {lowStockProducts.length === 0 && (
                <div className="flex flex-col items-center justify-center py-4 text-gray-500">
                  <i className="fas fa-check-circle text-2xl text-green-500/50 mb-2"></i>
                  <p className="text-sm">Inventory healthy</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Table Table */}
      <div className="glass-panel rounded-2xl overflow-hidden p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Recent Activity</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10 text-left">
                <th className="py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Type</th>
                <th className="py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Description</th>
                <th className="py-3 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {recentActivity.map((activity, idx) => (
                <tr key={idx} className="hover:bg-white/5 transition-colors">
                  <td className="py-3 px-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-${activity.color || 'gray'}-500/20 text-${activity.color || 'gray'}-400`}>
                      <i className={`fas ${activity.icon}`}></i>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-300">{activity.message}</td>
                  <td className="py-3 px-4 text-sm text-gray-500 whitespace-nowrap">
                    {new Date(activity.time).toLocaleDateString()} <span className="text-xs opacity-50">{new Date(activity.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </td>
                </tr>
              ))}
              {recentActivity.length === 0 && (
                <tr>
                  <td colSpan="3" className="py-8 text-center text-gray-500">No recent activity found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
