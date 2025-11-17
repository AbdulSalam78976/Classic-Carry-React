import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative flex items-center justify-center text-white py-16 md:py-24" style={{ minHeight: '50vh' }}>
        <div className="absolute inset-0 z-0">
          <img src="/assets/images/hero/3.webp" alt="About Classic Carrry" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/85 via-gray-900/75 to-gray-900/85"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="max-w-4xl mx-auto fade-in appear">
            <h1 className="font-display text-4xl md:text-6xl font-bold mb-4 md:mb-6" style={{ textShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>
              About Classic Carrry
            </h1>
            <p className="text-lg md:text-xl text-gray-100 opacity-95 max-w-3xl mx-auto leading-relaxed">
              Crafting premium accessories that define your style and elevate your everyday experience since our inception.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-14 md:py-24 bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="fade-in appear">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-200 mb-6">Our Story</h2>
              <div className="space-y-6 text-gray-300 leading-relaxed">
                <p className="text-lg">
                  Classic Carrry was born from a simple belief: that the accessories you choose should be as unique and sophisticated as you are. What started as a passion project has evolved into a brand dedicated to creating premium caps and wallets that seamlessly blend timeless design with modern functionality.
                </p>
                <p>
                  Every piece in our collection is carefully crafted with attention to detail, using only the finest materials sourced from trusted suppliers. We believe that quality should never be compromised, and that's why each product undergoes rigorous quality checks before reaching our customers.
                </p>
                <p>
                  From the bustling streets of urban cities to the serene landscapes of countryside adventures, classiccarrry accessories are designed to be your perfect companion, adapting to your lifestyle while maintaining their elegance and durability.
                </p>
              </div>
            </div>
            <div className="fade-in appear">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-[#D2C1B6] to-amber-200 rounded-2xl transform rotate-3"></div>
                <div className="relative bg-gray-800 rounded-2xl p-8 shadow-2xl">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-[#D2C1B6] to-amber-200 rounded-full flex items-center justify-center mx-auto mb-6">
                      <i className="fas fa-award text-gray-900 text-3xl"></i>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">Premium Quality</h3>
                    <p className="text-gray-300 leading-relaxed">
                      We're committed to delivering exceptional quality in every product, ensuring that your classiccarrry accessories stand the test of time while maintaining their premium look and feel.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-14 md:py-24 bg-gradient-to-b from-gray-800 to-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-16 fade-in appear">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-200 mb-4">Our Values</h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              The principles that guide everything we do and every product we create
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: 'fa-gem', color: 'from-blue-600 to-blue-800', title: 'Uncompromising Quality', desc: 'We source the finest materials and employ skilled craftsmen to ensure every product meets our exacting standards.' },
              { icon: 'fa-lightbulb', color: 'from-purple-600 to-purple-800', title: 'Innovation', desc: 'We continuously evolve our designs and incorporate new technologies while respecting timeless aesthetics.' },
              { icon: 'fa-leaf', color: 'from-green-600 to-green-800', title: 'Sustainability', desc: 'We\'re committed to responsible sourcing and sustainable practices that protect our planet for future generations.' },
              { icon: 'fa-heart', color: 'from-red-600 to-red-800', title: 'Customer First', desc: 'Your satisfaction is our priority. We listen to feedback and continuously improve to exceed your expectations.' },
              { icon: 'fa-hammer', color: 'from-yellow-600 to-yellow-800', title: 'Expert Craftsmanship', desc: 'Every piece is meticulously crafted by skilled artisans who take pride in their work and attention to detail.' },
              { icon: 'fa-palette', color: 'from-pink-600 to-pink-800', title: 'Timeless Style', desc: 'Our designs transcend trends, offering classic elegance that remains relevant and stylish for years to come.' }
            ].map((value, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700 hover:border-[#D2C1B6] transition-all duration-300 fade-in appear">
                <div className={`w-16 h-16 bg-gradient-to-br ${value.color} rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg`}>
                  <i className={`fas ${value.icon} text-white text-2xl`}></i>
                </div>
                <h3 className="font-semibold text-xl mb-3 text-gray-100 text-center">{value.title}</h3>
                <p className="text-gray-300 text-center leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-14 md:py-24 bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '10K+', label: 'Happy Customers' },
              { value: '50+', label: 'Premium Products' },
              { value: '5', label: 'Years Experience' },
              { value: '99%', label: 'Satisfaction Rate' }
            ].map((stat, index) => (
              <div key={index} className="text-center fade-in appear">
                <div className="text-4xl md:text-5xl font-bold text-[#D2C1B6] mb-2">{stat.value}</div>
                <p className="text-gray-300 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-14 md:py-24 bg-gradient-to-b from-gray-800 to-gray-900">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto fade-in appear">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Experience classiccarrry?
            </h2>
            <p className="text-gray-300 text-lg mb-8 leading-relaxed">
              Discover our collection of premium caps and wallets, each crafted with the attention to detail and quality that defines the classiccarrry experience.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/caps" className="bg-[#D2C1B6] text-gray-900 px-8 py-4 rounded-xl font-semibold hover:bg-[#e2c9b8] transition duration-300 transform hover:scale-105 shadow-2xl">
                Shop Caps
              </Link>
              <Link to="/wallets" className="border-2 border-[#D2C1B6] text-white px-8 py-4 rounded-xl font-semibold hover:bg-[#D2C1B6] hover:text-gray-900 transition duration-300 transform hover:scale-105" style={{ backdropFilter: 'blur(10px)', background: 'rgba(30, 41, 59, 0.6)' }}>
                Shop Wallets
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-14 md:py-24 bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 fade-in appear">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-200 mb-4">Get In Touch</h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Have questions about our products or want to learn more about classiccarrry? We'd love to hear from you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { icon: 'fa-whatsapp', color: 'from-green-500 to-green-700', title: 'WhatsApp', subtitle: 'Chat with us directly', link: 'https://wa.me/923160928206', linkText: '+92 316 092 8206' },
              { icon: 'fa-envelope', color: 'from-blue-500 to-blue-700', title: 'Email', subtitle: 'Send us a message', link: 'mailto:classiccarrry@gmail.com', linkText: 'classiccarrry@gmail.com' },
              { icon: 'fa-map-marker-alt', color: 'from-purple-500 to-purple-700', title: 'Location', subtitle: 'Visit our showroom', link: null, linkText: 'Pakistan' }
            ].map((contact, index) => (
              <div key={index} className="text-center fade-in appear">
                <div className={`w-16 h-16 bg-gradient-to-br ${contact.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <i className={`fas ${contact.icon} text-white text-2xl`}></i>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{contact.title}</h3>
                <p className="text-gray-300 mb-4">{contact.subtitle}</p>
                {contact.link ? (
                  <a href={contact.link} target="_blank" rel="noopener noreferrer" className="text-[#D2C1B6] hover:text-amber-200 transition duration-300 font-medium">
                    {contact.linkText}
                  </a>
                ) : (
                  <p className="text-[#D2C1B6] font-medium">{contact.linkText}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
