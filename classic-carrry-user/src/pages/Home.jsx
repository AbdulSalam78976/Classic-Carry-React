import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import HeroCarousel from '../components/HeroCarousel';
import ProductCard from '../components/ProductCard';
import { categoryAPI, productAPI } from '../services/api';

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [hotProducts, setHotProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all categories
        const categoriesResponse = await categoryAPI.getAll();
        setCategories(categoriesResponse.data || []);

        // Fetch hot/best selling products
        const hotProductsResponse = await productAPI.getHot();
        setHotProducts(hotProductsResponse.data || []);

        // Fetch all products for new arrivals
        const allProductsResponse = await productAPI.getAll();
        const allProducts = allProductsResponse.data || [];

        // Get newest products (sort by createdAt, most recent first)
        const sortedProducts = [...allProducts].sort((a, b) =>
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        setNewArrivals(sortedProducts.slice(0, 8));
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center relative">
          {/* Animated background */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
          </div>

          {/* Loading spinner */}
          <div className="w-20 h-20 mx-auto mb-6 relative">
            <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-primary rounded-full animate-spin"></div>
          </div>

          {/* Text */}
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Loading Products</h3>

          {/* Loading dots */}
          <div className="flex justify-center gap-2">
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white animate-fadeIn">
      {/* Hero Carousel */}
      <HeroCarousel />

      {/* Shop by Categories - Horizontal Scroll */}
      <section className="py-16 md:py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Shop by Categories
            </h2>
            <p className="text-gray-600 text-lg">Discover our premium collections</p>
            <div className="w-24 h-1 bg-gradient-to-r from-primary to-primary-light mx-auto mt-4 rounded-full"></div>
          </div>

          {/* Horizontal Scrollable Categories */}
          <div className="relative group/scroll">
            {/* Scroll Container */}
            <div className="categories-scroll-container overflow-x-auto pb-8 scrollbar-hide snap-x snap-mandatory -mx-4 px-4 md:mx-0 md:px-0 scroll-smooth">
              <div className="flex gap-6 md:gap-8 w-max px-4 md:px-1">
                {categories.map((category) => (
                  <Link
                    key={category._id}
                    to={`/category/${category.slug}`}
                    className="group flex-shrink-0 snap-center"
                  >
                    <div className="relative flex flex-col items-center group w-64 md:w-72 flex-shrink-0 snap-center">
                      {/* Image Container */}
                      <div className="relative w-48 h-48 md:w-56 md:h-56 mb-6">
                        {/* Animated ring */}
                        <div className="absolute inset-0 rounded-full border-2 border-dashed border-primary/20 group-hover:border-primary/50 group-hover:rotate-180 transition-all duration-700"></div>
                        <div className="absolute -inset-2 rounded-full border border-primary/10 group-hover:scale-105 transition-transform duration-500"></div>

                        {/* Image */}
                        <div className="absolute inset-2 rounded-full overflow-hidden bg-gray-50 shadow-lg group-hover:shadow-primary/20 transition-all duration-500">
                          <img
                            src={category.image}
                            alt={category.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/200?text=' + category.name;
                            }}
                          />
                        </div>
                      </div>

                      {/* Category Name */}
                      <h3 className="text-center text-xl font-bold text-gray-900 group-hover:text-primary transition-colors duration-300 mb-2 font-display">
                        {category.name}
                      </h3>

                      {/* Description */}
                      {category.description && (
                        <p className="text-center text-sm text-gray-500 line-clamp-2 leading-relaxed px-2 max-w-[90%]">
                          {category.description}
                        </p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Best Selling Products */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Best Selling
            </h2>
            <p className="text-gray-600">Top picks from our store</p>
          </div>

          {hotProducts.length > 0 ? (
            <div className="product-grid">
              {hotProducts.slice(0, 10).map((product) => (
                <ProductCard key={product._id || product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <i className="fas fa-box-open text-6xl text-gray-300 mb-4"></i>
              <p className="text-gray-600 text-lg">No best selling products available at the moment</p>
              <p className="text-gray-500 text-sm mt-2">Check back soon for our top picks!</p>
            </div>
          )}
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="mb-8 ">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              New Arrivals
            </h2>
            <p className="text-gray-600">Check out our latest products</p>
          </div>

          {newArrivals.length > 0 ? (
            <div className="product-grid">
              {newArrivals.map((product) => (
                <ProductCard key={product._id || product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <i className="fas fa-box-open text-6xl text-gray-300 mb-4"></i>
              <p className="text-gray-600 text-lg">No new arrivals available at the moment</p>
              <p className="text-gray-500 text-sm mt-2">Stay tuned for exciting new products!</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
