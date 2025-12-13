import { useState, useEffect } from 'react';
import { useNotification } from '../contexts/NotificationContext';
import API_URL from '../config/api';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('contact');
  const [loading, setLoading] = useState(false);
  const { showNotification } = useNotification();

  // Contact Info State
  const [contactInfo, setContactInfo] = useState({
    email: '',
    phone: '',
    whatsapp: '',
    address: '',
    tiktok: '',
    instagram: ''
  });

  // FAQ State
  const [faqs, setFaqs] = useState([]);
  const [showFaqModal, setShowFaqModal] = useState(false);
  const [editingFaq, setEditingFaq] = useState(null);
  const [faqForm, setFaqForm] = useState({ question: '', answer: '', category: 'general' });

  // Appearance Settings State
  const [appearanceSettings, setAppearanceSettings] = useState({
    siteName: 'Classic Carrry',
    logoImage: '',
    logoType: 'text',
    tagline: 'Premium Lifestyle Products',
    showNewsletter: true,
    showSocialMedia: true
  });

  // General Settings State
  const [generalSettings, setGeneralSettings] = useState({
    currency: 'PKR',
    currencySymbol: 'Rs',
    shippingFee: 200,
    freeShippingThreshold: 5000,
    taxRate: 0,
    orderPrefix: 'CC',
    enableCOD: true,
    enableOnlinePayment: false
  });

  // Logo Upload Handler
  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showNotification('Please select a valid image file', 'error');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      showNotification('Image size should be less than 2MB', 'error');
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('image', file);

      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_URL}/upload/logo`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();

      if (response.ok) {
        setAppearanceSettings({
          ...appearanceSettings,
          logoImage: data.imageUrl
        });
        showNotification('Logo uploaded successfully', 'success');
      } else {
        showNotification(data.message || 'Failed to upload logo', 'error');
      }
    } catch (error) {
      console.error('Logo upload error:', error);
      showNotification('Failed to upload logo', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const [contactRes, faqRes, appearanceRes, generalRes] = await Promise.all([
        fetch(`${API_URL}/settings/contact`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_URL}/settings/faqs`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_URL}/settings/appearance`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_URL}/settings/general`, { headers: { Authorization: `Bearer ${token}` } })
      ]);

      if (contactRes.ok) {
        const data = await contactRes.json();
        setContactInfo(data.data || contactInfo);
      }
      if (faqRes.ok) {
        const data = await faqRes.json();
        setFaqs(data.data || []);
      }
      if (appearanceRes.ok) {
        const data = await appearanceRes.json();
        if (data.data) setAppearanceSettings(data.data);
      }
      if (generalRes.ok) {
        const data = await generalRes.json();
        if (data.data) setGeneralSettings(data.data);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  // Contact Info Handlers
  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_URL}/settings/contact`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(contactInfo)
      });

      if (response.ok) {
        showNotification('Contact info updated successfully', 'success');
      }
    } catch (error) {
      showNotification('Failed to update contact info', 'error');
    } finally {
      setLoading(false);
    }
  };

  // FAQ Handlers
  const handleFaqSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('adminToken');
      const url = editingFaq
        ? `${API_URL}/settings/faqs/${editingFaq._id}`
        : `${API_URL}/settings/faqs`;

      const response = await fetch(url, {
        method: editingFaq ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(faqForm)
      });

      if (response.ok) {
        showNotification(`FAQ ${editingFaq ? 'updated' : 'created'} successfully`, 'success');
        setShowFaqModal(false);
        setFaqForm({ question: '', answer: '', category: 'general' });
        setEditingFaq(null);
        fetchSettings();
      }
    } catch (error) {
      showNotification('Failed to save FAQ', 'error');
    }
  };

  const handleDeleteFaq = async (id) => {
    if (!window.confirm('Delete this FAQ?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      await fetch(`${API_URL}/settings/faqs/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      showNotification('FAQ deleted', 'success');
      fetchSettings();
    } catch (error) {
      showNotification('Failed to delete FAQ', 'error');
    }
  };

  // Appearance Settings Handlers
  const handleAppearanceSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_URL}/settings/appearance`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(appearanceSettings)
      });

      if (response.ok) {
        showNotification('Appearance settings updated successfully', 'success');
      }
    } catch (error) {
      showNotification('Failed to update appearance settings', 'error');
    } finally {
      setLoading(false);
    }
  };

  // General Settings Handlers
  const handleGeneralSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_URL}/settings/general`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(generalSettings)
      });

      if (response.ok) {
        showNotification('General settings updated successfully', 'success');
      }
    } catch (error) {
      showNotification('Failed to update general settings', 'error');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'contact', label: 'Contact Info', icon: 'fa-address-book', desc: 'Manage your contact details' },
    { id: 'faq', label: 'FAQs', icon: 'fa-question-circle', desc: 'Update frequently asked questions' },
    { id: 'appearance', label: 'Appearance', icon: 'fa-palette', desc: 'Customize site look & feel' },
    { id: 'general', label: 'General', icon: 'fa-cog', desc: 'Store currency, shipping & taxes' }
  ];

  return (
    <div className="max-w-7xl mx-auto animate-fade-in space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-white mb-2 font-display">Store Settings</h1>
        <p className="text-gray-400">Configure your store preferences and information</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Navigation */}
        <div className="lg:w-1/4">
          <div className="glass-panel p-2 rounded-2xl sticky top-6">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-left px-4 py-4 rounded-xl transition-all duration-300 group ${activeTab === tab.id
                    ? 'bg-white/10 shadow-lg border border-white/10'
                    : 'hover:bg-white/5'
                    }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${activeTab === tab.id
                      ? 'bg-primary text-slate-900 shadow-md shadow-primary/20'
                      : 'bg-white/5 text-gray-400 group-hover:bg-white/10 group-hover:text-white'
                      }`}>
                      <i className={`fas ${tab.icon}`}></i>
                    </div>
                    <div>
                      <p className={`font-bold transition-colors ${activeTab === tab.id ? 'text-white' : 'text-gray-400 group-hover:text-white'
                        }`}>{tab.label}</p>
                      <p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold mt-0.5">{tab.id}</p>
                    </div>
                  </div>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:w-3/4">
          {/* Contact Info Tab */}
          {activeTab === 'contact' && (
            <div className="glass-panel p-8 rounded-2xl animate-fade-in">
              <div className="flex items-center gap-4 mb-8 pb-8 border-b border-white/5">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500/20 to-purple-600/5 text-purple-400 flex items-center justify-center border border-purple-500/20 shadow-lg shadow-purple-500/10">
                  <i className="fas fa-address-book text-2xl"></i>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white font-display">Contact Information</h2>
                  <p className="text-gray-400 text-sm">Update your business contact details visible to customers</p>
                </div>
              </div>

              <form onSubmit={handleContactSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Email Address</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                        <i className="fas fa-envelope"></i>
                      </div>
                      <input
                        type="email"
                        value={contactInfo.email}
                        onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                        className="glass-input w-full pl-10 pr-4 py-3"
                        placeholder="Same as shown on website"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Phone Number</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                        <i className="fas fa-phone"></i>
                      </div>
                      <input
                        type="text"
                        value={contactInfo.phone}
                        onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                        className="glass-input w-full pl-10 pr-4 py-3"
                        placeholder="+92 300 1234567"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">WhatsApp Number</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <i className="fab fa-whatsapp text-green-500"></i>
                      </div>
                      <input
                        type="text"
                        value={contactInfo.whatsapp}
                        onChange={(e) => setContactInfo({ ...contactInfo, whatsapp: e.target.value })}
                        className="glass-input w-full pl-10 pr-4 py-3"
                        placeholder="+92 300 1234567"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Physical Address</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                        <i className="fas fa-map-marker-alt"></i>
                      </div>
                      <input
                        type="text"
                        value={contactInfo.address}
                        onChange={(e) => setContactInfo({ ...contactInfo, address: e.target.value })}
                        className="glass-input w-full pl-10 pr-4 py-3"
                        placeholder="Your store address"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-white/5">
                  <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                    <i className="fas fa-share-alt text-primary"></i> Social Media Links
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">TikTok URL</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                          <i className="fab fa-tiktok"></i>
                        </div>
                        <input
                          type="url"
                          value={contactInfo.tiktok}
                          onChange={(e) => setContactInfo({ ...contactInfo, tiktok: e.target.value })}
                          className="glass-input w-full pl-10 pr-4 py-3"
                          placeholder="https://tiktok.com/@..."
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Instagram URL</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-pink-500">
                          <i className="fab fa-instagram"></i>
                        </div>
                        <input
                          type="url"
                          value={contactInfo.instagram}
                          onChange={(e) => setContactInfo({ ...contactInfo, instagram: e.target.value })}
                          className="glass-input w-full pl-10 pr-4 py-3"
                          placeholder="https://instagram.com/..."
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-[#D2C1B6] hover:bg-[#C4B5A8] text-slate-900 px-8 py-3.5 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm"
                  >
                    {loading ? <div className="spinner w-4 h-4 border-slate-900 border-b-transparent"></div> : <i className="fas fa-save"></i>}
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* FAQ Tab */}
          {activeTab === 'faq' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <h2 className="text-2xl font-bold text-white font-display mb-1">FAQs</h2>
                  <p className="text-gray-400 text-sm">Manage frequently asked questions</p>
                </div>
                <button
                  onClick={() => {
                    setEditingFaq(null);
                    setFaqForm({ question: '', answer: '', category: 'general' });
                    setShowFaqModal(true);
                  }}
                  className="bg-[#D2C1B6] text-gray-900 px-6 py-3 rounded-xl font-bold hover:bg-[#C4B5A8] transition shadow-lg shadow-[#D2C1B6]/20 flex items-center gap-2"
                >
                  <i className="fas fa-plus"></i> Add FAQ
                </button>
              </div>

              <div className="space-y-4">
                {faqs.map((faq) => (
                  <div key={faq._id} className="glass-panel p-6 rounded-xl hover:border-white/10 transition-colors group">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <div className="mb-3">
                          <span className={`inline-block px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider border ${faq.category === 'shipping' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                            faq.category === 'returns' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                              faq.category === 'payment' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                'bg-gray-500/10 text-gray-400 border-gray-500/20'
                            }`}>
                            {faq.category}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">{faq.question}</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">{faq.answer}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingFaq(faq);
                            setFaqForm({ question: faq.question, answer: faq.answer, category: faq.category });
                            setShowFaqModal(true);
                          }}
                          className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white transition-all flex items-center justify-center border border-blue-500/20"
                          title="Edit"
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button
                          onClick={() => handleDeleteFaq(faq._id)}
                          className="w-8 h-8 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center border border-red-500/20"
                          title="Delete"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {faqs.length === 0 && (
                  <div className="text-center py-20 glass-panel rounded-xl">
                    <i className="fas fa-question-circle text-4xl text-gray-600 mb-4"></i>
                    <p className="text-gray-400">No FAQs yet. Add your first FAQ!</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Appearance Tab */}
          {activeTab === 'appearance' && (
            <div className="glass-panel p-8 rounded-2xl animate-fade-in">
              <div className="flex items-center gap-4 mb-8 pb-8 border-b border-white/5">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500/20 to-pink-600/5 text-pink-400 flex items-center justify-center border border-pink-500/20 shadow-lg shadow-pink-500/10">
                  <i className="fas fa-palette text-2xl"></i>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white font-display">Appearance Settings</h2>
                  <p className="text-gray-400 text-sm">Customize your store's branding and visuals</p>
                </div>
              </div>

              <form onSubmit={handleAppearanceSubmit} className="space-y-8">
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Store Name</label>
                  <input
                    type="text"
                    value={appearanceSettings.siteName}
                    onChange={(e) => setAppearanceSettings({ ...appearanceSettings, siteName: e.target.value })}
                    className="glass-input w-full px-4 py-3"
                    placeholder="My Amazing Store"
                  />
                </div>

                {/* Logo Management Section */}
                <div className="p-6 rounded-xl bg-black/20 border border-white/5">
                  <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                    <i className="fas fa-image text-primary"></i> Brand Logo
                  </h3>

                  <div className="space-y-6">
                    {/* Logo Type Selector */}
                    <div>
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Logo Display Type</label>
                      <select
                        value={appearanceSettings.logoType}
                        onChange={(e) => setAppearanceSettings({ ...appearanceSettings, logoType: e.target.value })}
                        className="glass-input w-full px-4 py-3 appearance-none cursor-pointer"
                      >
                        <option value="text">Text Only</option>
                        <option value="image">Image Only</option>
                        <option value="both">Image + Text</option>
                      </select>
                    </div>

                    {/* Logo Image Upload/URL */}
                    {(appearanceSettings.logoType === 'image' || appearanceSettings.logoType === 'both') && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                        <div className="space-y-4">
                          <div>
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Upload File</label>
                            <div className="flex flex-col gap-2">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleLogoUpload}
                                className="hidden"
                                id="logo-upload"
                              />
                              <label
                                htmlFor="logo-upload"
                                className="px-6 py-8 border-2 border-dashed border-white/10 rounded-xl hover:border-primary/50 hover:bg-white/5 transition-all cursor-pointer flex flex-col items-center justify-center gap-2 group"
                              >
                                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                  <i className="fas fa-cloud-upload-alt text-gray-400 group-hover:text-primary"></i>
                                </div>
                                <span className="text-sm font-bold text-gray-300">Click to upload image</span>
                                <span className="text-xs text-gray-500">Max size 2MB (PNG, JPG, SVG)</span>
                              </label>
                            </div>
                          </div>

                          <div className="relative flex py-1 items-center">
                            <div className="flex-grow border-t border-white/10"></div>
                            <span className="flex-shrink-0 mx-4 text-gray-500 text-xs uppercase font-bold">Or use URL</span>
                            <div className="flex-grow border-t border-white/10"></div>
                          </div>

                          <div>
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Image URL</label>
                            <input
                              type="url"
                              value={appearanceSettings.logoImage}
                              onChange={(e) => setAppearanceSettings({ ...appearanceSettings, logoImage: e.target.value })}
                              className="glass-input w-full px-4 py-3"
                              placeholder="https://example.com/logo.png"
                            />
                          </div>
                        </div>

                        {/* Preview */}
                        <div className="h-full">
                          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Live Preview</label>
                          <div className="h-48 rounded-xl bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-slate-900 border border-white/10 flex items-center justify-center p-6 relative overflow-hidden">
                            <div className="absolute top-2 left-2 flex gap-1.5">
                              <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
                              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50"></div>
                              <div className="w-2.5 h-2.5 rounded-full bg-green-500/50"></div>
                            </div>

                            <div className="flex items-center gap-3">
                              {(appearanceSettings.logoType === 'image' || appearanceSettings.logoType === 'both') && (
                                <img
                                  src={appearanceSettings.logoImage || '/default-logo.svg'}
                                  alt="Logo"
                                  className="h-12 w-auto object-contain drop-shadow-lg"
                                  onError={(e) => {
                                    if (e.target.src !== '/default-logo.svg') e.target.src = '/default-logo.svg';
                                  }}
                                />
                              )}
                              {(appearanceSettings.logoType === 'text' || appearanceSettings.logoType === 'both') && (
                                <span className="text-white font-bold text-2xl font-logo" style={{ fontFamily: 'Satisfy, cursive' }}>
                                  {appearanceSettings.siteName}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Website Tagline</label>
                  <input
                    type="text"
                    value={appearanceSettings.tagline}
                    onChange={(e) => setAppearanceSettings({ ...appearanceSettings, tagline: e.target.value })}
                    className="glass-input w-full px-4 py-3"
                    placeholder="Premium Lifestyle Products"
                  />
                </div>

                <div className="pt-6 border-t border-white/5">
                  <h3 className="text-lg font-bold text-white mb-4">Display Options</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <label className="flex items-center gap-4 p-4 rounded-xl glass-card border-white/5 cursor-pointer hover:bg-white/5 transition-colors">
                      <div className={`w-6 h-6 rounded border flex items-center justify-center transition-colors ${appearanceSettings.showNewsletter ? 'bg-primary border-primary' : 'border-gray-500 bg-transparent'
                        }`}>
                        {appearanceSettings.showNewsletter && <i className="fas fa-check text-slate-900 text-xs"></i>}
                      </div>
                      <input
                        type="checkbox"
                        checked={appearanceSettings.showNewsletter}
                        onChange={(e) => setAppearanceSettings({ ...appearanceSettings, showNewsletter: e.target.checked })}
                        className="hidden"
                      />
                      <span className="font-bold text-gray-300">Show Newsletter Signup</span>
                    </label>
                    <label className="flex items-center gap-4 p-4 rounded-xl glass-card border-white/5 cursor-pointer hover:bg-white/5 transition-colors">
                      <div className={`w-6 h-6 rounded border flex items-center justify-center transition-colors ${appearanceSettings.showSocialMedia ? 'bg-primary border-primary' : 'border-gray-500 bg-transparent'
                        }`}>
                        {appearanceSettings.showSocialMedia && <i className="fas fa-check text-slate-900 text-xs"></i>}
                      </div>
                      <input
                        type="checkbox"
                        checked={appearanceSettings.showSocialMedia}
                        onChange={(e) => setAppearanceSettings({ ...appearanceSettings, showSocialMedia: e.target.checked })}
                        className="hidden"
                      />
                      <span className="font-bold text-gray-300">Show Social Media Links</span>
                    </label>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-[#D2C1B6] hover:bg-[#C4B5A8] text-slate-900 px-8 py-3.5 rounded-xl font-bold transition-all disabled:opacity-50 flex items-center gap-2 shadow-sm"
                  >
                    {loading ? <div className="spinner w-4 h-4 border-slate-900 border-b-transparent"></div> : <i className="fas fa-save"></i>}
                    Save Appearance
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* General Tab */}
          {activeTab === 'general' && (
            <div className="glass-panel p-8 rounded-2xl animate-fade-in">
              <div className="flex items-center gap-4 mb-8 pb-8 border-b border-white/5">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500/20 to-green-600/5 text-green-400 flex items-center justify-center border border-green-500/20 shadow-lg shadow-green-500/10">
                  <i className="fas fa-cogs text-2xl"></i>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white font-display">General Operations</h2>
                  <p className="text-gray-400 text-sm">Configure currency, shipping, taxes and payment methods</p>
                </div>
              </div>

              <form onSubmit={handleGeneralSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Store Currency</label>
                    <div className="relative">
                      <select
                        value={generalSettings.currency}
                        onChange={(e) => setGeneralSettings({ ...generalSettings, currency: e.target.value })}
                        className="glass-input w-full px-4 py-3 appearance-none cursor-pointer"
                      >
                        <option value="PKR">PKR - Pakistani Rupee</option>
                        <option value="USD">USD - US Dollar</option>
                        <option value="EUR">EUR - Euro</option>
                        <option value="GBP">GBP - British Pound</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-400">
                        <i className="fas fa-chevron-down text-xs"></i>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Currency Symbol</label>
                    <input
                      type="text"
                      value={generalSettings.currencySymbol}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, currencySymbol: e.target.value })}
                      className="glass-input w-full px-4 py-3"
                      placeholder="Rs"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Default Shipping Fee</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 font-bold">
                        {generalSettings.currencySymbol}
                      </div>
                      <input
                        type="number"
                        value={generalSettings.shippingFee}
                        onChange={(e) => setGeneralSettings({ ...generalSettings, shippingFee: Number(e.target.value) })}
                        className="glass-input w-full pl-10 pr-4 py-3"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Free Shipping Threshold</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 font-bold">
                        {generalSettings.currencySymbol}
                      </div>
                      <input
                        type="number"
                        value={generalSettings.freeShippingThreshold}
                        onChange={(e) => setGeneralSettings({ ...generalSettings, freeShippingThreshold: Number(e.target.value) })}
                        className="glass-input w-full pl-10 pr-4 py-3"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Tax Rate (%)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={generalSettings.taxRate}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, taxRate: Number(e.target.value) })}
                      className="glass-input w-full px-4 py-3"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Order ID Prefix</label>
                    <input
                      type="text"
                      value={generalSettings.orderPrefix}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, orderPrefix: e.target.value })}
                      className="glass-input w-full px-4 py-3"
                      placeholder="CC"
                    />
                  </div>
                </div>

                <div className="pt-6 border-t border-white/5">
                  <h3 className="text-lg font-bold text-white mb-4">Payment Methods</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <label className="flex items-center gap-4 p-4 rounded-xl glass-card border-white/5 cursor-pointer hover:bg-white/5 transition-colors">
                      <div className={`w-6 h-6 rounded border flex items-center justify-center transition-colors ${generalSettings.enableCOD ? 'bg-green-500 border-green-500' : 'border-gray-500 bg-transparent'
                        }`}>
                        {generalSettings.enableCOD && <i className="fas fa-check text-slate-900 text-xs"></i>}
                      </div>
                      <input
                        type="checkbox"
                        checked={generalSettings.enableCOD}
                        onChange={(e) => setGeneralSettings({ ...generalSettings, enableCOD: e.target.checked })}
                        className="hidden"
                      />
                      <div>
                        <p className="font-bold text-white">Cash on Delivery</p>
                        <p className="text-xs text-gray-400">Allow customers to pay upon receipt</p>
                      </div>
                    </label>
                    <label className={`flex items-center gap-4 p-4 rounded-xl glass-card border-white/5 cursor-pointer hover:bg-white/5 transition-colors ${!generalSettings.enableOnlinePayment && 'opacity-70'}`}>
                      <div className={`w-6 h-6 rounded border flex items-center justify-center transition-colors ${generalSettings.enableOnlinePayment ? 'bg-blue-500 border-blue-500' : 'border-gray-500 bg-transparent'
                        }`}>
                        {generalSettings.enableOnlinePayment && <i className="fas fa-check text-slate-900 text-xs"></i>}
                      </div>
                      <input
                        type="checkbox"
                        checked={generalSettings.enableOnlinePayment}
                        onChange={(e) => setGeneralSettings({ ...generalSettings, enableOnlinePayment: e.target.checked })}
                        className="hidden"
                      />
                      <div>
                        <p className="font-bold text-white">Online Payment</p>
                        <p className="text-xs text-gray-400">Stripe / Credit Card integration</p>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-[#D2C1B6] hover:bg-[#C4B5A8] text-slate-900 px-8 py-3.5 rounded-xl font-bold transition-all disabled:opacity-50 flex items-center gap-2 shadow-sm"
                  >
                    {loading ? <div className="spinner w-4 h-4 border-slate-900 border-b-transparent"></div> : <i className="fas fa-save"></i>}
                    Save General Settings
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* FAQ Information Modal */}
      {showFaqModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in" onClick={() => setShowFaqModal(false)}>
          <div className="glass-panel rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl border-white/10" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-black/20">
              <h2 className="text-2xl font-bold text-white font-display">
                {editingFaq ? 'Edit FAQ' : 'Add New FAQ'}
              </h2>
              <button
                onClick={() => setShowFaqModal(false)}
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all flex items-center justify-center"
              >
                <i className="fas fa-times text-lg"></i>
              </button>
            </div>

            <form onSubmit={handleFaqSubmit} className="p-6 space-y-6">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Category</label>
                <div className="relative">
                  <select
                    value={faqForm.category}
                    onChange={(e) => setFaqForm({ ...faqForm, category: e.target.value })}
                    className="glass-input w-full px-4 py-3 appearance-none cursor-pointer"
                  >
                    <option value="general">General</option>
                    <option value="shipping">Shipping</option>
                    <option value="returns">Returns</option>
                    <option value="payment">Payment</option>
                    <option value="products">Products</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-400">
                    <i className="fas fa-chevron-down text-xs"></i>
                  </div>
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Question</label>
                <input
                  type="text"
                  value={faqForm.question}
                  onChange={(e) => setFaqForm({ ...faqForm, question: e.target.value })}
                  className="glass-input w-full px-4 py-3"
                  placeholder="e.g. How do I track my order?"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Answer</label>
                <textarea
                  value={faqForm.answer}
                  onChange={(e) => setFaqForm({ ...faqForm, answer: e.target.value })}
                  className="glass-input w-full px-4 py-3 h-32 resize-none"
                  placeholder="Enter the detailed answer..."
                  required
                />
              </div>

              <div className="flex gap-4 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowFaqModal(false)}
                  className="flex-1 bg-white/5 text-gray-300 py-3 rounded-xl font-bold hover:bg-white/10 transition border border-white/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#D2C1B6] hover:bg-[#C4B5A8] text-slate-900 py-3.5 rounded-xl font-bold transition-all shadow-sm"
                >
                  {editingFaq ? 'Update FAQ' : 'Save FAQ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Settings;
