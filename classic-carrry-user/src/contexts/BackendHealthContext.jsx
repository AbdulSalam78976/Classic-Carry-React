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
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <img src="/assets/images/logo.png" alt="dKart" className="h-16 w-auto mx-auto mb-6" />
          <div className="w-12 h-12 border-4 border-gray-200 border-t-[#D2C1B6] rounded-full animate-spin mx-auto"></div>
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
