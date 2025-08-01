import React from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  responsive?: boolean;
  sizes?: string;
  preload?: boolean;
  style?: React.CSSProperties;
  fetchPriority?: 'high' | 'low' | 'auto';
  decoding?: 'async' | 'sync' | 'auto';
  srcSet?: string;
  modernFormats?: boolean;
}

const OptimizedImage = ({ 
  src, 
  alt,
  className = '',
  width,
  height,
  priority = false,
  sizes,
  fetchPriority = 'auto',
  decoding = 'async',
  style,
  srcSet,
  modernFormats = true
}: OptimizedImageProps) => {
  const getModernSrc = (originalSrc: string) => {
    if (!modernFormats) return originalSrc;
    
    // Convert to WebP if it's a PNG/JPG and we want modern formats
    if (originalSrc.includes('.png') || originalSrc.includes('.jpg') || originalSrc.includes('.jpeg')) {
      return originalSrc.replace(/\.(png|jpg|jpeg)$/i, '.webp');
    }
    return originalSrc;
  };

  const generateSrcSet = (originalSrc: string) => {
    if (srcSet) return srcSet;
    
    // Generate responsive srcSet for different viewport sizes
    const baseSrc = getModernSrc(originalSrc);
    if (width && width > 768) {
      return [
        `${baseSrc} ${width}w`,
        `${baseSrc.replace('.webp', '-medium.webp')} ${Math.round(width * 0.75)}w`,
        `${baseSrc.replace('.webp', '-small.webp')} ${Math.round(width * 0.5)}w`
      ].join(', ');
    }
    return undefined;
  };

  return (
    <picture>
      {modernFormats && (
        <>
          <source 
            srcSet={generateSrcSet(src)} 
            type="image/webp" 
            sizes={sizes}
          />
          <source 
            srcSet={generateSrcSet(src.replace('.webp', '.avif'))} 
            type="image/avif" 
            sizes={sizes}
          />
        </>
      )}
      <img
        src={getModernSrc(src)}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : fetchPriority}
        decoding={decoding}
        sizes={sizes}
        className={className}
        style={style}
        srcSet={generateSrcSet(src)}
      />
    </picture>
  );
};

export default OptimizedImage;