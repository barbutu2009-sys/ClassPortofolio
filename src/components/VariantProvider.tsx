'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { VariantId, SiteVariant, resolveVariant, getVariantStyle } from '@/lib/variants';

interface VariantContextType {
  variantId: VariantId;
  currentVariant: SiteVariant;
  setVariantId: (id: VariantId) => void;
}

const VariantContext = createContext<VariantContextType | undefined>(undefined);

export function VariantProvider({ children }: { children: React.ReactNode }) {
  const [variantId, setVariantId] = useState<VariantId>('ember');

  useEffect(() => {
    const saved = localStorage.getItem('theme-variant') as VariantId;
    if (saved) {
      const resolved = resolveVariant(saved);
      setVariantId(resolved.id);
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', variantId);
    localStorage.setItem('theme-variant', variantId);
    
    // Apply CSS variables to document root
    const variant = resolveVariant(variantId);
    const styles = getVariantStyle(variant);
    Object.entries(styles).forEach(([key, value]) => {
      if (value) {
        document.documentElement.style.setProperty(key, value as string);
      }
    });
  }, [variantId]);

  const currentVariant = resolveVariant(variantId);

  return (
    <VariantContext.Provider value={{ variantId, currentVariant, setVariantId }}>
      <div style={getVariantStyle(currentVariant)} className="min-h-screen">
        {children}
      </div>
    </VariantContext.Provider>
  );
}

export function useVariant() {
  const context = useContext(VariantContext);
  if (!context) throw new Error('useVariant must be used within a VariantProvider');
  return context;
}
