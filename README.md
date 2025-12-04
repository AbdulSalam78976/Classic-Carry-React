# 🛍️ Classic Carrry E-Commerce Platform

A full-stack MERN e-commerce platform with separate admin panel and user website.

## 📋 Project Overview

Classic Carrry is a modern e-commerce platform built with the MERN stack (MongoDB, Express, React, Node.js). It features a powerful admin dashboard for store management and a beautiful shopping website for customers.

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│                    BACKEND API                          │
│              (Node.js + Express)                        │
│                  Render.com                             │
│                                                         │
└────────────┬────────────────────────────────────────────┘
             │
             │ REST API
             │
      ┌──────┴──────────┐
      │                 │
      ▼                 ▼
┌──────────┐      ┌──────────┐
│  ADMIN   │      │   USER   │
│  PANEL   │      │ WEBSITE  │
│ (React)  │      │ (React)  │
│ Vercel   │      │ Vercel   │
└──────────┘      └──────────┘
```

## 📁 Project Structure

```
classic-carrry/
├── backend/                 # Backend API (Node.js + Express)
│   ├── config/              # Database, Cloudinary, Email config
│   ├── controllers/         # Business logic
│   ├── models/              # MongoDB schemas
│   ├── routes/              # API endpoints
│   ├── middleware/          # Auth & error handling
│   ├── utils/               # Helper functions
│   ├── server.js            # Entry point
│   ├── README.md            # Backend documentation
│   └── DEPLOYMENT.md        # Backend deployment guide
│
├── classic-carrry-admin/    # Admin Panel (React)
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── contexts/        # React contexts
│   │   ├── pages/           # Page components
│   │   └── services/        # API services
│   ├── README.md            # Admin panel documentation
│   └── DEPLOYMENT.md        # Admin deployment guide
│
├── classic-carrry-user/     # User Website (React)
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── contexts/        # React contexts
│   │   ├── pages/           # Page components
│   │   └── services/        # API services
│   ├── README.md            # User website documentation
│   └── DEPLOYMENT.md        # User website deployment guide
│
├── DEPLOYMENT_GUIDE.md      # Complete deployment guide
└── README.md                # This file
```

## ✨ Features

### Admin Panel
- 📊 Dashboard with analytics and statistics
- 🛍️ Product management (CRUD operations)
- 📦 Order management and tracking
- 👥 User management
- 🎨 Hero image carousel management
- 🏷️ Category management
- 🎫 Coupon system
- ⚙️ Settings (Contact, FAQs, Appearance)
- 📧 Contact form submissions
- 🔐 JWT authentication
- 🔒 Role-based access control

### User Website
- 🏠 Home page with hero carousel
- 🛍️ Product browsing and filtering
- 🏷️ Category navigation
- 🛒 Shopping cart
- ❤️ Wishlist
- 📦 Checkout and order placement
- 👤 User profile and order history
- 📧 Contact form
- ❓ FAQ section
- 📱 Fully responsive design

### Backend API
- 🔐 JWT authentication
- 👤 User management
- 🛍️ Product CRUD operations
- 📦 Order processing
- 🏷️ Category management
- 🎨 Hero image management
- 🎫 Coupon system
- ⚙️ Site settings
- 📧 Email notifications
- 🖼️ Image upload (Cloudinary)
- 🔒 Security (Helmet, CORS, Rate limiting)

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Cloudinary** - Image storage
- **Nodemailer** - Email service
- **Bcrypt** - Password hashing

### Frontend (Both Admin & User)
- **React 19** - UI library
- **React Router** - Navigation
- **Tailwind CSS** - Styling
- **Vite** - Build tool

### Deployment
- **Render** - Backend hosting
- **Vercel** - Frontend hosting
- **MongoDB Atlas** - Database hosting
- **Cloudinary** - Image hosting

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Cloudinary account
- Gmail account

### 1. Clone Repository

```bash
git clone <your-repo-url>
cd classic-carrry
```

### 2. Setup Backend

```bash
cd backend
npm install
cp .env.example .env
# Configure .env with your credentials
npm start
```

Backend runs on: `http://localhost:5000`

### 3. Setup Admin Panel

```bash
cd classic-carrry-admin
npm install
cp .env.example .env
# Set VITE_API_URL=http://localhost:5000/api
npm run dev
```

Admin panel runs on: `http://localhost:5173`

### 4. Setup User Website

```bash
cd classic-carrry-user
npm install
cp .env.example .env
# Set VITE_API_URL=http://localhost:5000/api
npm run dev
```

User website runs on: `http://localhost:5174`

## 📝 Environment Variables

### Backend (.env)
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
ADMIN_URL=http://localhost:5173
USER_URL=http://localhost:5174
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Frontend (.env for both)
```env
VITE_API_URL=http://localhost:5000/api
```

## 🚀 Deployment

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for complete deployment instructions.

### Quick Deployment Steps

1. **Deploy Backend** → Render
2. **Deploy Admin Panel** → Vercel
3. **Deploy User Website** → Vercel
4. **Update Backend** → Add frontend URLs

## 📚 Documentation

- [Backend Documentation](./backend/README.md)
- [Admin Panel Documentation](./classic-carrry-admin/README.md)
- [User Website Documentation](./classic-carrry-user/README.md)
- [Complete Deployment Guide](./DEPLOYMENT_GUIDE.md)

## 🔐 Default Credentials

Create admin user via backend or register first user and manually set role to 'admin' in MongoDB.

## 🎨 Customization

### Brand Colors
- Primary: `#8B7355`
- Secondary: `#D2C1B6`

Update in respective `index.css` files.

## 📊 API Endpoints

### Authentication
- `POST /api/users/register` - Register user
- `POST /api/users/login` - Login user
- `GET /api/users/profile` - Get profile

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get all orders (Admin)
- `GET /api/orders/:id` - Get order by ID
- `PUT /api/orders/:id` - Update order status (Admin)

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category (Admin)

### Settings
- `GET /api/settings/contact` - Get contact info
- `GET /api/settings/faqs` - Get FAQs

See [Backend API Documentation](./backend/README.md) for complete API reference.

## 🔍 Troubleshooting

### Backend Issues
- Check MongoDB connection
- Verify environment variables
- Check Render logs

### Frontend Issues
- Verify API URL is correct
- Check CORS settings in backend
- Check Vercel logs

### Common Errors
- **CORS Error**: Update ADMIN_URL and USER_URL in backend
- **API Connection Failed**: Check backend is running
- **Images Not Loading**: Verify Cloudinary credentials

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📞 Support

For issues or questions: appcrafters.team@gmail.com

## 📄 License

MIT

## 🎉 Acknowledgments

- Built with MERN stack
- Styled with Tailwind CSS
- Deployed on Render & Vercel
- Images hosted on Cloudinary

---

**Made with ❤️ for Classic Carrry by AppCrafters**
