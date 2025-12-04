# 🚀 Complete Deployment Guide

## Overview

You have 3 applications to deploy:
1. **Backend API** → Render
2. **Admin Panel** → Vercel
3. **User Website** → Vercel

## 📋 Deployment Order

```
1. Backend (Render)
   ↓
2. Admin Panel (Vercel)
   ↓
3. User Website (Vercel)
   ↓
4. Update Backend with Frontend URLs
```

---

## 1️⃣ Deploy Backend on Render

### Prerequisites
- MongoDB Atlas account
- Cloudinary account
- Gmail with App Password

### Steps

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Create Web Service on Render**
   - Go to https://dashboard.render.com/
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Render will detect `backend/render.yaml`
   - Click "Apply"

3. **Add Environment Variables**
   
   In Render Dashboard → Environment:
   
   ```env
   # Database
   MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/database
   
   # Authentication
   JWT_SECRET=your_random_secure_string_here
   JWT_EXPIRE=30d
   
   # Frontend URLs (leave empty for now, will update later)
   ADMIN_URL=
   USER_URL=
 
   
   # Email (Gmail)
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-gmail-app-password
   EMAIL_FROM=your-email@gmail.com
   EMAIL_FROM_NAME=Classic Carrry
   OWNER_EMAIL=owner-email@gmail.com
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_SECURE=false
   
   # Cloudinary
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

4. **Deploy & Get URL**
   - Wait for deployment to complete
   - Copy your backend URL
   - Example: `https://classic-carrry-api.onrender.com`

5. **Test Backend**
   ```bash
   curl https://your-backend.onrender.com/
   # Should return: {"message": "Classic Carrry API", ...}
   ```

✅ **Backend is now live!**

---

## 2️⃣ Deploy Admin Panel on Vercel

### Steps

1. **Deploy on Vercel**
   - Go to https://vercel.com/dashboard
   - Click "Add New" → "Project"
   - Import your GitHub repository
   - Configure:
     - **Root Directory:** `classic-carrry-admin`
     - **Framework Preset:** Vite
     - **Build Command:** `npm run build`
     - **Output Directory:** `dist`

2. **Add Environment Variable**
   
   In Vercel → Environment Variables:
   
   ```env
   VITE_API_URL=https://your-backend.onrender.com/api
   ```
   
   ⚠️ Replace with your actual Render backend URL!

3. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Copy your admin panel URL
   - Example: `https://classic-carrry-admin.vercel.app`

4. **Test Admin Panel**
   - Visit your Vercel URL
   - Try to login
   - Check if it connects to backend

✅ **Admin Panel is now live!**

---

## 3️⃣ Deploy User Website on Vercel

### Steps

1. **Deploy on Vercel**
   - Go to https://vercel.com/dashboard
   - Click "Add New" → "Project"
   - Import your GitHub repository (same repo)
   - Configure:
     - **Root Directory:** `classic-carrry-user`
     - **Framework Preset:** Vite
     - **Build Command:** `npm run build`
     - **Output Directory:** `dist`

2. **Add Environment Variable**
   
   In Vercel → Environment Variables:
   
   ```env
   VITE_API_URL=https://your-backend.onrender.com/api
   ```
   
   ⚠️ Use the same backend URL!

3. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Copy your user website URL
   - Example: `https://classic-carrry-shop.vercel.app`

4. **Test User Website**
   - Visit your Vercel URL
   - Browse products
   - Check if data loads from backend

✅ **User Website is now live!**

---

## 4️⃣ Update Backend with Frontend URLs

### Why?
Backend needs to allow CORS from both frontends and create correct email links.

### Steps

1. **Go to Render Dashboard**
   - Select your backend service
   - Go to "Environment" tab

2. **Update Environment Variables**
   
   Add/Update these:
   
   ```env
   ADMIN_URL=https://your-admin-panel.vercel.app
   USER_URL=https://your-user-website.vercel.app
   FRONTEND_URL=https://your-admin-panel.vercel.app
   ```
   
   ⚠️ Use your actual Vercel URLs!

3. **Save Changes**
   - Render will automatically redeploy
   - Wait for deployment to complete

4. **Verify CORS**
   - Test admin panel again
   - Test user website again
   - Both should work without CORS errors

✅ **All applications are now connected!**

---

## 📊 Final Checklist

### Backend (Render)
- [ ] Deployed and live
- [ ] Environment variables configured
- [ ] MongoDB connected
- [ ] Cloudinary working
- [ ] Email configured
- [ ] CORS updated with frontend URLs

### Admin Panel (Vercel)
- [ ] Deployed and live
- [ ] VITE_API_URL configured
- [ ] Can login
- [ ] Dashboard loads data
- [ ] Can manage products
- [ ] Can manage orders
- [ ] Image uploads work

### User Website (Vercel)
- [ ] Deployed and live
- [ ] VITE_API_URL configured
- [ ] Products display
- [ ] Can add to cart
- [ ] Checkout works
- [ ] Orders are created

---

## 🔗 Your Live URLs

After deployment, you'll have:

```
Backend API:    https://your-backend.onrender.com
Admin Panel:    https://your-admin.vercel.app
User Website:   https://your-shop.vercel.app
```

---

## 🎯 Quick Reference

### Backend Environment Variables
```env
MONGODB_URI=...
JWT_SECRET=...
ADMIN_URL=https://admin.vercel.app
USER_URL=https://shop.vercel.app
EMAIL_USER=...
EMAIL_PASS=...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

### Frontend Environment Variables
```env
# Both admin and user
VITE_API_URL=https://your-backend.onrender.com/api
```

---

## 🔍 Troubleshooting

### CORS Errors
- Verify ADMIN_URL and USER_URL in backend
- Check URLs don't have trailing slashes
- Redeploy backend after updating

### API Connection Failed
- Verify VITE_API_URL is correct
- Check backend is running on Render
- Test backend URL directly in browser

### Images Not Uploading
- Verify Cloudinary credentials
- Check backend logs on Render
- Test Cloudinary dashboard

### Emails Not Sending
- Verify Gmail App Password (not regular password)
- Check EMAIL_USER and EMAIL_PASS
- Enable 2FA on Gmail first

---

## 🎉 Success!

All three applications are now deployed and connected!

**Next Steps:**
1. Create admin user account
2. Add products via admin panel
3. Test complete order flow
4. Share user website with customers
5. Monitor orders in admin panel

---

## 📞 Support

- Backend Issues: Check Render logs
- Frontend Issues: Check Vercel logs
- Database Issues: Check MongoDB Atlas
- Email Issues: Check Gmail settings

**Contact:** classiccarrry@gmail.com
