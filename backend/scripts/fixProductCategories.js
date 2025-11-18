import dotenv from 'dotenv';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import connectDB from '../config/db.js';

dotenv.config();

const fixProductCategories = async () => {
  try {
    await connectDB();

    console.log('\n🔧 Fixing product categories...\n');
    
    const products = await Product.find();
    
    for (const product of products) {
      const category = await Category.findById(product.category);
      if (category) {
        const oldCategoryName = product.categoryName;
        product.categoryName = category.name;
        await product.save();
        console.log(`✅ Fixed: ${product.name}`);
        console.log(`   Old category name: ${oldCategoryName}`);
        console.log(`   New category name: ${category.name}`);
      } else {
        console.log(`⚠️  Warning: ${product.name} has invalid category reference`);
      }
    }
    
    console.log('\n✨ Done!\n');
    process.exit();
  } catch (error) {
    console.error(`❌ Error: ${error}`);
    process.exit(1);
  }
};

fixProductCategories();
