import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="bg-gray-900 min-h-screen flex items-center justify-center py-12 px-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* 404 Icon */}
        <div className="mb-8">
          <div className="text-9xl font-bold text-[#D2C1B6] mb-4 font-display">404</div>
          <div className="w-24 h-24 bg-gradient-to-br from-gray-700 to-gray-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <i className="fas fa-search text-4xl text-gray-400"></i>
          </div>
        </div>

        {/* Message */}
        <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-6">
          Page Not Found
        </h1>
        
        <p className="text-xl text-gray-300 mb-8 leading-relaxed">
          Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="bg-[#D2C1B6] text-gray-900 px-8 py-4 rounded-xl font-bold hover:bg-[#e2c9b8] transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            <i className="fas fa-home mr-2"></i>
            Back to Home
          </Link>
          <Link
            to="/caps"
            className="bg-gray-700 text-gray-200 px-8 py-4 rounded-xl font-bold hover:bg-gray-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            <i className="fas fa-shopping-bag mr-2"></i>
            Shop Caps
          </Link>
        </div>

        {/* Quick Links */}
        <div className="mt-12 pt-8 border-t border-gray-700">
          <p className="text-gray-400 mb-4">You might be looking for:</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/wallets" className="text-[#D2C1B6] hover:text-white transition-colors">
              Wallets
            </Link>
            <span className="text-gray-600">•</span>
            <Link to="/about" className="text-[#D2C1B6] hover:text-white transition-colors">
              About Us
            </Link>
            <span className="text-gray-600">•</span>
            <Link to="/checkout" className="text-[#D2C1B6] hover:text-white transition-colors">
              Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
