import express from 'express';
import { upload, cloudinary, uploadToCloudinary } from '../config/cloudinary.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Upload single product image
router.post('/product', protect, admin, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    // Upload to Cloudinary using our custom function
    const result = await uploadToCloudinary(req.file.buffer, {
      folder: 'classic-carrry/products'
    });

    res.json({
      success: true,
      message: 'Image uploaded successfully',
      data: {
        url: result.secure_url,
        publicId: result.public_id
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Upload multiple product images
router.post('/products', protect, admin, upload.array('images', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded'
      });
    }

    // Upload all images to Cloudinary
    const uploadPromises = req.files.map(file => 
      uploadToCloudinary(file.buffer, {
        folder: 'classic-carrry/products'
      })
    );

    const results = await Promise.all(uploadPromises);
    const images = results.map(result => ({
      url: result.secure_url,
      publicId: result.public_id
    }));
    
    res.json({
      success: true,
      message: 'Images uploaded successfully',
      data: {
        images,
        count: images.length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Upload category image
router.post('/category', protect, admin, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    // Upload to Cloudinary using our custom function
    const result = await uploadToCloudinary(req.file.buffer, {
      folder: 'classic-carrry/categories'
    });

    res.json({
      success: true,
      message: 'Category image uploaded successfully',
      data: {
        url: result.secure_url,
        publicId: result.public_id
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Upload hero image
router.post('/hero', protect, admin, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    // Upload to Cloudinary using our custom function
    const result = await uploadToCloudinary(req.file.buffer, {
      folder: 'classic-carrry/hero'
    });

    res.json({
      success: true,
      message: 'Hero image uploaded successfully',
      data: {
        url: result.secure_url,
        publicId: result.public_id
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Upload logo image
router.post('/logo', protect, admin, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    // Upload to Cloudinary using our custom function
    const result = await uploadToCloudinary(req.file.buffer, {
      folder: 'classic-carrry/logos'
    });

    res.json({
      success: true,
      message: 'Logo uploaded successfully',
      imageUrl: result.secure_url,
      data: {
        url: result.secure_url,
        publicId: result.public_id
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Upload review images (for authenticated users)
router.post('/review', protect, upload.array('images', 5), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded'
      });
    }

    // Upload all images to Cloudinary
    const uploadPromises = req.files.map(file => 
      uploadToCloudinary(file.buffer, {
        folder: 'classic-carrry/reviews'
      })
    );

    const results = await Promise.all(uploadPromises);
    const images = results.map(result => ({
      url: result.secure_url,
      publicId: result.public_id
    }));
    
    res.json({
      success: true,
      message: 'Review images uploaded successfully',
      data: {
        images,
        count: images.length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Delete image from Cloudinary
router.delete('/:publicId', protect, admin, async (req, res) => {
  try {
    const { publicId } = req.params;
    
    // Decode the publicId (it might be URL encoded)
    const decodedPublicId = decodeURIComponent(publicId);
    
    const result = await cloudinary.uploader.destroy(decodedPublicId);
    
    if (result.result === 'ok') {
      res.json({
        success: true,
        message: 'Image deleted successfully'
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Image not found or already deleted'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

export default router;
