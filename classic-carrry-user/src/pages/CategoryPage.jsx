import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { productAPI, categoryAPI } from '../services/api';

const CategoryPage = () => {
  const { slug } = useParams();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryAndProducts = async () => {
      setLoading(true);
      try {
        // Fetch category details
        const categoryResponse = await categoryAPI.getBySlug(slug);
        setCategory(categoryResponse.data);

        // Fetch products for this category
        const productsResponse = await productAPI.getByCategory(slug);
        setProducts(productsResponse.data || []);
      } catch (error) {
        console.error('Error fetching category data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryAndProducts();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-4xl text-[#D2C1B6] mb-4"></i>
          <p className="text-gray-300">Loading category...</p>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Category Not Found</h2>
          <Link to="/" className="text-[#D2C1B6] hover:text-[#e2c9b8]">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section with Category Image */}
      <section 
        className="relative flex items-center justify-center text-white py-16 md:py-24 overflow-hidden" 
        style={{ minHeight: '50vh' }}
      >
        <div className="absolute inset-0 z-0">
          <img 
            src={category.image} 
            alt={category.name} 
            className="w-full h-full object-cover object-center"
            onError={(e) => {
              e.target.src = '/assets/images/hero/1.webp';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/70 to-gray-900/90"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-gray-900/60"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="max-w-3xl mx-auto fade-in appear">
            {/* Breadcrumb */}
            <div className="mb-4 flex items-center justify-center gap-2 text-sm text-gray-300">
              <Link to="/" className="hover:text-[#D2C1B6] transition">Home</Link>
              <i className="fas fa-chevron-right text-xs"></i>
              <span className="text-[#D2C1B6]">{category.name}</span>
            </div>

            <h1 
              className="font-display text-4xl md:text-6xl font-bold mb-4 md:mb-6" 
              style={{ textShadow: '0 4px 20px rgba(0,0,0,0.5)' }}
            >
              {category.name}
            </h1>
            <p 
              className="text-lg md:text-xl text-gray-100 opacity-95 max-w-2xl mx-auto leading-relaxed" 
              style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}
            >
              {category.description}
            </p>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-14 md:py-24 bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="container mx-auto px-4">
          {/* Products Count */}
          <div className="text-center mb-8 fade-in appear">
            <p className="text-gray-300 text-lg">
              <span className="text-[#D2C1B6] font-semibold">{products.length}</span> products available
            </p>
          </div>

          {/* Products Grid */}
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
              {products.map(product => (
                <div key={product.id} className="fade-in appear">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <i className="fas fa-box-open text-4xl mb-4"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-300 mb-2">No products found</h3>
              <p className="text-gray-400 mb-6">Check back soon for new arrivals!</p>
              <Link
                to="/"
                className="inline-block bg-[#D2C1B6] text-gray-900 px-6 py-3 rounded-lg font-medium hover:bg-[#e2c9b8] transition-all duration-200"
              >
                <i className="fas fa-home mr-2"></i>
                Back to Home
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* About Section */}
      <section className="py-14 md:py-24 bg-gradient-to-b from-gray-800 to-gray-900">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <div className="fade-in appear">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-200 mb-6 md:mb-8">
              Why Choose {category.name}?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700 hover:border-[#D2C1B6] transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-gem text-purple-200 text-2xl"></i>
                </div>
                <h3 className="font-semibold text-xl mb-3 text-gray-100">Premium Quality</h3>
                <p className="text-gray-300 text-sm">Crafted with the finest materials</p>
              </div>

              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700 hover:border-[#D2C1B6] transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-paint-brush text-indigo-200 text-2xl"></i>
                </div>
                <h3 className="font-semibold text-xl mb-3 text-gray-100">Timeless Design</h3>
                <p className="text-gray-300 text-sm">Classic styles that never fade</p>
              </div>

              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700 hover:border-[#D2C1B6] transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-600 to-pink-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-heart text-pink-200 text-2xl"></i>
                </div>
                <h3 className="font-semibold text-xl mb-3 text-gray-100">Customer Love</h3>
                <p className="text-gray-300 text-sm">Satisfaction guaranteed</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CategoryPage;
