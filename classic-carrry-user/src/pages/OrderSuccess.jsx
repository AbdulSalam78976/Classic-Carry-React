import { Link } from 'react-router-dom';

const OrderSuccess = () => {
  return (
    <div className="bg-gray-900 min-h-screen py-12 md:py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          {/* Success Icon */}
          <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-green-700 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl">
            <i className="fas fa-check text-white text-4xl"></i>
          </div>

          {/* Success Message */}
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-6">
            Order Placed Successfully!
          </h1>

          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            Thank you for choosing Classic Carrry! Your order has been received and is being processed.
          </p>

          {/* Order Details Card */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 mb-8 border border-gray-700 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center justify-center gap-3">
              <i className="fas fa-receipt text-[#D2C1B6]"></i>
              What Happens Next?
            </h2>

            <div className="space-y-6">
              <div className="flex items-start gap-4 text-left">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white font-bold text-sm">1</span>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-2">Email Confirmation</h3>
                  <p className="text-gray-300 text-sm">
                    You'll receive an order confirmation email with all the details within a few minutes.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 text-left">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white font-bold text-sm">2</span>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-2">Order Processing</h3>
                  <p className="text-gray-300 text-sm">
                    Our team will review and prepare your order for shipment within 1-2 business days.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 text-left">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-700 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white font-bold text-sm">3</span>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-2">Delivery</h3>
                  <p className="text-gray-300 text-sm">
                    Your order will be delivered to your specified address within 3-5 business days.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-gradient-to-r from-gray-700/50 to-gray-600/50 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-white mb-4">Need Help?</h3>
            <p className="text-gray-300 text-sm mb-4">
              If you have any questions about your order, feel free to contact us:
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:classiccarrry@gmail.com"
                className="flex items-center gap-2 text-[#D2C1B6] hover:text-white transition-colors"
              >
                <i className="fas fa-envelope"></i>
                <span>classiccarrry@gmail.com</span>
              </a>
              <a
                href="tel:+923160928206"
                className="flex items-center gap-2 text-[#D2C1B6] hover:text-white transition-colors"
              >
                <i className="fas fa-phone"></i>
                <span>+92 316 092 8206</span>
              </a>
            </div>
          </div>

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
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
