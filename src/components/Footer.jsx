import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <>
      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-700">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
            {/* Brand Section */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <span className="font-display text-2xl font-bold text-white">Classic Carrry</span>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">✨</span>
                </div>
              </div>
              <p className="text-gray-300 mb-6 max-w-md leading-relaxed">
                Premium caps and wallets crafted for the modern individual who values quality, style, and functionality.
              </p>
              <div className="flex space-x-4">
                <a href="https://wa.me/923160928206" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-gray-800 hover:bg-green-600 rounded-full flex items-center justify-center text-gray-400 hover:text-white transition duration-300 transform hover:scale-110">
                  <i className="fab fa-whatsapp text-xl"></i>
                </a>
                <a href="#" className="w-12 h-12 bg-gray-800 hover:bg-blue-600 rounded-full flex items-center justify-center text-gray-400 hover:text-white transition duration-300 transform hover:scale-110">
                  <i className="fab fa-facebook text-xl"></i>
                </a>
                <a href="#" className="w-12 h-12 bg-gray-800 hover:bg-pink-600 rounded-full flex items-center justify-center text-gray-400 hover:text-white transition duration-300 transform hover:scale-110">
                  <i className="fab fa-instagram text-xl"></i>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-white font-semibold mb-4 text-lg">Quick Links</h3>
              <ul className="space-y-3">
                <li>
                  <Link to="/" className="text-gray-300 hover:text-[#D2C1B6] transition duration-300 flex items-center group">
                    <i className="fas fa-chevron-right text-xs mr-2 text-[#D2C1B6] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></i>
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/caps" className="text-gray-300 hover:text-[#D2C1B6] transition duration-300 flex items-center group">
                    <i className="fas fa-chevron-right text-xs mr-2 text-[#D2C1B6] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></i>
                    Caps
                  </Link>
                </li>
                <li>
                  <Link to="/wallets" className="text-gray-300 hover:text-[#D2C1B6] transition duration-300 flex items-center group">
                    <i className="fas fa-chevron-right text-xs mr-2 text-[#D2C1B6] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></i>
                    Wallets
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="text-gray-300 hover:text-[#D2C1B6] transition duration-300 flex items-center group">
                    <i className="fas fa-chevron-right text-xs mr-2 text-[#D2C1B6] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></i>
                    About Us
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-white font-semibold mb-4 text-lg">Contact</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-center space-x-3 group hover:text-[#D2C1B6] transition duration-300">
                  <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center group-hover:bg-[#D2C1B6] group-hover:text-gray-900 transition duration-300">
                    <i className="fas fa-phone text-sm"></i>
                  </div>
                  <span>+92 316 092 8206</span>
                </li>
                <li className="flex items-center space-x-3 group hover:text-[#D2C1B6] transition duration-300">
                  <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center group-hover:bg-[#D2C1B6] group-hover:text-gray-900 transition duration-300">
                    <i className="fas fa-envelope text-sm"></i>
                  </div>
                  <span>classiccarrry@gmail.com</span>
                </li>
                <li className="flex items-center space-x-3 group hover:text-[#D2C1B6] transition duration-300">
                  <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center group-hover:bg-[#D2C1B6] group-hover:text-gray-900 transition duration-300">
                    <i className="fas fa-map-marker-alt text-sm"></i>
                  </div>
                  <span>Pakistan</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-10 pt-8 text-center">
            <p className="text-gray-400">
              &copy; {currentYear} classiccarrry. All rights reserved.
              <span className="mx-2">|</span>
              Powered by <b><a href="https://abdulsalam78976.github.io/AppCrafters" target="_blank" rel="noopener noreferrer">AppCrafters</a></b>
            </p>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp */}
      <a href="https://wa.me/923160928206" target="_blank" rel="noopener noreferrer" className="floating-whatsapp group">
        <div className="bg-green-500 hover:bg-green-600 text-white rounded-full w-12 h-12 md:w-14 md:h-14 flex items-center justify-center shadow-2xl transition transform relative">
          <i className="fab fa-whatsapp text-xl md:text-2xl"></i>
          <span className="absolute -top-10 right-0 bg-gray-800 text-white text-xs px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap shadow-xl">
            Chat with us! 💬
          </span>
        </div>
      </a>
    </>
  );
};

export default Footer;
