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
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#8B7355]/5 rounded-full blur-3xl animate-pulse"></div>
          </div>

          {/* Loading spinner */}
          <div className="w-20 h-20 mx-auto mb-6 relative">
            <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-[#8B7355] rounded-full animate-spin"></div>
          </div>

          {/* Text */}
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Loading Products</h3>
          <p className="text-gray-600 mb-4">Please wait while we prepare everything for you...</p>
          
          {/* Loading dots */}
          <div className="flex justify-center gap-2">
            <div className="w-2 h-2 bg-[#8B7355] rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-[#8B7355] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-[#8B7355] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white animate-fadeIn">
      {/* Hero Carousel */}
      <HeroCarousel />

{/* Shop by Categories - Enhanced Design */}
<section className="py-16 md:py-20 bg-gradient-to-b from-white to-gray-50">
  <div className="container mx-auto px-4">
    {/* Section Header */}
    <div className="text-center mb-12">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
        Shop by Categories
      </h2>
      <p className="text-gray-600 text-lg">Discover our premium collections</p>
      <div className="w-24 h-1 bg-gradient-to-r from-[#8B7355] to-[#A68A6F] mx-auto mt-4 rounded-full"></div>
    </div>

    {/* Categories Grid */}
    <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 max-w-4xl mx-auto">
      {categories.map((category) => (
        <Link
          key={category._id}
          to={`/category/${category.slug}`}
          className="group h-full"
        >
          <div className="relative bg-white rounded-2xl p-6 shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 h-full flex flex-col">
            {/* Decorative corner */}
            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-[#8B7355]/10 to-transparent rounded-bl-full"></div>
            
            {/* Image Container */}
            <div className="relative w-32 h-32 md:w-40 md:h-40 mx-auto mb-4">
              {/* Animated ring */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#8B7355]/20 to-[#A68A6F]/20 group-hover:scale-110 transition-transform duration-300"></div>
              
              {/* Image */}
              <div className="absolute inset-2 rounded-full overflow-hidden bg-white shadow-inner">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/200?text=' + category.name;
                  }}
                />
              </div>
              
              {/* Hover overlay */}
              <div className="absolute inset-2 rounded-full bg-[#8B7355]/0 group-hover:bg-[#8B7355]/10 transition-colors duration-300"></div>
            </div>

            {/* Category Name */}
            <h3 className="text-center text-lg md:text-xl font-bold text-gray-900 group-hover:text-[#8B7355] transition-colors duration-300 mb-2 min-h-[2rem]">
              {category.name}
            </h3>

            {/* Description */}
            <div className="flex-grow mb-3">
              {category.description && (
                <p className="text-center text-sm text-gray-500 line-clamp-2">
                  {category.description}
                </p>
              )}
            </div>

          
          </div>
        </Link>
      ))}
    </div>

    {/* View All Link */}
    {categories.length > 3 && (
      <div className="text-center mt-10">
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-8 py-3 bg-white border-2 border-[#8B7355] text-[#8B7355] rounded-full font-semibold hover:bg-[#8B7355] hover:text-white transition-all duration-300 shadow-md hover:shadow-lg"
        >
          <span>View All Products</span>
          <i className="fas fa-arrow-right"></i>
        </Link>
      </div>
    )}
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
