import { Link } from 'react-router-dom';
import { useWishlist } from '../contexts/WishlistContext';
import { useNotification } from '../contexts/NotificationContext';
import ProductCard from '../components/ProductCard';

const Wishlist = () => {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const { showNotification } = useNotification();

  const handleRemove = (productId) => {
    const result = removeFromWishlist(productId);
    if (result.success) {
      showNotification(result.message, 'success');
    }
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear your wishlist?')) {
      const result = clearWishlist();
      if (result.success) {
        showNotification(result.message, 'success');
      }
    }
  };

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              My Wishlist
            </h1>
            <p className="text-gray-600">
              {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} in your wishlist
            </p>
          </div>
          
          {wishlist.length > 0 && (
            <button
              onClick={handleClearAll}
              className="text-red-600 hover:text-red-700 transition text-sm font-medium"
            >
              <i className="fas fa-trash mr-2"></i>
              Clear All
            </button>
          )}
        </div>

        {/* Wishlist Items */}
        {wishlist.length === 0 ? (
          <div className="text-center py-16">
            <i className="far fa-heart text-6xl text-gray-300 mb-4"></i>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your wishlist is empty</h2>
            <p className="text-gray-600 mb-6">
              Start adding products you love to your wishlist
            </p>
            <Link
              to="/"
              className="inline-block bg-[#8B7355] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#6B5744] transition"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
            {wishlist.map((product) => (
              <div key={product._id || product.id} className="relative">
                {/* Remove Button */}
                <button
                  onClick={() => handleRemove(product._id || product.id)}
                  className="absolute top-2 right-2 z-20 w-8 h-8 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition shadow-lg"
                  title="Remove from wishlist"
                >
                  <i className="fas fa-times text-white text-xs"></i>
                </button>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
