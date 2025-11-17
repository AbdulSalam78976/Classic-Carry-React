import { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import { productAPI } from '../services/api';

const Caps = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState([
    { id: 'all', label: 'All Caps', icon: 'fa-layer-group' }
  ]);

  // Category icon mapping
  const getCategoryIcon = (category) => {
    const iconMap = {
      'summer': 'fa-sun',
      'winter': 'fa-snowflake',
      'male': 'fa-male',
      'female': 'fa-female',
      'sports': 'fa-running',
      'all': 'fa-layer-group'
    };
    return iconMap[category] || 'fa-tag';
  };

  // Fetch categories from backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await productAPI.getCategories('cap');
        const dbCategories = response.data || [];
        
        // Map categories to objects with labels and icons
        const categoryObjects = dbCategories.map(cat => ({
          id: cat,
          label: cat.charAt(0).toUpperCase() + cat.slice(1),
          icon: getCategoryIcon(cat)
        }));

        // Add "All" option at the beginning
        setCategories([
          { id: 'all', label: 'All Caps', icon: 'fa-layer-group' },
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
    const fetchCaps = async () => {
      try {
        const params = { productType: 'cap' };
        if (selectedCategory !== 'all') {
          params.category = selectedCategory;
        }
        
        const response = await productAPI.getAll(params);
        setProducts(response.data || []);
      } catch (error) {
        console.error('Error fetching caps:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCaps();
  }, [selectedCategory]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-4xl text-[#D2C1B6] mb-4"></i>
          <p className="text-gray-300">Loading caps...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="relative flex items-center justify-center text-white py-16 md:py-24 overflow-hidden" style={{ minHeight: '60vh' }}>
        <div className="absolute inset-0 z-0">
          <img src="/assets/images/hero/1.webp" alt="Premium Caps Collection" className="w-full h-full object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 via-gray-900/60 to-gray-900/80"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-gray-900/40"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="max-w-3xl mx-auto fade-in appear">
            <h1 className="font-display text-4xl md:text-6xl font-bold mb-4 md:mb-6" style={{ textShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>
              Premium Caps Collection
            </h1>
            <p className="text-lg md:text-xl text-gray-100 opacity-95 max-w-2xl mx-auto leading-relaxed" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
              Discover our carefully curated selection of premium caps. From classic styles to modern designs, find the perfect cap for every occasion.
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
              <span className="text-[#D2C1B6] font-semibold">{products.length}</span> premium caps available
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

export default Caps;
