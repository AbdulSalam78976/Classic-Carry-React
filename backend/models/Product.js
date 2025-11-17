import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: 0
  },
  category: {
    type: String,
    required: [true, 'Product category is required'],
    enum: ['summer', 'winter', 'male', 'female', 'sports', 'long', 'cardholder']
  },
  mainImage: {
    type: String,
    required: true
  },
  images: [{
    type: String
  }],
  description: {
    type: String,
    default: ''
  },
  tag: {
    type: String,
    default: ''
  },
  colors: [{
    type: String
  }],
  features: [{
    type: String
  }],
  specifications: {
    type: Map,
    of: String
  },
  stock: {
    type: Number,
    default: 100,
    min: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  productType: {
    type: String,
    enum: ['cap', 'wallet'],
    required: true
  }
}, {
  timestamps: true
});

// Index for faster queries
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ productType: 1 });

const Product = mongoose.model('Product', productSchema);

export default Product;
