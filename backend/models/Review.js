import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'Product is required']
  },
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: [true, 'Order is required']
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: 1,
    max: 5
  },
  title: {
    type: String,
    required: [true, 'Review title is required'],
    trim: true,
    maxlength: 100
  },
  comment: {
    type: String,
    required: [true, 'Review comment is required'],
    trim: true,
    maxlength: 1000
  },
  isVerified: {
    type: Boolean,
    default: true // Since reviews are only allowed after order completion
  },
  isApproved: {
    type: Boolean,
    default: true // Auto-approve for now, can be changed to false for moderation
  },
  helpfulVotes: {
    type: Number,
    default: 0
  },
  images: [{
    type: String,
    validate: {
      validator: function(v) {
        // Allow empty strings or valid URLs/paths
        return !v || /^(https?:\/\/|\/uploads\/)/.test(v);
      },
      message: 'Invalid image URL or path'
    }
  }]
}, {
  timestamps: true
});

// Compound index to ensure one review per user per product per order
reviewSchema.index({ user: 1, product: 1, order: 1 }, { unique: true });

// Index for faster queries
reviewSchema.index({ product: 1, isApproved: 1 });
reviewSchema.index({ user: 1 });

const Review = mongoose.model('Review', reviewSchema);

export default Review;