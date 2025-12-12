import { useState } from 'react';
import StarRating from './StarRating';
import { useNotification } from '../contexts/NotificationContext';
import { reviewAPI } from '../services/reviewAPI';
import { uploadAPI } from '../services/api';

const ReviewForm = ({ product, order, onReviewSubmitted, onCancel }) => {
  const [formData, setFormData] = useState({
    rating: 0,
    title: '',
    comment: '',
    images: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const { showNotification } = useNotification();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.rating === 0) {
      showNotification('Please select a rating', 'error');
      return;
    }

    if (!formData.title.trim()) {
      showNotification('Please enter a review title', 'error');
      return;
    }

    if (!formData.comment.trim()) {
      showNotification('Please enter a review comment', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      await reviewAPI.createReview({
        productId: product.id,
        orderId: order._id,
        rating: formData.rating,
        title: formData.title.trim(),
        comment: formData.comment.trim(),
        images: formData.images
      });

      showNotification('Review submitted successfully!', 'success');
      onReviewSubmitted();
    } catch (error) {
      showNotification(
        error.response?.data?.message || 'Failed to submit review',
        'error'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = async (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    // Validate file count (max 5 images)
    if (formData.images.length + files.length > 5) {
      showNotification('You can upload maximum 5 images per review', 'error');
      return;
    }

    // Validate file types and sizes
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    for (const file of files) {
      if (!validTypes.includes(file.type)) {
        showNotification('Please upload only JPG, PNG, or WebP images', 'error');
        return;
      }
      if (file.size > maxSize) {
        showNotification('Each image must be less than 5MB', 'error');
        return;
      }
    }

    setUploadingImages(true);

    try {
      const formDataUpload = new FormData();
      files.forEach(file => {
        formDataUpload.append('images', file);
      });

      const response = await uploadAPI.uploadReviewImages(formDataUpload);
      const uploadedImages = response.data.images.map(img => img.url);

      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...uploadedImages]
      }));

      showNotification(`${files.length} image(s) uploaded successfully`, 'success');
    } catch (error) {
      showNotification(
        error.response?.data?.message || 'Failed to upload images',
        'error'
      );
    } finally {
      setUploadingImages(false);
      // Reset file input
      event.target.value = '';
    }
  };

  const removeImage = (indexToRemove) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove)
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-4 mb-6">
        <img
          src={product.mainImage}
          alt={product.name}
          className="w-16 h-16 object-cover rounded"
        />
        <div>
          <h3 className="font-medium text-gray-900">{product.name}</h3>
          <p className="text-sm text-gray-500">Order #{order.orderNumber}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rating *
          </label>
          <StarRating
            rating={formData.rating}
            onRatingChange={(rating) => setFormData({ ...formData, rating })}
            size="lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Review Title *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B7355]"
            placeholder="Summarize your experience"
            maxLength={100}
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            {formData.title.length}/100 characters
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Review Comment *
          </label>
          <textarea
            value={formData.comment}
            onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B7355]"
            rows={4}
            placeholder="Share your detailed experience with this product"
            maxLength={1000}
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            {formData.comment.length}/1000 characters
          </p>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Add Photos (Optional)
          </label>
          <div className="space-y-3">
            {/* Upload Button */}
            <div className="flex items-center gap-3">
              <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 border-2 border-dashed border-gray-300 rounded-lg px-4 py-3 flex items-center gap-2 transition-colors">
                <i className="fas fa-camera text-gray-500"></i>
                <span className="text-sm text-gray-600">
                  {uploadingImages ? 'Uploading...' : 'Add Photos'}
                </span>
                <input
                  type="file"
                  multiple
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={uploadingImages || formData.images.length >= 5}
                />
              </label>
              <span className="text-xs text-gray-500">
                {formData.images.length}/5 photos
              </span>
            </div>

            {/* Image Preview */}
            {formData.images.length > 0 && (
              <div className="grid grid-cols-3 gap-3">
                {formData.images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image}
                      alt={`Review image ${index + 1}`}
                      className="w-full h-20 object-cover rounded-lg border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            <p className="text-xs text-gray-500">
              Upload up to 5 photos (JPG, PNG, WebP). Max 5MB per image.
            </p>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-[#8B7355] text-white py-2 px-4 rounded-md hover:bg-[#6B5744] transition disabled:opacity-50"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;