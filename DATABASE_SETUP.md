# Database Setup Guide

This guide will help you reset the database and populate it with sample data including products with rating fields.

## Quick Setup

### Option 1: Using npm script (Recommended)
```bash
cd backend
npm run reset-db
```

### Option 2: Direct execution
```bash
cd backend/scripts
node resetAndSeedDB.js
```

## What the Script Does

### 🗑️ Clears All Data
- Removes all existing data from all collections
- Ensures a clean slate for fresh setup

### 📁 Creates Categories (5)
- Electronics
- Clothing  
- Home & Garden
- Sports & Fitness
- Books & Media

### 📦 Creates Products (12)
Each product includes:
- Basic info (name, price, description)
- Images (main image + gallery)
- Categories and specifications
- **Rating fields** (averageRating, totalReviews, ratingDistribution)
- Stock and availability
- Colors, sizes, features

### 👤 Creates Users
- **Admin User**: admin@classiccarrry.com / admin123
- **Test Users**: 
  - john@example.com / password123
  - jane@example.com / password123  
  - ali@example.com / password123

### 📋 Creates Sample Data
- Sample orders (delivered status for review testing)
- Sample reviews with images
- Hero images for homepage
- Discount coupons
- System settings

## Sample Products Created

### Electronics
1. **Wireless Bluetooth Headphones** - ₹15,999
   - 4.5★ rating (128 reviews)
   - Colors: Black, White, Blue
   - Features: Noise cancellation, 30-hour battery

2. **Smart Watch Series X** - ₹25,999
   - 4.7★ rating (89 reviews)
   - Sizes: 38mm, 42mm, 45mm
   - Features: Health monitoring, GPS, 7-day battery

3. **Portable Power Bank 20000mAh** - ₹4,999
   - 4.3★ rating (156 reviews)
   - Features: Fast charging, multiple ports

### Clothing
4. **Premium Cotton T-Shirt** - ₹2,999
   - 4.4★ rating (203 reviews)
   - Sizes: XS to XXL
   - Colors: White, Black, Navy, Gray, Red

5. **Denim Jacket Classic** - ₹8,999
   - 4.6★ rating (67 reviews)
   - Colors: Blue, Black, Light Blue

6. **Running Shoes Pro** - ₹12,999
   - 4.8★ rating (142 reviews)
   - Sizes: 7-12
   - Features: Advanced cushioning, breathable

### Home & Garden
7. **Ceramic Coffee Mug Set** - ₹3,999
   - 4.2★ rating (94 reviews)
   - Set of 4 mugs

8. **LED Desk Lamp Modern** - ₹6,999
   - 4.5★ rating (76 reviews)
   - Features: Adjustable brightness, USB charging

### Sports & Fitness
9. **Yoga Mat Premium** - ₹4,999
   - 4.4★ rating (112 reviews)
   - Colors: Purple, Blue, Pink, Green

10. **Resistance Bands Set** - ₹2,999
    - 4.3★ rating (87 reviews)
    - Multiple resistance levels

### Books & Media
11. **Programming Fundamentals Book** - ₹3,999
    - 4.7★ rating (234 reviews)
    - Comprehensive beginner guide

## Login Credentials

### Admin Panel Access
- **URL**: `/admin` or admin panel URL
- **Email**: admin@classiccarrry.com
- **Password**: admin123

### Test User Accounts
- **john@example.com** / password123
- **jane@example.com** / password123
- **ali@example.com** / password123

## Features Enabled

✅ **Reviews & Ratings**: Products have realistic ratings and sample reviews  
✅ **Image Galleries**: Products include multiple images  
✅ **Categories**: Organized product categories  
✅ **User Accounts**: Ready-to-use test accounts  
✅ **Orders**: Sample delivered orders for review testing  
✅ **Coupons**: WELCOME10 (10% off), SAVE500 (₹500 off)  
✅ **Hero Images**: Homepage banners  
✅ **Settings**: Complete site configuration  

## Testing the Review System

1. **Login** as a test user (john@example.com)
2. **Navigate** to "My Reviews" from profile menu
3. **Write reviews** for delivered products
4. **Upload images** with reviews (up to 5 per review)
5. **View reviews** on product detail pages
6. **Admin moderation** available in admin panel

## Troubleshooting

### Connection Issues
- Ensure MongoDB is running
- Check MONGODB_URI in .env file
- Verify network connectivity

### Permission Errors
- Ensure proper file permissions
- Run with appropriate user privileges

### Script Errors
- Check Node.js version (14+ recommended)
- Verify all dependencies are installed: `npm install`
- Check console output for specific error messages

## Next Steps

After running the script:
1. Start the backend server: `npm run dev`
2. Start the frontend applications
3. Test the review and rating system
4. Customize products and categories as needed

The database is now ready with a complete product catalog including ratings and reviews!