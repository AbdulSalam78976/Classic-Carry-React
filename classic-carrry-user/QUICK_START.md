# 🚀 Quick Start Guide

## Local Development (5 minutes)

### 1. Backend Setup
```bash
cd backend
npm install
npm run seed
npm start
```
✅ Backend running at `http://localhost:5000`

### 2. Frontend Setup
```bash
# In a new terminal
cd classic-carrry-r
npm install
npm run dev
```
✅ Frontend running at `http://localhost:5173`

### 3. Test
- Open browser: `http://localhost:5173`
- You should see products with images from backend
- All data is now dynamic from MongoDB!

---

## Production Deployment (Quick)

### Backend (e.g., Render)
1. Create new Web Service
2. Connect GitHub repo
3. Set environment variables:
   ```
   MONGODB_URI=your_mongodb_atlas_uri
   FRONTEND_URL=https://your-frontend.vercel.app
   JWT_SECRET=your_secret_key
   ```
4. Deploy
5. Run: `npm run seed`

### Frontend (e.g., Vercel)
1. Import GitHub repo
2. Set environment variable:
   ```
   VITE_API_URL=https://your-backend.onrender.com/api
   ```
3. Deploy

**Done! Your site is live! 🎉**

---

## Key Files

- **Backend .env**: `backend/.env`
- **Frontend .env**: `.env`
- **Seed Data**: `backend/scripts/seedData.js`
- **Images**: `backend/uploads/products/`

---

## Common Commands

```bash
# Seed database
cd backend && npm run seed

# Start backend
cd backend && npm start

# Start frontend dev
npm run dev

# Build frontend
npm run build

# Test API
curl http://localhost:5000/api/products
```

---

## Need Help?

- Full deployment guide: `DEPLOYMENT_GUIDE.md`
- Setup details: `SETUP_COMPLETE.md`
- API docs: `backend/API_DOCUMENTATION.md`
