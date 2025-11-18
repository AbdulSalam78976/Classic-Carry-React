import dotenv from 'dotenv';
import Product from '../models/Product.js';
import User from '../models/User.js';
import Category from '../models/Category.js';
import connectDB from '../config/db.js';

dotenv.config();

const categoriesData = [
  {
    name: 'Caps',
    slug: 'caps',
    description: 'Stylish caps for every occasion and season',
    image: '/uploads/categories/caps.png',
    icon: 'fa-hat-cowboy',
    productType: 'caps',
    isFeatured: true,
    displayOrder: 1
  },
  {
    name: 'Wallets',
    slug: 'wallets',
    description: 'Premium wallets and card holders',
    image: '/uploads/categories/wallets.png',
    icon: 'fa-wallet',
    productType: 'wallets',
    isFeatured: true,
    displayOrder: 2
  }
];

const importData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await Product.deleteMany();
    await User.deleteMany();
    await Category.deleteMany();

    console.log('🗑️  Data Destroyed!');

    // Create admin user
    await User.create({
      name: 'Admin User',
      email: 'admin@classiccarrry.com',
      password: 'admin123',
      role: 'admin'
    });

    console.log('✅ Admin user created');

    // Create categories
    const categories = await Category.insertMany(categoriesData);
    console.log(`✅ ${categories.length} categories created`);

    // Create category map for easy reference
    const categoryMap = {};
    categories.forEach(cat => {
      categoryMap[cat.slug] = cat._id;
    });

    // Sample products with category references
    const productsData = [
      // Caps Category Products
      {
        id: 'cap-classic-1',
        name: 'Classic Baseball Cap',
        price: 2999,
        category: categoryMap['caps'],
        categoryName: 'Caps',
        productType: 'caps',
        mainImage: '/uploads/products/c-1.png',
        images: ['/uploads/products/c-1.png', '/uploads/products/c-2.png', '/uploads/products/c-3.png'],
        tag: '🔥 Best Seller',
        description: 'Timeless baseball cap design with premium cotton twill fabric.',
        colors: ['Black', 'Navy Blue', 'Forest Green', 'Burgundy', 'Charcoal'],
        features: ['Premium Cotton Twill', 'Curved Brim', 'Adjustable Strap', 'Embroidered Logo'],
        stock: 150,
        isHot: true,
        isFeatured: true
      },
      {
        id: 'cap-urban-1',
        name: 'Urban Street Cap',
        price: 3299,
        category: categoryMap['caps'],
        categoryName: 'Caps',
        productType: 'caps',
        mainImage: '/uploads/products/c-2.png',
        images: ['/uploads/products/c-2.png', '/uploads/products/c-1.png'],
        tag: '⭐ Trending',
        description: 'Modern street style cap with urban aesthetics.',
        colors: ['Black', 'Gray', 'Navy', 'Olive'],
        features: ['Street Style Design', 'Urban Fashion', 'Durable Construction', 'Premium Fabric'],
        stock: 120,
        isHot: true,
        isFeatured: true
      },
      {
        id: 'summer-cap-1',
        name: 'Breathable Summer Cap',
        price: 2799,
        category: categoryMap['caps'],
        categoryName: 'Caps',
        productType: 'caps',
        mainImage: '/uploads/products/caps/1.png',
        images: ['/uploads/products/caps/1.png', '/uploads/products/c-1.png'],
        description: 'Lightweight and breathable cap perfect for hot summer days.',
        colors: ['White', 'Beige', 'Light Blue', 'Khaki'],
        features: ['Breathable Mesh Design', 'Lightweight Construction', 'UV Protection', 'Quick-Dry Material'],
        stock: 80,
        isFeatured: true
      },
      {
        id: 'summer-cap-2',
        name: 'Tropical Vibes Cap',
        price: 2899,
        category: categoryMap['caps'],
        categoryName: 'Caps',
        productType: 'caps',
        mainImage: '/uploads/products/caps/2.png',
        images: ['/uploads/products/caps/2.png', '/uploads/products/c-2.png'],
        description: 'Bring the beach vibes with this tropical-inspired summer cap.',
        colors: ['Coral', 'Turquoise', 'Yellow', 'Mint'],
        features: ['Tropical Design', 'Breathable Fabric', 'Vacation Ready', 'Comfortable Fit'],
        stock: 70,
        isFeatured: true
      },
      {
        id: 'winter-cap-1',
        name: 'Warm Winter Cap',
        price: 3599,
        category: categoryMap['caps'],
        categoryName: 'Caps',
        productType: 'caps',
        mainImage: '/uploads/products/caps/3.png',
        images: ['/uploads/products/caps/3.png', '/uploads/products/c-3.png'],
        description: 'Insulated winter cap with ear flaps for extra warmth.',
        colors: ['Black', 'Navy', 'Charcoal', 'Brown'],
        features: ['Thermal Insulation', 'Ear Flap Protection', 'Fleece Lining', 'Wind Resistant'],
        stock: 60,
        isHot: true,
        isFeatured: true
      },
      {
        id: 'winter-cap-2',
        name: 'Cozy Beanie Cap',
        price: 3299,
        category: categoryMap['caps'],
        categoryName: 'Caps',
        productType: 'caps',
        mainImage: '/uploads/products/c-1.png',
        images: ['/uploads/products/c-1.png', '/uploads/products/c-2.png'],
        description: 'Soft and cozy beanie-style cap for maximum warmth.',
        colors: ['Gray', 'Black', 'Burgundy', 'Forest Green'],
        features: ['Soft Knit Design', 'Extra Warm', 'Comfortable Fit', 'Stretchy Material'],
        stock: 90,
        isFeatured: true
      },
      {
        id: 'sports-cap-1',
        name: 'Premium Sports Cap',
        price: 3499,
        category: categoryMap['caps'],
        categoryName: 'Caps',
        productType: 'caps',
        mainImage: '/uploads/products/c-3.png',
        images: ['/uploads/products/c-3.png', '/uploads/products/c-1.png'],
        tag: '🔥 Hot',
        description: 'Performance-oriented sports cap with moisture-wicking technology.',
        colors: ['Black', 'White', 'Red', 'Blue'],
        features: ['Moisture-Wicking', 'Breathable Mesh', 'UV Protection', 'Lightweight'],
        stock: 100,
        isHot: true,
        isFeatured: true
      },

      {
        id: 'wallet-premium-1',
        name: 'Premium Leather Wallet',
        price: 4999,
        category: categoryMap['wallets'],
        categoryName: 'Wallets',
        productType: 'wallets',
        mainImage: '/uploads/products/w-1.png',
        images: ['/uploads/products/w-1.png', '/uploads/products/w-2.png'],
        tag: '🔥 Best Seller',
        description: 'Handcrafted premium leather wallet with RFID protection.',
        colors: ['Black', 'Brown', 'Tan', 'Navy'],
        features: ['Genuine Leather', 'RFID Protection', '8 Card Slots', '2 Bill Compartments'],
        stock: 120,
        isHot: true,
        isFeatured: true
      },
      {
        id: 'wallet-executive-1',
        name: 'Executive Bifold Wallet',
        price: 5499,
        category: categoryMap['wallets'],
        categoryName: 'Wallets',
        productType: 'wallets',
        mainImage: '/uploads/products/w-3.png',
        images: ['/uploads/products/w-3.png', '/uploads/products/w-1.png'],
        tag: '🔥 Premium',
        description: 'Sophisticated executive bifold wallet with premium leather.',
        colors: ['Black', 'Dark Brown', 'Cognac'],
        features: ['Executive Design', 'Premium Leather', '10 Card Slots', 'RFID Protection'],
        stock: 80,
        isHot: true,
        isFeatured: true
      },
      {
        id: 'leather-wallet-1',
        name: 'Genuine Leather Wallet',
        price: 3999,
        category: categoryMap['wallets'],
        categoryName: 'Wallets',
        productType: 'wallets',
        mainImage: '/uploads/products/wallets/3/main.png',
        images: ['/uploads/products/wallets/3/main.png', '/uploads/products/w-3.png'],
        description: 'Stylish and elegant wallet designed for women.',
        colors: ['Rose Gold', 'Lavender', 'Mint', 'Blush Pink', 'Cream'],
        features: ['Feminine Design', 'Multiple Card Slots', 'Zippered Coin Pocket', 'Photo Sleeves'],
        stock: 85,
        isFeatured: true
      },
      {
        id: 'leather-wallet-2',
        name: 'Premium Leather Bifold',
        price: 5999,
        category: categoryMap['wallets'],
        categoryName: 'Wallets',
        productType: 'wallets',
        mainImage: '/uploads/products/wallets/4/main.png',
        images: ['/uploads/products/wallets/4/main.png', '/uploads/products/w-4.png'],
        description: 'Luxurious designer clutch wallet for special occasions.',
        colors: ['Gold', 'Silver', 'Rose Gold', 'Black'],
        features: ['Designer Style', 'Clutch Functionality', 'Chain Strap', 'Multiple Compartments'],
        stock: 45,
        isFeatured: true
      },
      {
        id: 'long-wallet-1',
        name: 'Classic Long Wallet',
        price: 4499,
        category: categoryMap['wallets'],
        categoryName: 'Wallets',
        productType: 'wallets',
        mainImage: '/uploads/products/wallets/1/main.png',
        images: ['/uploads/products/wallets/1/main.png', '/uploads/products/w-1.png'],
        description: 'Spacious long wallet with multiple compartments.',
        colors: ['Black', 'Brown', 'Burgundy'],
        features: ['Extended Length', '12 Card Slots', 'Full-Length Bill Compartment', 'Zippered Coin Pocket'],
        stock: 70,
        isFeatured: true
      },
      {
        id: 'cardholder-1',
        name: 'Minimalist Card Holder',
        price: 2999,
        category: categoryMap['wallets'],
        categoryName: 'Wallets',
        productType: 'wallets',
        mainImage: '/uploads/products/w-2.png',
        images: ['/uploads/products/w-2.png', '/uploads/products/w-1.png'],
        tag: '⭐ Trending',
        description: 'Sleek minimalist card holder for those who prefer to carry less.',
        colors: ['Black', 'Gray', 'Navy', 'Burgundy'],
        features: ['Ultra-Slim Design', 'RFID Blocking', '6 Card Capacity', 'Money Clip'],
        stock: 100,
        isHot: true,
        isFeatured: true
      },
      {
        id: 'cardholder-2',
        name: 'Metal Card Case',
        price: 2499,
        category: categoryMap['wallets'],
        categoryName: 'Wallets',
        productType: 'wallets',
        mainImage: '/uploads/products/w-1.png',
        images: ['/uploads/products/w-1.png', '/uploads/products/w-2.png'],
        description: 'Sleek metal card case with automatic pop-up mechanism.',
        colors: ['Silver', 'Black', 'Rose Gold', 'Gunmetal'],
        features: ['Aluminum Construction', 'Pop-Up Mechanism', 'RFID Protection', 'Scratch Resistant'],
        stock: 110,
        isFeatured: true
      }
    ];

    // Insert products
    await Product.insertMany(productsData);

    console.log('✅ Products imported');
    console.log(`📦 Total products: ${productsData.length}`);
    console.log(`   - Caps: ${productsData.filter(p => p.productType === 'caps').length}`);
    console.log(`   - Wallets: ${productsData.filter(p => p.productType === 'wallets').length}`);
    console.log(`   - Other: ${productsData.filter(p => !['caps', 'wallets'].includes(p.productType)).length}`);
    console.log('🎉 Data Import Success!');
    
    process.exit();
  } catch (error) {
    console.error(`❌ Error: ${error}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await connectDB();

    await Product.deleteMany();
    await User.deleteMany();
    await Category.deleteMany();

    console.log('🗑️  Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`❌ Error: ${error}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
