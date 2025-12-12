# Rating and Review System

This document describes the rating and review system implemented for the Classic Carrry e-commerce platform.

## Features

### User Features
- **Write Reviews**: Users can rate and review products from their delivered orders
- **Review Images**: Users can upload up to 5 images per review (JPG, PNG, WebP, max 5MB each)
- **View Reviews**: All users can view product reviews and ratings with images
- **Image Gallery**: Click on review images to view in full-screen modal with navigation
- **Rating Display**: Product cards show average rating and review count
- **Review Management**: Users can view, edit, and delete their own reviews

### Admin Features
- **Review Moderation**: Approve or disapprove reviews with image preview
- **Review Management**: View all reviews with filtering options and image thumbnails
- **Review Analytics**: See rating distribution and statistics
- **Image Management**: View review images in admin panel with click-to-expand

## Implementation Details

### Backend

#### Models
- **Review Model** (`backend/models/Review.js`): Stores review data with user, product, and order references
- **Product Model Updates**: Added rating fields (averageRating, totalReviews, ratingDistribution)

#### API Endpoints
- `POST /api/reviews` - Create a new review (with images)
- `GET /api/reviews/product/:productId` - Get reviews for a product
- `GET /api/reviews/user/reviews` - Get user's reviews
- `GET /api/reviews/user/reviewable` - Get products available for review
- `PUT /api/reviews/:reviewId` - Update a review (with images)
- `DELETE /api/reviews/:reviewId` - Delete a review
- `POST /api/upload/review` - Upload review images (max 5 images, 5MB each)
- `GET /api/reviews/admin/all` - Admin: Get all reviews
- `PUT /api/reviews/admin/:reviewId/approval` - Admin: Toggle review approval
- `DELETE /api/reviews/admin/:reviewId` - Admin: Delete review

#### Business Logic
- Users can only review products from their delivered orders
- One review per product per order
- Reviews are auto-approved but can be moderated by admins
- Product ratings are automatically calculated and cached

### Frontend

#### User Panel Components
- **StarRating**: Reusable star rating component
- **ReviewForm**: Form for writing reviews with image upload
- **ReviewCard**: Display component for individual reviews with image gallery
- **ImageModal**: Full-screen image viewer with navigation
- **Reviews Page**: Main page for managing user reviews with image display
- **ProductDetail Updates**: Shows ratings and reviews in tabbed interface

#### Admin Panel Components
- **Reviews Management**: Admin interface for moderating reviews
- **Review Statistics**: Display review metrics and filtering

## Usage

### For Users
1. Complete an order and wait for delivery
2. Navigate to "My Reviews" from the profile menu
3. Select a product to review from delivered orders
4. Rate the product (1-5 stars) and write a review
5. Submit the review

### For Admins
1. Access the admin panel
2. Navigate to "Reviews" in the sidebar
3. View all reviews with filtering options (All, Approved, Pending)
4. Approve/disapprove or delete reviews as needed

## Database Schema

### Review Schema
```javascript
{
  user: ObjectId (ref: User),
  product: ObjectId (ref: Product),
  order: ObjectId (ref: Order),
  rating: Number (1-5),
  title: String,
  comment: String,
  images: [String], // Array of image URLs
  isVerified: Boolean,
  isApproved: Boolean,
  helpfulVotes: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Product Rating Fields
```javascript
{
  averageRating: Number (0-5),
  totalReviews: Number,
  ratingDistribution: {
    1: Number,
    2: Number,
    3: Number,
    4: Number,
    5: Number
  }
}
```

## Security Features
- Authentication required for writing reviews
- Users can only review their own orders
- Order must be in "delivered" status
- Duplicate review prevention
- Admin-only moderation endpoints

## Performance Considerations
- Product ratings are cached in the Product model
- Pagination for review lists
- Efficient database queries with proper indexing
- Automatic rating recalculation on review changes

## Image Upload Features
- **File Types**: JPG, PNG, WebP supported
- **File Size**: Maximum 5MB per image
- **Image Limit**: Up to 5 images per review
- **Storage**: Images stored on Cloudinary
- **Validation**: Client and server-side validation
- **Preview**: Real-time image preview during upload
- **Gallery**: Full-screen modal viewer with navigation

## Future Enhancements
- Review helpfulness voting
- Review response from sellers
- Advanced review filtering and sorting
- Review analytics dashboard
- Email notifications for new reviews
- Image compression and optimization
- Video reviews support