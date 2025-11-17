# Classic Carrry - Admin Panel

A comprehensive admin dashboard for managing the Classic Carrry e-commerce platform.

## Features

- 📊 **Dashboard** - Overview of key metrics and recent orders
- 📦 **Product Management** - Add, edit, and delete products
- 🛒 **Order Management** - View and update order status
- 👥 **User Management** - View and manage registered users
- 🔐 **Secure Authentication** - Admin-only access with JWT
- 📱 **Responsive Design** - Works on all devices

## Tech Stack

- **React 19** - UI library
- **React Router DOM** - Client-side routing
- **Tailwind CSS** - Styling
- **Vite** - Build tool
- **Font Awesome** - Icons

## Prerequisites

- Node.js (v18 or higher)
- Backend API running on http://localhost:5000

## Installation

1. Navigate to the admin panel directory:
```bash
cd classic-carrry-r/classic-carrry-admin
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Update `.env` with your backend API URL:
```env
VITE_API_URL=http://localhost:5000/api
```

## Running the Application

Development mode:
```bash
npm run dev
```

Build for production:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

## Default Admin Credentials

```
Email: admin@classiccarrry.com
Password: admin123
```

## Project Structure

```
classic-carrry-admin/
├── src/
│   ├── components/
│   │   └── AdminLayout.jsx       # Main layout with sidebar
│   ├── contexts/
│   │   ├── AuthContext.jsx       # Authentication state
│   │   └── NotificationContext.jsx # Notifications
│   ├── pages/
│   │   ├── Login.jsx             # Login page
│   │   ├── Dashboard.jsx         # Dashboard overview
│   │   ├── Products.jsx          # Products list
│   │   ├── ProductForm.jsx       # Add/Edit product
│   │   ├── Orders.jsx            # Orders list
│   │   ├── OrderDetail.jsx       # Order details
│   │   └── Users.jsx             # Users list
│   ├── services/
│   │   └── api.js                # API service layer
│   ├── App.jsx                   # Main app component
│   ├── main.jsx                  # Entry point
│   └── index.css                 # Global styles
├── index.html
├── package.json
└── vite.config.js
```

## Features Overview

### Dashboard
- Total products, orders, users, and pending orders
- Total revenue calculation
- Recent orders table
- Quick action buttons

### Product Management
- View all products with filtering (Caps/Wallets)
- Add new products with detailed information
- Edit existing products
- Delete products
- Product status management (Active/Inactive)

### Order Management
- View all orders with status filtering
- Order details with customer information
- Update order status (Pending → Processing → Shipped → Delivered)
- View order items and pricing

### User Management
- View all registered users
- User role display (Admin/User)
- User status (Active/Inactive)
- Delete users (except admins)

## API Integration

The admin panel connects to the backend API with the following endpoints:

### Authentication
- `POST /api/users/login` - Admin login

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Orders
- `GET /api/orders` - Get all orders (Admin)
- `GET /api/orders/:id` - Get order by ID
- `PUT /api/orders/:id` - Update order status (Admin)

### Users
- `GET /api/users` - Get all users (Admin)
- `DELETE /api/users/:id` - Delete user (Admin)

## Security

- JWT token-based authentication
- Admin role verification
- Protected routes
- Secure API calls with authorization headers

## Customization

### Colors
Update the primary color in `index.css`:
```css
/* Change #D2C1B6 to your preferred color */
```

### Sidebar Menu
Add new menu items in `AdminLayout.jsx`:
```javascript
const menuItems = [
  { path: '/', icon: 'fa-dashboard', label: 'Dashboard' },
  // Add your custom menu items here
];
```

## Deployment

### Build for Production
```bash
npm run build
```

The build output will be in the `dist` folder.

### Deploy to Netlify
1. Build the project
2. Deploy the `dist` folder to Netlify
3. Update environment variables in Netlify dashboard

### Deploy to Vercel
1. Connect your repository to Vercel
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Add environment variables

## Troubleshooting

### CORS Issues
Ensure your backend has CORS configured to allow requests from the admin panel URL.

### Authentication Errors
- Check if the backend API is running
- Verify the API URL in `.env`
- Ensure you're using admin credentials

### Build Errors
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Clear Vite cache: `rm -rf node_modules/.vite`

## Support

For issues or questions, contact:
- Email: classiccarrry@gmail.com
- WhatsApp: +92 316 092 8206

## License

MIT License - Classic Carrry Admin Panel

---

**Powered by AppCrafters**
