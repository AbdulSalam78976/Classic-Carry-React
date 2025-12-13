import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { productAPI } from '../services/api';
import { categoryAPI } from '../services/categoryAPI';
import { useNotification } from '../contexts/NotificationContext';

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const [loading, setLoading] = useState(false);
  const [uploadingMainImage, setUploadingMainImage] = useState(false);
  const [uploadingAdditionalImages, setUploadingAdditionalImages] = useState(false);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    price: '',
    stock: '',
    category: '',
    mainImage: '',
    images: [],
    description: '',
    colors: [],
    sizes: [],
    features: '',
    isHot: false,
    isActive: true
  });

  // Predefined options
  const availableColors = [
    'Black', 'White', 'Gray', 'Navy Blue', 'Light Blue', 'Blue',
    'Red', 'Maroon', 'Pink', 'Rose Gold',
    'Brown', 'Tan', 'Beige', 'Cream',
    'Green', 'Olive', 'Army Green',
    'Yellow', 'Orange', 'Purple',
    'Gold', 'Silver', 'Bronze'
  ];

  const availableSizes = [
    'XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size'
  ];

  useEffect(() => {
    fetchCategories();
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchCategories = async () => {
    try {
      const response = await categoryAPI.getAll({ showAll: 'true' });
      setCategories(response.data || []);
    } catch (error) {
      showNotification('Failed to fetch categories', 'error');
    }
  };

  const fetchProduct = async () => {
    try {
      const response = await productAPI.getById(id);
      const product = response.data;

      const categoryId = typeof product.category === 'object'
        ? product.category._id
        : product.category;

      setFormData({
        id: product.id || '',
        name: product.name,
        price: product.price,
        stock: product.stock,
        category: categoryId,
        mainImage: product.mainImage,
        images: product.images || [],
        description: product.description || '',
        colors: product.colors || [],
        sizes: product.sizes || [],
        features: product.features?.join(', ') || '',
        isHot: product.isHot || false,
        isActive: product.isActive !== false
      });
    } catch (error) {
      showNotification('Failed to fetch product', 'error');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;

    setFormData({
      ...formData,
      [name]: newValue
    });
  };

  const handleMainImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showNotification('Image size must be less than 5MB', 'error');
        return;
      }

      setUploadingMainImage(true);

      try {
        const uploadFormData = new FormData();
        uploadFormData.append('image', file);

        const token = localStorage.getItem('adminToken');
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const response = await fetch(`${API_URL}/upload/product`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: uploadFormData
        });

        const data = await response.json();

        if (response.ok) {
          setFormData(prev => ({ ...prev, mainImage: data.data.url }));
          showNotification('Image uploaded successfully', 'success');
        } else {
          showNotification(data.message || 'Failed to upload image', 'error');
        }
      } catch (error) {
        showNotification('Failed to upload image', 'error');
      } finally {
        setUploadingMainImage(false);
      }
    }
  };

  const handleAdditionalImagesChange = async (e) => {
    const files = Array.from(e.target.files);

    const oversizedFiles = files.filter(file => file.size > 5 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      showNotification('Some images are larger than 5MB', 'error');
      return;
    }

    if (files.length === 0) return;

    setUploadingAdditionalImages(true);

    try {
      const uploadFormData = new FormData();
      files.forEach(file => {
        uploadFormData.append('images', file);
      });

      const token = localStorage.getItem('adminToken');
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${API_URL}/upload/products`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: uploadFormData
      });

      const data = await response.json();

      if (response.ok) {
        const imageUrls = data.data.images.map(img => img.url);
        setFormData(prev => ({ ...prev, images: [...prev.images, ...imageUrls] }));
        showNotification(`${files.length} image(s) uploaded successfully`, 'success');
      } else {
        showNotification(data.message || 'Failed to upload images', 'error');
      }
    } catch (error) {
      showNotification('Failed to upload images', 'error');
    } finally {
      setUploadingAdditionalImages(false);
    }
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const productData = {
        id: formData.id,
        name: formData.name,
        price: Number(formData.price),
        stock: Number(formData.stock),
        category: formData.category,
        mainImage: formData.mainImage,
        images: formData.images,
        description: formData.description,
        colors: formData.colors,
        sizes: formData.sizes,
        features: formData.features.split(',').map(f => f.trim()).filter(Boolean),
        isHot: formData.isHot,
        isActive: formData.isActive
      };

      if (id) {
        await productAPI.update(id, productData);
        showNotification('Product updated successfully', 'success');
      } else {
        await productAPI.create(productData);
        showNotification('Product created successfully', 'success');
      }
      navigate('/products');
    } catch (error) {
      showNotification(error.message || 'Failed to save product', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 fade-in max-w-6xl mx-auto">
      <div className="flex items-center gap-6">
        <button
          onClick={() => navigate('/products')}
          className="w-12 h-12 rounded-xl glass-card flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-300 group"
        >
          <i className="fas fa-arrow-left text-xl group-hover:-translate-x-1 transition-transform"></i>
        </button>
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 font-display">
            {id ? 'Edit Product' : 'Add New Product'}
          </h1>
          <p className="text-gray-400">
            {id ? 'Update product information' : 'Create a new product'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left Column: Images & Meta */}
        <div className="space-y-8">
          {/* Main Image */}
          <div className="glass-panel p-6 rounded-2xl">
            <label className="block text-sm font-bold text-gray-300 mb-4 uppercase tracking-wider">
              Main Image *
            </label>
            <div className="relative group">
              <div className={`aspect-square rounded-xl border-2 border-dashed border-white/20 flex flex-col items-center justify-center overflow-hidden transition-all duration-300 ${!formData.mainImage && 'hover:border-primary hover:bg-white/5'}`}>
                {formData.mainImage ? (
                  <img
                    src={formData.mainImage}
                    alt="Product main"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center p-6">
                    <i className="fas fa-camera text-4xl text-gray-500 mb-3 group-hover:text-primary transition-colors"></i>
                    <p className="text-sm text-gray-400">Upload Main Image</p>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleMainImageChange}
                  disabled={uploadingMainImage}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                {uploadingMainImage && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <div className="spinner"></div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Gallery */}
          <div className="glass-panel p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-bold text-gray-300 uppercase tracking-wider">
                Gallery
              </label>
              <div className="relative overflow-hidden">
                <button type="button" className="text-primary text-sm font-bold hover:text-white transition-colors">
                  <i className="fas fa-plus mr-1"></i> Add Images
                </button>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleAdditionalImagesChange}
                  disabled={uploadingAdditionalImages}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {formData.images.map((img, index) => (
                <div key={index} className="relative aspect-square rounded-lg overflow-hidden group border border-white/10">
                  <img src={img} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-red-500/80 text-white w-6 h-6 rounded flex items-center justify-center transition-opacity"
                  >
                    &times;
                  </button>
                </div>
              ))}
              {uploadingAdditionalImages && (
                <div className="aspect-square rounded-lg bg-white/5 flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
              {formData.images.length === 0 && !uploadingAdditionalImages && (
                <div className="col-span-3 py-8 text-center text-gray-500 text-sm border-2 border-dashed border-white/10 rounded-lg">
                  No additional images
                </div>
              )}
            </div>
          </div>

          {/* Toggles */}
          <div className="glass-panel p-6 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="block text-white font-bold">Product Status</span>
                <span className="text-xs text-gray-400">Visible to customers</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
            <div className="border-t border-white/5 my-2"></div>
            <div className="flex items-center justify-between">
              <div>
                <span className="block text-white font-bold">Hot Product</span>
                <span className="text-xs text-gray-400">Mark as best seller</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" name="isHot" checked={formData.isHot} onChange={handleChange} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Details */}
        <div className="lg:col-span-2 space-y-8">
          <div className="glass-panel p-8 rounded-2xl space-y-6">
            <h2 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">General Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">Product ID *</label>
                <input
                  type="text"
                  name="id"
                  required
                  disabled={!!id}
                  value={formData.id}
                  onChange={handleChange}
                  className="glass-input w-full px-5 py-3.5 disabled:opacity-50"
                  placeholder="e.g. CAP-001"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">Product Name *</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="glass-input w-full px-5 py-3.5"
                  placeholder="e.g. Classic Cap"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">Category *</label>
                <select
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleChange}
                  className="glass-input w-full px-5 py-3.5 appearance-none"
                >
                  <option value="" className="bg-slate-800 text-gray-400">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat._id} value={cat._id} className="bg-slate-800 text-white">{cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">Price (Rs) *</label>
                <div className="relative">
                  <input
                    type="number"
                    name="price"
                    required
                    value={formData.price}
                    onChange={handleChange}
                    className="glass-input w-full px-5 py-3.5 pl-10"
                    placeholder="0.00"
                    min="0"
                  />
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">Rs</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">Stock *</label>
                <input
                  type="number"
                  name="stock"
                  required
                  value={formData.stock}
                  onChange={handleChange}
                  className="glass-input w-full px-5 py-3.5"
                  placeholder="0"
                  min="0"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className="glass-input w-full px-5 py-3.5 resize-none leading-relaxed"
                placeholder="Detailed product description..."
              />
            </div>
          </div>

          <div className="glass-panel p-8 rounded-2xl space-y-6">
            <h2 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">Variants & Features</h2>

            {/* Colors */}
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-3">Available Colors</label>
              <div className="flex flex-wrap gap-2">
                {availableColors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({
                        ...prev,
                        colors: prev.colors.includes(color)
                          ? prev.colors.filter(c => c !== color)
                          : [...prev.colors, color]
                      }));
                    }}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 border ${formData.colors.includes(color)
                      ? 'bg-primary/20 border-primary text-white shadow-[0_0_10px_rgba(210,193,182,0.2)]'
                      : 'bg-white/5 border-transparent text-gray-400 hover:bg-white/10'
                      }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-3">Available Sizes</label>
              <div className="flex flex-wrap gap-2">
                {availableSizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({
                        ...prev,
                        sizes: prev.sizes.includes(size)
                          ? prev.sizes.filter(s => s !== size)
                          : [...prev.sizes, size]
                      }));
                    }}
                    className={`w-12 h-12 rounded-lg text-sm font-bold transition-all duration-300 flex items-center justify-center border ${formData.sizes.includes(size)
                      ? 'bg-primary/20 border-primary text-white shadow-[0_0_10px_rgba(210,193,182,0.2)]'
                      : 'bg-white/5 border-transparent text-gray-400 hover:bg-white/10'
                      }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Features */}
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2">Features (comma-separated)</label>
              <textarea
                name="features"
                value={formData.features}
                onChange={handleChange}
                rows="3"
                className="glass-input w-full px-5 py-3.5 resize-none"
                placeholder="e.g. Waterproof, 100% Cotton, Hand-made"
              />
            </div>
          </div>

          {/* Submit Bar */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-primary to-primary-dark hover:from-primary-light hover:to-primary text-slate-900 py-4 rounded-xl font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 text-lg"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
                  <span>Saving Product...</span>
                </>
              ) : (
                <>
                  <i className="fas fa-save"></i>
                  <span>{id ? 'Update Product' : 'Create Product'}</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate('/products')}
              className="px-8 py-4 rounded-xl font-bold text-gray-300 hover:text-white hover:bg-white/5 transition-colors border border-white/5 hover:border-white/20"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
