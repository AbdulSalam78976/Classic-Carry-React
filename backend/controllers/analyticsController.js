import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import Review from '../models/Review.js';
import Category from '../models/Category.js';
import mongoose from 'mongoose';

// Helper function to get date range
// Helper function to get date range
const getAnalyticsDates = (query) => {
  if (query.startDate && query.endDate) {
    return {
      startDate: new Date(query.startDate),
      endDate: new Date(query.endDate)
    };
  }

  const period = query.period || 'month';
  const now = new Date();
  let startDate, endDate = now;

  switch (period) {
    case 'today':
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      break;
    case 'week':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case 'month':
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    case 'quarter':
      const quarterStart = Math.floor(now.getMonth() / 3) * 3;
      startDate = new Date(now.getFullYear(), quarterStart, 1);
      break;
    case 'year':
      startDate = new Date(now.getFullYear(), 0, 1);
      break;
    default:
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  }

  return { startDate, endDate };
};

// Dashboard overview stats
export const getDashboardStats = async (req, res) => {
  try {
    const { startDate, endDate } = getAnalyticsDates(req.query);

    // Total stats
    const [
      totalOrders,
      totalUsers,
      totalProducts,
      totalRevenue,
      periodOrders,
      periodRevenue,
      pendingOrders,
      deliveredOrders
    ] = await Promise.all([
      Order.countDocuments(),
      User.countDocuments({ role: 'user' }),
      Product.countDocuments({ isActive: true }),
      Order.aggregate([
        { $match: { paymentStatus: 'paid' } },
        { $group: { _id: null, total: { $sum: '$pricing.total' } } }
      ]),
      Order.countDocuments({
        createdAt: { $gte: startDate, $lte: endDate }
      }),
      Order.aggregate([
        {
          $match: {
            paymentStatus: 'paid',
            createdAt: { $gte: startDate, $lte: endDate }
          }
        },
        { $group: { _id: null, total: { $sum: '$pricing.total' } } }
      ]),
      Order.countDocuments({ status: 'pending' }),
      Order.countDocuments({ status: 'delivered' })
    ]);

    // Recent orders
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('orderNumber customer.firstName customer.lastName pricing.total status createdAt');

    // Top products
    const topProducts = await Order.aggregate([
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.productId',
          name: { $first: '$items.name' },
          totalSold: { $sum: '$items.quantity' },
          revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 }
    ]);

    res.json({
      success: true,
      data: {
        overview: {
          totalOrders,
          totalUsers,
          totalProducts,
          totalRevenue: totalRevenue[0]?.total || 0,
          periodOrders,
          periodRevenue: periodRevenue[0]?.total || 0,
          pendingOrders,
          deliveredOrders
        },
        recentOrders,
        topProducts
      }
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Sales analytics
export const getSalesAnalytics = async (req, res) => {
  try {
    const { groupBy = 'day' } = req.query;
    const { startDate, endDate } = getAnalyticsDates(req.query);

    // Group by format
    let groupFormat;
    switch (groupBy) {
      case 'hour':
        groupFormat = { $dateToString: { format: '%Y-%m-%d %H:00', date: '$createdAt' } };
        break;
      case 'day':
        groupFormat = { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } };
        break;
      case 'week':
        groupFormat = { $dateToString: { format: '%Y-W%U', date: '$createdAt' } };
        break;
      case 'month':
        groupFormat = { $dateToString: { format: '%Y-%m', date: '$createdAt' } };
        break;
      default:
        groupFormat = { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } };
    }

    const salesData = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
          paymentStatus: 'paid'
        }
      },
      {
        $group: {
          _id: groupFormat,
          orders: { $sum: 1 },
          revenue: { $sum: '$pricing.total' },
          avgOrderValue: { $avg: '$pricing.total' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Sales by status
    const salesByStatus = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          revenue: { $sum: '$pricing.total' }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        salesData,
        salesByStatus
      }
    });
  } catch (error) {
    console.error('Sales analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Product analytics
export const getProductAnalytics = async (req, res) => {
  try {
    const { startDate, endDate } = getAnalyticsDates(req.query);

    // Top selling products
    const topProducts = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
          paymentStatus: 'paid'
        }
      },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.productId',
          name: { $first: '$items.name' },
          totalSold: { $sum: '$items.quantity' },
          revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
          avgPrice: { $avg: '$items.price' }
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: 10 }
    ]);

    // Products by category
    const productsByCategory = await Product.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$categoryName',
          count: { $sum: 1 },
          avgPrice: { $avg: '$price' },
          avgRating: { $avg: '$averageRating' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Low stock products
    const lowStockProducts = await Product.find({
      isActive: true,
      stock: { $lt: 10 }
    })
      .select('name stock price categoryName')
      .sort({ stock: 1 })
      .limit(10);

    // Product ratings distribution
    const ratingsDistribution = await Product.aggregate([
      { $match: { isActive: true, totalReviews: { $gt: 0 } } },
      {
        $bucket: {
          groupBy: '$averageRating',
          boundaries: [0, 1, 2, 3, 4, 5, 6],
          default: 'Other',
          output: {
            count: { $sum: 1 },
            avgRating: { $avg: '$averageRating' }
          }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        topProducts,
        productsByCategory,
        lowStockProducts,
        ratingsDistribution
      }
    });
  } catch (error) {
    console.error('Product analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// User analytics
export const getUserAnalytics = async (req, res) => {
  try {
    const { startDate, endDate } = getAnalyticsDates(req.query);

    // User registrations over time
    const userRegistrations = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
          role: 'user'
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Customer lifetime value
    const customerLTV = await Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      {
        $group: {
          _id: '$customer.email',
          totalOrders: { $sum: 1 },
          totalSpent: { $sum: '$pricing.total' },
          avgOrderValue: { $avg: '$pricing.total' },
          firstOrder: { $min: '$createdAt' },
          lastOrder: { $max: '$createdAt' }
        }
      },
      {
        $addFields: {
          customerLifetime: {
            $divide: [
              { $subtract: ['$lastOrder', '$firstOrder'] },
              1000 * 60 * 60 * 24 // Convert to days
            ]
          }
        }
      },
      { $sort: { totalSpent: -1 } },
      { $limit: 10 }
    ]);

    // Active vs inactive users
    const userActivity = await User.aggregate([
      { $match: { role: 'user' } },
      {
        $lookup: {
          from: 'orders',
          localField: 'email',
          foreignField: 'customer.email',
          as: 'orders'
        }
      },
      {
        $addFields: {
          hasOrders: { $gt: [{ $size: '$orders' }, 0] },
          lastOrderDate: { $max: '$orders.createdAt' }
        }
      },
      {
        $group: {
          _id: {
            $cond: [
              { $gt: ['$lastOrderDate', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)] },
              'active',
              { $cond: [{ $eq: ['$hasOrders', true] }, 'inactive', 'never_ordered'] }
            ]
          },
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        userRegistrations,
        customerLTV,
        userActivity
      }
    });
  } catch (error) {
    console.error('User analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Revenue analytics
export const getRevenueAnalytics = async (req, res) => {
  try {
    const { startDate, endDate } = getAnalyticsDates(req.query);

    // Revenue over time
    const revenueData = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
          paymentStatus: 'paid'
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          revenue: { $sum: '$pricing.total' },
          orders: { $sum: 1 },
          avgOrderValue: { $avg: '$pricing.total' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Revenue by category
    const revenueByCategory = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
          paymentStatus: 'paid'
        }
      },
      { $unwind: '$items' },
      {
        $lookup: {
          from: 'products',
          localField: 'items.productId',
          foreignField: 'id',
          as: 'product'
        }
      },
      { $unwind: { path: '$product', preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: '$product.categoryName',
          revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
          orders: { $sum: 1 },
          quantity: { $sum: '$items.quantity' }
        }
      },
      { $sort: { revenue: -1 } }
    ]);

    // Monthly comparison
    const currentMonth = new Date();
    const lastMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
    const currentMonthEnd = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);

    const [currentMonthRevenue, lastMonthRevenue] = await Promise.all([
      Order.aggregate([
        {
          $match: {
            createdAt: { $gte: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1), $lte: currentMonthEnd },
            paymentStatus: 'paid'
          }
        },
        { $group: { _id: null, total: { $sum: '$pricing.total' } } }
      ]),
      Order.aggregate([
        {
          $match: {
            createdAt: { $gte: lastMonth, $lt: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1) },
            paymentStatus: 'paid'
          }
        },
        { $group: { _id: null, total: { $sum: '$pricing.total' } } }
      ])
    ]);

    const currentTotal = currentMonthRevenue[0]?.total || 0;
    const lastTotal = lastMonthRevenue[0]?.total || 0;
    const growthRate = lastTotal > 0 ? ((currentTotal - lastTotal) / lastTotal) * 100 : 0;

    res.json({
      success: true,
      data: {
        revenueData,
        revenueByCategory,
        monthlyComparison: {
          current: currentTotal,
          previous: lastTotal,
          growthRate: Math.round(growthRate * 100) / 100
        }
      }
    });
  } catch (error) {
    console.error('Revenue analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};