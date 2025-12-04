# Classic Carrry User Website

E-commerce shopping website for Classic Carrry customers.

## 🎯 Features

- 🏠 Home page with hero carousel
- 🛍️ Product browsing and search
- 🏷️ Category filtering
- 🛒 Shopping cart
- ❤️ Wishlist
- 📦 Checkout and order placement
- 👤 User profile and order history
- 📧 Contact form
- ❓ FAQ section
- 📱 Fully responsive design
- 🎨 Modern UI with smooth animations

## 🛠️ Tech Stack

- **React 19** - UI library
- **React Router** - Navigation
- **Tailwind CSS** - Styling
- **Vite** - Build tool
- **Vercel** - Hosting platform

## 💻 Local Development

### Prerequisites
- Node.js 18+
- Backend API running

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create `.env` file:**
   ```bash
   cp .env.example .env
   ```

3. **Configure environment:**
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

Access at: `http://localhost:5174`

## 🏗️ Build for Production

```bash
npm run build
```

Output in `dist/` folder.

## 📁 Project Structure

```
classic-carrry-user/
├── public/              # Static assets
│   └── assets/          # Images, icons
├── src/
│   ├── components/      # Reusable components
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   ├── HeroCarousel.jsx
│   │   ├── ProductCard.jsx
│   │   └── Notification.jsx
│   ├── contexts/        # React contexts
│   │   ├── AuthContext.jsx
│   │   ├── WishlistContext.jsx
│   │   ├── SettingsContext.jsx
│   │   └── NotificationContext.jsx
│   ├── pages/           # Page components
│   │   ├── Home.jsx
│   │   ├── ProductDetail.jsx
│   │   ├── CategoryPage.jsx
│   │   ├── Checkout.jsx
│   │   ├── OrderSuccess.jsx
│   │   ├── Profile.jsx
│   │   ├── Wishlist.jsx
│   │   ├── About.jsx
│   │   ├── Login.jsx
│   │   └── Register.jsx
│   ├── services/        # API services
│   │   └── api.js
│   ├── config/          # Configuration
│   │   └── api.js
│   ├── App.jsx          # Main app component
│   ├── index.css        # Global styles
│   └── main.jsx         # Entry point
├── .env                 # Environment variables (not in git)
├── .env.example         # Environment template
├── .gitignore           # Git ignore rules
├── index.html           # HTML template
├── package.json         # Dependencies
├── vercel.json          # Vercel configuration
└── vite.config.js       # Vite configuration
```

## 🎨 Customization

### Brand Colors

Edit `src/index.css`:
```css
/* Primary brand color */
#8B7355

/* Secondary brand color */
#D2C1B6
```

### Logo

Update "Classic Carrry" text in:
- `src/components/Header.jsx`
- `src/components/Footer.jsx`

## 📝 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `https://api.example.com/api` |

## 🚀 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions to Vercel.

## 📞 Support

For issues or questions: classiccarrry@gmail.com

## 📄 License

MIT
