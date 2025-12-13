import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productAPI } from '../services/api';
import { categoryAPI } from '../services/categoryAPI';
import { useNotification } from '../contexts/NotificationContext';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const { showNotification } = useNotification();

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, [filter]);

  const fetchCategories = async () => {
    try {
      const response = await categoryAPI.getAll({ showAll: 'true' });
      setCategories(response.data || []);
    } catch (error) {
      showNotification('Failed to fetch categories', 'error');
    }
  };

  const fetchProducts = async () => {
    try {
      const params = { showAll: 'true' };
      if (filter !== 'all') {
        params.category = filter;
      }
      const response = await productAPI.getAll(params);
      setProducts(response.data || []);
    } catch (error) {
      showNotification('Failed to fetch products', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (product) => {
    try {
      await productAPI.update(product.id, {
        ...product,
        isActive: !product.isActive
      });
      showNotification(
        `Product ${!product.isActive ? 'activated' : 'deactivated'} successfully`,
        'success'
      );
      fetchProducts();
    } catch (error) {
      showNotification('Failed to update product status', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      await productAPI.delete(id);
      showNotification('Product deleted successfully', 'success');
      fetchProducts();
    } catch (error) {
      showNotification('Failed to delete product', 'error');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-100px)]">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2 font-display">Products</h1>
          <p className="text-gray-400">Manage your product catalog</p>
        </div>
        <Link
          to="/products/new"
          className="bg-[#D2C1B6] hover:bg-[#C4B5A8] text-slate-900 px-6 py-3 rounded-xl font-bold transition-all duration-300 flex items-center gap-2 shadow-sm"
        >
          <i className="fas fa-plus"></i>
          <span>Add Product</span>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <button
          onClick={() => setFilter('all')}
          className={`px-5 py-2.5 rounded-xl font-medium transition-all duration-300 border ${filter === 'all'
            ? 'bg-primary/20 border-primary text-white shadow-[0_0_15px_rgba(210,193,182,0.3)]'
            : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:border-white/20'
            }`}
        >
          All Products
        </button>
        {categories.map((category) => (
          <button
            key={category._id}
            onClick={() => setFilter(category._id)}
            className={`px-5 py-2.5 rounded-xl font-medium transition-all duration-300 border ${filter === category._id
              ? 'bg-primary/20 border-primary text-white shadow-[0_0_15px_rgba(210,193,182,0.3)]'
              : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:border-white/20'
              }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="glass-panel rounded-2xl overflow-hidden p-1">
        {products.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-box-open text-4xl text-gray-600"></i>
            </div>
            <p className="text-gray-400 text-lg">No products found</p>
            <p className="text-gray-600 text-sm mt-2">Try adjusting your filters or add a new product</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead className="bg-black/20 text-left">
                <tr>
                  <th className="py-4 px-6 text-gray-400 font-semibold text-xs uppercase tracking-wider">Product</th>
                  <th className="py-4 px-6 text-gray-400 font-semibold text-xs uppercase tracking-wider">Category</th>
                  <th className="py-4 px-6 text-gray-400 font-semibold text-xs uppercase tracking-wider">Price</th>
                  <th className="py-4 px-6 text-gray-400 font-semibold text-xs uppercase tracking-wider">Stock</th>
                  <th className="py-4 px-6 text-gray-400 font-semibold text-xs uppercase tracking-wider">Status</th>
                  <th className="py-4 px-6 text-gray-400 font-semibold text-xs uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {products.map((product) => (
                  <tr key={product._id} className="table-row-hover group">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg overflow-hidden relative shadow-lg group-hover:shadow-primary/20 transition-all duration-300 group-hover:scale-105">
                          <img
                            src={product.mainImage}
                            alt={product.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = '/placeholder.jpg';
                            }}
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="text-white font-medium truncate group-hover:text-primary transition-colors">{product.name}</p>
                          <p className="text-gray-500 text-xs truncate">ID: {product.id.substring(product.id.length - 6)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-gray-300 text-sm bg-white/5 px-3 py-1 rounded-full border border-white/5">
                        {product.categoryName || product.category?.name || 'N/A'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-mono text-primary font-bold">
                        Rs {product.price.toLocaleString()}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-300">
                      {product.stock}
                    </td>
                    <td className="py-4 px-6">
                      <button
                        onClick={() => handleToggleStatus(product)}
                        className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-lg ${product.isActive
                          ? 'bg-green-500/20 text-green-400 border border-green-500/20 hover:bg-green-500/30 shadow-green-500/10'
                          : 'bg-red-500/20 text-red-400 border border-red-500/20 hover:bg-red-500/30 shadow-red-500/10'
                          }`}
                      >
                        {product.isActive ? 'Active' : 'Hidden'}
                      </button>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/products/edit/${product._id}`}
                          className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white transition-all flex items-center justify-center border border-blue-500/20"
                          title="Edit Product"
                        >
                          <i className="fas fa-edit"></i>
                        </Link>
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="w-8 h-8 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center border border-red-500/20"
                          title="Delete Product"
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
        )}
      </div>
    </div>
  );
};

export default Products;
