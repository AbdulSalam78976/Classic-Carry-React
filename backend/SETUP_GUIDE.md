# Classic Carrry Backend - Complete Setup Guide

Step-by-step guide to set up and run the backend server.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v6 or higher) - [Download](https://www.mongodb.com/try/download/community)
- **npm** or **yarn** - Comes with Node.js

## Step 1: Install MongoDB

### Windows
1. Download MongoDB Community Server from the official website
2. Run the installer and follow the setup wizard
3. MongoDB will start automatically as a Windows service

### macOS (using Homebrew)
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

### Linux (Ubuntu/Debian)
```bash
sudo apt-get install mongodb
sudo systemctl start mongodb
sudo systemctl enable mongodb
```

### Verify MongoDB Installation
```bash
mongosh
# or
mongo
```

## Step 2: Clone and Setup Backend

1. Navigate to the backend directory:
```bash
cd classic-carrry-r/backend
```

2. Install dependencies:
```bash
npm install
```

This will install:
- express - Web framework
- mongoose - MongoDB ODM
- bcryptjs - Password hashing
- jsonwebtoken - JWT authentication
- cors - CORS middleware
- helmet - Security headers
- morgan - HTTP logger
- dotenv - Environment variables
- express-validator - Input validation
- And more...

## Step 3: Configure Environment Variables

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Edit `.env` file with your settings:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/classic-carrry
JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_EXPIRE=30d
FRONTEND_URL=http://localhost:5173
```

**Important:** Change `JWT_SECRET` to a strong random string in production!

## Step 4: Seed Database (Optional)

Import sample products and create admin user:

```bash
npm run seed
```

This will:
- Clear existing data
- Create an admin user (email: admin@classiccarrry.com, password: admin123)
- Import sample products

To destroy all data:
```bash
npm run seed -d
```

## Step 5: Start the Server

### Development Mode (with auto-reload)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:5000`

## Step 6: Verify Installation

1. Open your browser or Postman
2. Visit: `http://localhost:5000`
3. You should see:
```json
{
  "message": "Classic Carrry API",
  "version": "1.0.0",
  "endpoints": {
    "products": "/api/products",
    "orders": "/api/orders",
    "users": "/api/users"
  }
}
```

## Testing the API

### Test Product Endpoints

Get all products:
```bash
curl http://localhost:5000/api/products
```

Get hot products:
```bash
curl http://localhost:5000/api/products/hot
```

### Test User Registration

```bash
curl -X POST http://localhost:5000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "test123"
  }'
```

### Test User Login

```bash
curl -X POST http://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123"
  }'
```

## Common Issues and Solutions

### Issue: MongoDB Connection Error

**Error:** `MongooseServerSelectionError: connect ECONNREFUSED`

**Solution:**
1. Make sure MongoDB is running:
```bash
# Windows
net start MongoDB

# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongodb
```

2. Check MongoDB status:
```bash
mongosh
```

### Issue: Port Already in Use

**Error:** `Error: listen EADDRINUSE: address already in use :::5000`

**Solution:**
1. Change the PORT in `.env` file
2. Or kill the process using port 5000:
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:5000 | xargs kill -9
```

### Issue: Module Not Found

**Error:** `Cannot find module 'express'`

**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue: JWT Secret Not Set

**Error:** `secretOrPrivateKey must have a value`

**Solution:**
Make sure `.env` file exists and has `JWT_SECRET` set.

## Project Structure

```
backend/
├── config/
│   └── db.js              # Database connection
├── controllers/
│   ├── productController.js
│   ├── orderController.js
│   └── userController.js
├── middleware/
│   ├── authMiddleware.js  # JWT authentication
│   └── errorMiddleware.js # Error handling
├── models/
│   ├── Product.js
│   ├── Order.js
│   └── User.js
├── routes/
│   ├── productRoutes.js
│   ├── orderRoutes.js
│   └── userRoutes.js
├── scripts/
│   └── seedData.js        # Database seeding
├── .env                   # Environment variables
├── .env.example
├── server.js              # Entry point
└── package.json
```

## Next Steps

1. **Connect Frontend:** Update frontend API URLs to point to `http://localhost:5000`
2. **Test All Endpoints:** Use Postman or the provided API documentation
3. **Customize:** Add more products, modify models as needed
4. **Deploy:** Follow deployment guide for production setup

## Admin Credentials (After Seeding)

```
Email: admin@classiccarrry.com
Password: admin123
```

**Important:** Change these credentials in production!

## Development Tips

1. **Auto-reload:** Use `npm run dev` for automatic server restart on file changes
2. **Logging:** Check console for detailed request logs (Morgan)
3. **Database GUI:** Use MongoDB Compass for visual database management
4. **API Testing:** Use Postman or Thunder Client VS Code extension

## Support

For issues or questions:
- Check API_DOCUMENTATION.md for endpoint details
- Review error logs in the console
- Ensure all environment variables are set correctly

## Security Checklist

Before deploying to production:

- [ ] Change JWT_SECRET to a strong random string
- [ ] Update admin credentials
- [ ] Set NODE_ENV to 'production'
- [ ] Enable HTTPS
- [ ] Configure proper CORS origins
- [ ] Set up rate limiting
- [ ] Enable MongoDB authentication
- [ ] Review and update security headers

Happy coding! 🚀
