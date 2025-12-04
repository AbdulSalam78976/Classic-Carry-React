import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import { useSettings } from '../contexts/SettingsContext';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { showNotification } = useNotification();
  const { settings } = useSettings();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [formData, setFormData] = useState(() => {
    // Load saved credentials if remember me was checked
    const savedEmail = localStorage.getItem('rememberedEmail');
    const savedPassword = localStorage.getItem('rememberedPassword');
    if (savedEmail && savedPassword) {
      setRememberMe(true);
      return {
        email: savedEmail,
        password: savedPassword
      };
    }
    return {
      email: '',
      password: ''
    };
  });

  const from = location.state?.from?.pathname || '/';

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      showNotification('Please fill in all fields', 'error');
      return;
    }

    setLoading(true);

    try {
      const result = await login(formData.email, formData.password);

      if (result.success) {
        // Save credentials if remember me is checked
        if (rememberMe) {
          localStorage.setItem('rememberedEmail', formData.email);
          localStorage.setItem('rememberedPassword', formData.password);
        } else {
          localStorage.removeItem('rememberedEmail');
          localStorage.removeItem('rememberedPassword');
        }
        
        showNotification('Welcome back! Login successful', 'success');
        navigate(from, { replace: true });
      } else {
        showNotification(result.message || 'Invalid email or password', 'error');
      }
    } catch (error) {
      showNotification('An error occurred during login', 'error');
    } finally {
      setLoading(false);
    }
  };

  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-8 md:py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <div className="flex items-center justify-center gap-3 mb-2">
              <span className="text-4xl font-bold text-gray-700" style={{ fontFamily: 'Satisfy, cursive' }}>{settings.appearance.siteName}</span>
              <span className="text-3xl">{settings.appearance.brandEmoji || '🛍️'}</span>
            </div>
          </Link>
          <p className="text-gray-600">Premium Lifestyle Products</p>
        </div>

        <div className="max-w-md mx-auto">
          {/* Login Card */}
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
          

            {/* Card Body */}
            <div className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <i className="fas fa-envelope mr-2 text-[#8B7355]"></i>
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-4 pl-12 rounded-xl bg-gray-50 text-gray-900 border-2 border-gray-200 focus:border-[#8B7355] focus:bg-white focus:ring-2 focus:ring-[#8B7355] focus:ring-opacity-20 focus:outline-none transition-all duration-300"
                      placeholder="your.email@example.com"
                    />
                    <i className="fas fa-envelope absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <i className="fas fa-lock mr-2 text-[#8B7355]"></i>
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full px-4 py-4 pl-12 pr-12 rounded-xl bg-gray-50 text-gray-900 border-2 border-gray-200 focus:border-[#8B7355] focus:bg-white focus:ring-2 focus:ring-[#8B7355] focus:ring-opacity-20 focus:outline-none transition-all duration-300"
                      placeholder="Enter your password"
                    />
                    <i className="fas fa-lock absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#8B7355] transition-colors duration-200"
                    >
                      <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                    </button>
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 text-[#8B7355] border-gray-300 rounded focus:ring-[#8B7355]" 
                    />
                    <span className="text-sm text-gray-600">Remember me</span>
                  </label>
                  <Link to="/forgot-password" className="text-sm text-[#8B7355] hover:text-[#6B5744] font-semibold transition-colors duration-200">
                    Forgot password?
                  </Link>
                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-[#8B7355] to-[#A68A6F] text-white px-6 py-4 rounded-xl font-bold hover:shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-none"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Signing in...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <i className="fas fa-sign-in-alt"></i>
                      Sign In
                    </span>
                  )}
                </button>

              
              </form>

              {/* Divider */}
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">New to {settings.appearance.siteName}?</span>
                </div>
              </div>

              {/* Register Link */}
              <div className="text-center">
                <Link 
                  to="/register" 
                  className="inline-flex items-center gap-2 px-6 py-3 border-2 border-[#8B7355] text-[#8B7355] rounded-xl font-semibold hover:bg-[#8B7355] hover:text-white transition-all duration-300 transform hover:scale-105"
                >
                  <i className="fas fa-user-plus"></i>
                  Create New Account
                </Link>
              </div>
            </div>

          </div>

          {/* Additional Links */}
          <div className="text-center mt-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <Link to="/" className="text-gray-600 hover:text-[#8B7355] transition-colors duration-200 flex items-center justify-center gap-2">
                <i className="fas fa-home"></i>
                Back to Home
              </Link>
              <Link to="/products" className="text-gray-600 hover:text-[#8B7355] transition-colors duration-200 flex items-center justify-center gap-2">
                <i className="fas fa-shopping-bag"></i>
                Continue Shopping
              </Link>
              <Link to="/contact" className="text-gray-600 hover:text-[#8B7355] transition-colors duration-200 flex items-center justify-center gap-2">
                <i className="fas fa-headset"></i>
                Need Help?
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;