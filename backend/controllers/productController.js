import Product from '../models/Product.js';

// @desc    Get all products
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
  try {
    const { category, productType, search, isFeatured, isHot, showAll } = req.query;
    const query = {};

    // Only filter by isActive if showAll is not true (for admin panel)
    if (showAll !== 'true') {
      query.isActive = true;
    }

    if (category) query.category = category;
    if (productType) query.productType = productType;
    if (isFeatured === 'true') query.isFeatured = true;
    if (isHot === 'true') query.isHot = true;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const products = await Product.find(query)
      .populate('category', 'name slug image')
      .sort({ isFeatured: -1, createdAt: -1 });
    
    res.json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get hot/featured products
// @route   GET /api/products/hot
// @access  Public
export const getHotProducts = async (req, res) => {
  try {
    const products = await Product.find({
      isActive: true,
      isHot: true
    })
    .populate('category', 'name slug image')
    .sort({ createdAt: -1 })
    .limit(12);

    res.json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get products by category slug
// @route   GET /api/products/category/:slug
// @access  Public
export const getProductsByCategory = async (req, res) => {
  try {
    const Category = (await import('../models/Category.js')).default;
    
    const category = await Category.findOne({ 
      slug: req.params.slug,
      isActive: true 
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    const products = await Product.find({
      category: category._id,
      isActive: true
    })
    .populate('category', 'name slug image')
    .sort({ isFeatured: -1, createdAt: -1 });

    res.json({
      success: true,
      count: products.length,
      category: {
        name: category.name,
        slug: category.slug,
        description: category.description,
        image: category.image
      },
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res) => {
  try {
    let product;
    
    // Check if the id is a valid MongoDB ObjectId
    const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(req.params.id);
    
    if (isValidObjectId) {
      // Try to find by MongoDB _id
      product = await Product.findById(req.params.id)
        .populate('category', 'name slug image');
    }
    
    // If not found or not a valid ObjectId, try custom id field
    if (!product) {
      product = await Product.findOne({ id: req.params.id })
        .populate('category', 'name slug image');
    }

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res) => {
  try {
    console.log('Creating product with data:', {
      name: req.body.name,
      category: req.body.category,
      hasMainImage: !!req.body.mainImage,
      imagesCount: req.body.images?.length || 0
    });

    const product = await Product.create(req.body);

    res.status(201).json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res) => {
  try {
    let product;
    
    // Check if the id is a valid MongoDB ObjectId
    const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(req.params.id);
    
    if (isValidObjectId) {
      // Try to update by MongoDB _id
      product = await Product.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
    }
    
    // If not found or not a valid ObjectId, try custom id field
    if (!product) {
      product = await Product.findOneAndUpdate(
        { id: req.params.id },
        req.body,
        { new: true, runValidators: true }
      );
    }

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res) => {
  try {
    let product;
    
    // Check if the id is a valid MongoDB ObjectId
    const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(req.params.id);
    
    if (isValidObjectId) {
      // Try to delete by MongoDB _id
      product = await Product.findByIdAndDelete(req.params.id);
    }
    
    // If not found or not a valid ObjectId, try custom id field
    if (!product) {
      product = await Product.findOneAndDelete({ id: req.params.id });
    }

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get unique categories by product type
// @route   GET /api/products/categories/:productType
// @access  Public
export const getCategories = async (req, res) => {
  try {
    const { productType } = req.params;
    
    // Validate product type
    if (!['cap', 'wallet'].includes(productType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product type. Must be "cap" or "wallet"'
      });
    }

    // Get unique categories for the product type
    const categories = await Product.distinct('category', {
      productType,
      isActive: true
    });

    res.json({
      success: true,
      count: categories.length,
      data: categories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Upload product image
// @route   POST /api/products/upload
// @access  Private/Admin
export const uploadProductImage = async (req, res) => {
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
};
