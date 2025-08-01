import { useState, useEffect } from 'react';

interface OptimizedHeroImageProps {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}

const OptimizedHeroImage = ({ 
  src, 
  alt, 
  className = "", 
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  priority = false 
}: OptimizedHeroImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentSrc, setCurrentSrc] = useState('');

  // Generate responsive image URLs
  const generateResponsiveUrls = (originalSrc: string) => {
    const baseName = originalSrc.split('.')[0];
    const extension = originalSrc.split('.').pop();
    
    return {
      webp: {
        mobile: `${baseName}-mobile.webp`,
        tablet: `${baseName}-tablet.webp`, 
        desktop: `${baseName}-desktop.webp`
      },
      fallback: {
        mobile: `${baseName}-mobile.${extension}`,
        tablet: `${baseName}-tablet.${extension}`,
        desktop: `${baseName}-desktop.${extension}`
      }
    };
  };

  useEffect(() => {
    const urls = generateResponsiveUrls(src);
    
    // Progressive loading strategy
    const loadImage = async () => {
      try {
        // Check if browser supports WebP
        const supportsWebP = await checkWebPSupport();
        
        // Select appropriate image based on screen size
        const screenWidth = window.innerWidth;
        let selectedUrl = '';
        
        if (screenWidth <= 768) {
          selectedUrl = supportsWebP ? urls.webp.mobile : urls.fallback.mobile;
        } else if (screenWidth <= 1200) {
          selectedUrl = supportsWebP ? urls.webp.tablet : urls.fallback.tablet;
        } else {
          selectedUrl = supportsWebP ? urls.webp.desktop : urls.fallback.desktop;
        }
        
        // Preload the image
        const img = new Image();
        img.onload = () => {
          setCurrentSrc(selectedUrl);
          setIsLoaded(true);
        };
        img.onerror = () => {
          // Fallback to original if optimized version fails
          setCurrentSrc(src);
          setIsLoaded(true);
        };
        img.src = selectedUrl;
        
      } catch (error) {
        // Fallback to original
        setCurrentSrc(src);
        setIsLoaded(true);
      }
    };

    loadImage();
  }, [src]);

  // Check WebP support
  const checkWebPSupport = (): Promise<boolean> => {
    return new Promise((resolve) => {
      const webP = new Image();
      webP.onload = webP.onerror = () => {
        resolve(webP.height === 2);
      };
      webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
    });
  };

  return (
    <div className={`${className} ${isLoaded ? 'loaded' : 'loading'}`}>
      {currentSrc && (
        <picture>
          <source
            srcSet={`${currentSrc.replace(/\.(jpg|jpeg|png)$/, '.webp')}`}
            type="image/webp"
            sizes={sizes}
          />
          <img
            src={currentSrc}
            alt={alt}
            loading={priority ? 'eager' : 'lazy'}
            fetchPriority={priority ? 'high' : 'low'}
            decoding={priority ? 'sync' : 'async'}
            sizes={sizes}
            className="w-full h-full object-cover transition-opacity duration-300"
            style={{
              opacity: isLoaded ? 1 : 0,
              backgroundColor: '#e5e7eb' // Loading background
            }}
          />
        </picture>
      )}
      
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};

export default OptimizedHeroImage;