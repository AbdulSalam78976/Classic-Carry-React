import dotenv from 'dotenv';
import Product from '../models/Product.js';
import User from '../models/User.js';
import connectDB from '../config/db.js';

dotenv.config();

const productsData = [
  // ==================== HOT SELLING CAPS ====================
  {
    id: 'hot-cap-1',
    name: 'Classic Baseball Cap',
    price: 2999,
    mainImage: '/uploads/products/c-1.png',
    images: ['/uploads/products/c-1.png', '/uploads/products/c-2.png', '/uploads/products/c-3.png'],
    tag: '🔥 Best Seller',
    description: 'Timeless baseball cap design with premium cotton twill fabric. Perfect for casual everyday wear with adjustable strap for the perfect fit.',
    category: 'male',
    productType: 'cap',
    colors: ['Black', 'Navy Blue', 'Forest Green', 'Burgundy', 'Charcoal'],
    features: [
      'Premium Cotton Twill Fabric',
      'Classic Curved Brim Design',
      'Adjustable Back Strap',
      'Embroidered Logo Detail',
      'Breathable Construction',
      'One Size Fits Most'
    ],
    specifications: {
      'Material': '100% Cotton Twill',
      'Brim Style': 'Curved',
      'Closure': 'Adjustable Strap',
      'Crown Height': '3.5 inches',
      'Brim Length': '2.75 inches',
      'Care': 'Hand wash cold, air dry'
    },
    stock: 150
  },
  {
    id: 'hot-cap-2',
    name: 'Urban Street Cap',
    price: 3299,
    category: 'male',
    productType: 'cap',
    mainImage: '/uploads/products/c-2.png',
    images: ['/uploads/products/c-2.png', '/uploads/products/c-1.png', '/uploads/products/c-3.png'],
    tag: '⭐ Trending',
    description: 'Modern street style cap with urban aesthetics. Features premium construction and contemporary design elements.',
    colors: ['Black', 'Gray', 'Navy', 'Olive'],
    features: [
      'Street Style Design',
      'Urban Fashion Statement',
      'Durable Construction',
      'Premium Fabric',
      'Adjustable Fit',
      'Versatile Styling'
    ],
    specifications: {
      'Material': 'Cotton Blend',
      'Style': 'Urban Street',
      'Closure': 'Snapback',
      'Fit': 'Adjustable',
      'Care': 'Machine washable'
    },
    stock: 120
  },
  {
    id: 'hot-cap-3',
    name: 'Premium Sports Cap',
    price: 3499,
    category: 'sports',
    productType: 'cap',
    mainImage: '/uploads/products/c-3.png',
    images: ['/uploads/products/c-3.png', '/uploads/products/c-1.png', '/uploads/products/c-2.png'],
    tag: '🔥 Hot',
    description: 'Performance-oriented sports cap with moisture-wicking technology. Ideal for active lifestyles and outdoor activities.',
    colors: ['Black', 'White', 'Red', 'Blue'],
    features: [
      'Moisture-Wicking Technology',
      'Breathable Mesh Panels',
      'UV Protection',
      'Lightweight Design',
      'Quick-Dry Fabric',
      'Athletic Fit'
    ],
    specifications: {
      'Material': 'Performance Polyester',
      'Technology': 'Moisture-Wicking',
      'UV Protection': 'UPF 50+',
      'Weight': 'Ultra-Light',
      'Care': 'Machine washable'
    },
    stock: 100
  },

  // ==================== SUMMER CAPS ====================
  {
    id: 'cap-summer-1',
    name: 'Breathable Summer Cap',
    price: 2799,
    category: 'summer',
    productType: 'cap',
    mainImage: '/uploads/products/caps/1.png',
    images: ['/uploads/products/caps/1.png', '/uploads/products/c-1.png'],
    description: 'Lightweight and breathable cap perfect for hot summer days. Features mesh panels for maximum ventilation.',
    colors: ['White', 'Beige', 'Light Blue', 'Khaki'],
    features: [
      'Breathable Mesh Design',
      'Lightweight Construction',
      'UV Protection',
      'Quick-Dry Material',
      'Adjustable Strap'
    ],
    specifications: {
      'Material': 'Cotton/Mesh Blend',
      'Season': 'Summer',
      'UV Protection': 'Yes',
      'Weight': 'Lightweight'
    },
    stock: 80
  },
  {
    id: 'cap-summer-2',
    name: 'Tropical Vibes Cap',
    price: 2899,
    category: 'summer',
    productType: 'cap',
    mainImage: '/uploads/products/caps/2.png',
    images: ['/uploads/products/caps/2.png', '/uploads/products/c-2.png'],
    description: 'Bring the beach vibes with this tropical-inspired summer cap. Perfect for vacations and outdoor adventures.',
    colors: ['Coral', 'Turquoise', 'Yellow', 'Mint'],
    features: [
      'Tropical Design',
      'Breathable Fabric',
      'Vacation Ready',
      'Comfortable Fit',
      'Stylish Look'
    ],
    specifications: {
      'Material': '100% Cotton',
      'Style': 'Tropical',
      'Season': 'Summer',
      'Care': 'Hand wash'
    },
    stock: 70
  },

  // ==================== WINTER CAPS ====================
  {
    id: 'cap-winter-1',
    name: 'Warm Winter Cap',
    price: 3599,
    category: 'winter',
    productType: 'cap',
    mainImage: '/uploads/products/caps/3.png',
    images: ['/uploads/products/caps/3.png', '/uploads/products/c-3.png'],
    description: 'Insulated winter cap with ear flaps for extra warmth. Perfect for cold weather and winter sports.',
    colors: ['Black', 'Navy', 'Charcoal', 'Brown'],
    features: [
      'Thermal Insulation',
      'Ear Flap Protection',
      'Fleece Lining',
      'Wind Resistant',
      'Cold Weather Ready'
    ],
    specifications: {
      'Material': 'Wool Blend',
      'Lining': 'Fleece',
      'Season': 'Winter',
      'Insulation': 'Thermal',
      'Care': 'Dry clean recommended'
    },
    stock: 60
  },
  {
    id: 'cap-winter-2',
    name: 'Cozy Beanie Cap',
    price: 3299,
    category: 'winter',
    productType: 'cap',
    mainImage: '/uploads/products/c-1.png',
    images: ['/uploads/products/c-1.png', '/uploads/products/c-2.png'],
    description: 'Soft and cozy beanie-style cap for maximum warmth and comfort during winter months.',
    colors: ['Gray', 'Black', 'Burgundy', 'Forest Green'],
    features: [
      'Soft Knit Design',
      'Extra Warm',
      'Comfortable Fit',
      'Stretchy Material',
      'Classic Style'
    ],
    specifications: {
      'Material': 'Acrylic Knit',
      'Style': 'Beanie',
      'Season': 'Winter',
      'Fit': 'Stretchy'
    },
    stock: 90
  },

  // ==================== MALE CAPS ====================
  {
    id: 'cap-male-1',
    name: 'Gentleman\'s Classic Cap',
    price: 3799,
    category: 'male',
    productType: 'cap',
    mainImage: '/uploads/products/c-2.png',
    images: ['/uploads/products/c-2.png', '/uploads/products/c-1.png'],
    description: 'Sophisticated cap designed for the modern gentleman. Features premium materials and timeless design.',
    colors: ['Black', 'Navy', 'Charcoal', 'Brown'],
    features: [
      'Premium Quality',
      'Sophisticated Design',
      'Durable Construction',
      'Classic Style',
      'Versatile Wear'
    ],
    specifications: {
      'Material': 'Premium Cotton',
      'Style': 'Classic',
      'Gender': 'Male',
      'Fit': 'Regular'
    },
    stock: 85
  },
  {
    id: 'cap-male-2',
    name: 'Rugged Outdoor Cap',
    price: 3499,
    category: 'male',
    productType: 'cap',
    mainImage: '/uploads/products/c-3.png',
    images: ['/uploads/products/c-3.png', '/uploads/products/c-2.png'],
    description: 'Durable outdoor cap built for adventure. Perfect for hiking, camping, and outdoor activities.',
    colors: ['Olive', 'Khaki', 'Brown', 'Camo'],
    features: [
      'Rugged Construction',
      'Water Resistant',
      'Outdoor Ready',
      'Durable Fabric',
      'Adventure Proof'
    ],
    specifications: {
      'Material': 'Ripstop Nylon',
      'Features': 'Water Resistant',
      'Style': 'Outdoor',
      'Durability': 'High'
    },
    stock: 75
  },

  // ==================== FEMALE CAPS ====================
  {
    id: 'cap-female-1',
    name: 'Elegant Women\'s Cap',
    price: 3299,
    category: 'female',
    productType: 'cap',
    mainImage: '/uploads/products/caps/1.png',
    images: ['/uploads/products/caps/1.png', '/uploads/products/c-1.png'],
    description: 'Stylish and elegant cap designed specifically for women. Features feminine touches and comfortable fit.',
    colors: ['Rose', 'Lavender', 'Mint', 'Peach', 'White'],
    features: [
      'Feminine Design',
      'Elegant Style',
      'Comfortable Fit',
      'Premium Fabric',
      'Versatile Fashion'
    ],
    specifications: {
      'Material': 'Soft Cotton',
      'Style': 'Elegant',
      'Gender': 'Female',
      'Fit': 'Adjustable'
    },
    stock: 95
  },
  {
    id: 'cap-female-2',
    name: 'Chic Summer Hat',
    price: 3599,
    category: 'female',
    productType: 'cap',
    mainImage: '/uploads/products/caps/2.png',
    images: ['/uploads/products/caps/2.png', '/uploads/products/c-2.png'],
    description: 'Fashionable summer hat with wide brim for sun protection. Perfect for beach days and outdoor events.',
    colors: ['Cream', 'Pink', 'Sky Blue', 'Coral'],
    features: [
      'Wide Brim Design',
      'Sun Protection',
      'Fashionable Style',
      'Lightweight',
      'Beach Ready'
    ],
    specifications: {
      'Material': 'Straw Blend',
      'Brim': 'Wide',
      'Season': 'Summer',
      'UV Protection': 'Yes'
    },
    stock: 65
  },

  // ==================== HOT SELLING WALLETS ====================
  {
    id: 'hot-wallet-1',
    name: 'Premium Leather Wallet',
    price: 4999,
    mainImage: '/uploads/products/w-1.png',
    images: ['/uploads/products/w-1.png', '/uploads/products/w-2.png', '/uploads/products/w-3.png'],
    tag: '🔥 Best Seller',
    description: 'Handcrafted premium leather wallet with multiple card slots and bill compartments. Features RFID protection for security.',
    category: 'male',
    productType: 'wallet',
    colors: ['Black', 'Brown', 'Tan', 'Navy'],
    features: [
      'Genuine Leather Construction',
      'RFID Protection Technology',
      '8 Card Slots',
      '2 Bill Compartments',
      'ID Window',
      'Coin Pocket',
      'Handcrafted Quality'
    ],
    specifications: {
      'Material': 'Genuine Leather',
      'Dimensions': '4.5" x 3.5" x 0.5"',
      'Card Slots': '8',
      'RFID Protection': 'Yes',
      'Warranty': '1 Year',
      'Care': 'Leather conditioner recommended'
    },
    stock: 120
  },
  {
    id: 'hot-wallet-2',
    name: 'Minimalist Card Holder',
    price: 2999,
    category: 'cardholder',
    productType: 'wallet',
    mainImage: '/uploads/products/w-2.png',
    images: ['/uploads/products/w-2.png', '/uploads/products/w-1.png', '/uploads/products/w-3.png'],
    tag: '⭐ Trending',
    description: 'Sleek minimalist card holder for those who prefer to carry less. Slim design fits easily in any pocket.',
    colors: ['Black', 'Gray', 'Navy', 'Burgundy'],
    features: [
      'Ultra-Slim Design',
      'RFID Blocking',
      '6 Card Capacity',
      'Money Clip',
      'Premium Leather',
      'Minimalist Style'
    ],
    specifications: {
      'Material': 'Top Grain Leather',
      'Dimensions': '4" x 2.75" x 0.25"',
      'Capacity': '6 Cards',
      'RFID': 'Yes',
      'Weight': 'Ultra-Light'
    },
    stock: 100
  },
  {
    id: 'hot-wallet-3',
    name: 'Executive Bifold Wallet',
    price: 5499,
    category: 'male',
    productType: 'wallet',
    mainImage: '/uploads/products/w-3.png',
    images: ['/uploads/products/w-3.png', '/uploads/products/w-1.png', '/uploads/products/w-2.png'],
    tag: '🔥 Premium',
    description: 'Sophisticated executive bifold wallet with premium leather and elegant design. Perfect for professionals.',
    colors: ['Black', 'Dark Brown', 'Cognac'],
    features: [
      'Executive Design',
      'Premium Leather',
      '10 Card Slots',
      'Multiple Compartments',
      'RFID Protection',
      'Gift Box Included'
    ],
    specifications: {
      'Material': 'Full Grain Leather',
      'Style': 'Bifold',
      'Card Slots': '10',
      'RFID': 'Yes',
      'Packaging': 'Gift Box'
    },
    stock: 80
  },
  {
    id: 'hot-wallet-4',
    name: 'Smart Tech Wallet',
    price: 6999,
    category: 'male',
    productType: 'wallet',
    mainImage: '/uploads/products/w-4.png',
    images: ['/uploads/products/w-4.png', '/uploads/products/w-1.png', '/uploads/products/w-2.png'],
    tag: '🚀 Innovation',
    description: 'High-tech wallet with Bluetooth tracking and solar-powered LED light. Never lose your wallet again!',
    colors: ['Black', 'Carbon Fiber'],
    features: [
      'Bluetooth Tracking',
      'Solar LED Light',
      'RFID Protection',
      'Premium Materials',
      'App Connected',
      'Lost & Found Feature'
    ],
    specifications: {
      'Material': 'Leather & Carbon Fiber',
      'Technology': 'Bluetooth 5.0',
      'Battery': 'Solar Rechargeable',
      'App': 'iOS & Android',
      'Range': '200 feet'
    },
    stock: 50
  },

  // ==================== LONG WALLETS ====================
  {
    id: 'wallet-long-1',
    name: 'Classic Long Wallet',
    price: 4499,
    category: 'long',
    productType: 'wallet',
    mainImage: '/uploads/products/wallets/1/main.png',
    images: ['/uploads/products/wallets/1/main.png', '/uploads/products/w-1.png'],
    description: 'Spacious long wallet with multiple compartments for cards, cash, and documents. Perfect for organized storage.',
    colors: ['Black', 'Brown', 'Burgundy'],
    features: [
      'Extended Length Design',
      '12 Card Slots',
      'Full-Length Bill Compartment',
      'Zippered Coin Pocket',
      'Document Sleeve',
      'Premium Leather'
    ],
    specifications: {
      'Material': 'Genuine Leather',
      'Dimensions': '7.5" x 3.75" x 0.75"',
      'Type': 'Long Wallet',
      'Closure': 'Snap Button',
      'Card Slots': '12'
    },
    stock: 70
  },
  {
    id: 'wallet-long-2',
    name: 'Travel Long Wallet',
    price: 4799,
    category: 'long',
    productType: 'wallet',
    mainImage: '/uploads/products/wallets/2/main.png',
    images: ['/uploads/products/wallets/2/main.png', '/uploads/products/w-2.png'],
    description: 'Travel-friendly long wallet with passport holder and multiple currency compartments.',
    colors: ['Black', 'Navy', 'Brown'],
    features: [
      'Passport Holder',
      'Multiple Currency Sections',
      'Travel Document Slots',
      'Zippered Security',
      'RFID Protection',
      'Durable Construction'
    ],
    specifications: {
      'Material': 'Travel-Grade Leather',
      'Dimensions': '8" x 4" x 1"',
      'Features': 'Passport Holder',
      'RFID': 'Yes',
      'Ideal For': 'Travel'
    },
    stock: 60
  },

  // ==================== FEMALE WALLETS ====================
  {
    id: 'wallet-female-1',
    name: 'Elegant Ladies Wallet',
    price: 3999,
    category: 'female',
    productType: 'wallet',
    mainImage: '/uploads/products/wallets/3/main.png',
    images: ['/uploads/products/wallets/3/main.png', '/uploads/products/w-3.png'],
    description: 'Stylish and elegant wallet designed for women. Features beautiful color options and organized compartments.',
    colors: ['Rose Gold', 'Lavender', 'Mint', 'Blush Pink', 'Cream'],
    features: [
      'Feminine Design',
      'Multiple Card Slots',
      'Zippered Coin Pocket',
      'Photo Sleeves',
      'Premium Quality',
      'Elegant Finish'
    ],
    specifications: {
      'Material': 'Premium Leather',
      'Style': 'Elegant',
      'Gender': 'Female',
      'Dimensions': '7" x 4" x 1"',
      'Card Slots': '10'
    },
    stock: 85
  },
  {
    id: 'wallet-female-2',
    name: 'Designer Clutch Wallet',
    price: 5999,
    category: 'female',
    productType: 'wallet',
    mainImage: '/uploads/products/wallets/4/main.png',
    images: ['/uploads/products/wallets/4/main.png', '/uploads/products/w-4.png'],
    description: 'Luxurious designer clutch wallet that doubles as an evening bag. Perfect for special occasions.',
    colors: ['Gold', 'Silver', 'Rose Gold', 'Black'],
    features: [
      'Designer Style',
      'Clutch Functionality',
      'Premium Materials',
      'Chain Strap Included',
      'Multiple Compartments',
      'Luxury Finish'
    ],
    specifications: {
      'Material': 'Premium Leather & Metal',
      'Style': 'Designer Clutch',
      'Dimensions': '8" x 4.5" x 1.5"',
      'Strap': 'Detachable Chain',
      'Occasion': 'Evening/Formal'
    },
    stock: 45
  },

  // ==================== CARD HOLDERS ====================
  {
    id: 'cardholder-1',
    name: 'Slim Card Holder',
    price: 1999,
    category: 'cardholder',
    productType: 'wallet',
    mainImage: '/uploads/products/wallets/5/main.png',
    images: ['/uploads/products/wallets/5/main.png', '/uploads/products/w-2.png'],
    description: 'Ultra-slim card holder perfect for minimalists. Holds essential cards without the bulk.',
    colors: ['Black', 'Brown', 'Navy', 'Gray'],
    features: [
      'Ultra-Slim Profile',
      '4-6 Card Capacity',
      'RFID Blocking',
      'Durable Construction',
      'Easy Access',
      'Pocket Friendly'
    ],
    specifications: {
      'Material': 'Leather',
      'Dimensions': '4" x 2.75" x 0.2"',
      'Capacity': '4-6 Cards',
      'RFID': 'Yes',
      'Weight': '1 oz'
    },
    stock: 150
  },
  {
    id: 'cardholder-2',
    name: 'Metal Card Case',
    price: 2499,
    category: 'cardholder',
    productType: 'wallet',
    mainImage: '/uploads/products/w-1.png',
    images: ['/uploads/products/w-1.png', '/uploads/products/w-2.png'],
    description: 'Sleek metal card case with automatic pop-up mechanism. Modern and secure card storage.',
    colors: ['Silver', 'Black', 'Rose Gold', 'Gunmetal'],
    features: [
      'Aluminum Construction',
      'Pop-Up Mechanism',
      'RFID Protection',
      'Scratch Resistant',
      'Modern Design',
      'Secure Storage'
    ],
    specifications: {
      'Material': 'Aluminum Alloy',
      'Mechanism': 'Automatic Pop-Up',
      'Capacity': '6 Cards',
      'RFID': 'Yes',
      'Finish': 'Anodized'
    },
    stock: 110
  },
  {
    id: 'cardholder-3',
    name: 'Business Card Holder',
    price: 2799,
    category: 'cardholder',
    productType: 'wallet',
    mainImage: '/uploads/products/w-3.png',
    images: ['/uploads/products/w-3.png', '/uploads/products/w-1.png'],
    description: 'Professional business card holder with elegant design. Perfect for networking and business meetings.',
    colors: ['Black', 'Brown', 'Navy'],
    features: [
      'Professional Design',
      'Business Card Storage',
      'Premium Leather',
      'Magnetic Closure',
      'Compact Size',
      'Gift Ready'
    ],
    specifications: {
      'Material': 'Premium Leather',
      'Style': 'Business',
      'Capacity': '20 Business Cards',
      'Closure': 'Magnetic',
      'Dimensions': '4" x 2.5" x 0.5"'
    },
    stock: 90
  }
];

const importData = async () => {
  try {
    await connectDB();

    await Product.deleteMany();
    await User.deleteMany();

    console.log('🗑️  Data Destroyed!');

    // Create admin user
    await User.create({
      name: 'Admin User',
      email: 'admin@classiccarrry.com',
      password: 'admin123',
      role: 'admin'
    });

    console.log('✅ Admin user created');

    // Insert products
    await Product.insertMany(productsData);

    console.log('✅ Products imported');
    console.log(`📦 Total products: ${productsData.length}`);
    console.log(`   - Caps: ${productsData.filter(p => p.productType === 'cap').length}`);
    console.log(`   - Wallets: ${productsData.filter(p => p.productType === 'wallet').length}`);
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
