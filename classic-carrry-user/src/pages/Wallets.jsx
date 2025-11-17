import { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import { productAPI } from '../services/api';

const Wallets = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState([
    { id: 'all', label: 'All Wallets', icon: 'fa-wallet' }
  ]);

  // Category icon mapping
  const getCategoryIcon = (category) => {
    const iconMap = {
      'male': 'fa-male',
      'female': 'fa-female',
      'long': 'fa-ruler-horizontal',
      'cardholder': 'fa-credit-card',
      'all': 'fa-wallet'
    };
    return iconMap[category] || 'fa-tag';
  };

  // Category label mapping
  const getCategoryLabel = (category) => {
    const labelMap = {
      'cardholder': 'Card Holders',
      'long': 'Long Wallets'
    };
    return labelMap[category] || category.charAt(0).toUpperCase() + category.slice(1);
  };

  // Fetch categories from backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await productAPI.getCategories('wallet');
        const dbCategories = response.data || [];
        
        // Map categories to objects with labels and icons
        const categoryObjects = dbCategories.map(cat => ({
          id: cat,
          label: getCategoryLabel(cat),
          icon: getCategoryIcon(cat)
        }));

        // Add "All" option at the beginning
        setCategories([
          { id: 'all', label: 'All Wallets', icon: 'fa-wallet' },
          ...categoryObjects
        ]);
      } catch (error) {
        console.error('Error fetching categories:', error);
        // Keep default categories if fetch fails
      }
    };

    fetchCategories();
  }, []);

  // Fetch products based on selected category
  useEffect(() => {
    const fetchWallets = async () => {
      try {
        const params = { productType: 'wallet' };
        if (selectedCategory !== 'all') {
          params.category = selectedCategory;
        }
        
        const response = await productAPI.getAll(params);
        setProducts(response.data || []);
      } catch (error) {
        console.error('Error fetching wallets:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWallets();
  }, [selectedCategory]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-4xl text-[#D2C1B6] mb-4"></i>
          <p className="text-gray-300">Loading wallets...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="relative flex items-center justify-center text-white py-16 md:py-24 overflow-hidden" style={{ minHeight: '60vh' }}>
        <div className="absolute inset-0 z-0">
          <img src="/assets/images/hero/2.webp" alt="Premium Wallets Collection" className="w-full h-full object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 via-gray-900/60 to-gray-900/80"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-gray-900/40"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="max-w-3xl mx-auto fade-in appear">
            <h1 className="font-display text-4xl md:text-6xl font-bold mb-4 md:mb-6" style={{ textShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>
              Premium Wallets Collection
            </h1>
            <p className="text-lg md:text-xl text-gray-100 opacity-95 max-w-2xl mx-auto leading-relaxed" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
              Crafted with precision and elegance. Discover wallets that blend timeless style with modern functionality for everyday sophistication.
            </p>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-14 md:py-24 bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="container mx-auto px-4">
          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-2 md:gap-3 lg:gap-4 mb-10 md:mb-16 fade-in appear">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`category-pill px-4 py-2 md:px-6 md:py-3 rounded-full font-medium text-sm md:text-base ${
                  selectedCategory === cat.id ? 'active' : ''
                }`}
              >
                <i className={`fas ${cat.icon} mr-2`}></i>
                {cat.label}
              </button>
            ))}
          </div>

          {/* Products Count */}
          <div className="text-center mb-8 fade-in appear">
            <p className="text-gray-300 text-lg">
              <span className="text-[#D2C1B6] font-semibold">{products.length}</span> premium wallets available
            </p>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {products.map(product => (
              <div key={product.id} className="fade-in appear">
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          {products.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <i className="fas fa-search text-4xl mb-4"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-300 mb-2">No products found</h3>
              <p className="text-gray-400 mb-6">Try selecting a different category.</p>
              <button
                onClick={() => setSelectedCategory('all')}
                className="bg-[#D2C1B6] text-gray-900 px-6 py-2 rounded-lg font-medium hover:bg-[#e2c9b8] transition-all duration-200"
              >
                View All Products
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Wallets;
