import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cartManager } from '../utils/cartManager';
import { useAuth } from '../contexts/AuthContext';

const Header = () => {
  const [cartCount, setCartCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();

  useEffect(() => {
    const updateCart = () => {
      setCartCount(cartManager.getTotalItems());
    };

    updateCart();
    const unsubscribe = cartManager.subscribe(updateCart);
    return unsubscribe;
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Free Delivery Banner */}
      <div className="bg-green-600 text-white py-1 text-center text-sm font-medium">
        <div className="container mx-auto px-4">
          <i className="fas fa-truck mr-2"></i>
          <span className="font-semibold">FREE DELIVERY</span> on orders above Rs 4,000!
          <i className="fas fa-gift ml-2"></i>
        </div>
      </div>

      {/* Header */}
      <header className={`bg-gray-900 border-b border-gray-700 sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'header-scrolled' : ''}`}>
        <nav className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <Link to="/" className="font-display text-xl md:text-2xl font-bold text-white hover:text-[#D2C1B6] transition duration-300 flex items-center">
                <span>Classic Carrry</span>
                <span className="ml-2">✨</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className={`nav-link text-gray-300 hover:text-white transition duration-300 font-medium ${isActive('/') ? 'text-white' : ''}`}>
                Home
              </Link>
              <Link to="/caps" className={`nav-link text-gray-300 hover:text-white transition duration-300 font-medium ${isActive('/caps') ? 'text-white' : ''}`}>
                Caps
              </Link>
              <Link to="/wallets" className={`nav-link text-gray-300 hover:text-white transition duration-300 font-medium ${isActive('/wallets') ? 'text-white' : ''}`}>
                Wallets
              </Link>
              <Link to="/about" className={`nav-link text-gray-300 hover:text-white transition duration-300 font-medium ${isActive('/about') ? 'text-white' : ''}`}>
                About
              </Link>
            </div>

            {/* Cart, Auth & Mobile Menu */}
            <div className="flex items-center space-x-4">
              {/* Cart Icon */}
              <Link to="/checkout" className="relative text-[#D2C1B6] hover:text-white transition duration-300 cart-icon">
                <div className="relative">
                  <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M27 25.15 25.28 10.5a2.93 2.93 0 0 0-3-2.5h-1.35c0-.19 0-.38-.06-.57-.22-1.54-.41-2.87-1.59-4a4.51 4.51 0 0 0-6.56 0c-1.18 1.14-1.37 2.47-1.59 4 0 .19 0 .38-.06.57H9.69a2.93 2.93 0 0 0-3 2.5L5 25.15a4.13 4.13 0 0 0 1 3.26A4.87 4.87 0 0 0 9.72 30h12.56a4.87 4.87 0 0 0 3.64-1.59A4.13 4.13 0 0 0 27 25.15zM13.11 7.71c.22-1.52.34-2.21 1-2.85A2.78 2.78 0 0 1 16 4a2.78 2.78 0 0 1 1.89.86c.66.64.78 1.33 1 2.85V8h-5.8c.01-.1.01-.19.02-.29zm11.31 19.37a2.83 2.83 0 0 1-2.14.92H9.72a2.83 2.83 0 0 1-2.14-.92 2.14 2.14 0 0 1-.58-1.7l1.7-14.65a.94.94 0 0 1 1-.73H11c0 .38.05.76.1 1.14a1 1 0 1 0 2-.28c0-.29 0-.57-.06-.86H19c0 .29 0 .57-.06.86a1 1 0 0 0 .8 1.14h.14a1 1 0 0 0 1-.86c.05-.38.08-.76.1-1.14h1.34a.94.94 0 0 1 1 .73L25 25.38a2.14 2.14 0 0 1-.58 1.7z" fill="#d2c1b6" />
                  </svg>
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-[#D2C1B6] text-gray-900 text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold shadow-lg">
                      {cartCount}
                    </span>
                  )}
                </div>
              </Link>

              {/* Auth Buttons - Desktop */}
              <div className="hidden md:flex items-center space-x-3">
                {isAuthenticated ? (
                  <>
                    <span className="text-gray-300 text-sm">Hi, {user?.name?.split(' ')[0]}</span>
                    <button
                      onClick={logout}
                      className="text-gray-300 hover:text-[#D2C1B6] transition duration-300 text-sm font-medium"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="text-gray-300 hover:text-[#D2C1B6] transition duration-300 text-sm font-medium"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="bg-[#D2C1B6] text-gray-900 px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#e2c9b8] transition duration-300"
                    >
                      Register
                    </Link>
                  </>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden text-gray-300 hover:text-white transition duration-300">
                <i className={`fas ${mobileMenuOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-gray-700">
              <div className="flex flex-col space-y-3 pt-4">
                <Link to="/" onClick={() => setMobileMenuOpen(false)} className="text-gray-300 hover:text-white transition duration-300 font-medium">
                  Home
                </Link>
                <Link to="/caps" onClick={() => setMobileMenuOpen(false)} className="text-gray-300 hover:text-white transition duration-300 font-medium">
                  Caps
                </Link>
                <Link to="/wallets" onClick={() => setMobileMenuOpen(false)} className="text-gray-300 hover:text-white transition duration-300 font-medium">
                  Wallets
                </Link>
                <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="text-gray-300 hover:text-white transition duration-300 font-medium">
                  About
                </Link>
                <div className="border-t border-gray-700 pt-3 mt-3">
                  {isAuthenticated ? (
                    <>
                      <div className="text-gray-300 mb-2">Hi, {user?.name}</div>
                      <button
                        onClick={() => {
                          logout();
                          setMobileMenuOpen(false);
                        }}
                        className="text-gray-300 hover:text-white transition duration-300 font-medium"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="block text-gray-300 hover:text-white transition duration-300 font-medium mb-2">
                        Login
                      </Link>
                      <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="block bg-[#D2C1B6] text-gray-900 px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#e2c9b8] transition duration-300 text-center">
                        Register
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </nav>
      </header>
    </>
  );
};

export default Header;
