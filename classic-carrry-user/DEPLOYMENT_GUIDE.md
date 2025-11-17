# Deployment Guide - Classic Carrry

This guide covers deploying the backend and frontend to separate hosting services.

## 📋 Overview

- **Backend**: Node.js/Express API with MongoDB (deployed separately)
- **Frontend**: React/Vite application (deployed separately)
- **Images**: Served from backend `/uploads` directory

---

## 🔧 Backend Deployment

### Prerequisites
- MongoDB database (MongoDB Atlas recommended)
- Node.js hosting service (Render, Railway, Heroku, DigitalOcean, etc.)

### Step 1: Prepare Backend

1. **Set Environment Variables** on your hosting platform:
   ```env
   NODE_ENV=production
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_secure_jwt_secret
   JWT_EXPIRE=30d
   FRONTEND_URL=https://your-frontend-domain.com
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   EMAIL_FROM=your-email@gmail.com
   EMAIL_FROM_NAME=Classic Carrry
   OWNER_EMAIL=classiccarrry@gmail.com
   ```

2. **Ensure images are in backend**:
   ```bash
   # Images should be in: backend/uploads/products/
   ```

3. **Deploy backend** to your hosting service

4. **Seed the database**:
   ```bash
   cd backend
   npm run seed
   ```

### Step 2: Verify Backend

Test your backend API:
```bash
# Check API health
curl https://your-backend-domain.com/

# Check products endpoint
curl https://your-backend-domain.com/api/products

# Check image serving
curl https://your-backend-domain.com/uploads/products/c-1.png
```

---

## 🎨 Frontend Deployment

### Prerequisites
- Static hosting service (Vercel, Netlify, Cloudflare Pages, etc.)

### Step 1: Configure Frontend

1. **Update `.env` file** (or set environment variables on hosting platform):
   ```env
   VITE_API_URL=https://your-backend-domain.com/api
   ```

2. **Build the frontend**:
   ```bash
   npm run build
   ```

3. **Deploy** the `dist` folder to your hosting service

### Step 2: Hosting-Specific Instructions

#### Vercel
1. Connect your GitHub repository
2. Set environment variable: `VITE_API_URL=https://your-backend-domain.com/api`
3. Build command: `npm run build`
4. Output directory: `dist`

#### Netlify
1. Connect your GitHub repository
2. Set environment variable: `VITE_API_URL=https://your-backend-domain.com/api`
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Add `_redirects` file for SPA routing (see below)

#### Cloudflare Pages
1. Connect your GitHub repository
2. Set environment variable: `VITE_API_URL=https://your-backend-domain.com/api`
3. Build command: `npm run build`
4. Build output directory: `dist`

---

## 🔐 CORS Configuration

The backend is already configured to accept requests from your frontend. Make sure `FRONTEND_URL` in backend `.env` matches your deployed frontend URL.

```javascript
// backend/server.js (already configured)
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
```

---

## 📁 SPA Routing Fix (for Netlify/Static Hosts)

Create `classic-carrry-r/public/_redirects`:
```
/*    /index.html   200
```

This ensures React Router works correctly on page refresh.

---

## 🖼️ Image Serving

Images are served from the backend at:
```
https://your-backend-domain.com/uploads/products/[image-name]
```

The frontend automatically constructs the correct URL using the `VITE_API_URL` environment variable.

---

## ✅ Post-Deployment Checklist

### Backend
- [ ] MongoDB connection working
- [ ] Environment variables set correctly
- [ ] Database seeded with products
- [ ] API endpoints responding: `/api/products`, `/api/orders`, `/api/users`
- [ ] Images accessible at `/uploads/products/`
- [ ] CORS configured for frontend domain

### Frontend
- [ ] `VITE_API_URL` points to backend domain
- [ ] Build successful
- [ ] All pages load correctly
- [ ] Products display with images from backend
- [ ] Cart functionality works
- [ ] Checkout process works
- [ ] User authentication works

---

## 🧪 Testing After Deployment

1. **Visit your frontend URL**
2. **Check homepage** - should load products from backend
3. **Check product images** - should load from backend
4. **Test navigation** - all pages should work
5. **Test cart** - add/remove items
6. **Test checkout** - place an order
7. **Test authentication** - register/login

---

## 🐛 Troubleshooting

### Images not loading
- Check `VITE_API_URL` is set correctly
- Verify images exist in `backend/uploads/products/`
- Check browser console for CORS errors
- Verify backend CORS configuration includes frontend URL

### API requests failing
- Check `VITE_API_URL` environment variable
- Verify backend is running and accessible
- Check browser console for errors
- Verify CORS configuration

### Products not showing
- Verify database is seeded: `npm run seed` in backend
- Check MongoDB connection
- Test API endpoint directly: `https://your-backend-domain.com/api/products`

### 404 errors on page refresh
- Add `_redirects` file for Netlify
- Configure rewrites for your hosting platform

---

## 📊 Recommended Hosting Services

### Backend
- **Render** (Free tier available, easy MongoDB integration)
- **Railway** (Simple deployment, good for Node.js)
- **Heroku** (Classic choice, paid plans)
- **DigitalOcean App Platform** (Scalable, affordable)

### Frontend
- **Vercel** (Excellent for React, free tier)
- **Netlify** (Great DX, free tier)
- **Cloudflare Pages** (Fast, free tier)
- **GitHub Pages** (Free, but requires configuration)

### Database
- **MongoDB Atlas** (Free tier available, 512MB storage)
- **MongoDB Cloud** (Managed MongoDB service)

---

## 🔄 Continuous Deployment

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Render
        # Add your deployment steps

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        # Add your deployment steps
```

---

## 📝 Environment Variables Summary

### Backend (.env)
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_secret
JWT_EXPIRE=30d
FRONTEND_URL=https://your-frontend.com
EMAIL_USER=email@gmail.com
EMAIL_PASS=app_password
EMAIL_FROM=email@gmail.com
EMAIL_FROM_NAME=Classic Carrry
OWNER_EMAIL=classiccarrry@gmail.com
```

### Frontend (.env)
```env
VITE_API_URL=https://your-backend.com/api
```

---

## 🎉 Success!

Once deployed, your application will be:
- ✅ Fully dynamic (all data from database)
- ✅ Images served from backend
- ✅ Frontend and backend on separate domains
- ✅ Scalable and production-ready

For support, check the documentation or create an issue on GitHub.
