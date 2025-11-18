import dotenv from 'dotenv';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import connectDB from '../config/db.js';

dotenv.config();

const checkProducts = async () => {
  try {
    await connectDB();

    console.log('\n📦 Checking Products...\n');
    
    const products = await Product.find().populate('category');
    
    console.log(`Total products: ${products.length}\n`);
    
    products.forEach(product => {
      console.log(`Product: ${product.name}`);
      console.log(`  ID: ${product.id}`);
      console.log(`  Category ID: ${product.category?._id || product.category}`);
      console.log(`  Category Name: ${product.category?.name || product.categoryName || 'N/A'}`);
      console.log(`  CategoryName field: ${product.categoryName}`);
      console.log('---');
    });

    console.log('\n📁 Checking Categories...\n');
    
    const categories = await Category.find();
    
    console.log(`Total categories: ${categories.length}\n`);
    
    categories.forEach(category => {
      console.log(`Category: ${category.name}`);
      console.log(`  ID: ${category._id}`);
      console.log(`  Slug: ${category.slug}`);
      console.log(`  Active: ${category.isActive}`);
      console.log('---');
    });
    
    process.exit();
  } catch (error) {
    console.error(`❌ Error: ${error}`);
    process.exit(1);
  }
};

checkProducts();
