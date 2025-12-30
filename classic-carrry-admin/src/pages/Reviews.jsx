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
      setReviews(response.reviews);
      setTotalPages(response.pagination.totalPages);
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
    });
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <i
        key={i}
        className={`fas fa-star text-sm ${i < rating ? 'text-yellow-400 drop-shadow-[0_0_5px_rgba(250,204,21,0.5)]' : 'text-gray-700'
          }`}
      />
    ));
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2 font-display">Reviews</h1>
          <p className="text-gray-400">Moderate customer reviews and ratings</p>
        </div>

        {/* Filter Buttons */}
        <div className="glass-panel p-1.5 rounded-xl inline-flex gap-1">
          {['all', 'approved', 'pending'].map((status) => (
            <button
              key={status}
              onClick={() => {
                setFilter(status);
                setCurrentPage(1);
              }}
              className={`px-5 py-2.5 rounded-lg font-bold text-sm transition-all duration-300 capitalize ${filter === status
                ? 'bg-primary text-slate-900 shadow-lg shadow-primary/20'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
            >
              {status === 'all' ? 'All Reviews' : status}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-[calc(100vh-200px)]">
          <div className="spinner"></div>
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-24 glass-panel rounded-2xl border-dashed border-white/10">
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
            <i className="fas fa-star text-4xl text-gray-600"></i>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No Reviews Found</h3>
          <p className="text-gray-500">
            {filter === 'pending'
              ? 'Great job! No pending reviews to moderate.'
              : 'There are no reviews matching your criteria.'}
          </p>
        </div>
      ) : (
        <>
          {/* Reviews List */}
          <div className="glass-panel rounded-2xl overflow-hidden p-1">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-black/20">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Review
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {reviews.map((review) => (
                    <tr key={review._id} className="table-row-hover group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg overflow-hidden border border-white/10 bg-white/5 flex-shrink-0">
                            <img
                              src={review.product?.mainImage || '/placeholder.jpg'}
                              alt={review.product?.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="max-w-[150px]">
                            <p className="text-sm font-bold text-white truncate text-ellipsis">{review.product?.name}</p>
                            <p className="text-xs text-primary mt-1">Order #{review.order?.orderNumber}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-gray-200">{review.user?.name}</p>
                        <p className="text-xs text-gray-500 font-mono">{review.user?.email}</p>
                        {review.isVerified && (
                          <span className="inline-flex items-center gap-1 mt-1 px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 text-[10px] font-bold border border-blue-500/20">
                            <i className="fas fa-check-circle text-[9px]"></i> Verified Buyer
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 w-1/3">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <div className="flex">{renderStars(review.rating)}</div>
                            <span className="text-xs font-bold text-gray-500">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </span>
                          </div>

                          {review.title && <p className="text-sm font-bold text-white">{review.title}</p>}
                          <p className="text-sm text-gray-400 leading-relaxed max-h-20 overflow-y-auto custom-scrollbar">
                            "{review.comment}"
                          </p>

                          {/* Review Images */}
                          {review.images && review.images.length > 0 && (
                            <div className="flex gap-2 mt-2">
                              {review.images.slice(0, 3).map((image, index) => (
                                <a key={index} href={image} target="_blank" rel="noopener noreferrer" className="block w-10 h-10 rounded-lg overflow-hidden border border-white/10 hover:border-primary transition-colors">
                                  <img
                                    src={image}
                                    alt="Review attachment"
                                    className="w-full h-full object-cover"
                                  />
                                </a>
                              ))}
                              {review.images.length > 3 && (
                                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-xs font-bold text-white border border-white/10">
                                  +{review.images.length - 3}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full border ${review.isApproved
                            ? 'bg-green-500/20 text-green-400 border-green-500/20 shadow-green-500/10'
                            : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/20 shadow-yellow-500/10'
                            }`}
                        >
                          {review.isApproved ? 'Live' : 'Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleApprovalToggle(review._id, review.isApproved)}
                            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${review.isApproved
                              ? 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500 hover:text-slate-900 border border-yellow-500/20'
                              : 'bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white border border-green-500/20'
                              }`}
                            title={review.isApproved ? "Disapprove" : "Approve"}
                          >
                            <i className={`fas ${review.isApproved ? 'fa-ban' : 'fa-check'}`}></i>
                          </button>
                          <button
                            onClick={() => handleDeleteReview(review._id)}
                            className="w-8 h-8 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center border border-red-500/20"
                            title="Delete Review"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-8">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="w-10 h-10 rounded-xl glass-card flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition disabled:opacity-30 disabled:hover:bg-transparent"
              >
                <i className="fas fa-chevron-left"></i>
              </button>

              <div className="px-4 py-2 glass-panel rounded-xl text-sm font-bold text-gray-300">
                Page <span className="text-white">{currentPage}</span> of {totalPages}
              </div>

              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="w-10 h-10 rounded-xl glass-card flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition disabled:opacity-30 disabled:hover:bg-transparent"
              >
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Reviews;