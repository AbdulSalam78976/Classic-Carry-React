import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import HeroCarousel from '../components/HeroCarousel';
import ProductCard from '../components/ProductCard';
import { categoryAPI, productAPI } from '../services/api';
import { useWishlist } from '../contexts/WishlistContext';
import { useNotification } from '../contexts/NotificationContext';

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [hotProducts, setHotProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { showNotification } = useNotification();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all categories
        const categoriesResponse = await categoryAPI.getAll();
        setCategories(categoriesResponse.data || []);

        // Fetch hot/best selling products
        const hotProductsResponse = await productAPI.getHot();
        setHotProducts(hotProductsResponse.data || []);

        // Fetch all products for featured and new arrivals
        const allProductsResponse = await productAPI.getAll();
        const allProducts = allProductsResponse.data || [];
        
        // Filter featured products
        setFeaturedProducts(allProducts.filter(p => p.isFeatured).slice(0, 8));
        
        // Get newest products (sort by createdAt)
        setNewArrivals(allProducts.sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        ).slice(0, 8));
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
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-4xl text-[#8B7355] mb-4"></i>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* Hero Carousel */}
      <HeroCarousel />

      {/* Shop by Categories - Horizontal Scroll */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="mb-8 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Shop by Categories
            </h2>
            <p className="text-gray-600">Browse our collections</p>
          </div>

          <div className="flex gap-6 md:gap-8 overflow-x-auto pb-4 scrollbar-hide justify-center">
            {categories.map((category) => (
              <Link
                key={category._id}
                to={`/category/${category.slug}`}
                className="flex-shrink-0 group text-center"
              >
                <div className="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden border-4 border-gray-200 group-hover:border-[#8B7355] transition-all duration-300 mb-3 mx-auto">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <p className="text-gray-900 text-sm font-medium">{category.name}</p>
              </Link>
            ))}
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
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
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

     
      {/* Featured Products with Tabs */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
              Featured Products
            </h2>
            
            {/* Tabs */}
            <div className="flex gap-4 border-b border-gray-200">
              <button className="pb-3 px-4 text-gray-900 border-b-2 border-[#8B7355] font-medium">
                New Arrival
              </button>
              <button className="pb-3 px-4 text-gray-500 hover:text-gray-900 transition">
                Best Selling
              </button>
              <button className="pb-3 px-4 text-gray-500 hover:text-gray-900 transition">
                Top Rated
              </button>
            </div>
          </div>

          {newArrivals.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
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
