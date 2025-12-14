import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { categoryAPI } from '../services/categoryAPI';
import { useNotification } from '../contexts/NotificationContext';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('categories'); // 'categories' or 'subcategories'
  const { showNotification } = useNotification();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      // Fetch parent categories
      const parentResponse = await categoryAPI.getAll({ showAll: 'true', onlyParents: 'true' });
      setCategories(parentResponse.data || []);

      // Fetch all subcategories
      const allResponse = await categoryAPI.getAll({ showAll: 'true' });
      const allCategories = allResponse.data || [];
      const subs = allCategories.filter(cat => cat.parentCategory);
      setSubcategories(subs);
    } catch (error) {
      showNotification('Failed to fetch categories', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (category) => {
    try {
      await categoryAPI.update(category._id, {
        ...category,
        isActive: !category.isActive
      });
      showNotification(
        `Category ${!category.isActive ? 'activated' : 'deactivated'} successfully`,
        'success'
      );
      fetchCategories();
    } catch (error) {
      showNotification('Failed to update category status', 'error');
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      await categoryAPI.delete(id);
      showNotification('Category deleted successfully', 'success');
      fetchCategories();
    } catch (error) {
      showNotification(error.message || 'Failed to delete category', 'error');
    }
  };

  const getParentCategoryName = (parentId) => {
    const parent = categories.find(cat => cat._id === parentId);
    return parent ? parent.name : 'Unknown';
  };

  const renderCategoryCard = (category, isSubcategory = false) => (
    <div
      key={category._id}
      className="glass-card overflow-hidden group hover:-translate-y-1 transition-all duration-500"
    >
      <div className="aspect-video relative overflow-hidden">
        <img
          src={category.image}
          alt={category.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          onError={(e) => {
            e.target.src = '/placeholder.jpg';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        <div className="absolute top-2 right-2">
          <button
            onClick={(e) => {
              e.preventDefault();
              handleToggleStatus(category);
            }}
            className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md shadow-lg transition-all duration-300 ${category.isActive
              ? 'bg-green-500/80 text-white hover:bg-green-500'
              : 'bg-red-500/80 text-white hover:bg-red-500'
              }`}
          >
            {category.isActive ? 'Live' : 'Hidden'}
          </button>
        </div>
      </div>

      <div className="p-5">
        <div className="mb-4">
          <h3 className="text-white font-bold text-xl mb-1 group-hover:text-primary transition-colors">{category.name}</h3>
          {isSubcategory && (
            <p className="text-primary text-xs font-semibold mb-2">
              <i className="fas fa-folder mr-1"></i>
              Parent: {getParentCategoryName(category.parentCategory)}
            </p>
          )}
          <p className="text-gray-400 text-sm line-clamp-2 h-10">
            {category.description || 'No description available'}
          </p>
          <div className="flex items-center gap-2 mt-3">
            <span className="bg-white/10 px-2 py-1 rounded text-xs text-gray-300 border border-white/5">
              Display Order: <span className="text-white font-bold">{category.displayOrder}</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-4 border-t border-white/5 transition-all duration-300 transform translate-y-0">
          <div className="flex gap-2">
            <Link
              to={`/categories/edit/${category._id}`}
              className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white transition-all flex items-center justify-center border border-blue-500/20"
              title="Edit"
            >
              <i className="fas fa-edit"></i>
            </Link>
            <button
              onClick={() => handleDelete(category._id, category.name)}
              className="w-8 h-8 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center border border-red-500/20"
              title="Delete"
            >
              <i className="fas fa-trash"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-100px)]">
        <div className="spinner"></div>
      </div>
    );
  }

  const displayItems = activeTab === 'categories' ? categories : subcategories;

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2 font-display">Categories</h1>
          <p className="text-gray-400">Organize your products with categories and subcategories</p>
        </div>
        <Link
          to="/categories/new"
          className="bg-[#D2C1B6] hover:bg-[#C4B5A8] text-slate-900 px-6 py-3 rounded-xl font-bold transition-all duration-300 flex items-center gap-2 shadow-sm"
        >
          <i className="fas fa-plus"></i>
          <span>Add Category</span>
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-white/10">
        <button
          onClick={() => setActiveTab('categories')}
          className={`px-6 py-3 font-bold transition-all duration-300 relative ${activeTab === 'categories'
              ? 'text-primary'
              : 'text-gray-400 hover:text-white'
            }`}
        >
          Main Categories
          <span className="ml-2 bg-white/10 px-2 py-0.5 rounded-full text-xs">
            {categories.length}
          </span>
          {activeTab === 'categories' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>
          )}
        </button>
        <button
          onClick={() => setActiveTab('subcategories')}
          className={`px-6 py-3 font-bold transition-all duration-300 relative ${activeTab === 'subcategories'
              ? 'text-primary'
              : 'text-gray-400 hover:text-white'
            }`}
        >
          Subcategories
          <span className="ml-2 bg-white/10 px-2 py-0.5 rounded-full text-xs">
            {subcategories.length}
          </span>
          {activeTab === 'subcategories' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>
          )}
        </button>
      </div>

      {/* Categories/Subcategories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {displayItems.map((item) => renderCategoryCard(item, activeTab === 'subcategories'))}
      </div>

      {displayItems.length === 0 && (
        <div className="text-center py-20 bg-clip-border">
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10">
            <i className="fas fa-folder-open text-4xl text-gray-600"></i>
          </div>
          <p className="text-gray-400 text-lg mb-6">
            {activeTab === 'categories' ? 'No main categories found' : 'No subcategories found'}
          </p>
          <Link
            to="/categories/new"
            className="inline-block bg-primary text-slate-900 px-6 py-2.5 rounded-xl font-bold hover:bg-primary-light transition shadow-lg shadow-primary/20"
          >
            Create First {activeTab === 'categories' ? 'Category' : 'Subcategory'}
          </Link>
        </div>
      )}
    </div>
  );
};

export default Categories;
