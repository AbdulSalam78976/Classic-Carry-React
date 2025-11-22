import { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

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

  if (loading || slides.length === 0) {
    return (
      <section className="hero-carousel bg-gray-900 py-12 md:py-20 lg:py-32 relative overflow-hidden">
        <div className="flex items-center justify-center h-full">
          <div className="text-gray-400">Loading...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="hero-carousel py-12 md:py-20 lg:py-32 relative overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
          style={{ backgroundImage: `url('${slide}')` }}
        />
      ))}
      <div className="hero-overlay"></div>

      <div className="absolute bottom-6 md:bottom-8 left-1/2 transform -translate-x-1/2 z-10 flex gap-2 md:gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full border-2 transition-all duration-300 ${
              index === currentSlide
                ? 'bg-[#D2C1B6] border-[#D2C1B6] scale-125'
                : 'bg-transparent border-white/50'
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroCarousel;
