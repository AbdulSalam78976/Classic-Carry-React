import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    '/assets/images/hero/1.webp',
    '/assets/images/hero/2.webp',
    '/assets/images/hero/3.webp'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <section className="hero-carousel text-white py-12 md:py-20 lg:py-32 relative overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
          style={{ backgroundImage: `url('${slide}')` }}
        />
      ))}
      <div className="hero-overlay"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center fade-in appear">
          <h1 className="font-display hero-title font-bold mb-4 md:mb-6 leading-tight tracking-tight text-4xl md:text-6xl" style={{ textShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>
            Elevate Your Style
          </h1>
          <p className="text-base md:text-lg lg:text-xl mb-6 md:mb-10 text-gray-100 opacity-95 max-w-2xl mx-auto leading-relaxed">
            Premium caps and wallets crafted for the modern individual who values quality, style, and functionality.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
            <Link
              to="/caps"
              className="bg-[#D2C1B6] text-gray-900 px-6 py-3 md:px-8 md:py-4 rounded-lg md:rounded-xl font-semibold hover:bg-[#e2c9b8] transition duration-300 transform hover:scale-105 shadow-2xl"
            >
              Shop Caps
            </Link>
            <Link
              to="/wallets"
              className="border-2 border-[#D2C1B6] text-white px-6 py-3 md:px-8 md:py-4 rounded-lg md:rounded-xl font-semibold hover:bg-[#D2C1B6] hover:text-gray-900 transition duration-300 transform hover:scale-105"
              style={{ backdropFilter: 'blur(10px)', background: 'rgba(30, 41, 59, 0.6)' }}
            >
              Shop Wallets
            </Link>
          </div>
        </div>
      </div>

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
