import Review from '../models/Review.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import User from '../models/User.js';
import mongoose from 'mongoose';

// Helper function to update product rating statistics
const updateProductRating = async (productId) => {
  try {
    const reviews = await Review.find({ 
      product: productId, 
      isApproved: true 
    });

    if (reviews.length === 0) {
      await Product.findByIdAndUpdate(productId, {
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
      });
      return;
    }

    const totalReviews = reviews.length;
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / totalReviews;

    // Calculate rating distribution
    const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach(review => {
      ratingDistribution[review.rating]++;
    });

    await Product.findByIdAndUpdate(productId, {
      averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
      totalReviews,
      ratingDistribution
    });
  } catch (error) {
    console.error('Error updating product rating:', error);
  }
};

// Create a new review
export const createReview = async (req, res) => {
  try {
    const { productId, orderId, rating, title, comment, images } = req.body;
    const userId = req.user.id;

    // Validate required fields
    if (!productId || !orderId || !rating || !title || !comment) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Check if order exists and belongs to user
    const order = await Order.findOne({
      _id: orderId,
      'customer.email': req.user.email,
      status: 'delivered'
    });

    if (!order) {
      return res.status(400).json({
        success: false,
        message: 'Order not found or not delivered yet'
      });
    }

    // Check if product was in the order
    const productInOrder = order.items.find(item => item.productId === productId);
    if (!productInOrder) {
      return res.status(400).json({
        success: false,
        message: 'Product not found in this order'
      });
    }

    // Check if review already exists
    const existingReview = await Review.findOne({
      user: userId,
      product: productId,
      order: orderId
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this product for this order'
      });
    }

    // Create review
    const review = new Review({
      user: userId,
      product: productId,
      order: orderId,
      rating: parseInt(rating),
      title: title.trim(),
      comment: comment.trim(),
      images: images || []
    });

    await review.save();

    // Update product rating statistics
    await updateProductRating(productId);

    // Populate user info for response
    await review.populate('user', 'name');

    res.status(201).json({
      success: true,
      message: 'Review created successfully',
      review
    });
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Get reviews for a product
export const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

    const skip = (page - 1) * limit;

    const reviews = await Review.find({
      product: productId,
      isApproved: true
    })
    .populate('user', 'name')
    .sort({ [sortBy]: sortOrder })
    .skip(skip)
    .limit(limit);

    const totalReviews = await Review.countDocuments({
      product: productId,
      isApproved: true
    });

    res.json({
      success: true,
      reviews,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalReviews / limit),
        totalReviews,
        hasNext: page < Math.ceil(totalReviews / limit),
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get product reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Get user's reviews
export const getUserReviews = async (req, res) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const reviews = await Review.find({ user: userId })
      .populate('product', 'name mainImage')
      .populate('order', 'orderNumber')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalReviews = await Review.countDocuments({ user: userId });

    res.json({
      success: true,
      reviews,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalReviews / limit),
        totalReviews,
        hasNext: page < Math.ceil(totalReviews / limit),
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get user reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Get reviewable products for user (products from delivered orders that haven't been reviewed)
export const getReviewableProducts = async (req, res) => {
  try {
    const userEmail = req.user.email;

    // Get all delivered orders for the user
    const deliveredOrders = await Order.find({
      'customer.email': userEmail,
      status: 'delivered'
    });

    if (deliveredOrders.length === 0) {
      return res.json({
        success: true,
        reviewableProducts: []
      });
    }

    // Get all products from delivered orders
    const reviewableProducts = [];
    
    for (const order of deliveredOrders) {
      for (const item of order.items) {
        // Check if user has already reviewed this product for this order
        const existingReview = await Review.findOne({
          user: req.user.id,
          product: item.productId,
          order: order._id
        });

        if (!existingReview) {
          // Get full product details
          const product = await Product.findOne({ id: item.productId });
          if (product) {
            reviewableProducts.push({
              product: {
                _id: product._id,
                id: product.id,
                name: product.name,
                mainImage: product.mainImage
              },
              order: {
                _id: order._id,
                orderNumber: order.orderNumber,
                createdAt: order.createdAt
              },
              orderItem: item
            });
          }
        }
      }
    }

    res.json({
      success: true,
      reviewableProducts
    });
  } catch (error) {
    console.error('Get reviewable products error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Update review (only by the review author)
export const updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, title, comment, images } = req.body;
    const userId = req.user.id;

    const review = await Review.findOne({
      _id: reviewId,
      user: userId
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Update fields
    if (rating) review.rating = parseInt(rating);
    if (title) review.title = title.trim();
    if (comment) review.comment = comment.trim();
    if (images !== undefined) review.images = images;

    await review.save();

    // Update product rating statistics
    await updateProductRating(review.product);

    await review.populate('user', 'name');

    res.json({
      success: true,
      message: 'Review updated successfully',
      review
    });
  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Delete review (only by the review author)
export const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user.id;

    const review = await Review.findOne({
      _id: reviewId,
      user: userId
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    const productId = review.product;
    await Review.findByIdAndDelete(reviewId);

    // Update product rating statistics
    await updateProductRating(productId);

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Admin: Get all reviews
export const getAllReviews = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const status = req.query.status; // 'approved', 'pending', 'all'

    const skip = (page - 1) * limit;
    
    let filter = {};
    if (status === 'approved') {
      filter.isApproved = true;
    } else if (status === 'pending') {
      filter.isApproved = false;
    }

    const reviews = await Review.find(filter)
      .populate('user', 'name email')
      .populate('product', 'name mainImage')
      .populate('order', 'orderNumber')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalReviews = await Review.countDocuments(filter);

    res.json({
      success: true,
      reviews,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalReviews / limit),
        totalReviews,
        hasNext: page < Math.ceil(totalReviews / limit),
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get all reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Admin: Approve/Disapprove review
export const toggleReviewApproval = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { isApproved } = req.body;

    const review = await Review.findByIdAndUpdate(
      reviewId,
      { isApproved },
      { new: true }
    ).populate('user', 'name email')
     .populate('product', 'name');

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Update product rating statistics
    await updateProductRating(review.product._id);

    res.json({
      success: true,
      message: `Review ${isApproved ? 'approved' : 'disapproved'} successfully`,
      review
    });
  } catch (error) {
    console.error('Toggle review approval error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Admin: Delete review
export const adminDeleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    const productId = review.product;
    await Review.findByIdAndDelete(reviewId);

    // Update product rating statistics
    await updateProductRating(productId);

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    console.error('Admin delete review error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};