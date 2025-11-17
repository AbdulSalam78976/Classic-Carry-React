# Classic Carrry - Full Stack E-Commerce Platform

A complete MERN stack e-commerce application for premium caps and wallets.

## 🌟 Features

### Frontend (React)
- 🛍️ Product catalog with category filtering
- 🛒 Shopping cart with localStorage persistence
- 📱 Fully responsive design
- 🎨 Modern UI with Tailwind CSS
- 🔍 Product detail pages with image galleries
- 💳 Complete checkout flow
- 🚚 Free delivery calculation
- 🎯 Hot selling products section
- ✨ Smooth animations and transitions

### Backend (Node.js + Express + MongoDB)
- 🔐 JWT authentication & authorization
- 👤 User management (register, login, profile)
- 🛍️ Product CRUD operations
- 📦 Order management system
- 🔒 Role-based access control (Admin/User)
- 🛡️ Security with Helmet & CORS
- ✅ Input validation
- 📊 MongoDB with Mongoose ODM

## 🚀 Tech Stack

### Frontend
- React 19
- React Router DOM
- Tailwind CSS
- Vite
- Font Awesome

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT (jsonwebtoken)
- bcryptjs
- Helmet
- CORS

## 📁 Project Structure

```
classic-carrry-r/
├── backend/                 # Backend API
│   ├── config/             # Configuration files
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Custom middleware
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── scripts/           # Utility scripts
│   ├── .env               # Environment variables
│   ├── server.js          # Entry point
│   └── package.json
│
├── src/                    # Frontend source
│   ├── components/        # React components
│   ├── pages/            # Page components
│   ├── contexts/         # React contexts
│   ├── data/             # Static data
│   ├── utils/            # Utility functions
│   ├── App.jsx           # Main app component
│   └── main.jsx          # Entry point
│
├── public/                # Static assets
│   └── assets/
│       └── images/       # Product images
│
├── index.html
├── package.json
└── vite.config.js
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v18+)
- MongoDB (v6+)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd classic-carrry-r/backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Update `.env` with your configuration:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/classic-carrry
JWT_SECRET=your_secret_key
JWT_EXPIRE=30d
FRONTEND_URL=http://localhost:5173
```

5. Start MongoDB:
```bash
# Windows
net start MongoDB

# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongodb
```

6. Seed database (optional):
```bash
npm run seed
```

7. Start backend server:
```bash
npm run dev
```

Backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to project root:
```bash
cd classic-carrry-r
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Endpoints

#### Products
- `GET /products` - Get all products
- `GET /products/hot` - Get hot products
- `GET /products/:id` - Get single product
- `POST /products` - Create product (Admin)
- `PUT /products/:id` - Update product (Admin)
- `DELETE /products/:id` - Delete product (Admin)

#### Users
- `POST /users/register` - Register user
- `POST /users/login` - Login user
- `GET /users/profile` - Get profile (Protected)
- `PUT /users/profile` - Update profile (Protected)

#### Orders
- `POST /orders` - Create order
- `GET /orders` - Get all orders (Admin)
- `GET /orders/myorders` - Get user orders (Protected)
- `GET /orders/:id` - Get order by ID
- `PUT /orders/:id` - Update order (Admin)

See `backend/API_DOCUMENTATION.md` for detailed API reference.

## 🔐 Authentication

Protected routes require JWT token in Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

### Default Admin Credentials (After Seeding)
```
Email: admin@classiccarrry.com
Password: admin123
```

## 🗄️ Database Models

### User
- name, email, password (hashed)
- role (user/admin)
- phone, address
- timestamps

### Product
- id, name, price
- category, productType
- images, description
- colors, features
- stock, isActive

### Order
- orderNumber (auto-generated)
- customer details
- items array
- pricing (subtotal, delivery, total)
- status, paymentStatus

## 🎨 Frontend Features

### Pages
- **Home** - Hero carousel, hot products
- **Caps** - Caps catalog with filters
- **Wallets** - Wallets catalog with filters
- **About** - Company information
- **Product Detail** - Detailed product view
- **Checkout** - Cart and order placement
- **Order Success** - Confirmation page

### Components
- Header with cart badge
- Footer with contact info
- Product cards
- Hero carousel
- Notification system
- Scroll to top

## 🔒 Security Features

- Password hashing with bcryptjs
- JWT token authentication
- Helmet for security headers
- CORS configuration
- Input validation
- Role-based access control
- Protected routes

## 📦 Deployment

### Backend Deployment (Heroku/Railway)

1. Set environment variables
2. Update MongoDB URI to production database
3. Set NODE_ENV to 'production'
4. Deploy using Git

### Frontend Deployment (Netlify/Vercel)

1. Build the project:
```bash
npm run build
```

2. Deploy `dist` folder
3. Update API URLs to production backend

## 🧪 Testing

### Test Backend API

```bash
# Get products
curl http://localhost:5000/api/products

# Register user
curl -X POST http://localhost:5000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"test123"}'
```

### Test Frontend

1. Open `http://localhost:5173`
2. Browse products
3. Add items to cart
4. Complete checkout flow

## 📝 Scripts

### Backend
```bash
npm start          # Start server
npm run dev        # Start with nodemon
npm run seed       # Seed database
npm run seed -d    # Destroy data
```

### Frontend
```bash
npm run dev        # Start dev server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Contact

- **WhatsApp:** +92 316 092 8206
- **Email:** classiccarrry@gmail.com
- **Location:** Pakistan

## 🙏 Credits

Powered by **AppCrafters**

---

## 📖 Additional Documentation

- `backend/README.md` - Backend specific documentation
- `backend/API_DOCUMENTATION.md` - Complete API reference
- `backend/SETUP_GUIDE.md` - Detailed setup instructions
- `README.md` - Frontend documentation

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check connection string in `.env`
- Verify MongoDB port (default: 27017)

### Port Conflicts
- Change PORT in backend `.env`
- Change port in frontend `vite.config.js`

### CORS Issues
- Update FRONTEND_URL in backend `.env`
- Check CORS configuration in `server.js`

## 🎯 Future Enhancements

- [ ] Payment gateway integration
- [ ] Email notifications
- [ ] Product reviews and ratings
- [ ] Wishlist functionality
- [ ] Advanced search and filters
- [ ] Admin dashboard
- [ ] Order tracking
- [ ] Multiple payment methods
- [ ] Social media integration
- [ ] Analytics dashboard

Happy coding! 🚀
