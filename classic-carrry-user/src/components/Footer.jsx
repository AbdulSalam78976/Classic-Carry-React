import { NavLink } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { categoryAPI } from '../services/api';
import { useSettings } from '../contexts/SettingsContext';
import { useNotification } from '../contexts/NotificationContext';

import API_URL from '../config/api';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { settings } = useSettings();
  const { showNotification } = useNotification();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);
  const [categories, setCategories] = useState([]);
  const [contactInfo, setContactInfo] = useState({
    email: 'classiccarrry@gmail.com',
    phone: '+92 316 092 8206',
    whatsapp: '+92 316 092 8206',
    address: 'Pakistan',
    tiktok: '',
    instagram: ''
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryAPI.getAll();
        setCategories(response.data || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    const fetchContactInfo = async () => {
      try {
        const response = await fetch(`${API_URL}/settings/contact`);
        const data = await response.json();
        if (data.success) {
          setContactInfo(data.data);
        }
      } catch (error) {
        console.error('Error fetching contact info:', error);
      }
    };

    fetchCategories();
    fetchContactInfo();
  }, []);

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      showNotification('Please enter a valid email address', 'error');
      return;
    }

    setSubscribing(true);
    try {
      const response = await fetch(`${API_URL}/newsletter/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: newsletterEmail })
      });

      const data = await response.json();

      if (data.success) {
        showNotification(data.message || 'Successfully subscribed to newsletter!', 'success');
        setNewsletterEmail('');
      } else {
        showNotification(data.message || 'Failed to subscribe', 'error');
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      showNotification('Failed to subscribe to newsletter', 'error');
    } finally {
      setSubscribing(false);
    }
  };

  // NavLink active class function for footer links
  const getFooterLinkClass = ({ isActive }) => {
    return `text-gray-600 transition ${
      isActive ? 'text-[#8B7355] font-medium' : 'hover:text-[#8B7355]'
    }`;
  };

  return (
    <>
      {/* Footer Separator */}
      <div className="w-full h-1 bg-gradient-to-r from-transparent via-[#8B7355] to-transparent"></div>
      
      {/* Footer */}
      <footer className="bg-gray-50 border-t-4 border-[#8B7355]">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
            {/* Brand Section */}
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <span className="text-3xl font-bold text-gray-900" style={{ fontFamily: 'Satisfy, cursive' }}>{settings.appearance.siteName}</span>
                <span className="text-2xl">{settings.appearance.brandEmoji || '✨'}</span>
              </div>
              <p className="text-gray-600 mb-6 max-w-md leading-relaxed">
                Premium lifestyle products crafted for the modern individual who values quality, style, and functionality.
              </p>
              <div className="flex space-x-4">
                {contactInfo.whatsapp && (
                  <a 
                    href={`https://wa.me/${contactInfo.whatsapp.replace(/[^0-9]/g, '')}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="w-12 h-12 bg-green-500 border-2 border-green-500 rounded-full flex items-center justify-center text-white transition-all duration-300 hover:shadow-lg hover:shadow-green-500/50 hover:-translate-y-1"
                  >
                    <i className="fab fa-whatsapp text-xl"></i>
                  </a>
                )}
                {contactInfo.tiktok && (
                  <a 
                    href={contactInfo.tiktok} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="w-12 h-12 bg-black border-2 border-black rounded-full flex items-center justify-center text-white transition-all duration-300 hover:shadow-lg hover:shadow-black/50 hover:-translate-y-1"
                  >
                    <i className="fab fa-tiktok text-xl"></i>
                  </a>
                )}
                {contactInfo.instagram && (
                  <a 
                    href={contactInfo.instagram} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="w-12 h-12 bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 border-2 border-pink-500 rounded-full flex items-center justify-center text-white transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/50 hover:-translate-y-1"
                  >
                    <i className="fab fa-instagram text-xl"></i>
                  </a>
                )}
              </div>
            </div>

            {/* Categories */}
            <div>
              <h3 className="text-gray-900 font-semibold mb-4 text-lg">Categories</h3>
              <ul className="space-y-3">
                <li>
                  <NavLink 
                    to="/" 
                    className={({ isActive }) => 
                      `transition duration-300 flex items-center group ${
                        isActive 
                          ? 'text-[#8B7355] font-medium' 
                          : 'text-gray-600 hover:text-[#8B7355]'
                      }`
                    }
                    end
                  >
                    <i className={`fas fa-chevron-right text-xs mr-2 text-[#8B7355] ${
                      ({ isActive }) => isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                    } transition-opacity duration-300`}></i>
                    Home
                  </NavLink>
                </li>
                {categories.slice(0, 5).map((category) => (
                  <li key={category._id}>
                    <NavLink 
                      to={`/category/${category.slug}`} 
                      className={({ isActive }) => 
                        `transition duration-300 flex items-center group ${
                          isActive 
                            ? 'text-[#8B7355] font-medium' 
                            : 'text-gray-600 hover:text-[#8B7355]'
                        }`
                      }
                    >
                      <i className={`fas fa-chevron-right text-xs mr-2 text-[#8B7355] ${
                        ({ isActive }) => isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                      } transition-opacity duration-300`}></i>
                      {category.name}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-gray-900 font-semibold mb-4 text-lg">Contact</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-center space-x-3 group hover:text-[#8B7355] transition duration-300">
                  <div className="w-10 h-10 bg-white border border-gray-200 rounded-lg flex items-center justify-center group-hover:bg-[#8B7355] group-hover:border-[#8B7355] group-hover:text-white transition duration-300">
                    <i className="fas fa-phone text-sm"></i>
                  </div>
                  <span>{contactInfo.phone}</span>
                </li>
                <li className="flex items-center space-x-3 group hover:text-[#8B7355] transition duration-300">
                  <div className="w-10 h-10 bg-white border border-gray-200 rounded-lg flex items-center justify-center group-hover:bg-[#8B7355] group-hover:border-[#8B7355] group-hover:text-white transition duration-300">
                    <i className="fas fa-envelope text-sm"></i>
                  </div>
                  <span>{contactInfo.email}</span>
                </li>
                <li className="flex items-center space-x-3 group hover:text-[#8B7355] transition duration-300">
                  <div className="w-10 h-10 bg-white border border-gray-200 rounded-lg flex items-center justify-center group-hover:bg-[#8B7355] group-hover:border-[#8B7355] group-hover:text-white transition duration-300">
                    <i className="fas fa-map-marker-alt text-sm"></i>
                  </div>
                  <span>{contactInfo.address}</span>
                </li>
              </ul>
            </div>

            {/* Newsletter Section */}
            <div>
              <h3 className="text-gray-900 font-semibold mb-4 text-lg">Newsletter</h3>
              <p className="text-gray-600 mb-4 text-sm">
                Get the latest updates on new products and upcoming sales
              </p>
              
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col gap-2">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  disabled={subscribing}
                  className="px-4 py-2.5 rounded-lg bg-white text-gray-900 border border-gray-300 focus:border-[#8B7355] focus:outline-none text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <button 
                  type="submit"
                  disabled={subscribing}
                  className="px-4 py-2.5 bg-[#8B7355] text-white rounded-lg font-medium hover:bg-[#6B5744] transition text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {subscribing ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i>
                      <span>Subscribing...</span>
                    </>
                  ) : (
                    <>
                      <i className="fas fa-envelope"></i>
                      <span>Subscribe</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          <div className="border-t border-gray-200 mt-10 pt-8">
            <div className="flex flex-wrap justify-center gap-6 mb-6">
              <NavLink 
                to="/about" 
                className={getFooterLinkClass}
              >
                About Us
              </NavLink>
              <NavLink 
                to="/about#faq" 
                className={getFooterLinkClass}
              >
                FAQ
              </NavLink>
              <NavLink 
                to="/about#contact" 
                className={getFooterLinkClass}
              >
                Contact
              </NavLink>
              <NavLink 
                to="/privacy" 
                className={getFooterLinkClass}
              >
                Privacy Policy
              </NavLink>
              <NavLink 
                to="/terms" 
                className={getFooterLinkClass}
              >
                Terms & Conditions
              </NavLink>
            </div>
            <p className="text-gray-500 text-center">
              &copy; {currentYear} {settings.appearance.siteName}. All rights reserved.
              <span className="mx-2">|</span>
              Powered by <b><a href="https://abdulsalam78976.github.io/AppCrafters" target="_blank" rel="noopener noreferrer" className="text-[#8B7355] hover:text-[#6B5744]">AppCrafters</a></b>
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;