import { useEffect, useRef } from 'react';

interface LCPOptimizerProps {
  children: React.ReactNode;
}

export function LCPOptimizer({ children }: LCPOptimizerProps) {
  const observerRef = useRef<PerformanceObserver | null>(null);

  useEffect(() => {
    // Mark LCP optimization start
    if ('performance' in window && 'mark' in performance) {
      performance.mark('lcp-optimizer-start');
    }

    // Observe LCP metric
    if ('PerformanceObserver' in window) {
      try {
        observerRef.current = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1] as PerformanceEntry;
          
          if (lastEntry.entryType === 'largest-contentful-paint') {
            const lcp = lastEntry.startTime;
            
            // Mark LCP complete
            if ('performance' in window && 'mark' in performance) {
              performance.mark('lcp-complete');
              performance.measure('lcp-duration', 'lcp-optimizer-start', 'lcp-complete');
            }
            
            // Disconnect observer after LCP
            if (observerRef.current) {
              observerRef.current.disconnect();
            }
          }
        });
        
        observerRef.current.observe({ entryTypes: ['largest-contentful-paint'] });
      } catch (error) {
        console.warn('PerformanceObserver not supported:', error);
      }
    }

    // Cleanup
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return <>{children}</>;
}

export default LCPOptimizer;