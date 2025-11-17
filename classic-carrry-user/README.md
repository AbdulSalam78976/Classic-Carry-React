# Classic Carrry - React Version

A premium e-commerce website for caps and wallets, built with React and modern web technologies.

## Features

- 🛍️ **Product Catalog**: Browse premium caps and wallets with category filtering
- 🛒 **Shopping Cart**: Add products to cart with quantity management
- 📱 **Responsive Design**: Fully responsive design that works on all devices
- 🎨 **Modern UI**: Beautiful gradient designs with smooth animations
- 🚚 **Free Delivery**: Free delivery on orders above Rs 4,000
- 💳 **Checkout Process**: Complete checkout flow with order confirmation
- 🔍 **Product Details**: Detailed product pages with image galleries and color selection

## Tech Stack

- **React 19** - UI library
- **React Router DOM** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Build tool and dev server
- **Font Awesome** - Icons
- **Google Fonts** - Typography (Playfair Display & Inter)

## Project Structure

```
classic-carrry-r/
├── public/
│   └── assets/
│       └── images/          # Product images
├── src/
│   ├── components/          # Reusable components
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   ├── HeroCarousel.jsx
│   │   ├── ProductCard.jsx
│   │   └── Notification.jsx
│   ├── pages/              # Page components
│   │   ├── Home.jsx
│   │   ├── Caps.jsx
│   │   ├── Wallets.jsx
│   │   ├── About.jsx
│   │   ├── ProductDetail.jsx
│   │   ├── Checkout.jsx
│   │   └── OrderSuccess.jsx
│   ├── data/               # Product data
│   │   └── products.js
│   ├── utils/              # Utility functions
│   │   ├── cartManager.js
│   │   └── helpers.js
│   ├── App.jsx             # Main app component
│   ├── main.jsx            # Entry point
│   └── index.css           # Global styles
└── package.json

```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Navigate to the project directory:
   ```bash
   cd classic-carrry-r
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and visit `http://localhost:5173` (or the port shown in terminal)

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions for Netlify and other platforms.

## Features Breakdown

### Shopping Cart
- Persistent cart using localStorage
- Real-time cart updates
- Quantity management
- Cart badge in header
- Free delivery calculation

### Product Catalog
- Category filtering (Summer, Winter, Male, Female, Sports, etc.)
- Hot selling products section
- Responsive grid layout
- Product cards with hover effects

### Product Details
- Image gallery with thumbnails
- Color selection with visual swatches
- Quantity selector
- Add to cart functionality
- Product features and specifications

### Checkout
- Cart review and management
- Delivery information form
- Order summary with delivery charges
- Free delivery notification
- Form validation

## Customization

### Colors
The primary color scheme can be customized in `tailwind.config.js` and `src/index.css`:

```css
:root {
  --primary: #d2c1b6;
  --primary-dark: #b8a599;
  --bg-dark: #0f172a;
  --bg-card: #1e293b;
  --text-light: #e2e8f0;
}
```

### Products
Add or modify products in `src/data/products.js`:

```javascript
{
  id: 'product-id',
  name: 'Product Name',
  price: 2999,
  category: 'male',
  mainImage: '/assets/images/product.png',
  images: ['/assets/images/product.png'],
  description: 'Product description',
  colors: ['Black', 'Brown'],
  tag: 'New'
}
```

## Contact Information

- **WhatsApp**: +92 316 092 8206
- **Email**: classiccarrry@gmail.com
- **Location**: Pakistan

## License

This project is created for Classic Carrry.

## Credits

Powered by **AppCrafters**
