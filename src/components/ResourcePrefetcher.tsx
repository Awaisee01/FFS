import { useEffect } from 'react';

interface ResourcePrefetcherProps {
  currentPage: string;
  userBehavior?: {
    scrollDepth?: number;
    timeOnPage?: number;
    interactions?: number;
  };
}

// Intelligent resource prefetcher based on user behavior and page context
const ResourcePrefetcher = ({ currentPage, userBehavior = {} }: ResourcePrefetcherProps) => {
  useEffect(() => {
    // Delay prefetching to not interfere with critical rendering
    const timer = setTimeout(() => {
      prefetchBasedOnContext();
    }, 3000);

    return () => clearTimeout(timer);
  }, [currentPage]);

  const prefetchBasedOnContext = () => {
    // ECO4 page specific prefetching strategy
    if (currentPage === 'eco4') {
      const prefetchPlan = [
        // High-likelihood next pages based on user flow analytics
        { type: 'page', url: '/solar', priority: 'high', delay: 0 },
        { type: 'page', url: '/gas-boilers', priority: 'high', delay: 500 },
        { type: 'page', url: '/home-improvements', priority: 'medium', delay: 1000 },
        
        // Critical resources for likely next pages
        { type: 'image', url: '/lovable-uploads/597dfb86-407d-45a4-8ed9-bab0b1657c04.png', priority: 'low', delay: 2000 },
        { type: 'image', url: '/lovable-uploads/29502115-60f2-411e-928e-8d3f6c3383c7.png', priority: 'low', delay: 2500 },
        
        // Form submission domains
        { type: 'dns', url: 'https://nncpapnlnrtssbruzkla.supabase.co', priority: 'medium', delay: 1500 },
        { type: 'dns', url: 'https://script.google.com', priority: 'medium', delay: 1500 },
      ];

      prefetchPlan.forEach(resource => {
        setTimeout(() => {
          prefetchResource(resource.type, resource.url, resource.priority);
        }, resource.delay);
      });
    }

    // Behavioral prefetching - if user shows engagement signals
    if (userBehavior.scrollDepth && userBehavior.scrollDepth > 50) {
      // User is engaged, prefetch more aggressively
      setTimeout(() => {
        prefetchResource('page', '/contact', 'medium');
      }, 4000);
    }
  };

  const prefetchResource = (type: string, url: string, priority: string) => {
    try {
      const link = document.createElement('link');
      
      switch (type) {
        case 'page':
          link.rel = 'prefetch';
          link.href = url;
          break;
        case 'image':
          link.rel = 'prefetch';
          link.as = 'image';
          link.href = url;
          break;
        case 'dns':
          link.rel = 'dns-prefetch';
          link.href = url;
          break;
        default:
          return;
      }

      link.fetchPriority = priority as any;
      
      // Add resource hint if not already present
      const existing = document.querySelector(`link[href="${url}"]`);
      if (!existing) {
        document.head.appendChild(link);
      }
    } catch (error) {
      console.warn('Failed to prefetch resource:', url, error);
    }
  };

  return null; // This component doesn't render anything
};

export default ResourcePrefetcher;