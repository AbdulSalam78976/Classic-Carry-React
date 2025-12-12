import express from 'express';
import {
  createReview,
  getProductReviews,
  getUserReviews,
  getReviewableProducts,
  updateReview,
  deleteReview,
  getAllReviews,
  toggleReviewApproval,
  adminDeleteReview
} from '../controllers/reviewController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/product/:productId', getProductReviews);

// Protected routes (require authentication)
router.use(protect);

// User routes
router.post('/', createReview);
router.get('/user/reviews', getUserReviews);
router.get('/user/reviewable', getReviewableProducts);
router.put('/:reviewId', updateReview);
router.delete('/:reviewId', deleteReview);

// Admin routes
router.get('/admin/all', admin, getAllReviews);
router.put('/admin/:reviewId/approval', admin, toggleReviewApproval);
router.delete('/admin/:reviewId', admin, adminDeleteReview);

export default router;