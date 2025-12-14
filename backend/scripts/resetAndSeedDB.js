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

    // Create Main Categories
    console.log('\n📁 Creating main categories...');
    const mainCategories = await Category.insertMany([
      {
        name: 'Caps & Hats',
        slug: 'caps-hats',
        description: 'Stylish caps and hats for every occasion',
        image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=500',
        displayOrder: 1,
        isActive: true,
        parentCategory: null
      },
      {
        name: 'Clothing',
        slug: 'clothing',
        description: 'Premium clothing and apparel',
        image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=500',
        displayOrder: 2,
        isActive: true,
        parentCategory: null
      },
      {
        name: 'Accessories',
        slug: 'accessories',
        description: 'Fashion accessories and more',
        image: 'https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?w=500',
        displayOrder: 3,
        isActive: true,
        parentCategory: null
      },
      {
        name: 'Footwear',
        slug: 'footwear',
        description: 'Comfortable and stylish footwear',
        image: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=500',
        displayOrder: 4,
        isActive: true,
        parentCategory: null
      }
    ]);
    console.log(`✅ Created ${mainCategories.length} main categories`);

    // Create Subcategories
    console.log('\n📂 Creating subcategories...');
    const subcategories = await Category.insertMany([
      // Caps & Hats subcategories
      {
        name: 'Baseball Caps',
        slug: 'baseball-caps',
        description: 'Classic baseball style caps',
        image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=500',
        displayOrder: 1,
        isActive: true,
        parentCategory: mainCategories[0]._id
      },
      {
        name: 'Snapback Caps',
        slug: 'snapback-caps',
        description: 'Trendy snapback caps',
        image: 'https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?w=500',
        displayOrder: 2,
        isActive: true,
        parentCategory: mainCategories[0]._id
      },
      {
        name: 'Bucket Hats',
        slug: 'bucket-hats',
        description: 'Stylish bucket hats',
        image: 'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=500',
        displayOrder: 3,
        isActive: true,
        parentCategory: mainCategories[0]._id
      },
      // Clothing subcategories
      {
        name: 'T-Shirts',
        slug: 't-shirts',
        description: 'Comfortable cotton t-shirts',
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
        displayOrder: 1,
        isActive: true,
        parentCategory: mainCategories[1]._id
      },
      {
        name: 'Hoodies',
        slug: 'hoodies',
        description: 'Warm and cozy hoodies',
        image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500',
        displayOrder: 2,
        isActive: true,
        parentCategory: mainCategories[1]._id
      },
      {
        name: 'Jackets',
        slug: 'jackets',
        description: 'Stylish jackets for all seasons',
        image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500',
        displayOrder: 3,
        isActive: true,
        parentCategory: mainCategories[1]._id
      },
      // Accessories subcategories
      {
        name: 'Bags',
        slug: 'bags',
        description: 'Backpacks and bags',
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500',
        displayOrder: 1,
        isActive: true,
        parentCategory: mainCategories[2]._id
      },
      {
        name: 'Sunglasses',
        slug: 'sunglasses',
        description: 'Trendy sunglasses',
        image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500',
        displayOrder: 2,
        isActive: true,
        parentCategory: mainCategories[2]._id
      },
      // Footwear subcategories
      {
        name: 'Sneakers',
        slug: 'sneakers',
        description: 'Comfortable sneakers',
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
        displayOrder: 1,
        isActive: true,
        parentCategory: mainCategories[3]._id
      },
      {
        name: 'Sandals',
        slug: 'sandals',
        description: 'Casual sandals',
        image: 'https://images.unsplash.com/photo-1603487742131-4160ec999306?w=500',
        displayOrder: 2,
        isActive: true,
        parentCategory: mainCategories[3]._id
      }
    ]);
    console.log(`✅ Created ${subcategories.length} subcategories`);

    // Create Products with categories and subcategories
    console.log('\n📦 Creating products...');
    const products = await Product.insertMany([
      // Baseball Caps
      {
        id: 'CAP001',
        name: 'Classic Baseball Cap - Black',
        price: 1999,
        category: mainCategories[0]._id,
        categoryName: mainCategories[0].name,
        subcategory: subcategories[0]._id,
        subcategoryName: subcategories[0].name,
        mainImage: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=500',
        images: ['https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=500'],
        description: 'Classic black baseball cap with adjustable strap. Perfect for everyday wear.',
        colors: ['Black', 'Navy', 'White', 'Gray'],
        sizes: ['One Size'],
        features: ['Adjustable strap', '100% Cotton', 'Breathable fabric', 'Curved brim'],
        stock: 100,
        isActive: true,
        isFeatured: true,
        isHot: true,
        averageRating: 4.6,
        totalReviews: 45,
        ratingDistribution: { 1: 1, 2: 2, 3: 5, 4: 15, 5: 22 }
      },
      {
        id: 'CAP002',
        name: 'Premium Snapback Cap',
        price: 2499,
        category: mainCategories[0]._id,
        categoryName: mainCategories[0].name,
        subcategory: subcategories[1]._id,
        subcategoryName: subcategories[1].name,
        mainImage: 'https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?w=500',
        images: ['https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?w=500'],
        description: 'Trendy snapback cap with flat brim and embroidered logo.',
        colors: ['Black', 'Red', 'Blue', 'White'],
        sizes: ['One Size'],
        features: ['Snapback closure', 'Flat brim', 'Embroidered logo', 'Premium quality'],
        stock: 75,
        isActive: true,
        isFeatured: true,
        averageRating: 4.7,
        totalReviews: 38,
        ratingDistribution: { 1: 0, 2: 1, 3: 4, 4: 12, 5: 21 }
      },
      {
        id: 'CAP003',
        name: 'Bucket Hat - Summer Edition',
        price: 1799,
        category: mainCategories[0]._id,
        categoryName: mainCategories[0].name,
        subcategory: subcategories[2]._id,
        subcategoryName: subcategories[2].name,
        mainImage: 'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=500',
        images: ['https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=500'],
        description: 'Lightweight bucket hat perfect for summer days.',
        colors: ['Beige', 'Black', 'Olive', 'Navy'],
        sizes: ['S/M', 'L/XL'],
        features: ['Lightweight', 'Sun protection', 'Packable', 'Breathable'],
        stock: 60,
        isActive: true,
        averageRating: 4.4,
        totalReviews: 29,
        ratingDistribution: { 1: 1, 2: 1, 3: 3, 4: 10, 5: 14 }
      },
      // T-Shirts
      {
        id: 'TSHIRT001',
        name: 'Premium Cotton T-Shirt',
        price: 1499,
        category: mainCategories[1]._id,
        categoryName: mainCategories[1].name,
        subcategory: subcategories[3]._id,
        subcategoryName: subcategories[3].name,
        mainImage: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
        images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500'],
        description: '100% premium cotton t-shirt with comfortable fit.',
        colors: ['White', 'Black', 'Navy', 'Gray', 'Red'],
        sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
        features: ['100% Cotton', 'Pre-shrunk', 'Comfortable fit', 'Durable'],
        stock: 150,
        isActive: true,
        isFeatured: true,
        isHot: true,
        averageRating: 4.5,
        totalReviews: 89,
        ratingDistribution: { 1: 2, 2: 3, 3: 8, 4: 32, 5: 44 }
      },
      {
        id: 'HOODIE001',
        name: 'Classic Pullover Hoodie',
        price: 3999,
        category: mainCategories[1]._id,
        categoryName: mainCategories[1].name,
        subcategory: subcategories[4]._id,
        subcategoryName: subcategories[4].name,
        mainImage: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500',
        images: ['https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500'],
        description: 'Warm and comfortable pullover hoodie with kangaroo pocket.',
        colors: ['Black', 'Gray', 'Navy', 'Maroon'],
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        features: ['Fleece lined', 'Kangaroo pocket', 'Drawstring hood', 'Ribbed cuffs'],
        stock: 80,
        isActive: true,
        isFeatured: true,
        averageRating: 4.8,
        totalReviews: 67,
        ratingDistribution: { 1: 0, 2: 1, 3: 3, 4: 15, 5: 48 }
      },
      // Accessories
      {
        id: 'BAG001',
        name: 'Urban Backpack',
        price: 4999,
        category: mainCategories[2]._id,
        categoryName: mainCategories[2].name,
        subcategory: subcategories[6]._id,
        subcategoryName: subcategories[6].name,
        mainImage: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500',
        images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500'],
        description: 'Spacious urban backpack with laptop compartment.',
        colors: ['Black', 'Gray', 'Navy'],
        features: ['Laptop compartment', 'Water resistant', 'Multiple pockets', 'Padded straps'],
        stock: 45,
        isActive: true,
        averageRating: 4.6,
        totalReviews: 52,
        ratingDistribution: { 1: 1, 2: 2, 3: 4, 4: 18, 5: 27 }
      },
      {
        id: 'SUNGLASS001',
        name: 'Classic Aviator Sunglasses',
        price: 2999,
        category: mainCategories[2]._id,
        categoryName: mainCategories[2].name,
        subcategory: subcategories[7]._id,
        subcategoryName: subcategories[7].name,
        mainImage: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500',
        images: ['https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500'],
        description: 'Classic aviator style sunglasses with UV protection.',
        colors: ['Gold', 'Silver', 'Black'],
        features: ['UV400 protection', 'Polarized lenses', 'Metal frame', 'Case included'],
        stock: 70,
        isActive: true,
        isFeatured: true,
        averageRating: 4.3,
        totalReviews: 41,
        ratingDistribution: { 1: 1, 2: 3, 3: 5, 4: 15, 5: 17 }
      },
      // Footwear
      {
        id: 'SHOE001',
        name: 'Running Sneakers Pro',
        price: 8999,
        category: mainCategories[3]._id,
        categoryName: mainCategories[3].name,
        subcategory: subcategories[8]._id,
        subcategoryName: subcategories[8].name,
        mainImage: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
        images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500'],
        description: 'Professional running sneakers with advanced cushioning.',
        colors: ['White', 'Black', 'Red', 'Blue'],
        sizes: ['7', '8', '9', '10', '11', '12'],
        features: ['Advanced cushioning', 'Breathable mesh', 'Lightweight', 'Durable sole'],
        stock: 55,
        isActive: true,
        isFeatured: true,
        isHot: true,
        averageRating: 4.9,
        totalReviews: 78,
        ratingDistribution: { 1: 0, 2: 0, 3: 2, 4: 12, 5: 64 }
      }
    ]);
    console.log(`✅ Created ${products.length} products`);

    // Create Admin User
    console.log('\n👤 Creating admin user...');
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@classiccarrry.com',
      password: 'admin123',
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
    const testUsers = [];

    const users = await User.insertMany([
      {
        name: 'Ahmed Khan',
        email: 'ahmed@example.com',
        password: 'password123',
        role: 'user',
        phone: '+92-300-1111111',
        isActive: true
      },
      {
        name: 'Sara Ali',
        email: 'sara@example.com',
        password: 'password123',
        role: 'user',
        phone: '+92-300-2222222',
        isActive: true
      },
      {
        name: 'Hassan Raza',
        email: 'hassan@example.com',
        password: 'password123',
        role: 'user',
        phone: '+92-300-3333333',
        isActive: true
      },
      {
        name: 'Fatima Noor',
        email: 'fatima@example.com',
        password: 'password123',
        role: 'user',
        phone: '+92-300-4444444',
        isActive: true
      },
      {
        name: 'Bilal Ahmed',
        email: 'bilal@example.com',
        password: 'password123',
        role: 'user',
        phone: '+92-300-5555555',
        isActive: true
      }
    ]);
    testUsers.push(...users);

    console.log(`✅ Created ${testUsers.length} test users`);

    // Create Sample Orders
    console.log('\n📋 Creating sample orders...');
    const sampleOrders = [];

    // Order 1
    const order1 = await Order.create({
      customer: {
        email: testUsers[0].email,
        firstName: 'Ahmed',
        lastName: 'Khan',
        phone: testUsers[0].phone,
        address: '123 Main Street',
        city: 'Karachi',
        province: 'Sindh',
        postalCode: '75500'
      },
      items: [{
        productId: products[0].id,
        name: products[0].name,
        price: products[0].price,
        quantity: 1,
        image: products[0].mainImage,
        color: 'Black'
      }],
      pricing: {
        subtotal: products[0].price,
        deliveryCharge: 500,
        total: products[0].price + 500
      },
      status: 'delivered',
      paymentStatus: 'paid'
    });
    sampleOrders.push(order1);

    // Order 2
    const order2 = await Order.create({
      customer: {
        email: testUsers[1].email,
        firstName: 'Sara',
        lastName: 'Ali',
        phone: testUsers[1].phone,
        address: '456 Oak Avenue',
        city: 'Lahore',
        province: 'Punjab',
        postalCode: '54000'
      },
      items: [{
        productId: products[3].id,
        name: products[3].name,
        price: products[3].price,
        quantity: 2,
        image: products[3].mainImage,
        color: 'White',
        size: 'M'
      }],
      pricing: {
        subtotal: products[3].price * 2,
        deliveryCharge: 500,
        total: (products[3].price * 2) + 500
      },
      status: 'delivered',
      paymentStatus: 'paid'
    });
    sampleOrders.push(order2);

    // Order 3
    const order3 = await Order.create({
      customer: {
        email: testUsers[2].email,
        firstName: 'Hassan',
        lastName: 'Raza',
        phone: testUsers[2].phone,
        address: '789 Pine Street',
        city: 'Islamabad',
        province: 'Islamabad Capital Territory',
        postalCode: '44000'
      },
      items: [{
        productId: products[4].id,
        name: products[4].name,
        price: products[4].price,
        quantity: 1,
        image: products[4].mainImage,
        color: 'Black',
        size: 'L'
      }],
      pricing: {
        subtotal: products[4].price,
        deliveryCharge: 500,
        total: products[4].price + 500
      },
      status: 'delivered',
      paymentStatus: 'paid'
    });
    sampleOrders.push(order3);

    // Order 4
    const order4 = await Order.create({
      customer: {
        email: testUsers[3].email,
        firstName: 'Fatima',
        lastName: 'Noor',
        phone: testUsers[3].phone,
        address: '321 Elm Street',
        city: 'Faisalabad',
        province: 'Punjab',
        postalCode: '38000'
      },
      items: [{
        productId: products[7].id,
        name: products[7].name,
        price: products[7].price,
        quantity: 1,
        image: products[7].mainImage,
        color: 'White',
        size: '9'
      }],
      pricing: {
        subtotal: products[7].price,
        deliveryCharge: 500,
        total: products[7].price + 500
      },
      status: 'delivered',
      paymentStatus: 'paid'
    });
    sampleOrders.push(order4);

    // Order 5
    const order5 = await Order.create({
      customer: {
        email: testUsers[4].email,
        firstName: 'Bilal',
        lastName: 'Ahmed',
        phone: testUsers[4].phone,
        address: '654 Maple Drive',
        city: 'Multan',
        province: 'Punjab',
        postalCode: '60000'
      },
      items: [{
        productId: products[1].id,
        name: products[1].name,
        price: products[1].price,
        quantity: 1,
        image: products[1].mainImage,
        color: 'Red'
      }],
      pricing: {
        subtotal: products[1].price,
        deliveryCharge: 500,
        total: products[1].price + 500
      },
      status: 'delivered',
      paymentStatus: 'paid'
    });
    sampleOrders.push(order5);

    console.log(`✅ Created ${sampleOrders.length} sample orders`);

    // Create Sample Reviews
    console.log('\n⭐ Creating sample reviews...');
    const sampleReviews = await Review.insertMany([
      {
        user: testUsers[0]._id,
        product: products[0]._id,
        order: sampleOrders[0]._id,
        rating: 5,
        title: 'Perfect everyday cap!',
        comment: 'This baseball cap is exactly what I was looking for. The quality is excellent and it fits perfectly. The adjustable strap makes it very comfortable to wear all day.',
        images: ['https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=300'],
        isVerified: true,
        isApproved: true
      },
      {
        user: testUsers[1]._id,
        product: products[3]._id,
        order: sampleOrders[1]._id,
        rating: 5,
        title: 'Best t-shirt I own',
        comment: 'The cotton quality is amazing! Very soft and comfortable. I bought 2 and they both fit perfectly. Highly recommend!',
        images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300'],
        isVerified: true,
        isApproved: true
      },
      {
        user: testUsers[2]._id,
        product: products[4]._id,
        order: sampleOrders[2]._id,
        rating: 5,
        title: 'Warm and cozy!',
        comment: 'This hoodie is perfect for winter. The fleece lining is very warm and the fit is great. The kangaroo pocket is a nice touch.',
        isVerified: true,
        isApproved: true
      },
      {
        user: testUsers[3]._id,
        product: products[7]._id,
        order: sampleOrders[3]._id,
        rating: 5,
        title: 'Amazing running shoes',
        comment: 'These sneakers are incredibly comfortable! The cushioning is perfect for running and they look great too. Worth every penny!',
        images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300'],
        isVerified: true,
        isApproved: true
      },
      {
        user: testUsers[4]._id,
        product: products[1]._id,
        order: sampleOrders[4]._id,
        rating: 4,
        title: 'Great snapback!',
        comment: 'Really nice cap with good quality. The embroidery is clean and the fit is perfect. Only wish it came in more colors.',
        isVerified: true,
        isApproved: true
      },
      // Additional reviews for variety
      {
        user: testUsers[0]._id,
        product: products[1]._id,
        order: sampleOrders[0]._id,
        rating: 5,
        title: 'Stylish and comfortable',
        comment: 'Love this snapback! The flat brim looks great and the quality is top-notch.',
        isVerified: true,
        isApproved: true
      },
      {
        user: testUsers[1]._id,
        product: products[0]._id,
        order: sampleOrders[1]._id,
        rating: 4,
        title: 'Good quality cap',
        comment: 'Nice cap for the price. Fits well and looks good. Would buy again.',
        isVerified: true,
        isApproved: true
      },
      {
        user: testUsers[2]._id,
        product: products[3]._id,
        order: sampleOrders[2]._id,
        rating: 5,
        title: 'Perfect fit!',
        comment: 'The t-shirt fits perfectly and the material is very soft. Great value for money!',
        isVerified: true,
        isApproved: true
      },
      {
        user: testUsers[3]._id,
        product: products[4]._id,
        order: sampleOrders[3]._id,
        rating: 5,
        title: 'Love this hoodie!',
        comment: 'Super comfortable and warm. The quality is excellent and it looks great!',
        isVerified: true,
        isApproved: true
      },
      {
        user: testUsers[4]._id,
        product: products[6]._id,
        order: sampleOrders[4]._id,
        rating: 4,
        title: 'Nice sunglasses',
        comment: 'Good quality sunglasses with UV protection. The case is a nice bonus!',
        isVerified: true,
        isApproved: true
      }
    ]);
    console.log(`✅ Created ${sampleReviews.length} sample reviews`);

    // Create Settings
    console.log('\n⚙️  Creating settings...');

    await AppearanceSettings.create({
      siteName: 'Classic Carry',
      logoImage: '/assets/images/logo.png',
      logoType: 'image',
      tagline: 'Carry Your Style',
      showNewsletter: true,
      showSocialMedia: true
    });

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

    await ContactInfo.create({
      email: 'info@classiccarrry.com',
      phone: '+92-300-1234567',
      whatsapp: '+92-300-1234567',
      address: '123 Business Street, Karachi, Pakistan',
      instagram: '@classiccarrry',
      tiktok: '@classiccarrry'
    });

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
        title: 'New Cap Collection',
        subtitle: 'Discover the latest styles',
        image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=1200',
        buttonText: 'Shop Now',
        buttonLink: '/category/caps-hats',
        isActive: true,
        order: 1
      },
      {
        title: 'Premium Clothing',
        subtitle: 'Quality you can feel',
        image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=1200',
        buttonText: 'Explore',
        buttonLink: '/category/clothing',
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
        minimumAmount: 3000,
        maxUsage: 100,
        usedCount: 0,
        isActive: true,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      },
      {
        code: 'SAVE500',
        description: 'Flat 500 PKR off on orders above 5000',
        discountType: 'fixed',
        discountValue: 500,
        minimumAmount: 5000,
        maxUsage: 50,
        usedCount: 0,
        isActive: true,
        expiresAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
      }
    ]);
    console.log('✅ Sample coupons created');

    console.log('\n🎉 Database reset and seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   Main Categories: ${mainCategories.length}`);
    console.log(`   Subcategories: ${subcategories.length}`);
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
    console.log('   Email: ahmed@example.com | Password: password123');
    console.log('   Email: sara@example.com | Password: password123');
    console.log('   Email: hassan@example.com | Password: password123');
    console.log('   Email: fatima@example.com | Password: password123');
    console.log('   Email: bilal@example.com | Password: password123');

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