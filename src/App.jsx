import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { NotificationProvider } from './contexts/NotificationContext';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import Caps from './pages/Caps';
import Wallets from './pages/Wallets';
import About from './pages/About';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import NotFound from './pages/NotFound';
import './index.css';

// Component to handle fade-in animations on route changes
function FadeInObserver() {
  const location = useLocation();

  useEffect(() => {
    // Add fade-in animation observer
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('appear');
        }
      });
    }, observerOptions);

    // Small delay to ensure DOM is ready
    const timeoutId = setTimeout(() => {
      const fadeElements = document.querySelectorAll('.fade-in');
      fadeElements.forEach(el => observer.observe(el));
    }, 50);

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, [location.pathname]); // Re-run when route changes

  return null;
}

function App() {
  return (
    <Router>
      <NotificationProvider>
        <ScrollToTop />
        <FadeInObserver />
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/caps" element={<Caps />} />
              <Route path="/wallets" element={<Wallets />} />
              <Route path="/about" element={<About />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order-success" element={<OrderSuccess />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </NotificationProvider>
    </Router>
  );
}

export default App;
