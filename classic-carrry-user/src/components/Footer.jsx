import { NavLink } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { categoryAPI } from '../services/api';
import { useSettings } from '../contexts/SettingsContext';
import { useNotification } from '../contexts/NotificationContext';
import Logo from './Logo';

import API_URL from '../config/api';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { settings } = useSettings();
  const { showNotification } = useNotification();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);
  const [categories, setCategories] = useState([]);
  const [contactInfo, setContactInfo] = useState({
    email: 'dkart@gmail.com',
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
    return `text-gray-400 hover:text-white transition-colors text-sm ${isActive ? 'text-white font-medium' : ''
      }`;
  };

  return (
    <footer className="bg-[#0B0F19] text-gray-400 pt-20 pb-10 border-t border-gray-800">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-16">
          {/* Brand Section - Span 4 */}
          <div className="lg:col-span-4">
            <div className="mb-6">
              <Logo size="large" linkTo="/" variant="light" />
            </div>
            <p className="text-gray-400 mb-8 max-w-sm leading-relaxed text-sm">
              Discover a world of premium products curated for your lifestyle.
              Quality, style, and innovation in every detail.
            </p>
            <div className="flex space-x-3">
              {contactInfo.whatsapp && (
                <a
                  href={`https://wa.me/${contactInfo.whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 transition-all duration-300 hover:bg-[#25D366] hover:text-white hover:shadow-lg hover:shadow-[#25D366]/30 hover:-translate-y-1"
                >
                  <i className="fab fa-whatsapp text-lg"></i>
                </a>
              )}
              {contactInfo.tiktok && (
                <a
                  href={contactInfo.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 transition-all duration-300 hover:bg-white hover:text-black hover:shadow-lg hover:shadow-white/20 hover:-translate-y-1"
                >
                  <i className="fab fa-tiktok text-lg"></i>
                </a>
              )}
              {contactInfo.instagram && (
                <a
                  href={contactInfo.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 transition-all duration-300 hover:bg-pink-600 hover:text-white hover:shadow-lg hover:shadow-pink-600/30 hover:-translate-y-1"
                >
                  <i className="fab fa-instagram text-lg"></i>
                </a>
              )}
            </div>
          </div>

          {/* Spacer */}
          <div className="hidden lg:block lg:col-span-1"></div>

          {/* Links Section - Span 7 */}
          <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Categories */}
            <div>
              <h3 className="text-white font-bold mb-6 font-display text-lg">Collections</h3>
              <ul className="space-y-3">
                {categories.slice(0, 5).map((category) => (
                  <li key={category._id}>
                    <NavLink
                      to={`/category/${category.slug}`}
                      className="text-gray-400 hover:text-white transition-colors text-sm block py-1"
                    >
                      {category.name}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-white font-bold mb-6 font-display text-lg">Support</h3>
              <ul className="space-y-3">
                <li><NavLink to="/order-tracking" className={getFooterLinkClass}>Track Order</NavLink></li>
                <li><NavLink to="/about#faq" className={getFooterLinkClass}>FAQs</NavLink></li>
                <li><NavLink to="/about#contact" className={getFooterLinkClass}>Contact Us</NavLink></li>
                <li><NavLink to="/terms" className={getFooterLinkClass}>Terms of Service</NavLink></li>
                <li><NavLink to="/privacy" className={getFooterLinkClass}>Privacy Policy</NavLink></li>
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h3 className="text-white font-bold mb-6 font-display text-lg">Keep in Touch</h3>
              <p className="text-gray-400 text-xs mb-4">
                Join our newsletter for exclusive offers and new arrivals.
              </p>

              <form onSubmit={handleNewsletterSubmit} className="relative">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Email address"
                  required
                  disabled={subscribing}
                  className="w-full pl-4 pr-12 py-3 rounded-xl bg-gray-800/50 text-white border border-gray-700/50 focus:bg-gray-800 focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all text-sm outline-none placeholder-gray-500"
                />
                <button
                  type="submit"
                  disabled={subscribing}
                  className="absolute right-1 top-1 bottom-1 w-10 flex items-center justify-center bg-primary rounded-lg text-white hover:bg-primary-dark transition-all shadow-lg shadow-primary/20"
                >
                  {subscribing ? (
                    <i className="fas fa-spinner fa-spin text-xs"></i>
                  ) : (
                    <i className="fas fa-arrow-right text-xs"></i>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-xs">
            &copy; {currentYear} {settings.appearance.siteName}. All rights reserved.
          </p>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <span>Powered by</span>
            <a href="https://abdulsalam78976.github.io/AppCrafters" target="_blank" rel="noopener noreferrer" className="font-bold text-gray-400 hover:text-white transition-colors">AppCrafters</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;