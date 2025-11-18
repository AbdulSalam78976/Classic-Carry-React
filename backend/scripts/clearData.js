import dotenv from 'dotenv';
import Product from '../models/Product.js';
import User from '../models/User.js';
import Category from '../models/Category.js';
import connectDB from '../config/db.js';

dotenv.config();

const clearData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await Product.deleteMany();
    await Category.deleteMany();

    console.log('🗑️  All categories and products cleared!');

    // Ensure admin user exists
    const adminExists = await User.findOne({ email: 'admin@classiccarrry.com' });
    
    if (!adminExists) {
      await User.create({
        name: 'Admin User',
        email: 'admin@classiccarrry.com',
        password: 'admin123',
        role: 'admin'
      });
      console.log('✅ Admin user created');
    } else {
      console.log('✅ Admin user already exists');
    }

    console.log('🎉 Database cleared! Ready for fresh data via admin panel.');
    
    process.exit();
  } catch (error) {
    console.error(`❌ Error: ${error}`);
    process.exit(1);
  }
};

clearData();