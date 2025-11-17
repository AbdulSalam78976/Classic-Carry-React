import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productAPI } from '../services/api';
import { useNotification } from '../contexts/NotificationContext';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const { showNotification } = useNotification();

  useEffect(() => {
    fetchProducts();
  }, [filter]);

  const fetchProducts = async () => {
    try {
      const params = filter !== 'all' ? { productType: filter } : {};
      const response = await productAPI.getAll(params);
      setProducts(response.data || []);
    } catch (error) {
      showNotification('Failed to fetch products', 'error');
    } finally {
      setLoading(false);
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
      <div className="flex items-center justify-center h-96">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Products</h1>
          <p className="text-gray-400">Manage your product catalog</p>
        </div>
        <Link
          to="/products/new"
          className="bg-[#D2C1B6] text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-[#e2c9b8] transition flex items-center gap-2"
        >
          <i className="fas fa-plus"></i>
          <span>Add Product</span>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        {['all', 'cap', 'wallet'].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-6 py-2 rounded-lg font-medium transition ${
              filter === type
                ? 'bg-[#D2C1B6] text-gray-900'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            {type === 'all' ? 'All Products' : type === 'cap' ? 'Caps' : 'Wallets'}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        {products.length === 0 ? (
          <div className="text-center py-12">
            <i className="fas fa-box-open text-4xl text-gray-600 mb-4"></i>
            <p className="text-gray-400">No products found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900">
                <tr>
                  <th className="text-left py-4 px-6 text-gray-400 font-semibold">Product</th>
                  <th className="text-left py-4 px-6 text-gray-400 font-semibold">Category</th>
                  <th className="text-left py-4 px-6 text-gray-400 font-semibold">Price</th>
                  <th className="text-left py-4 px-6 text-gray-400 font-semibold">Stock</th>
                  <th className="text-left py-4 px-6 text-gray-400 font-semibold">Status</th>
                  <th className="text-right py-4 px-6 text-gray-400 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id} className="border-t border-gray-700 hover:bg-gray-700/30 transition">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.mainImage}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                        <div>
                          <p className="text-white font-medium">{product.name}</p>
                          <p className="text-gray-400 text-sm">{product.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-300">{product.category}</td>
                    <td className="py-4 px-6 text-[#D2C1B6] font-semibold">Rs {product.price.toLocaleString()}</td>
                    <td className="py-4 px-6 text-gray-300">{product.stock}</td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        product.isActive
                          ? 'bg-green-600/20 text-green-400'
                          : 'bg-red-600/20 text-red-400'
                      }`}>
                        {product.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/products/edit/${product.id}`}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg transition"
                        >
                          <i className="fas fa-edit"></i>
                        </Link>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg transition"
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
