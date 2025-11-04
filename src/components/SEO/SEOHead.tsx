import React from 'react';
import { useSEO } from '@/hooks/useSEO';

interface SEOHeadProps {
  title: string;
  description: string;
  keywords?: string;
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'product';
  twitterCard?: 'summary' | 'summary_large_image';
  noindex?: boolean;
}

export const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  keywords,
  canonical,
  ogTitle,
  ogDescription,
  ogImage = '/images/logos/autel-logo.png',
  ogType = 'website',
  twitterCard = 'summary_large_image',
  noindex = false,
}) => {
  const fullTitle = title;
  const fullCanonical = canonical || (typeof window !== 'undefined' ? `https://aerion.com.br${window.location.pathname}` : 'https://aerion.com.br');

  // Use the custom SEO hook
  useSEO({
    title: fullTitle,
    description,
    keywords,
    canonical: fullCanonical,
    ogTitle: ogTitle || fullTitle,
    ogDescription: ogDescription || description,
    ogImage,
    ogType,
    ogUrl: fullCanonical,
    ogSiteName: 'Aerion Technologies',
    ogLocale: 'pt_BR',
    twitterCard,
    twitterTitle: ogTitle || fullTitle,
    twitterDescription: ogDescription || description,
    twitterImage: ogImage,
    noindex,
  });

  // This component doesn't render anything, it just updates the head via the hook
  return null;
};


