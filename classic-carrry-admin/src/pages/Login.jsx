import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import API_URL from '../config/api';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [settings, setSettings] = useState({
    siteName: 'Classic Carrry'
  });
  const [resetData, setResetData] = useState({
    email: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [formData, setFormData] = useState(() => {
    // Load saved credentials if remember me was checked
    const savedEmail = localStorage.getItem('adminRememberedEmail');
    const savedPassword = localStorage.getItem('adminRememberedPassword');
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

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch(`${API_URL}/settings/appearance`);
        if (response.ok) {
          const data = await response.json();
          if (data.data) {
            setSettings({
              siteName: data.data.siteName || 'Classic Carrry'
            });
          }
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(''); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(formData.email, formData.password);

      if (result.success) {
        // Save credentials if remember me is checked
        if (rememberMe) {
          localStorage.setItem('adminRememberedEmail', formData.email);
          localStorage.setItem('adminRememberedPassword', formData.password);
        } else {
          localStorage.removeItem('adminRememberedEmail');
          localStorage.removeItem('adminRememberedPassword');
        }

        navigate('/');
      } else {
        setError(result.message || 'Invalid email or password');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = (e) => {
    e.preventDefault();

    if (resetData.newPassword !== resetData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    if (resetData.newPassword.length < 6) {
      alert('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert('Password reset successfully!');
      setShowResetPassword(false);
      setResetData({ email: '', newPassword: '', confirmPassword: '' });
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="w-full max-w-6xl flex flex-col lg:flex-row glass-panel rounded-3xl overflow-hidden animate-fade-in-up">

        {/* Left Side - Brand Section */}
        <div className="lg:w-1/2 p-8 lg:p-16 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-blue-500/5 z-0"></div>

          <div className="relative z-10 space-y-2">
            <span className="text-4xl lg:text-5xl font-bold font-logo primary-gradient-text block">
              {settings.siteName}
            </span>
            <span className="text-xs uppercase tracking-[0.3em] text-gray-400 font-semibold ml-1">
              Admin Control Center
            </span>
          </div>

          <div className="relative z-10 my-12">
            <h1 className="text-5xl font-bold text-white mb-6 leading-tight">
              Manage your <br />
              <span className="text-primary">Empire</span> with style.
            </h1>
            <p className="text-gray-400 text-lg leading-relaxed max-w-sm">
              Advanced analytics, seamless inventory management, and complete control at your fingertips.
            </p>
          </div>

          <div className="relative z-10 space-y-4">
            <div className="flex gap-4">
              <div className="glass-card p-4 rounded-xl flex-1 text-center">
                <i className="fas fa-chart-line text-2xl text-primary mb-2"></i>
                <p className="text-xs text-gray-400 uppercase tracking-wider">Analytics</p>
              </div>
              <div className="glass-card p-4 rounded-xl flex-1 text-center">
                <i className="fas fa-box text-2xl text-blue-400 mb-2"></i>
                <p className="text-xs text-gray-400 uppercase tracking-wider">Inventory</p>
              </div>
              <div className="glass-card p-4 rounded-xl flex-1 text-center">
                <i className="fas fa-users text-2xl text-purple-400 mb-2"></i>
                <p className="text-xs text-gray-400 uppercase tracking-wider">Users</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form Section */}
        <div className="lg:w-1/2 bg-slate-900/40 p-8 lg:p-16 flex items-center justify-center backdrop-blur-sm">
          <div className="w-full max-w-md">
            {!showResetPassword ? (
              /* Login Form */
              <div className="space-y-8 animate-fade-in">
                <div className="text-center space-y-2">
                  <h2 className="text-3xl font-bold text-white">Welcome Back</h2>
                  <p className="text-gray-400">Please enter your details to sign in</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                      <i className="fas fa-exclamation-circle"></i>
                      {error}
                    </div>
                  )}

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-gray-300 ml-1">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3.5 bg-slate-800/80 border-2 border-slate-700 rounded-xl text-white placeholder-gray-500 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                        placeholder="admin@example.com"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-gray-300 ml-1">Password</label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          required
                          value={formData.password}
                          onChange={handleChange}
                          className="w-full px-4 py-3.5 pr-12 bg-slate-800/80 border-2 border-slate-700 rounded-xl text-white placeholder-gray-500 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-primary transition-colors"
                        >
                          <i className={`fas fa-${showPassword ? 'eye-slash' : 'eye'}`}></i>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 rounded border-gray-600 bg-slate-800 text-primary focus:ring-primary/50"
                      />
                      <span className="text-gray-400 group-hover:text-white transition-colors">Remember me</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowResetPassword(true)}
                      className="text-primary hover:text-primary-light font-medium transition-colors"
                    >
                      Forgot password?
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#D2C1B6] hover:bg-[#C4B5A8] text-slate-900 py-3.5 rounded-xl font-bold text-lg shadow-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
                        Signing in...
                      </span>
                    ) : (
                      'Sign In'
                    )}
                  </button>
                </form>
              </div>
            ) : (
              /* Reset Password Form */
              <div className="space-y-8 animate-fade-in">
                <div className="text-center space-y-2">
                  <button
                    onClick={() => {
                      setShowResetPassword(false);
                      setResetData({ email: '', newPassword: '', confirmPassword: '' });
                    }}
                    className="mx-auto w-10 h-10 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-gray-400 hover:text-white transition-colors mb-4"
                  >
                    <i className="fas fa-arrow-left"></i>
                  </button>
                  <h2 className="text-3xl font-bold text-white">Reset Password</h2>
                  <p className="text-gray-400">Enter your new password details</p>
                </div>

                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-gray-300 ml-1">Email Address</label>
                      <input
                        type="email"
                        required
                        value={resetData.email}
                        onChange={(e) => setResetData({ ...resetData, email: e.target.value })}
                        className="w-full px-4 py-3.5 bg-slate-800/80 border-2 border-slate-700 rounded-xl text-white placeholder-gray-500 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                        placeholder="your@email.com"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-gray-300 ml-1">New Password</label>
                      <input
                        type="password"
                        required
                        value={resetData.newPassword}
                        onChange={(e) => setResetData({ ...resetData, newPassword: e.target.value })}
                        className="w-full px-4 py-3.5 bg-slate-800/80 border-2 border-slate-700 rounded-xl text-white placeholder-gray-500 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                        placeholder="Min. 6 characters"
                        minLength={6}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-gray-300 ml-1">Confirm Password</label>
                      <input
                        type="password"
                        required
                        value={resetData.confirmPassword}
                        onChange={(e) => setResetData({ ...resetData, confirmPassword: e.target.value })}
                        className="w-full px-4 py-3.5 bg-slate-800/80 border-2 border-slate-700 rounded-xl text-white placeholder-gray-500 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                        placeholder="Re-enter password"
                        minLength={6}
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleResetPassword}
                    disabled={loading}
                    className="w-full bg-[#D2C1B6] hover:bg-[#C4B5A8] text-slate-900 py-3.5 rounded-xl font-bold text-lg shadow-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
                        Resetting...
                      </span>
                    ) : (
                      'Reset Password'
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;