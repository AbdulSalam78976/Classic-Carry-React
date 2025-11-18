import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import HeroCarousel from '../components/HeroCarousel';
import ProductCard from '../components/ProductCard';
import { categoryAPI, productAPI } from '../services/api';

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [categoriesWithProducts, setCategoriesWithProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch featured categories
        const categoriesResponse = await categoryAPI.getFeatured();
        setCategories(categoriesResponse.data || []);

        // Fetch categories with their products
        const categoriesProductsResponse = await categoryAPI.getFeaturedWithProducts();
        setCategoriesWithProducts(categoriesProductsResponse.data || []);
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
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-4xl text-[#D2C1B6] mb-4"></i>
          <p className="text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <HeroCarousel />

      {/* Categories Section - Horizontal Scroll */}
      <section className="py-10 md:py-16 bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="container mx-auto px-4">
          <div className="mb-6 md:mb-8 text-center fade-in appear">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-2">
              Shop by Category
            </h2>
            <p className="text-gray-400 text-sm md:text-base">
              Explore our collections
            </p>
          </div>

          {/* Horizontal Scrollable Categories */}
          <div className="relative">
            <div className="flex gap-6 md:gap-8 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory px-4 -mx-4">
              {categories.map((category) => (
                <Link
                  key={category._id}
                  to={`/category/${category.slug}`}
                  className="flex-shrink-0 snap-center group"
                >
                  <div className="flex flex-col items-center">
                    {/* Circular Image */}
                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-gray-700 group-hover:border-[#D2C1B6] transition-all duration-300 shadow-lg group-hover:shadow-2xl group-hover:scale-110 mb-3">
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          e.target.src = '/assets/images/placeholder.jpg';
                        }}
                      />
                    </div>
                    {/* Category Name - Hidden on mobile, shown on hover */}
                    <p className="text-white text-sm md:text-base font-medium text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute mt-28 md:mt-36 bg-gray-800/90 px-3 py-1 rounded-full whitespace-nowrap">
                      {category.name}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
            
            {/* Scroll Indicator */}
            <div className="text-center mt-2">
              <p className="text-gray-500 text-xs">
                <i className="fas fa-chevron-left mr-2"></i>
                Scroll for more
                <i className="fas fa-chevron-right ml-2"></i>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Products by Category */}
      {categoriesWithProducts.map((category) => (
        category.products && category.products.length > 0 && (
          <section key={category._id} className="py-14 md:py-20 bg-gradient-to-b from-gray-800 to-gray-900">
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-between mb-8 md:mb-12 fade-in appear">
                <div>
                  <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-2 flex items-center gap-3">
                    <span className="text-3xl">{category.icon ? <i className={`fas ${category.icon}`}></i> : '🔥'}</span>
                    <span>Popular {category.name}</span>
                  </h2>
                  <p className="text-gray-400">Best selling items from our {category.name.toLowerCase()} collection</p>
                </div>
                <Link
                  to={`/category/${category.slug}`}
                  className="text-[#D2C1B6] hover:text-[#e2c9b8] transition duration-300 text-sm md:text-base font-medium group whitespace-nowrap"
                >
                  View All {category.name}
                  <i className="fas fa-arrow-right ml-2 group-hover:translate-x-2 transition-transform duration-300 inline-block"></i>
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                {category.products.map((product) => (
                  <div key={product.id} className="fade-in appear">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>

              {/* View All Button for Mobile */}
              <div className="mt-8 text-center md:hidden">
                <Link
                  to={`/category/${category.slug}`}
                  className="inline-block bg-[#D2C1B6] text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-[#e2c9b8] transition-all duration-300"
                >
                  View All {category.name}
                  <i className="fas fa-arrow-right ml-2"></i>
                </Link>
              </div>
            </div>
          </section>
        )
      ))}

      {/* About Section */}
      <section className="py-14 md:py-24 bg-gradient-to-b from-gray-800 to-gray-900">
        <div className="container mx-auto px-4 text-center max-w-6xl">
          <div className="fade-in appear">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-200 mb-6 md:mb-8">
              About Classic Carrry
            </h2>
            <p className="text-base md:text-lg text-gray-300 mb-8 md:mb-12 leading-relaxed max-w-3xl mx-auto">
              At Classic Carrry, we believe that accessories are more than just functional items—they're expressions of personal style and character. Since our founding, we've been dedicated to crafting premium caps and wallets that blend timeless design with modern functionality.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700 hover:border-[#D2C1B6] transition-all duration-300">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-purple-600 to-purple-800 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <i className="fas fa-gem text-purple-200 text-2xl md:text-3xl"></i>
              </div>
              <h3 className="font-semibold text-xl md:text-2xl mb-3 text-gray-100">Premium Quality</h3>
              <p className="text-gray-300 text-sm md:text-base leading-relaxed">
                Crafted with the finest materials and meticulous attention to detail for lasting excellence.
              </p>
            </div>

            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700 hover:border-[#D2C1B6] transition-all duration-300">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <i className="fas fa-paint-brush text-indigo-200 text-2xl md:text-3xl"></i>
              </div>
              <h3 className="font-semibold text-xl md:text-2xl mb-3 text-gray-100">Timeless Design</h3>
              <p className="text-gray-300 text-sm md:text-base leading-relaxed">
                Classic styles that never go out of fashion, designed to complement your unique personality.
              </p>
            </div>

            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700 hover:border-[#D2C1B6] transition-all duration-300">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-pink-600 to-pink-800 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <i className="fas fa-heart text-pink-200 text-2xl md:text-3xl"></i>
              </div>
              <h3 className="font-semibold text-xl md:text-2xl mb-3 text-gray-100">Customer Love</h3>
              <p className="text-gray-300 text-sm md:text-base leading-relaxed">
                Satisfaction guaranteed with every purchase. Your happiness is our priority.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
