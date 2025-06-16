// src/components/FacebookPixelProvider.tsx
'use client';

import { useFacebookPixelInit } from '@/lib/facebook-hooks';

interface FacebookPixelProviderProps {
  children: React.ReactNode;
}

export default function FacebookPixelProvider({ children }: FacebookPixelProviderProps) {
  // تحميل Facebook Pixel تلقائياً
  useFacebookPixelInit();
  
  return <>{children}</>;
}