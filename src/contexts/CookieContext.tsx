import React, { createContext, useContext, ReactNode } from 'react';
import { useCookies, CookiePreferences } from '@/hooks/useCookies';

interface CookieContextType {
  consent: ReturnType<typeof useCookies>['consent'];
  isLoading: boolean;
  saveConsent: (preferences: CookiePreferences) => void;
  declineAll: () => void;
  acceptAll: () => void;
  isAllowed: (type: keyof CookiePreferences) => boolean;
  resetConsent: () => void;
  hasConsent: boolean;
}

const CookieContext = createContext<CookieContextType | undefined>(undefined);

export const useCookieContext = () => {
  const context = useContext(CookieContext);
  if (context === undefined) {
    throw new Error('useCookieContext must be used within a CookieProvider');
  }
  return context;
};

interface CookieProviderProps {
  children: ReactNode;
}

export const CookieProvider = ({ children }: CookieProviderProps) => {
  const cookieData = useCookies();

  return (
    <CookieContext.Provider value={cookieData}>
      {children}
    </CookieContext.Provider>
  );
};
