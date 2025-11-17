# Classic Carrry Backend API

MERN stack backend for the Classic Carrry e-commerce platform.

## Features

- 🔐 JWT Authentication & Authorization
- 👤 User Management (Register, Login, Profile)
- 🛍️ Product Management (CRUD operations)
- 📦 Order Management
- 🔒 Role-based Access Control (Admin/User)
- 🛡️ Security with Helmet & CORS
- 📊 MongoDB Database
- ✅ Input Validation
- 🚀 RESTful API Design

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing

## Installation

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
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=30d
FRONTEND_URL=http://localhost:5173
```

## Running the Server

Development mode with auto-reload:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## Seeding Database

Import sample data:
```bash
npm run seed
```

Destroy all data:
```bash
npm run seed -d
```

## API Endpoints

### Authentication & Users

```
POST   /api/users/register      - Register new user
POST   /api/users/login         - Login user
GET    /api/users/profile       - Get user profile (Protected)
PUT    /api/users/profile       - Update user profile (Protected)
GET    /api/users               - Get all users (Admin)
DELETE /api/users/:id           - Delete user (Admin)
```

### Products

```
GET    /api/products            - Get all products
GET    /api/products/hot        - Get hot/featured products
GET    /api/products/category/:category - Get products by category
GET    /api/products/:id        - Get single product
POST   /api/products            - Create product (Admin)
PUT    /api/products/:id        - Update product (Admin)
DELETE /api/products/:id        - Delete product (Admin)
```

### Orders

```
POST   /api/orders              - Create new order
GET    /api/orders              - Get all orders (Admin)
GET    /api/orders/myorders     - Get user orders (Protected)
GET    /api/orders/:id          - Get order by ID
PUT    /api/orders/:id          - Update order status (Admin)
```

## API Response Format

Success Response:
```json
{
  "success": true,
  "data": { ... }
}
```

Error Response:
```json
{
  "success": false,
  "message": "Error message"
}
```

## Authentication

Protected routes require JWT token in Authorization header:
```
Authorization: Bearer <token>
```

## Database Models

### User
- name, email, password
- role (user/admin)
- phone, address
- timestamps

### Product
- id, name, price
- category, productType
- mainImage, images[]
- description, tag
- colors[], features[]
- stock, isActive
- timestamps

### Order
- orderNumber (auto-generated)
- customer (email, name, phone, address)
- items[] (productId, name, price, quantity)
- pricing (subtotal, deliveryCharge, total)
- status, paymentStatus
- timestamps

## Security Features

- Password hashing with bcryptjs
- JWT token authentication
- Helmet for security headers
- CORS configuration
- Input validation
- Role-based access control

## Error Handling

Centralized error handling middleware catches and formats all errors consistently.

## Development

The API uses:
- ES6 modules (import/export)
- Async/await for asynchronous operations
- MongoDB indexes for performance
- Mongoose middleware for data processing

## License

MIT
