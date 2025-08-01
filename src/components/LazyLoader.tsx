import { Suspense, lazy, ComponentType } from 'react';

interface LazyLoaderProps {
  factory: () => Promise<{ default: ComponentType<any> }>;
  fallback?: React.ReactNode;
  children?: React.ReactNode;
  delay?: number;
}

// Enhanced lazy loader with optional delay for better performance
export const LazyLoader = ({ 
  factory, 
  fallback = <div className="h-16 bg-gray-100 animate-pulse rounded"></div>,
  delay = 0
}: LazyLoaderProps) => {
  const LazyComponent = lazy(() => {
    if (delay > 0) {
      return new Promise<{ default: ComponentType<any> }>(resolve => {
        setTimeout(() => {
          factory().then(resolve);
        }, delay);
      });
    }
    return factory();
  });

  return (
    <Suspense fallback={fallback}>
      <LazyComponent />
    </Suspense>
  );
};

// Preload function for critical resources
export const preloadComponent = (factory: () => Promise<{ default: ComponentType<any> }>) => {
  // Start loading the component in the background without blocking
  factory().catch(() => {
    // Silently handle preload failures
  });
};

export default LazyLoader;