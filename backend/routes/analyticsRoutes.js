import express from 'express';
import {
  getDashboardStats,
  getSalesAnalytics,
  getProductAnalytics,
  getUserAnalytics,
  getRevenueAnalytics
} from '../controllers/analyticsController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require admin authentication
router.use(protect, admin);

// Dashboard stats
router.get('/dashboard', getDashboardStats);

// Sales analytics
router.get('/sales', getSalesAnalytics);

// Product analytics
router.get('/products', getProductAnalytics);

// User analytics
router.get('/users', getUserAnalytics);

// Revenue analytics
router.get('/revenue', getRevenueAnalytics);

// Export routes (we'll implement these later)
router.get('/export/:type/:format', (req, res) => {
  res.json({
    success: false,
    message: 'Export functionality coming soon'
  });
});

export default router;