import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showNotification } = useNotification();
  const [loading, setLoading] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [resetData, setResetData] = useState({
    email: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await login(formData.email, formData.password);

    if (result.success) {
      showNotification('Login successful!', 'success');
      navigate('/');
    } else {
      showNotification(result.message || 'Login failed', 'error');
    }

    setLoading(false);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (resetData.newPassword !== resetData.confirmPassword) {
      showNotification('Passwords do not match!', 'error');
      return;
    }

    if (resetData.newPassword.length < 6) {
      showNotification('Password must be at least 6 characters long', 'error');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/users/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: resetData.email,
          newPassword: resetData.newPassword
        })
      });

      const data = await response.json();

      if (response.ok) {
        showNotification('Password reset successfully! You can now login.', 'success');
        setShowResetPassword(false);
        setResetData({ email: '', newPassword: '', confirmPassword: '' });
        setFormData(prev => ({ ...prev, email: resetData.email }));
      } else {
        showNotification(data.message || 'Failed to reset password', 'error');
      }
    } catch (error) {
      showNotification('Failed to reset password. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex">
      {/* Left Side - Brand Section */}
      <div className="hidden lg:flex flex-1 flex-col justify-between p-12 relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-400/20 to-amber-600/20"></div>
        </div>
        
        {/* Logo */}
        <div className="relative">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center shadow-lg">
              <i className="fas fa-shopping-bag text-white text-lg"></i>
            </div>
            <span className="text-2xl font-bold text-white">Classic Carrry</span>
          </div>
        </div>

        {/* Center Content */}
        <div className="relative flex-1 flex flex-col justify-center max-w-md">
          <div className="space-y-6">
            <h1 className="text-5xl font-bold text-white leading-tight">
              Elevate Your
              <span className="block bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
                E-commerce
              </span>
              Experience
            </h1>
            <p className="text-gray-300 text-lg leading-relaxed">
              Manage your inventory, track orders, and grow your business with our powerful admin dashboard.
            </p>
          </div>
        </div>

        {/* Bottom Features */}
        <div className="relative grid grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
              <i className="fas fa-chart-line text-amber-400"></i>
            </div>
            <p className="text-gray-400 text-sm">Analytics</p>
          </div>
          <div className="text-center">
            <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
              <i className="fas fa-box text-amber-400"></i>
            </div>
            <p className="text-gray-400 text-sm">Inventory</p>
          </div>
          <div className="text-center">
            <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
              <i className="fas fa-users text-amber-400"></i>
            </div>
            <p className="text-gray-400 text-sm">Customers</p>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {!showResetPassword ? (
            /* Login Form */
            <div className="animate-fade-in">
              {/* Mobile Logo */}
              <div className="lg:hidden flex justify-center mb-12">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center">
                    <i className="fas fa-shopping-bag text-white text-sm"></i>
                  </div>
                  <span className="text-xl font-bold text-white">Classic Carrry</span>
                </div>
              </div>

              {/* Login Card */}
              <div className="bg-white/5 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 p-10">
                <div className="text-center mb-10">
                  <h2 className="text-3xl font-bold text-white mb-3">Welcome Back</h2>
                  <p className="text-gray-400">Sign in to your admin account</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-3">
                        Email Address
                      </label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <i className="fas fa-envelope text-gray-400 text-sm group-focus-within:text-amber-400 transition-colors"></i>
                        </div>
                        <input
                          type="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full pl-11 pr-4 py-4 bg-white/5 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 focus:outline-none transition-all duration-300"
                          placeholder="admin@classiccarrry.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-3">
                        Password
                      </label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <i className="fas fa-lock text-gray-400 text-sm group-focus-within:text-amber-400 transition-colors"></i>
                        </div>
                        <input
                          type="password"
                          name="password"
                          required
                          value={formData.password}
                          onChange={handleChange}
                          className="w-full pl-11 pr-4 py-4 bg-white/5 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 focus:outline-none transition-all duration-300"
                          placeholder="Enter your password"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setShowResetPassword(true)}
                      className="text-sm text-amber-400 hover:text-amber-300 transition-colors font-medium"
                    >
                      Forgot password?
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-3">
                        <i className="fas fa-spinner fa-spin"></i>
                        Signing in...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-3">
                        <i className="fas fa-sign-in-alt"></i>
                        Sign In
                      </span>
                    )}
                  </button>
                </form>
              </div>
            </div>
          ) : (
            /* Reset Password Form */
            <div className="animate-fade-in">
              {/* Mobile Logo */}
              <div className="lg:hidden flex justify-center mb-12">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center">
                    <i className="fas fa-key text-white text-sm"></i>
                  </div>
                  <span className="text-xl font-bold text-white">Classic Carrry</span>
                </div>
              </div>

              {/* Reset Card */}
              <div className="bg-white/5 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 p-10">
                <div className="text-center mb-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <i className="fas fa-key text-white text-xl"></i>
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-3">Reset Password</h2>
                  <p className="text-gray-400">Enter your details to reset password</p>
                </div>

                <form onSubmit={handleResetPassword} className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-3">
                        Email Address
                      </label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <i className="fas fa-envelope text-gray-400 text-sm group-focus-within:text-blue-400 transition-colors"></i>
                        </div>
                        <input
                          type="email"
                          required
                          value={resetData.email}
                          onChange={(e) => setResetData({ ...resetData, email: e.target.value })}
                          className="w-full pl-11 pr-4 py-4 bg-white/5 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 focus:outline-none transition-all duration-300"
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-3">
                        New Password
                      </label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <i className="fas fa-lock text-gray-400 text-sm group-focus-within:text-blue-400 transition-colors"></i>
                        </div>
                        <input
                          type="password"
                          required
                          value={resetData.newPassword}
                          onChange={(e) => setResetData({ ...resetData, newPassword: e.target.value })}
                          className="w-full pl-11 pr-4 py-4 bg-white/5 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 focus:outline-none transition-all duration-300"
                          placeholder="Enter new password"
                          minLength="6"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-3">
                        Confirm Password
                      </label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <i className="fas fa-lock text-gray-400 text-sm group-focus-within:text-blue-400 transition-colors"></i>
                        </div>
                        <input
                          type="password"
                          required
                          value={resetData.confirmPassword}
                          onChange={(e) => setResetData({ ...resetData, confirmPassword: e.target.value })}
                          className="w-full pl-11 pr-4 py-4 bg-white/5 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 focus:outline-none transition-all duration-300"
                          placeholder="Confirm new password"
                          minLength="6"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-3">
                        <i className="fas fa-spinner fa-spin"></i>
                        Resetting Password...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-3">
                        <i className="fas fa-check"></i>
                        Reset Password
                      </span>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowResetPassword(false);
                      setResetData({ email: '', newPassword: '', confirmPassword: '' });
                    }}
                    className="w-full text-gray-400 hover:text-white transition-colors text-sm py-3 font-medium text-center"
                  >
                    <i className="fas fa-arrow-left mr-2"></i>
                    Back to Login
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;