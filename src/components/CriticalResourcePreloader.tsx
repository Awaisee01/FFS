import { useEffect } from 'react';

/**
 * Preloads only the most critical resources for immediate page needs
 * Focuses on resources that directly impact LCP and FCP
 */
export const CriticalResourcePreloader = () => {
  useEffect(() => {
    const preloadCriticalResources = () => {
      // Only preload resources for the current page to avoid wasting bandwidth
      const currentPath = window.location.pathname;
      
      // Preload critical images based on current route
      const imagesToPreload: string[] = [];
      
      if (currentPath === '/' || currentPath === '/index') {
        // Homepage hero image
        imagesToPreload.push('/lovable-uploads/1932c2a7-9b3e-46a2-8e62-d0fabe9d2ade.png');
      } else if (currentPath === '/eco4') {
        // ECO4 hero image
        imagesToPreload.push('/lovable-uploads/1932c2a7-9b3e-46a2-8e62-d0fabe9d2ade.png');
      } else if (currentPath === '/solar') {
        // Solar hero image
        imagesToPreload.push('/lovable-uploads/602ec2e7-cda6-46d7-9da5-0dbdb581a74b.png');
      }
      
      // Preload only critical images
      imagesToPreload.forEach((src, index) => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        link.fetchPriority = 'high';
        
        // Add to head immediately
        document.head.appendChild(link);
        
        // Clean up after 30 seconds if not used
        setTimeout(() => {
          if (document.head.contains(link)) {
            document.head.removeChild(link);
          }
        }, 30000);
      });
      
      // Preload critical next pages based on user likely journey
      if (currentPath === '/') {
        // From homepage, users likely go to ECO4
        const eco4Link = document.createElement('link');
        eco4Link.rel = 'prefetch';
        eco4Link.href = '/eco4';
        document.head.appendChild(eco4Link);
      }
    };
    
    // Execute immediately for fastest loading
    preloadCriticalResources();
  }, []);

  return null;
};

export default CriticalResourcePreloader;