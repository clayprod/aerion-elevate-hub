import { useState, useEffect, useCallback } from 'react';

export interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
}

export interface CookieConsent {
  accepted: boolean;
  timestamp: number;
  preferences: CookiePreferences;
  version: string;
}

const COOKIE_VERSION = '1.0';
const STORAGE_KEY = 'aerion_cookie_consent';

const defaultPreferences: CookiePreferences = {
  necessary: true, // Always true, cannot be disabled
  analytics: false,
  marketing: false,
  preferences: false,
};

export const useCookies = () => {
  const [consent, setConsent] = useState<CookieConsent | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load consent from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as CookieConsent;
        // Check if version is current
        if (parsed.version === COOKIE_VERSION) {
          setConsent(parsed);
        } else {
          // Version mismatch, reset to default
          localStorage.removeItem(STORAGE_KEY);
        }
      }
    } catch (error) {
      console.error('Error loading cookie consent:', error);
      localStorage.removeItem(STORAGE_KEY);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save consent to localStorage
  const saveConsent = useCallback((preferences: CookiePreferences) => {
    const newConsent: CookieConsent = {
      accepted: true,
      timestamp: Date.now(),
      preferences: {
        ...preferences,
        necessary: true, // Always true
      },
      version: COOKIE_VERSION,
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newConsent));
      setConsent(newConsent);
      
      // Initialize analytics if accepted
      if (preferences.analytics) {
        initializeAnalytics();
      }
      
      // Initialize marketing if accepted
      if (preferences.marketing) {
        initializeMarketing();
      }
    } catch (error) {
      console.error('Error saving cookie consent:', error);
    }
  }, []);

  // Decline all cookies
  const declineAll = useCallback(() => {
    const declinedConsent: CookieConsent = {
      accepted: false,
      timestamp: Date.now(),
      preferences: defaultPreferences,
      version: COOKIE_VERSION,
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(declinedConsent));
      setConsent(declinedConsent);
    } catch (error) {
      console.error('Error declining cookies:', error);
    }
  }, []);

  // Accept all cookies
  const acceptAll = useCallback(() => {
    const allAccepted: CookiePreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true,
    };
    saveConsent(allAccepted);
  }, [saveConsent]);

  // Check if specific cookie type is allowed
  const isAllowed = useCallback((type: keyof CookiePreferences) => {
    if (!consent) return false;
    return consent.preferences[type];
  }, [consent]);

  // Reset consent (for testing or user request)
  const resetConsent = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setConsent(null);
  }, []);

  return {
    consent,
    isLoading,
    saveConsent,
    declineAll,
    acceptAll,
    isAllowed,
    resetConsent,
    hasConsent: !!consent,
  };
};

// Analytics initialization
const initializeAnalytics = () => {
  // Google Analytics or other analytics tools
  console.log('Analytics initialized');
  
  // Example: Initialize Google Analytics
  // gtag('consent', 'update', {
  //   'analytics_storage': 'granted'
  // });
};

// Marketing initialization
const initializeMarketing = () => {
  // Marketing tools initialization
  console.log('Marketing tools initialized');
  
  // Example: Initialize Facebook Pixel
  // fbq('consent', 'grant');
};

// Utility functions for cookie management
export const setCookie = (name: string, value: string, days: number = 365) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
};

export const getCookie = (name: string): string | null => {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};

export const deleteCookie = (name: string) => {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
};
