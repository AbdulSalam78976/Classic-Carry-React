import { createContext, useContext, useState, useEffect } from 'react';

const SettingsContext = createContext();

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within SettingsProvider');
  }
  return context;
};

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    appearance: {
      siteName: 'Classic Carrry',
      tagline: 'Premium Lifestyle Products',
      primaryColor: '#8B7355',
      secondaryColor: '#D2C1B6',
      showNewsletter: true,
      showSocialMedia: true
    },
    general: {
      currency: 'PKR',
      currencySymbol: 'Rs',
      shippingFee: 200,
      freeShippingThreshold: 5000,
      taxRate: 0,
      orderPrefix: 'CC',
      enableCOD: true,
      enableOnlinePayment: false
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const [appearanceRes, generalRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/settings/appearance`),
        fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/settings/general`)
      ]);

      const appearance = appearanceRes.ok ? (await appearanceRes.json()).data : settings.appearance;
      const general = generalRes.ok ? (await generalRes.json()).data : settings.general;

      setSettings({
        appearance: appearance || settings.appearance,
        general: general || settings.general
      });
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SettingsContext.Provider value={{ settings, loading, refreshSettings: fetchSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};
