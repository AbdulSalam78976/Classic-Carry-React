# 🚀 Quick Start - Integrated Version

## ⚡ Start in 3 Steps

### Step 1: Start MongoDB
```bash
# Windows
net start MongoDB

# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongodb
```

### Step 2: Start Backend
```bash
cd classic-carrry-r/backend
npm install
npm run seed
npm run dev
```
✅ Backend running on http://localhost:5000

### Step 3: Start Frontend
```bash
cd classic-carrry-r
npm install
npm run dev
```
✅ Frontend running on http://localhost:5173

## 🎯 Test the Integration

### 1. Browse Products (No Login)
- Visit http://localhost:5173
- Products loaded from MongoDB
- Click any product to view details

### 2. Register/Login
- Click "Register" in header
- Create account or use demo:
  - Email: `admin@classiccarrry.com`
  - Password: `admin123`

### 3. Place Order (Login Required)
- Add products to cart
- Go to checkout
- Fill delivery details
- Click "Place Order"
- ✅ Order saved to MongoDB
- ✅ Emails sent automatically

## 📧 Configure Email (Optional)

Edit `backend/.env`:
```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
OWNER_EMAIL=classiccarrry@gmail.com
```

See `backend/EMAIL_SETUP.md` for detailed instructions.

## ✅ Features

- ✅ Products from MongoDB
- ✅ User authentication (JWT)
- ✅ Login required for orders
- ✅ Orders saved to database
- ✅ Email notifications
- ✅ User profile auto-fill

## 🔑 Demo Credentials

```
Email: admin@classiccarrry.com
Password: admin123
```

## 📚 Documentation

- **INTEGRATION_COMPLETE.md** - Full integration details
- **backend/API_DOCUMENTATION.md** - API reference
- **backend/EMAIL_SETUP.md** - Email setup

## 🎉 You're Ready!

Your full-stack e-commerce platform is running! 🛍️
