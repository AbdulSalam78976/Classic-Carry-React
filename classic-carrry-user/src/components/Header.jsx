import { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom';
import { cartManager } from '../utils/cartManager';
import { useAuth } from '../contexts/AuthContext';
import { useWishlist } from '../contexts/WishlistContext';
import { useSettings } from '../contexts/SettingsContext';
import { categoryAPI } from '../services/api';

const Header = () => {
  const [cartCount, setCartCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [categories, setCategories] = useState([]);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const profileRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const { wishlistCount } = useWishlist();
  const { settings } = useSettings();

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
      const scrollY = window.scrollY;
      setScrolled(scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch all active categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryAPI.getAll();
        setCategories(response.data || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setProfileDropdownOpen(false);
    navigate('/');
  };

  // NavLink active class function
  const getNavLinkClass = ({ isActive }) => {
    return `px-4 py-2 font-medium ${
      isActive 
        ? 'text-[#8B7355] underline underline-offset-4 decoration-2 decoration-[#8B7355]' 
        : 'text-gray-600 hover:text-[#8B7355]'
    }`;
  };

  const getCategoryNavLinkClass = ({ isActive }) => {
    return `px-4 py-2 font-medium ${
      isActive 
        ? 'text-[#8B7355] underline underline-offset-4 decoration-2 decoration-[#8B7355]' 
        : 'text-gray-600 hover:text-[#8B7355]'
    }`;
  };

  const getMobileNavLinkClass = ({ isActive }) => {
    return `px-4 py-2 font-medium ${
      isActive 
        ? 'text-[#8B7355]' 
        : 'text-gray-600 hover:text-[#8B7355]'
    }`;
  };

  return (
    <>
      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50 ${
        scrolled ? 'shadow-md py-2' : 'py-4'
      }`}>
        <nav className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link 
              to="/" 
              className="text-3xl md:text-4xl font-bold text-gray-800 hover:text-[#8B7355] transition-colors flex items-center gap-2"
              style={{ fontFamily: 'Satisfy, cursive' }}
            >
              {settings.appearance.siteName}
              <span className="text-2xl">{settings.appearance.brandEmoji || '✨'}</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-4">
              <NavLink 
                to="/" 
                className={getNavLinkClass}
                end
              >
                Home
              </NavLink>
              
              {categories.map((category) => (
                <NavLink
                  key={category._id}
                  to={`/category/${category.slug}`}
                  className={getCategoryNavLinkClass}
                >
                  {category.name}
                </NavLink>
              ))}
              
              <NavLink 
                to="/about" 
                className={getNavLinkClass}
              >
                About
              </NavLink>
            </div>

            {/* Right Side Icons */}
            <div className="flex items-center space-x-4">
              {/* Wishlist Icon */}
              <NavLink 
                to="/wishlist" 
                className={({ isActive }) => 
                  `relative p-2 transition-colors ${
                    isActive ? 'text-red-500' : 'hover:text-red-500'
                  }`
                }
              >
                <i className="far fa-heart text-xl text-gray-600"></i>
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                    {wishlistCount}
                  </span>
                )}
              </NavLink>

              {/* Cart Icon */}
              <NavLink 
                to="/checkout" 
                className={({ isActive }) => 
                  `relative p-2 transition-colors ${
                    isActive ? 'text-[#8B7355]' : 'hover:text-[#8B7355]'
                  }`
                }
              >
                <i className="fas fa-shopping-bag text-xl text-gray-600"></i>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#8B7355] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </NavLink>

              {/* Profile Dropdown - Desktop */}
              <div className="hidden lg:block relative" ref={profileRef}>
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center space-x-2 p-2 hover:text-[#8B7355] transition-colors"
                >
                  <i className="fas fa-user-circle text-xl text-gray-600"></i>
                  {isAuthenticated && (
                    <span className="text-sm font-medium text-gray-700">
                      {user?.name?.split(' ')[0]}
                    </span>
                  )}
                  <i className={`fas fa-chevron-down text-xs ${profileDropdownOpen ? 'rotate-180' : ''} transition-transform`}></i>
                </button>

                {/* Dropdown Menu */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    {isAuthenticated ? (
                      <>
                        <div className="px-4 py-2 border-b border-gray-200">
                          <p className="text-gray-900 font-semibold text-sm">{user?.name}</p>
                          <p className="text-gray-500 text-xs mt-1">{user?.email}</p>
                        </div>
                        <NavLink
                          to="/profile"
                          onClick={() => setProfileDropdownOpen(false)}
                          className={({ isActive }) => 
                            `flex items-center px-4 py-2 hover:bg-gray-50 hover:text-[#8B7355] ${
                              isActive ? 'text-[#8B7355] bg-gray-50' : 'text-gray-700'
                            }`
                          }
                        >
                          <i className="fas fa-user mr-3 text-gray-400"></i>
                          My Profile
                        </NavLink>
                        <NavLink
                          to="/checkout"
                          onClick={() => setProfileDropdownOpen(false)}
                          className={({ isActive }) => 
                            `flex items-center px-4 py-2 hover:bg-gray-50 hover:text-[#8B7355] ${
                              isActive ? 'text-[#8B7355] bg-gray-50' : 'text-gray-700'
                            }`
                          }
                        >
                          <i className="fas fa-shopping-cart mr-3 text-gray-400"></i>
                          My Cart ({cartCount})
                        </NavLink>
                        <div className="border-t border-gray-200 my-2"></div>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left flex items-center px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600"
                        >
                          <i className="fas fa-sign-out-alt mr-3 text-gray-400"></i>
                          Logout
                        </button>
                      </>
                    ) : (
                      <>
                        <NavLink
                          to="/login"
                          onClick={() => setProfileDropdownOpen(false)}
                          className={({ isActive }) => 
                            `flex items-center px-4 py-2 hover:bg-gray-50 hover:text-[#8B7355] ${
                              isActive ? 'text-[#8B7355] bg-gray-50' : 'text-gray-700'
                            }`
                          }
                        >
                          <i className="fas fa-sign-in-alt mr-3 text-gray-400"></i>
                          Login
                        </NavLink>
                        <NavLink
                          to="/register"
                          onClick={() => setProfileDropdownOpen(false)}
                          className={({ isActive }) => 
                            `flex items-center px-4 py-2 hover:bg-gray-50 hover:text-[#8B7355] ${
                              isActive ? 'text-[#8B7355] bg-gray-50' : 'text-gray-700'
                            }`
                          }
                        >
                          <i className="fas fa-user-plus mr-3 text-gray-400"></i>
                          Register
                        </NavLink>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
                className="lg:hidden p-2 hover:bg-gray-50"
              >
                <i className={`fas ${mobileMenuOpen ? 'fa-times' : 'fa-bars'} text-xl text-gray-600`}></i>
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="lg:hidden pb-4 border-t border-gray-200 pt-4 mt-4">
              <div className="flex flex-col space-y-1">
                <NavLink 
                  to="/" 
                  onClick={() => setMobileMenuOpen(false)}
                  className={getMobileNavLinkClass}
                  end
                >
                  Home
                </NavLink>
                {categories.map((category) => (
                  <NavLink
                    key={category._id}
                    to={`/category/${category.slug}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className={getMobileNavLinkClass}
                  >
                    {category.name}
                  </NavLink>
                ))}
                <NavLink 
                  to="/about" 
                  onClick={() => setMobileMenuOpen(false)}
                  className={getMobileNavLinkClass}
                >
                  About
                </NavLink>
                
                <div className="border-t border-gray-200 pt-4 mt-2">
                  {isAuthenticated ? (
                    <>
                      <div className="px-4 py-2 text-gray-700">
                        <p className="font-semibold">{user?.name}</p>
                        <p className="text-sm text-gray-500">{user?.email}</p>
                      </div>
                      <NavLink 
                        to="/profile" 
                        onClick={() => setMobileMenuOpen(false)}
                        className={({ isActive }) => 
                          `flex items-center px-4 py-2 hover:text-[#8B7355] ${
                            isActive ? 'text-[#8B7355]' : 'text-gray-600'
                          }`
                        }
                      >
                        <i className="fas fa-user mr-3"></i>
                        My Profile
                      </NavLink>
                      <NavLink 
                        to="/checkout" 
                        onClick={() => setMobileMenuOpen(false)}
                        className={({ isActive }) => 
                          `flex items-center px-4 py-2 hover:text-[#8B7355] ${
                            isActive ? 'text-[#8B7355]' : 'text-gray-600'
                          }`
                        }
                      >
                        <i className="fas fa-shopping-cart mr-3"></i>
                        My Cart ({cartCount})
                      </NavLink>
                      <button
                        onClick={() => {
                          handleLogout();
                          setMobileMenuOpen(false);
                        }}
                        className="w-full text-left flex items-center px-4 py-2 text-gray-600 hover:text-red-600"
                      >
                        <i className="fas fa-sign-out-alt mr-3"></i>
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <NavLink 
                        to="/login" 
                        onClick={() => setMobileMenuOpen(false)}
                        className={({ isActive }) => 
                          `flex items-center px-4 py-2 mb-2 hover:text-[#8B7355] ${
                            isActive ? 'text-[#8B7355]' : 'text-gray-600'
                          }`
                        }
                      >
                        <i className="fas fa-sign-in-alt mr-3"></i>
                        Login
                      </NavLink>
                      <NavLink 
                        to="/register" 
                        onClick={() => setMobileMenuOpen(false)}
                        className={({ isActive }) => 
                          `flex items-center justify-center px-4 py-2 rounded font-semibold ${
                            isActive 
                              ? 'bg-[#A68A6F] text-white' 
                              : 'bg-[#8B7355] text-white hover:bg-[#A68A6F]'
                          }`
                        }
                      >
                        <i className="fas fa-user-plus mr-2"></i>
                        Register
                      </NavLink>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </nav>
      </header>
      
      {/* Spacer for fixed header */}
      <div className={scrolled ? 'h-16' : 'h-20'}></div>
    </>
  );
};

export default Header;