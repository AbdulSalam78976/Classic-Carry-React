import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { heroImageAPI } from '../services/heroImageAPI';
import { useNotification } from '../contexts/NotificationContext';

const HeroImages = () => {
  const [heroImages, setHeroImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showNotification } = useNotification();

  useEffect(() => {
    fetchHeroImages();
  }, []);

  const fetchHeroImages = async () => {
    try {
      const response = await heroImageAPI.getAll();
      setHeroImages(response.data || []);
    } catch (error) {
      showNotification('Failed to fetch hero images', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await heroImageAPI.toggleStatus(id);
      showNotification('Status updated successfully', 'success');
      fetchHeroImages();
    } catch (error) {
      showNotification('Failed to update status', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this hero image?')) return;

    try {
      await heroImageAPI.delete(id);
      showNotification('Hero image deleted successfully', 'success');
      fetchHeroImages();
    } catch (error) {
      showNotification('Failed to delete hero image', 'error');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-100px)]">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2 font-display">Hero Showcase</h1>
          <p className="text-gray-400">Manage the hero section slider images</p>
        </div>
        <Link
          to="/hero-images/new"
          className="bg-[#D2C1B6] hover:bg-[#C4B5A8] text-slate-900 px-6 py-3 rounded-xl font-bold transition-all duration-300 flex items-center gap-2 shadow-sm"
        >
          <i className="fas fa-plus"></i>
          <span>Add Image</span>
        </Link>
      </div>

      {heroImages.length === 0 ? (
        <div className="glass-panel p-16 rounded-2xl text-center">
          <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/10">
            <i className="fas fa-images text-5xl text-gray-500"></i>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2 font-display">No Hero Images</h2>
          <p className="text-gray-400 mb-8">Add your first promotional banner to the home page.</p>
          <Link
            to="/hero-images/new"
            className="inline-flex items-center gap-2 text-primary font-bold hover:text-primary-light transition"
          >
            Get Started <i className="fas fa-arrow-right"></i>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {heroImages.map((image) => (
            <div key={image._id} className="group relative rounded-2xl overflow-hidden glass-panel border-0 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300">
              {/* Image Container */}
              <div className="aspect-w-16 aspect-h-9 w-full bg-gray-900">
                <img
                  src={image.image}
                  alt="Hero"
                  className="w-full h-64 object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />

                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90"></div>
              </div>

              {/* Status Badge */}
              <div className="absolute top-4 left-4">
                <button
                  onClick={() => handleToggleStatus(image._id)}
                  className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md border transition-all ${image.isActive
                    ? 'bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/30'
                    : 'bg-red-500/20 text-red-400 border-red-500/30 hover:bg-red-500/30'
                    }`}
                >
                  {image.isActive ? 'Active' : 'Inactive'}
                </button>
              </div>

              {/* Order Badge */}
              <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md border border-white/10 px-3 py-1 rounded-lg text-xs font-bold text-white flex items-center gap-1 shadow-lg">
                <span className="text-gray-400 uppercase text-[10px]">Order</span>
                <span className="text-primary">{image.order}</span>
              </div>

              {/* Actions */}
              <div className="absolute bottom-0 left-0 right-0 p-6 flex justify-between items-end translate-y-0 transition-transform duration-300">
                <div>
                  <h3 className="text-white font-bold text-lg mb-1 drop-shadow-md">Hero Banner #{image.order}</h3>
                  <p className="text-gray-400 text-xs">ID: {image._id.slice(-6)}</p>
                </div>
                <div className="flex gap-2">
                  <Link
                    to={`/hero-images/edit/${image._id}`}
                    className="w-8 h-8 rounded-lg bg-white/10 hover:bg-primary hover:text-slate-900 text-white backdrop-blur-md border border-white/10 flex items-center justify-center transition-all shadow-lg"
                    title="Edit"
                  >
                    <i className="fas fa-edit"></i>
                  </Link>
                  <button
                    onClick={() => handleDelete(image._id)}
                    className="w-8 h-8 rounded-lg bg-white/10 hover:bg-red-500 text-white backdrop-blur-md border border-white/10 flex items-center justify-center transition-all shadow-lg"
                    title="Delete"
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HeroImages;
