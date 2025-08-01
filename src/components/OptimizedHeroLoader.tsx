import { useEffect, useState } from 'react';

interface OptimizedHeroLoaderProps {
  children: React.ReactNode;
}

/**
 * Optimized Hero Loader - Ensures hero section loads as fast as possible for LCP
 */
export const OptimizedHeroLoader = ({ children }: OptimizedHeroLoaderProps) => {
  const [isOptimized, setIsOptimized] = useState(false);

  useEffect(() => {
    // Critical path optimization for hero section
    const optimizeHeroLoading = () => {
      // Mark hero content as critical for rendering (no duplicate preloads)
      const heroSections = document.querySelectorAll('section, .hero-section, [data-hero]');
      heroSections.forEach((section: Element) => {
        const element = section as HTMLElement;
        element.style.contentVisibility = 'visible';
        element.style.contain = '';
      });
      
      setIsOptimized(true);
    };
    
    // Run immediately for fastest LCP
    optimizeHeroLoading();
    
    // Fallback for dynamic content
    const timer = setTimeout(optimizeHeroLoading, 100);
    
    return () => clearTimeout(timer);
  }, []);

  return <>{children}</>;
};

export default OptimizedHeroLoader;