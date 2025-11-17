# Classic Carrry API Documentation

Complete API reference for the Classic Carrry e-commerce backend.

## Base URL

```
http://localhost:5000/api
```

## Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## Users API

### Register User

**POST** `/users/register`

Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "token": "jwt_token"
  }
}
```

### Login User

**POST** `/users/login`

Authenticate and get JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "token": "jwt_token"
  }
}
```

### Get User Profile

**GET** `/users/profile`

Get logged-in user's profile. Requires authentication.

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "phone": "+92 316 092 8206",
    "address": {
      "street": "123 Main St",
      "city": "Karachi",
      "province": "Sindh",
      "postalCode": "75500"
    }
  }
}
```

---

## Products API

### Get All Products

**GET** `/products`

Get all active products with optional filters.

**Query Parameters:**
- `category` - Filter by category (summer, winter, male, female, etc.)
- `productType` - Filter by type (cap, wallet)
- `search` - Search in name and description

**Example:**
```
GET /products?category=male&productType=cap
```

**Response:**
```json
{
  "success": true,
  "count": 10,
  "data": [
    {
      "id": "cap-1",
      "name": "Classic Baseball Cap",
      "price": 2999,
      "category": "male",
      "productType": "cap",
      "mainImage": "/assets/images/c-1.png",
      "images": ["/assets/images/c-1.png"],
      "description": "Timeless baseball cap design",
      "tag": "Best Seller",
      "colors": ["Black", "Navy Blue"],
      "features": ["Cotton Twill", "Adjustable Strap"],
      "stock": 100,
      "isActive": true
    }
  ]
}
```

### Get Hot Products

**GET** `/products/hot`

Get featured/hot selling products.

**Response:**
```json
{
  "success": true,
  "count": 8,
  "data": [...]
}
```

### Get Products by Category

**GET** `/products/category/:category`

Get all products in a specific category.

**Example:**
```
GET /products/category/male
```

### Get Single Product

**GET** `/products/:id`

Get detailed information about a specific product.

**Example:**
```
GET /products/cap-1
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "cap-1",
    "name": "Classic Baseball Cap",
    "price": 2999,
    ...
  }
}
```

### Create Product (Admin)

**POST** `/products`

Create a new product. Requires admin authentication.

**Request Body:**
```json
{
  "id": "cap-100",
  "name": "New Cap",
  "price": 2999,
  "category": "male",
  "productType": "cap",
  "mainImage": "/assets/images/new-cap.png",
  "images": ["/assets/images/new-cap.png"],
  "description": "A new cap design",
  "colors": ["Black", "White"],
  "stock": 50
}
```

### Update Product (Admin)

**PUT** `/products/:id`

Update an existing product. Requires admin authentication.

### Delete Product (Admin)

**DELETE** `/products/:id`

Delete a product. Requires admin authentication.

---

## Orders API

### Create Order

**POST** `/orders`

Create a new order.

**Request Body:**
```json
{
  "customer": {
    "email": "customer@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+92 316 092 8206",
    "address": "123 Main Street",
    "city": "Karachi",
    "province": "Sindh",
    "postalCode": "75500",
    "deliveryNotes": "Call before delivery"
  },
  "items": [
    {
      "productId": "cap-1",
      "name": "Classic Baseball Cap",
      "price": 2999,
      "quantity": 2,
      "image": "/assets/images/c-1.png"
    }
  ],
  "pricing": {
    "subtotal": 5998,
    "deliveryCharge": 0,
    "total": 5998
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "orderNumber": "CC1699876543210001",
    "customer": {...},
    "items": [...],
    "pricing": {...},
    "status": "pending",
    "paymentStatus": "pending",
    "createdAt": "2024-11-13T10:30:00.000Z"
  }
}
```

### Get All Orders (Admin)

**GET** `/orders`

Get all orders with pagination. Requires admin authentication.

**Query Parameters:**
- `status` - Filter by status (pending, processing, shipped, delivered, cancelled)
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20)

**Example:**
```
GET /orders?status=pending&page=1&limit=10
```

### Get Order by ID

**GET** `/orders/:orderNumber`

Get specific order details by order number.

**Example:**
```
GET /orders/CC1699876543210001
```

### Get My Orders

**GET** `/orders/myorders`

Get logged-in user's orders. Requires authentication.

### Update Order Status (Admin)

**PUT** `/orders/:orderNumber`

Update order status. Requires admin authentication.

**Request Body:**
```json
{
  "status": "shipped",
  "paymentStatus": "paid"
}
```

---

## Error Responses

All errors follow this format:

```json
{
  "success": false,
  "message": "Error description"
}
```

### Common HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

---

## Rate Limiting

API requests are rate-limited to prevent abuse. Default limits:
- 100 requests per 15 minutes per IP

---

## Data Models

### Product Categories
- `summer` - Summer collection
- `winter` - Winter collection
- `male` - Men's collection
- `female` - Women's collection
- `sports` - Sports collection
- `long` - Long wallets
- `cardholder` - Card holders

### Order Status
- `pending` - Order placed
- `processing` - Being prepared
- `shipped` - On the way
- `delivered` - Completed
- `cancelled` - Cancelled

### Payment Status
- `pending` - Awaiting payment
- `paid` - Payment received
- `failed` - Payment failed

---

## Testing

Use tools like Postman or cURL to test the API:

```bash
# Register user
curl -X POST http://localhost:5000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"test123"}'

# Get products
curl http://localhost:5000/api/products

# Create order
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -d @order.json
```
