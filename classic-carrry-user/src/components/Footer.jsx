import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { categoryAPI } from '../services/api';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [categories, setCategories] = useState([]);

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

  return (
    <>
      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
            {/* Brand Section */}
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <span className="font-display text-2xl font-bold text-gray-900">Classic Carrry</span>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">✨</span>
                </div>
              </div>
              <p className="text-gray-600 mb-6 max-w-md leading-relaxed">
                Premium caps and wallets crafted for the modern individual who values quality, style, and functionality.
              </p>
              <div className="flex space-x-4">
                <a href="https://wa.me/923160928206" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-white border border-gray-200 hover:bg-green-600 hover:border-green-600 rounded-full flex items-center justify-center text-gray-600 hover:text-white transition duration-300 transform hover:scale-110">
                  <i className="fab fa-whatsapp text-xl"></i>
                </a>
                <a href="#" className="w-12 h-12 bg-white border border-gray-200 hover:bg-blue-600 hover:border-blue-600 rounded-full flex items-center justify-center text-gray-600 hover:text-white transition duration-300 transform hover:scale-110">
                  <i className="fab fa-facebook text-xl"></i>
                </a>
                <a href="#" className="w-12 h-12 bg-white border border-gray-200 hover:bg-pink-600 hover:border-pink-600 rounded-full flex items-center justify-center text-gray-600 hover:text-white transition duration-300 transform hover:scale-110">
                  <i className="fab fa-instagram text-xl"></i>
                </a>
              </div>
            </div>

            {/* Categories */}
            <div>
              <h3 className="text-gray-900 font-semibold mb-4 text-lg">Categories</h3>
              <ul className="space-y-3">
                <li>
                  <Link to="/" className="text-gray-600 hover:text-[#8B7355] transition duration-300 flex items-center group">
                    <i className="fas fa-chevron-right text-xs mr-2 text-[#8B7355] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></i>
                    Home
                  </Link>
                </li>
                {categories.slice(0, 5).map((category) => (
                  <li key={category._id}>
                    <Link 
                      to={`/category/${category.slug}`} 
                      className="text-gray-600 hover:text-[#8B7355] transition duration-300 flex items-center group"
                    >
                      <i className="fas fa-chevron-right text-xs mr-2 text-[#8B7355] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></i>
                      {category.name}
                    </Link>
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
                  <span>+92 316 092 8206</span>
                </li>
                <li className="flex items-center space-x-3 group hover:text-[#8B7355] transition duration-300">
                  <div className="w-10 h-10 bg-white border border-gray-200 rounded-lg flex items-center justify-center group-hover:bg-[#8B7355] group-hover:border-[#8B7355] group-hover:text-white transition duration-300">
                    <i className="fas fa-envelope text-sm"></i>
                  </div>
                  <span>classiccarrry@gmail.com</span>
                </li>
                <li className="flex items-center space-x-3 group hover:text-[#8B7355] transition duration-300">
                  <div className="w-10 h-10 bg-white border border-gray-200 rounded-lg flex items-center justify-center group-hover:bg-[#8B7355] group-hover:border-[#8B7355] group-hover:text-white transition duration-300">
                    <i className="fas fa-map-marker-alt text-sm"></i>
                  </div>
                  <span>Pakistan</span>
                </li>
              </ul>
            </div>

            {/* Newsletter Section */}
            <div>
              <h3 className="text-gray-900 font-semibold mb-4 text-lg">Newsletter</h3>
              <p className="text-gray-600 mb-4 text-sm">
                Get the latest updates on new products and upcoming sales
              </p>
              
              <div className="flex flex-col gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="px-4 py-2.5 rounded-lg bg-white text-gray-900 border border-gray-300 focus:border-[#8B7355] focus:outline-none text-sm"
                />
                <button className="px-4 py-2.5 bg-[#8B7355] text-white rounded-lg font-medium hover:bg-[#6B5744] transition text-sm">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 mt-10 pt-8 text-center">
            <p className="text-gray-500">
              &copy; {currentYear} classiccarrry. All rights reserved.
              <span className="mx-2">|</span>
              Powered by <b><a href="https://abdulsalam78976.github.io/AppCrafters" target="_blank" rel="noopener noreferrer" className="text-[#8B7355] hover:text-[#6B5744]">AppCrafters</a></b>
            </p>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp */}
      <a href="https://wa.me/923160928206" target="_blank" rel="noopener noreferrer" className="floating-whatsapp group">
        <div className="bg-green-500 hover:bg-green-600 text-white rounded-full w-12 h-12 md:w-14 md:h-14 flex items-center justify-center shadow-2xl transition transform relative">
          <i className="fab fa-whatsapp text-xl md:text-2xl"></i>
          <span className="absolute -top-10 right-0 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap shadow-xl">
            Chat with us! 💬
          </span>
        </div>
      </a>
    </>
  );
};

export default Footer;
