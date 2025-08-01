import { useEffect, useRef, useState } from 'react';

interface LazySectionProps {
  children: React.ReactNode;
  className?: string;
  threshold?: number;
  rootMargin?: string;
  fallback?: React.ReactNode;
}

const LazySection = ({ 
  children, 
  className = '', 
  threshold = 0.1, 
  rootMargin = '50px',
  fallback
}: LazySectionProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(element);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [threshold, rootMargin]);

  return (
    <div ref={ref} className={`lazy-section ${className}`}>
      {isVisible ? (
        <div className="lazy-load loaded">
          {children}
        </div>
      ) : (
        fallback || (
          <div className="lazy-load">
            <div className="skeleton h-32 w-full bg-gray-200 animate-pulse rounded" />
          </div>
        )
      )}
    </div>
  );
};

export default LazySection;