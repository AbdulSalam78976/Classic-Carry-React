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
      if (!slug) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setCategory(null);
      setProducts([]);

      try {
        // Fetch all categories first (more reliable)
        const allCategoriesResponse = await categoryAPI.getAll();
        const allCategories = Array.isArray(allCategoriesResponse) 
          ? allCategoriesResponse 
          : (allCategoriesResponse.data || []);
        
        console.log('All categories:', allCategories);
        console.log('Looking for slug:', slug);
        
        // Find category by slug
        let category = allCategories.find(cat => {
          const catSlug = cat.slug || cat.name?.toLowerCase().replace(/\s+/g, '-');
          return catSlug === slug || 
                 catSlug?.toLowerCase() === slug?.toLowerCase() ||
                 cat.slug === slug;
        });
        
        // If not found, try the API endpoint
        if (!category) {
          try {
            const categoryResponse = await categoryAPI.getBySlug(slug);
            category = categoryResponse.data || categoryResponse;
          } catch (slugError) {
            console.warn('Category API endpoint failed:', slugError);
          }
        }
        
        if (!category) {
          console.error('Category not found for slug:', slug);
          console.log('Available category slugs:', allCategories.map(c => c.slug || c.name?.toLowerCase().replace(/\s+/g, '-')));
          setLoading(false);
          return;
        }
        
        console.log('Found category:', category);
        setCategory(category);

        // Fetch products for this category
        let products = [];
        
        // First, try the API endpoint (most reliable)
        try {
          console.log('Trying API endpoint for category products...');
          const productsResponse = await productAPI.getByCategory(slug);
          
          if (Array.isArray(productsResponse)) {
            products = productsResponse;
          } else if (productsResponse && Array.isArray(productsResponse.data)) {
            products = productsResponse.data;
          } else if (productsResponse && productsResponse.products && Array.isArray(productsResponse.products)) {
            products = productsResponse.products;
          }
          
          console.log(`API endpoint returned ${products.length} products for category: ${category.name}`);
        } catch (endpointError) {
          console.warn('API endpoint failed, using fallback filtering:', endpointError);
          
          // Fallback: Fetch all products and filter by category
          try {
            console.log('Fetching all products to filter by category...');
            const allProductsResponse = await productAPI.getAll();
            const allProducts = Array.isArray(allProductsResponse) 
              ? allProductsResponse 
              : (allProductsResponse.data || []);
            
            console.log(`Total products fetched: ${allProducts.length}`);
            console.log('Category to match:', { _id: category._id, slug: category.slug, name: category.name });
            
            // Filter products by category - strict matching
            products = allProducts.filter(p => {
              const productCategory = p.category || p.categoryId || p.categorySlug;
              
              // Skip products without category
              if (!productCategory) {
                return false;
              }
              
              // Match by category ID (string) - must match exactly
              if (typeof productCategory === 'string') {
                // Only match if it's exactly the category ID or slug
                const matches = productCategory === category._id || 
                              productCategory === category.id ||
                              productCategory === category.slug;
                
                if (matches) {
                  console.log('✓ Matched product by string:', p.name, 'Category:', productCategory, 'Expected:', category._id || category.slug);
                }
                return matches;
              }
              
              // Match by category object - must match slug or ID exactly
              if (productCategory && typeof productCategory === 'object') {
                // Check if it's a populated category object
                const categorySlug = productCategory.slug || productCategory.name?.toLowerCase().replace(/\s+/g, '-');
                const categoryId = productCategory._id || productCategory.id;
                
                const matches = categorySlug === slug || 
                              categoryId === category._id ||
                              categoryId === category.id ||
                              (productCategory.name && productCategory.name.toLowerCase() === category.name.toLowerCase());
                
                if (matches) {
                  console.log('✓ Matched product by object:', p.name, 'Category:', productCategory.name || productCategory.slug, 'Expected:', category.name);
                }
                return matches;
              }
              
              return false;
            });
            
            console.log(`Filtered ${products.length} products for category: ${category.name}`);
          } catch (error) {
            console.error('Error fetching products:', error);
            products = [];
          }
        }
        
        // Filter out any invalid products and verify they belong to this category
        products = products.filter(p => {
          // Must have required fields
          if (!p || !(p._id || p.id) || !p.name) {
            return false;
          }
          
          // Double-check category match
          const productCategory = p.category || p.categoryId || p.categorySlug;
          
          if (typeof productCategory === 'string') {
            // Must match category ID or slug exactly
            return productCategory === category._id || 
                   productCategory === category.id ||
                   productCategory === category.slug;
          }
          
          if (productCategory && typeof productCategory === 'object') {
            const categorySlug = productCategory.slug || productCategory.name?.toLowerCase().replace(/\s+/g, '-');
            const categoryId = productCategory._id || productCategory.id;
            
            return categorySlug === slug || 
                   categoryId === category._id ||
                   categoryId === category.id ||
                   (productCategory.name && productCategory.name.toLowerCase() === category.name.toLowerCase());
          }
          
          // If category field doesn't match expected format, exclude it
          return false;
        });
        
        console.log(`Final: Loaded ${products.length} valid products for category: ${category.name} (slug: ${slug})`);
        if (products.length > 0) {
          console.log('First product category:', products[0].category || products[0].categoryId);
          console.log('Expected category:', category._id || category.slug);
        } else {
          console.warn('⚠️ No valid products found! Products array is empty or products are missing required fields.');
        }
        setProducts(products);
      } catch (error) {
        console.error('Error fetching category data:', error);
        console.error('Error details:', {
          message: error.message,
          slug: slug,
          stack: error.stack
        });
        
        // Last resort: Try to get category from all categories
        try {
          console.log('Attempting last resort category fetch...');
          const allCategoriesResponse = await categoryAPI.getAll();
          const allCategories = Array.isArray(allCategoriesResponse) 
            ? allCategoriesResponse 
            : (allCategoriesResponse.data || []);
          
          const foundCategory = allCategories.find(cat => 
            cat.slug === slug || 
            cat.slug?.toLowerCase() === slug?.toLowerCase() ||
            cat.name?.toLowerCase().replace(/\s+/g, '-') === slug?.toLowerCase()
          );
          
          if (foundCategory) {
            console.log('Found category in fallback:', foundCategory);
            setCategory(foundCategory);
            
            // Try to get products for this category
            try {
              const allProductsResponse = await productAPI.getAll();
              const allProducts = Array.isArray(allProductsResponse) 
                ? allProductsResponse 
                : (allProductsResponse.data || []);
              
              const filteredProducts = allProducts.filter(p => {
                const productCategory = p.category || p.categoryId;
                if (typeof productCategory === 'string') {
                  return productCategory === foundCategory._id || productCategory === foundCategory.slug;
                } else if (productCategory && typeof productCategory === 'object') {
                  return productCategory.slug === slug || 
                         productCategory._id === foundCategory._id ||
                         productCategory.id === foundCategory._id;
                }
                return false;
              });
              
              setProducts(filteredProducts);
            } catch (productsError) {
              console.error('Error fetching products in fallback:', productsError);
              setProducts([]);
            }
          } else {
            console.error('Category not found even in fallback. Slug:', slug);
            setCategory(null);
            setProducts([]);
          }
        } catch (fallbackError) {
          console.error('Error in final fallback:', fallbackError);
          setCategory(null);
          setProducts([]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryAndProducts();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-4xl text-[#8B7355] mb-4"></i>
          <p className="text-gray-600">Loading category...</p>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Category Not Found</h2>
          <p className="text-gray-600 mb-2">Slug: {slug}</p>
          <p className="text-gray-500 text-sm mb-6">Please check the browser console for more details.</p>
          <Link to="/" className="text-[#8B7355] hover:text-[#6B5744] underline">
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
              <Link to="/" className="hover:text-[#8B7355] transition">Home</Link>
              <i className="fas fa-chevron-right text-xs"></i>
              <span className="text-[#8B7355]">{category.name}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              {category.name}
            </h1>
            <p className="text-gray-600">
              <span className="text-[#8B7355] font-semibold">{products.length}</span> products available
            </p>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className=" md:py-16 bg-white">
        <div className="container mx-auto px-4">

          {/* Products Grid */}
          {products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
                {products.map((product, index) => {
                  if (!product) {
                    console.warn(`Product at index ${index} is null/undefined`);
                    return null;
                  }
                  
                  if (!product.name || !product.price) {
                    console.warn(`Product at index ${index} missing required fields:`, product);
                    return (
                      <div key={product._id || product.id || `product-${index}`} className="p-4 border border-yellow-300 bg-yellow-50 rounded">
                        <p className="text-yellow-800">Invalid product data</p>
                        <p className="text-xs text-yellow-600">Missing: {!product.name ? 'name ' : ''}{!product.price ? 'price' : ''}</p>
                      </div>
                    );
                  }
                  
                  return (
                    <div 
                      key={product._id || product.id || `product-${index}`} 
                      className="fade-in appear"
                    >
                      <ProductCard product={product} />
                    </div>
                  );
                })}
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
                className="inline-block bg-[#8B7355] text-white px-8 py-3 rounded-lg font-medium hover:bg-[#6B5744] transition-all duration-300 transform hover:scale-105"
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
