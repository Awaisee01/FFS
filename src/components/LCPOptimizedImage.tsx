// LCP Optimized Image Component for Lighthouse Performance
import { useState, useCallback, useRef, useEffect } from 'react';

interface LCPOptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  className?: string;
  sizes?: string;
  loading?: 'lazy' | 'eager';
  decoding?: 'async' | 'auto' | 'sync';
  fetchPriority?: 'high' | 'low' | 'auto';
}

const LCPOptimizedImage: React.FC<LCPOptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  priority = false,
  className = '',
  sizes = '100vw',
  loading = priority ? 'eager' : 'lazy',
  decoding = 'async',
  fetchPriority = priority ? 'high' : 'auto'
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    
    // Mark LCP candidate for performance monitoring
    if (priority && 'performance' in window && 'mark' in performance) {
      performance.mark('lcp-image-loaded');
    }
  }, [priority]);

  const handleError = useCallback(() => {
    setHasError(true);
    console.warn('LCP image failed to load:', src);
  }, [src]);

  // Preload critical images
  useEffect(() => {
    if (priority && src) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      link.fetchPriority = 'high';
      document.head.appendChild(link);
      
      return () => {
        document.head.removeChild(link);
      };
    }
  }, [src, priority]);

  // Fallback for broken images
  if (hasError) {
    return (
      <div 
        className={`${className} bg-gray-200 flex items-center justify-center`}
        style={{ width, height }}
      >
        <span className="text-gray-500 text-sm">Image unavailable</span>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Skeleton loader for non-priority images */}
      {!priority && !isLoaded && (
        <div 
          className={`absolute inset-0 bg-gray-200 animate-pulse ${className}`}
          style={{ width, height }}
        />
      )}
      
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        decoding={decoding}
        fetchPriority={fetchPriority}
        sizes={sizes}
        className={`${className} ${!isLoaded && !priority ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        onLoad={handleLoad}
        onError={handleError}
        style={{
          // Prevent layout shift
          aspectRatio: width && height ? `${width} / ${height}` : undefined,
          objectFit: 'cover',
          objectPosition: 'center',
          // Critical rendering optimizations
          willChange: isLoaded ? 'auto' : 'opacity',
          containIntrinsicSize: width && height ? `${width}px ${height}px` : undefined
        }}
      />
      
      {/* Additional performance hints for LCP images */}
      {priority && !isLoaded && (
        <div 
          className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100"
          style={{ width, height }}
        />
      )}
    </div>
  );
};

export default LCPOptimizedImage;