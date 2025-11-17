# 🚀 Quick Start Guide - Classic Carrry

Get your full-stack e-commerce app running in 5 minutes!

## ⚡ Prerequisites Check

Before starting, make sure you have:
- ✅ Node.js installed (v18+) - Run `node --version`
- ✅ MongoDB installed and running - Run `mongosh` or `mongo`
- ✅ npm or yarn installed - Run `npm --version`

## 🎯 Quick Setup (5 Steps)

### Step 1: Install Backend Dependencies

```bash
cd classic-carrry-r/backend
npm install
```

### Step 2: Setup Environment

```bash
# Copy environment file
cp .env.example .env

# The .env file is already configured with defaults
# You can use it as-is for development
```

### Step 3: Start MongoDB

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

### Step 4: Seed Database & Start Backend

```bash
# Seed the database with sample data
npm run seed

# Start the backend server
npm run dev
```

✅ Backend running at: `http://localhost:5000`

### Step 5: Start Frontend

Open a new terminal:

```bash
cd classic-carrry-r
npm install
npm run dev
```

✅ Frontend running at: `http://localhost:5173`

## 🎉 You're Done!

Open your browser and visit: `http://localhost:5173`

## 🔑 Test Credentials

After seeding, you can login with:
```
Email: admin@classiccarrry.com
Password: admin123
```

## 🧪 Quick API Test

Test if backend is working:

```bash
# Get all products
curl http://localhost:5000/api/products

# Get hot products
curl http://localhost:5000/api/products/hot
```

## 📱 What You Can Do Now

1. **Browse Products** - View caps and wallets
2. **Add to Cart** - Click "Add to Cart" on any product
3. **Checkout** - Complete the order flow
4. **View Details** - Click on products for detailed view
5. **Filter Products** - Use category filters

## 🛠️ Troubleshooting

### MongoDB Not Running?
```bash
# Check if MongoDB is running
mongosh

# If not, start it using the commands in Step 3
```

### Port Already in Use?
```bash
# Backend (Port 5000)
# Change PORT in backend/.env

# Frontend (Port 5173)
# Vite will automatically use next available port
```

### Dependencies Issues?
```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📚 Next Steps

1. **Explore the Code**
   - Frontend: `src/` directory
   - Backend: `backend/` directory

2. **Read Documentation**
   - `FULLSTACK_README.md` - Complete overview
   - `backend/API_DOCUMENTATION.md` - API reference
   - `backend/SETUP_GUIDE.md` - Detailed setup

3. **Customize**
   - Add your own products
   - Modify styling
   - Add new features

## 🎨 Project Structure

```
classic-carrry-r/
├── backend/           # Node.js + Express + MongoDB
│   ├── models/       # Database models
│   ├── routes/       # API routes
│   ├── controllers/  # Business logic
│   └── server.js     # Entry point
│
├── src/              # React frontend
│   ├── pages/       # Page components
│   ├── components/  # Reusable components
│   └── App.jsx      # Main app
│
└── public/          # Static assets
```

## 💡 Useful Commands

### Backend
```bash
npm run dev      # Start with auto-reload
npm start        # Start production mode
npm run seed     # Seed database
npm run seed -d  # Clear database
```

### Frontend
```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview production build
```

## 🆘 Need Help?

1. Check the error message in terminal
2. Review `backend/SETUP_GUIDE.md`
3. Check `backend/API_DOCUMENTATION.md`
4. Ensure MongoDB is running
5. Verify all dependencies are installed

## 📞 Contact

- WhatsApp: +92 316 092 8206
- Email: classiccarrry@gmail.com

---

**Happy Coding! 🚀**

Made with ❤️ by AppCrafters
