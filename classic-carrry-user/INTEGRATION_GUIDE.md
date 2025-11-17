# Frontend-Backend Integration Guide

Step-by-step guide to connect your React frontend with the Node.js backend.

## 🎯 Overview

This guide will help you integrate the existing React frontend with the newly created backend API.

## 📋 Prerequisites

- ✅ Backend server running on `http://localhost:5000`
- ✅ Frontend running on `http://localhost:5173`
- ✅ MongoDB running with seeded data

## 🔧 Integration Steps

### Step 1: Create API Service Layer

Create a new file for API calls:

**File:** `classic-carrry-r/src/services/api.js`

```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper function for API calls
const apiCall = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  const response = await fetch(`${API_URL}${endpoint}`, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
};

// Product APIs
export const productAPI = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiCall(`/products${query ? `?${query}` : ''}`);
  },
  
  getHot: () => apiCall('/products/hot'),
  
  getById: (id) => apiCall(`/products/${id}`),
  
  getByCategory: (category) => apiCall(`/products/category/${category}`),
};

// Order APIs
export const orderAPI = {
  create: (orderData) => apiCall('/orders', {
    method: 'POST',
    body: JSON.stringify(orderData),
  }),
  
  getById: (orderNumber) => apiCall(`/orders/${orderNumber}`),
  
  getMyOrders: () => apiCall('/orders/myorders'),
};

// User APIs
export const userAPI = {
  register: (userData) => apiCall('/users/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),
  
  login: (credentials) => apiCall('/users/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),
  
  getProfile: () => apiCall('/users/profile'),
  
  updateProfile: (userData) => apiCall('/users/profile', {
    method: 'PUT',
    body: JSON.stringify(userData),
  }),
};

export default { productAPI, orderAPI, userAPI };
```

### Step 2: Update Product Data Source

**Option A: Replace Static Data (Recommended)**

Update `src/data/products.js`:

```javascript
import { productAPI } from '../services/api';

// Export functions instead of static data
export const getHotProducts = async () => {
  try {
    const response = await productAPI.getHot();
    return response.data;
  } catch (error) {
    console.error('Error fetching hot products:', error);
    return [];
  }
};

export const getCaps = async () => {
  try {
    const response = await productAPI.getAll({ productType: 'cap' });
    return response.data;
  } catch (error) {
    console.error('Error fetching caps:', error);
    return [];
  }
};

export const getWallets = async () => {
  try {
    const response = await productAPI.getAll({ productType: 'wallet' });
    return response.data;
  } catch (error) {
    console.error('Error fetching wallets:', error);
    return [];
  }
};

export const getAllProducts = async () => {
  try {
    const response = await productAPI.getAll();
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};
```

**Option B: Keep Static Data as Fallback**

Keep existing data and add API calls as enhancement.

### Step 3: Update Home Page

Modify `src/pages/Home.jsx` to fetch data from API:

```javascript
import { useState, useEffect } from 'react';
import { productAPI } from '../services/api';
// ... other imports

const Home = () => {
  const [hotProducts, setHotProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productAPI.getHot();
        setHotProducts(response.data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  const hotCaps = hotProducts.filter(p => p.productType === 'cap');
  const hotWallets = hotProducts.filter(p => p.productType === 'wallet');

  // ... rest of component
};
```

### Step 4: Update Caps Page

Modify `src/pages/Caps.jsx`:

```javascript
import { useState, useEffect } from 'react';
import { productAPI } from '../services/api';
// ... other imports

const Caps = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    const fetchCaps = async () => {
      try {
        const params = { productType: 'cap' };
        if (selectedCategory !== 'all') {
          params.category = selectedCategory;
        }
        
        const response = await productAPI.getAll(params);
        setProducts(response.data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCaps();
  }, [selectedCategory]);

  // ... rest of component
};
```

### Step 5: Update Wallets Page

Similar to Caps page, update `src/pages/Wallets.jsx`:

```javascript
const params = { productType: 'wallet' };
if (selectedCategory !== 'all') {
  params.category = selectedCategory;
}
```

### Step 6: Update Product Detail Page

Modify `src/pages/ProductDetail.jsx`:

```javascript
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { productAPI } from '../services/api';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await productAPI.getById(id);
        setProduct(response.data);
      } catch (error) {
        console.error('Error:', error);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // ... rest of component
};
```

### Step 7: Update Checkout to Create Orders

Modify `src/pages/Checkout.jsx`:

```javascript
import { orderAPI } from '../services/api';

const Checkout = () => {
  // ... existing state

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const orderData = {
        customer: formData,
        items: cart.map(item => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.qty,
          image: item.img
        })),
        pricing: {
          subtotal: cartManager.getCartTotal(),
          deliveryCharge: cartManager.getDeliveryCharge(),
          total: cartManager.getTotalWithDelivery()
        }
      };

      const response = await orderAPI.create(orderData);
      
      // Save order number for confirmation page
      localStorage.setItem('lastOrderNumber', response.data.orderNumber);
      
      cartManager.clearCart();
      navigate('/order-success');
    } catch (error) {
      console.error('Order creation failed:', error);
      alert('Failed to create order. Please try again.');
    }
  };

  // ... rest of component
};
```

### Step 8: Add Environment Variables

Create `.env` file in frontend root:

```env
VITE_API_URL=http://localhost:5000/api
```

Update for production:
```env
VITE_API_URL=https://your-backend-url.com/api
```

### Step 9: Create Auth Context (Optional)

For user authentication, create `src/contexts/AuthContext.jsx`:

```javascript
import { createContext, useContext, useState, useEffect } from 'react';
import { userAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      loadUser();
    } else {
      setLoading(false);
    }
  }, []);

  const loadUser = async () => {
    try {
      const response = await userAPI.getProfile();
      setUser(response.data);
    } catch (error) {
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const response = await userAPI.login({ email, password });
    localStorage.setItem('token', response.data.token);
    setUser(response.data);
    return response.data;
  };

  const register = async (userData) => {
    const response = await userAPI.register(userData);
    localStorage.setItem('token', response.data.token);
    setUser(response.data);
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
```

### Step 10: Add Loading States

Create a loading component `src/components/Loading.jsx`:

```javascript
const Loading = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center">
      <i className="fas fa-spinner fa-spin text-4xl text-[#D2C1B6] mb-4"></i>
      <p className="text-gray-300">Loading...</p>
    </div>
  </div>
);

export default Loading;
```

## 🧪 Testing Integration

### 1. Test Product Fetching

```javascript
// In browser console
import { productAPI } from './services/api';
const products = await productAPI.getAll();
console.log(products);
```

### 2. Test Order Creation

1. Add items to cart
2. Go to checkout
3. Fill form and submit
4. Check backend logs for order creation
5. Verify in MongoDB

### 3. Test Authentication

```javascript
// Register
const user = await userAPI.register({
  name: 'Test User',
  email: 'test@test.com',
  password: 'test123'
});

// Login
const loginData = await userAPI.login({
  email: 'test@test.com',
  password: 'test123'
});
```

## 🔍 Debugging Tips

### Check Network Requests

1. Open browser DevTools (F12)
2. Go to Network tab
3. Filter by "Fetch/XHR"
4. Check request/response

### Common Issues

**CORS Error:**
- Ensure backend CORS is configured
- Check FRONTEND_URL in backend .env

**401 Unauthorized:**
- Check if token is being sent
- Verify token in localStorage
- Check token expiration

**404 Not Found:**
- Verify API_URL is correct
- Check endpoint paths
- Ensure backend is running

**Network Error:**
- Check if backend is running
- Verify port numbers
- Check firewall settings

## 📊 Migration Checklist

- [ ] Create API service layer
- [ ] Update Home page to use API
- [ ] Update Caps page to use API
- [ ] Update Wallets page to use API
- [ ] Update ProductDetail to use API
- [ ] Update Checkout to create orders
- [ ] Add loading states
- [ ] Add error handling
- [ ] Test all features
- [ ] Add authentication (optional)
- [ ] Update environment variables
- [ ] Test in production

## 🚀 Deployment Considerations

### Frontend
- Update VITE_API_URL to production backend URL
- Build: `npm run build`
- Deploy `dist` folder

### Backend
- Set NODE_ENV=production
- Update FRONTEND_URL to production frontend URL
- Deploy to Heroku/Railway/DigitalOcean

## 📚 Additional Resources

- [Fetch API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [React Hooks](https://react.dev/reference/react)
- [JWT Authentication](https://jwt.io/introduction)

## 🎉 Success!

Once integrated, your app will:
- ✅ Fetch real-time data from database
- ✅ Create actual orders
- ✅ Support user authentication
- ✅ Scale with your business
- ✅ Be production-ready

Happy coding! 🚀
