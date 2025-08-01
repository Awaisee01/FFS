// Advanced performance optimization for pixel tracking
import { getAdvancedTracker } from './advanced-pixel-tracking';

interface PerformanceMetrics {
  renderTime: number;
  interactionDelay: number;
  memoryUsage: number;
  networkLatency: number;
  pixelLoadTime: number;
}

class PerformanceOptimizer {
  private metrics: PerformanceMetrics = {
    renderTime: 0,
    interactionDelay: 0,
    memoryUsage: 0,
    networkLatency: 0,
    pixelLoadTime: 0
  };

  private observer: PerformanceObserver | null = null;
  private isTracking: boolean = false;

  constructor() {
    this.initializePerformanceTracking();
  }

  private initializePerformanceTracking(): void {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) return;

    // Track Largest Contentful Paint (LCP)
    this.observePerformanceEntry('largest-contentful-paint', (entries) => {
      const lcp = entries[entries.length - 1];
      this.trackLCPOptimization(lcp.startTime);
    });

    // Track First Input Delay (FID)
    this.observePerformanceEntry('first-input', (entries) => {
      entries.forEach(entry => {
        this.metrics.interactionDelay = entry.processingStart - entry.startTime;
        this.trackFIDOptimization(this.metrics.interactionDelay);
      });
    });

    // Track Cumulative Layout Shift (CLS)
    this.observePerformanceEntry('layout-shift', (entries) => {
      const cls = entries.reduce((sum, entry) => sum + entry.value, 0);
      this.trackCLSOptimization(cls);
    });

    // Track resource loading performance (rate limited)
    this.observePerformanceEntry('resource', (entries) => {
      entries.forEach(entry => {
        if ((entry.name.includes('facebook') || entry.name.includes('fbevents')) && !this.isTracking) {
          this.isTracking = true; // Prevent duplicate tracking
          this.metrics.pixelLoadTime = entry.responseEnd - entry.startTime;
          this.trackPixelLoadPerformance();
          
          // Reset tracking flag after 30 seconds
          setTimeout(() => {
            this.isTracking = false;
          }, 30000);
        }
      });
    });

    // Monitor memory usage
    this.trackMemoryUsage();

    // Track Core Web Vitals
    this.trackCoreWebVitals();
  }

  private observePerformanceEntry(type: string, callback: (entries: any[]) => void): void {
    try {
      const observer = new PerformanceObserver((list) => {
        callback(list.getEntries());
      });
      observer.observe({ type, buffered: true });
    } catch (error) {
      console.warn(`Failed to observe ${type}:`, error);
    }
  }

  private trackLCPOptimization(lcpTime: number): void {
    const tracker = getAdvancedTracker();
    if (!tracker) return;

    let performanceGrade = 'good';
    if (lcpTime > 4000) performanceGrade = 'poor';
    else if (lcpTime > 2500) performanceGrade = 'needs_improvement';

    tracker.trackEvent('LCPPerformance', {
      content_name: 'Largest Contentful Paint',
      content_category: 'performance',
      lcp_time: lcpTime,
      performance_grade: performanceGrade,
      value: Math.max(1, Math.round(5000 / lcpTime)) // Higher value for better performance
    });
  }

  private trackFIDOptimization(fidTime: number): void {
    const tracker = getAdvancedTracker();
    if (!tracker) return;

    let performanceGrade = 'good';
    if (fidTime > 300) performanceGrade = 'poor';
    else if (fidTime > 100) performanceGrade = 'needs_improvement';

    tracker.trackEvent('FIDPerformance', {
      content_name: 'First Input Delay',
      content_category: 'performance',
      fid_time: fidTime,
      performance_grade: performanceGrade,
      value: Math.max(1, Math.round(1000 / (fidTime + 1)))
    });
  }

  private trackCLSOptimization(clsScore: number): void {
    const tracker = getAdvancedTracker();
    if (!tracker) return;

    let performanceGrade = 'good';
    if (clsScore > 0.25) performanceGrade = 'poor';
    else if (clsScore > 0.1) performanceGrade = 'needs_improvement';

    tracker.trackEvent('CLSPerformance', {
      content_name: 'Cumulative Layout Shift',
      content_category: 'performance',
      cls_score: clsScore,
      performance_grade: performanceGrade,
      value: Math.max(1, Math.round(100 / (clsScore * 100 + 1)))
    });
  }

  private trackPixelLoadPerformance(): void {
    const tracker = getAdvancedTracker();
    if (!tracker) return;

    tracker.trackEvent('PixelLoadPerformance', {
      content_name: 'Facebook Pixel Load Time',
      content_category: 'performance',
      load_time: this.metrics.pixelLoadTime,
      performance_impact: this.metrics.pixelLoadTime > 1000 ? 'high' : 'low',
      value: Math.max(1, Math.round(2000 / this.metrics.pixelLoadTime))
    });
  }

  private trackMemoryUsage(): void {
    if (!('memory' in performance)) return;

    const memoryInfo = (performance as any).memory;
    this.metrics.memoryUsage = memoryInfo.usedJSHeapSize / 1024 / 1024; // Convert to MB

    const tracker = getAdvancedTracker();
    if (tracker) {
      tracker.trackEvent('MemoryUsage', {
        content_name: 'JavaScript Memory Usage',
        content_category: 'performance',
        memory_used_mb: this.metrics.memoryUsage,
        memory_limit_mb: memoryInfo.jsHeapSizeLimit / 1024 / 1024,
        memory_usage_percentage: (memoryInfo.usedJSHeapSize / memoryInfo.jsHeapSizeLimit) * 100,
        value: 1
      });
    }
  }

  private trackCoreWebVitals(): void {
    // Track when Core Web Vitals thresholds are met
    setTimeout(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const paintEntries = performance.getEntriesByType('paint');
      
      const ttfb = navigation.responseStart - navigation.requestStart;
      const fcp = paintEntries.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0;
      
      const tracker = getAdvancedTracker();
      if (tracker) {
        tracker.trackEvent('CoreWebVitals', {
          content_name: 'Core Web Vitals Summary',
          content_category: 'performance',
          ttfb: ttfb,
          fcp: fcp,
          overall_performance_score: this.calculateOverallScore(ttfb, fcp),
          value: 5
        });
      }
    }, 3000);
  }

  private calculateOverallScore(ttfb: number, fcp: number): number {
    let score = 100;
    
    // Deduct points for poor TTFB
    if (ttfb > 800) score -= 30;
    else if (ttfb > 600) score -= 20;
    else if (ttfb > 400) score -= 10;
    
    // Deduct points for poor FCP
    if (fcp > 3000) score -= 30;
    else if (fcp > 1800) score -= 20;
    else if (fcp > 1000) score -= 10;
    
    return Math.max(0, score);
  }

  // Optimize pixel loading
  public optimizePixelLoading(): void {
    if (typeof window === 'undefined') return;

    // Preload Facebook Pixel with high priority
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = 'https://connect.facebook.net/en_US/fbevents.js';
    link.as = 'script';
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);

    // Preconnect to Facebook domains
    const preconnectDomains = [
      'https://www.facebook.com',
      'https://connect.facebook.net',
      'https://graph.facebook.com'
    ];

    preconnectDomains.forEach(domain => {
      const preconnect = document.createElement('link');
      preconnect.rel = 'preconnect';
      preconnect.href = domain;
      preconnect.crossOrigin = 'anonymous';
      document.head.appendChild(preconnect);
    });
  }

  // Lazy load non-critical tracking
  public enableLazyTracking(): void {
    // Use Intersection Observer for lazy loading
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Load additional tracking only when content is visible
            this.loadEnhancedTracking();
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });

      // Observe forms for enhanced tracking
      document.querySelectorAll('form').forEach(form => {
        observer.observe(form);
      });
    }
  }

  private loadEnhancedTracking(): void {
    const tracker = getAdvancedTracker();
    if (tracker) {
      tracker.trackEvent('EnhancedTrackingLoaded', {
        content_name: 'Enhanced Tracking Initialized',
        content_category: 'performance',
        load_trigger: 'intersection_observer',
        value: 1
      });
    }
  }

  // Resource prioritization
  public optimizeResourcePriority(): void {
    // Set pixel script to high priority
    const scripts = document.querySelectorAll('script[src*="fbevents"]');
    scripts.forEach(script => {
      script.setAttribute('fetchpriority', 'high');
    });

    // Defer non-critical scripts
    const nonCriticalScripts = document.querySelectorAll('script:not([src*="fbevents"]):not([src*="critical"])');
    nonCriticalScripts.forEach(script => {
      if (!script.hasAttribute('async') && !script.hasAttribute('defer')) {
        script.setAttribute('defer', '');
      }
    });
  }

  // Network optimization
  public optimizeNetworkRequests(): void {
    // Batch pixel events
    let eventBatch: any[] = [];
    const originalFbq = (window as any).fbq;

    if (originalFbq) {
      (window as any).fbq = (...args: any[]) => {
        eventBatch.push(args);
        
        // Flush batch after 100ms or when batch reaches 5 events
        if (eventBatch.length >= 5) {
          this.flushEventBatch(eventBatch, originalFbq);
          eventBatch = [];
        } else {
          setTimeout(() => {
            if (eventBatch.length > 0) {
              this.flushEventBatch(eventBatch, originalFbq);
              eventBatch = [];
            }
          }, 100);
        }
      };
    }
  }

  private flushEventBatch(batch: any[], originalFbq: Function): void {
    batch.forEach(args => {
      originalFbq.apply(window, args);
    });
  }

  // Performance monitoring dashboard
  public getPerformanceReport(): any {
    return {
      metrics: this.metrics,
      recommendations: this.generateRecommendations(),
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      connectionType: (navigator as any).connection?.effectiveType || 'unknown'
    };
  }

  private generateRecommendations(): string[] {
    const recommendations: string[] = [];

    if (this.metrics.renderTime > 2500) {
      recommendations.push('Consider optimizing render-blocking resources');
    }

    if (this.metrics.interactionDelay > 100) {
      recommendations.push('Reduce JavaScript execution time for better interactivity');
    }

    if (this.metrics.memoryUsage > 50) {
      recommendations.push('Monitor memory usage - high consumption detected');
    }

    if (this.metrics.pixelLoadTime > 1000) {
      recommendations.push('Optimize Facebook Pixel loading strategy');
    }

    return recommendations;
  }
}

// Global performance optimizer instance
let performanceOptimizer: PerformanceOptimizer | null = null;

export const initializePerformanceOptimizer = (): PerformanceOptimizer => {
  if (!performanceOptimizer && typeof window !== 'undefined') {
    performanceOptimizer = new PerformanceOptimizer();
    
    // Apply optimizations immediately
    performanceOptimizer.optimizePixelLoading();
    performanceOptimizer.enableLazyTracking();
    performanceOptimizer.optimizeResourcePriority();
    performanceOptimizer.optimizeNetworkRequests();
  }
  return performanceOptimizer!;
};

export const getPerformanceOptimizer = (): PerformanceOptimizer | null => performanceOptimizer;