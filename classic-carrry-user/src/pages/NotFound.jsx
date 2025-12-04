import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center py-12 px-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* 404 */}
        <div className="mb-8">
          <div className="text-[120px] md:text-[180px] font-bold text-[#8B7355] leading-none">
            404
          </div>
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mt-6">
            <i className="fas fa-search text-3xl text-gray-400"></i>
          </div>
        </div>

        {/* Message */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Page Not Found
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link
            to="/"
            className="bg-[#8B7355] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#6B5744] transition-colors flex items-center justify-center gap-2"
          >
            <i className="fas fa-home"></i>
            <span>Back to Home</span>
          </Link>
          <Link
            to="/products"
            className="bg-white border-2 border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:border-[#8B7355] hover:text-[#8B7355] transition-colors flex items-center justify-center gap-2"
          >
            <i className="fas fa-shopping-bag"></i>
            <span>Shop Products</span>
          </Link>
        </div>

        {/* Quick Links */}
        <div className="pt-8 border-t border-gray-200">
          <p className="text-gray-600 mb-4">Quick Links:</p>
          <div className="flex flex-wrap gap-6 justify-center text-sm">
            <Link to="/" className="text-[#8B7355] hover:underline">
              Home
            </Link>
            <Link to="/products" className="text-[#8B7355] hover:underline">
              Products
            </Link>
            <Link to="/about" className="text-[#8B7355] hover:underline">
              About Us
            </Link>
            <Link to="/profile" className="text-[#8B7355] hover:underline">
              My Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
