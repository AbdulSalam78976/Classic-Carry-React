import { createContext, useContext, useState, useEffect } from 'react';
import BackendErrorPage from '../components/BackendErrorPage';

const BackendHealthContext = createContext();

import API_URL from '../config/api';

export const BackendHealthProvider = ({ children }) => {
  const [isBackendHealthy, setIsBackendHealthy] = useState(true);
  const [isChecking, setIsChecking] = useState(true);

  const checkBackendHealth = async (isInitialCheck = false) => {
    try {
      // Only show loading screen on initial check
      if (isInitialCheck) {
        setIsChecking(true);
      }
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
      
      const response = await fetch(`${API_URL}/products?limit=1`, {
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        setIsBackendHealthy(true);
      } else {
        setIsBackendHealthy(false);
      }
    } catch (error) {
      console.error('Backend health check failed:', error);
      setIsBackendHealthy(false);
    } finally {
      if (isInitialCheck) {
        setIsChecking(false);
      }
    }
  };

  useEffect(() => {
    // Initial health check with loading screen
    checkBackendHealth(true);
    
    // Periodic health check every 30 seconds (without loading screen)
    const interval = setInterval(() => checkBackendHealth(false), 30000);
    
    return () => clearInterval(interval);
  }, []);

  if (isChecking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 flex items-center justify-center overflow-hidden">
        <div className="text-center relative px-4">
          {/* Animated background elements */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#8B7355]/5 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#A68A6F]/10 rounded-full blur-2xl animate-pulse delay-75"></div>
          </div>

          {/* Logo/Brand */}
          <div className="mb-8 relative">
            <div className="w-32 h-32 mx-auto bg-gradient-to-br from-[#8B7355] to-[#A68A6F] rounded-3xl flex items-center justify-center shadow-2xl transform hover:scale-105 transition-transform">
              <div className="text-6xl">✨</div>
            </div>
            <div className="absolute -inset-6 bg-gradient-to-r from-[#8B7355]/20 via-[#A68A6F]/20 to-transparent rounded-full blur-2xl animate-pulse"></div>
          </div>

          {/* Brand Name */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Satisfy, cursive' }}>
            Classic Carrry
          </h1>
          <p className="text-gray-600 text-lg mb-8">Premium Lifestyle Products</p>

          {/* Circular Progress Ring */}
          <div className="relative mb-6">
            <svg className="w-8 h-8 mx-auto" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#E5E7EB"
                strokeWidth="8"
              />
              {/* Animated progress circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="url(#gradient)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray="283"
                strokeDashoffset="283"
                transform="rotate(-90 50 50)"
                className="animate-progress-ring"
              />
              {/* Gradient definition */}
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#8B7355" />
                  <stop offset="100%" stopColor="#A68A6F" />
                </linearGradient>
              </defs>
            </svg>
           
          </div>

         
  
        </div>
      </div>
    );
  }

  if (!isBackendHealthy) {
    return <BackendErrorPage />;
  }

  return (
    <BackendHealthContext.Provider value={{ isBackendHealthy, checkBackendHealth }}>
      {children}
    </BackendHealthContext.Provider>
  );
};

export const useBackendHealth = () => {
  const context = useContext(BackendHealthContext);
  if (!context) {
    throw new Error('useBackendHealth must be used within BackendHealthProvider');
  }
  return context;
};
