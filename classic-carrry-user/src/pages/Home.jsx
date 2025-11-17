import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import HeroCarousel from '../components/HeroCarousel';
import ProductCard from '../components/ProductCard';
import { productAPI } from '../services/api';

const Home = () => {
  const [hotProducts, setHotProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productAPI.getHot();
        setHotProducts(response.data || []);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-4xl text-[#D2C1B6] mb-4"></i>
          <p className="text-gray-300">Loading products...</p>
        </div>
      </div>
    );
  }

  const hotCaps = hotProducts.filter(p => p.productType === 'cap');
  const hotWallets = hotProducts.filter(p => p.productType === 'wallet');

  return (
    <div>
      <HeroCarousel />

      {/* Hot Products Section */}
      <section className="py-14 md:py-24 bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="container mx-auto px-4">
          <div className="mb-8 md:mb-16 text-center fade-in appear">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-3 md:mb-4">
              <span>🔥</span> Hot Selling Products
            </h2>
            <p className="text-gray-300 text-base md:text-lg">
              Our most popular items loved by customers worldwide
            </p>
          </div>

          {/* Hot Selling Caps */}
          <div className="mb-8 md:mb-12">
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <h3 className="text-xl md:text-2xl font-semibold text-white flex items-center gap-2">
                <span className="text-2xl">🧢</span>
                <span>Hot Selling Caps</span>
              </h3>
              <Link
                to="/caps"
                className="text-[#D2C1B6] hover:text-[#e2c9b8] transition duration-300 text-sm md:text-base font-medium group"
              >
                View All Caps
                <i className="fas fa-arrow-right ml-1 group-hover:translate-x-2 transition-transform duration-300 inline-block"></i>
              </Link>
            </div>
            <div className="scroll-container">
              <div className="scroll-row">
                {hotCaps.map(product => (
                  <div key={product.id} className="scroll-item">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Hot Selling Wallets */}
          <div>
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <h3 className="text-xl md:text-2xl font-semibold text-white flex items-center gap-2">
                <span className="text-2xl">🗃️</span>
                <span>Hot Selling Wallets</span>
              </h3>
              <Link
                to="/wallets"
                className="text-[#D2C1B6] hover:text-[#e2c9b8] transition duration-300 text-sm md:text-base font-medium group"
              >
                View All Wallets
                <i className="fas fa-arrow-right ml-1 group-hover:translate-x-2 transition-transform duration-300 inline-block"></i>
              </Link>
            </div>
            <div className="scroll-container">
              <div className="scroll-row">
                {hotWallets.map(product => (
                  <div key={product.id} className="scroll-item">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

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
