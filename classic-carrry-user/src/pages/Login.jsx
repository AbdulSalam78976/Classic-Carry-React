import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';

// Logo import removed as requested

// Shared Input Component
const AuthInput = ({ icon, ...props }) => (
  <div className="relative w-full mb-4">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <i className={`fas ${icon} text-gray-400 text-sm`}></i>
    </div>
    <input
      {...props}
      className="w-full pl-10 pr-3 py-3 rounded-md border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm bg-white placeholder-gray-400"
    />
  </div>
);

const Login = ({ initialIsSignUp = false }) => {
  const [isSignUp, setIsSignUp] = useState(initialIsSignUp);
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register } = useAuth();
  const { showNotification } = useNotification();
  const [loading, setLoading] = useState(false);

  // Form States
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({ name: '', email: '', password: '' });

  // Update internal state if prop changes (e.g. navigation between /login and /register)
  useEffect(() => {
    setIsSignUp(initialIsSignUp);
  }, [initialIsSignUp]);

  const handleLoginChange = (e) => setLoginData({ ...loginData, [e.target.name]: e.target.value });
  const handleRegisterChange = (e) => setRegisterData({ ...registerData, [e.target.name]: e.target.value });

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!loginData.email || !loginData.password) {
      showNotification('Please fill in all fields', 'error');
      return;
    }
    setLoading(true);
    try {
      const result = await login(loginData.email, loginData.password);
      if (result.success) {
        showNotification('Welcome back!', 'success');
        const from = location.state?.from?.pathname || '/';
        navigate(from, { replace: true });
      } else {
        showNotification(result.message || 'Login failed', 'error');
      }
    } catch {
      showNotification('An error occurred', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!registerData.name || !registerData.email || !registerData.password) {
      showNotification('Please fill in all fields', 'error');
      return;
    }
    setLoading(true);
    try {
      const result = await register({ ...registerData });
      if (result.success) {
        showNotification('Account created successfully!', 'success');
        navigate('/');
      } else {
        showNotification(result.message || 'Registration failed', 'error');
      }
    } catch {
      showNotification('An error occurred', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-100 flex items-center justify-center p-4 overflow-hidden relative">
      <Link to="/" className="absolute top-8 right-8 z-[60] text-gray-500 hover:text-primary transition-colors flex items-center gap-2 font-medium bg-white/50 px-4 py-2 rounded-full backdrop-blur-sm hover:bg-white shadow-sm">
        <i className="fas fa-home"></i>
        <span>Back to Home</span>
      </Link>

      <div className={`bg-white rounded-lg shadow-2xl relative overflow-hidden w-full max-w-[900px] min-h-[550px] flex`}>

        {/* Sign Up Container - LEFT SIDE (0-50%) */}
        {/* Initially Visible on Left? No, Plan is: Overlay (Left) covers Register. Login (Right) is visible. */}
        {/* So Register is UNDER overlay on Left. */}
        <div className={`absolute top-0 left-0 h-full w-1/2 flex flex-col items-center justify-center px-12 transition-opacity duration-500 ${isSignUp ? 'opacity-100 z-20' : 'opacity-0 z-10'}`}>
          <form onSubmit={handleRegisterSubmit} className="w-full text-center">
            <div className="mb-6 flex justify-center">
              <img src="/assets/images/logo.png" alt="Company Logo" className="h-12 w-auto object-contain" />
            </div>
            <h1 className="font-display text-2xl font-bold mb-2 text-gray-900">Create Account</h1>
            <p className="text-gray-500 text-sm mb-8">Join us for premium deals</p>

            <AuthInput icon="fa-user" type="text" name="name" placeholder="Full Name" value={registerData.name} onChange={handleRegisterChange} />
            <AuthInput icon="fa-envelope" type="email" name="email" placeholder="Email Address" value={registerData.email} onChange={handleRegisterChange} />
            <AuthInput icon="fa-lock" type="password" name="password" placeholder="Password" value={registerData.password} onChange={handleRegisterChange} />

            <button disabled={loading} className="w-full bg-primary text-white text-sm font-medium py-3 rounded-md hover:bg-primary-dark transition-all shadow-md mt-4">
              {loading ? 'Creating...' : 'Sign Up'}
            </button>
          </form>
        </div>

        {/* Sign In Container - RIGHT SIDE (50-100%) */}
        {/* Initially Visible on Right. */}
        <div className={`absolute top-0 left-1/2 h-full w-1/2 flex flex-col items-center justify-center px-12 transition-opacity duration-500 ${!isSignUp ? 'opacity-100 z-20' : 'opacity-0 z-10'}`}>
          <form onSubmit={handleLoginSubmit} className="w-full text-center">
            <div className="mb-6 flex justify-center">
              <img src="/assets/images/logo.png" alt="Company Logo" className="h-12 w-auto object-contain" />
            </div>
            <h1 className="font-display text-2xl font-bold mb-2 text-gray-900">Welcome Back</h1>
            <p className="text-gray-500 text-sm mb-8">Ship Smarter Today</p>

            <AuthInput icon="fa-envelope" type="email" name="email" placeholder="Username or email" value={loginData.email} onChange={handleLoginChange} />
            <AuthInput icon="fa-lock" type="password" name="password" placeholder="Password" value={loginData.password} onChange={handleLoginChange} />

            <div className="flex items-center justify-between w-full mb-6 mt-2">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary" />
                <span className="text-xs text-gray-500">Remember Me</span>
              </label>
              <Link to="/forgot-password" className="text-xs text-primary hover:underline font-medium">Forgot Password?</Link>
            </div>

            <button disabled={loading} className="w-full bg-primary text-white text-sm font-medium py-3 rounded-md hover:bg-primary-dark transition-all shadow-md flex items-center justify-center gap-2">
              {loading ? 'Signing In...' : 'Sign In'}
              {!loading && <i className="fas fa-arrow-right"></i>}
            </button>
          </form>
        </div>

        {/* Overlay Container */}
        {/*
            Logic:
            - isSignUp (False): Overlay on LEFT (0%). Covers Register. Reveals Login (Right).
            - isSignUp (True): Overlay on RIGHT (50%). Covers Login. Reveals Register (Left).
         */}
        <div
          className={`absolute top-0 left-0 h-full w-1/2 overflow-hidden transition-transform duration-700 ease-in-out z-50 ${isSignUp ? 'translate-x-full' : 'translate-x-0'}`}
        >
          <div
            className={`bg-primary text-white h-full w-full relative flex items-center justify-center`}
            style={{
              backgroundImage: "url('/assets/images/hero/1.webp')",
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            {/* Added darker overlay for better text visibility */}
            <div className="absolute inset-0 bg-black/50 z-0"></div>
            <div className="absolute inset-0 bg-primary/40 mix-blend-multiply z-0"></div>

            {/* Content inside Overlay */}
            <div className="relative z-10 px-10 text-center text-white">
              <h2 className="font-display text-3xl font-bold mb-4 drop-shadow-lg">
                {isSignUp ? "Already User?" : "New Here?"}
              </h2>
              <p className="text-sm opacity-90 mb-8 leading-relaxed drop-shadow-md font-medium">
                {isSignUp
                  ? "To keep connected with us please login with your personal info."
                  : "Sign up and discover a great amount of new opportunities!"}
              </p>
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="bg-transparent border-2 border-white text-white text-xs font-bold uppercase py-3 px-8 rounded-md hover:bg-white hover:text-primary transition-all shadow-lg"
              >
                {isSignUp ? "Sign In" : "Sign Up"}
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Mobile Fallback */}
      <div className="lg:hidden absolute inset-0 bg-white z-[200] flex flex-col items-center justify-center p-6" style={{ display: window.innerWidth < 1024 ? 'flex' : 'none' }}>
        <div className="absolute top-6 left-6 grid gap-4">
           <img src="/assets/images/logo.png" alt="Company Logo" className="h-10 w-auto object-contain" />
        </div>
        <Link to="/" className="absolute top-6 right-6 text-gray-500 hover:text-primary font-medium text-sm">
          Skip to Home
        </Link>

        {isSignUp ? (
          <form onSubmit={handleRegisterSubmit} className="w-full max-w-sm flex flex-col items-center text-center">
            <h1 className="font-display text-2xl font-bold mb-2 text-gray-900">Create Account</h1>
            <p className="text-gray-500 text-sm mb-6">Join us for premium deals</p>
            <AuthInput icon="fa-user" type="text" name="name" placeholder="Full Name" value={registerData.name} onChange={handleRegisterChange} />
            <AuthInput icon="fa-envelope" type="email" name="email" placeholder="Email" value={registerData.email} onChange={handleRegisterChange} />
            <AuthInput icon="fa-lock" type="password" name="password" placeholder="Password" value={registerData.password} onChange={handleRegisterChange} />
            <button disabled={loading} className="w-full bg-primary text-white font-medium py-3 rounded-md mt-4 mb-4">{loading ? '...' : 'Sign Up'}</button>
            <button type="button" onClick={() => setIsSignUp(false)} className="text-primary text-sm font-medium">Already have an account? Sign In</button>
          </form>
        ) : (
          <form onSubmit={handleLoginSubmit} className="w-full max-w-sm flex flex-col items-center text-center">
            <h1 className="font-display text-2xl font-bold mb-2 text-gray-900">Welcome Back</h1>
            <p className="text-gray-500 text-sm mb-6">Ship Smarter Today</p>
            <AuthInput icon="fa-envelope" type="email" name="email" placeholder="Username or email" value={loginData.email} onChange={handleLoginChange} />
            <AuthInput icon="fa-lock" type="password" name="password" placeholder="Password" value={loginData.password} onChange={handleLoginChange} />
            <div className="flex items-center justify-between w-full mb-6">
              <label className="flex items-center space-x-2"><input type="checkbox" className="w-4 h-4 rounded text-primary" /><span className="text-xs text-gray-500">Remember Me</span></label>
              <Link to="/forgot-password" className="text-xs text-primary">Forgot Password?</Link>
            </div>
            <button disabled={loading} className="w-full bg-primary text-white font-medium py-3 rounded-md mb-4">{loading ? '...' : 'Sign In'}</button>
            <button type="button" onClick={() => setIsSignUp(true)} className="text-primary text-sm font-medium">Don't have an account? Sign Up</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;