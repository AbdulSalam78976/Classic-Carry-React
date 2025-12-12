import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Import models
import User from '../models/User.js';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import Order from '../models/Order.js';
import Review from '../models/Review.js';

dotenv.config();

const verifyDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Check Categories
    const categories = await Category.find({});
    console.log(`📁 Categories: ${categories.length}`);
    categories.forEach(cat => {
      console.log(`   - ${cat.name} (${cat.slug})`);
    });

    // Check Products with ratings
    const products = await Product.find({});
    console.log(`\n📦 Products: ${products.length}`);
    products.forEach(product => {
      console.log(`   - ${product.name} - Rs ${product.price.toLocaleString()}`);
      console.log(`     Rating: ${product.averageRating}★ (${product.totalReviews} reviews)`);
      console.log(`     Stock: ${product.stock} | Category: ${product.categoryName}`);
    });

    // Check Users
    const users = await User.find({});
    console.log(`\n👤 Users: ${users.length}`);
    users.forEach(user => {
      console.log(`   - ${user.name} (${user.email}) - Role: ${user.role}`);
    });

    // Check Orders
    const orders = await Order.find({});
    console.log(`\n📋 Orders: ${orders.length}`);
    orders.forEach(order => {
      console.log(`   - ${order.orderNumber} - ${order.customer.firstName} ${order.customer.lastName}`);
      console.log(`     Status: ${order.status} | Total: Rs ${order.pricing.total.toLocaleString()}`);
    });

    // Check Reviews
    const reviews = await Review.find({}).populate('user', 'name').populate('product', 'name');
    console.log(`\n⭐ Reviews: ${reviews.length}`);
    reviews.forEach(review => {
      console.log(`   - ${review.rating}★ by ${review.user?.name || 'Unknown'}`);
      console.log(`     Product: ${review.product?.name || 'Unknown'}`);
      console.log(`     Title: ${review.title}`);
      if (review.images && review.images.length > 0) {
        console.log(`     Images: ${review.images.length}`);
      }
    });

    console.log('\n✅ Database verification completed!');

  } catch (error) {
    console.error('❌ Error during verification:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');
  }
};

verifyDB();