# 📦 Product Management Guide

Complete guide for adding, updating, and removing products from your Classic Carrry website.

---

## 🎯 Overview

Your website is fully dynamic - all products are stored in MongoDB and images are served from the backend. This means you can easily manage products without touching the frontend code!

---

## ✨ Method 1: Add Products via Database (Recommended)

### Step 1: Add Product Images

1. **Place your product images** in the backend uploads folder:
   ```
   backend/uploads/products/
   ```

2. **Organize images** (optional but recommended):
   ```
   backend/uploads/products/
   ├── caps/
   │   └── new-cap-1.png
   ├── wallets/
   │   └── new-wallet-1.png
   └── new-product.png
   ```

3. **Image requirements**:
   - Format: PNG, JPG, or WEBP
   - Recommended size: 800x800px
   - Max file size: 2MB
   - Use lowercase names with hyphens: `premium-cap-black.png`

### Step 2: Add Product to Seed Data

Edit `backend/scripts/seedData.js` and add your product to the `productsData` array:

```javascript
{
  id: 'unique-product-id',           // Must be unique!
  name: 'Premium Leather Cap',       // Product name
  price: 3999,                        // Price in smallest currency unit (e.g., cents)
  mainImage: '/uploads/products/new-cap.png',  // Main product image
  images: [                           // Gallery images (optional)
    '/uploads/products/new-cap.png',
    '/uploads/products/new-cap-2.png',
    '/uploads/products/new-cap-3.png'
  ],
  tag: '🔥 New Arrival',             // Optional tag (e.g., '🔥 Hot', '⭐ Trending')
  description: 'Premium quality leather cap with modern design.',
  category: 'male',                   // Required: summer, winter, male, female, sports, long, cardholder
  productType: 'cap',                 // Required: 'cap' or 'wallet'
  colors: ['Black', 'Brown', 'Navy'], // Available colors
  features: [                         // Product features
    'Premium Leather',
    'Adjustable Strap',
    'Breathable Design',
    'One Size Fits All'
  ],
  specifications: {                   // Technical specs (optional)
    'Material': 'Genuine Leather',
    'Size': 'One Size',
    'Care': 'Hand wash only'
  },
  stock: 100                          // Available quantity
}
```

### Step 3: Re-seed the Database

Run the seed script to update the database:

```bash
cd backend
npm run seed
```

**⚠️ Warning**: This will replace ALL products in the database!

### Step 4: Verify

1. Restart backend server (if running)
2. Check the product appears on your website
3. Test the product detail page
4. Verify images load correctly

---

## 🔧 Method 2: Add Products via API (Advanced)

### Using API Endpoints

You can add products programmatically using the API:

```bash
# Login as admin first
curl -X POST http://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@classiccarrry.com",
    "password": "admin123"
  }'

# Copy the token from response, then create product
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "id": "new-product-1",
    "name": "New Product",
    "price": 2999,
    "mainImage": "/uploads/products/new-product.png",
    "category": "male",
    "productType": "cap",
    "description": "Amazing new product",
    "colors": ["Black", "White"],
    "stock": 50
  }'
```

### Using MongoDB Compass (GUI Tool)

1. **Download MongoDB Compass**: https://www.mongodb.com/products/compass
2. **Connect** to your database: `mongodb://localhost:27017/classic-carrry`
3. **Navigate** to `products` collection
4. **Click** "Add Data" → "Insert Document"
5. **Paste** your product JSON
6. **Click** "Insert"

---

## 🗑️ Remove Products

### Method 1: Via Seed Data (Recommended)

1. **Edit** `backend/scripts/seedData.js`
2. **Remove** the product object from `productsData` array
3. **Run** seed script:
   ```bash
   cd backend
   npm run seed
   ```

### Method 2: Via API

```bash
# Delete product by ID
curl -X DELETE http://localhost:5000/api/products/product-id-here \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### Method 3: Via MongoDB Compass

1. Open MongoDB Compass
2. Navigate to `products` collection
3. Find the product
4. Click the trash icon
5. Confirm deletion

### Method 4: Soft Delete (Hide Product)

Instead of deleting, you can hide a product:

```bash
# Update product to inactive
curl -X PUT http://localhost:5000/api/products/product-id-here \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{"isActive": false}'
```

This keeps the product in database but hides it from the website.

---

## ✏️ Update Products

### Method 1: Via Seed Data

1. Edit `backend/scripts/seedData.js`
2. Modify the product details
3. Run: `npm run seed`

### Method 2: Via API

```bash
curl -X PUT http://localhost:5000/api/products/product-id-here \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "name": "Updated Product Name",
    "price": 3499,
    "stock": 75
  }'
```

### Method 3: Via MongoDB Compass

1. Open MongoDB Compass
2. Find the product
3. Click the edit icon
4. Modify fields
5. Save changes

---

## 📋 Product Field Reference

### Required Fields

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `id` | String | Unique identifier | `"premium-cap-1"` |
| `name` | String | Product name | `"Premium Baseball Cap"` |
| `price` | Number | Price (in cents/smallest unit) | `2999` (= $29.99) |
| `mainImage` | String | Main product image path | `"/uploads/products/cap.png"` |
| `category` | String | Product category | `"male"`, `"female"`, `"summer"`, etc. |
| `productType` | String | Type of product | `"cap"` or `"wallet"` |

### Optional Fields

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `images` | Array | Gallery images | `["/uploads/products/1.png", ...]` |
| `tag` | String | Special tag/badge | `"🔥 Best Seller"` |
| `description` | String | Product description | `"Premium quality cap..."` |
| `colors` | Array | Available colors | `["Black", "Navy", "Red"]` |
| `features` | Array | Product features | `["Breathable", "Adjustable"]` |
| `specifications` | Object | Technical specs | `{"Material": "Cotton"}` |
| `stock` | Number | Available quantity | `100` |
| `isActive` | Boolean | Show/hide product | `true` or `false` |

### Valid Categories

**For Caps:**
- `summer` - Summer caps
- `winter` - Winter caps
- `male` - Men's caps
- `female` - Women's caps
- `sports` - Sports caps

**For Wallets:**
- `male` - Men's wallets
- `female` - Women's wallets
- `long` - Long wallets
- `cardholder` - Card holders

---

## 🎨 Image Management

### Adding Images

1. **Copy image** to `backend/uploads/products/`:
   ```bash
   # Windows
   copy my-image.png backend\uploads\products\
   
   # Mac/Linux
   cp my-image.png backend/uploads/products/
   ```

2. **Reference in product**:
   ```javascript
   mainImage: '/uploads/products/my-image.png'
   ```

### Image Best Practices

- ✅ Use descriptive names: `premium-leather-wallet-black.png`
- ✅ Optimize images before uploading (compress)
- ✅ Use consistent dimensions (800x800px recommended)
- ✅ Use WebP format for better performance
- ✅ Keep file sizes under 500KB
- ❌ Don't use spaces in filenames
- ❌ Don't use special characters

### Removing Images

1. Delete from `backend/uploads/products/`
2. Make sure no products reference it
3. Restart backend server

---

## 🔥 Hot Selling Products

To mark a product as "hot selling" (appears on homepage):

1. **Set the ID** to start with `hot-`:
   ```javascript
   id: 'hot-cap-1'  // Will appear on homepage
   ```

2. **Add a tag**:
   ```javascript
   tag: '🔥 Best Seller'
   ```

Products with IDs starting with `hot-` automatically appear in the "Hot Selling" section on the homepage.

---

## 📊 Bulk Operations

### Add Multiple Products at Once

Edit `seedData.js` and add multiple products to the array:

```javascript
const productsData = [
  { id: 'product-1', name: 'Product 1', ... },
  { id: 'product-2', name: 'Product 2', ... },
  { id: 'product-3', name: 'Product 3', ... },
  // Add as many as you need
];
```

Then run: `npm run seed`

### Import from CSV/Excel

Create a script to convert CSV to product objects:

```javascript
// backend/scripts/importFromCSV.js
import fs from 'fs';
import csv from 'csv-parser';

const products = [];

fs.createReadStream('products.csv')
  .pipe(csv())
  .on('data', (row) => {
    products.push({
      id: row.id,
      name: row.name,
      price: parseInt(row.price),
      mainImage: row.image,
      category: row.category,
      productType: row.type,
      stock: parseInt(row.stock)
    });
  })
  .on('end', () => {
    console.log(JSON.stringify(products, null, 2));
  });
```

---

## 🧪 Testing Your Changes

After adding/removing products:

1. **Check API response**:
   ```bash
   curl http://localhost:5000/api/products
   ```

2. **Check specific product**:
   ```bash
   curl http://localhost:5000/api/products/your-product-id
   ```

3. **Check image loads**:
   ```
   http://localhost:5000/uploads/products/your-image.png
   ```

4. **Check frontend**:
   - Visit homepage
   - Check category pages (Caps/Wallets)
   - Click on product to see details
   - Verify images load

---

## 🚨 Troubleshooting

### Product not showing on website

- ✅ Check `isActive` is `true`
- ✅ Verify product is in database: `curl http://localhost:5000/api/products`
- ✅ Check category matches (`cap` or `wallet`)
- ✅ Restart backend server

### Images not loading

- ✅ Verify image exists in `backend/uploads/products/`
- ✅ Check image path starts with `/uploads/products/`
- ✅ Verify backend server is running
- ✅ Check browser console for errors

### Product ID already exists

- ✅ Use a unique ID for each product
- ✅ Check existing products: `curl http://localhost:5000/api/products`
- ✅ Use format: `category-name-number` (e.g., `cap-premium-1`)

### Seed script fails

- ✅ Check MongoDB is running
- ✅ Verify JSON syntax in `seedData.js`
- ✅ Check all required fields are present
- ✅ Ensure no duplicate IDs

---

## 📝 Quick Reference

### Add Product Checklist

- [ ] Add product images to `backend/uploads/products/`
- [ ] Edit `backend/scripts/seedData.js`
- [ ] Add product object with all required fields
- [ ] Run `npm run seed` in backend folder
- [ ] Verify product appears on website
- [ ] Test product detail page
- [ ] Check images load correctly

### Remove Product Checklist

- [ ] Edit `backend/scripts/seedData.js`
- [ ] Remove product object from array
- [ ] Run `npm run seed` in backend folder
- [ ] Verify product removed from website
- [ ] (Optional) Delete unused images

---

## 🎓 Examples

### Example 1: Add a New Cap

```javascript
{
  id: 'cap-vintage-2024',
  name: 'Vintage Denim Cap',
  price: 3499,
  mainImage: '/uploads/products/caps/vintage-denim.png',
  images: [
    '/uploads/products/caps/vintage-denim.png',
    '/uploads/products/caps/vintage-denim-side.png'
  ],
  tag: '✨ New',
  description: 'Classic vintage-style denim cap with distressed finish.',
  category: 'male',
  productType: 'cap',
  colors: ['Blue Denim', 'Black Denim', 'Light Wash'],
  features: [
    '100% Cotton Denim',
    'Vintage Distressed Look',
    'Adjustable Metal Buckle',
    'Unstructured Crown'
  ],
  specifications: {
    'Material': '100% Cotton Denim',
    'Style': 'Vintage',
    'Closure': 'Metal Buckle',
    'Care': 'Hand wash cold'
  },
  stock: 50
}
```

### Example 2: Add a New Wallet

```javascript
{
  id: 'wallet-slim-carbon',
  name: 'Carbon Fiber Slim Wallet',
  price: 5999,
  mainImage: '/uploads/products/wallets/carbon-slim.png',
  images: [
    '/uploads/products/wallets/carbon-slim.png',
    '/uploads/products/wallets/carbon-slim-open.png'
  ],
  tag: '🚀 Tech',
  description: 'Ultra-slim wallet with carbon fiber construction and RFID protection.',
  category: 'cardholder',
  productType: 'wallet',
  colors: ['Carbon Black', 'Carbon Gray'],
  features: [
    'Carbon Fiber Construction',
    'RFID Blocking Technology',
    'Holds 6-8 Cards',
    'Ultra-Slim Design',
    'Money Clip Included'
  ],
  specifications: {
    'Material': 'Carbon Fiber',
    'Dimensions': '3.5" x 2.5" x 0.2"',
    'Capacity': '6-8 Cards',
    'RFID Protection': 'Yes',
    'Weight': '0.5 oz'
  },
  stock: 75
}
```

---

## 🎉 That's It!

You now know how to manage products on your Classic Carrry website. Remember:

- **Always backup** your database before major changes
- **Test locally** before deploying to production
- **Optimize images** for better performance
- **Use unique IDs** for each product

For more help, check:
- `backend/API_DOCUMENTATION.md` - API reference
- `DEPLOYMENT_GUIDE.md` - Deployment instructions
- `SETUP_COMPLETE.md` - Setup overview
