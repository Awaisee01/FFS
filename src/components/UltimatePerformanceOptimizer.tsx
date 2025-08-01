import { useEffect } from 'react';

interface UltimatePerformanceOptimizerProps {
  children: React.ReactNode;
}

/**
 * Ultimate Performance Optimizer - Designed for 100% Lighthouse Score
 * Consolidates all performance optimizations into one efficient component
 */
export function UltimatePerformanceOptimizer({ children }: UltimatePerformanceOptimizerProps) {
  useEffect(() => {
    // ===== CRITICAL: LCP OPTIMIZATION (Most Important for 100% Score) =====
    const optimizeLCP = () => {
      // 1. Mark any existing hero images as high priority
      const heroImages = document.querySelectorAll('img[src*="1932c2a7"], img[src*="AerialTown"]') as NodeListOf<HTMLImageElement>;
      heroImages.forEach(heroImage => {
        if (heroImage) {
          heroImage.setAttribute('fetchpriority', 'high');
          heroImage.setAttribute('loading', 'eager');
          heroImage.setAttribute('decoding', 'async');
          heroImage.style.contentVisibility = 'visible';
        }
      });

      // 2. Optimize font loading
      const criticalFonts = document.querySelectorAll('link[href*="fonts.googleapis.com"]');
      criticalFonts.forEach(font => {
        const element = font as HTMLLinkElement;
        if (element.rel === 'preload') {
          element.rel = 'stylesheet';
        }
      });

      // 3. Mark critical resources
      if (typeof window !== 'undefined' && 'performance' in window && 'mark' in performance) {
        performance.mark('lcp-optimization-complete');
      }
    };

    // ===== FID OPTIMIZATION (Input Delay) =====
    const optimizeFID = () => {
      // Use passive listeners for better responsiveness
      const passiveEvents = ['scroll', 'touchstart', 'touchmove', 'wheel'];
      passiveEvents.forEach(event => {
        document.addEventListener(event, () => {}, { passive: true, once: true });
      });

      // Defer heavy analytics until after user interaction
      let analyticsDeferred = false;
      const deferAnalytics = () => {
        if (analyticsDeferred) return;
        analyticsDeferred = true;
        
        // Minimize analytics impact by batching
        if (typeof window !== 'undefined' && (window as any).fbq) {
          // Reduce Facebook Pixel frequency
          const originalFbq = (window as any).fbq;
          (window as any).fbq = (...args: any[]) => {
            requestIdleCallback(() => originalFbq.apply(null, args));
          };
        }
      };

      // Defer analytics after first interaction or 5 seconds
      ['click', 'keydown', 'touchstart'].forEach(event => {
        document.addEventListener(event, deferAnalytics, { once: true });
      });
      setTimeout(deferAnalytics, 5000);
    };

    // ===== CLS OPTIMIZATION (Layout Stability) =====
    const optimizeCLS = () => {
      // Ensure all images have proper dimensions
      const images = document.querySelectorAll('img:not([width]):not([height])');
      images.forEach((img: HTMLImageElement) => {
        if (!img.style.aspectRatio) {
          img.style.aspectRatio = '16/9';
          img.style.objectFit = 'cover';
        }
      });

      // Prevent layout shifts from forms
      const forms = document.querySelectorAll('form');
      forms.forEach((form: HTMLFormElement) => {
        if (!form.style.minHeight) {
          form.style.minHeight = '400px';
          form.style.contain = 'layout';
        }
      });

      // Reserve space for dynamic content
      const containers = document.querySelectorAll('[data-dynamic-content]');
      containers.forEach((container: HTMLElement) => {
        container.style.minHeight = container.style.minHeight || '200px';
      });
    };

    // ===== NETWORK OPTIMIZATION =====
    const optimizeNetwork = () => {
      // Reduce analytics network requests
      const analytics = document.querySelectorAll('script[src*="analytics"], script[src*="gtag"], script[src*="fbevents"]');
      analytics.forEach((script: HTMLScriptElement) => {
        script.setAttribute('defer', '');
        script.setAttribute('async', '');
      });

      // Optimize prefetch strategy - only critical resources
      const existingPrefetch = document.querySelectorAll('link[rel="prefetch"]');
      existingPrefetch.forEach(link => {
        if (!link.getAttribute('href')?.includes('eco4')) {
          link.remove(); // Remove non-critical prefetches
        }
      });
    };

    // ===== EXECUTION STRATEGY =====
    // Execute immediately for critical optimizations
    optimizeLCP();
    optimizeCLS();

    // Use RAF for non-critical optimizations
    requestAnimationFrame(() => {
      optimizeFID();
      optimizeNetwork();
    });

    // ===== PERFORMANCE MONITORING =====
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry) => {
            if (entry.entryType === 'largest-contentful-paint') {
              const lcp = entry.startTime;
              console.log(`🎯 LCP: ${lcp.toFixed(0)}ms ${lcp < 2500 ? '✅' : '❌ (Target: <2500ms)'}`);
            }
            if (entry.entryType === 'first-input') {
              const fid = (entry as any).processingStart - entry.startTime;
              console.log(`⚡ FID: ${fid.toFixed(0)}ms ${fid < 100 ? '✅' : '❌ (Target: <100ms)'}`);
            }
            if (entry.entryType === 'layout-shift' && (entry as any).value > 0) {
              console.log(`📐 CLS shift: ${(entry as any).value.toFixed(3)}`);
            }
          });
        });

        observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });

        // Cleanup observer after 10 seconds
        setTimeout(() => observer.disconnect(), 10000);

        return () => observer.disconnect();
      } catch (error) {
        console.warn('Performance monitoring not available');
      }
    }
  }, []);

  return <>{children}</>;
}

export default UltimatePerformanceOptimizer;