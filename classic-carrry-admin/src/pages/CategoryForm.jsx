import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { categoryAPI } from '../services/categoryAPI';
import { useNotification } from '../contexts/NotificationContext';

const CategoryForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    displayOrder: 1,
    isActive: true,
    parentCategory: ''
  });
  const [parentCategories, setParentCategories] = useState([]);

  useEffect(() => {
    fetchParentCategories();
    if (id) {
      fetchCategory();
    }
  }, [id]);

  const fetchParentCategories = async () => {
    try {
      const response = await categoryAPI.getAll({ showAll: 'true', onlyParents: 'true' });
      setParentCategories(response.data || []);
    } catch (error) {
      showNotification('Failed to fetch parent categories', 'error');
    }
  };

  const fetchCategory = async () => {
    try {
      const response = await categoryAPI.getById(id);
      const category = response.data;
      setFormData({
        name: category.name,
        description: category.description || '',
        image: category.image || '',
        displayOrder: category.displayOrder || 1,
        isActive: category.isActive !== false,
        parentCategory: category.parentCategory || ''
      });
    } catch (error) {
      showNotification('Failed to fetch category', 'error');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showNotification('Image size must be less than 5MB', 'error');
        return;
      }

      setLoading(true);

      try {
        const uploadFormData = new FormData();
        uploadFormData.append('image', file);

        const token = localStorage.getItem('adminToken');
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const response = await fetch(`${API_URL}/upload/category`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: uploadFormData
        });

        const data = await response.json();

        if (response.ok) {
          setFormData(prev => ({ ...prev, image: data.data.url }));
          showNotification('Image uploaded successfully', 'success');
        } else {
          showNotification(data.message || 'Failed to upload image', 'error');
        }
      } catch (error) {
        showNotification('Failed to upload image', 'error');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const categoryData = {
        ...formData,
        displayOrder: Number(formData.displayOrder),
        parentCategory: formData.parentCategory || null
      };

      if (id) {
        await categoryAPI.update(id, categoryData);
        showNotification('Category updated successfully', 'success');
      } else {
        await categoryAPI.create(categoryData);
        showNotification('Category created successfully', 'success');
      }
      navigate('/categories');
    } catch (error) {
      showNotification(error.message || 'Failed to save category', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 fade-in max-w-5xl mx-auto">
      <div className="flex items-center gap-6">
        <button
          onClick={() => navigate('/categories')}
          className="w-12 h-12 rounded-xl glass-card flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-300 group"
        >
          <i className="fas fa-arrow-left text-xl group-hover:-translate-x-1 transition-transform"></i>
        </button>
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 font-display">
            {id ? 'Edit Category' : 'Add New Category'}
          </h1>
          <p className="text-gray-400">
            {id ? 'Update category information' : 'Create a new product category'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="glass-panel p-8 rounded-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left Column - Image */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-3 uppercase tracking-wider">
                Category Image
              </label>
              <div className="relative group">
                <div className={`aspect-video rounded-xl border-2 border-dashed border-white/20 flex flex-col items-center justify-center overflow-hidden transition-all duration-300 ${!formData.image && 'hover:border-primary hover:bg-white/5'}`}>
                  {formData.image ? (
                    <img
                      src={formData.image}
                      alt="Category preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center p-6">
                      <i className="fas fa-cloud-upload-alt text-4xl text-gray-500 mb-3 group-hover:text-primary transition-colors"></i>
                      <p className="text-sm text-gray-400">Click to upload image</p>
                      <p className="text-xs text-gray-500 mt-1">rec. 16:9 ratio</p>
                    </div>
                  )}

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    disabled={loading}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                  />

                  {loading && !formData.image && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10">
                      <div className="spinner"></div>
                    </div>
                  )}
                </div>
                {formData.image && (
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, image: '' })}
                    className="absolute top-2 right-2 bg-red-500 text-white w-8 h-8 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center shadow-lg"
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                )}
              </div>
            </div>

            <div className="glass-card p-4 rounded-xl border-white/5">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isActive"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="w-5 h-5 rounded border-gray-600 text-primary focus:ring-primary/50 cursor-pointer bg-slate-800"
                />
                <label htmlFor="isActive" className="cursor-pointer flex-1 user-select-none">
                  <span className="text-white font-bold block mb-0.5">Category Live</span>
                  <span className="text-gray-400 text-xs">
                    Visible to customers
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column - Form Data */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wider">
                Category Name *
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="glass-input w-full px-5 py-3.5"
                placeholder="e.g., Summer Caps"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wider">
                Parent Category (Optional)
              </label>
              <select
                name="parentCategory"
                value={formData.parentCategory}
                onChange={handleChange}
                className="glass-input w-full px-5 py-3.5 appearance-none"
              >
                <option value="" className="bg-slate-800 text-gray-400">None (Main Category)</option>
                {parentCategories.filter(cat => cat._id !== id).map(cat => (
                  <option key={cat._id} value={cat._id} className="bg-slate-800 text-white">{cat.name}</option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-2 pl-1">
                {formData.parentCategory ? 'This will be a subcategory' : 'This will be a main category'}
              </p>
            </div>


            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wider">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className="glass-input w-full px-5 py-3.5 resize-none"
                placeholder="Brief description of this category..."
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wider">
                Display Order
              </label>
              <input
                type="number"
                name="displayOrder"
                required
                value={formData.displayOrder}
                onChange={handleChange}
                className="glass-input w-full px-5 py-3.5"
                placeholder="1"
                min="1"
              />
              <p className="text-xs text-gray-500 mt-2 pl-1">
                Lower numbers appear first in the menu.
              </p>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-primary to-primary-dark hover:from-primary-light hover:to-primary text-slate-900 py-3.5 rounded-xl font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <i className="fas fa-save"></i>
                    <span>{id ? 'Update Category' : 'Create Category'}</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => navigate('/categories')}
                className="px-8 py-3.5 rounded-xl font-bold text-gray-300 hover:text-white hover:bg-white/5 transition-colors border border-transparent hover:border-white/10"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CategoryForm;
