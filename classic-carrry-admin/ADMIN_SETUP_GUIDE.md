# Classic Carrry Admin Panel - Complete Setup Guide

## 🚀 Quick Start (5 Minutes)

### Step 1: Start the Backend Server

```bash
# Navigate to backend directory
cd classic-carrry-r/backend

# Install dependencies (if not already done)
npm install

# Start MongoDB (if not running)
# Windows: net start MongoDB
# macOS: brew services start mongodb-community
# Linux: sudo systemctl start mongodb

# Seed the database with sample data
npm run seed

# Start the backend server
npm run dev
```

Backend should now be running on `http://localhost:5000`

### Step 2: Start the Admin Panel

```bash
# Navigate to admin panel directory
cd classic-carrry-r/classic-carrry-admin

# Install dependencies (if not already done)
npm install

# Start the development server
npm run dev
```

Admin panel should now be running on `http://localhost:5173`

### Step 3: Login to Admin Panel

1. Open your browser and go to `http://localhost:5173`
2. Login with default admin credentials:
   - **Email:** admin@classiccarrry.com
   - **Password:** admin123

🎉 **You're all set!** You can now manage products, orders, and users.

---

## 📋 Detailed Setup Instructions

### Prerequisites

Before you begin, ensure you have:

- ✅ Node.js (v18 or higher) installed
- ✅ MongoDB installed and running
- ✅ Backend API running on port 5000
- ✅ Git (optional, for version control)

### Backend Setup

1. **Install Backend Dependencies:**
```bash
cd classic-carrry-r/backend
npm install
```

2. **Configure Environment Variables:**
```bash
# Copy the example env file
cp .env.example .env

# Edit .env file with your settings
```

Required environment variables:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/classic-carrry
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=30d
FRONTEND_URL=http://localhost:5173
```

3. **Start MongoDB:**

**Windows:**
```bash
net start MongoDB
```

**macOS:**
```bash
brew services start mongodb-community
```

**Linux:**
```bash
sudo systemctl start mongodb
```

4. **Seed Database:**
```bash
npm run seed
```

This will create:
- Admin user (admin@classiccarrry.com / admin123)
- 20+ sample products (caps and wallets)

5. **Start Backend Server:**
```bash
npm run dev
```

Server will start on `http://localhost:5000`

### Admin Panel Setup

1. **Navigate to Admin Panel Directory:**
```bash
cd classic-carrry-r/classic-carrry-admin
```

2. **Install Dependencies:**
```bash
npm install
```

3. **Configure Environment Variables:**
```bash
# Copy the example env file
cp .env.example .env
```

Update `.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

4. **Start Development Server:**
```bash
npm run dev
```

Admin panel will start on `http://localhost:5173`

---

## 🎯 Admin Panel Features

### 1. Dashboard
- **Overview Statistics:**
  - Total Products
  - Total Orders
  - Total Users
  - Pending Orders
  - Total Revenue

- **Recent Orders Table:**
  - View last 5 orders
  - Quick status overview
  - Direct link to order details

- **Quick Actions:**
  - Add new product
  - Manage orders
  - View users

### 2. Product Management

**View Products:**
- Filter by type (All, Caps, Wallets)
- See product details (name, category, price, stock, status)
- Edit or delete products

**Add New Product:**
- Product ID (unique identifier)
- Product Name
- Price (in Rs)
- Stock quantity
- Product Type (Cap/Wallet)
- Category (Male, Female, Summer, Winter, Sports, Long, Card Holder)
- Main Image URL
- Additional Images (comma-separated)
- Description
- Tag (e.g., "🔥 Best Seller")
- Colors (comma-separated)
- Features (comma-separated)
- Active/Inactive status

**Edit Product:**
- Update any product information
- Cannot change Product ID
- All other fields are editable

**Delete Product:**
- Permanently remove product from database
- Confirmation required

### 3. Order Management

**View Orders:**
- Filter by status (All, Pending, Processing, Shipped, Delivered, Cancelled)
- See order details (order number, customer, items, total, status, date)
- View full order details

**Order Details:**
- Customer information (name, email, phone, address)
- Order items with images and quantities
- Pricing breakdown (subtotal, delivery, total)
- Update order status
- Payment status
- Order date and time

**Update Order Status:**
- Pending → Processing → Shipped → Delivered
- Or mark as Cancelled
- One-click status updates

### 4. User Management

**View Users:**
- See all registered users
- User details (name, email, phone, role, status)
- Join date
- Delete users (except admins)

**User Information:**
- Name and profile
- Email address
- Phone number (if provided)
- Role (Admin/User)
- Status (Active/Inactive)
- Registration date

---

## 🔐 Security Features

### Authentication
- JWT token-based authentication
- Admin role verification
- Secure password hashing (bcrypt)
- Token stored in localStorage

### Authorization
- Protected routes (require authentication)
- Admin-only access
- Role-based permissions
- Automatic logout on token expiration

### API Security
- CORS configuration
- Helmet security headers
- Input validation
- Error handling

---

## 🎨 Customization

### Change Primary Color

Edit `classic-carrry-admin/src/index.css`:
```css
/* Find and replace #D2C1B6 with your color */
.bg-[#D2C1B6] { background-color: #YOUR_COLOR; }
.text-[#D2C1B6] { color: #YOUR_COLOR; }
```

### Add New Menu Items

Edit `classic-carrry-admin/src/components/AdminLayout.jsx`:
```javascript
const menuItems = [
  { path: '/', icon: 'fa-dashboard', label: 'Dashboard' },
  { path: '/products', icon: 'fa-box', label: 'Products' },
  { path: '/orders', icon: 'fa-shopping-cart', label: 'Orders' },
  { path: '/users', icon: 'fa-users', label: 'Users' },
  // Add your custom menu items here
  { path: '/settings', icon: 'fa-cog', label: 'Settings' },
];
```

### Modify Dashboard Stats

Edit `classic-carrry-admin/src/pages/Dashboard.jsx` to add custom statistics.

---

## 🐛 Troubleshooting

### Issue: Cannot connect to backend

**Solution:**
1. Check if backend is running: `http://localhost:5000`
2. Verify VITE_API_URL in `.env`
3. Check CORS settings in backend

### Issue: Login fails with "Not authorized as admin"

**Solution:**
1. Ensure you're using admin credentials
2. Check user role in database
3. Re-seed database: `npm run seed`

### Issue: Products not loading

**Solution:**
1. Check backend console for errors
2. Verify MongoDB is running
3. Check if products exist in database
4. Check browser console for API errors

### Issue: CORS errors

**Solution:**
Update backend `.env`:
```env
FRONTEND_URL=http://localhost:5173
```

Restart backend server.

### Issue: Build fails

**Solution:**
```bash
# Clear cache and reinstall
rm -rf node_modules
rm package-lock.json
npm install
```

---

## 📦 Production Deployment

### Build Admin Panel

```bash
cd classic-carrry-r/classic-carrry-admin
npm run build
```

Output will be in `dist` folder.

### Deploy to Netlify

1. **Build the project:**
```bash
npm run build
```

2. **Deploy to Netlify:**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist
```

3. **Set environment variables in Netlify:**
- Go to Site Settings → Environment Variables
- Add: `VITE_API_URL=https://your-backend-url.com/api`

### Deploy to Vercel

1. **Install Vercel CLI:**
```bash
npm install -g vercel
```

2. **Deploy:**
```bash
vercel --prod
```

3. **Set environment variables:**
```bash
vercel env add VITE_API_URL
```

### Deploy Backend

See `backend/SETUP_GUIDE.md` for backend deployment instructions.

---

## 📊 Database Management

### View Database

```bash
# Connect to MongoDB
mongosh

# Switch to database
use classic-carrry

# View collections
show collections

# View products
db.products.find().pretty()

# View orders
db.orders.find().pretty()

# View users
db.users.find().pretty()
```

### Reset Database

```bash
cd classic-carrry-r/backend
npm run seed -d  # Destroy data
npm run seed     # Re-seed
```

---

## 🔄 Updates and Maintenance

### Update Dependencies

```bash
# Check for updates
npm outdated

# Update all dependencies
npm update

# Update specific package
npm install package-name@latest
```

### Backup Database

```bash
# Backup
mongodump --db classic-carrry --out ./backup

# Restore
mongorestore --db classic-carrry ./backup/classic-carrry
```

---

## 📞 Support

Need help? Contact us:

- **Email:** classiccarrry@gmail.com
- **WhatsApp:** +92 316 092 8206

---

## 🎉 Success Checklist

- ✅ Backend server running on port 5000
- ✅ MongoDB running and seeded with data
- ✅ Admin panel running on port 5173
- ✅ Can login with admin credentials
- ✅ Can view dashboard statistics
- ✅ Can manage products (add, edit, delete)
- ✅ Can view and update orders
- ✅ Can view users

**Congratulations! Your admin panel is ready to use! 🚀**

---

**Powered by AppCrafters**
