import { useEffect } from 'react';

interface SEOData {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: string;
  ogUrl?: string;
  ogSiteName?: string;
  ogLocale?: string;
  twitterCard?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  noindex?: boolean;
}

export const useSEO = (data: SEOData) => {
  useEffect(() => {
    // Update or create title
    if (data.title) {
      document.title = data.title;
    }

    // Helper function to update or create meta tag
    const updateMetaTag = (nameOrProperty: string, content: string, isProperty = false) => {
      if (!content) return;
      
      const selector = isProperty ? `property="${nameOrProperty}"` : `name="${nameOrProperty}"`;
      let meta = document.querySelector(`meta[${selector}]`) as HTMLMetaElement;
      
      if (!meta) {
        meta = document.createElement('meta');
        if (isProperty) {
          meta.setAttribute('property', nameOrProperty);
        } else {
          meta.setAttribute('name', nameOrProperty);
        }
        document.head.appendChild(meta);
      }
      
      meta.setAttribute('content', content);
    };

    // Helper function to update or create link tag
    const updateLinkTag = (rel: string, href: string) => {
      if (!href) return;
      
      let link = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;
      
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', rel);
        document.head.appendChild(link);
      }
      
      link.setAttribute('href', href);
    };

    // Basic meta tags
    if (data.description) {
      updateMetaTag('description', data.description);
    }
    
    if (data.keywords) {
      updateMetaTag('keywords', data.keywords);
    }
    
    updateMetaTag('author', 'Aerion Technologies');

    // Canonical URL
    if (data.canonical) {
      updateLinkTag('canonical', data.canonical);
    }

    // Open Graph tags
    if (data.ogType) updateMetaTag('og:type', data.ogType, true);
    if (data.ogUrl) updateMetaTag('og:url', data.ogUrl, true);
    if (data.ogTitle) updateMetaTag('og:title', data.ogTitle, true);
    if (data.ogDescription) updateMetaTag('og:description', data.ogDescription, true);
    if (data.ogImage) {
      const fullImageUrl = data.ogImage.startsWith('http') 
        ? data.ogImage 
        : `https://aerion.com.br${data.ogImage}`;
      updateMetaTag('og:image', fullImageUrl, true);
    }
    if (data.ogSiteName) updateMetaTag('og:site_name', data.ogSiteName, true);
    if (data.ogLocale) updateMetaTag('og:locale', data.ogLocale, true);

    // Twitter Card tags
    if (data.twitterCard) updateMetaTag('twitter:card', data.twitterCard);
    if (data.twitterTitle) updateMetaTag('twitter:title', data.twitterTitle);
    if (data.twitterDescription) updateMetaTag('twitter:description', data.twitterDescription);
    if (data.twitterImage) {
      const fullImageUrl = data.twitterImage.startsWith('http')
        ? data.twitterImage
        : `https://aerion.com.br${data.twitterImage}`;
      updateMetaTag('twitter:image', fullImageUrl);
    }

    // Robots
    if (data.noindex) {
      updateMetaTag('robots', 'noindex, nofollow');
    }

    // Cleanup function - remove meta tags that were added dynamically
    // Note: We don't remove all meta tags as some might be from index.html
    // Only remove if they were dynamically added in this effect
    return () => {
      // Title will be handled by React Router or next page's SEO
      // Meta tags will be replaced by next page's SEO
    };
  }, [data]);
};

