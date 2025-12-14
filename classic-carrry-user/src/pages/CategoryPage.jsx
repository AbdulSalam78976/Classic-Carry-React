import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { productAPI, categoryAPI } from '../services/api';

const CategoryPage = () => {
  const { slug } = useParams();
  const [category, setCategory] = useState(null);
  const [subcategories, setSubcategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategoryAndProducts();
  }, [slug]);

  const fetchCategoryAndProducts = async () => {
    if (!slug) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setCategory(null);
    setSubcategories([]);
    setProducts([]);

    try {
      // Fetch all categories
      const allCategoriesResponse = await categoryAPI.getAll();
      const allCategories = Array.isArray(allCategoriesResponse)
        ? allCategoriesResponse
        : (allCategoriesResponse.data || []);

      // Find the current category by slug
      let currentCategory = allCategories.find(cat => cat.slug === slug);

      if (!currentCategory) {
        console.error('Category not found for slug:', slug);
        setLoading(false);
        return;
      }

      setCategory(currentCategory);

      // Check if this is a parent category (has subcategories)
      const isParentCategory = !currentCategory.parentCategory;

      if (isParentCategory) {
        // Get subcategories for this parent category
        const subs = allCategories.filter(cat =>
          cat.parentCategory && cat.parentCategory === currentCategory._id
        );
        setSubcategories(subs);
      }

      // Fetch all products
      const allProductsResponse = await productAPI.getAll();
      const allProducts = Array.isArray(allProductsResponse)
        ? allProductsResponse
        : (allProductsResponse.data || []);

      // Filter products based on category type
      let filteredProducts = [];

      if (isParentCategory) {
        // For parent categories: show products from this category AND all its subcategories
        const subcategoryIds = allCategories
          .filter(cat => cat.parentCategory === currentCategory._id)
          .map(cat => cat._id);

        filteredProducts = allProducts.filter(product => {
          const productCategoryId = typeof product.category === 'object'
            ? product.category._id
            : product.category;
          const productSubcategoryId = typeof product.subcategory === 'object'
            ? product.subcategory?._id
            : product.subcategory;

          // Match if product's main category matches OR if product's subcategory is one of this category's subcategories
          return productCategoryId === currentCategory._id ||
            (productSubcategoryId && subcategoryIds.includes(productSubcategoryId));
        });
      } else {
        // For subcategories: show products that have this subcategory assigned
        filteredProducts = allProducts.filter(product => {
          const productSubcategoryId = typeof product.subcategory === 'object'
            ? product.subcategory?._id
            : product.subcategory;

          return productSubcategoryId === currentCategory._id;
        });
      }

      setProducts(filteredProducts);
      console.log(`Loaded ${filteredProducts.length} products for ${currentCategory.name}`);

    } catch (error) {
      console.error('Error fetching category data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-4xl text-primary mb-4"></i>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Category Not Found</h2>
          <p className="text-gray-600 mb-6">The category you're looking for doesn't exist.</p>
          <Link to="/" className="text-primary hover:text-primary-dark underline">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Category Header */}
      <section className="py-12 md:py-4 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
              <Link to="/" className="hover:text-primary transition">Home</Link>
              <i className="fas fa-chevron-right text-xs"></i>
              <span className="text-primary">{category.name}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              {category.name}
            </h1>
            {category.description && (
              <p className="text-gray-600 mb-4">{category.description}</p>
            )}
            <p className="text-gray-600">
              <span className="text-primary font-semibold">{products.length}</span> products available
            </p>
          </div>

          {/* Subcategories Section */}
          {subcategories.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Browse by Subcategory</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {subcategories.map((subcat) => (
                  <Link
                    key={subcat._id}
                    to={`/category/${subcat.slug}`}
                    className="group bg-white border border-gray-200 rounded-xl p-4 hover:border-primary hover:shadow-md transition-all duration-300"
                  >
                    <div className="aspect-square rounded-lg overflow-hidden mb-3">
                      <img
                        src={subcat.image}
                        alt={subcat.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <h3 className="text-sm font-semibold text-gray-900 group-hover:text-primary transition-colors text-center">
                      {subcat.name}
                    </h3>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Products Section */}
      <section className="md:py-16 bg-white">
        <div className="container mx-auto px-4">
          {products.length > 0 ? (
            <div className="product-grid">
              {products.map((product) => (
                <div key={product._id || product.id} className="fade-in appear">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 fade-in appear">
              <div className="mb-6">
                <i className="fas fa-box-open text-6xl text-gray-600"></i>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No Products Available</h3>
              <p className="text-gray-600 text-lg mb-2">
                We don't have any products in this category yet
              </p>
              <p className="text-gray-500 mb-8">
                Check back soon for exciting new arrivals!
              </p>
              <Link
                to="/"
                className="inline-block bg-primary text-white px-8 py-3 rounded-lg font-medium hover:bg-primary-dark transition-all duration-300 transform hover:scale-105"
              >
                <i className="fas fa-home mr-2"></i>
                Back to Home
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default CategoryPage;
