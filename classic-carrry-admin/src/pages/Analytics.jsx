import { useState, useEffect } from 'react';
import { analyticsAPI } from '../services/analyticsAPI';
import LineChart from '../components/charts/LineChart';
import BarChart from '../components/charts/BarChart';
import PieChart from '../components/charts/PieChart';
import AreaChart from '../components/charts/AreaChart';
import {
  exportToCSV,
  exportToPDF,
  prepareSalesDataForExport,
  prepareProductDataForExport,
  prepareRevenueDataForExport
} from '../utils/exportUtils';

const Analytics = () => {
  const [dashboardStats, setDashboardStats] = useState(null);
  const [salesData, setSalesData] = useState(null);
  const [productData, setProductData] = useState(null);
  const [revenueData, setRevenueData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (selectedPeriod !== 'custom') {
      fetchAnalyticsData();
    }
  }, [selectedPeriod]);

  const fetchAnalyticsData = async (customParams = null) => {
    try {
      setLoading(true);
      setError(null);

      const params = customParams || { period: selectedPeriod };

      const [dashboard, sales, products, revenue] = await Promise.all([
        analyticsAPI.getDashboardStats(params),
        analyticsAPI.getSalesAnalytics(params),
        analyticsAPI.getProductAnalytics(params),
        analyticsAPI.getRevenueAnalytics(params)
      ]);

      setDashboardStats(dashboard.data);
      setSalesData(sales.data);
      setProductData(products.data);
      setRevenueData(revenue.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setError(error.message || 'Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const handleCustomFilter = () => {
    if (!customStartDate || !customEndDate) {
      alert('Please select both start and end dates');
      return;
    }
    fetchAnalyticsData({ startDate: customStartDate, endDate: customEndDate });
  };

  const exportReport = (type, format) => {
    try {
      let data, title, filename;

      switch (type) {
        case 'sales':
          if (!salesData?.salesData) return;
          data = prepareSalesDataForExport(salesData.salesData);
          title = `Sales Report - ${selectedPeriod}`;
          filename = `sales-report-${selectedPeriod}`;
          break;
        case 'products':
          if (!productData?.topProducts) return;
          data = prepareProductDataForExport(productData.topProducts);
          title = `Top Products Report - ${selectedPeriod}`;
          filename = `products-report-${selectedPeriod}`;
          break;
        case 'revenue':
          if (!revenueData?.revenueData) return;
          data = prepareRevenueDataForExport(revenueData.revenueData);
          title = `Revenue Report - ${selectedPeriod}`;
          filename = `revenue-report-${selectedPeriod}`;
          break;
        default:
          return;
      }

      if (format === 'csv') {
        exportToCSV(data, filename);
      } else if (format === 'pdf') {
        exportToPDF(data, title, filename);
      }
    } catch (error) {
      console.error('Export error:', error);
      alert('Error exporting report. Please try again.');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString, format = 'short') => {
    const date = new Date(dateString);
    if (format === 'full') {
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const StatCard = ({ title, value, change, icon, color = 'blue' }) => {
    const colors = {
      blue: 'from-blue-500/20 to-blue-600/5 text-blue-400 border-blue-500/20',
      green: 'from-green-500/20 to-green-600/5 text-green-400 border-green-500/20',
      yellow: 'from-yellow-500/20 to-yellow-600/5 text-yellow-400 border-yellow-500/20',
      purple: 'from-purple-500/20 to-purple-600/5 text-purple-400 border-purple-500/20',
      red: 'from-red-500/20 to-red-600/5 text-red-400 border-red-500/20'
    };

    return (
      <div className={`glass-card p-6 rounded-2xl bg-gradient-to-br ${colors[color]} border shadow-lg hover:translate-y-[-2px] transition-transform duration-300`}>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-gray-400 text-xs uppercase font-bold tracking-wider mb-2">{title}</p>
            <h3 className="text-3xl font-bold text-white mb-2 font-display">{value}</h3>
            {change !== undefined && (
              <div className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full bg-black/20 ${change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                <i className={`fas fa-arrow-${change >= 0 ? 'up' : 'down'}`}></i>
                <span>{Math.abs(change)}% from last period</span>
              </div>
            )}
          </div>
          <div className={`w-12 h-12 rounded-xl bg-black/20 flex items-center justify-center backdrop-blur-sm shadow-inner`}>
            <i className={`fas ${icon} text-xl`}></i>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-100px)]">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 flex items-center justify-center h-[calc(100vh-100px)]">
        <div className="glass-panel p-8 rounded-2xl text-center border-red-500/30 max-w-md w-full">
          <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <i className="fas fa-exclamation-triangle text-red-400 text-4xl"></i>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Analytics Error</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={fetchAnalyticsData}
            className="w-full px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold transition-all shadow-lg shadow-red-500/20"
          >
            <i className="fas fa-refresh mr-2"></i>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2 font-display">Analytics Dashboard</h1>
          <p className="text-gray-400">Comprehensive business insights and performance metrics</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          {/* Period Selector */}
          <div className="flex flex-col gap-4">
            <div className="glass-panel p-1 rounded-xl flex items-center bg-black/40 self-start">
              {['today', 'week', 'month', 'year', 'custom'].map((period) => (
                <button
                  key={period}
                  onClick={() => setSelectedPeriod(period)}
                  className={`px-4 py-2 rounded-lg text-sm font-bold capitalize transition-all ${selectedPeriod === period
                    ? 'bg-primary text-slate-900 shadow-lg shadow-primary/20'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                >
                  {period}
                </button>
              ))}
            </div>

            {/* Custom Date Inputs */}
            {selectedPeriod === 'custom' && (
              <div className="flex flex-wrap items-center gap-4 animate-fade-in bg-white/5 p-3 rounded-xl border border-white/10">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-400 uppercase">From</span>
                  <input
                    type="date"
                    value={customStartDate}
                    onChange={(e) => setCustomStartDate(e.target.value)}
                    className="glass-input px-3 py-1.5 text-sm w-auto"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-400 uppercase">To</span>
                  <input
                    type="date"
                    value={customEndDate}
                    onChange={(e) => setCustomEndDate(e.target.value)}
                    className="glass-input px-3 py-1.5 text-sm w-auto"
                  />
                </div>
                <button
                  onClick={handleCustomFilter}
                  className="px-4 py-1.5 bg-[#D2C1B6] hover:bg-[#C4B5A8] text-slate-900 rounded-lg text-sm font-bold transition-colors shadow-sm"
                >
                  Apply
                </button>
              </div>
            )}
          </div>

          {/* Export Dropdown */}
          <div className="relative group z-20">
            <button className="h-full px-6 py-2 bg-[#D2C1B6] hover:bg-[#C4B5A8] text-slate-900 rounded-xl transition-all font-bold shadow-sm flex items-center gap-3">
              <i className="fas fa-download"></i>
              Export Report
              <i className="fas fa-chevron-down text-xs opacity-70"></i>
            </button>
            <div className="absolute right-0 mt-2 w-56 glass-panel rounded-xl shadow-2xl border-white/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right">
              <div className="p-2 space-y-1">
                <div className="px-3 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider">Sales Reports</div>
                <button
                  onClick={() => exportReport('sales', 'csv')}
                  className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white rounded-lg transition-colors flex items-center gap-2"
                >
                  <i className="fas fa-file-csv text-green-400"></i> CSV Format
                </button>
                <button
                  onClick={() => exportReport('sales', 'pdf')}
                  className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white rounded-lg transition-colors flex items-center gap-2"
                >
                  <i className="fas fa-file-pdf text-red-400"></i> PDF Format
                </button>
                <div className="h-px bg-white/5 my-1"></div>
                <div className="px-3 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider">Other Reports</div>
                <button
                  onClick={() => exportReport('products', 'csv')}
                  className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white rounded-lg transition-colors flex items-center gap-2"
                >
                  <i className="fas fa-box text-blue-400"></i> Top Products (CSV)
                </button>
                <button
                  onClick={() => exportReport('revenue', 'pdf')}
                  className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white rounded-lg transition-colors flex items-center gap-2"
                >
                  <i className="fas fa-dollar-sign text-yellow-400"></i> Revenue (PDF)
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="glass-panel p-1.5 rounded-xl inline-flex overflow-x-auto max-w-full">
        {[
          { id: 'overview', label: 'Overview', icon: 'fa-chart-pie' },
          { id: 'sales', label: 'Sales Analytics', icon: 'fa-shopping-bag' },
          { id: 'products', label: 'Product Performance', icon: 'fa-tags' },
          { id: 'revenue', label: 'Revenue Streams', icon: 'fa-coins' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 rounded-lg font-bold text-sm flex items-center gap-2 transition-all whitespace-nowrap ${activeTab === tab.id
              ? 'bg-white/10 text-white shadow-lg backdrop-blur-md border border-white/5'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
          >
            <i className={`fas ${tab.icon}`}></i>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        dashboardStats && dashboardStats.overview ? (
          <div className="space-y-6 animate-slide-up">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Total Revenue"
                value={formatCurrency(dashboardStats.overview.totalRevenue || 0)}
                icon="fa-dollar-sign"
                color="green"
              />
              <StatCard
                title="Total Orders"
                value={(dashboardStats.overview.totalOrders || 0).toLocaleString()}
                icon="fa-shopping-cart"
                color="blue"
              />
              <StatCard
                title="Active Users"
                value={(dashboardStats.overview.totalUsers || 0).toLocaleString()}
                icon="fa-users"
                color="purple"
              />
              <StatCard
                title="Products Listed"
                value={(dashboardStats.overview.totalProducts || 0).toLocaleString()}
                icon="fa-box"
                color="yellow"
              />
            </div>

            {/* Detailed Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Orders */}
              <div className="glass-panel rounded-2xl p-6 h-full">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white font-display">Recent Activity</h3>
                  <button className="text-xs font-bold text-primary hover:text-primary-light uppercase tracking-wider transition-colors">View All</button>
                </div>
                <div className="space-y-4">
                  {(dashboardStats.recentOrders || []).map((order) => (
                    <div key={order._id} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors group cursor-default">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border ${order.status === 'delivered' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                          order.status === 'processing' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                            'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                          }`}>
                          <i className={`fas ${order.status === 'delivered' ? 'fa-check' :
                            order.status === 'processing' ? 'fa-cog fa-spin' :
                              'fa-clock'
                            }`}></i>
                        </div>
                        <div>
                          <p className="font-bold text-white text-sm">Order #{order.orderNumber}</p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {order.customer.firstName} {order.customer.lastName}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary text-sm">{formatCurrency(order.pricing.total)}</p>
                        <p className="text-[10px] text-gray-500 font-mono mt-0.5 uppercase">{new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Products */}
              <div className="glass-panel rounded-2xl p-6 h-full">
                <h3 className="text-xl font-bold text-white font-display mb-6">Top Performers</h3>
                <div className="space-y-4">
                  {(dashboardStats.topProducts || []).map((product, index) => (
                    <div key={product._id} className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-primary/30 transition-all group">
                      <div className="w-12 h-12 rounded-lg bg-black/40 flex items-center justify-center font-bold text-lg text-gray-500 border border-white/10 group-hover:text-primary transition-colors">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-white truncate group-hover:text-primary transition-colors">{product.name}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs text-gray-400 flex items-center gap-1">
                            <i className="fas fa-shopping-bag text-[10px]"></i> {product.totalSold} sold
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-white">{formatCurrency(product.revenue)}</p>
                        <span className="text-[10px] text-green-400 font-bold uppercase tracking-wider">Revenue</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="glass-panel rounded-2xl p-12 text-center border-dashed border-white/10">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="fas fa-chart-bar text-4xl text-gray-600"></i>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No Data Available</h3>
            <p className="text-gray-400">There is no analytics data for the selected period.</p>
          </div>
        )
      )}

      {/* Sales Tab */}
      {activeTab === 'sales' && salesData && (
        <div className="space-y-6 animate-slide-up">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="glass-panel p-6 rounded-2xl">
              <h3 className="text-lg font-bold text-white mb-6">Orders Overview</h3>
              <LineChart
                data={salesData.salesData.map(item => ({
                  date: formatDate(item._id),
                  orders: item.orders,
                  revenue: item.revenue
                }))}
                xKey="date"
                yKey="orders"
                title="Daily Orders"
                color="#3B82F6"
              />
            </div>
            <div className="glass-panel p-6 rounded-2xl">
              <h3 className="text-lg font-bold text-white mb-6">Revenue Trend</h3>
              <AreaChart
                data={salesData.salesData.map(item => ({
                  date: formatDate(item._id),
                  revenue: item.revenue
                }))}
                xKey="date"
                yKey="revenue"
                title="Daily Revenue"
                color="#10B981"
              />
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl max-w-lg mx-auto">
            <h3 className="text-lg font-bold text-white mb-6 text-center">Order Status Distribution</h3>
            <PieChart
              data={salesData.salesByStatus.map(item => ({
                name: item._id,
                value: item.count
              }))}
              dataKey="value"
              nameKey="name"
              title="Orders by Status"
            />
          </div>
        </div>
      )}

      {/* Products Tab */}
      {activeTab === 'products' && productData && (
        <div className="space-y-6 animate-slide-up">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="glass-panel p-6 rounded-2xl">
              <h3 className="text-lg font-bold text-white mb-6">Top Selling Products</h3>
              <BarChart
                data={productData.topProducts.slice(0, 10)}
                xKey="name"
                yKey="totalSold"
                title="Units Sold"
                color="#8B5CF6"
              />
            </div>
            <div className="glass-panel p-6 rounded-2xl">
              <h3 className="text-lg font-bold text-white mb-6">Category Distribution</h3>
              <PieChart
                data={productData.productsByCategory}
                dataKey="count"
                nameKey="_id"
                title="Products by Category"
              />
            </div>
          </div>

          {/* Low Stock Alert */}
          {productData.lowStockProducts.length > 0 && (
            <div className="glass-panel rounded-2xl p-6 border-l-4 border-l-yellow-500 bg-yellow-500/5">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-yellow-500/20 text-yellow-400 flex items-center justify-center">
                  <i className="fas fa-exclamation-triangle"></i>
                </div>
                Low Stock Alerts
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {productData.lowStockProducts.map((product) => (
                  <div key={product._id} className="p-4 bg-black/40 border border-white/5 rounded-xl hover:border-yellow-500/50 transition-colors">
                    <p className="font-bold text-white mb-1 truncate">{product.name}</p>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">{product.categoryName}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">Remaining</span>
                      <span className="text-lg font-bold text-yellow-400">{product.stock} units</span>
                    </div>
                    <div className="w-full bg-gray-700 h-1.5 rounded-full mt-3 overflow-hidden">
                      <div className="bg-yellow-500 h-full rounded-full" style={{ width: `${Math.min(product.stock * 10, 100)}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Revenue Tab */}
      {activeTab === 'revenue' && revenueData && (
        <div className="space-y-6 animate-slide-up">
          {/* Monthly Comparison */}
          <div className="glass-panel rounded-2xl p-8">
            <h3 className="text-xl font-bold text-white mb-8">Monthly Revenue Performance</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6 bg-white/5 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
                <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-2">Current Month</p>
                <p className="text-4xl font-bold text-green-400 font-display">
                  {formatCurrency(revenueData.monthlyComparison.current)}
                </p>
              </div>
              <div className="text-center p-6 bg-white/5 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
                <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-2">Previous Month</p>
                <p className="text-4xl font-bold text-gray-300 font-display">
                  {formatCurrency(revenueData.monthlyComparison.previous)}
                </p>
              </div>
              <div className="text-center p-6 bg-white/5 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
                <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-2">Growth Rate</p>
                <div className={`text-4xl font-bold font-display flex items-center justify-center gap-2 ${revenueData.monthlyComparison.growthRate >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                  <i className={`fas fa-caret-${revenueData.monthlyComparison.growthRate >= 0 ? 'up' : 'down'} text-2xl`}></i>
                  {revenueData.monthlyComparison.growthRate}%
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="glass-panel p-6 rounded-2xl">
              <h3 className="text-lg font-bold text-white mb-6">Daily Revenue Breakdown</h3>
              <AreaChart
                data={revenueData.revenueData.map(item => ({
                  date: formatDate(item._id),
                  revenue: item.revenue
                }))}
                xKey="date"
                yKey="revenue"
                title="Revenue"
                color="#F59E0B"
              />
            </div>
            <div className="glass-panel p-6 rounded-2xl">
              <h3 className="text-lg font-bold text-white mb-6">Revenue Sources (Categories)</h3>
              <PieChart
                data={revenueData.revenueByCategory.filter(item => item._id)}
                dataKey="revenue"
                nameKey="_id"
                title="Revenue by Category"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;