// Product Data
export const hotProducts = [
  // Hot Selling Caps
  {
    id: 'hot-1',
    name: 'Classic Baseball Cap',
    price: 2999,
    mainImage: '/assets/images/c-1.png',
    images: ['/assets/images/c-1.png', '/assets/images/c-2.png', '/assets/images/c-3.png', '/assets/images/caps/1.png'],
    tag: '🔥 Best Seller',
    description: 'Timeless baseball cap design. Perfect for casual everyday wear with premium cotton construction.',
    category: 'male',
    colors: ['Black', 'Navy Blue', 'Forest Green', 'Burgundy', 'Charcoal'],
    features: ['Cotton Twill', 'Curved Brim', 'Adjustable Strap', 'Embroidered Logo'],
    specifications: { 'Style': 'Baseball', 'Material': 'Cotton Twill', 'Brim': 'Curved', 'Closure': 'Adjustable Strap' }
  },
  {
    id: 'hot-2',
    name: 'Urban Street Cap',
    price: 3299,
    category: 'male',
    mainImage: '/assets/images/c-2.png',
    images: ['/assets/images/c-2.png', '/assets/images/c-1.png', '/assets/images/caps/2.png'],
    tag: '⭐ Trending',
    description: 'Modern street style for urban fashion. Perfect for casual everyday wear with contemporary design.',
    colors: ['Black', 'Gray', 'Navy'],
    features: ['Street Style Design', 'Urban Fashion', 'Durable Construction', 'Versatile Look'],
    specifications: { 'Style': 'Urban Street', 'Target': 'Men', 'Occasion': 'Casual', 'Durability': 'High' }
  },
  {
    id: 'hot-3',
    name: 'Floral Embroidered Cap',
    price: 3199,
    category: 'female',
    mainImage: '/assets/images/c-1.png',
    images: ['/assets/images/c-1.png', '/assets/images/caps/1.png', '/assets/images/c-3.png'],
    tag: '💖 Popular',
    description: 'Elegant floral design for women. Beautiful embroidery with premium finish and feminine charm.',
    colors: ['Blush Pink', 'Lavender', 'Mint Green', 'Cream', 'White'],
    features: ['Floral Embroidery', 'Premium Cotton', 'Feminine Design', 'Adjustable Strap'],
    specifications: { 'Design': 'Floral Embroidered', 'Target': 'Women', 'Material': 'Premium Cotton', 'Closure': 'Adjustable Strap' }
  },
  {
    id: 'hot-4',
    name: 'Summer Breeze Cap',
    price: 2799,
    category: 'summer',
    mainImage: '/assets/images/caps/1.png',
    images: ['/assets/images/caps/1.png', '/assets/images/c-1.png', '/assets/images/c-3.png'],
    tag: '☀️ Summer Hit',
    description: 'Breathable straw material perfect for summer activities and beach outings with UV protection.',
    colors: ['Natural', 'Light Brown', 'Beige'],
    features: ['Breathable Straw Material', 'UV Protection', 'Lightweight', 'Adjustable Size'],
    specifications: { 'Material': 'Natural Straw', 'UV Protection': 'UPF 50+', 'Weight': '85g', 'Season': 'Summer' }
  },
  // Hot Selling Wallets
  {
    id: 'hot-5',
    name: 'Executive Bi-Fold',
    price: 4999,
    category: 'male',
    mainImage: '/assets/images/wallets/1/main.png',
    images: ['/assets/images/wallets/1/main.png', '/assets/images/w-1.png', '/assets/images/wallets/3/main.png'],
    tag: '💼 Executive Choice',
    description: 'Professional bi-fold wallet for business. Premium leather with executive styling and superior craftsmanship.',
    colors: ['Black Leather', 'Brown Leather', 'Cognac', 'Navy Leather'],
    features: ['Premium Leather', 'Bi-Fold Design', 'Multiple Card Slots', 'Professional Look'],
    specifications: { 'Style': 'Bi-Fold', 'Material': 'Genuine Leather', 'Card Slots': '10', 'Target': 'Business Professional' }
  },
  {
    id: 'hot-6',
    name: 'Minimalist Cardholder',
    price: 2499,
    category: 'cardholder',
    mainImage: '/assets/images/wallets/4/main.png',
    images: ['/assets/images/wallets/4/main.png', '/assets/images/w-2.png', '/assets/images/wallets/1/main.png'],
    tag: '✨ Minimalist',
    description: 'Slim design with security protection. Perfect for minimalist lifestyle with RFID blocking technology.',
    colors: ['Black', 'Brown', 'Navy'],
    features: ['Slim Profile', 'RFID Blocking', 'Quick Access', 'Durable Material'],
    specifications: { 'Type': 'Card Holder', 'Capacity': '6-8 Cards', 'Protection': 'RFID Blocking', 'Profile': 'Ultra Slim' }
  },
  {
    id: 'hot-7',
    name: 'Elegant Clutch Wallet',
    price: 5499,
    category: 'female',
    mainImage: '/assets/images/wallets/2/main.png',
    images: ['/assets/images/wallets/2/main.png', '/assets/images/w-1.png', '/assets/images/wallets/4/main.png'],
    tag: '👑 Luxury',
    description: 'Elegant design with chain strap. Perfect for evening events and daily use with sophisticated appeal.',
    colors: ['Black', 'Brown', 'Burgundy'],
    features: ['Chain Strap', 'Elegant Design', 'Multiple Compartments', 'Premium Finish'],
    specifications: { 'Style': 'Clutch', 'Strap': 'Detachable Chain', 'Compartments': '6', 'Target': 'Women' }
  },
  {
    id: 'hot-8',
    name: 'Smart Money Clip',
    price: 3999,
    category: 'male',
    mainImage: '/assets/images/w-2.png',
    images: ['/assets/images/w-2.png', '/assets/images/wallets/4/main.png', '/assets/images/wallets/1/main.png'],
    tag: '🚀 Smart Design',
    description: 'Modern money clip with card slots. Smart design for the modern man with innovative functionality.',
    colors: ['Black', 'Brown', 'Silver'],
    features: ['Money Clip Design', 'Card Slots', 'Compact Size', 'Modern Style'],
    specifications: { 'Type': 'Money Clip', 'Card Slots': '4-6', 'Material': 'Metal & Leather', 'Target': 'Men' }
  }
];

export const caps = [
  // Summer Collection
  { id: 'cap-1', name: 'Summer Breeze Cap', price: 2799, category: 'summer', mainImage: '/assets/images/caps/1.png', images: ['/assets/images/caps/1.png', '/assets/images/c-1.png'], description: 'Breathable straw material perfect for summer activities.', tag: 'Summer Special', colors: ['Natural', 'Light Brown', 'Beige'] },
  { id: 'cap-2', name: 'Beach Visor', price: 2599, category: 'summer', mainImage: '/assets/images/c-3.png', images: ['/assets/images/c-3.png', '/assets/images/caps/1.png'], description: 'Lightweight visor for beach and outdoor activities.', tag: 'Beach Ready', colors: ['White', 'Blue', 'Pink'] },
  { id: 'cap-3', name: 'Mesh Trucker Cap', price: 3199, category: 'summer', mainImage: '/assets/images/c-2.png', images: ['/assets/images/c-2.png', '/assets/images/caps/3.png'], description: 'Classic trucker style with breathable mesh back.', colors: ['Black', 'Navy', 'Red'] },
  { id: 'cap-4', name: 'Cotton Sun Hat', price: 3499, category: 'summer', mainImage: '/assets/images/caps/1.png', images: ['/assets/images/caps/1.png', '/assets/images/c-3.png'], description: 'Wide brim cotton hat for maximum sun protection.', colors: ['Beige', 'White', 'Khaki'] },
  // Winter Collection
  { id: 'cap-5', name: 'Wool Blend Beanie', price: 3299, category: 'winter', mainImage: '/assets/images/caps/2.png', images: ['/assets/images/caps/2.png', '/assets/images/caps/3.png'], description: 'Warm wool blend for cold weather.', tag: 'Winter Essential', colors: ['Black', 'Gray', 'Navy'] },
  { id: 'cap-6', name: 'Fleece Lined Cap', price: 3799, category: 'winter', mainImage: '/assets/images/c-1.png', images: ['/assets/images/c-1.png', '/assets/images/caps/2.png'], description: 'Insulated cap with fleece lining.', colors: ['Black', 'Brown', 'Charcoal'] },
  { id: 'cap-7', name: 'Thermal Knit Beanie', price: 2899, category: 'winter', mainImage: '/assets/images/caps/3.png', images: ['/assets/images/caps/3.png', '/assets/images/caps/2.png'], description: 'Soft knit beanie with thermal properties.', colors: ['Black', 'Gray', 'Navy'] },
  { id: 'cap-8', name: 'Winter Sports Cap', price: 4199, category: 'winter', mainImage: '/assets/images/c-2.png', images: ['/assets/images/c-2.png', '/assets/images/caps/2.png'], description: 'Technical winter cap for outdoor sports.', colors: ['Black', 'Red', 'Blue'] },
  // Male Collection
  { id: 'cap-9', name: 'Classic Baseball Cap', price: 2999, category: 'male', mainImage: '/assets/images/c-1.png', images: ['/assets/images/c-1.png', '/assets/images/c-2.png'], description: 'Timeless baseball cap design.', tag: 'Classic', colors: ['Black', 'Navy Blue', 'Forest Green'] },
  { id: 'cap-10', name: 'Urban Street Cap', price: 3299, category: 'male', mainImage: '/assets/images/c-2.png', images: ['/assets/images/c-2.png', '/assets/images/c-1.png'], description: 'Modern street style for urban fashion.', tag: 'Trendy', colors: ['Black', 'Gray', 'White'] },
  { id: 'cap-11', name: 'Snapback Pro', price: 3599, category: 'male', mainImage: '/assets/images/caps/3.png', images: ['/assets/images/caps/3.png', '/assets/images/c-2.png'], description: 'Professional snapback with premium materials.', colors: ['Black', 'Navy', 'Red'] },
  { id: 'cap-12', name: 'Military Style Cap', price: 3799, category: 'male', mainImage: '/assets/images/c-3.png', images: ['/assets/images/c-3.png', '/assets/images/c-2.png'], description: 'Tactical military inspired design.', colors: ['Olive', 'Black', 'Camo'] },
  // Female Collection
  { id: 'cap-13', name: 'Floral Embroidered Cap', price: 3199, category: 'female', mainImage: '/assets/images/c-1.png', images: ['/assets/images/c-1.png', '/assets/images/caps/1.png'], description: 'Elegant floral design for women.', tag: 'Elegant', colors: ['Blush Pink', 'Lavender', 'Mint Green'] },
  { id: 'cap-14', name: 'Pastel Baseball Cap', price: 2899, category: 'female', mainImage: '/assets/images/caps/1.png', images: ['/assets/images/caps/1.png', '/assets/images/c-1.png'], description: 'Soft pastel colors perfect for feminine style.', colors: ['Pink', 'Lavender', 'Mint'] },
  { id: 'cap-15', name: 'Bow Detail Cap', price: 3399, category: 'female', mainImage: '/assets/images/c-3.png', images: ['/assets/images/c-3.png', '/assets/images/caps/1.png'], description: 'Cute bow detail adds feminine charm.', colors: ['Pink', 'White', 'Cream'] },
  { id: 'cap-16', name: 'Rose Gold Cap', price: 3699, category: 'female', mainImage: '/assets/images/caps/2.png', images: ['/assets/images/caps/2.png', '/assets/images/c-1.png'], description: 'Trendy rose gold accents with premium materials.', colors: ['Rose Gold', 'Pink', 'White'] }
];

export const wallets = [
  // Male Collection
  { id: 'wal-1', name: 'Executive Bi-Fold', price: 4999, category: 'male', mainImage: '/assets/images/wallets/1/main.png', images: ['/assets/images/wallets/1/main.png', '/assets/images/w-1.png'], description: 'Professional bi-fold wallet for business.', tag: 'Executive', colors: ['Black', 'Brown', 'Cognac'] },
  { id: 'wal-2', name: 'Smart Money Clip', price: 3999, category: 'male', mainImage: '/assets/images/w-2.png', images: ['/assets/images/w-2.png', '/assets/images/wallets/4/main.png'], description: 'Modern money clip with card slots.', colors: ['Black', 'Brown', 'Silver'] },
  { id: 'wal-3', name: 'Classic Leather Wallet', price: 4299, category: 'male', mainImage: '/assets/images/w-1.png', images: ['/assets/images/w-1.png', '/assets/images/wallets/1/main.png'], description: 'Timeless leather wallet with traditional craftsmanship.', colors: ['Black', 'Brown', 'Tan'] },
  { id: 'wal-4', name: 'RFID Blocking Wallet', price: 4599, category: 'male', mainImage: '/assets/images/wallets/3/main.png', images: ['/assets/images/wallets/3/main.png', '/assets/images/w-1.png'], description: 'Security-focused wallet with RFID protection.', colors: ['Black', 'Navy', 'Brown'] },
  // Female Collection
  { id: 'wal-5', name: 'Elegant Clutch Wallet', price: 5499, category: 'female', mainImage: '/assets/images/wallets/2/main.png', images: ['/assets/images/wallets/2/main.png', '/assets/images/w-1.png'], description: 'Elegant design with chain strap.', tag: 'Luxury', colors: ['Black', 'Brown', 'Burgundy'] },
  { id: 'wal-6', name: 'Designer Long Wallet', price: 4799, category: 'female', mainImage: '/assets/images/w-3.png', images: ['/assets/images/w-3.png', '/assets/images/wallets/2/main.png'], description: 'Spacious long wallet with multiple compartments.', colors: ['Pink', 'Black', 'Beige'] },
  { id: 'wal-7', name: 'Compact Coin Purse', price: 2999, category: 'female', mainImage: '/assets/images/w-4.png', images: ['/assets/images/w-4.png', '/assets/images/wallets/2/main.png'], description: 'Small and stylish coin purse.', colors: ['Red', 'Pink', 'Black'] },
  { id: 'wal-8', name: 'Crossbody Wallet', price: 5999, category: 'female', mainImage: '/assets/images/wallets/5/main.png', images: ['/assets/images/wallets/5/main.png', '/assets/images/w-3.png'], description: 'Versatile crossbody wallet for on-the-go.', colors: ['Black', 'Tan', 'Navy'] },
  // Card Holders
  { id: 'wal-9', name: 'Minimalist Cardholder', price: 2499, category: 'cardholder', mainImage: '/assets/images/wallets/4/main.png', images: ['/assets/images/wallets/4/main.png', '/assets/images/w-2.png'], description: 'Slim design with security protection.', tag: 'Minimalist', colors: ['Black', 'Brown', 'Navy'] },
  { id: 'wal-10', name: 'Metal Cardholder', price: 2799, category: 'cardholder', mainImage: '/assets/images/w-2.png', images: ['/assets/images/w-2.png', '/assets/images/wallets/4/main.png'], description: 'Sleek metal cardholder with RFID blocking.', colors: ['Silver', 'Black', 'Gold'] },
  // Long Wallets
  { id: 'wal-11', name: 'Premium Long Wallet', price: 5299, category: 'long', mainImage: '/assets/images/w-1.png', images: ['/assets/images/w-1.png', '/assets/images/wallets/1/main.png'], description: 'Spacious long wallet with premium leather.', colors: ['Black', 'Brown', 'Cognac'] },
  { id: 'wal-12', name: 'Travel Long Wallet', price: 4899, category: 'long', mainImage: '/assets/images/w-3.png', images: ['/assets/images/w-3.png', '/assets/images/wallets/3/main.png'], description: 'Perfect for travel with passport slot.', colors: ['Black', 'Navy', 'Brown'] }
];

export const allProducts = [...hotProducts, ...caps, ...wallets];
