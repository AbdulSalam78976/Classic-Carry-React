import { useState } from 'react';
import StarRating from './StarRating';
import ImageModal from './ImageModal';

const ReviewCard = ({ review }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const openImageModal = (index) => {
    setSelectedImageIndex(index);
    setModalOpen(true);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-medium text-gray-900">{review.user?.name || 'Anonymous'}</h4>
            {review.isVerified && (
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                Verified Purchase
              </span>
            )}
          </div>
          <StarRating rating={review.rating} size="sm" readonly />
        </div>
        <span className="text-sm text-gray-500">
          {formatDate(review.createdAt)}
        </span>
      </div>

      <h5 className="font-medium text-gray-900 mb-2">{review.title}</h5>
      <p className="text-gray-700 leading-relaxed mb-3">{review.comment}</p>
      
      {/* Review Images */}
      {review.images && review.images.length > 0 && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-3">
            {review.images.map((image, index) => (
              <div key={index} className="relative group cursor-pointer">
                <img
                  src={image}
                  alt={`Review image ${index + 1}`}
                  className="w-full h-20 object-cover rounded-lg border border-gray-200 hover:opacity-90 transition-opacity"
                  onClick={() => openImageModal(index)}
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-lg transition-all duration-200 flex items-center justify-center">
                  <i className="fas fa-expand text-white opacity-0 group-hover:opacity-100 transition-opacity"></i>
                </div>
              </div>
            ))}
          </div>
          
          <ImageModal
            images={review.images}
            initialIndex={selectedImageIndex}
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
          />
        </>
      )}

      {review.helpfulVotes > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <span className="text-sm text-gray-500">
            {review.helpfulVotes} people found this helpful
          </span>
        </div>
      )}
    </div>
  );
};

export default ReviewCard;