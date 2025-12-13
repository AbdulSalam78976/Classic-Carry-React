import { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom';
import { cartManager } from '../utils/cartManager';
import { useAuth } from '../contexts/AuthContext';
import { useWishlist } from '../contexts/WishlistContext';
import { useSettings } from '../contexts/SettingsContext';
import { categoryAPI } from '../services/api';
import Logo from './Logo';

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
    return `px-4 py-2 font-medium transition-all rounded-full ${isActive
        ? 'text-primary bg-primary/5 font-semibold'
        : 'text-gray-600 hover:text-primary hover:bg-gray-50'
      }`;
  };

  const getCategoryNavLinkClass = ({ isActive }) => {
    return `category-nav-item px-3 py-2 text-sm font-medium transition-all rounded-full ${isActive
        ? 'text-primary bg-primary/10 font-semibold'
        : 'text-gray-600 hover:text-primary hover:bg-gray-50'
      }`;
  };

  const getMobileNavLinkClass = ({ isActive }) => {
    return `mobile-category-item block px-4 py-3 text-sm font-medium transition-all rounded-xl ${isActive
        ? 'text-primary bg-primary/5 font-semibold'
        : 'text-gray-600 hover:text-primary hover:bg-gray-50'
      }`;
  };

  return (
    <>
      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
          ? 'bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100 py-2'
          : 'bg-white border-b border-gray-100 py-4'
        }`}>
        <nav className="container mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <Logo size="large" />

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              <NavLink
                to="/"
                className={getNavLinkClass}
                end
              >
                Home
              </NavLink>

              {/* Show first 4 categories directly */}
              {categories.slice(0, 4).map((category) => (
                <NavLink
                  key={category._id}
                  to={`/category/${category.slug}`}
                  className={getCategoryNavLinkClass}
                >
                  {category.name}
                </NavLink>
              ))}

              {/* More dropdown for additional categories */}
              {categories.length > 4 && (
                <div className="relative group">
                  <button className="text-gray-700 hover:text-primary px-3 py-2 text-sm font-medium transition-colors flex items-center gap-1 rounded-full hover:bg-gray-50">
                    More
                    <i className="fas fa-chevron-down text-[10px] group-hover:rotate-180 transition-transform duration-200"></i>
                  </button>
                  <div className="header-dropdown absolute top-full left-0 mt-2 w-56 rounded-2xl shadow-xl border border-gray-100 bg-white py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 transform translate-y-2 group-hover:translate-y-0 p-1">
                    <div className="px-3 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                      Others
                    </div>
                    {categories.slice(4).map((category) => (
                      <NavLink
                        key={category._id}
                        to={`/category/${category.slug}`}
                        className={({ isActive }) =>
                          `block px-3 py-2.5 text-sm transition-all rounded-xl ${isActive
                            ? 'text-primary bg-primary/5 font-medium'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-primary'
                          }`
                        }
                      >
                        <i className="fas fa-arrow-right text-[10px] mr-2 opacity-40"></i>
                        {category.name}
                      </NavLink>
                    ))}
                  </div>
                </div>
              )}

              <NavLink
                to="/about"
                className={getNavLinkClass}
              >
                About
              </NavLink>
            </div>

            {/* Right Side Icons */}
            <div className="flex items-center space-x-1">
              {/* Wishlist Icon */}
              <NavLink
                to="/wishlist"
                className={({ isActive }) =>
                  `relative w-10 h-10 flex items-center justify-center rounded-full transition-all ${isActive ? 'text-red-500 bg-red-50' : 'text-gray-600 hover:text-red-500 hover:bg-red-50'
                  }`
                }
              >
                <i className="far fa-heart text-xl"></i>
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-bold shadow-sm">
                    {wishlistCount}
                  </span>
                )}
              </NavLink>

              {/* Cart Icon */}
              <NavLink
                to="/checkout"
                className={({ isActive }) =>
                  `relative w-10 h-10 flex items-center justify-center rounded-full transition-all ${isActive ? 'text-primary bg-primary/10' : 'text-gray-600 hover:text-primary hover:bg-primary/5'
                  }`
                }
              >
                <i className="fas fa-shopping-bag text-xl"></i>
                {cartCount > 0 && (
                  <span className="absolute top-1 right-1 bg-primary text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-bold shadow-sm">
                    {cartCount}
                  </span>
                )}
              </NavLink>

              {/* separator */}
              <div className="h-6 w-px bg-gray-200 mx-2 hidden lg:block"></div>

              {/* Profile Dropdown - Desktop */}
              <div className="hidden lg:block relative" ref={profileRef}>
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className={`flex items-center gap-2 pl-1 pr-2 py-1 rounded-full transition-all border ${profileDropdownOpen ? 'border-primary/20 bg-primary/5' : 'border-transparent hover:bg-gray-50'
                    }`}
                >
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                    <i className="fas fa-user"></i>
                  </div>
                  {isAuthenticated ? (
                    <span className="text-sm font-semibold text-gray-700">
                      {user?.name?.split(' ')[0]}
                    </span>
                  ) : (
                    <span className="text-sm font-medium text-gray-500">Account</span>
                  )}
                  <i className={`fas fa-chevron-down text-[10px] text-gray-400 ${profileDropdownOpen ? 'rotate-180' : ''} transition-transform`}></i>
                </button>

                {/* Dropdown Menu */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 p-1">
                    {isAuthenticated ? (
                      <>
                        <div className="px-4 py-3 mb-1 bg-gray-50 rounded-xl mx-1">
                          <p className="text-gray-900 font-bold text-sm truncate">{user?.name}</p>
                          <p className="text-gray-500 text-xs truncate">{user?.email}</p>
                        </div>
                        <NavLink
                          to="/profile"
                          onClick={() => setProfileDropdownOpen(false)}
                          className={({ isActive }) =>
                            `flex items-center px-4 py-2.5 rounded-xl transition-all ${isActive ? 'text-primary bg-primary/5 font-medium' : 'text-gray-600 hover:bg-gray-50 hover:text-primary'
                            }`
                          }
                        >
                          <i className="fas fa-user mr-3 w-5 text-center"></i>
                          My Profile
                        </NavLink>
                        <NavLink
                          to="/reviews"
                          onClick={() => setProfileDropdownOpen(false)}
                          className={({ isActive }) =>
                            `flex items-center px-4 py-2.5 rounded-xl transition-all ${isActive ? 'text-primary bg-primary/5 font-medium' : 'text-gray-600 hover:bg-gray-50 hover:text-primary'
                            }`
                          }
                        >
                          <i className="fas fa-star mr-3 w-5 text-center"></i>
                          My Reviews
                        </NavLink>
                        <NavLink
                          to="/checkout"
                          onClick={() => setProfileDropdownOpen(false)}
                          className={({ isActive }) =>
                            `flex items-center px-4 py-2.5 rounded-xl transition-all ${isActive ? 'text-primary bg-primary/5 font-medium' : 'text-gray-600 hover:bg-gray-50 hover:text-primary'
                            }`
                          }
                        >
                          <i className="fas fa-shopping-cart mr-3 w-5 text-center"></i>
                          My Cart <span className="ml-auto text-xs font-bold bg-gray-100 px-2 py-0.5 rounded-full">{cartCount}</span>
                        </NavLink>
                        <div className="h-px bg-gray-100 my-1 mx-2"></div>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left flex items-center px-4 py-2.5 text-gray-600 hover:bg-red-50 hover:text-red-500 rounded-xl transition-all"
                        >
                          <i className="fas fa-sign-out-alt mr-3 w-5 text-center"></i>
                          Logout
                        </button>
                      </>
                    ) : (
                      <>
                        <NavLink
                          to="/login"
                          onClick={() => setProfileDropdownOpen(false)}
                          className={({ isActive }) =>
                            `flex items-center px-4 py-2.5 rounded-xl transition-all ${isActive ? 'text-primary bg-primary/5 font-medium' : 'text-gray-600 hover:bg-gray-50 hover:text-primary'
                            }`
                          }
                        >
                          <i className="fas fa-sign-in-alt mr-3 w-5 text-center"></i>
                          Login
                        </NavLink>
                        <NavLink
                          to="/register"
                          onClick={() => setProfileDropdownOpen(false)}
                          className={({ isActive }) =>
                            `flex items-center px-4 py-2.5 rounded-xl transition-all ${isActive ? 'text-primary bg-primary/5 font-medium' : 'text-gray-600 hover:bg-gray-50 hover:text-primary'
                            }`
                          }
                        >
                          <i className="fas fa-user-plus mr-3 w-5 text-center"></i>
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
                className="lg:hidden w-10 h-10 flex items-center justify-center hover:bg-gray-50 rounded-full"
              >
                <i className={`fas ${mobileMenuOpen ? 'fa-times' : 'fa-bars'} text-xl text-gray-600`}></i>
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-100 shadow-xl p-4 animate-fadeIn">
              <div className="flex flex-col space-y-1">
                <NavLink
                  to="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className={getMobileNavLinkClass}
                  end
                >
                  <i className="fas fa-home w-6 text-center opacity-60 mr-2"></i>
                  Home
                </NavLink>
                {categories.map((category) => (
                  <NavLink
                    key={category._id}
                    to={`/category/${category.slug}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className={getMobileNavLinkClass}
                  >
                    <i className="fas fa-tag w-6 text-center opacity-60 mr-2"></i>
                    {category.name}
                  </NavLink>
                ))}

                <div className="h-px bg-gray-100 my-2"></div>

                {isAuthenticated ? (
                  <>
                    <div className="px-4 py-3 bg-gray-50 rounded-xl mb-2 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary font-bold text-lg shadow-sm">
                        {user?.name?.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{user?.name}</p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                      </div>
                    </div>
                    <NavLink
                      to="/profile"
                      onClick={() => setMobileMenuOpen(false)}
                      className={getMobileNavLinkClass}
                    >
                      <i className="fas fa-user w-6 text-center opacity-60 mr-2"></i>
                      My Profile
                    </NavLink>
                    <NavLink
                      to="/checkout"
                      onClick={() => setMobileMenuOpen(false)}
                      className={getMobileNavLinkClass}
                    >
                      <i className="fas fa-shopping-cart w-6 text-center opacity-60 mr-2"></i>
                      My Cart ({cartCount})
                    </NavLink>
                    <button
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full text-left flex items-center px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-all"
                    >
                      <i className="fas fa-sign-out-alt w-6 text-center mr-2"></i>
                      Logout
                    </button>
                  </>
                ) : (
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    <NavLink
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-center px-4 py-3 rounded-xl border border-gray-200 font-semibold text-gray-700 hover:bg-gray-50"
                    >
                      Login
                    </NavLink>
                    <NavLink
                      to="/register"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-center px-4 py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary-dark shadow-md shadow-primary/20"
                    >
                      Register
                    </NavLink>
                  </div>
                )}
              </div>
            </div>
          )}
        </nav>
      </header>

      {/* Spacer for fixed header */}
      <div className={scrolled ? 'h-[72px]' : 'h-[88px]'}></div>
    </>
  );
};

export default Header;