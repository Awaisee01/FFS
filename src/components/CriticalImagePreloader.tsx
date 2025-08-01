import { useEffect } from 'react';

interface CriticalImagePreloaderProps {
  imagePath: string;
  priority?: 'high' | 'low';
  as?: 'image' | 'fetch';
}

/**
 * Critical Image Preloader - Only preloads images that will be visible immediately
 * Helps optimize LCP by ensuring critical images load as early as possible
 */
export const CriticalImagePreloader = ({ 
  imagePath, 
  priority = 'high',
  as = 'image'
}: CriticalImagePreloaderProps) => {
  useEffect(() => {
    // Only preload if the image will be visible above the fold
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = as;
    link.href = imagePath;
    if (priority) {
      link.setAttribute('fetchpriority', priority);
    }
    
    // Add to head and clean up on unmount
    document.head.appendChild(link);
    
    return () => {
      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
    };
  }, [imagePath, priority, as]);

  return null; // This component doesn't render anything
};

export default CriticalImagePreloader;