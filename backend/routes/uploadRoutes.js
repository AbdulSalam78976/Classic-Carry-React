import express from 'express';
import multer from 'multer';
import { upload } from '../config/multer.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Ensure upload directories exist
const uploadDirs = [
  path.join(__dirname, '../uploads/products'),
  path.join(__dirname, '../uploads/categories'),
  path.join(__dirname, '../uploads/hero')
];

uploadDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Upload single product image
router.post('/product', protect, admin, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const imageUrl = `/uploads/products/${req.file.filename}`;
    
    res.json({
      success: true,
      message: 'Image uploaded successfully',
      data: {
        url: imageUrl,
        filename: req.file.filename
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
router.post('/products', protect, admin, upload.array('images', 10), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded'
      });
    }

    const imageUrls = req.files.map(file => `/uploads/products/${file.filename}`);
    
    res.json({
      success: true,
      message: 'Images uploaded successfully',
      data: {
        urls: imageUrls,
        count: req.files.length
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
router.post('/category', protect, admin, (req, res, next) => {
  // Change destination for category images
  const categoryUpload = multer({
    storage: multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../uploads/categories'));
      },
      filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'category-' + uniqueSuffix + path.extname(file.originalname));
      }
    }),
    limits: {
      fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: (req, file, cb) => {
      const allowedTypes = /jpeg|jpg|png|gif|webp/;
      const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
      const mimetype = allowedTypes.test(file.mimetype);

      if (mimetype && extname) {
        return cb(null, true);
      } else {
        cb(new Error('Only image files are allowed!'));
      }
    }
  }).single('image');

  categoryUpload(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const imageUrl = `/uploads/categories/${req.file.filename}`;
    
    res.json({
      success: true,
      message: 'Category image uploaded successfully',
      data: {
        url: imageUrl,
        filename: req.file.filename
      }
    });
  });
});

// Upload hero image
router.post('/hero', protect, admin, (req, res, next) => {
  const heroUpload = multer({
    storage: multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../uploads/hero'));
      },
      filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'hero-' + uniqueSuffix + path.extname(file.originalname));
      }
    }),
    limits: {
      fileSize: 10 * 1024 * 1024 // 10MB limit for hero images
    },
    fileFilter: (req, file, cb) => {
      const allowedTypes = /jpeg|jpg|png|gif|webp/;
      const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
      const mimetype = allowedTypes.test(file.mimetype);

      if (mimetype && extname) {
        return cb(null, true);
      } else {
        cb(new Error('Only image files are allowed!'));
      }
    }
  }).single('image');

  heroUpload(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const imageUrl = `/uploads/hero/${req.file.filename}`;
    
    res.json({
      success: true,
      message: 'Hero image uploaded successfully',
      data: {
        url: imageUrl,
        filename: req.file.filename
      }
    });
  });
});

// Delete image
router.delete('/:type/:filename', protect, admin, (req, res) => {
  try {
    const { type, filename } = req.params;
    
    if (!['products', 'categories', 'hero'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid image type'
      });
    }

    const filePath = path.join(__dirname, `../uploads/${type}/${filename}`);
    
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      res.json({
        success: true,
        message: 'Image deleted successfully'
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Image not found'
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
