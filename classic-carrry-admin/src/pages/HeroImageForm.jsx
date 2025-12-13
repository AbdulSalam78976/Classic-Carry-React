import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { heroImageAPI } from '../services/heroImageAPI';
import { useNotification } from '../contexts/NotificationContext';
import API_URL from '../config/api';

const HeroImageForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const [formData, setFormData] = useState({
    image: '',
    order: 0,
    isActive: true
  });

  useEffect(() => {
    if (id) {
      fetchHeroImage();
    }
  }, [id]);

  const fetchHeroImage = async () => {
    try {
      const response = await heroImageAPI.getById(id);
      const data = response.data;
      setFormData({
        image: data.image,
        order: data.order,
        isActive: data.isActive
      });
      setImagePreview(data.image);
    } catch (error) {
      showNotification('Failed to fetch hero image', 'error');
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      showNotification('Image size must be less than 10MB', 'error');
      return;
    }

    const uploadFormData = new FormData();
    uploadFormData.append('image', file);

    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_URL}/upload/hero`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: uploadFormData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Upload failed');
      }

      const imageUrl = data.data.url;
      setFormData(prev => ({ ...prev, image: imageUrl }));
      setImagePreview(imageUrl);
      showNotification('Image uploaded successfully', 'success');
    } catch (error) {
      showNotification(error.message || 'Failed to upload image', 'error');
      console.error('Upload error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.image) {
      showNotification('Please upload an image', 'error');
      return;
    }

    try {
      setLoading(true);

      if (id) {
        await heroImageAPI.update(id, formData);
        showNotification('Hero image updated successfully', 'success');
      } else {
        await heroImageAPI.create(formData);
        showNotification('Hero image created successfully', 'success');
      }

      navigate('/hero-images');
    } catch (error) {
      showNotification(error.message || 'Failed to save hero image', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <div className="mb-8 flex items-center gap-4">
        <button
          onClick={() => navigate('/hero-images')}
          className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 text-white flex items-center justify-center transition-colors border border-white/5"
        >
          <i className="fas fa-arrow-left"></i>
        </button>
        <div>
          <h1 className="text-3xl font-bold text-white font-display">
            {id ? 'Edit Hero Image' : 'Add Hero Image'}
          </h1>
          <p className="text-gray-400">Configure visual slider content</p>
        </div>
      </div>

      <div className="glass-panel p-8 rounded-2xl relative overflow-hidden">
        {/* Background Decorative Blob */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

        <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
          {/* Image Upload */}
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-3">
              Hero Banner Image <span className="text-red-400">*</span>
            </label>

            <div className="space-y-4">
              {/* Upload Area */}
              <div className="flex flex-col gap-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="hero-upload"
                />
                <label
                  htmlFor="hero-upload"
                  className={`border-2 border-dashed border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-primary/50 hover:bg-white/5 transition-all group ${imagePreview ? 'hidden' : 'block'}`}
                >
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <i className="fas fa-cloud-upload-alt text-2xl text-gray-400 group-hover:text-primary"></i>
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-gray-300">Click to upload banner</p>
                    <p className="text-xs text-gray-500 mt-1">1920x1080px recommended • Max 10MB</p>
                  </div>
                </label>
              </div>

              {/* Preview Area */}
              {imagePreview && (
                <div className="relative group rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-64 object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm gap-4">
                    <label
                      htmlFor="hero-upload"
                      className="px-4 py-2 bg-white/10 hover:bg-primary hover:text-slate-900 text-white rounded-lg cursor-pointer backdrop-blur-md transition-all font-bold text-sm border border-white/20"
                    >
                      <i className="fas fa-sync-alt mr-2"></i> Change Image
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Order */}
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">
                Display Order <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                  className="glass-input w-full px-4 py-3 font-mono font-bold"
                  required
                  min="0"
                />
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-500 text-sm">
                  Lower shows first
                </div>
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">
                Status
              </label>
              <label className="flex items-center gap-4 p-3 rounded-xl glass-card border-white/5 cursor-pointer hover:bg-white/5 transition-colors h-[50px]">
                <div className={`w-10 h-6 rounded-full p-1 transition-colors duration-300 flex items-center ${formData.isActive ? 'bg-green-500' : 'bg-gray-600'}`}>
                  <div className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform duration-300 ${formData.isActive ? 'translate-x-4' : 'translate-x-0'}`}></div>
                </div>
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="hidden"
                />
                <span className={`font-bold ${formData.isActive ? 'text-green-400' : 'text-gray-400'}`}>
                  {formData.isActive ? 'Active & Visible' : 'Hidden'}
                </span>
              </label>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4 pt-4 border-t border-white/5">
            <button
              type="button"
              onClick={() => navigate('/hero-images')}
              className="px-6 py-3 rounded-xl font-bold bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition border border-white/5"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-primary to-primary-dark hover:from-primary-light hover:to-primary text-slate-900 px-8 py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-primary/25 transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? <div className="spinner w-4 h-4 border-slate-900 border-b-transparent"></div> : <i className="fas fa-save"></i>}
              {id ? 'Update Banner' : 'Publish Banner'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HeroImageForm;
