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
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchAnalyticsData();
  }, [selectedPeriod]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const [dashboard, sales, products, revenue] = await Promise.all([
        analyticsAPI.getDashboardStats({ period: selectedPeriod }),
        analyticsAPI.getSalesAnalytics({ period: selectedPeriod }),
        analyticsAPI.getProductAnalytics({ period: selectedPeriod }),
        analyticsAPI.getRevenueAnalytics({ period: selectedPeriod })
      ]);

      setDashboardStats(dashboard.data);
      setSalesData(sales.data);
      setProductData(products.data);
      setRevenueData(revenue.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const StatCard = ({ title, value, change, icon, color = 'blue' }) => {
    const colorClasses = {
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      yellow: 'bg-yellow-500',
      purple: 'bg-purple-500',
      red: 'bg-red-500'
    };

    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {change !== undefined && (
              <p className={`text-sm ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {change >= 0 ? '+' : ''}{change}% from last period
              </p>
            )}
          </div>
          <div className={`${colorClasses[color]} p-3 rounded-full`}>
            <i className={`fas ${icon} text-white text-xl`}></i>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600">Comprehensive business insights and reports</p>
        </div>
        
        <div className="flex gap-4">
          {/* Period Selector */}
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>

          {/* Export Dropdown */}
          <div className="relative group">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2">
              <i className="fas fa-download"></i>
              Export
              <i className="fas fa-chevron-down"></i>
            </button>
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
              <div className="py-2">
                <button
                  onClick={() => exportReport('sales', 'csv')}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <i className="fas fa-file-csv mr-2"></i>
                  Sales Report (CSV)
                </button>
                <button
                  onClick={() => exportReport('sales', 'pdf')}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <i className="fas fa-file-pdf mr-2"></i>
                  Sales Report (PDF)
                </button>
                <button
                  onClick={() => exportReport('products', 'csv')}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <i className="fas fa-file-csv mr-2"></i>
                  Products Report (CSV)
                </button>
                <button
                  onClick={() => exportReport('revenue', 'pdf')}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <i className="fas fa-file-pdf mr-2"></i>
                  Revenue Report (PDF)
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        {[
          { id: 'overview', label: 'Overview', icon: 'fa-chart-line' },
          { id: 'sales', label: 'Sales', icon: 'fa-shopping-cart' },
          { id: 'products', label: 'Products', icon: 'fa-box' },
          { id: 'revenue', label: 'Revenue', icon: 'fa-dollar-sign' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 font-medium flex items-center gap-2 ${
              activeTab === tab.id
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <i className={`fas ${tab.icon}`}></i>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && dashboardStats && (
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total Revenue"
              value={formatCurrency(dashboardStats.data.overview.totalRevenue)}
              icon="fa-dollar-sign"
              color="green"
            />
            <StatCard
              title="Total Orders"
              value={dashboardStats.data.overview.totalOrders.toLocaleString()}
              icon="fa-shopping-cart"
              color="blue"
            />
            <StatCard
              title="Total Users"
              value={dashboardStats.data.overview.totalUsers.toLocaleString()}
              icon="fa-users"
              color="purple"
            />
            <StatCard
              title="Total Products"
              value={dashboardStats.data.overview.totalProducts.toLocaleString()}
              icon="fa-box"
              color="yellow"
            />
          </div>

          {/* Recent Orders & Top Products */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Orders */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Orders</h3>
              <div className="space-y-3">
                {dashboardStats.data.recentOrders.map((order) => (
                  <div key={order._id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">#{order.orderNumber}</p>
                      <p className="text-sm text-gray-600">
                        {order.customer.firstName} {order.customer.lastName}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatCurrency(order.pricing.total)}</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Products */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Products</h3>
              <div className="space-y-3">
                {dashboardStats.data.topProducts.map((product, index) => (
                  <div key={product._id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </span>
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-gray-600">{product.totalSold} sold</p>
                      </div>
                    </div>
                    <p className="font-medium">{formatCurrency(product.revenue)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sales Tab */}
      {activeTab === 'sales' && salesData && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <LineChart
              data={salesData.salesData.map(item => ({
                date: formatDate(item._id),
                orders: item.orders,
                revenue: item.revenue
              }))}
              xKey="date"
              yKey="orders"
              title="Orders Over Time"
              color="#3B82F6"
            />
            <AreaChart
              data={salesData.salesData.map(item => ({
                date: formatDate(item._id),
                revenue: item.revenue
              }))}
              xKey="date"
              yKey="revenue"
              title="Revenue Over Time"
              color="#10B981"
            />
          </div>
          
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
      )}

      {/* Products Tab */}
      {activeTab === 'products' && productData && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <BarChart
              data={productData.topProducts.slice(0, 10)}
              xKey="name"
              yKey="totalSold"
              title="Top Selling Products"
              color="#8B5CF6"
            />
            <PieChart
              data={productData.productsByCategory}
              dataKey="count"
              nameKey="_id"
              title="Products by Category"
            />
          </div>

          {/* Low Stock Alert */}
          {productData.lowStockProducts.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <i className="fas fa-exclamation-triangle text-yellow-500"></i>
                Low Stock Alert
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {productData.lowStockProducts.map((product) => (
                  <div key={product._id} className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-600">{product.categoryName}</p>
                    <p className="text-sm font-medium text-yellow-800">
                      Stock: {product.stock} units
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Revenue Tab */}
      {activeTab === 'revenue' && revenueData && (
        <div className="space-y-6">
          {/* Monthly Comparison */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Revenue Comparison</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-sm text-gray-600">Current Month</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(revenueData.monthlyComparison.current)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Previous Month</p>
                <p className="text-2xl font-bold text-gray-600">
                  {formatCurrency(revenueData.monthlyComparison.previous)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Growth Rate</p>
                <p className={`text-2xl font-bold ${
                  revenueData.monthlyComparison.growthRate >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {revenueData.monthlyComparison.growthRate >= 0 ? '+' : ''}
                  {revenueData.monthlyComparison.growthRate}%
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AreaChart
              data={revenueData.revenueData.map(item => ({
                date: formatDate(item._id),
                revenue: item.revenue
              }))}
              xKey="date"
              yKey="revenue"
              title="Daily Revenue"
              color="#F59E0B"
            />
            <PieChart
              data={revenueData.revenueByCategory.filter(item => item._id)}
              dataKey="revenue"
              nameKey="_id"
              title="Revenue by Category"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;