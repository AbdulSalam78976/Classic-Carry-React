import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';

dotenv.config();

const updateProductRatings = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Update all products to have rating fields if they don't exist
    const result = await Product.updateMany(
      {
        $or: [
          { averageRating: { $exists: false } },
          { totalReviews: { $exists: false } },
          { ratingDistribution: { $exists: false } }
        ]
      },
      {
        $set: {
          averageRating: 0,
          totalReviews: 0,
          ratingDistribution: {
            1: 0,
            2: 0,
            3: 0,
            4: 0,
            5: 0
          }
        }
      }
    );

    console.log(`Updated ${result.modifiedCount} products with rating fields`);
    
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error updating products:', error);
    process.exit(1);
  }
};

updateProductRatings();