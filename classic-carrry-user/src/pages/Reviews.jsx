import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { reviewAPI } from '../services/reviewAPI';
import { useNotification } from '../contexts/NotificationContext';
import ReviewForm from '../components/ReviewForm';
import ReviewCard from '../components/ReviewCard';
import StarRating from '../components/StarRating';
import { getImageUrl } from '../utils/imageHelper';

const Reviews = () => {
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const [activeTab, setActiveTab] = useState('write'); // 'write' or 'my-reviews'
  const [reviewableProducts, setReviewableProducts] = useState([]);
  const [userReviews, setUserReviews] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchReviewableProducts();
      if (activeTab === 'my-reviews') {
        fetchUserReviews();
      }
    }
  }, [user, activeTab]);

  const fetchReviewableProducts = async () => {
    try {
      setLoading(true);
      const response = await reviewAPI.getReviewableProducts();
      setReviewableProducts(response.data.reviewableProducts);
    } catch (error) {
      showNotification('Failed to load reviewable products', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserReviews = async () => {
    try {
      setReviewsLoading(true);
      const response = await reviewAPI.getUserReviews();
      setUserReviews(response.data.reviews);
    } catch (error) {
      showNotification('Failed to load your reviews', 'error');
    } finally {
      setReviewsLoading(false);
    }
  };

  const handleReviewSubmitted = () => {
    setSelectedProduct(null);
    fetchReviewableProducts();
    showNotification('Review submitted successfully!', 'success');
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) {
      return;
    }

    try {
      await reviewAPI.deleteReview(reviewId);
      setUserReviews(userReviews.filter(review => review._id !== reviewId));
      showNotification('Review deleted successfully', 'success');
    } catch (error) {
      showNotification('Failed to delete review', 'error');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please Login</h2>
          <p className="text-gray-600">You need to be logged in to write reviews.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Product Reviews</h1>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-8">
          <button
            onClick={() => setActiveTab('write')}
            className={`px-6 py-3 font-medium ${activeTab === 'write'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            Write Reviews
          </button>
          <button
            onClick={() => setActiveTab('my-reviews')}
            className={`px-6 py-3 font-medium ${activeTab === 'my-reviews'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            My Reviews
          </button>
        </div>

        {/* Write Reviews Tab */}
        {activeTab === 'write' && (
          <div>
            {selectedProduct ? (
              <ReviewForm
                product={selectedProduct.product}
                order={selectedProduct.order}
                onReviewSubmitted={handleReviewSubmitted}
                onCancel={() => setSelectedProduct(null)}
              />
            ) : (
              <div>
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-2 text-gray-600">Loading products...</p>
                  </div>
                ) : reviewableProducts.length === 0 ? (
                  <div className="text-center py-12">
                    <i className="fas fa-star text-6xl text-gray-300 mb-4"></i>
                    <h3 className="text-xl font-medium text-gray-900 mb-2">
                      No Products to Review
                    </h3>
                    <p className="text-gray-600">
                      You can write reviews for products from your delivered orders.
                    </p>
                  </div>
                ) : (
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                      Products Available for Review
                    </h2>
                    <div className="grid gap-4">
                      {reviewableProducts.map((item, index) => (
                        <div
                          key={index}
                          className="bg-white rounded-lg shadow-md p-6 flex items-center justify-between"
                        >
                          <div className="flex items-center gap-4">
                            <img
                              src={getImageUrl(item.product.mainImage)}
                              alt={item.product.name}
                              className="w-16 h-16 object-cover rounded"
                            />
                            <div>
                              <h3 className="font-medium text-gray-900">
                                {item.product.name}
                              </h3>
                              <p className="text-sm text-gray-500">
                                Order #{item.order.orderNumber}
                              </p>
                              <p className="text-xs text-gray-400">
                                Delivered on {new Date(item.order.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => setSelectedProduct(item)}
                            className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition"
                          >
                            Write Review
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* My Reviews Tab */}
        {activeTab === 'my-reviews' && (
          <div>
            {reviewsLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading your reviews...</p>
              </div>
            ) : userReviews.length === 0 ? (
              <div className="text-center py-12">
                <i className="fas fa-comment-alt text-6xl text-gray-300 mb-4"></i>
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  No Reviews Yet
                </h3>
                <p className="text-gray-600">
                  You haven't written any reviews yet. Start by reviewing products from your delivered orders.
                </p>
              </div>
            ) : (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Your Reviews ({userReviews.length})
                </h2>
                <div className="space-y-6">
                  {userReviews.map((review) => (
                    <div key={review._id} className="bg-white rounded-lg shadow-md p-6">
                      <div className="flex items-start gap-4 mb-4">
                        <img
                          src={getImageUrl(review.product.mainImage)}
                          alt={review.product.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">
                            {review.product.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            Order #{review.order.orderNumber}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <StarRating rating={review.rating} size="sm" readonly />
                            <span className="text-sm text-gray-500">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteReview(review._id)}
                          className="text-red-600 hover:text-red-800 transition"
                          title="Delete Review"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">
                          {review.title}
                        </h4>
                        <p className="text-gray-700 mb-3">{review.comment}</p>

                        {/* Review Images */}
                        {review.images && review.images.length > 0 && (
                          <div className="grid grid-cols-3 md:grid-cols-4 gap-2 mt-3">
                            {review.images.map((image, index) => (
                              <div key={index} className="relative group cursor-pointer">
                                <img
                                  src={image}
                                  alt={`Review image ${index + 1}`}
                                  className="w-full h-16 object-cover rounded border border-gray-200 hover:opacity-90 transition-opacity"
                                  onClick={() => window.open(image, '_blank')}
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded transition-all duration-200 flex items-center justify-center">
                                  <i className="fas fa-expand text-white opacity-0 group-hover:opacity-100 transition-opacity text-xs"></i>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Reviews;