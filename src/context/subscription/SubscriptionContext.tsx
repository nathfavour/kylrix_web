'use client';

import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { 
  SubscriptionTier, 
  PaymentMethod, 
  RegionConfig, 
  PPP_DATA, 
  calculateSubscriptionPrice 
} from '@/lib/subscription/ppp';
import { getCurrentUser } from '@/lib/appwrite';

interface SubscriptionState {
  currentTier: SubscriptionTier | 'FREE';
  detectedRegion: RegionConfig & { countryCode: string };
  paymentMethod: PaymentMethod;
  isLoading: boolean;
  prices: Record<SubscriptionTier, number>;
  exchangeRates: Record<string, number>;
  setPaymentMethod: (method: PaymentMethod) => void;
  setRegion: (countryCode: string) => void;
  refreshPrices: () => void;
}

const SubscriptionContext = createContext<SubscriptionState | undefined>(undefined);

export function SubscriptionProvider({ 
  children,
  endpoint: _endpoint = 'https://fra.cloud.appwrite.io/v1',
  projectId: _projectId = '67fe9627001d97e37ef3'
}: { 
  children: React.ReactNode,
  endpoint?: string,
  projectId?: string
}) {
  const [currentTier, setCurrentTier] = useState<SubscriptionTier | 'FREE'>('FREE');
  const [regionCode, setRegionCode] = useState<string>('DEFAULT');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CRYPTO');
  const [isLoading, setIsLoading] = useState(true);
  const [exchangeRates, setExchangeRates] = useState<Record<string, number>>({ USD: 1 });

  const detectedRegion = useMemo(() => {
    const data = PPP_DATA[regionCode] || PPP_DATA.DEFAULT;
    return { ...data, countryCode: regionCode === 'DEFAULT' ? 'US' : regionCode };
  }, [regionCode]);

  // Fetch exchange rates
  useEffect(() => {
    const fetchRates = async () => {
      try {
        const res = await fetch('https://api.frankfurter.dev/v1/latest?base=USD');
        const data = await res.json();
        if (data.rates) {
          setExchangeRates({ USD: 1, ...data.rates });
        }
      } catch (e) {
        console.error('Failed to fetch exchange rates', e);
      }
    };
    fetchRates();
  }, []);

  const prices = useMemo(() => ({
    PRO: calculateSubscriptionPrice('PRO', regionCode, paymentMethod),
  }), [regionCode, paymentMethod]);

  useEffect(() => {
    const initSubscription = async () => {
      try {
        const currentUser = await getCurrentUser();
        const prefs = currentUser?.prefs || {};
        if (prefs?.tier) setCurrentTier(prefs.tier as SubscriptionTier);
        if (prefs?.region && PPP_DATA[prefs.region]) setRegionCode(prefs.region);
        else {
          const res = await fetch('https://ipapi.co/json/');
          const data = await res.json();
          if (data.country_code && PPP_DATA[data.country_code]) setRegionCode(data.country_code);
        }
      } catch (e) {
        try {
          const res = await fetch('https://ipapi.co/json/');
          const data = await res.json();
          if (data.country_code && PPP_DATA[data.country_code]) setRegionCode(data.country_code);
        } catch (ipErr) {}
      } finally {
        setIsLoading(false);
      }
    };
    initSubscription();
  }, []);

  const value: SubscriptionState = {
    currentTier,
    detectedRegion,
    paymentMethod,
    isLoading,
    prices,
    exchangeRates,
    setPaymentMethod,
    setRegion: setRegionCode,
    refreshPrices: () => {},
  };

  return <SubscriptionContext.Provider value={value}>{children}</SubscriptionContext.Provider>;
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (!context) throw new Error('useSubscription must be used within a SubscriptionProvider');
  return context;
}
