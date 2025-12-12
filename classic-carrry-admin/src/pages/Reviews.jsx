import { useState, useEffect } from 'react';
import { reviewAPI } from '../services/reviewAPI';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'approved', 'pending'
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchReviews();
  }, [filter, currentPage]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await reviewAPI.getAllReviews({
        page: currentPage,
        limit: 20,
        status: filter
      });
      setReviews(response.data.reviews);
      setTotalPages(response.data.pagination.totalPages);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprovalToggle = async (reviewId, currentStatus) => {
    try {
      await reviewAPI.toggleReviewApproval(reviewId, { isApproved: !currentStatus });
      fetchReviews(); // Refresh the list
    } catch (error) {
      console.error('Error toggling review approval:', error);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) {
      return;
    }

    try {
      await reviewAPI.adminDeleteReview(reviewId);
      fetchReviews(); // Refresh the list
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <i
        key={i}
        className={`fas fa-star ${
          i < rating ? 'text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Reviews Management</h1>
        
        {/* Filter Buttons */}
        <div className="flex space-x-2">
          <button
            onClick={() => {
              setFilter('all');
              setCurrentPage(1);
            }}
            className={`px-4 py-2 rounded-md font-medium ${
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All Reviews
          </button>
          <button
            onClick={() => {
              setFilter('approved');
              setCurrentPage(1);
            }}
            className={`px-4 py-2 rounded-md font-medium ${
              filter === 'approved'
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Approved
          </button>
          <button
            onClick={() => {
              setFilter('pending');
              setCurrentPage(1);
            }}
            className={`px-4 py-2 rounded-md font-medium ${
              filter === 'pending'
                ? 'bg-yellow-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Pending
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-12">
          <i className="fas fa-comment-alt text-6xl text-gray-300 mb-4"></i>
          <h3 className="text-xl font-medium text-gray-900 mb-2">No Reviews Found</h3>
          <p className="text-gray-600">
            {filter === 'pending' 
              ? 'No pending reviews to moderate.' 
              : 'No reviews available.'}
          </p>
        </div>
      ) : (
        <>
          {/* Reviews List */}
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product & User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rating & Review
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {reviews.map((review) => (
                    <tr key={review._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <img
                            src={review.product?.mainImage || '/placeholder-image.jpg'}
                            alt={review.product?.name}
                            className="h-12 w-12 rounded-lg object-cover mr-4"
                          />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {review.product?.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              by {review.user?.name} ({review.user?.email})
                            </div>
                            <div className="text-xs text-gray-400">
                              Order #{review.order?.orderNumber}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-1">
                            {renderStars(review.rating)}
                            <span className="text-sm text-gray-600 ml-2">
                              ({review.rating}/5)
                            </span>
                          </div>
                          <div className="text-sm font-medium text-gray-900">
                            {review.title}
                          </div>
                          <div className="text-sm text-gray-600 max-w-xs truncate">
                            {review.comment}
                          </div>
                          {/* Review Images */}
                          {review.images && review.images.length > 0 && (
                            <div className="flex gap-1 mt-2">
                              {review.images.slice(0, 3).map((image, index) => (
                                <img
                                  key={index}
                                  src={image}
                                  alt={`Review image ${index + 1}`}
                                  className="w-8 h-8 object-cover rounded border cursor-pointer hover:opacity-80"
                                  onClick={() => window.open(image, '_blank')}
                                />
                              ))}
                              {review.images.length > 3 && (
                                <div className="w-8 h-8 bg-gray-100 rounded border flex items-center justify-center text-xs text-gray-500">
                                  +{review.images.length - 3}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(review.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            review.isApproved
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {review.isApproved ? 'Approved' : 'Pending'}
                        </span>
                        {review.isVerified && (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 ml-2">
                            Verified
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          onClick={() => handleApprovalToggle(review._id, review.isApproved)}
                          className={`px-3 py-1 rounded text-xs font-medium ${
                            review.isApproved
                              ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                              : 'bg-green-100 text-green-800 hover:bg-green-200'
                          }`}
                        >
                          {review.isApproved ? 'Disapprove' : 'Approve'}
                        </button>
                        <button
                          onClick={() => handleDeleteReview(review._id)}
                          className="px-3 py-1 bg-red-100 text-red-800 hover:bg-red-200 rounded text-xs font-medium"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-6">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              <span className="px-4 py-2 text-sm text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Reviews;