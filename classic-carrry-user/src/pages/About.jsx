import { useState, useEffect } from 'react';
import { useNotification } from '../contexts/NotificationContext';

import API_URL from '../config/api';

const About = () => {
  const [faqs, setFaqs] = useState([]);
  const [allFaqs, setAllFaqs] = useState([]);
  const [showAllFaqs, setShowAllFaqs] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [contactInfo, setContactInfo] = useState({
    email: 'classiccarrry@gmail.com',
    phone: '+92 316 092 8206',
    whatsapp: '+92 316 092 8206',
    address: 'Pakistan',
    tiktok: '',
    instagram: ''
  });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const { showNotification } = useNotification();

  useEffect(() => {
    fetchFAQs();
    fetchContactInfo();
  }, []);

  const fetchFAQs = async () => {
    try {
      const response = await fetch(`${API_URL}/settings/faqs`);
      const data = await response.json();
      const allFaqsData = data.data || [];
      setAllFaqs(allFaqsData);
      setFaqs(allFaqsData.slice(0, 6)); // Show only first 6 FAQs initially
    } catch (error) {
      console.error('Error fetching FAQs:', error);
    }
  };

  useEffect(() => {
    if (showAllFaqs) {
      setFaqs(allFaqs);
    } else {
      setFaqs(allFaqs.slice(0, 6));
    }
  }, [showAllFaqs, allFaqs]);

  const fetchContactInfo = async () => {
    try {
      const response = await fetch(`${API_URL}/settings/contact`);
      const data = await response.json();
      if (data.success) {
        setContactInfo(data.data);
      }
    } catch (error) {
      console.error('Error fetching contact info:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch(`${API_URL}/contacts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        showNotification('Message sent successfully! We will get back to you soon.', 'success');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        showNotification(data.message || 'Failed to send message', 'error');
      }
    } catch (error) {
      console.error('Error submitting contact form:', error);
      showNotification('Failed to send message. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

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
              Crafting premium lifestyle products that define your style and elevate your everyday experience since our inception.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-14 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="fade-in appear">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-6">Our Story</h2>
              <div className="space-y-6 text-gray-600 leading-relaxed">
                <p className="text-lg">
                  Classic Carrry was born from a simple belief: that the products you choose should be as unique and sophisticated as you are. What started as a passion project has evolved into a brand dedicated to creating premium lifestyle products that seamlessly blend timeless design with modern functionality.
                </p>
                <p>
                  Every piece in our collection is carefully crafted with attention to detail, using only the finest materials sourced from trusted suppliers. We believe that quality should never be compromised, and that's why each product undergoes rigorous quality checks before reaching our customers.
                </p>
                <p>
                  From the bustling streets of urban cities to the serene landscapes of countryside adventures, classiccarrry products are designed to be your perfect companion, adapting to your lifestyle while maintaining their elegance and durability.
                </p>
              </div>
            </div>
            <div className="fade-in appear">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-[#8B7355] to-[#A68A6F] rounded-2xl transform rotate-3"></div>
                <div className="relative bg-white border border-gray-200 rounded-2xl p-8 shadow-xl">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-[#8B7355] to-[#A68A6F] rounded-full flex items-center justify-center mx-auto mb-6">
                      <i className="fas fa-award text-white text-3xl"></i>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Premium Quality</h3>
                    <p className="text-gray-600 leading-relaxed">
                      We're committed to delivering exceptional quality in every product, ensuring that your classiccarrry items stand the test of time while maintaining their premium look and feel.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-14 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-16 fade-in appear">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              The principles that guide everything we do and every product we create
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: 'fa-gem', color: 'from-blue-500 to-blue-600', title: 'Uncompromising Quality', desc: 'We source the finest materials and employ skilled craftsmen to ensure every product meets our exacting standards.' },
              { icon: 'fa-lightbulb', color: 'from-purple-500 to-purple-600', title: 'Innovation', desc: 'We continuously evolve our designs and incorporate new technologies while respecting timeless aesthetics.' },
              { icon: 'fa-leaf', color: 'from-green-500 to-green-600', title: 'Sustainability', desc: 'We\'re committed to responsible sourcing and sustainable practices that protect our planet for future generations.' },
              { icon: 'fa-heart', color: 'from-red-500 to-red-600', title: 'Customer First', desc: 'Your satisfaction is our priority. We listen to feedback and continuously improve to exceed your expectations.' },
              { icon: 'fa-hammer', color: 'from-yellow-500 to-yellow-600', title: 'Expert Craftsmanship', desc: 'Every piece is meticulously crafted by skilled artisans who take pride in their work and attention to detail.' },
              { icon: 'fa-palette', color: 'from-pink-500 to-pink-600', title: 'Timeless Style', desc: 'Our designs transcend trends, offering classic elegance that remains relevant and stylish for years to come.' }
            ].map((value, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 border border-gray-200 hover:border-[#8B7355] hover:shadow-lg transition-all duration-300 fade-in appear">
                <div className={`w-16 h-16 bg-gradient-to-br ${value.color} rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg`}>
                  <i className={`fas ${value.icon} text-white text-2xl`}></i>
                </div>
                <h3 className="font-semibold text-xl mb-3 text-gray-900 text-center">{value.title}</h3>
                <p className="text-gray-600 text-center leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-14 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '10K+', label: 'Happy Customers' },
              { value: '50+', label: 'Premium Products' },
              { value: '5', label: 'Years Experience' },
              { value: '99%', label: 'Satisfaction Rate' }
            ].map((stat, index) => (
              <div key={index} className="text-center fade-in appear">
                <div className="text-4xl md:text-5xl font-bold text-[#8B7355] mb-2">{stat.value}</div>
                <p className="text-gray-600 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

     

      {/* FAQ Section */}
      {faqs.length > 0 && (
        <section id="faq" className="py-14 md:py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12 fade-in appear">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Quick answers to common questions about our products and services
              </p>
            </div>

            <div className="max-w-3xl mx-auto space-y-4">
              {faqs.map((faq) => (
                <div
                  key={faq._id}
                  className="bg-white rounded-xl border-2 border-gray-400 shadow-md overflow-hidden hover:shadow-lg hover:border-[#8B7355] transition"
                >
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === faq._id ? null : faq._id)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition"
                  >
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{faq.question}</h3>
                    </div>
                    <i className={`fas fa-chevron-${expandedFaq === faq._id ? 'up' : 'down'} text-gray-400 ml-4`}></i>
                  </button>
                  {expandedFaq === faq._id && (
                    <div className="px-6 pb-5 text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {allFaqs.length > 6 && (
              <div className="text-center mt-12">
                <button
                  onClick={() => setShowAllFaqs(!showAllFaqs)}
                  className="inline-block bg-[#8B7355] text-white px-8 py-4 rounded-xl font-semibold hover:bg-[#6B5744] transition"
                >
                  {showAllFaqs ? 'Show Less' : 'View All FAQs'}
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Contact Section */}
      <section id="contact" className="py-14 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 max-w-7xl mx-auto">
            {/* Left Side - Get in Touch */}
            <div className="fade-in appear">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Get in touch</h2>
              <p className="text-gray-500 mb-12 leading-relaxed">
                Have questions about our products or want to learn more? We'd love to hear from you.
              </p>

              {/* Contact Info Cards */}
              <div className="space-y-6">
                {/* Head Office */}
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-full bg-[#8B7355] flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-map-marker-alt text-white text-xl"></i>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Head Office</h3>
                    <p className="text-gray-600">{contactInfo.address}</p>
                  </div>
                </div>

                {/* Email Us */}
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-full bg-[#8B7355] flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-envelope text-white text-xl"></i>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Email Us</h3>
                    <a href={`mailto:${contactInfo.email}`} className="text-gray-600 hover:text-[#8B7355] transition">
                      {contactInfo.email}
                    </a>
                  </div>
                </div>

                {/* Call Us */}
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-full bg-[#8B7355] flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-phone-alt text-white text-xl"></i>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Call Us</h3>
                    <p className="text-gray-600">
                      Phone: <a href={`tel:${contactInfo.phone}`} className="hover:text-[#8B7355] transition">{contactInfo.phone}</a>
                    </p>
                    {contactInfo.whatsapp && (
                      <p className="text-gray-600">
                        WhatsApp: <a href={`https://wa.me/${contactInfo.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="hover:text-[#8B7355] transition">{contactInfo.whatsapp}</a>
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="mt-12">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Follow our social media</h3>
                <div className="flex gap-3">
                  {contactInfo.instagram && (
                    <a
                      href={contactInfo.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 rounded-full bg-[#8B7355] flex items-center justify-center text-white hover:bg-[#6B5744] transition"
                    >
                      <i className="fab fa-instagram text-xl"></i>
                    </a>
                  )}
                  {contactInfo.tiktok && (
                    <a
                      href={contactInfo.tiktok}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 rounded-full bg-[#8B7355] flex items-center justify-center text-white hover:bg-[#6B5744] transition"
                    >
                      <i className="fab fa-tiktok text-xl"></i>
                    </a>
                  )}
                
                  {contactInfo.whatsapp && (
                    <a
                      href={`https://wa.me/${contactInfo.whatsapp.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 rounded-full bg-[#8B7355] flex items-center justify-center text-white hover:bg-[#6B5744] transition"
                    >
                      <i className="fab fa-whatsapp text-xl"></i>
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Right Side - Contact Form */}
            <div className="bg-white rounded-2xl p-8 md:p-10 shadow-lg fade-in appear">
              <h3 className="text-3xl font-bold text-gray-900 mb-8">Send us a message</h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    placeholder="Name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:border-[#8B7355] focus:bg-white focus:outline-none transition"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:border-[#8B7355] focus:bg-white focus:outline-none transition"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                  <input
                    type="text"
                    placeholder="Subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:border-[#8B7355] focus:bg-white focus:outline-none transition"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <textarea
                    placeholder="Message"
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    rows="5"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:border-[#8B7355] focus:bg-white focus:outline-none transition resize-none"
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#8B7355] text-white px-8 py-4 rounded-lg font-semibold hover:bg-[#6B5744] transition disabled:opacity-50 shadow-lg hover:shadow-xl"
                >
                  {loading ? 'Sending...' : 'Send'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;