import { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHeroImages();
  }, []);

  const fetchHeroImages = async () => {
    try {
      const response = await fetch(`${API_URL}/hero-images`);
      const data = await response.json();
      console.log('Hero images response:', data);
      const images = data.data || [];
      console.log('Hero images:', images);
      
      if (images.length > 0) {
        setSlides(images.map(img => img.image));
      } else {
        // Fallback to default images if no hero images in database
        console.log('No hero images found, using fallback');
        setSlides([
          '/assets/images/hero/1.webp',
          '/assets/images/hero/2.webp',
          '/assets/images/hero/3.webp'
        ]);
      }
    } catch (error) {
      console.error('Error fetching hero images:', error);
      // Fallback to default images if API fails
      setSlides([
        '/assets/images/hero/1.webp',
        '/assets/images/hero/2.webp',
        '/assets/images/hero/3.webp'
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (slides.length === 0) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  if (loading || slides.length === 0) {
    return (
      <section className="relative h-[70vh] min-h-[500px] bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#8B7355] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400 font-medium">Loading premium collection...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
            index === currentSlide
              ? 'opacity-100 scale-100'
              : 'opacity-0 scale-110'
          }`}
        >
          <div
            className="w-full h-full bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url('${slide}')` }}
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 via-gray-900/60 to-gray-900/40" />
        </div>
      ))}

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl">
            <div className="space-y-6 text-white">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                <i className="fas fa-crown text-[#8B7355] text-sm"></i>
                <span className="text-sm font-semibold">Premium Collection</span>
              </div>

              {/* Main Heading */}
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Elevate Your
                <span className="block text-[#8B7355]">Everyday Style</span>
              </h1>

              {/* Description */}
              <p className="text-lg md:text-xl text-gray-200 leading-relaxed max-w-lg">
                Discover premium lifestyle products that blend timeless elegance with modern functionality. 
                Crafted for those who appreciate quality.
              </p>

          

      
            </div>
          </div>
        </div>
      </div>


      {/* Dots Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? 'bg-[#8B7355] scale-125'
                : 'bg-white/50 hover:bg-white/70'
            }`}
          />
        ))}
      </div>

   
    </section>
  );
};

export default HeroCarousel;