import { useState, useEffect } from 'react';
import { analyticsAPI } from '../services/analyticsAPI';
import LineChart from '../components/charts/LineChart';
import { exportToCSV, exportToPDF, prepareSalesDataForExport } from '../utils/exportUtils';

const Analytics = () => {
  const [dashboardStats, setDashboardStats] = useState(null);
  const [salesData, setSalesData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  useEffect(() => {
    fetchAnalyticsData();
  }, [selectedPeriod]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = { period: selectedPeriod };

      const [dashboard, sales] = await Promise.all([
        analyticsAPI.getDashboardStats(params),
        analyticsAPI.getSalesAnalytics(params)
      ]);

      setDashboardStats(dashboard.data);
      setSalesData(sales.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setError(error.message || 'Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const exportReport = (format) => {
    try {
      if (!salesData?.salesData) return;
      
      const data = prepareSalesDataForExport(salesData.salesData);
      const title = `Sales Report - ${selectedPeriod}`;
      const filename = `sales-report-${selectedPeriod}`;

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
    return `Rs ${(amount || 0).toLocaleString()}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const StatCard = ({ title, value, icon, color = 'blue' }) => {
    const colors = {
      blue: 'from-blue-500/20 to-blue-600/5 text-blue-400 border-blue-500/20',
      green: 'from-green-500/20 to-green-600/5 text-green-400 border-green-500/20',
      yellow: 'from-yellow-500/20 to-yellow-600/5 text-yellow-400 border-yellow-500/20',
      purple: 'from-purple-500/20 to-purple-600/5 text-purple-400 border-purple-500/20'
    };

    return (
      <div className={`glass-card p-6 rounded-2xl bg-gradient-to-br ${colors[color]} border shadow-lg`}>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-gray-400 text-xs uppercase font-bold tracking-wider mb-2">{title}</p>
            <h3 className="text-3xl font-bold text-white mb-2 font-display">{value}</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-black/20 flex items-center justify-center backdrop-blur-sm">
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
            className="w-full px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold transition-all"
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
          <h1 className="text-4xl font-bold text-white mb-2 font-display">Analytics</h1>
          <p className="text-gray-400">Business performance overview</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          {/* Period Selector */}
          <div className="glass-panel p-1 rounded-xl flex items-center bg-black/40">
            {['today', 'week', 'month', 'year'].map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-4 py-2 rounded-lg text-sm font-bold capitalize transition-all ${
                  selectedPeriod === period
                    ? 'bg-primary text-slate-900 shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {period}
              </button>
            ))}
          </div>

          {/* Export Dropdown */}
          <div className="relative group">
            <button className="h-full px-6 py-2 bg-primary hover:bg-primary-dark text-white rounded-xl transition-all font-bold flex items-center gap-3">
              <i className="fas fa-download"></i>
              Export
              <i className="fas fa-chevron-down text-xs"></i>
            </button>
            <div className="absolute right-0 mt-2 w-48 glass-panel rounded-xl shadow-2xl border-white/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              <div className="p-2 space-y-1">
                <button
                  onClick={() => exportReport('csv')}
                  className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white rounded-lg transition-colors flex items-center gap-2"
                >
                  <i className="fas fa-file-csv text-green-400"></i> CSV Format
                </button>
                <button
                  onClick={() => exportReport('pdf')}
                  className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white rounded-lg transition-colors flex items-center gap-2"
                >
                  <i className="fas fa-file-pdf text-red-400"></i> PDF Format
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {dashboardStats && dashboardStats.overview ? (
        <div className="space-y-6">
          {/* Key Metrics */}
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
              title="Total Users"
              value={(dashboardStats.overview.totalUsers || 0).toLocaleString()}
              icon="fa-users"
              color="purple"
            />
            <StatCard
              title="Total Products"
              value={(dashboardStats.overview.totalProducts || 0).toLocaleString()}
              icon="fa-box"
              color="yellow"
            />
          </div>

          {/* Sales Chart */}
          {salesData && salesData.salesData && (
            <div className="glass-panel p-6 rounded-2xl">
              <h3 className="text-xl font-bold text-white mb-6 font-display">Sales Overview</h3>
              <LineChart
                data={salesData.salesData.map(item => ({
                  date: formatDate(item._id),
                  orders: item.orders,
                  revenue: item.revenue
                }))}
                xKey="date"
                yKey="revenue"
                title="Revenue Trend"
                color="#10B981"
              />
            </div>
          )}

          {/* Recent Activity & Top Products */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Orders */}
            <div className="glass-panel rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white font-display mb-6">Recent Orders</h3>
              <div className="space-y-4">
                {(dashboardStats.recentOrders || []).slice(0, 5).map((order) => (
                  <div key={order._id} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border ${
                        order.status === 'delivered' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                        order.status === 'processing' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                        'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                      }`}>
                        <i className={`fas ${
                          order.status === 'delivered' ? 'fa-check' :
                          order.status === 'processing' ? 'fa-cog fa-spin' :
                          'fa-clock'
                        }`}></i>
                      </div>
                      <div>
                        <p className="font-bold text-white text-sm">#{order.orderNumber}</p>
                        <p className="text-xs text-gray-400">{order.customer.firstName} {order.customer.lastName}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary text-sm">{formatCurrency(order.pricing.total)}</p>
                      <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Products */}
            <div className="glass-panel rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white font-display mb-6">Top Products</h3>
              <div className="space-y-4">
                {(dashboardStats.topProducts || []).slice(0, 5).map((product, index) => (
                  <div key={product._id} className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-primary/30 transition-all">
                    <div className="w-10 h-10 rounded-lg bg-black/40 flex items-center justify-center font-bold text-gray-400 border border-white/10">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-white truncate">{product.name}</p>
                      <p className="text-xs text-gray-400">{product.totalSold} sold</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-white">{formatCurrency(product.revenue)}</p>
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
      )}
    </div>
  );
};

export default Analytics;
