import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

// Import all models
import User from '../models/User.js';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import Order from '../models/Order.js';
import Review from '../models/Review.js';
import Coupon from '../models/Coupon.js';
import HeroImage from '../models/HeroImage.js';
import { ContactInfo, FAQ, AppearanceSettings, GeneralSettings } from '../models/Settings.js';
import Contact from '../models/Contact.js';
import Newsletter from '../models/Newsletter.js';

dotenv.config();

const resetAndSeedDB = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear all collections
    console.log('\n🗑️  Clearing all collections...');
    await User.deleteMany({});
    await Product.deleteMany({});
    await Category.deleteMany({});
    await Order.deleteMany({});
    await Review.deleteMany({});
    await Coupon.deleteMany({});
    await HeroImage.deleteMany({});
    await ContactInfo.deleteMany({});
    await FAQ.deleteMany({});
    await AppearanceSettings.deleteMany({});
    await GeneralSettings.deleteMany({});
    await Contact.deleteMany({});
    await Newsletter.deleteMany({});
    console.log('✅ All collections cleared');

    // Create Categories (Only 4 for clean header design)
    console.log('\n📁 Creating categories...');
    const categories = await Category.insertMany([
      {
        name: 'Electronics',
        slug: 'electronics',
        description: 'Latest electronic gadgets and devices',
        image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500',
        isActive: true,
        isFeatured: true
      },
      {
        name: 'Fashion',
        slug: 'fashion',
        description: 'Trendy clothing and accessories',
        image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500',
        isActive: true,
        isFeatured: true
      },
      {
        name: 'Home & Living',
        slug: 'home-living',
        description: 'Home decor and lifestyle products',
        image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500',
        isActive: true,
        isFeatured: true
      },
      {
        name: 'Sports',
        slug: 'sports',
        description: 'Sports equipment and fitness gear',
        image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500',
        isActive: true,
        isFeatured: true
      }
    ]);
    console.log(`✅ Created ${categories.length} categories`);

    // Create Products with rating fields
    console.log('\n📦 Creating products...');
    const products = await Product.insertMany([
      // Electronics
      {
        id: 'ELEC001',
        name: 'Wireless Bluetooth Headphones',
        price: 15999,
        category: categories[0]._id,
        categoryName: categories[0].name,
        mainImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
        images: [
          'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
          'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500'
        ],
        description: 'Premium wireless headphones with noise cancellation and 30-hour battery life.',
        colors: ['Black', 'White', 'Blue'],
        features: ['Noise Cancellation', '30-hour Battery', 'Wireless Charging', 'Premium Sound Quality'],
        specifications: {
          'Battery Life': '30 hours',
          'Connectivity': 'Bluetooth 5.0',
          'Weight': '250g',
          'Warranty': '2 years'
        },
        stock: 50,
        isActive: true,
        isFeatured: true,
        isHot: true,
        averageRating: 4.5,
        totalReviews: 128,
        ratingDistribution: { 1: 2, 2: 5, 3: 15, 4: 45, 5: 61 }
      },
      {
        id: 'ELEC002',
        name: 'Smart Watch Series X',
        price: 25999,
        category: categories[0]._id,
        categoryName: categories[0].name,
        mainImage: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
        images: [
          'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
          'https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=500'
        ],
        description: 'Advanced smartwatch with health monitoring, GPS, and 7-day battery life.',
        colors: ['Silver', 'Gold', 'Space Gray'],
        sizes: ['38mm', '42mm', '45mm'],
        features: ['Heart Rate Monitor', 'GPS Tracking', 'Water Resistant', '7-day Battery'],
        specifications: {
          'Display': 'AMOLED Retina',
          'Battery': '7 days',
          'Water Resistance': '50m',
          'Sensors': 'Heart Rate, GPS, Accelerometer'
        },
        stock: 35,
        isActive: true,
        isFeatured: true,
        averageRating: 4.7,
        totalReviews: 89,
        ratingDistribution: { 1: 1, 2: 2, 3: 8, 4: 25, 5: 53 }
      },
      {
        id: 'ELEC003',
        name: 'Portable Power Bank 20000mAh',
        price: 4999,
        category: categories[0]._id,
        categoryName: categories[0].name,
        mainImage: 'https://images.unsplash.com/photo-1609592806787-3d9c4d5b4e4d?w=500',
        images: ['https://images.unsplash.com/photo-1609592806787-3d9c4d5b4e4d?w=500'],
        description: 'High-capacity power bank with fast charging and multiple USB ports.',
        colors: ['Black', 'White'],
        features: ['20000mAh Capacity', 'Fast Charging', 'Multiple Ports', 'LED Display'],
        stock: 75,
        isActive: true,
        averageRating: 4.3,
        totalReviews: 156,
        ratingDistribution: { 1: 3, 2: 8, 3: 22, 4: 67, 5: 56 }
      },

      // Fashion
      {
        id: 'CLOTH001',
        name: 'Premium Cotton T-Shirt',
        price: 2999,
        category: categories[1]._id,
        categoryName: categories[1].name,
        mainImage: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
        images: [
          'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
          'https://images.unsplash.com/photo-1583743814966-8936f37f4678?w=500'
        ],
        description: '100% premium cotton t-shirt with comfortable fit and durable quality.',
        colors: ['White', 'Black', 'Navy', 'Gray', 'Red'],
        sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
        features: ['100% Cotton', 'Pre-shrunk', 'Comfortable Fit', 'Durable Quality'],
        stock: 120,
        isActive: true,
        isFeatured: true,
        averageRating: 4.4,
        totalReviews: 203,
        ratingDistribution: { 1: 4, 2: 12, 3: 28, 4: 89, 5: 70 }
      },
      {
        id: 'CLOTH002',
        name: 'Denim Jacket Classic',
        price: 8999,
        category: categories[1]._id,
        categoryName: categories[1].name,
        mainImage: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500',
        images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500'],
        description: 'Classic denim jacket with vintage wash and comfortable fit.',
        colors: ['Blue', 'Black', 'Light Blue'],
        sizes: ['S', 'M', 'L', 'XL'],
        features: ['Premium Denim', 'Vintage Wash', 'Classic Fit', 'Multiple Pockets'],
        stock: 45,
        isActive: true,
        isHot: true,
        averageRating: 4.6,
        totalReviews: 67,
        ratingDistribution: { 1: 1, 2: 3, 3: 8, 4: 22, 5: 33 }
      },
      {
        id: 'CLOTH003',
        name: 'Running Shoes Pro',
        price: 12999,
        category: categories[1]._id,
        categoryName: categories[1].name,
        mainImage: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
        images: [
          'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
          'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500'
        ],
        description: 'Professional running shoes with advanced cushioning and breathable design.',
        colors: ['White', 'Black', 'Red', 'Blue'],
        sizes: ['7', '8', '9', '10', '11', '12'],
        features: ['Advanced Cushioning', 'Breathable Mesh', 'Lightweight', 'Durable Sole'],
        stock: 60,
        isActive: true,
        isFeatured: true,
        averageRating: 4.8,
        totalReviews: 142,
        ratingDistribution: { 1: 1, 2: 2, 3: 5, 4: 28, 5: 106 }
      },

      // Home & Living
      {
        id: 'HOME001',
        name: 'Ceramic Coffee Mug Set',
        price: 3999,
        category: categories[2]._id,
        categoryName: categories[2].name,
        mainImage: 'https://images.unsplash.com/photo-1514228742587-6b1558fcf93a?w=500',
        images: ['https://images.unsplash.com/photo-1514228742587-6b1558fcf93a?w=500'],
        description: 'Set of 4 premium ceramic coffee mugs with elegant design.',
        colors: ['White', 'Blue', 'Green'],
        features: ['Premium Ceramic', 'Dishwasher Safe', 'Microwave Safe', 'Set of 4'],
        stock: 80,
        isActive: true,
        averageRating: 4.2,
        totalReviews: 94,
        ratingDistribution: { 1: 2, 2: 6, 3: 18, 4: 38, 5: 30 }
      },
      {
        id: 'HOME002',
        name: 'LED Desk Lamp Modern',
        price: 6999,
        category: categories[2]._id,
        categoryName: categories[2].name,
        mainImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500',
        images: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500'],
        description: 'Modern LED desk lamp with adjustable brightness and USB charging port.',
        colors: ['White', 'Black'],
        features: ['LED Technology', 'Adjustable Brightness', 'USB Charging Port', 'Touch Control'],
        stock: 40,
        isActive: true,
        isFeatured: true,
        averageRating: 4.5,
        totalReviews: 76,
        ratingDistribution: { 1: 1, 2: 4, 3: 12, 4: 29, 5: 30 }
      },

      // Sports & Fitness
      {
        id: 'SPORT001',
        name: 'Yoga Mat Premium',
        price: 4999,
        category: categories[3]._id,
        categoryName: categories[3].name,
        mainImage: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500',
        images: ['https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500'],
        description: 'Premium yoga mat with non-slip surface and extra cushioning.',
        colors: ['Purple', 'Blue', 'Pink', 'Green'],
        features: ['Non-slip Surface', 'Extra Cushioning', 'Eco-friendly', 'Lightweight'],
        stock: 65,
        isActive: true,
        averageRating: 4.4,
        totalReviews: 112,
        ratingDistribution: { 1: 2, 2: 7, 3: 18, 4: 45, 5: 40 }
      },
      {
        id: 'SPORT002',
        name: 'Resistance Bands Set',
        price: 2999,
        category: categories[3]._id,
        categoryName: categories[3].name,
        mainImage: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500',
        images: ['https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500'],
        description: 'Complete resistance bands set with multiple resistance levels.',
        colors: ['Multi-color'],
        features: ['Multiple Resistance Levels', 'Portable', 'Durable Material', 'Exercise Guide'],
        stock: 90,
        isActive: true,
        isHot: true,
        averageRating: 4.3,
        totalReviews: 87,
        ratingDistribution: { 1: 2, 2: 5, 3: 15, 4: 35, 5: 30 }
      },

      // Books & Media
      {
        id: 'BOOK001',
        name: 'Programming Fundamentals Book',
        price: 3999,
        category: categories[4]._id,
        categoryName: categories[4].name,
        mainImage: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500',
        images: ['https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500'],
        description: 'Comprehensive guide to programming fundamentals for beginners.',
        features: ['Beginner Friendly', 'Practical Examples', 'Exercise Solutions', 'Latest Edition'],
        stock: 100,
        isActive: true,
        averageRating: 4.7,
        totalReviews: 234,
        ratingDistribution: { 1: 3, 2: 8, 3: 25, 4: 78, 5: 120 }
      }
    ]);
    console.log(`✅ Created ${products.length} products`);

    // Create Admin User
    console.log('\n👤 Creating admin user...');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@classiccarrry.com',
      password: hashedPassword,
      role: 'admin',
      phone: '+92-300-1234567',
      address: {
        street: '123 Admin Street',
        city: 'Karachi',
        state: 'Sindh',
        province: 'Sindh',
        postalCode: '75500',
        country: 'Pakistan'
      },
      isActive: true
    });
    console.log('✅ Admin user created');

    // Create Test Users
    console.log('\n👥 Creating test users...');
    const testUsers = await User.insertMany([
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: await bcrypt.hash('password123', 10),
        role: 'user',
        phone: '+92-300-1111111',
        isActive: true
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: await bcrypt.hash('password123', 10),
        role: 'user',
        phone: '+92-300-2222222',
        isActive: true
      },
      {
        name: 'Ali Ahmed',
        email: 'ali@example.com',
        password: await bcrypt.hash('password123', 10),
        role: 'user',
        phone: '+92-300-3333333',
        isActive: true
      }
    ]);
    console.log(`✅ Created ${testUsers.length} test users`);

    // Create Sample Orders
    console.log('\n📋 Creating sample orders...');
    const sampleOrders = [];
    
    // Create first order
    const order1 = new Order({
      customer: {
        email: 'john@example.com',
        firstName: 'John',
        lastName: 'Doe',
        phone: '+92-300-1111111',
        address: '123 Main Street',
        city: 'Karachi',
        province: 'Sindh',
        postalCode: '75500'
      },
      items: [
        {
          productId: products[0].id,
          name: products[0].name,
          price: products[0].price,
          quantity: 1,
          image: products[0].mainImage,
          color: 'Black'
        }
      ],
      pricing: {
        subtotal: products[0].price,
        deliveryCharge: 500,
        total: products[0].price + 500
      },
      status: 'delivered',
      paymentStatus: 'paid'
    });
    await order1.save();
    sampleOrders.push(order1);

    // Create second order
    const order2 = new Order({
      customer: {
        email: 'jane@example.com',
        firstName: 'Jane',
        lastName: 'Smith',
        phone: '+92-300-2222222',
        address: '456 Oak Avenue',
        city: 'Lahore',
        province: 'Punjab',
        postalCode: '54000'
      },
      items: [
        {
          productId: products[3].id,
          name: products[3].name,
          price: products[3].price,
          quantity: 2,
          image: products[3].mainImage,
          color: 'White',
          size: 'M'
        }
      ],
      pricing: {
        subtotal: products[3].price * 2,
        deliveryCharge: 500,
        total: (products[3].price * 2) + 500
      },
      status: 'delivered',
      paymentStatus: 'paid'
    });
    await order2.save();
    sampleOrders.push(order2);

    // Create third order for more review testing
    const order3 = new Order({
      customer: {
        email: 'ali@example.com',
        firstName: 'Ali',
        lastName: 'Ahmed',
        phone: '+92-300-3333333',
        address: '789 Pine Street',
        city: 'Islamabad',
        province: 'Islamabad Capital Territory',
        postalCode: '44000'
      },
      items: [
        {
          productId: products[1].id,
          name: products[1].name,
          price: products[1].price,
          quantity: 1,
          image: products[1].mainImage,
          color: 'Silver',
          size: '42mm'
        }
      ],
      pricing: {
        subtotal: products[1].price,
        deliveryCharge: 500,
        total: products[1].price + 500
      },
      status: 'delivered',
      paymentStatus: 'paid'
    });
    await order3.save();
    sampleOrders.push(order3);

    console.log(`✅ Created ${sampleOrders.length} sample orders`);

    // Create Sample Reviews
    console.log('\n⭐ Creating sample reviews...');
    const sampleReviews = await Review.insertMany([
      {
        user: testUsers[0]._id,
        product: products[0]._id,
        order: sampleOrders[0]._id,
        rating: 5,
        title: 'Excellent sound quality!',
        comment: 'These headphones are amazing! The sound quality is crystal clear and the noise cancellation works perfectly. Battery life is exactly as advertised.',
        images: [
          'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300',
          'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=300'
        ],
        isVerified: true,
        isApproved: true
      },
      {
        user: testUsers[1]._id,
        product: products[3]._id,
        order: sampleOrders[1]._id,
        rating: 4,
        title: 'Great quality t-shirt',
        comment: 'Very comfortable and good quality cotton. The fit is perfect and it feels very soft. Only minor issue is that it shrunk slightly after first wash.',
        images: [
          'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300'
        ],
        isVerified: true,
        isApproved: true
      },
      {
        user: testUsers[2]._id,
        product: products[1]._id,
        order: sampleOrders[0]._id,
        rating: 5,
        title: 'Best smartwatch I\'ve owned',
        comment: 'This smartwatch has exceeded my expectations. The health monitoring features are accurate and the battery really does last a week. Highly recommended!',
        isVerified: true,
        isApproved: true
      }
    ]);
    console.log(`✅ Created ${sampleReviews.length} sample reviews`);

    // Create Settings
    console.log('\n⚙️  Creating settings...');
    
    // Appearance Settings
    await AppearanceSettings.create({
      siteName: 'Classic Carrry',
      brandEmoji: '✨',
      tagline: 'Premium Lifestyle Products',
      showNewsletter: true,
      showSocialMedia: true
    });

    // General Settings
    await GeneralSettings.create({
      currency: 'PKR',
      currencySymbol: 'Rs',
      shippingFee: 500,
      freeShippingThreshold: 5000,
      taxRate: 0,
      orderPrefix: 'CC',
      enableCOD: true,
      enableOnlinePayment: false
    });

    // Contact Info
    await ContactInfo.create({
      email: 'info@classiccarrry.com',
      phone: '+92-300-1234567',
      whatsapp: '+92-300-1234567',
      address: '123 Business Street, Karachi, Pakistan',
      instagram: '@classiccarrry',
      tiktok: '@classiccarrry'
    });

    // Sample FAQs
    await FAQ.insertMany([
      {
        question: 'How long does shipping take?',
        answer: 'We typically ship within 2-3 business days. Delivery takes 3-5 business days within Pakistan.',
        category: 'shipping',
        order: 1
      },
      {
        question: 'What is your return policy?',
        answer: 'We offer a 7-day return policy for unused items in original packaging.',
        category: 'returns',
        order: 2
      },
      {
        question: 'Do you offer cash on delivery?',
        answer: 'Yes, we offer cash on delivery (COD) for orders within Pakistan.',
        category: 'payment',
        order: 3
      }
    ]);

    console.log('✅ Settings created');

    // Create Hero Images
    console.log('\n🖼️  Creating hero images...');
    await HeroImage.insertMany([
      {
        title: 'Summer Collection 2024',
        subtitle: 'Discover the latest trends',
        image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200',
        buttonText: 'Shop Now',
        buttonLink: '/category/clothing',
        isActive: true,
        order: 1
      },
      {
        title: 'Tech Essentials',
        subtitle: 'Latest gadgets and electronics',
        image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=1200',
        buttonText: 'Explore',
        buttonLink: '/category/electronics',
        isActive: true,
        order: 2
      }
    ]);
    console.log('✅ Hero images created');

    // Create Sample Coupons
    console.log('\n🎫 Creating sample coupons...');
    await Coupon.insertMany([
      {
        code: 'WELCOME10',
        description: 'Welcome discount for new customers',
        discountType: 'percentage',
        discountValue: 10,
        minimumAmount: 5000,
        maxUsage: 100,
        usedCount: 0,
        isActive: true,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
      },
      {
        code: 'SAVE500',
        description: 'Flat 500 PKR off on orders above 10000',
        discountType: 'fixed',
        discountValue: 500,
        minimumAmount: 10000,
        maxUsage: 50,
        usedCount: 0,
        isActive: true,
        expiresAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000) // 15 days from now
      }
    ]);
    console.log('✅ Sample coupons created');

    console.log('\n🎉 Database reset and seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   Categories: ${categories.length}`);
    console.log(`   Products: ${products.length}`);
    console.log(`   Users: ${testUsers.length + 1} (including admin)`);
    console.log(`   Orders: ${sampleOrders.length}`);
    console.log(`   Reviews: ${sampleReviews.length}`);
    console.log(`   Hero Images: 2`);
    console.log(`   Coupons: 2`);
    console.log('\n🔐 Admin Credentials:');
    console.log('   Email: admin@classiccarrry.com');
    console.log('   Password: admin123');
    console.log('\n👤 Test User Credentials:');
    console.log('   Email: john@example.com | Password: password123');
    console.log('   Email: jane@example.com | Password: password123');
    console.log('   Email: ali@example.com | Password: password123');

  } catch (error) {
    console.error('❌ Error during database reset and seeding:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');
    process.exit(0);
  }
};

// Run the script
resetAndSeedDB();